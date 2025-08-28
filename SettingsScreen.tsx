import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { AppHeader } from './AppHeader';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  LogOut,
  ChevronRight,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Music,
  Headphones,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Settings as SettingsIcon,
  HelpCircle,
  MessageSquare,
  Star,
  Share,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
  user?: any;
}

export function SettingsScreen({ onNavigate, onLogout, user }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    deadline: true,
    collaboration: true,
    marketing: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoSync: true,
    offlineMode: false,
    highQualityAudio: true,
    autoBackup: true,
    shareAnalytics: false
  });

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || 'Artist',
    email: user?.email || 'artist@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    bio: 'Independent musician and producer creating meaningful sounds.'
  });

  const settingSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', icon: Edit, action: 'profile' },
        { label: 'Privacy & Security', icon: Shield, action: 'privacy' },
        { label: 'Billing & Subscription', icon: Star, action: 'subscription' }
      ]
    },
    {
      title: 'Preferences',
      icon: SettingsIcon,
      items: [
        { label: 'Notifications', icon: Bell, action: 'notifications' },
        { label: 'Audio & Recording', icon: Headphones, action: 'audio' },
        { label: 'Appearance', icon: Palette, action: 'appearance' }
      ]
    },
    {
      title: 'Data & Storage',
      icon: Download,
      items: [
        { label: 'Sync & Backup', icon: Download, action: 'backup' },
        { label: 'Storage Management', icon: Smartphone, action: 'storage' },
        { label: 'Export Data', icon: Share, action: 'export' }
      ]
    },
    {
      title: 'Development',
      icon: SettingsIcon,
      items: [
        { label: 'Backend Setup Guide', icon: Globe, action: 'setup' },
        { label: 'API Connection Status', icon: CheckCircle, action: 'api-status' }
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Help Center', icon: HelpCircle, action: 'help' },
        { label: 'Contact Support', icon: MessageSquare, action: 'support' },
        { label: 'Report a Bug', icon: AlertCircle, action: 'bug' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Settings" 
        subtitle="Manage your account and preferences"
        showBack={true}
        onBack={() => onNavigate?.('dashboard')}
      />

      <div className="pb-20 px-4 space-y-6">
        {/* Upgrade Banner for Free Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-orange-100 border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground">Unlock AI features and advanced tools</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => onNavigate?.('subscription')}
              >
                <Star className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pt-4"
        >
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <Button size="icon" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full">
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Pro Artist
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 flex-col gap-1">
              <Bell className="w-4 h-4" />
              <span className="text-xs">Notifications</span>
            </Button>
            <Button variant="outline" className="h-12 flex-col gap-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Privacy</span>
            </Button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{section.title}</h3>
              </div>

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                    onClick={() => {
                      if (item.action === 'subscription') {
                        onNavigate?.('subscription');
                      } else if (item.action === 'profile') {
                        onNavigate?.('profile');
                      } else if (item.action === 'setup') {
                        onNavigate?.('setup');
                      } else if (item.action === 'api-status') {
                        onNavigate?.('app-status');
                      } else {
                        // Handle other settings actions
                        console.log(`Open ${item.action} settings`);
                        // In a real app, these would open specific settings screens
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Quick Settings Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-primary" />
              Quick Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    {preferences.darkMode ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Use dark theme across the app</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified about important updates</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto Sync</p>
                    <p className="text-xs text-muted-foreground">Automatically sync your projects</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.autoSync}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoSync: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">High Quality Audio</p>
                    <p className="text-xs text-muted-foreground">Use lossless audio processing</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.highQualityAudio}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, highQualityAudio: checked }))
                  }
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">App Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="text-foreground">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span className="text-foreground">2024.12.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="text-foreground">2.3 GB / 5 GB</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 border-red-200 bg-red-50">
            <h3 className="font-medium text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Danger Zone
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}