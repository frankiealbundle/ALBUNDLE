import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { AppHeader } from './AppHeader';
import { 
  Crown,
  Zap,
  Bot,
  Users,
  Music,
  Headphones,
  Cloud,
  Shield,
  CheckCircle,
  Star,
  Sparkles,
  Mic,
  Calendar,
  BarChart3,
  Globe,
  ArrowRight,
  X,
  Info,
  Gift,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

interface SubscriptionScreenProps {
  onNavigate?: (screen: string) => void;
  user?: any;
  currentPlan?: 'free' | 'pro' | 'premium';
}

export function SubscriptionScreen({ 
  onNavigate, 
  user, 
  currentPlan = 'free' 
}: SubscriptionScreenProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('pro');

  const features = {
    free: [
      'Up to 3 projects',
      'Basic task management',
      'Standard audio quality',
      'Mobile app access',
      'Community support'
    ],
    pro: [
      'Unlimited projects',
      'AI-powered timeline optimization',
      'Advanced collaboration tools',
      'High-quality audio processing',
      'Cloud sync & backup',
      'Priority support',
      'DAW integrations',
      'Advanced analytics',
      'Custom project templates'
    ],
    premium: [
      'Everything in Pro',
      'AI songwriting assistant',
      'Advanced mixing algorithms',
      'Voice synthesis tools',
      'Multi-platform distribution',
      'White-label solutions',
      '24/7 dedicated support',
      'API access',
      'Custom integrations',
      'Team management (up to 50 users)'
    ]
  };

  const pricing = {
    monthly: {
      pro: 19.99,
      premium: 49.99
    },
    yearly: {
      pro: 199.99,
      premium: 499.99
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Music,
      color: 'bg-gray-500',
      gradient: 'from-gray-400 to-gray-600',
      price: 0,
      description: 'Perfect for getting started',
      popular: false,
      features: features.free
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      color: 'bg-primary',
      gradient: 'from-primary to-orange-600',
      price: billingCycle === 'monthly' ? pricing.monthly.pro : pricing.yearly.pro,
      description: 'For serious artists and producers',
      popular: true,
      features: features.pro
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      color: 'bg-purple-600',
      gradient: 'from-purple-500 to-purple-700',
      price: billingCycle === 'monthly' ? pricing.monthly.premium : pricing.yearly.premium,
      description: 'For professional studios and labels',
      popular: false,
      features: features.premium
    }
  ];

  const aiFeatures = [
    {
      icon: Bot,
      title: 'AI Timeline Optimizer',
      description: 'Smart project scheduling and deadline management',
      proOnly: true
    },
    {
      icon: Mic,
      title: 'AI Songwriting Assistant',
      description: 'Get creative suggestions and lyrical inspiration',
      proOnly: true
    },
    {
      icon: Headphones,
      title: 'Smart Audio Processing',
      description: 'AI-powered mixing and mastering suggestions',
      proOnly: true
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Insights into your productivity and project progress',
      proOnly: true
    }
  ];

  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with Stripe or similar
    console.log(`Subscribe to ${planId} plan (${billingCycle})`);
    // For demo purposes, just show success
    alert(`Successfully subscribed to ${planId} plan!`);
  };

  const handleManageSubscription = () => {
    // Navigate to billing management
    console.log('Manage subscription');
  };

  const yearlyDiscount = billingCycle === 'yearly' ? 17 : 0; // ~2 months free

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Upgrade to Pro" 
        subtitle="Unlock the full power of Albundle"
        showBack={true}
        onBack={() => onNavigate?.('settings')}
      />

      <div className="pb-20 px-4 space-y-6">
        {/* Current Plan Status */}
        {currentPlan !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Albundle {currentPlan === 'pro' ? 'Pro' : 'Premium'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your subscription is active
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                  Manage
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={currentPlan === 'free' ? 'pt-4' : ''}
        >
          <Card className="p-4">
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <div className="flex items-center gap-2">
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    Save {yearlyDiscount}%
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-medium text-foreground">AI-Powered Features</h3>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">Pro Only</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 bg-white/60 rounded-lg border border-purple-100"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-foreground mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-tight">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground text-center">
            Choose Your Plan
          </h3>

          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className={`p-4 border-2 transition-all duration-200 ${
                selectedPlan === plan.id 
                  ? 'border-primary bg-primary/5' 
                  : plan.popular
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border bg-white'
              } ${plan.id === currentPlan ? 'opacity-60' : 'hover:border-primary/30'}`}>
                
                {plan.popular && (
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {plan.price > 0 ? (
                      <>
                        <div className="text-2xl font-bold text-foreground">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </div>
                        {billingCycle === 'yearly' && (
                          <div className="text-xs text-green-600 font-medium">
                            Save ${((pricing.monthly[plan.id as keyof typeof pricing.monthly] * 12) - plan.price).toFixed(0)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-foreground">Free</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.id === currentPlan 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : plan.popular
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-foreground hover:bg-foreground/90'
                  }`}
                  disabled={plan.id === currentPlan}
                  onClick={() => plan.id !== 'free' ? handleSubscribe(plan.id) : null}
                >
                  {plan.id === currentPlan ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Current Plan
                    </>
                  ) : plan.id === 'free' ? (
                    'Get Started Free'
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4 text-center">
              Why Upgrade to Pro?
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">AI Timeline Optimization</span>
                </div>
                <Badge className="bg-primary/10 text-primary">Pro</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Advanced Collaboration</span>
                </div>
                <Badge className="bg-primary/10 text-primary">Pro</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Unlimited Cloud Storage</span>
                </div>
                <Badge className="bg-primary/10 text-primary">Pro</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Priority Support</span>
                </div>
                <Badge className="bg-primary/10 text-primary">Pro</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm text-foreground mb-3">
                "Albundle Pro transformed my workflow. The AI timeline optimizer alone saved me hours each week, 
                and the collaboration tools made working with my team seamless."
              </blockquote>
              <div className="text-xs text-muted-foreground">
                - Sarah Chen, Independent Artist
              </div>
            </div>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until your current billing period ends.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans. No questions asked.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">What happens to my data if I downgrade?</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is never deleted. If you exceed the limits of your new plan, some features will be disabled until you upgrade again.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}