import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert } from './ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Copy, 
  AlertTriangle,
  Database,
  Server,
  Users,
  Settings
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function SetupGuide() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const setupSteps = [
    {
      id: 'database',
      title: 'Database Setup',
      description: 'Your Supabase database should already have the KV store table',
      status: 'info' as const,
      icon: Database,
      checks: [
        'kv_store_dd758888 table exists',
        'Row Level Security (RLS) policies configured'
      ],
      sqlQueries: [
        {
          name: 'Check KV Store Table',
          query: `SELECT * FROM information_schema.tables 
WHERE table_name = 'kv_store_dd758888';`
        }
      ]
    },
    {
      id: 'functions',
      title: 'Edge Functions',
      description: 'Deploy your server functions to Supabase',
      status: 'warning' as const,
      icon: Server,
      checks: [
        'Server function deployed to Supabase',
        'Environment variables configured',
        'Function accessible via HTTPS'
      ],
      commands: [
        {
          name: 'Deploy Edge Function',
          command: 'supabase functions deploy server'
        },
        {
          name: 'Set Environment Variables',
          command: `supabase secrets set SUPABASE_URL=https://${projectId}.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`
        }
      ]
    },
    {
      id: 'auth',
      title: 'Authentication Setup',
      description: 'Configure authentication providers and settings',
      status: 'info' as const,
      icon: Users,
      checks: [
        'Email authentication enabled',
        'OAuth providers configured (optional)',
        'User metadata fields configured'
      ],
      settings: [
        {
          name: 'Email Confirmation',
          description: 'Disable email confirmation for development',
          path: 'Authentication > Settings > Email confirmation'
        },
        {
          name: 'OAuth Providers',
          description: 'Configure Google, GitHub, Twitter if needed',
          path: 'Authentication > Providers'
        }
      ]
    },
    {
      id: 'rls',
      title: 'Security Policies',
      description: 'Set up Row Level Security for data protection',
      status: 'warning' as const,
      icon: Settings,
      checks: [
        'RLS enabled on kv_store_dd758888',
        'User-specific data access policies',
        'Admin access for server function'
      ],
      sqlQueries: [
        {
          name: 'Enable RLS',
          query: 'ALTER TABLE kv_store_dd758888 ENABLE ROW LEVEL SECURITY;'
        },
        {
          name: 'User Data Policy',
          query: `CREATE POLICY "Users can access own data" 
ON kv_store_dd758888 
FOR ALL 
USING (key LIKE 'user:' || auth.uid() || '%');`
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Albundle Backend Setup Guide
        </h1>
        <p className="text-muted-foreground mb-6">
          Complete these steps to activate your live backend for project ID: 
          <code className="bg-muted px-2 py-1 rounded text-sm font-mono mx-2">
            {projectId}
          </code>
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4" />
          <div>
            <p className="font-medium">Important:</p>
            <p className="text-sm">
              Your app is currently configured with real Supabase credentials but may still fall back to demo mode if the backend isn't fully configured.
            </p>
          </div>
        </Alert>
      </div>

      {/* Setup Steps */}
      <div className="grid gap-6">
        {setupSteps.map((step) => {
          const StatusIcon = getStatusIcon(step.status);
          
          return (
            <Card key={step.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <Badge className={`${getStatusColor(step.status)} text-xs`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {step.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  
                  {/* Checklist */}
                  <div className="space-y-2 mb-4">
                    {step.checks.map((check, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 border border-muted-foreground/30 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted-foreground/30 rounded" />
                        </div>
                        {check}
                      </div>
                    ))}
                  </div>
                  
                  {/* SQL Queries */}
                  {step.sqlQueries && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">SQL Commands:</h4>
                      {step.sqlQueries.map((query, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{query.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(query.query, `${step.id}-query-${index}`)}
                            >
                              {copiedItem === `${step.id}-query-${index}` ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs bg-muted/50 p-2 rounded block font-mono whitespace-pre-wrap">
                            {query.query}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* CLI Commands */}
                  {step.commands && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">CLI Commands:</h4>
                      {step.commands.map((cmd, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{cmd.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(cmd.command, `${step.id}-cmd-${index}`)}
                            >
                              {copiedItem === `${step.id}-cmd-${index}` ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs bg-muted/50 p-2 rounded block font-mono whitespace-pre-wrap">
                            {cmd.command}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Settings */}
                  {step.settings && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Dashboard Settings:</h4>
                      {step.settings.map((setting, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{setting.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {setting.description}
                          </p>
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded">
                            {setting.path}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Quick Links */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank')}
          >
            <ExternalLink className="w-5 h-5" />
            <span>Supabase Dashboard</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
          >
            <Server className="w-5 h-5" />
            <span>Edge Functions</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex-col gap-2"
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/auth/users`, '_blank')}
          >
            <Users className="w-5 h-5" />
            <span>Authentication</span>
          </Button>
        </div>
      </Card>
      
      {/* Testing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test Your Setup</h3>
        <p className="text-muted-foreground mb-4">
          Once you've completed the setup steps, test your backend by:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Creating a new user account
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Creating a new project
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Adding tasks to your project
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Using the collaboration features
          </div>
        </div>
      </Card>
    </div>
  );
}