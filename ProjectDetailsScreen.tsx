import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AppHeader } from './AppHeader';
import { 
  Play,
  Pause,
  Music,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  Plus,
  Settings,
  Share,
  Download,
  Upload,
  Mic,
  Headphones,
  Volume2,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  TrendingUp,
  Target,
  Zap,
  Eye,
  MessageSquare,
  FileText,
  Image,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';

interface ProjectDetailsScreenProps {
  projectId: string;
  onNavigate?: (screen: string, data?: any) => void;
  onBack?: () => void;
}

export function ProjectDetailsScreen({ 
  projectId,
  onNavigate,
  onBack
}: ProjectDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  // Mock project data - in real app this would come from API
  const project = {
    id: projectId,
    name: 'Midnight Dreams',
    description: 'An atmospheric electronic album exploring themes of dreams, aspirations, and late-night creativity.',
    genre: 'Electronic',
    status: 'active',
    progress: 75,
    createdAt: new Date(2024, 10, 1),
    deadline: new Date(2024, 11, 25),
    totalTracks: 8,
    completedTracks: 6,
    collaborators: [
      { id: 1, name: 'Sarah Chen', role: 'Producer', avatar: 'SC' },
      { id: 2, name: 'Alex Rivera', role: 'Mixing Engineer', avatar: 'AR' },
      { id: 3, name: 'Jordan Kim', role: 'Vocalist', avatar: 'JK' }
    ],
    tracks: [
      {
        id: 1,
        title: 'Midnight Overture',
        duration: '4:32',
        status: 'completed',
        waveform: '/waveform-1.svg',
        bpm: 128,
        key: 'Am',
        lastModified: new Date(2024, 10, 15)
      },
      {
        id: 2,
        title: 'Neon Dreams',
        duration: '3:45',
        status: 'completed',
        waveform: '/waveform-2.svg',
        bpm: 124,
        key: 'Cm',
        lastModified: new Date(2024, 10, 18)
      },
      {
        id: 3,
        title: 'City Lights',
        duration: '5:12',
        status: 'in_progress',
        waveform: '/waveform-3.svg',
        bpm: 130,
        key: 'Gm',
        lastModified: new Date(2024, 11, 2)
      },
      {
        id: 4,
        title: 'Digital Sunset',
        duration: '4:18',
        status: 'draft',
        waveform: '/waveform-4.svg',
        bpm: 126,
        key: 'Dm',
        lastModified: new Date(2024, 11, 5)
      }
    ],
    tasks: [
      {
        id: 1,
        title: 'Master track 3',
        type: 'mixing',
        assignee: 'Alex Rivera',
        dueDate: new Date(2024, 11, 10),
        status: 'pending',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Record additional vocals',
        type: 'recording',
        assignee: 'Jordan Kim',
        dueDate: new Date(2024, 11, 12),
        status: 'in_progress',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Album artwork review',
        type: 'creative',
        assignee: 'Sarah Chen',
        dueDate: new Date(2024, 11, 15),
        status: 'pending',
        priority: 'low'
      }
    ],
    files: [
      { id: 1, name: 'Project_Notes.md', type: 'document', size: '2.4 KB', uploadedBy: 'Sarah Chen' },
      { id: 2, name: 'Album_Concept.jpg', type: 'image', size: '1.2 MB', uploadedBy: 'Jordan Kim' },
      { id: 3, name: 'Demo_Video.mp4', type: 'video', size: '45.6 MB', uploadedBy: 'Alex Rivera' },
      { id: 4, name: 'Mastered_Stems.zip', type: 'audio', size: '156 MB', uploadedBy: 'Alex Rivera' }
    ],
    analytics: {
      totalPlayTime: '3h 45m',
      sessionCount: 28,
      averageSessionLength: '8m 12s',
      collaboratorActivity: [
        { name: 'Sarah Chen', sessions: 12, hours: '1h 32m' },
        { name: 'Alex Rivera', sessions: 10, hours: '1h 15m' },
        { name: 'Jordan Kim', sessions: 6, hours: '58m' }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'image': return <Image className="w-4 h-4 text-green-500" />;
      case 'video': return <Video className="w-4 h-4 text-purple-500" />;
      case 'audio': return <Music className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (trackIndex: number) => {
    setCurrentTrack(trackIndex);
    setIsPlaying(true);
  };

  const handleCreateTask = () => {
    onNavigate?.('create-task', { projectId: project.id });
  };

  const handleCollaborate = () => {
    onNavigate?.('collaboration', { projectId: project.id });
  };

  const handleAIOptimize = () => {
    onNavigate?.('ai-optimization', { projectId: project.id });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={project.name}
        subtitle={`${project.genre} • ${project.collaborators.length} collaborators`}
        showBack={true}
        onBack={onBack}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => console.log('Share project')}>
              <Share className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => console.log('Project settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      <div className="pb-20">
        {/* Project Header */}
        <div className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-5 bg-gradient-to-r from-primary/5 to-purple-50 border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-muted-foreground">
                      Due {format(project.deadline, 'MMM dd')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}% complete</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{project.completedTracks}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{project.totalTracks}</div>
                    <div className="text-xs text-muted-foreground">Total Tracks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{project.collaborators.length}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-3"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-16 gap-1"
              onClick={handleCreateTask}
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Add Task</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-16 gap-1"
              onClick={handleCollaborate}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">Collaborate</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-16 gap-1"
              onClick={handleAIOptimize}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs">AI Optimize</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-16 gap-1"
              onClick={() => onNavigate?.('daw-integration', { projectId: project.id })}
            >
              <Headphones className="w-4 h-4" />
              <span className="text-xs">DAW Sync</span>
            </Button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="tracks" className="text-xs">Tracks</TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
              <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Team */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Team</h3>
                  <Button size="sm" variant="ghost" onClick={handleCollaborate}>
                    <Plus className="w-4 h-4 mr-1" />
                    Invite
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {project.collaborators.map((collaborator, index) => (
                    <motion.div
                      key={collaborator.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{collaborator.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{collaborator.name}</div>
                        <div className="text-xs text-muted-foreground">{collaborator.role}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="w-6 h-6">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-4">
                <h3 className="font-medium text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Alex Rivera completed mastering for "Neon Dreams"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Jordan Kim uploaded new vocal takes</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Sarah Chen created new task "Album artwork review"</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Analytics */}
              <Card className="p-4">
                <h3 className="font-medium text-foreground mb-4">Project Analytics</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-semibold text-foreground">{project.analytics.sessionCount}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-semibold text-foreground">{project.analytics.totalPlayTime}</div>
                    <div className="text-xs text-muted-foreground">Total Time</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Collaborator Activity</h4>
                  {project.analytics.collaboratorActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{activity.name}</span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span>{activity.sessions} sessions</span>
                        <span>{activity.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Tracks Tab */}
            <TabsContent value="tracks" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Tracks ({project.tracks.length})</h3>
                  <Button size="sm" onClick={() => console.log('Add new track')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Track
                  </Button>
                </div>

                <div className="space-y-3">
                  {project.tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                        currentTrack === index ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause();
                          }}
                        >
                          {isPlaying && currentTrack === index ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground truncate">{track.title}</h4>
                            <Badge className={`text-xs ${getStatusColor(track.status)}`}>
                              {track.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{track.duration}</span>
                            <span>{track.bpm} BPM</span>
                            <span>Key: {track.key}</span>
                            <span>Modified {format(track.lastModified, 'MMM dd')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Tasks ({project.tasks.length})</h3>
                  <Button size="sm" onClick={handleCreateTask}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>

                <div className="space-y-3">
                  {project.tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground">{task.title}</h4>
                            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <span>Assigned to {task.assignee}</span>
                            <span className={getPriorityColor(task.priority)}>
                              {task.priority} priority
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Due {format(task.dueDate, 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="w-6 h-6">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Files ({project.files.length})</h3>
                  <Button size="sm" onClick={() => console.log('Upload file')}>
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>

                <div className="space-y-3">
                  {project.files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">{file.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{file.size}</span>
                            <span>by {file.uploadedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}