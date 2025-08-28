import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, Music, Camera, CheckSquare, ArrowLeft, Plus, Rocket, Bot, Video, Share2, FileText, Package, Users } from 'lucide-react';

export function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [taskFilter, setTaskFilter] = useState<'all' | 'project' | 'launch'>('all');

  const tasks = [
    {
      id: 1,
      title: 'Vocal Recording - Midnight Dreams',
      project: 'Ethereal Sounds Album',
      time: '3:00 PM - 5:00 PM',
      date: '2024-12-17',
      priority: 'high',
      type: 'recording',
      status: 'pending',
      taskCategory: 'project'
    },
    {
      id: 2,
      title: 'Guitar Recording - Starlight',
      project: 'Ethereal Sounds Album', 
      time: '10:00 AM - 12:00 PM',
      date: '2024-12-18',
      priority: 'medium',
      type: 'recording',
      status: 'pending',
      taskCategory: 'project'
    },
    {
      id: 3,
      title: 'Music Video Production - Starlight',
      project: 'Acoustic Sessions',
      time: '9:00 AM - 6:00 PM',
      date: '2024-12-20',
      priority: 'high',
      type: 'video',
      status: 'pending',
      taskCategory: 'launch',
      hasAI: true
    },
    {
      id: 4,
      title: 'Social Media Campaign Launch',
      project: 'Acoustic Sessions',
      time: '11:00 AM - 1:00 PM',
      date: '2024-12-22',
      priority: 'high',
      type: 'marketing',
      status: 'pending',
      taskCategory: 'launch',
      hasAI: true
    },
    {
      id: 5,
      title: 'Press Release Distribution',
      project: 'Acoustic Sessions',
      time: '2:00 PM - 4:00 PM',
      date: '2024-12-25',
      priority: 'medium',
      type: 'pr',
      status: 'pending',
      taskCategory: 'launch',
      hasAI: true
    },
    {
      id: 6,
      title: 'Demo Recording - Ocean Waves',
      project: 'New Singles',
      time: '11:00 AM - 1:00 PM',
      date: '2024-12-22',
      priority: 'low',
      type: 'demo',
      status: 'pending',
      taskCategory: 'project'
    },
    {
      id: 7,
      title: 'Playlist Pitching Campaign',
      project: 'Acoustic Sessions',
      time: '9:00 AM - 11:00 AM',
      date: '2024-12-19',
      priority: 'high',
      type: 'music',
      status: 'completed',
      taskCategory: 'launch',
      hasAI: true
    },
    {
      id: 8,
      title: 'Live Performance Planning',
      project: 'Acoustic Sessions',
      time: '4:00 PM - 6:00 PM',
      date: '2024-12-30',
      priority: 'medium',
      type: 'performance',
      status: 'pending',
      taskCategory: 'launch',
      hasAI: true
    }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();
  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    return task.taskCategory === taskFilter;
  });

  const getTasksForDate = (date: string) => {
    return filteredTasks.filter(task => task.date === date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-primary bg-orange-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'recording': return Clock;
      case 'photoshoot': return Camera;
      case 'demo': return Music;
      case 'mixing': return Music;
      case 'meeting': return Calendar;
      case 'video': return Video;
      case 'marketing': return Share2;
      case 'pr': return FileText;
      case 'music': return Music;
      case 'merch': return Package;
      case 'performance': return Users;
      default: return CheckSquare;
    }
  };

  const getTaskCategoryColor = (category: string) => {
    switch (category) {
      case 'launch': return 'bg-primary/10 text-primary border-primary/20';
      case 'project': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Task Calendar</h1>
          <p className="text-sm text-muted-foreground">Manage your schedule and deadlines</p>
        </div>
        <Button variant="outline" size="sm" className="border-border">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* View and Filter Controls */}
      <div className="px-6 mb-6">
        <div className="flex flex-col gap-3">
          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-primary text-white' : 'border-border'}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'bg-primary text-white' : 'border-border'}
            >
              Month
            </Button>
          </div>

          {/* Task Filter */}
          <div className="flex gap-2">
            <Button
              variant={taskFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTaskFilter('all')}
              className={taskFilter === 'all' ? 'bg-primary text-white' : 'border-border'}
            >
              All Tasks
            </Button>
            <Button
              variant={taskFilter === 'project' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTaskFilter('project')}
              className={taskFilter === 'project' ? 'bg-primary text-white' : 'border-border'}
            >
              <Music className="w-3 h-3 mr-1" />
              Project
            </Button>
            <Button
              variant={taskFilter === 'launch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTaskFilter('launch')}
              className={taskFilter === 'launch' ? 'bg-primary text-white' : 'border-border'}
            >
              <Rocket className="w-3 h-3 mr-1" />
              Launch
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'week' && (
        <div className="px-6">
          {/* Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === today;
              const dayTasks = getTasksForDate(dateStr);
              const launchTasks = dayTasks.filter(t => t.taskCategory === 'launch');
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{weekDays[index]}</div>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm ${
                    isToday ? 'bg-primary text-white' : 'text-foreground'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="flex justify-center gap-1 mt-1">
                    {dayTasks.length > 0 && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {launchTasks.length > 0 && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Week Tasks */}
          <div className="space-y-4">
            {weekDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayTasks = getTasksForDate(dateStr);
              
              if (dayTasks.length === 0) return null;
              
              return (
                <div key={index}>
                  <h3 className="font-medium text-foreground mb-3">
                    {weekDays[index]}, {date.getDate()}
                  </h3>
                  <div className="space-y-2">
                    {dayTasks.map((task) => {
                      const TaskIcon = getTaskIcon(task.type);
                      return (
                        <Card key={task.id} className={`p-3 border-l-4 ${getPriorityColor(task.priority)}`}>
                          <div className="flex items-start gap-3">
                            <TaskIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground text-sm truncate">
                                  {task.title}
                                </h4>
                                {task.hasAI && (
                                  <Bot className="w-3 h-3 text-primary" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-1">
                                {task.project}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">{task.time}</span>
                                <Badge 
                                  className={`text-xs ${getTaskCategoryColor(task.taskCategory)}`}
                                >
                                  {task.taskCategory === 'launch' && <Rocket className="w-2 h-2 mr-1" />}
                                  {task.taskCategory}
                                </Badge>
                                <Badge 
                                  variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                {task.status === 'completed' && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    Done
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="px-6">
          <Card className="p-4 bg-white border border-border">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground mb-2">Month View</h3>
              <p className="text-sm text-muted-foreground">
                Full calendar view coming soon. Use week view for detailed task management.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Task Summary */}
      <div className="px-6 mt-6">
        <Card className="p-4 bg-white border border-border">
          <h3 className="font-medium text-foreground mb-3">This Week Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {filteredTasks.filter(t => t.status === 'pending' && t.taskCategory === 'project').length}
                </p>
                <p className="text-xs text-muted-foreground">Project Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">
                  {filteredTasks.filter(t => t.status === 'pending' && t.taskCategory === 'launch').length}
                </p>
                <p className="text-xs text-muted-foreground">Launch Tasks</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600">
                  {filteredTasks.filter(t => t.priority === 'high' && t.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">
                  {filteredTasks.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Launch Insights */}
      {taskFilter === 'launch' || taskFilter === 'all' ? (
        <div className="px-6 mt-4">
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">AI Calendar Insights</h3>
                <p className="text-sm text-foreground mb-3">
                  {filteredTasks.filter(t => t.taskCategory === 'launch' && t.hasAI).length} launch tasks have AI recommendations this week. 
                  Consider prioritizing music video production for maximum impact.
                </p>
                <Button variant="outline" size="sm" className="border-primary text-primary">
                  View AI Suggestions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}