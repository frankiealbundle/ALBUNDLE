import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TaskQuickActions } from './TaskQuickActions';
import { AppHeader } from './AppHeader';
import { projectsApi, tasksApi, analyticsApi } from '../utils/supabase/client';
import { 
  Play, 
  Pause, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Music,
  Mic,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Zap,
  ArrowRight,
  MoreHorizontal,
  Target,
  Timer,
  Star,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from './ToastSystem';
import { LoadingSpinner } from './LoadingSpinner';
import { ProductionReadyBanner } from './ProductionReadyBanner';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  deadline: string;
  tracks: number;
  collaborators: number;
  lastActivity: string;
  priority: 'high' | 'medium' | 'low';
  genre: string;
}

interface Task {
  id: string;
  title: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  projectName: string;
  dueTime: string;
  estimatedDuration: string;
}

interface DashboardScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  onCreateProject?: () => void;
  onCreateTask?: () => void;
  onViewProject?: (projectId: string) => void;
  onViewAgenda?: () => void;
  onOpenSearch?: () => void;
}

export function DashboardScreen({ 
  onNavigate,
  onCreateProject,
  onCreateTask,
  onViewProject,
  onViewAgenda,
  onOpenSearch
}: DashboardScreenProps) {
  const { addToast } = useToast();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    upcomingDeadlines: 0
  });
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load projects and tasks from backend
        const [projectsResponse, tasksResponse, analyticsResponse] = await Promise.all([
          projectsApi.getAll().catch(() => ({ projects: [] })),
          tasksApi.getAll().catch(() => ({ tasks: [] })),
          analyticsApi.getDashboard().catch(() => ({ analytics: {
            totalProjects: 0,
            activeProjects: 0,
            totalTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
            upcomingDeadlines: []
          }}))
        ]);

        const projects = projectsResponse.projects || [];
        const tasks = tasksResponse.tasks || [];
        const analytics = analyticsResponse.analytics || {};

        // Transform backend data to component format
        const transformedProjects = projects.map(project => ({
          id: project.id,
          name: project.name || project.title,
          status: project.status || 'active',
          progress: project.progress || 0,
          deadline: project.deadline || project.endDate,
          tracks: project.tracks?.length || 0,
          collaborators: project.collaborators?.length || 1,
          lastActivity: project.updatedAt ? formatRelativeTime(project.updatedAt) : 'Recently',
          priority: project.priority || 'medium',
          genre: project.genre || 'Unknown'
        }));

        // Get today's tasks
        const today = new Date().toDateString();
        const todaysTasks = tasks
          .filter(task => {
            const taskDate = new Date(task.startDate || task.createdAt).toDateString();
            return taskDate === today;
          })
          .map(task => ({
            id: task.id,
            title: task.title,
            type: task.type || 'general',
            priority: task.priority || 'medium',
            status: task.status || 'pending',
            projectName: task.projectName || 'General',
            dueTime: task.startTime || 'TBD',
            estimatedDuration: task.estimatedDuration || '1h'
          }));

        setActiveProjects(transformedProjects);
        setTodaysTasks(todaysTasks);
        setStats({
          totalProjects: analytics.totalProjects || 0,
          activeProjects: analytics.activeProjects || 0,
          completedTasks: analytics.completedTasks || 0,
          upcomingDeadlines: analytics.upcomingDeadlines?.length || 0
        });

      } catch (error: any) {
        console.error('Dashboard data loading error:', error);
        setError(error.message || 'Failed to load dashboard data');
        addToast({
          type: 'error',
          title: 'Loading Error',
          description: 'Some dashboard data may not be up to date. Trying to reconnect...',
          action: {
            label: 'Retry',
            onClick: () => {
              setError(null);
              loadDashboardData();
            }
          }
        });
        
        // Fallback to empty state
        setActiveProjects([]);
        setTodaysTasks([]);
        setStats({
          totalProjects: 0,
          activeProjects: 0,
          completedTasks: 0,
          upcomingDeadlines: 0
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    // Simulate loading for better UX
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    } else if (onNavigate) {
      onNavigate('create-project');
    }
  };

  const handleViewProject = (projectId: string) => {
    if (onViewProject) {
      onViewProject(projectId);
    } else if (onNavigate) {
      onNavigate('projects', { selectedProject: projectId });
    }
  };

  const handleViewAllProjects = () => {
    if (onNavigate) {
      onNavigate('projects');
    }
  };

  const handleViewAgenda = () => {
    if (onViewAgenda) {
      onViewAgenda();
    } else if (onNavigate) {
      onNavigate('agenda');
    }
  };

  const handleTaskAction = (taskId: string, action: 'start' | 'complete' | 'view') => {
    setTodaysTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'start':
            return { ...task, status: 'in_progress' as const };
          case 'complete':
            return { ...task, status: 'completed' as const };
          default:
            return task;
        }
      }
      return task;
    }));

    if (action === 'view' && onNavigate) {
      onNavigate('agenda', { selectedTask: taskId });
    }
  };

  const handleTaskCreate = (taskType: string) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskType,
      type: 'custom',
      priority: 'medium',
      status: 'pending',
      projectName: 'Quick Task',
      dueTime: 'Now',
      estimatedDuration: '30m'
    };

    setTodaysTasks(prev => [newTask, ...prev]);
    setShowQuickActions(false);
  };

  const handleOpenCollaboration = () => {
    if (onNavigate) {
      onNavigate('collaboration', { projectId: activeProjects[0]?.id });
    }
  };

  const handleOpenAIOptimization = () => {
    if (onNavigate) {
      onNavigate('ai-optimization', { projectId: activeProjects[0]?.id });
    }
  };

  const handleOpenDAWIntegration = () => {
    if (onNavigate) {
      onNavigate('daw-integration', { projectId: activeProjects[0]?.id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'on_hold': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'recording': return <Mic className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'creative': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader 
          title="Dashboard" 
          subtitle="Loading your workspace..."
          onSettings={() => onNavigate?.('settings')}
        />
        
        <div className="pb-20 px-4 py-4 space-y-6">
          {/* Loading state */}
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner 
              size="lg" 
              variant="music" 
              text="Loading your workspace..." 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Dashboard" 
        subtitle="Welcome back to Albundle"
        notificationCount={todaysTasks.filter(t => t.status === 'pending').length}
        onSettings={() => onNavigate?.('settings')}
      />

      <div className="pb-20 px-4 py-4 space-y-6">
        {/* Production Ready Banner */}
        <ProductionReadyBanner onNavigate={onNavigate} />
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-orange-50 border border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    {stats.activeProjects}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium">Active Projects</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 text-primary hover:bg-primary/10 font-medium"
                onClick={handleViewAllProjects}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-4 bg-gradient-to-br from-green-50 via-green-25 to-blue-50 border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  >
                    {todaysTasks.length}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium">Today's Tasks</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 text-green-600 hover:bg-green-50 font-medium"
                onClick={handleViewAgenda}
              >
                View Agenda
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 bg-white border border-border shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                More
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 flex-col gap-2 border-2 border-border hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                  onClick={handleCreateProject}
                >
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">New Project</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 flex-col gap-2 border-2 border-border hover:bg-green-50 hover:border-green-200 transition-all duration-200"
                  onClick={onCreateTask || (() => onNavigate?.('create-task'))}
                >
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium">Add Task</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 flex-col gap-2 border-2 border-border hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  onClick={handleViewAgenda}
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium">View Agenda</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 flex-col gap-2 border-2 border-border hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
                  onClick={() => onNavigate?.('search')}
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium">Find Artists</span>
                </Button>
              </motion.div>
            </div>

            {/* Advanced Actions */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full flex-col h-20 text-xs hover:bg-blue-50 transition-colors duration-200 relative group"
                  onClick={handleOpenCollaboration}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Collaborate</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full flex-col h-20 text-xs hover:bg-purple-50 transition-colors duration-200 relative group"
                  onClick={handleOpenAIOptimization}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium">AI Optimize</span>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-white fill-current" />
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full flex-col h-20 text-xs hover:bg-green-50 transition-colors duration-200 relative group"
                  onClick={handleOpenDAWIntegration}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium">DAW Setup</span>
                </Button>
              </motion.div>
            </div>

            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <TaskQuickActions onTaskCreate={handleTaskCreate} />
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-white border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Active Projects</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleViewAllProjects}
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {activeProjects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm">{project.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{project.tracks} tracks</span>
                        <span>{project.collaborators} collaborators</span>
                        <span className={getPriorityColor(project.priority)}>
                          {project.priority} priority
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      Last activity: {project.lastActivity}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCollaboration();
                        }}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Collaborate
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {activeProjects.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground mb-2">No active projects</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your musical journey by creating your first project
                </p>
                <Button onClick={handleCreateProject} className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-white border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Today's Tasks</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleViewAgenda}
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {todaysTasks.slice(0, 4).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {getTaskIcon(task.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm truncate">{task.title}</h4>
                      <Badge className={`text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{task.projectName}</span>
                      <span>{task.dueTime}</span>
                      <span>{task.estimatedDuration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {task.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => handleTaskAction(task.id, 'start')}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => handleTaskAction(task.id, 'view')}
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => handleTaskAction(task.id, 'complete')}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => handleTaskAction(task.id, 'view')}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {todaysTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground mb-2">All caught up!</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  No tasks scheduled for today
                </p>
                <Button 
                  variant="outline"
                  onClick={onCreateTask || (() => onNavigate?.('create-task'))}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Quick Insights</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleOpenAIOptimization}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                View More
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">78%</div>
                <div className="text-xs text-muted-foreground">Productivity Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{stats.upcomingDeadlines}</div>
                <div className="text-xs text-muted-foreground">Upcoming Deadlines</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 border-purple-200 hover:bg-purple-50"
              onClick={handleOpenAIOptimization}
            >
              <Zap className="w-4 h-4 mr-1" />
              Get AI Suggestions
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}