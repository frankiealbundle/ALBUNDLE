import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Users, 
  Bot, 
  Music, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Eye,
  MessageSquare,
  Zap,
  Calendar,
  Mic,
  Camera,
  Play
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'collaboration' | 'ai' | 'system' | 'deadline' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionCallback?: () => void;
  projectId?: string;
  userAvatar?: string;
}

interface NotificationSystemProps {
  user?: any;
  isVisible: boolean;
  onClose: () => void;
}

export function NotificationSystem({ user, isVisible, onClose }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Simulate real-time notifications
  useEffect(() => {
    // Initialize with some sample notifications
    const initialNotifications: Notification[] = [
      {
        id: 'notif_1',
        type: 'collaboration',
        title: 'Alex joined your session',
        message: 'Alex is now collaborating on "Midnight Dreams" project',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium',
        actionLabel: 'Join Session',
        actionCallback: () => console.log('Join collaboration session'),
        projectId: 'project_1',
        userAvatar: 'A'
      },
      {
        id: 'notif_2',
        type: 'ai',
        title: 'AI Optimization Ready',
        message: 'New timeline optimization suggestions available for your project',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
        actionLabel: 'View Suggestions',
        actionCallback: () => console.log('Open AI optimization'),
        projectId: 'project_1'
      },
      {
        id: 'notif_3',
        type: 'deadline',
        title: 'Upcoming Deadline',
        message: 'Vocal recording for "Starlight" is due in 2 hours',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true,
        priority: 'high',
        actionLabel: 'View Task',
        actionCallback: () => console.log('Open task details'),
        projectId: 'project_2'
      },
      {
        id: 'notif_4',
        type: 'update',
        title: 'Project File Updated',
        message: 'Jordan updated "Guitar Solo Takes.ptx" in Pro Tools',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low',
        projectId: 'project_1',
        userAvatar: 'J'
      },
      {
        id: 'notif_5',
        type: 'system',
        title: 'DAW Connection Established',
        message: 'Successfully connected to Pro Tools. Ready for recording.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'medium'
      }
    ];

    setNotifications(initialNotifications);

    // Simulate new notifications coming in
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: `notif_${Date.now()}_1`,
          type: 'collaboration' as const,
          title: 'Sam started editing',
          message: 'Sam is now editing the arrangement for "Ethereal Sounds"',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'low' as const,
          userAvatar: 'S'
        },
        {
          id: `notif_${Date.now()}_2`,
          type: 'ai' as const,
          title: 'Smart Suggestion',
          message: 'AI suggests batching your recording sessions for better efficiency',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium' as const,
          actionLabel: 'View Details'
        },
        {
          id: `notif_${Date.now()}_3`,
          type: 'update' as const,
          title: 'Mix Updated',
          message: 'Your mix for "Midnight Dreams" has been automatically saved',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'low' as const
        }
      ];

      // Add random notification occasionally
      if (Math.random() > 0.7) {
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        setNotifications(prev => [randomNotif, ...prev.slice(0, 19)]); // Keep max 20 notifications
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'collaboration': return <Users className="w-4 h-4 text-blue-500" />;
      case 'ai': return <Bot className="w-4 h-4 text-purple-500" />;
      case 'deadline': return <Clock className="w-4 h-4 text-red-500" />;
      case 'update': return <Music className="w-4 h-4 text-green-500" />;
      case 'system': return <Info className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const filterOptions = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'unread', label: 'Unread', icon: Eye, count: unreadCount },
    { id: 'collaboration', label: 'Collab', icon: Users },
    { id: 'ai', label: 'AI', icon: Bot },
    { id: 'deadline', label: 'Deadlines', icon: Clock },
    { id: 'system', label: 'System', icon: Info }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Notifications</h2>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 overflow-x-auto">
              {filterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={filter === option.id ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 text-xs h-7"
                  onClick={() => setFilter(option.id)}
                >
                  <option.icon className="w-3 h-3 mr-1" />
                  {option.label}
                  {option.count && option.count > 0 && (
                    <Badge className="ml-1 h-4 px-1 text-xs bg-red-500 text-white">
                      {option.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-white' : 'bg-muted/20'
                    } border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {notification.userAvatar ? (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {notification.userAvatar}
                            </span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs h-4">
                              {notification.type}
                            </Badge>
                            {notification.priority === 'high' && (
                              <Badge className="text-xs h-4 bg-red-100 text-red-700 border-red-200">
                                urgent
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {notification.actionLabel && notification.actionCallback && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-primary hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.actionCallback?.();
                                }}
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'unread' 
                      ? 'All caught up! No unread notifications.'
                      : `No ${filter} notifications at the moment.`
                    }
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredNotifications.length} notifications</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live updates active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}