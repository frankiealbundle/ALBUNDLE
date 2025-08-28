import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: ['*'],
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))
app.use('*', logger(console.log))

// Auth middleware
const requireAuth = async (c, next) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  c.set('user', user)
  await next()
}

// Routes prefix
const PREFIX = '/make-server-dd758888'

// Health check
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Auth routes
app.post(`${PREFIX}/auth/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    })
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString(),
      plan: 'free',
      projects: [],
      preferences: {
        notifications: true,
        theme: 'light'
      }
    })
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup processing error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Projects routes
app.get(`${PREFIX}/projects`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projects = await kv.getByPrefix(`project:${user.id}:`)
    
    return c.json({ projects: projects || [] })
  } catch (error) {
    console.log('Get projects error:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

app.post(`${PREFIX}/projects`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projectData = await c.req.json()
    
    const projectId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const project = {
      id: projectId,
      userId: user.id,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      tasks: [],
      collaborators: [user.id],
      tracks: projectData.tracks || []
    }
    
    await kv.set(`project:${user.id}:${projectId}`, project)
    
    // Update user's projects list
    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile) {
      userProfile.projects.push(projectId)
      await kv.set(`user:${user.id}`, userProfile)
    }
    
    return c.json({ project })
  } catch (error) {
    console.log('Create project error:', error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

app.get(`${PREFIX}/projects/:id`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projectId = c.req.param('id')
    
    const project = await kv.get(`project:${user.id}:${projectId}`)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    return c.json({ project })
  } catch (error) {
    console.log('Get project error:', error)
    return c.json({ error: 'Failed to fetch project' }, 500)
  }
})

app.put(`${PREFIX}/projects/:id`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projectId = c.req.param('id')
    const updates = await c.req.json()
    
    const project = await kv.get(`project:${user.id}:${projectId}`)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`project:${user.id}:${projectId}`, updatedProject)
    
    return c.json({ project: updatedProject })
  } catch (error) {
    console.log('Update project error:', error)
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

// Tasks routes
app.get(`${PREFIX}/tasks`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const tasks = await kv.getByPrefix(`task:${user.id}:`)
    
    return c.json({ tasks: tasks || [] })
  } catch (error) {
    console.log('Get tasks error:', error)
    return c.json({ error: 'Failed to fetch tasks' }, 500)
  }
})

app.post(`${PREFIX}/tasks`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const taskData = await c.req.json()
    
    const taskId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const task = {
      id: taskId,
      userId: user.id,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      completed: false
    }
    
    await kv.set(`task:${user.id}:${taskId}`, task)
    
    // Add task to project if specified
    if (taskData.projectId) {
      const project = await kv.get(`project:${user.id}:${taskData.projectId}`)
      if (project) {
        project.tasks.push(taskId)
        project.updatedAt = new Date().toISOString()
        await kv.set(`project:${user.id}:${taskData.projectId}`, project)
      }
    }
    
    return c.json({ task })
  } catch (error) {
    console.log('Create task error:', error)
    return c.json({ error: 'Failed to create task' }, 500)
  }
})

app.put(`${PREFIX}/tasks/:id`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const taskId = c.req.param('id')
    const updates = await c.req.json()
    
    const task = await kv.get(`task:${user.id}:${taskId}`)
    if (!task) {
      return c.json({ error: 'Task not found' }, 404)
    }
    
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`task:${user.id}:${taskId}`, updatedTask)
    
    return c.json({ task: updatedTask })
  } catch (error) {
    console.log('Update task error:', error)
    return c.json({ error: 'Failed to update task' }, 500)
  }
})

app.delete(`${PREFIX}/tasks/:id`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const taskId = c.req.param('id')
    
    const task = await kv.get(`task:${user.id}:${taskId}`)
    if (!task) {
      return c.json({ error: 'Task not found' }, 404)
    }
    
    await kv.del(`task:${user.id}:${taskId}`)
    
    // Remove task from project
    if (task.projectId) {
      const project = await kv.get(`project:${user.id}:${task.projectId}`)
      if (project) {
        project.tasks = project.tasks.filter(id => id !== taskId)
        project.updatedAt = new Date().toISOString()
        await kv.set(`project:${user.id}:${task.projectId}`, project)
      }
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Delete task error:', error)
    return c.json({ error: 'Failed to delete task' }, 500)
  }
})

// Collaboration routes
app.get(`${PREFIX}/collaboration/:projectId`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projectId = c.req.param('id')
    
    const collaborators = await kv.getByPrefix(`collaboration:${projectId}:`)
    const activities = await kv.getByPrefix(`activity:${projectId}:`)
    
    return c.json({ 
      collaborators: collaborators || [], 
      activities: (activities || []).slice(-50) // Last 50 activities
    })
  } catch (error) {
    console.log('Get collaboration error:', error)
    return c.json({ error: 'Failed to fetch collaboration data' }, 500)
  }
})

app.post(`${PREFIX}/collaboration/:projectId/activity`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const projectId = c.req.param('projectId')
    const activityData = await c.req.json()
    
    const activityId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const activity = {
      id: activityId,
      projectId,
      userId: user.id,
      userEmail: user.email,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    
    await kv.set(`activity:${projectId}:${activityId}`, activity)
    
    return c.json({ activity })
  } catch (error) {
    console.log('Create activity error:', error)
    return c.json({ error: 'Failed to create activity' }, 500)
  }
})

// AI Optimization routes
app.post(`${PREFIX}/ai/optimize-timeline`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const { projectId, preferences } = await c.req.json()
    
    const project = await kv.get(`project:${user.id}:${projectId}`)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    const tasks = await kv.getByPrefix(`task:${user.id}:`)
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    
    // AI optimization logic (simplified)
    const optimizedSchedule = {
      suggestions: [
        {
          type: 'reorder',
          description: 'Move recording sessions earlier to allow more time for mixing',
          impact: 'high'
        },
        {
          type: 'parallel',
          description: 'Run artwork creation parallel with mastering',
          impact: 'medium'
        }
      ],
      timeline: projectTasks.map(task => ({
        ...task,
        optimizedStartDate: task.startDate,
        optimizedEndDate: task.endDate,
        reasoning: 'Optimized based on dependencies and resource availability'
      }))
    }
    
    return c.json({ optimization: optimizedSchedule })
  } catch (error) {
    console.log('AI optimization error:', error)
    return c.json({ error: 'Failed to optimize timeline' }, 500)
  }
})

// Analytics routes
app.get(`${PREFIX}/analytics/dashboard`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    
    const projects = await kv.getByPrefix(`project:${user.id}:`)
    const tasks = await kv.getByPrefix(`task:${user.id}:`)
    
    const analytics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      overdueTasks: tasks.filter(t => 
        !t.completed && new Date(t.endDate) < new Date()
      ).length,
      upcomingDeadlines: tasks
        .filter(t => !t.completed && new Date(t.endDate) > new Date())
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 5)
    }
    
    return c.json({ analytics })
  } catch (error) {
    console.log('Analytics error:', error)
    return c.json({ error: 'Failed to fetch analytics' }, 500)
  }
})

// User profile routes
app.get(`${PREFIX}/profile`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const profile = await kv.get(`user:${user.id}`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json({ profile })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

app.put(`${PREFIX}/profile`, requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const updates = await c.req.json()
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}`, updatedProfile)
    
    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// Search routes
app.get(`${PREFIX}/search/artists`, requireAuth, async (c) => {
  try {
    const query = c.req.query('q') || ''
    const limit = parseInt(c.req.query('limit') || '20')
    
    // Get all user profiles for search (in a real app, you'd use a proper search index)
    const users = await kv.getByPrefix('user:')
    
    const filteredUsers = users
      .filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        projectCount: user.projects?.length || 0
      }))
    
    return c.json({ artists: filteredUsers })
  } catch (error) {
    console.log('Search artists error:', error)
    return c.json({ error: 'Failed to search artists' }, 500)
  }
})

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default {
  async fetch(request: Request) {
    return app.fetch(request)
  }
}

serve(app.fetch)