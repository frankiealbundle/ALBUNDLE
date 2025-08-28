import { useState, useEffect } from "react";
import { DashboardScreen } from "./components/DashboardScreen";
import { ProjectsScreen } from "./components/ProjectsScreen";
import { AgendaScreen } from "./components/AgendaScreen";
import { SearchScreen } from "./components/SearchScreen";
import { ArtistProfileScreen } from "./components/ArtistProfileScreen";
import { CreateProjectScreen } from "./components/CreateProjectScreen";
import { CreateTaskScreen } from "./components/CreateTaskScreen";
import { ProjectDetailsScreen } from "./components/ProjectDetailsScreen";
import { CollaborationScreen } from "./components/CollaborationScreen";
import { AIOptimizationScreen } from "./components/AIOptimizationScreen";
import { DAWIntegrationScreen } from "./components/DAWIntegrationScreen";
import { LoginScreen } from "./components/LoginScreen";
import { SignUpScreen } from "./components/SignUpScreen";
import { SplashScreen } from "./components/SplashScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { SubscriptionScreen } from "./components/SubscriptionScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { NotificationSystem } from "./components/NotificationSystem";
import { SupabaseStatus } from "./components/SupabaseStatus";
import { SetupGuide } from "./components/SetupGuide";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  ToastProvider,
  useToast,
} from "./components/ToastSystem";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { AppStatusScreen } from "./components/AppStatusScreen";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Users,
  Bot,
  Music,
  LogOut,
  Settings,
  Zap,
  ArrowLeft,
  X,
  Calendar,
  Headphones,
  Lightbulb,
  Mic,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "./utils/supabase/client";
import { AuthScreen } from "./components/AuthScreen";
import { projectId } from "./utils/supabase/info";

