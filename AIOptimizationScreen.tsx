import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AppHeader } from './AppHeader';
import { 
  Bot, 
  Zap, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Timer,
  BarChart3,
  BrainCircuit,
  Workflow,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AIOptimizationScreenProps {
  user: any;
  currentProjectId?: string;
  onClose?: () => void;
  userPlan?: 'free' | 'pro' | 'premium';
  onUpgrade?: () => void;
}

export function AIOptimizationScreen({ 
  user, 
  currentProjectId = 'project_1',
  onClose,
  userPlan = 'free',
  onUpgrade
}: AIOptimizationScreenProps) {
  const [optimizations, setOptimizations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [appliedOptimizations, setAppliedOptimizations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    fetchOptimizations();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      if (!optimizations) {
        fetchOptimizations();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentProjectId]);

  const testConnectivity = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for ping
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dd758888/ping`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Connectivity test failed:', error);
      return false;
    }
  };

  const fetchOptimizations = async (forceRetry = false) => {
    if (!isOnline && !forceRetry) {
      console.log('No internet connection, using mock data');
      setOptimizations(getMockOptimizations());
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching AI optimizations for project:', currentProjectId);
      
      // Test connectivity first
      const isConnected = await testConnectivity();
      if (!isConnected) {
        throw new Error('Cannot reach Albundle servers');
      }
      
      // Get access token from current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session error, using public key:', sessionError);
      }
      
      const accessToken = session?.access_token || publicAnonKey;
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-dd758888/ai/optimize/${currentProjectId}`;
      
      console.log('Making request to:', url);
      console.log('Using token:', accessToken ? 'Token present' : 'No token');

      // Add timeout and retry logic
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AI optimization data received:', data);
        
        if (data.optimizations) {
          setOptimizations(data.optimizations);
          setRetryCount(0);
          setError(null);
        } else {
          throw new Error('No optimization data received');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        console.warn('Server responded with error:', response.status, errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.error || errorData.details || 'Unknown error'}`);
      }
    } catch (fetchError) {
      console.error('Error fetching AI optimizations:', fetchError);
      
      let errorMessage = 'Unable to fetch AI optimizations';
      
      if (fetchError.name === 'AbortError') {
        errorMessage = 'Request timed out - server may be busy';
      } else if (!isOnline) {
        errorMessage = 'No internet connection';
      } else if (fetchError.message?.includes('Failed to fetch')) {
        errorMessage = 'Network connection failed';
      } else if (fetchError.message?.includes('Cannot reach')) {
        errorMessage = 'Cannot reach Albundle servers';
      } else {
        errorMessage = fetchError.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
      
      // Increment retry count and use fallback after multiple failures
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      console.log(`Fetch attempt ${newRetryCount} failed, using mock data as fallback`);
      setOptimizations(getMockOptimizations());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockOptimizations = () => ({
    timeline_suggestions: [
      {
        id: 'reorder_1',
        type: 'reorder_tasks',
        title: 'Optimize Recording Sequence',
        description: 'Move vocal recording before mixing to optimize studio time and maintain vocal consistency',
        impact: 'high',
        time_saved: '2 hours',
        difficulty: 'easy',
        confidence: 92
      },
      {
        id: 'parallel_1',
        type: 'parallel_tasks',
        title: 'Parallelize Creative Tasks',
        description: 'Instrumental recording and artwork creation can be done simultaneously by different team members',
        impact: 'medium',
        time_saved: '1 day',
        difficulty: 'medium',
        confidence: 87
      },
      {
        id: 'batch_1',
        type: 'batch_similar',
        title: 'Batch Similar Activities',
        description: 'Group all recording sessions together to minimize studio setup and equipment changes',
        impact: 'high',
        time_saved: '4 hours',
        difficulty: 'easy',
        confidence: 95
      }
    ],
    resource_optimization: [
      {
        id: 'studio_1',
        type: 'studio_booking',
        title: 'Optimize Studio Sessions',
        description: 'Book longer studio sessions to reduce setup/teardown time and negotiate better rates',
        savings: '15% cost reduction',
        impact: 'high',
        confidence: 89
      },
      {
        id: 'equipment_1',
        type: 'equipment_sharing',
        title: 'Equipment Coordination',
        description: 'Share equipment between team members to reduce rental costs and improve efficiency',
        savings: '$200 per week',
        impact: 'medium',
        confidence: 78
      }
    ],
    collaboration_tips: [
      {
        id: 'scheduling_1',
        type: 'scheduling',
        title: 'Smart Scheduling',
        description: 'Schedule collaborative sessions when all members are most active and creative',
        optimal_times: ['2-4 PM', '7-9 PM'],
        productivity_boost: '25%',
        confidence: 83
      },
      {
        id: 'workflow_1',
        type: 'workflow',
        title: 'Workflow Optimization',
        description: 'Implement async review cycles to reduce meeting time and speed up decision making',
        time_saved: '3 hours per week',
        confidence: 91
      }
    ],
    ai_insights: {
      productivity_score: 78,
      efficiency_rating: 'Good',
      bottlenecks: ['Waiting for approvals', 'Equipment availability'],
      recommendations: [
        'Implement approval workflow automation',
        'Create shared equipment calendar',
        'Set up automated progress notifications'
      ]
    }
  });

  const handleRetry = () => {
    setError(null);
    fetchOptimizations(true);
  };

  const applyOptimization = (optimizationId: string) => {
    if (!appliedOptimizations.includes(optimizationId)) {
      setAppliedOptimizations(prev => [...prev, optimizationId]);
      // Here you could also send the applied optimization to the server
      console.log('Applied optimization:', optimizationId);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-orange-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Show upgrade prompt for free users
  if (userPlan === 'free') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="AI Optimization" subtitle="Unlock AI-powered insights" />
        
        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Unlock AI-Powered Optimization
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get intelligent timeline suggestions, resource optimization, and collaboration insights 
              tailored to your projects with Albundle Pro.
            </p>
            
            <div className="space-y-4 mb-8">
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-foreground">Smart Timeline Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your project and suggests optimal task ordering to save time and reduce bottlenecks.
                </p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-foreground">Resource Intelligence</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimize studio bookings, equipment usage, and team scheduling for maximum efficiency.
                </p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-foreground">Collaboration Insights</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Discover optimal meeting times and workflow improvements based on team productivity patterns.
                </p>
              </Card>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8"
              onClick={onUpgrade}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Upgrade to Pro
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Join thousands of artists optimizing their workflow with AI
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="AI Optimization" subtitle="Analyzing your project..." />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">AI is analyzing your project...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="AI Optimization" 
        subtitle="Smart recommendations for your project"
        notificationCount={optimizations?.timeline_suggestions?.length || 0}
      />

      <div className="pb-20">
        {/* Connection Status & Error Handling */}
        {(error || !isOnline) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-yellow-50 border-b border-yellow-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!isOnline ? (
                  <WifiOff className="w-4 h-4 text-yellow-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {!isOnline ? 'Offline Mode' : 'Connection Issue'}
                  </p>
                  <p className="text-xs text-yellow-600">
                    {!isOnline 
                      ? 'Showing cached recommendations' 
                      : `${error}${retryCount > 0 ? ` (Attempt ${retryCount})` : ''} - Showing fallback data`
                    }
                  </p>
                </div>
              </div>
              {isOnline && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRetry}
                  className="text-yellow-700 hover:bg-yellow-100"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* AI Insights Overview */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-purple-50 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Project Intelligence</h2>
                <p className="text-sm text-muted-foreground">
                  Productivity Score: {optimizations?.ai_insights?.productivity_score}% • 
                  Rating: {optimizations?.ai_insights?.efficiency_rating}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {error && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
              <Button size="sm" onClick={() => fetchOptimizations()} className="bg-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Re-analyze
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
              <TabsTrigger value="collaboration" className="text-xs">Collaboration</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
            </TabsList>

            {/* Timeline Optimization */}
            <TabsContent value="timeline" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 bg-white border border-border">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Timeline Optimization ({optimizations?.timeline_suggestions?.length || 0} suggestions)
                  </h3>

                  <div className="space-y-4">
                    {optimizations?.timeline_suggestions?.map((suggestion: any, index: number) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          appliedOptimizations.includes(suggestion.id) 
                            ? 'border-l-green-500 bg-green-50' 
                            : 'border-l-primary bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                              <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                                {suggestion.impact} impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.confidence}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-2">{suggestion.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                <span>Saves: {suggestion.time_saved}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className={`w-3 h-3 ${getDifficultyColor(suggestion.difficulty)}`} />
                                <span className={getDifficultyColor(suggestion.difficulty)}>
                                  {suggestion.difficulty} to implement
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={appliedOptimizations.includes(suggestion.id) ? "outline" : "default"}
                            onClick={() => applyOptimization(suggestion.id)}
                            disabled={appliedOptimizations.includes(suggestion.id)}
                            className="flex-shrink-0"
                          >
                            {appliedOptimizations.includes(suggestion.id) ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Applied
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-3 h-3 mr-1" />
                                Apply
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Resource Optimization */}
            <TabsContent value="resources" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 bg-white border border-border">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Resource Optimization
                  </h3>

                  <div className="space-y-4">
                    {optimizations?.resource_optimization?.map((resource: any, index: number) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          appliedOptimizations.includes(resource.id) 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-foreground">{resource.title}</h4>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {resource.savings}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-2">{resource.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getImpactColor(resource.impact)}`}>
                                {resource.impact} impact
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {resource.confidence}% confidence
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={appliedOptimizations.includes(resource.id) ? "outline" : "default"}
                            onClick={() => applyOptimization(resource.id)}
                            disabled={appliedOptimizations.includes(resource.id)}
                          >
                            {appliedOptimizations.includes(resource.id) ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Applied
                              </>
                            ) : (
                              <>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Optimize
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Collaboration Optimization */}
            <TabsContent value="collaboration" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 bg-white border border-border">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Collaboration Enhancement
                  </h3>

                  <div className="space-y-4">
                    {optimizations?.collaboration_tips?.map((tip: any, index: number) => (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          appliedOptimizations.includes(tip.id) 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-2">{tip.title}</h4>
                            <p className="text-sm text-foreground mb-3">{tip.description}</p>
                            
                            {tip.optimal_times && (
                              <div className="mb-3">
                                <span className="text-xs text-muted-foreground mb-2 block">Optimal Times:</span>
                                <div className="flex gap-2">
                                  {tip.optimal_times.map((time: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {time}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {tip.productivity_boost && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                  <span>+{tip.productivity_boost} productivity</span>
                                </div>
                              )}
                              {tip.time_saved && (
                                <div className="flex items-center gap-1">
                                  <Timer className="w-3 h-3" />
                                  <span>Saves: {tip.time_saved}</span>
                                </div>
                              )}
                              <span>{tip.confidence}% confidence</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={appliedOptimizations.includes(tip.id) ? "outline" : "default"}
                            onClick={() => applyOptimization(tip.id)}
                            disabled={appliedOptimizations.includes(tip.id)}
                          >
                            {appliedOptimizations.includes(tip.id) ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Applied
                              </>
                            ) : (
                              <>
                                <Workflow className="w-3 h-3 mr-1" />
                                Implement
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* AI Insights */}
            <TabsContent value="insights" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Productivity Score */}
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    AI Analysis Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Project Health Score</span>
                        <span className="text-lg font-semibold text-purple-600">
                          {optimizations?.ai_insights?.productivity_score}%
                        </span>
                      </div>
                      <Progress value={optimizations?.ai_insights?.productivity_score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Rating: {optimizations?.ai_insights?.efficiency_rating} - Good progress with room for optimization
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Bottlenecks */}
                <Card className="p-4 bg-white border border-border">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Identified Bottlenecks
                  </h3>
                  
                  <div className="space-y-3">
                    {optimizations?.ai_insights?.bottlenecks?.map((bottleneck: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{bottleneck}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-4 bg-white border border-border">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    AI Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {optimizations?.ai_insights?.recommendations?.map((rec: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Applied Optimizations Summary */}
          {appliedOptimizations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Optimizations Applied
                    </h3>
                    <p className="text-sm text-green-600 mt-1">
                      {appliedOptimizations.length} optimization{appliedOptimizations.length !== 1 ? 's' : ''} implemented
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    +{appliedOptimizations.length * 5}% efficiency
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}