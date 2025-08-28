import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert } from './ui/alert';
import albundleLogo from 'figma:asset/3ae0606ee5d9055ceef427e84776613477a14947.png';
import { supabase, apiRequest } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Music, 
  Users, 
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  Chrome,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from './ToastSystem';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { addToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    artistName: '',
    confirmPassword: ''
  });

  const features = [
    { icon: Music, title: 'Project Management', description: 'Organize tracks, tasks, and deadlines' },
    { icon: Users, title: 'Real-time Collaboration', description: 'Work with artists and producers live' },
    { icon: Sparkles, title: 'AI-Powered Optimization', description: 'Smart timeline and resource suggestions' }
  ];

  const socialProviders = [
    { id: 'google', name: 'Google', icon: Chrome, color: 'hover:bg-red-50 border-red-200' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'hover:bg-gray-50 border-gray-200' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'hover:bg-blue-50 border-blue-200' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        // Create account using server endpoint
        const data = await apiRequest('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            artistName: formData.artistName
          })
        });
        
        addToast({
          type: 'success',
          title: 'Account created!',
          description: 'Please sign in with your new account.'
        });
        
        setSuccess('Account created successfully! Please sign in.');
        setMode('login');
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw new Error(error.message);
        
        addToast({
          type: 'success',
          title: 'Welcome back!',
          description: 'Successfully signed in to your account.'
        });
        
        onAuthSuccess({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'User',
          artist_name: data.user.user_metadata?.artist_name || 'Artist'
        });
      } else if (mode === 'forgot') {
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => setMode('login'), 2000);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Authentication Error',
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw new Error(error.message);
      
      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      setError(err.message || 'Social login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-32 h-10 mx-auto mb-4">
            <img 
              src={albundleLogo} 
              alt="Albundle" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Join Albundle'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' && 'Sign in to your music workspace'}
            {mode === 'signup' && 'Create your music production account'}
            {mode === 'forgot' && 'Enter your email to reset your password'}
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 bg-white border border-border shadow-lg">
            {/* Social Login */}
            {mode !== 'forgot' && (
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2">
                  {socialProviders.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full h-10 ${provider.color} transition-colors`}
                        onClick={() => handleSocialLogin(provider.id)}
                        disabled={loading}
                      >
                        <provider.icon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 text-sm">{error}</span>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 text-sm">{success}</span>
                </Alert>
              </motion.div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div>
                    <Label htmlFor="name" className="text-sm text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        className="pl-10 bg-input-background border-border"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="artistName" className="text-sm text-foreground">Artist Name</Label>
                    <div className="relative">
                      <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="artistName"
                        type="text"
                        placeholder="Stage name"
                        className="pl-10 bg-input-background border-border"
                        value={formData.artistName}
                        onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-input-background border-border"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-input-background border-border"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="confirmPassword" className="text-sm text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 bg-input-background border-border"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Auth Mode Switcher */}
            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setMode('forgot')}
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    Forgot your password?
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setMode('signup')}
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Sign up
                    </Button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    Sign in
                  </Button>
                </div>
              )}

              {mode === 'forgot' && (
                <div className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Features Preview */}
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="p-4 bg-white/80 border border-border backdrop-blur-sm">
              <h3 className="font-medium text-foreground mb-3 text-center">What you'll get:</h3>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}