import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Music, Users, Zap, Check, X } from 'lucide-react';
import albundleLogo from 'figma:asset/3ae0606ee5d9055ceef427e84776613477a14947.png';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignUpScreenProps {
  onSignUp: (user: any) => void;
  onSwitchToLogin: () => void;
}

export function SignUpScreen({ onSignUp, onSwitchToLogin }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    artistName: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false
  });

  const validatePassword = (password: string) => {
    const newValidations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      match: password === formData.confirmPassword && password.length > 0
    };
    setValidations(newValidations);
    return Object.values(newValidations).every(Boolean);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (field === 'password') {
      validatePassword(value as string);
    } else if (field === 'confirmPassword') {
      setValidations(prev => ({
        ...prev,
        match: (value as string) === newFormData.password && newFormData.password.length > 0
      }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validatePassword(formData.password)) {
      setError('Please ensure your password meets all requirements.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the server to create the user with properly structured data
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dd758888/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name,
            artist_name: formData.artistName
          }
        })
      });

      const result = await response.json();
      console.log('Signup response:', result);

      if (!response.ok) {
        console.error('Signup error response:', result);
        setError(result.error || 'Failed to create account');
      } else {
        // Sign in the user after successful registration
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Sign-in after signup error:', error);
          setError('Account created but sign-in failed. Please try logging in.');
        } else if (session) {
          console.log('Successful signup and login:', session.user);
          onSignUp(session.user);
        }
      }
    } catch (err) {
      console.error('Signup network error:', err);
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Social signup error:', error);
        setError(`${provider} sign-up failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Social signup network error:', err);
      setError('Social sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Music, text: 'Unlimited music projects' },
    { icon: Users, text: 'Real-time collaboration' },
    { icon: Zap, text: 'AI-powered workflow optimization' }
  ];

  const passwordChecks = [
    { key: 'length', label: 'At least 8 characters', valid: validations.length },
    { key: 'uppercase', label: 'One uppercase letter', valid: validations.uppercase },
    { key: 'lowercase', label: 'One lowercase letter', valid: validations.lowercase },
    { key: 'number', label: 'One number', valid: validations.number },
    { key: 'match', label: 'Passwords match', valid: validations.match }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-border shadow-xl">
          {/* Logo Section */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-16 w-auto mx-auto mb-4">
              <img 
                src={albundleLogo} 
                alt="Albundle" 
                className="h-full w-auto object-contain mx-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Join Albundle</h1>
            <p className="text-sm text-muted-foreground mt-1">Create your music workspace</p>
          </motion.div>

          {/* Features Preview */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs text-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sign Up Form */}
          <motion.form
            onSubmit={handleSignUp}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 bg-white border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="artistName" className="text-sm font-medium text-foreground">Artist Name</Label>
                <div className="relative">
                  <Music className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="artistName"
                    type="text"
                    placeholder="Stage name"
                    value={formData.artistName}
                    onChange={(e) => handleInputChange('artistName', e.target.value)}
                    className="pl-10 bg-white border-border"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-white border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-white border-border"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white border-border"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Password Validation */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 bg-muted/30 rounded-lg"
              >
                <div className="text-xs font-medium text-foreground mb-2">Password Requirements:</div>
                <div className="grid grid-cols-1 gap-1">
                  {passwordChecks.map((check) => (
                    <div key={check.key} className="flex items-center gap-2 text-xs">
                      {check.valid ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-red-500" />
                      )}
                      <span className={check.valid ? 'text-green-600' : 'text-muted-foreground'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the Terms of Service and Privacy Policy. I understand that Albundle will use my information to provide music project management services.
              </Label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading || !formData.acceptTerms}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.form>

          {/* Social Sign Up */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp('google')}
                disabled={isLoading}
                className="border-border hover:bg-muted/50"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp('github')}
                disabled={isLoading}
                className="border-border hover:bg-muted/50"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </motion.div>

          {/* Debug Info for Development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              className="mt-4 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="mb-1"><strong>Debug Info:</strong></p>
              <p>Project ID: {projectId}</p>
              <p>Server URL: https://{projectId}.supabase.co/functions/v1/make-server-dd758888</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 h-6 text-xs"
                onClick={async () => {
                  try {
                    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dd758888/test`);
                    const result = await response.json();
                    console.log('Server test result:', result);
                    alert('Server test result: ' + JSON.stringify(result, null, 2));
                  } catch (error) {
                    console.error('Server test error:', error);
                    alert('Server test error: ' + error.message);
                  }
                }}
              >
                Test Server Connection
              </Button>
            </motion.div>
          )}

          {/* Login Link */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                Sign in
              </Button>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}