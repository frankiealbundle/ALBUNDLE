import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'albundle-mvp'
    }
  }
})

// API helper functions with demo fallbacks
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-dd758888`

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
      ...options.headers
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}



// Project API functions
export const projectsApi = {
  getAll: () => apiRequest('/projects'),
  getById: (id: string) => apiRequest(`/projects/${id}`),
  create: (data: any) => apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => apiRequest(`/projects/${id}`, {
    method: 'DELETE'
  })
}

// Task API functions
export const tasksApi = {
  getAll: () => apiRequest('/tasks'),
  create: (data: any) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE'
  })
}

// Collaboration API functions
export const collaborationApi = {
  getProjectData: (projectId: string) => apiRequest(`/collaboration/${projectId}`),
  addActivity: (projectId: string, activity: any) => apiRequest(`/collaboration/${projectId}/activity`, {
    method: 'POST',
    body: JSON.stringify(activity)
  })
}

// AI API functions
export const aiApi = {
  optimizeTimeline: (projectId: string, preferences: any) => apiRequest('/ai/optimize-timeline', {
    method: 'POST',
    body: JSON.stringify({ projectId, preferences })
  })
}

// Analytics API functions
export const analyticsApi = {
  getDashboard: () => apiRequest('/analytics/dashboard')
}

// Profile API functions
export const profileApi = {
  get: () => apiRequest('/profile'),
  update: (data: any) => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// Search API functions
export const searchApi = {
  artists: (query: string, limit = 20) => apiRequest(`/search/artists?q=${encodeURIComponent(query)}&limit=${limit}`)
}