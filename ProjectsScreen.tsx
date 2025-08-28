import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Search, Filter, Plus, Calendar, Music, Clock, CheckSquare, MoreVertical, Rocket, Bot, ArrowLeft, Users, Edit, Trash2, Share, Play, Pause, Settings } from 'lucide-react';
import { LaunchTasksScreen } from './LaunchTasksScreen';
import { AppHeader } from './AppHeader';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  onCreateProject?: () => void;
  selectedProjectId?: string;
}

export function ProjectsScreen({ onNavigate, onCreateProject, selectedProjectId }: ProjectsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showLaunchTasks, setShowLaunchTasks] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Initialize projects data
    const mockProjects = [
      {
        id: 1,
        name: 'Ethereal Sounds Album',
        description: 'A collection of ambient electronic tracks exploring themes of nature and technology.',
        status: 'In Progress',
        progress: 65,
        deadline: 'Jan 15, 2025',
        tracks: [
          {
            id: 1,
            name: 'Midnight Dreams',
            status: 'Recording',
            tasks: [
              { id: 1, name: 'Vocal Recording', deadline: 'Today', priority: 'high', completed: false },
              { id: 2, name: 'Guitar Overdubs', deadline: 'Dec 19', priority: 'medium', completed: true },
              { id: 3, name: 'Final Mix', deadline: 'Dec 25', priority: 'medium', completed: false }
            ]
          },
          {
            id: 2,
            name: 'Starlight',
            status: 'Mixing',
            tasks: [
              { id: 4, name: 'Guitar Recording', deadline: 'Tomorrow', priority: 'medium', completed: false },
              { id: 5, name: 'Drum Programming', deadline: 'Dec 20', priority: 'low', completed: true },
              { id: 6, name: 'Vocal Recording', deadline: 'Dec 23', priority: 'high', completed: false }
            ]
          },
          {
            id: 3,
            name: 'Ocean Waves',
            status: 'Demo',
            tasks: [
              { id: 7, name: 'Demo Recording', deadline: 'Dec 22', priority: 'low', completed: false },
              { id: 8, name: 'Sound Design', deadline: 'Dec 28', priority: 'medium', completed: false }
            ]
          }
        ],
        collaborators: ['@sarah_beats', '@echo_studio'],
        genre: 'Electronic'
      },
      {
        id: 2,
        name: 'New Singles Collection',
        description: 'Experimental singles exploring new sounds and collaborations.',
        status: 'Planning',
        progress: 25,
        deadline: 'Mar 1, 2025',
        tracks: [
          {
            id: 4,
            name: 'Digital Dreams',
            status: 'Planning',
            tasks: [
              { id: 9, name: 'Concept Development', deadline: 'Dec 30', priority: 'medium', completed: false },
              { id: 10, name: 'Pre-production', deadline: 'Jan 5', priority: 'low', completed: false }
            ]
          }
        ],
        collaborators: ['@nina_music'],
        genre: 'Experimental'
      },
      {
        id: 3,
        name: 'Acoustic Sessions',
        description: 'Stripped-down acoustic versions of popular tracks.',
        status: 'Completed',
        progress: 100,
        deadline: 'Nov 30, 2024',
        launchTasks: {
          total: 8,
          completed: 5,
          hasAI: true
        },
        tracks: [
          {
            id: 5,
            name: 'Starlight (Acoustic)',
            status: 'Mastered',
            tasks: [
              { id: 11, name: 'Recording', deadline: 'Nov 15', priority: 'high', completed: true },
              { id: 12, name: 'Mixing', deadline: 'Nov 25', priority: 'medium', completed: true },
              { id: 13, name: 'Mastering', deadline: 'Nov 30', priority: 'high', completed: true }
            ]
          }
        ],
        collaborators: [],
        genre: 'Acoustic'
      }
    ];

    setProjects(mockProjects);

    // Handle deep linking to specific project
    if (selectedProjectId) {
      const project = mockProjects.find(p => p.id.toString() === selectedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [selectedProjectId]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    } else if (onNavigate) {
      onNavigate('create-project');
    }
  };

  const handleProjectAction = (projectId: number, action: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    switch (action) {
      case 'edit':
        if (onNavigate) {
          onNavigate('create-project', { editProject: project });
        }
        break;
      case 'collaborate':
        if (onNavigate) {
          onNavigate('collaboration', { projectId: project.id });
        }
        break;
      case 'ai-optimize':
        if (onNavigate) {
          onNavigate('ai-optimization', { projectId: project.id });
        }
        break;
      case 'schedule':
        if (onNavigate) {
          onNavigate('agenda', { projectId: project.id });
        }
        break;
      case 'delete':
        setProjects(prev => prev.filter(p => p.id !== projectId));
        break;
      case 'duplicate':
        const newProject = { 
          ...project, 
          id: Date.now(), 
          name: `${project.name} (Copy)`,
          status: 'Planning',
          progress: 0
        };
        setProjects(prev => [newProject, ...prev]);
        break;
    }
  };

  const handleTaskAction = (taskId: number, action: string) => {
    if (!selectedProject) return;

    const updatedProject = { ...selectedProject };
    updatedProject.tracks = updatedProject.tracks.map(track => ({
      ...track,
      tasks: track.tasks.map(task => {
        if (task.id === taskId) {
          switch (action) {
            case 'complete':
              return { ...task, completed: !task.completed };
            case 'start':
              return { ...task, status: 'in_progress' };
            default:
              return task;
          }
        }
        return task;
      })
    }));

    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleAddTask = (trackId: number) => {
    if (!selectedProject) return;

    const newTask = {
      id: Date.now(),
      name: 'New Task',
      deadline: 'TBD',
      priority: 'medium',
      completed: false
    };

    const updatedProject = { ...selectedProject };
    updatedProject.tracks = updatedProject.tracks.map(track => 
      track.id === trackId 
        ? { ...track, tasks: [...track.tasks, newTask] }
        : track
    );

    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleOpenDAWIntegration = () => {
    if (onNavigate) {
      onNavigate('daw-integration', { projectId: selectedProject?.id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-primary';
      case 'Planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-primary';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (showLaunchTasks && selectedProject) {
    return <LaunchTasksScreen project={selectedProject} onBack={() => setShowLaunchTasks(false)} />;
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader 
          title={selectedProject.name}
          subtitle={selectedProject.description}
          actions={
            <Button 
              variant="ghost" 
              onClick={() => setSelectedProject(null)}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          }
        />
        
        <div className="pb-20">
          {/* Project Overview */}
          <div className="px-6 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedProject.status)}`} />
                    <span className="font-medium text-foreground">{selectedProject.status}</span>
                    <Badge variant="secondary">{selectedProject.genre}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">Due: {selectedProject.deadline}</span>
                </div>
                <Progress value={selectedProject.progress} className="mb-2" />
                <p className="text-sm text-muted-foreground">{selectedProject.progress}% Complete</p>
              </Card>
            </motion.div>
          </div>

          {/* Project Actions */}
          <div className="px-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4 bg-white border border-border">
                <h3 className="font-medium text-foreground mb-3">Project Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 flex-col gap-1"
                    onClick={() => handleProjectAction(selectedProject.id, 'collaborate')}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Collaborate</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-12 flex-col gap-1"
                    onClick={() => handleProjectAction(selectedProject.id, 'ai-optimize')}
                  >
                    <Bot className="w-4 h-4" />
                    <span className="text-xs">AI Optimize</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-12 flex-col gap-1"
                    onClick={() => handleProjectAction(selectedProject.id, 'schedule')}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-12 flex-col gap-1"
                    onClick={handleOpenDAWIntegration}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs">DAW Setup</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Launch Tasks Section - Only for Completed Projects */}
          {selectedProject.status === 'Completed' && selectedProject.launchTasks && (
            <div className="px-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Rocket className="w-4 h-4 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-foreground">Launch Campaign</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedProject.launchTasks.completed}/{selectedProject.launchTasks.total} tasks completed
                        </p>
                      </div>
                    </div>
                    {selectedProject.launchTasks.hasAI && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Bot className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                    )}
                  </div>
                  
                  <Progress 
                    value={(selectedProject.launchTasks.completed / selectedProject.launchTasks.total) * 100} 
                    className="mb-3" 
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setShowLaunchTasks(true)}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Tasks
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border hover:bg-muted/50"
                      onClick={() => handleProjectAction(selectedProject.id, 'ai-optimize')}
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      AI Suggestions
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Tracks and Tasks */}
          <div className="px-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tracks & Tasks</h2>
            <div className="space-y-4">
              {selectedProject.tracks.map((track: any, index: number) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{track.name}</h3>
                          <p className="text-sm text-muted-foreground">{track.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => handleAddTask(track.id)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-muted/50">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {track.tasks.map((task: any) => (
                          <motion.div 
                            key={task.id} 
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3 p-2 bg-muted/30 rounded hover:bg-muted/50 transition-colors"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-4 h-4 p-0"
                              onClick={() => handleTaskAction(task.id, 'complete')}
                            >
                              <CheckSquare className={`w-4 h-4 ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{task.deadline}</span>
                                <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            {!task.completed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6"
                                onClick={() => handleTaskAction(task.id, 'start')}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Projects" 
        subtitle="Manage your music projects"
        actions={
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleCreateProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        }
      />
      
      <div className="pb-20">
        {/* Search and Filter */}
        <div className="px-6 py-6">
          <motion.div 
            className="flex gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-border"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-3 bg-white border border-border hover:shadow-md transition-shadow">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </Card>
            <Card className="p-3 bg-white border border-border hover:shadow-md transition-shadow">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">
                  {projects.filter(p => p.status === 'In Progress').length}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </Card>
            <Card className="p-3 bg-white border border-border hover:shadow-md transition-shadow">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Projects List */}
        <div className="px-6">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-4 bg-white border border-border hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{project.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                          {project.status === 'Completed' && project.launchTasks?.hasAI && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                              <Rocket className="w-2 h-2 mr-1" />
                              Launch Ready
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{project.tracks.length} tracks</span>
                          <span>Due: {project.deadline}</span>
                          <Badge variant="secondary" className="text-xs">{project.genre}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectAction(project.id, 'collaborate');
                          }}
                        >
                          <Users className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectAction(project.id, 'edit');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Launch Tasks Preview for Completed Projects */}
                    {project.status === 'Completed' && project.launchTasks && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">
                              Launch: {project.launchTasks.completed}/{project.launchTasks.total} tasks
                            </span>
                          </div>
                          {project.launchTasks.hasAI && (
                            <Bot className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </div>
                    )}

                    {project.collaborators.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Collaborators:</span>
                          <div className="flex gap-1">
                            {project.collaborators.slice(0, 2).map((collab, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-border">
                                {collab}
                              </Badge>
                            ))}
                            {project.collaborators.length > 2 && (
                              <Badge variant="outline" className="text-xs border-border">
                                +{project.collaborators.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your musical journey by creating your first project'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={handleCreateProject} className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}