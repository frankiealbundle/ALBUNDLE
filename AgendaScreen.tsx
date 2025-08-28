import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { AppHeader } from './AppHeader';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Music,
  Mic,
  Camera,
  Users,
  MapPin,
  Bell,
  MoreVertical,
  Play,
  CheckCircle,
  AlertTriangle,
  Timer,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface Task {
  id: string;
  title: string;
  type: 'recording' | 'meeting' | 'photoshoot' | 'deadline' | 'collaboration' | 'creative';
  project: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  collaborators?: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  description?: string;
}

interface AgendaScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  onCreateTask?: () => void;
  onEditTask?: (taskId: string) => void;
  selectedTaskId?: string;
  projectId?: string;
}

export function AgendaScreen({ 
  onNavigate, 
  onCreateTask, 
  onEditTask, 
  selectedTaskId, 
  projectId 
}: AgendaScreenProps = {}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Vocal Recording Session',
      type: 'recording',
      project: 'Midnight Dreams',
      startTime: new Date(2024, 11, 20, 14, 0),
      endTime: new Date(2024, 11, 20, 17, 0),
      location: 'Studio A',
      collaborators: ['Alex', 'Jordan'],
      priority: 'high',
      status: 'upcoming',
      description: 'Record lead vocals and harmonies for chorus'
    },
    {
      id: '2',
      title: 'Music Video Planning',
      type: 'meeting',
      project: 'Starlight',
      startTime: new Date(2024, 11, 20, 10, 30),
      endTime: new Date(2024, 11, 20, 12, 0),
      location: 'Conference Room',
      collaborators: ['Sam', 'Taylor'],
      priority: 'medium',
      status: 'completed',
      description: 'Discuss concept and storyboard'
    },
    {
      id: '3',
      title: 'Album Art Photoshoot',
      type: 'photoshoot',
      project: 'Ethereal Sounds',
      startTime: new Date(2024, 11, 21, 9, 0),
      endTime: new Date(2024, 11, 21, 13, 0),
      location: 'Downtown Studio',
      collaborators: ['Maya'],
      priority: 'high',
      status: 'upcoming',
      description: 'Outdoor and studio shots for album cover'
    },
    {
      id: '4',
      title: 'Mixing Deadline',
      type: 'deadline',
      project: 'Acoustic Sessions',
      startTime: new Date(2024, 11, 22, 23, 59),
      endTime: new Date(2024, 11, 22, 23, 59),
      priority: 'high',
      status: 'upcoming',
      description: 'Final mix must be delivered'
    },
    {
      id: '5',
      title: 'Collaboration Session',
      type: 'collaboration',
      project: 'Electronic Dreams',
      startTime: new Date(2024, 11, 23, 15, 0),
      endTime: new Date(2024, 11, 23, 18, 0),
      location: 'Virtual',
      collaborators: ['Chris', 'Alex'],
      priority: 'medium',
      status: 'upcoming',
      description: 'Remote collaboration on new track'
    },
    {
      id: '6',
      title: 'Creative Writing Session',
      type: 'creative',
      project: 'New Single',
      startTime: new Date(2024, 11, 20, 19, 0),
      endTime: new Date(2024, 11, 20, 21, 0),
      location: 'Home Studio',
      priority: 'low',
      status: 'upcoming',
      description: 'Songwriting and arrangement ideas'
    }
  ]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(task.startTime, date) ||
      (task.startTime < date && task.endTime > date)
    );
  };

  const getTasksForWeek = (date: Date) => {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.map(day => ({
      date: day,
      tasks: getTasksForDate(day)
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || task.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'recording': return <Mic className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'photoshoot': return <Camera className="w-4 h-4" />;
      case 'deadline': return <AlertTriangle className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'creative': return <Music className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTaskColor = (type: string, status: string) => {
    if (status === 'completed') return 'bg-green-100 border-green-200 text-green-800';
    if (status === 'overdue') return 'bg-red-100 border-red-200 text-red-800';
    if (status === 'in_progress') return 'bg-blue-100 border-blue-200 text-blue-800';
    
    switch (type) {
      case 'recording': return 'bg-red-50 border-red-200 text-red-800';
      case 'meeting': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'photoshoot': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'deadline': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'collaboration': return 'bg-green-50 border-green-200 text-green-800';
      case 'creative': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>;
      case 'upcoming':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Upcoming</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd');
  };

  const todaysTasks = getTasksForDate(new Date());
  const upcomingTasks = tasks.filter(task => 
    task.startTime > new Date() && 
    task.startTime < addDays(new Date(), 7)
  ).slice(0, 5);

  const handleDateChange = (date: Date) => {
    setIsLoading(true);
    setSelectedDate(date);
    setShowCalendar(false);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Agenda" 
        subtitle={format(selectedDate, 'MMMM yyyy')}
        notificationCount={todaysTasks.filter(t => t.status === 'upcoming').length}
        onSettings={() => onNavigate?.('settings')}
      />

      <div className="pb-20">
        {/* Quick Stats */}
        <div className="px-4 py-4">
          <motion.div 
            className="grid grid-cols-3 gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-700">{todaysTasks.length}</div>
                <div className="text-xs text-blue-600">Today</div>
              </div>
            </Card>
            <Card className="p-3 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-700">{upcomingTasks.length}</div>
                <div className="text-xs text-green-600">This Week</div>
              </div>
            </Card>
            <Card className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-700">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-xs text-purple-600">Completed</div>
              </div>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-border">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(selectedDate, 'MMM dd')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-auto p-0 max-w-none">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        handleDateChange(date);
                      }
                    }}
                    initialFocus
                    className="rounded-lg border"
                  />
                </DialogContent>
              </Dialog>
              
              <div className="flex bg-muted rounded-lg p-1">
                {(['day', 'week'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === 'day' ? 'Day' : 'Week'}
                  </Button>
                ))}
              </div>
            </div>

            <Button size="sm" className="bg-primary" onClick={onCreateTask}>
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-border"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="recording">Recording</option>
              <option value="meeting">Meetings</option>
              <option value="photoshoot">Photoshoot</option>
              <option value="deadline">Deadlines</option>
              <option value="collaboration">Collaboration</option>
              <option value="creative">Creative</option>
            </select>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-4">
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading tasks...</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && viewMode === 'day' && (
          <div className="px-4 space-y-4">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4 bg-white border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {format(selectedDate, 'EEEE, MMMM do')}
                  </h3>
                  <Badge className="bg-primary/10 text-primary">
                    {getTasksForDate(selectedDate).length} tasks
                  </Badge>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {getTasksForDate(selectedDate).length > 0 ? (
                      getTasksForDate(selectedDate).map((task, index) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${getTaskColor(task.type, task.status)} border hover:shadow-md transition-all duration-200`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                {getTaskIcon(task.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-foreground text-sm truncate">
                                    {task.title}
                                  </h4>
                                  {getStatusBadge(task.status)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{task.project}</p>
                                {task.description && (
                                  <p className="text-xs text-foreground mb-2">{task.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {formatTime(task.startTime)} - {formatTime(task.endTime)}
                                    </span>
                                  </div>
                                  {task.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{task.location}</span>
                                    </div>
                                  )}
                                  {task.collaborators && task.collaborators.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>+{task.collaborators.length}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {task.status === 'upcoming' && (
                                <Button size="icon" variant="ghost" className="w-6 h-6">
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                              {task.status === 'completed' && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              <Button size="icon" variant="ghost" className="w-6 h-6">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tasks scheduled for this day</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={onCreateTask}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Task
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4 bg-white border border-border">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  Upcoming This Week
                </h3>
                <div className="space-y-2">
                  {upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-muted rounded-lg flex items-center justify-center">
                          {getTaskIcon(task.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(task.startTime)} at {formatTime(task.startTime)}
                          </div>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)} border-0`}>
                        {task.priority}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {!isLoading && viewMode === 'week' && (
          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4 bg-white border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">
                    Week of {format(startOfWeek(selectedDate), 'MMM dd')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {getTasksForWeek(selectedDate).map((day, dayIndex) => (
                    <motion.div
                      key={day.date.toISOString()}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        isSameDay(day.date, new Date()) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground text-sm">
                          {format(day.date, 'EEEE, MMM dd')}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {day.tasks.length} tasks
                        </Badge>
                      </div>
                      
                      {day.tasks.length > 0 ? (
                        <div className="space-y-1">
                          {day.tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${
                                task.type === 'recording' ? 'bg-red-500' :
                                task.type === 'meeting' ? 'bg-blue-500' :
                                task.type === 'photoshoot' ? 'bg-purple-500' :
                                task.type === 'deadline' ? 'bg-orange-500' :
                                'bg-gray-500'
                              }`} />
                              <span className="truncate flex-1">{task.title}</span>
                              <span className="text-muted-foreground">
                                {formatTime(task.startTime)}
                              </span>
                            </div>
                          ))}
                          {day.tasks.length > 3 && (
                            <div className="text-xs text-muted-foreground pl-4">
                              +{day.tasks.length - 3} more...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground pl-4">No tasks scheduled</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}