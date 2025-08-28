import albundleLogo from 'figma:asset/3ae0606ee5d9055ceef427e84776613477a14947.png';
import { Bell, Settings, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showBack?: boolean;
  actions?: React.ReactNode;
  notificationCount?: number;
  onBack?: () => void;
  onSettings?: () => void;
}

export function AppHeader({ 
  title, 
  subtitle, 
  showLogo = true, 
  showBack = false,
  actions, 
  notificationCount = 0,
  onBack,
  onSettings
}: AppHeaderProps) {
  return (
    <div className="bg-white border-b border-border">
      {/* Logo Section - Larger and more prominent */}
      {showLogo && (
        <div className="px-6 py-4 border-b border-border/50">
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-12 w-auto">
              <img 
                src={albundleLogo} 
                alt="Albundle" 
                className="h-full w-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Header Content */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="hover:bg-primary/10 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <motion.h1 
                className="text-lg font-semibold text-foreground truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p 
                className="text-sm text-muted-foreground truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions || (
            <>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSettings}
                className="hover:bg-primary/10"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}