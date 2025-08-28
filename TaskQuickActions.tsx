import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { 
  Clock, 
  Plus, 
  Mic, 
  Camera, 
  Music, 
  Users, 
  Calendar,
  Timer,
  Target,
  Zap,
  Radio,
  Guitar,
  Piano,
  Headphones,
  Volume2,
  Disc,
  Sparkles,
  AudioWaveform,
  MicVocal
} from 'lucide-react';

interface TaskQuickActionsProps {
  onTaskCreate: (taskType: string) => void;
}

export function TaskQuickActions({ onTaskCreate }: TaskQuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Genre-specific templates
  const genreTemplates = [
    {
      id: 'electronic',
      name: 'Electronic',
      icon: Radio,
      color: 'bg-cyan-500',
      description: 'EDM, House, Techno',
      tasks: [
        { name: 'Synthesizer Programming', duration: '2h', priority: 'high' },
        { name: 'Beat Sequencing', duration: '1.5h', priority: 'high' },
        { name: 'Sound Design Session', duration: '3h', priority: 'medium' },
        { name: 'DJ Mix Testing', duration: '1h', priority: 'medium' },
        { name: 'Plugin Automation', duration: '45m', priority: 'low' },
        { name: 'Sample Processing', duration: '2h', priority: 'medium' }
      ]
    },
    {
      id: 'rock',
      name: 'Rock',
      icon: Guitar,
      color: 'bg-red-600',
      description: 'Alternative, Indie, Hard Rock',
      tasks: [
        { name: 'Guitar Tracking', duration: '3h', priority: 'high' },
        { name: 'Drum Recording', duration: '4h', priority: 'high' },
        { name: 'Bass Line Recording', duration: '2h', priority: 'high' },
        { name: 'Vocal Recording', duration: '2.5h', priority: 'medium' },
        { name: 'Guitar Solo Session', duration: '1.5h', priority: 'medium' },
        { name: 'Amp Modeling', duration: '1h', priority: 'low' }
      ]
    },
    {
      id: 'hip_hop',
      name: 'Hip-Hop',
      icon: MicVocal,
      color: 'bg-purple-600',
      description: 'Rap, Trap, R&B',
      tasks: [
        { name: 'Beat Making Session', duration: '2h', priority: 'high' },
        { name: 'Rap Vocal Recording', duration: '2.5h', priority: 'high' },
        { name: 'Hook/Chorus Writing', duration: '1.5h', priority: 'high' },
        { name: 'Sampling Session', duration: '2h', priority: 'medium' },
        { name: 'Ad-libs Recording', duration: '1h', priority: 'medium' },
        { name: '808 Tuning', duration: '45m', priority: 'low' }
      ]
    },
    {
      id: 'pop',
      name: 'Pop',
      icon: Sparkles,
      color: 'bg-pink-500',
      description: 'Pop, Indie Pop, Synth-pop',
      tasks: [
        { name: 'Catchy Hook Creation', duration: '1.5h', priority: 'high' },
        { name: 'Lead Vocal Recording', duration: '3h', priority: 'high' },
        { name: 'Harmony Stacking', duration: '2h', priority: 'medium' },
        { name: 'Synth Programming', duration: '2h', priority: 'medium' },
        { name: 'Bridge Composition', duration: '1h', priority: 'medium' },
        { name: 'Radio Edit Mix', duration: '1.5h', priority: 'low' }
      ]
    },
    {
      id: 'jazz',
      name: 'Jazz',
      icon: Piano,
      color: 'bg-amber-600',
      description: 'Jazz, Fusion, Smooth Jazz',
      tasks: [
        { name: 'Piano Recording Session', duration: '2.5h', priority: 'high' },
        { name: 'Horn Section Recording', duration: '3h', priority: 'high' },
        { name: 'Improvisation Session', duration: '2h', priority: 'medium' },
        { name: 'Walking Bass Recording', duration: '1.5h', priority: 'medium' },
        { name: 'Brushes Drum Recording', duration: '2h', priority: 'medium' },
        { name: 'Solo Section Arrangement', duration: '1h', priority: 'low' }
      ]
    },
    {
      id: 'acoustic',
      name: 'Acoustic',
      icon: Volume2,
      color: 'bg-green-600',
      description: 'Folk, Singer-songwriter, Unplugged',
      tasks: [
        { name: 'Acoustic Guitar Recording', duration: '2h', priority: 'high' },
        { name: 'Intimate Vocal Session', duration: '2.5h', priority: 'high' },
        { name: 'Fingerpicking Practice', duration: '1h', priority: 'medium' },
        { name: 'Natural Reverb Recording', duration: '1.5h', priority: 'medium' },
        { name: 'Harmonica Overdubs', duration: '45m', priority: 'low' },
        { name: 'Stripped Down Mix', duration: '2h', priority: 'medium' }
      ]
    }
  ];

  const taskCategories = [
    {
      id: 'recording',
      name: 'Recording',
      icon: Mic,
      color: 'bg-red-500',
      tasks: ['Vocal Recording', 'Instrument Recording', 'Demo Recording', 'Overdubs', 'Live Session', 'Punch Recording']
    },
    {
      id: 'production',
      name: 'Production',
      icon: Music,
      color: 'bg-blue-500',
      tasks: ['Mixing', 'Mastering', 'Beat Making', 'Sound Design', 'Arrangement', 'EQ Balancing']
    },
    {
      id: 'visual',
      name: 'Visual',
      icon: Camera,
      color: 'bg-purple-500',
      tasks: ['Music Video', 'Photoshoot', 'Album Art', 'Social Content', 'Lyric Video', 'Behind Scenes']
    },
    {
      id: 'collaboration',
      name: 'Collab',
      icon: Users,
      color: 'bg-green-500',
      tasks: ['Feature Request', 'Studio Booking', 'Meeting', 'Review Session', 'Co-writing', 'Producer Call']
    }
  ];

  const quickTasks = [
    { name: '30-min Recording', icon: Timer, time: '30m', color: 'bg-red-100 text-red-700' },
    { name: 'Quick Mix Review', icon: Target, time: '15m', color: 'bg-blue-100 text-blue-700' },
    { name: 'Collab Call', icon: Users, time: '45m', color: 'bg-green-100 text-green-700' },
    { name: 'AI Suggestion', icon: Zap, time: '5m', color: 'bg-purple-100 text-purple-700' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Genre-Specific Templates */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <AudioWaveform className="w-4 h-4 text-primary" />
          Genre Templates
        </h3>
        
        {/* Genre Selection */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {genreTemplates.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={selectedGenre === genre.id ? "default" : "outline"}
                size="sm"
                className={`w-full h-14 flex-col text-xs ${
                  selectedGenre === genre.id 
                    ? `${genre.color} text-white hover:opacity-90` 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedGenre(
                  selectedGenre === genre.id ? null : genre.id
                )}
              >
                <genre.icon className="w-3 h-3 mb-1" />
                <span className="font-medium">{genre.name}</span>
                <span className="text-xs opacity-70">{genre.description.split(',')[0]}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Genre-Specific Tasks */}
        {selectedGenre && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="text-xs text-muted-foreground font-medium mb-2">
              {genreTemplates.find(g => g.id === selectedGenre)?.name} Workflow:
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {genreTemplates
                .find(g => g.id === selectedGenre)
                ?.tasks.map((task, index) => (
                  <motion.div
                    key={task.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-auto p-2 hover:bg-primary/10 justify-between"
                      onClick={() => onTaskCreate(task.name)}
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-3 h-3" />
                        <span className="text-xs font-medium">{task.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          {task.duration}
                        </Badge>
                        <Badge className={`text-xs h-4 px-2 border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </Button>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </Card>

      {/* Quick Task Templates */}
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-600" />
          Quick Start Tasks
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickTasks.map((task, index) => (
            <motion.div
              key={task.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full h-12 flex-col border-orange-200 hover:bg-orange-50"
                onClick={() => onTaskCreate(task.name)}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 ${task.color}`}>
                  <task.icon className="w-3 h-3" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{task.name}</div>
                  <Badge variant="secondary" className="text-xs h-3 px-1 mt-0.5">
                    {task.time}
                  </Badge>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Task Categories */}
      <Card className="p-4 bg-white border border-border">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Task
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {taskCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`w-full h-12 flex-col ${
                  selectedCategory === category.id 
                    ? `${category.color} text-white hover:opacity-90` 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <category.icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{category.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Specific Tasks */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="text-xs text-muted-foreground font-medium mb-2">
              {taskCategories.find(c => c.id === selectedCategory)?.name} Tasks:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {taskCategories
                .find(c => c.id === selectedCategory)
                ?.tasks.map((task, index) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs h-8 hover:bg-primary/10 justify-start"
                      onClick={() => onTaskCreate(task)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {task}
                    </Button>
                  </motion.div>
                ))
              }
            </div>
          </motion.div>
        )}
      </Card>

      {/* Quick Schedule */}
      <Card className="p-4 bg-white border border-border">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Quick Schedule
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Today
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            This Week
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Timer className="w-3 h-3 mr-1" />
            Next Week
          </Button>
        </div>
      </Card>
    </div>
  );
}