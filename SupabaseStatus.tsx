import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, apiRequest } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'demo'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');

  const checkConnection = async () => {
    setStatus('checking');
    setError('');

    try {
      // Check if we're in demo mode
      if (projectId === 'demo-project-id') {
        setStatus('demo');
        setLastCheck(new Date());
        return;
      }

      // Test Supabase connection
      const { data, error: supabaseError } = await supabase.from('kv_store_dd758888').select('key').limit(1);
      
      if (supabaseError) {
        throw new Error(`Database: ${supabaseError.message}`);
      }

      // Test server function
      const healthResponse = await apiRequest('/health');
      
      if (!healthResponse.status) {
        throw new Error('Server function not responding');
      }

      setStatus('connected');
      setLastCheck(new Date());
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Connection failed');
      setLastCheck(new Date());
      console.error('Supabase connection error:', err);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: 'Live Backend Connected',
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: XCircle,
          text: 'Backend Error',
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600'
        };
      case 'demo':
        return {
          icon: AlertCircle,
          text: 'Demo Mode',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          iconColor: 'text-orange-600'
        };
      default:
        return {
          icon: RefreshCw,
          text: 'Checking...',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${statusInfo.color} px-3 py-1.5 text-xs font-medium border flex items-center gap-2`}
      >
        <statusInfo.icon 
          className={`w-3 h-3 ${statusInfo.iconColor} ${status === 'checking' ? 'animate-spin' : ''}`} 
        />
        {statusInfo.text}
        {status === 'connected' && projectId !== 'demo-project-id' && (
          <span className="text-xs opacity-75">({projectId.slice(0, 8)}...)</span>
        )}
      </Badge>
      
      {status === 'error' && (
        <Button
          size="sm"
          variant="outline"
          onClick={checkConnection}
          className="h-7 px-2 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
      
      {error && status === 'error' && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-md shadow-lg text-xs text-red-800 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}