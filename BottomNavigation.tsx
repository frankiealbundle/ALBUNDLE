import { Home, FolderOpen, Plus, Search, User, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  showCreateProject?: boolean;
  onCreateProject?: () => void;
}

export function BottomNavigation({ 
  currentScreen, 
  onNavigate,
  showCreateProject = true,
  onCreateProject
}: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'create-project', icon: Plus, label: 'Create', isSpecial: true },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'create-project' && onCreateProject) {
      onCreateProject();
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/20 shadow-lg z-30">
      {/* Gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
      
      <div className="relative flex items-center justify-around py-2 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          const isCreateButton = item.isSpecial;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 relative min-w-[64px] ${
                isCreateButton
                  ? 'bg-gradient-to-r from-primary via-primary to-orange-500 text-white shadow-lg shadow-primary/30 -mt-6 w-16 h-16 rounded-full'
                  : isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
              whileTap={{ scale: isCreateButton ? 0.9 : 0.95 }}
              whileHover={{ scale: isCreateButton ? 1.05 : 1.02 }}
            >
              {/* Active indicator line */}
              {isActive && !isCreateButton && (
                <motion.div
                  className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* Icon container */}
              <motion.div
                animate={isActive && !isCreateButton ? { y: -2 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative ${isCreateButton ? 'flex items-center justify-center w-full h-full' : 'mb-1'}`}
              >
                <Icon className={`${isCreateButton ? 'w-7 h-7' : 'w-5 h-5'} ${
                  isActive && !isCreateButton ? 'stroke-2' : 'stroke-[1.5]'
                } transition-all duration-200`} />
                
                {/* Create button inner glow */}
                {isCreateButton && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>
              
              {/* Label */}
              {!isCreateButton && (
                <motion.span 
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                >
                  {item.label}
                </motion.span>
              )}
              
              {/* Active background glow */}
              {isActive && !isCreateButton && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/5 to-primary/10 rounded-2xl -z-10"
                  layoutId="activeBackground"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Create button shadow ring */}
              {isCreateButton && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Safe area bottom padding */}
      <div className="h-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
    </div>
  );
}