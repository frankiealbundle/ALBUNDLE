import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import { AppHeader } from './AppHeader';
import { 
  Users, 
  Mic, 
  Video, 
  Share2, 
  MessageSquare, 
  Edit3, 
  Play, 
  Pause,
  Volume2,
  Settings,
  UserPlus,
  Eye,
  Timer,
  Zap,
  Music,
  Clock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';

interface CollaborationScreenProps {
  user: any;
  projectId: string;
}

export function CollaborationScreen({ user, projectId: currentProjectId }: CollaborationScreenProps) {
  const [collaborators, setCollaborators] = useState([
    { 
      id: user?.id || 'user_1', 
      name: user?.user_metadata?.name || 'You', 
      avatar: '', 
      status: 'active', 
      cursor_position: null,
      last_activity: new Date().toISOString(),
      role: 'owner'
    }
  ]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'System',
      message: 'Collaboration session started',
      timestamp: new Date().toISOString(),
      type: 'system'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionData, setSessionData] = useState({
    active_users: 1,
    session_duration: 0,
    changes_count: 0,
    last_sync: new Date().toISOString()
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef(Date.now());

  // Simulate real-time collaboration effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Update session duration
      setSessionData(prev => ({
        ...prev,
        session_duration: Math.floor((Date.now() - sessionStartTime.current) / 1000)
      }));

      // Simulate audio levels when recording
      if (isRecording) {
        setAudioLevel(Math.random() * 100);
      }

      // Simulate new collaborators joining occasionally
      if (Math.random() > 0.98 && collaborators.length < 4) {
        const newCollaborator = {
          id: `user_${Date.now()}`,
          name: ['Alex', 'Jordan', 'Sam', 'Taylor'][Math.floor(Math.random() * 4)],
          avatar: '',
          status: 'active' as const,
          cursor_position: null,
          last_activity: new Date().toISOString(),
          role: 'collaborator' as const
        };
        setCollaborators(prev => [...prev, newCollaborator]);
        
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          user: 'System',
          message: `${newCollaborator.name} joined the session`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, collaborators.length]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: user?.user_metadata?.name || 'You',
        message: currentMessage.trim(),
        timestamp: new Date().toISOString(),
        type: 'user' as const
      };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
      
      setSessionData(prev => ({
        ...prev,
        changes_count: prev.changes_count + 1,
        last_sync: new Date().toISOString()
      }));
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
                     : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const collaborationFeatures = [
    { icon: Edit3, label: 'Live Editing', active: true },
    { icon: Mic, label: 'Voice Chat', active: isRecording },
    { icon: Video, label: 'Screen Share', active: false },
    { icon: Share2, label: 'File Sync', active: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Live Collaboration" 
        subtitle={`Project: ${currentProjectId}`}
        notificationCount={messages.filter(m => m.type === 'system').length}
      />

      <div className="pb-20">
        {/* Session Status Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-blue-50 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Live Session</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {formatDuration(sessionData.session_duration)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                {sessionData.changes_count} changes
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Active Collaborators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-white border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Active Collaborators ({collaborators.length})
                </h3>
                <Button size="sm" variant="outline" className="text-xs">
                  <UserPlus className="w-3 h-3 mr-1" />
                  Invite
                </Button>
              </div>

              <div className="space-y-3">
                {collaborators.map((collaborator, index) => (
                  <motion.div
                    key={collaborator.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8 bg-primary/10">
                        <span className="text-xs font-medium text-primary">
                          {collaborator.name.substring(0, 2).toUpperCase()}
                        </span>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {collaborator.name}
                        </span>
                        {collaborator.role === 'owner' && (
                          <Badge variant="default" className="text-xs h-4">Owner</Badge>
                        )}
                        {collaborator.id === (user?.id || 'user_1') && (
                          <Badge variant="secondary" className="text-xs h-4">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last activity: {new Date(collaborator.last_activity).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {collaborator.status === 'active' && (
                        <Eye className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Collaboration Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-white border border-border">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Collaboration Tools
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {collaborationFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={feature.active ? "default" : "outline"}
                      className={`w-full h-12 flex-col ${
                        feature.active 
                          ? 'bg-primary text-white' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        if (feature.label === 'Voice Chat') {
                          setIsRecording(!isRecording);
                        }
                      }}
                    >
                      <feature.icon className="w-4 h-4 mb-1" />
                      <span className="text-xs">{feature.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Audio Level Indicator */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-red-700">Recording</span>
                      <div className="flex-1 bg-red-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-red-500"
                          style={{ width: `${audioLevel}%` }}
                          animate={{ width: `${audioLevel}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-red-600">{Math.round(audioLevel)}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Live Document Editing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-white border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" />
                  Live Document: Project Notes
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Last sync: {new Date(sessionData.last_sync).toLocaleTimeString()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <div className="text-sm text-foreground">
                    <p className="mb-2">
                      <span className="font-medium">Track 1: Midnight Dreams</span>
                      <motion.span
                        className="inline-block w-0.5 h-4 bg-primary ml-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Vocal recording scheduled for 2 PM</li>
                      <li>• Need to adjust harmony in chorus</li>
                      <li>• Alex working on guitar solo arrangement 
                        <Badge variant="secondary" className="text-xs ml-2 h-4">Live Edit</Badge>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Alex is typing...</span>
                  </div>
                  <Separator orientation="vertical" className="h-3" />
                  <span>Auto-save enabled</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Real-time Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-white border border-border">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Live Chat
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${
                      message.type === 'system' ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {message.user.substring(0, 1)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{message.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground break-words">{message.message}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-input-background border-border"
                />
                <Button size="sm" onClick={sendMessage} disabled={!currentMessage.trim()}>
                  Send
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Session Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Session Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">{formatDuration(sessionData.session_duration)}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary">{sessionData.changes_count}</div>
                  <div className="text-xs text-muted-foreground">Changes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{collaborators.length}</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}