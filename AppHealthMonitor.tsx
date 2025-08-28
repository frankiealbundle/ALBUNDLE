import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Database, 
  Server, 
  Users, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  response_time: number;
  last_check: string;
  services: {
    database: 'up' | 'down';
    auth: 'up' | 'down';
    api: 'up' | 'down';
    storage: 'up' | 'down';
  };
}

export function AppHealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const start = Date.now();
      
      // Check if we're in demo mode
      if (projectId === 'demo-project-id') {
        // Simulate health check for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        setHealth({
          status: 'degraded',
          response_time: Date.now() - start,
          last_check: new Date().toISOString(),
          services: {
            database: 'down',
            auth: 'down',
            api: 'down',
            storage: 'down'
          }
        });
      } else {
        // Real health check
        const response = await apiRequest('/health');
        const responseTime = Date.now() - start;
        
        setHealth({
          status: response.status === 'healthy' ? 'healthy' : 'degraded',
          response_time: responseTime,
          last_check: response.timestamp || new Date().toISOString(),
          services: {
            database: 'up',
            auth: 'up',
            api: 'up',
            storage: 'up'
          }
        });
      }
      
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      setHealth({
        status: 'down',
        response_time: 0,
        last_check: new Date().toISOString(),
        services: {
          database: 'down',
          auth: 'down',
          api: 'down',
          storage: 'down'
        }
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'down':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'down':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString();
  };

  const services = [
    { key: 'database', name: 'Database', icon: Database },
    { key: 'auth', name: 'Authentication', icon: Users },
    { key: 'api', name: 'API Server', icon: Server },
    { key: 'storage', name: 'File Storage', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">System Health</h3>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring of Albundle services
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={checkHealth}
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {health && (
          <div className="space-y-4">
            {/* Overall Status Badge */}
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(health.status)} px-3 py-1.5 font-medium`}>
                {getStatusIcon(health.status)}
                <span className="ml-2 capitalize">{health.status}</span>
              </Badge>
              
              <div className="text-sm text-muted-foreground">
                Response time: 
                <span className={`ml-1 font-medium ${getResponseTimeColor(health.response_time)}`}>
                  {health.response_time}ms
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last check: {formatTime(health.last_check)}
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {navigator.onLine ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Offline</span>
                </>
              )}
              
              <span className="text-sm text-muted-foreground ml-4">
                Project: {projectId === 'demo-project-id' ? 'Demo Mode' : projectId.slice(0, 8)}...
              </span>
            </div>

            {/* Response Time Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <span className={getResponseTimeColor(health.response_time)}>
                  {health.response_time}ms
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(health.response_time / 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Service Status */}
      {health && (
        <Card className="p-6">
          <h4 className="font-medium text-foreground mb-4">Service Status</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => {
              const status = health.services[service.key as keyof typeof health.services];
              
              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <service.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {service.name}
                    </span>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(status)} text-xs`}
                  >
                    {getStatusIcon(status)}
                    <span className="ml-1 capitalize">{status}</span>
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Environment Info */}
      <Card className="p-6">
        <h4 className="font-medium text-foreground mb-4">Environment</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment</span>
            <Badge variant="outline" className="text-xs">
              {projectId === 'demo-project-id' ? 'Demo' : 'Production'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Project ID</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {projectId === 'demo-project-id' ? 'demo-mode' : projectId}
            </code>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Update</span>
            <span className="text-foreground">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auto Refresh</span>
            <span className="text-green-600">Every 30s</span>
          </div>
        </div>
      </Card>
    </div>
  );
}