import { useState } from 'react';
import { AppHeader } from './AppHeader';
import { AppHealthMonitor } from './AppHealthMonitor';
import { SupabaseStatus } from './SupabaseStatus';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Database, 
  Settings, 
  Monitor, 
  Zap,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useToast } from './ToastSystem';

interface AppStatusScreenProps {
  onNavigate?: (screen: string) => void;
}

export function AppStatusScreen({ onNavigate }: AppStatusScreenProps) {
  const { addToast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    addToast({
      type: 'success',
      title: 'Copied!',
      description: `${item} copied to clipboard`
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const isProduction = projectId !== 'demo-project-id';
  const supabaseUrl = `https://${projectId}.supabase.co`;

  const systemInfo = [
    {
      label: 'Environment',
      value: isProduction ? 'Production' : 'Demo Mode',
      type: isProduction ? 'success' : 'warning'
    },
    {
      label: 'Project ID',
      value: projectId,
      copyable: true
    },
    {
      label: 'Supabase URL',
      value: supabaseUrl,
      copyable: true,
      external: true
    },
    {
      label: 'Public API Key',
      value: `${publicAnonKey.slice(0, 20)}...`,
      copyable: true,
      copyValue: publicAnonKey
    },
    {
      label: 'App Version',
      value: '2.1.0'
    },
    {
      label: 'Build Date',
      value: '2024.12.20'
    }
  ];

  const quickActions = [
    {
      label: 'Backend Setup Guide',
      description: 'Complete setup instructions',
      icon: Settings,
      action: () => onNavigate?.('setup'),
      color: 'bg-blue-500'
    },
    {
      label: 'Supabase Dashboard',
      description: 'Open project dashboard',
      icon: ExternalLink,
      action: () => window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank'),
      color: 'bg-green-500'
    },
    {
      label: 'API Documentation',
      description: 'View API endpoints',
      icon: Database,
      action: () => window.open('https://supabase.com/docs', '_blank'),
      color: 'bg-purple-500'
    }
  ];

  const features = [
    {
      name: 'User Authentication',
      status: isProduction ? 'active' : 'demo',
      description: 'Sign up, login, and user management'
    },
    {
      name: 'Project Management',
      status: isProduction ? 'active' : 'demo',
      description: 'Create and manage music projects'
    },
    {
      name: 'Task Management',
      status: isProduction ? 'active' : 'demo',
      description: 'Track project tasks and deadlines'
    },
    {
      name: 'Real-time Collaboration',
      status: isProduction ? 'active' : 'demo',
      description: 'Live editing and collaboration features'
    },
    {
      name: 'AI Optimization',
      status: isProduction ? 'active' : 'demo',
      description: 'AI-powered timeline optimization'
    },
    {
      name: 'File Storage',
      status: isProduction ? 'active' : 'inactive',
      description: 'Audio file and asset storage'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'demo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="App Status" 
        subtitle="System health and configuration"
        showBack={true}
        onBack={() => onNavigate?.('settings')}
      />

      <div className="pb-20 px-4 py-4 max-w-4xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Albundle Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Current system status and quick overview
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {isProduction ? '100%' : '0%'}
                  </div>
                  <div className="text-sm text-muted-foreground">Backend Active</div>
                </div>
                
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">6</div>
                  <div className="text-sm text-muted-foreground">Features Ready</div>
                </div>
                
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {isProduction ? 'Live' : 'Demo'}
                  </div>
                  <div className="text-sm text-muted-foreground">Environment</div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                <SupabaseStatus />
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="font-medium text-foreground mb-4">Quick Actions</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex-col gap-3"
                    onClick={action.action}
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <AppHealthMonitor />
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card className="p-6">
              <h4 className="font-medium text-foreground mb-4">System Configuration</h4>
              
              <div className="space-y-4">
                {systemInfo.map((info, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-foreground">{info.label}</div>
                      {info.external && (
                        <div className="text-xs text-muted-foreground">External link</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {info.type && (
                        <Badge className={getStatusColor(info.type)}>
                          {info.value}
                        </Badge>
                      )}
                      
                      {!info.type && (
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {info.value}
                        </code>
                      )}
                      
                      {info.copyable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(info.copyValue || info.value, info.label)}
                        >
                          {copiedItem === info.label ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      
                      {info.external && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(info.value, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="p-6">
              <h4 className="font-medium text-foreground mb-4">Application Features</h4>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{feature.name}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}