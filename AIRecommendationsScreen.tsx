import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, TrendingUp, Users, Calendar, Music, Target, Zap, ArrowRight } from 'lucide-react';
import { SupabaseStatus } from './SupabaseStatus';

export function AIRecommendationsScreen() {
  const recommendations = [
    {
      id: 1,
      category: 'Release Strategy',
      title: 'Release "Midnight Dreams" as next single',
      description: 'Our AI analysis shows 85% success probability based on current trends and your audience engagement.',
      priority: 'high',
      icon: Music,
      actions: ['Schedule Release', 'View Analytics'],
      estimatedImpact: '+15% streams',
    },
    {
      id: 2,
      category: 'Collaboration',
      title: 'Partner with @Sarah_Beats',
      description: 'High engagement potential detected. Your audiences have 67% overlap in musical preferences.',
      priority: 'medium',
      icon: Users,
      actions: ['Send Message', 'View Profile'],
      estimatedImpact: '+8% followers',
    },
    {
      id: 3,
      category: 'Social Media',
      title: 'Go live tomorrow at 8 PM',
      description: 'Optimal engagement time for your audience. 3x higher interaction rate expected.',
      priority: 'high',
      icon: Calendar,
      actions: ['Schedule Live', 'Set Reminder'],
      estimatedImpact: '+25% engagement',
    },
    {
      id: 4,
      category: 'Production',
      title: 'Add more ambient layers to Track 3',
      description: 'Audio analysis suggests enhanced atmospheric elements could improve listener retention by 18%.',
      priority: 'low',
      icon: Target,
      actions: ['Open in DAW', 'View Suggestions'],
      estimatedImpact: '+12% completion',
    },
    {
      id: 5,
      category: 'Marketing',
      title: 'Create remix contest for "Summer Vibes"',
      description: 'Similar artists saw 40% increase in reach through remix competitions. High viral potential detected.',
      priority: 'medium',
      icon: TrendingUp,
      actions: ['Setup Contest', 'View Examples'],
      estimatedImpact: '+30% reach',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Release Strategy':
        return Music;
      case 'Collaboration':
        return Users;
      case 'Social Media':
        return Calendar;
      case 'Production':
        return Target;
      case 'Marketing':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Recommendations</h1>
        </div>
        <p className="text-muted-foreground">Personalized insights to boost your music career</p>
      </div>

      {/* Stats Summary */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week's Impact</p>
              <p className="text-xl font-bold text-primary">+47% Growth Potential</p>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Backend Status */}
      <div className="px-6 mb-6">
        <SupabaseStatus showDetails={true} />
      </div>

      {/* Recommendations List */}
      <div className="px-6 space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = rec.icon;
          return (
            <Card key={rec.id} className="p-4 border-l-4 border-l-primary bg-white shadow-sm">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs border-border">
                          {rec.category}
                        </Badge>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>

                {/* Impact Estimation */}
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Estimated Impact: {rec.estimatedImpact}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {rec.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant={actionIndex === 0 ? "default" : "outline"}
                      size="sm"
                      className={actionIndex === 0 ? "bg-primary hover:bg-primary/90 text-white" : "border-border"}
                    >
                      {action}
                      {actionIndex === 0 && <ArrowRight className="w-3 h-3 ml-1" />}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 mt-8">
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground mb-1">Want more insights?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Pro for advanced AI analysis and custom recommendations
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Upgrade to Pro
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}