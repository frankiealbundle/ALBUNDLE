import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Rocket, 
  Settings, 
  X,
  ExternalLink,
  Database
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ProductionReadyBannerProps {
  onNavigate?: (screen: string) => void;
  className?: string;
}

export function ProductionReadyBanner({ onNavigate, className = '' }: ProductionReadyBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  const isProduction = projectId !== 'demo-project-id';
  
  // Don't show if in production mode or if dismissed
  if (isProduction || isDismissed) {
    return null;
  }

  const handleSetup = () => {
    onNavigate?.('setup');
  };

  const handleStatus = () => {
    onNavigate?.('app-status');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`relative ${className}`}
      >
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-foreground">Ready to Go Live?</h3>
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                  Demo Mode
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                Your Albundle prototype is ready for production! Connect your Supabase backend to unlock all features.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleSetup}
                  className="bg-primary hover:bg-primary/90 text-white h-8"
                >
                  <Rocket className="w-3 h-3 mr-1" />
                  Setup Backend
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStatus}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 h-8"
                >
                  <Database className="w-3 h-3 mr-1" />
                  Check Status
                </Button>
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDismiss}
              className="w-6 h-6 text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Status indicator component for the top of the app
export function ProductionStatusIndicator() {
  const isProduction = projectId !== 'demo-project-id';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <Badge 
        className={`
          ${isProduction 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-orange-100 text-orange-800 border-orange-200'
          } 
          px-2 py-1 shadow-sm
        `}
      >
        {isProduction ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : (
          <AlertTriangle className="w-3 h-3 mr-1" />
        )}
        {isProduction ? 'Live' : 'Demo'}
      </Badge>
    </motion.div>
  );
}