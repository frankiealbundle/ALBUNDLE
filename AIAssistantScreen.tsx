import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Bot, 
  Sparkles, 
  Lightbulb, 
  Target, 
  Share2, 
  Music, 
  Users,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

interface AIAssistantScreenProps {
  onBack: () => void;
}

export function AIAssistantScreen({ onBack }: AIAssistantScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'marketing' | 'collaboration' | 'strategy'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const aiSuggestions = [
    {
      id: 1,
      category: 'marketing',
      title: 'Social Media Post for Music Video Launch',
      description: 'AI-generated social media copy optimized for your ambient electronic style',
      content: '🎵 New music video for "Starlight" drops tomorrow! ✨ Dive into an ethereal journey of ambient soundscapes and visual poetry. Tag someone who loves dreamy electronic music 🌙 #AmbientMusic #NewRelease #ElectronicMusic',
      platform: 'Instagram/Twitter',
      confidence: 92,
      engagement_prediction: '+15% engagement',
      actionable: true
    },
    {
      id: 2,
      category: 'strategy',
      title: 'Optimal Release Timing',
      description: 'Best time to release your album based on audience data and genre trends',
      content: 'Based on your audience analytics, release "Acoustic Sessions" on Friday at 12 PM EST. Electronic music performs 23% better on weekends, and your followers are most active between 12-2 PM.',
      platform: 'All Platforms',
      confidence: 87,
      engagement_prediction: '+23% reach',
      actionable: true
    },
    {
      id: 3,
      category: 'collaboration',
      title: 'Collaboration Opportunity',
      description: 'Potential remix partnership with complementary artists',
      content: '@sarah_beats has a similar aesthetic and 89% audience overlap. Consider proposing a remix collaboration for "Starlight" - her downtempo style would complement your ambient approach.',
      platform: 'Cross-promotion',
      confidence: 78,
      engagement_prediction: '+31% new followers',
      actionable: true
    },
    {
      id: 4,
      category: 'marketing',
      title: 'Email Newsletter Subject Line',
      description: 'Personalized subject line with 23% higher open rates',
      content: 'Luna, your next sonic journey awaits 🎧 [Preview Inside]',
      platform: 'Email',
      confidence: 85,
      engagement_prediction: '+23% open rate',
      actionable: true
    },
    {
      id: 5,
      category: 'strategy',
      title: 'Playlist Pitch Strategy',
      description: 'Target playlists for maximum exposure',
      content: 'Target "Ambient Chill" (2.3M followers), "Electronic Rising" (890K), and "Study Beats" (1.1M). Highlight your tracks\' 4-minute average length and binaural beat elements in your pitch.',
      platform: 'Spotify',
      confidence: 91,
      engagement_prediction: '+45% streams',
      actionable: true
    },
    {
      id: 6,
      category: 'marketing',
      title: 'Behind-the-Scenes Content',
      description: 'Engaging content ideas for your launch campaign',
      content: 'Share time-lapse videos of your studio sessions, equipment close-ups, and the creative process behind your ambient textures. Include captions about your inspiration sources.',
      platform: 'Instagram Stories',
      confidence: 82,
      engagement_prediction: '+18% story views',
      actionable: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Suggestions', icon: Sparkles },
    { id: 'marketing', label: 'Marketing', icon: Share2 },
    { id: 'collaboration', label: 'Collaborations', icon: Users },
    { id: 'strategy', label: 'Strategy', icon: Target }
  ];

  const filteredSuggestions = selectedCategory === 'all' 
    ? aiSuggestions 
    : aiSuggestions.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing': return 'bg-primary/10 text-primary border-primary/20';
      case 'collaboration': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'strategy': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-primary';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Personalized recommendations for your music career</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-border"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* AI Insights Summary */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">AI Analysis Summary</h3>
              <p className="text-sm text-foreground mb-3">
                Based on your music style, audience data, and industry trends, I've generated {aiSuggestions.length} personalized 
                recommendations. Focus on the high-confidence marketing suggestions for maximum impact.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-primary">{aiSuggestions.filter(s => s.confidence >= 90).length}</p>
                  <p className="text-xs text-muted-foreground">High Confidence</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{aiSuggestions.filter(s => s.actionable).length}</p>
                  <p className="text-xs text-muted-foreground">Ready to Use</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600">+24%</p>
                  <p className="text-xs text-muted-foreground">Avg. Impact</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex-shrink-0 ${selectedCategory === category.id ? 'bg-primary text-white' : 'border-border'}`}
              >
                <Icon className="w-3 h-3 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="px-6">
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">{suggestion.title}</h3>
                    <Badge className={`text-xs ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                <p className="text-sm text-foreground leading-relaxed">{suggestion.content}</p>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Platform: {suggestion.platform}</span>
                  <span className={getConfidenceColor(suggestion.confidence)}>
                    {suggestion.confidence}% confidence
                  </span>
                  <span className="text-green-600">{suggestion.engagement_prediction}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-border">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  {suggestion.actionable && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Use This
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Generate More */}
      <div className="px-6 mt-6">
        <Button variant="outline" className="w-full border-primary text-primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate More Suggestions
        </Button>
      </div>
    </div>
  );
}