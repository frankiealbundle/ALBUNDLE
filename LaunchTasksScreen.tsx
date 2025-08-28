import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Video, 
  Share2, 
  FileText, 
  Music, 
  Package, 
  Users,
  Sparkles,
  Eye,
  Paperclip,
  Bell,
  Plus,
  Bot
} from 'lucide-react';

interface LaunchTask {
  id: number;
  title: string;
  description: string;
  category: 'video' | 'marketing' | 'pr' | 'music' | 'merch' | 'performance';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  completed: boolean;
  hasAI: boolean;
  hasMedia: boolean;
  aiSuggestion?: string;
  mediaFiles?: string[];
}

interface LaunchTasksScreenProps {
  project: any;
  onBack: () => void;
}

export function LaunchTasksScreen({ project, onBack }: LaunchTasksScreenProps) {
  const [selectedTask, setSelectedTask] = useState<LaunchTask | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState<number | null>(null);

  const launchTasks: LaunchTask[] = [
    {
      id: 1,
      title: 'Music Video Production',
      description: 'Create and produce music video for lead single "Starlight"',
      category: 'video',
      priority: 'high',
      deadline: 'Jan 20, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Based on your ambient electronic style, consider a dreamy, ethereal visual concept with soft lighting and nature elements. Budget: $3-5k for indie production.',
    },
    {
      id: 2,
      title: 'Social Media Campaign',
      description: 'Launch coordinated social media campaign across platforms',
      category: 'marketing',
      priority: 'high',
      deadline: 'Jan 15, 2025',
      completed: true,
      hasAI: true,
      hasMedia: true,
      aiSuggestion: 'Post schedule: Teaser content 2 weeks before, behind-the-scenes content, lyric snippets. Optimal posting times: 7-9 PM for your electronic music audience.',
      mediaFiles: ['campaign_assets.zip', 'social_templates.psd']
    },
    {
      id: 3,
      title: 'Press Release Distribution',
      description: 'Send press release to music blogs and publications',
      category: 'pr',
      priority: 'medium',
      deadline: 'Jan 25, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Target blogs: Pitchfork, Electronic Beats, XLR8R. Emphasize your unique sound fusion and ambient storytelling approach. Include streaming stats if available.',
    },
    {
      id: 4,
      title: 'Playlist Pitching',
      description: 'Submit tracks to Spotify editorial and independent playlists',
      category: 'music',
      priority: 'high',
      deadline: 'Jan 10, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Target playlists: Ambient Chill, Electronic Rising, Dreamy Soundscapes. Submit 4 weeks before release. Highlight unique production elements.',
    },
    {
      id: 5,
      title: 'Merchandise Design',
      description: 'Design and order limited edition album merchandise',
      category: 'merch',
      priority: 'low',
      deadline: 'Feb 1, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Minimalist designs work well for electronic music. Consider: vinyl pressing, eco-friendly tote bags, artwork prints. Target 50-100 units for first run.',
    },
    {
      id: 6,
      title: 'Live Performance Planning',
      description: 'Book virtual listening party and plan future shows',
      category: 'performance',
      priority: 'medium',
      deadline: 'Jan 30, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Virtual events work well for ambient music. Consider: Instagram Live session, Twitch listening party, future venue bookings at electronic music venues.',
    },
    {
      id: 7,
      title: 'Email Newsletter Campaign',
      description: 'Create and send album announcement to subscriber list',
      category: 'marketing',
      priority: 'medium',
      deadline: 'Jan 12, 2025',
      completed: true,
      hasAI: true,
      hasMedia: true,
      aiSuggestion: 'Personalized subject line with 23% higher open rates. Include exclusive preview track for subscribers. Send 1 week before public announcement.',
      mediaFiles: ['newsletter_template.html', 'email_graphics.zip']
    },
    {
      id: 8,
      title: 'Collaboration Outreach',
      description: 'Reach out to potential remix artists and collaborators',
      category: 'marketing',
      priority: 'low',
      deadline: 'Feb 15, 2025',
      completed: false,
      hasAI: true,
      hasMedia: false,
      aiSuggestion: 'Target artists: @sarah_beats (similar style), @echo_studio (complementary sound). Offer remix stems in exchange for cross-promotion.',
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': return Video;
      case 'marketing': return Share2;
      case 'pr': return FileText;
      case 'music': return Music;
      case 'merch': return Package;
      case 'performance': return Users;
      default: return CheckSquare;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'marketing': return 'bg-primary/10 text-primary';
      case 'pr': return 'bg-blue-100 text-blue-700';
      case 'music': return 'bg-green-100 text-green-700';
      case 'merch': return 'bg-yellow-100 text-yellow-700';
      case 'performance': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-primary';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const completedTasks = launchTasks.filter(task => task.completed).length;
  const totalTasks = launchTasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  if (selectedTask) {
    return (
      <div className="pb-20 pt-4">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTask(null)}
            className="p-0 h-auto text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">{selectedTask.title}</h1>
            <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
          </div>
        </div>

        {/* Task Details */}
        <div className="px-6 space-y-6">
          {/* Status and Info */}
          <Card className="p-4 bg-white border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedTask.completed} />
                <span className={selectedTask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                  {selectedTask.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              <Badge 
                variant={selectedTask.priority === 'high' ? 'destructive' : selectedTask.priority === 'medium' ? 'default' : 'secondary'}
              >
                {selectedTask.priority} priority
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium text-foreground">{selectedTask.deadline}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge className={getCategoryColor(selectedTask.category)}>
                  {selectedTask.category}
                </Badge>
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          {selectedTask.hasAI && selectedTask.aiSuggestion && (
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">AI Recommendation</h3>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedTask.aiSuggestion}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Media Files */}
          {selectedTask.hasMedia && selectedTask.mediaFiles && (
            <Card className="p-4 bg-white border border-border">
              <h3 className="font-medium text-foreground mb-3">Attached Files</h3>
              <div className="space-y-2">
                {selectedTask.mediaFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{file}</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-border">
              <Paperclip className="w-4 h-4 mr-2" />
              Add Media
            </Button>
            <Button variant="outline" className="border-border">
              <Bell className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Launch Tasks</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
        <Button variant="outline" size="sm" className="border-border">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-white border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Launch Progress</h3>
            <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} tasks completed</span>
          </div>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">{progressPercentage}% Complete</p>
        </Card>
      </div>

      {/* AI Assistant Summary */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">AI Launch Insights</h3>
              <p className="text-sm text-foreground mb-3">
                Your album launch is 65% complete. Focus on high-priority tasks: playlist pitching and music video production. 
                AI suggests targeting ambient music playlists for best reach.
              </p>
              <Button variant="outline" size="sm" className="border-primary text-primary">
                Get More Suggestions
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Task Categories */}
      <div className="px-6 mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Launch Tasks</h2>
      </div>

      {/* Tasks List */}
      <div className="px-6">
        <div className="space-y-3">
          {launchTasks.map((task) => {
            const CategoryIcon = getCategoryIcon(task.category);
            return (
              <Card 
                key={task.id} 
                className={`p-4 bg-white border-l-4 ${getPriorityColor(task.priority)} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={task.completed} 
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  <CategoryIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        {task.hasAI && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAISuggestion(showAISuggestion === task.id ? null : task.id);
                            }}
                          >
                            <Bot className="w-3 h-3" />
                          </Button>
                        )}
                        {task.hasMedia && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.deadline}</span>
                      </div>
                      <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </Badge>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    {/* AI Suggestion Preview */}
                    {showAISuggestion === task.id && task.aiSuggestion && (
                      <div className="mt-3 p-3 bg-primary/5 rounded border border-primary/20">
                        <p className="text-xs text-foreground">
                          {task.aiSuggestion.substring(0, 120)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" />
            Launch Calendar
          </Button>
          <Button variant="outline" className="border-border">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>
        </div>
      </div>
    </div>
  );
}