export type Screen =
  | "splash"
  | "login"
  | "signup"
  | "dashboard"
  | "projects"
  | "agenda"
  | "search"
  | "profile"
  | "create-project"
  | "create-task"
  | "project-details"
  | "collaboration"
  | "ai-optimization"
  | "daw-integration"
  | "settings"
  | "subscription"
  | "setup"
  | "app-status";

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("splash");
  const [previousScreen, setPreviousScreen] =
    useState<Screen>("dashboard");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedMenu, setShowAdvancedMenu] =
    useState(false);
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [navigationData, setNavigationData] =
    useState<any>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setCurrentScreen("dashboard");
        } else {
          setCurrentScreen("login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        setCurrentScreen("login");
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setCurrentScreen("dashboard");
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setCurrentScreen("login");
        }
      },
    );

    checkSession();

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen("login");
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentScreen("dashboard");
  };

  const handleSignUp = (userData: any) => {
    setUser(userData);
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentScreen("login");
      setShowAdvancedMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear user state anyway
      setUser(null);
      setCurrentScreen("login");
      setShowAdvancedMenu(false);
    }
  };

  const handleNavigation = (screen: Screen, data?: any) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    setNavigationData(data);
    setShowAdvancedMenu(false);
  };

  const handleBackNavigation = () => {
    const mainScreens = [
      "dashboard",
      "projects",
      "agenda",
      "search",
      "profile",
    ];
    if (mainScreens.includes(previousScreen)) {
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen("dashboard");
    }
  };

  const mainScreens = [
    "dashboard",
    "projects",
    "agenda",
    "search",
    "profile",
  ];
  const advancedScreens = [
    "collaboration",
    "ai-optimization",
    "daw-integration",
    "settings",
    "subscription",
  ];
  const creationScreens = ["create-project", "create-task"];
  const detailScreens = ["project-details"];
  const showBottomNav =
    user &&
    (mainScreens.includes(currentScreen) ||
      creationScreens.includes(currentScreen));
  const showAdvancedFeatures =
    user && currentScreen === "dashboard";
  const showBackButton =
    user &&
    (advancedScreens.includes(currentScreen) ||
      creationScreens.includes(currentScreen) ||
      detailScreens.includes(currentScreen));

  // Advanced features menu with enhanced mobile presentation
  const advancedFeatures = [
    {
      id: "collaboration",
      icon: Users,
      title: "Live Collaboration",
      description: "Real-time editing with team",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "ai-optimization",
      icon: Bot,
      title: "AI Timeline Optimizer",
      description: "Smart project scheduling",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "daw-integration",
      icon: Music,
      title: "DAW Integration",
      description: "Connect audio workstations",
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600",
    },
  ];

  // Quick actions for mobile
  const quickActions = [
    {
      id: "agenda",
      icon: Calendar,
      title: "Agenda",
      color: "bg-orange-500",
    },
    {
      id: "projects",
      icon: Mic,
      title: "Projects",
      color: "bg-red-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          variant="music"
          text="Loading Albundle..."
        />
      </div>
    );
  }

  if (currentScreen === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        {currentScreen === "login" ||
        currentScreen === "signup" ? (
          <AuthScreen onAuthSuccess={handleLogin} />
        ) : (
          <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Supabase Status Indicator */}
            <SupabaseStatus />
            {/* Mobile Header for Advanced Screens */}
            {showBackButton && (
              <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
                <div className="flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackNavigation}
                    className="rounded-full w-10 h-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <div className="text-center flex-1">
                    <h1 className="font-medium text-foreground">
                      {currentScreen === "create-project" &&
                        "New Project"}
                      {currentScreen === "create-task" &&
                        "New Task"}
                      {currentScreen === "project-details" &&
                        "Project Details"}
                      {currentScreen === "collaboration" &&
                        "Live Collaboration"}
                      {currentScreen === "ai-optimization" &&
                        "AI Optimizer"}
                      {currentScreen === "daw-integration" &&
                        "DAW Integration"}
                      {currentScreen === "settings" &&
                        "Settings"}
                      {currentScreen === "subscription" &&
                        "Subscription"}
                      {currentScreen === "setup" &&
                        "Backend Setup"}
                      {currentScreen === "app-status" &&
                        "App Status"}
                    </h1>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentScreen("dashboard")
                    }
                    className="rounded-full w-10 h-10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Floating Action Buttons - Mobile Optimized */}
            {showAdvancedFeatures && (
              <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
                {/* Notifications Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={() => setShowNotifications(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 relative"
                    size="icon"
                  >
                    <Bell className="w-5 h-5 text-white" />
                    {notificationCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {notificationCount}
                        </span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Advanced Features Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    onClick={() =>
                      setShowAdvancedMenu(!showAdvancedMenu)
                    }
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                    size="icon"
                  >
                    <motion.div
                      animate={{
                        rotate: showAdvancedMenu ? 45 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Zap className="w-6 h-6 text-white" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile Advanced Features Menu */}
            <AnimatePresence>
              {showAdvancedMenu && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setShowAdvancedMenu(false)}
                  />

                  {/* Menu Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 500,
                    }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Handle */}
                      <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Advanced Features
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Power up your workflow
                          </p>
                        </div>
                        <Badge className="bg-primary text-white text-xs px-2 py-1">
                          New
                        </Badge>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {quickActions.map((action) => (
                          <motion.div
                            key={action.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-16 flex flex-col gap-1 border-2 hover:border-primary/20"
                              onClick={() =>
                                handleNavigation(
                                  action.id as Screen,
                                )
                              }
                            >
                              <div
                                className={`w-6 h-6 ${action.color} rounded-lg flex items-center justify-center mb-1`}
                              >
                                <action.icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs font-medium">
                                {action.title}
                              </span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Advanced Features */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Professional Tools
                        </h4>
                        {advancedFeatures.map(
                          (feature, index) => (
                            <motion.div
                              key={feature.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.1,
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full h-auto p-4 flex items-center gap-4 hover:bg-muted/50 rounded-xl"
                                onClick={() =>
                                  handleNavigation(
                                    feature.id as Screen,
                                  )
                                }
                              >
                                <div
                                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                                >
                                  <feature.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-medium text-foreground text-sm mb-1">
                                    {feature.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {feature.description}
                                  </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <ArrowLeft className="w-3 h-3 text-primary rotate-180" />
                                </div>
                              </Button>
                            </motion.div>
                          ),
                        )}
                      </div>

                      {/* Settings & Logout */}
                      <div className="pt-4 border-t border-border space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleNavigation("settings")
                          }
                          className="w-full justify-start text-muted-foreground hover:text-foreground"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLogout}
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content with mobile padding */}
            <div
              className={`${showBackButton ? "pt-16" : ""} ${showBottomNav ? "pb-20" : ""}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  {currentScreen === "dashboard" && (
                    <DashboardScreen
                      onNavigate={handleNavigation}
                      onCreateProject={() =>
                        handleNavigation("create-project")
                      }
                      onCreateTask={() =>
                        handleNavigation("create-task")
                      }
                      onViewProject={(projectId) =>
                        handleNavigation("project-details", {
                          projectId,
                        })
                      }
                      onViewAgenda={() =>
                        handleNavigation("agenda")
                      }
                      onOpenSearch={() =>
                        handleNavigation("search")
                      }
                    />
                  )}
                  {currentScreen === "projects" && (
                    <ProjectsScreen
                      onNavigate={handleNavigation}
                      onCreateProject={() =>
                        handleNavigation("create-project")
                      }
                      selectedProjectId={
                        previousScreen === "dashboard"
                          ? undefined
                          : currentScreen
                      }
                    />
                  )}
                  {currentScreen === "agenda" && (
                    <AgendaScreen
                      onNavigate={handleNavigation}
                      onCreateTask={() =>
                        handleNavigation("create-task")
                      }
                      onEditTask={(taskId) =>
                        console.log("Edit task:", taskId)
                      }
                    />
                  )}
                  {currentScreen === "search" && (
                    <SearchScreen
                      onNavigate={handleNavigation}
                      onArtistProfile={(artistId) =>
                        handleNavigation("profile", {
                          artistId,
                        })
                      }
                    />
                  )}
                  {currentScreen === "profile" && (
                    <ArtistProfileScreen />
                  )}
                  {currentScreen === "create-project" && (
                    <CreateProjectScreen
                      onProjectCreated={() =>
                        handleNavigation("projects")
                      }
                    />
                  )}
                  {currentScreen === "create-task" && (
                    <CreateTaskScreen
                      onNavigate={handleNavigation}
                      onTaskCreated={(task) => {
                        console.log("Task created:", task);
                        handleNavigation("agenda");
                      }}
                      prefilledData={navigationData}
                    />
                  )}
                  {currentScreen === "project-details" && (
                    <ProjectDetailsScreen
                      projectId={
                        navigationData?.projectId ||
                        "current_project"
                      }
                      onNavigate={handleNavigation}
                      onBack={handleBackNavigation}
                    />
                  )}
                  {currentScreen === "collaboration" &&
                    user && (
                      <CollaborationScreen
                        user={user}
                        projectId="current_project"
                        onClose={() => handleBackNavigation()}
                      />
                    )}
                  {currentScreen === "ai-optimization" &&
                    user && (
                      <AIOptimizationScreen
                        user={user}
                        currentProjectId="current_project"
                        onClose={() => handleBackNavigation()}
                        userPlan="free"
                        onUpgrade={() =>
                          handleNavigation("subscription")
                        }
                      />
                    )}
                  {currentScreen === "daw-integration" &&
                    user && (
                      <DAWIntegrationScreen
                        user={user}
                        currentProjectId="current_project"
                        onClose={() => handleBackNavigation()}
                      />
                    )}
                  {currentScreen === "settings" && (
                    <SettingsScreen
                      onNavigate={handleNavigation}
                      onLogout={handleLogout}
                      user={user}
                    />
                  )}
                  {currentScreen === "subscription" && (
                    <SubscriptionScreen
                      onNavigate={handleNavigation}
                      user={user}
                      currentPlan="free"
                    />
                  )}
                  {currentScreen === "setup" && <SetupGuide />}
                  {currentScreen === "app-status" && (
                    <AppStatusScreen
                      onNavigate={handleNavigation}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Bottom Navigation for Mobile */}
            {showBottomNav && (
              <BottomNavigation
                currentScreen={currentScreen}
                onNavigate={handleNavigation}
                showCreateProject={
                  currentScreen !== "create-project"
                }
                onCreateProject={() =>
                  handleNavigation("create-project")
                }
              />
            )}

            {/* Notification System */}
            <NotificationSystem
              user={user}
              isVisible={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;