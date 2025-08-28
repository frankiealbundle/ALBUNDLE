import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { AppHeader } from './AppHeader';
import { 
  Music, 
  Download, 
  Upload, 
  Link, 
  Settings, 
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Headphones,
  AudioWaveform,
  RotateCcw,
  Save,
  FolderOpen,
  Zap,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Mic,
  Music2,
  Radio,
  Speaker,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DAWIntegrationScreenProps {
  user: any;
  currentProjectId?: string;
}

export function DAWIntegrationScreen({ user, currentProjectId = 'project_1' }: DAWIntegrationScreenProps) {
  const [connectedDAWs, setConnectedDAWs] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [audioSettings, setAudioSettings] = useState({
    sampleRate: 44100,
    bitDepth: 24,
    bufferSize: 256,
    autoSync: true,
    cloudBackup: true
  });
  const [projectFiles, setProjectFiles] = useState([
    { id: 1, name: 'Midnight Dreams - Main Mix.wav', size: '45.2 MB', type: 'audio', daw: 'pro_tools', lastModified: '2 hours ago' },
    { id: 2, name: 'Guitar Solo Takes.ptx', size: '123.5 MB', type: 'project', daw: 'pro_tools', lastModified: '1 day ago' },
    { id: 3, name: 'Starlight - Logic Session.logicx', size: '89.1 MB', type: 'project', daw: 'logic', lastModified: '3 days ago' }
  ]);

  const supportedDAWs = [
    {
      id: 'pro_tools',
      name: 'Pro Tools',
      icon: '🎵',
      description: 'Industry standard for professional audio',
      features: ['Real-time collaboration', 'Cloud projects', 'Advanced mixing'],
      status: 'connected',
      version: '2024.3'
    },
    {
      id: 'logic',
      name: 'Logic Pro',
      icon: '🎹',
      description: 'Apple\'s professional music creation suite',
      features: ['Logic Remote', 'Flex Time', 'Built-in instruments'],
      status: 'available',
      version: 'Latest'
    },
    {
      id: 'ableton',
      name: 'Ableton Live',
      icon: '🔊',
      description: 'Perfect for electronic music and live performance',
      features: ['Session view', 'Max for Live', 'Push integration'],
      status: 'available',
      version: 'Live 12'
    },
    {
      id: 'fl_studio',
      name: 'FL Studio',
      icon: '🎧',
      description: 'Comprehensive digital audio workstation',
      features: ['Lifetime updates', 'Pattern sequencer', 'Plugin hosting'],
      status: 'available',
      version: '21.2'
    },
    {
      id: 'cubase',
      name: 'Cubase',
      icon: '🎸',
      description: 'Steinberg\'s flagship music production software',
      features: ['VariAudio', 'Expression Maps', 'MIDI tools'],
      status: 'coming_soon',
      version: '13'
    },
    {
      id: 'studio_one',
      name: 'Studio One',
      icon: '🎼',
      description: 'Modern DAW with drag-and-drop workflow',
      features: ['Single window interface', 'Mastering suite', 'Cloud collaboration'],
      status: 'coming_soon',
      version: '6.5'
    }
  ];

  useEffect(() => {
    // Simulate checking for connected DAWs
    setConnectedDAWs(['pro_tools']);
    
    // Simulate active session
    setActiveSession({
      id: 'session_123',
      daw_type: 'pro_tools',
      project_name: 'Midnight Dreams',
      duration: 145,
      tracks: 12,
      status: 'recording',
      last_activity: new Date().toISOString()
    });
  }, []);

  const connectDAW = async (dawId: string) => {
    setIsConnecting(dawId);
    
    try {
      // Get access token from current session
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token || publicAnonKey;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dd758888/daw/session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            project_id: currentProjectId,
            daw_type: dawId,
            session_data: {
              settings: audioSettings,
              timestamp: new Date().toISOString()
            }
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setConnectedDAWs(prev => [...prev, dawId]);
        setActiveSession(data.session);
      } else {
        console.error('Failed to connect DAW:', data.error);
      }
    } catch (error) {
      console.error('Error connecting DAW:', error);
      // Simulate successful connection for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectedDAWs(prev => [...prev, dawId]);
    } finally {
      setIsConnecting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'available': return <Link className="w-4 h-4 text-blue-500" />;
      case 'coming_soon': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 border-green-200';
      case 'available': return 'bg-blue-50 border-blue-200';
      case 'coming_soon': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return <AudioWaveform className="w-4 h-4 text-primary" />;
      case 'project': return <FolderOpen className="w-4 h-4 text-blue-500" />;
      case 'midi': return <Music2 className="w-4 h-4 text-purple-500" />;
      default: return <Music className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="DAW Integration" 
        subtitle="Connect your digital audio workstations"
        notificationCount={connectedDAWs.length}
      />

      <div className="pb-20">
        {/* Active Session Status */}
        {activeSession && (
          <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-green-50 border-b border-primary/20">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{activeSession.project_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Pro Tools • {activeSession.tracks} tracks</span>
                    <span>{formatDuration(activeSession.duration)}</span>
                    <Badge variant={activeSession.status === 'recording' ? 'destructive' : 'secondary'} className="text-xs">
                      {activeSession.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
                <Button size="sm" className="bg-primary">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open in DAW
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="px-6 py-4 space-y-6">
          {/* Connected DAWs Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-white border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Link className="w-4 h-4 text-primary" />
                  Connected Workstations ({connectedDAWs.length})
                </h3>
                <Button size="sm" variant="outline">
                  <Zap className="w-4 h-4 mr-1" />
                  Auto-Detect
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {supportedDAWs.map((daw, index) => (
                  <motion.div
                    key={daw.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getStatusColor(daw.status)} hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{daw.icon}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{daw.name}</h4>
                            {getStatusIcon(daw.status)}
                            <Badge variant="outline" className="text-xs">{daw.version}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{daw.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {daw.features.slice(0, 2).map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        {daw.status === 'connected' ? (
                          <Button size="sm" variant="outline" disabled>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Connected
                          </Button>
                        ) : daw.status === 'available' ? (
                          <Button 
                            size="sm" 
                            onClick={() => connectDAW(daw.id)}
                            disabled={isConnecting === daw.id}
                          >
                            {isConnecting === daw.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Link className="w-4 h-4 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-white border border-border">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Audio Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sampleRate" className="text-sm font-medium text-foreground">Sample Rate</Label>
                  <select 
                    id="sampleRate"
                    value={audioSettings.sampleRate}
                    onChange={(e) => setAudioSettings(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-white text-sm"
                  >
                    <option value={44100}>44.1 kHz</option>
                    <option value={48000}>48 kHz</option>
                    <option value={88200}>88.2 kHz</option>
                    <option value={96000}>96 kHz</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bitDepth" className="text-sm font-medium text-foreground">Bit Depth</Label>
                  <select 
                    id="bitDepth"
                    value={audioSettings.bitDepth}
                    onChange={(e) => setAudioSettings(prev => ({ ...prev, bitDepth: parseInt(e.target.value) }))}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-white text-sm"
                  >
                    <option value={16}>16-bit</option>
                    <option value={24}>24-bit</option>
                    <option value={32}>32-bit</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bufferSize" className="text-sm font-medium text-foreground">Buffer Size</Label>
                  <select 
                    id="bufferSize"
                    value={audioSettings.bufferSize}
                    onChange={(e) => setAudioSettings(prev => ({ ...prev, bufferSize: parseInt(e.target.value) }))}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-white text-sm"
                  >
                    <option value={64}>64 samples</option>
                    <option value={128}>128 samples</option>
                    <option value={256}>256 samples</option>
                    <option value={512}>512 samples</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSync" className="text-sm font-medium text-foreground">Auto Sync</Label>
                    <Switch
                      id="autoSync"
                      checked={audioSettings.autoSync}
                      onCheckedChange={(checked) => setAudioSettings(prev => ({ ...prev, autoSync: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cloudBackup" className="text-sm font-medium text-foreground">Cloud Backup</Label>
                    <Switch
                      id="cloudBackup"
                      checked={audioSettings.cloudBackup}
                      onCheckedChange={(checked) => setAudioSettings(prev => ({ ...prev, cloudBackup: checked }))}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Project Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-white border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  Project Files ({projectFiles.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <Button size="sm" variant="outline">
                    <Cloud className="w-4 h-4 mr-1" />
                    Sync All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {projectFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{file.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{file.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {file.daw === 'pro_tools' ? 'Pro Tools' : file.daw === 'logic' ? 'Logic Pro' : file.daw}
                          </Badge>
                          <span>Modified {file.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 flex-col border-blue-200 hover:bg-blue-50">
                  <Mic className="w-4 h-4 mb-1" />
                  <span className="text-xs">Start Recording</span>
                </Button>
                <Button variant="outline" className="h-12 flex-col border-blue-200 hover:bg-blue-50">
                  <Save className="w-4 h-4 mb-1" />
                  <span className="text-xs">Save Session</span>
                </Button>
                <Button variant="outline" className="h-12 flex-col border-blue-200 hover:bg-blue-50">
                  <Speaker className="w-4 h-4 mb-1" />
                  <span className="text-xs">Monitor Audio</span>
                </Button>
                <Button variant="outline" className="h-12 flex-col border-blue-200 hover:bg-blue-50">
                  <Radio className="w-4 h-4 mb-1" />
                  <span className="text-xs">Live Stream</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}