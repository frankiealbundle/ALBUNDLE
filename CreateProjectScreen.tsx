import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Upload, Music, Calendar, Trash2, Image, Users, Clock, Target, CheckCircle2 } from 'lucide-react';
import { TaskQuickActions } from './TaskQuickActions';
import { motion } from 'motion/react';
import { projectsApi } from '../utils/supabase/client';
import { useToast } from './ToastSystem';
import { LoadingSpinner } from './LoadingSpinner';

interface CreateProjectScreenProps {
  onProjectCreated?: () => void;
}

export function CreateProjectScreen({ onProjectCreated }: CreateProjectScreenProps) {
  const { addToast } = useToast();
  const [projectType, setProjectType] = useState<'album' | 'single' | 'ep'>('album');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    genre: '',
    bpm: '',
    startDate: '',
    targetDate: ''
  });
  const [tracks, setTracks] = useState([
    { id: 1, name: '', files: [], tasks: [] }
  ]);

  const addTrack = () => {
    const newTrack = {
      id: tracks.length + 1,
      name: '',
      files: [],
      tasks: []
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (trackId: number) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const addTaskToTrack = (trackId: number, taskName?: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            tasks: [...track.tasks, { 
              id: Date.now(), 
              name: taskName || '', 
              deadline: '', 
              priority: 'medium' 
            }] 
          }
        : track
    ));
  };

  const handleQuickTaskCreate = (taskType: string) => {
    // Add task to the first track for simplicity
    if (tracks.length > 0) {
      addTaskToTrack(tracks[0].id, taskType);
    }
    setShowQuickActions(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!projectData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!tracks.some(track => track.name.trim())) {
      newErrors.tracks = 'At least one track name is required';
    }

    if (projectData.startDate && projectData.targetDate) {
      if (new Date(projectData.startDate) >= new Date(projectData.targetDate)) {
        newErrors.targetDate = 'Target date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fix the errors in the form'
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const payload = {
        name: projectData.name,
        description: projectData.description,
        genre: projectData.genre,
        bpm: projectData.bpm ? parseInt(projectData.bpm) : undefined,
        startDate: projectData.startDate,
        deadline: projectData.targetDate,
        type: projectType,
        tracks: tracks.filter(track => track.name.trim()).map(track => ({
          name: track.name,
          tasks: track.tasks.map(task => ({
            name: task.name,
            deadline: task.deadline,
            priority: task.priority,
            type: 'track_task'
          }))
        })),
        status: 'active',
        progress: 0
      };

      const response = await projectsApi.create(payload);
      console.log('Project created successfully:', response.project);
      
      addToast({
        type: 'success',
        title: 'Project Created!',
        description: `${projectData.name} has been created successfully.`
      });
      
      setIsCreating(false);
      onProjectCreated?.();
    } catch (error: any) {
      console.error('Error creating project:', error);
      addToast({
        type: 'error',
        title: 'Creation Failed',
        description: error.message || 'Failed to create project. Please try again.',
        action: {
          label: 'Retry',
          onClick: handleCreateProject
        }
      });
      setIsCreating(false);
    }
  };

  const isFormValid = projectData.name.trim() !== '' && tracks.some(track => track.name.trim() !== '');

  const projectTypes = [
    { id: 'single', name: 'Single', description: '1-3 tracks', icon: Music },
    { id: 'ep', name: 'EP', description: '4-6 tracks', icon: Music },
    { id: 'album', name: 'Album', description: '7+ tracks', icon: Music }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pb-4"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">Create New Project</h1>
          <p className="text-sm text-muted-foreground">Start your next musical journey</p>
        </motion.div>

        {/* Enhanced Project Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <Label className="text-sm font-medium text-foreground mb-3 block">Project Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {projectTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={projectType === type.id ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-16 flex-col ${
                      projectType === type.id 
                        ? 'bg-primary text-white' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setProjectType(type.id as any)}
                  >
                    <type.icon className="w-4 h-4 mb-1" />
                    <div className="text-center">
                      <div className="text-xs font-medium">{type.name}</div>
                      <div className="text-xs opacity-70">{type.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">Use pre-built templates and tasks</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Target className="w-4 h-4 mr-1" />
                {showQuickActions ? 'Hide' : 'Show'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions Panel */}
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TaskQuickActions onTaskCreate={handleQuickTaskCreate} />
          </motion.div>
        )}

        {/* Enhanced Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="project-name" className="text-sm text-foreground">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    className={`bg-input-background border-border ${errors.name ? 'border-red-500' : ''}`}
                    value={projectData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project..."
                    className="bg-input-background border-border"
                    rows={2}
                    value={projectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="genre" className="text-sm text-foreground">Genre</Label>
                    <Input
                      id="genre"
                      placeholder="e.g., Electronic"
                      className="bg-input-background border-border"
                      value={projectData.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bpm" className="text-sm text-foreground">BPM (optional)</Label>
                    <Input
                      id="bpm"
                      placeholder="120"
                      type="number"
                      className="bg-input-background border-border"
                      value={projectData.bpm}
                      onChange={(e) => handleInputChange('bpm', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Album Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              Album Cover
            </h3>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload album cover (1:1 ratio recommended)</p>
              <Button variant="outline" size="sm" className="border-border hover:bg-primary/10">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Tracks Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Tracks ({tracks.length})
              </h3>
              <Button onClick={addTrack} size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Track
              </Button>
            </div>
            {errors.tracks && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{errors.tracks}</p>
              </div>
            )}

            <div className="space-y-3">
              {tracks.map((track, index) => (
                <motion.div 
                  key={track.id} 
                  className="border border-border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <Input
                      placeholder={`Track ${index + 1} name`}
                      className="flex-1 bg-white border-border h-8"
                      value={track.name}
                      onChange={(e) => {
                        const updatedTracks = tracks.map(t => 
                          t.id === track.id ? { ...t, name: e.target.value } : t
                        );
                        setTracks(updatedTracks);
                      }}
                    />
                    {tracks.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTrack(track.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Enhanced Tasks for Track */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Tasks ({track.tasks.length})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addTaskToTrack(track.id)}
                        className="text-primary hover:text-primary h-6 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    {track.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 bg-white border border-border rounded text-xs">
                        <Input
                          placeholder="Task name (e.g., Guitar recording)"
                          className="flex-1 border-0 h-6 text-xs"
                          value={task.name}
                        />
                        <Input
                          type="date"
                          className="w-24 border-0 h-6 text-xs"
                          value={task.deadline}
                        />
                        <Badge variant="secondary" className="text-xs h-4">{task.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Project Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Project Timeline
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-date" className="text-sm text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="bg-input-background border-border"
                  value={projectData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="target-completion" className="text-sm text-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Target Date
                </Label>
                <Input
                  id="target-completion"
                  type="date"
                  className="bg-input-background border-border"
                  value={projectData.targetDate}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Collaboration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Collaborators (Optional)
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="Search artists by username..."
                className="bg-input-background border-border"
              />
              <div className="text-xs text-muted-foreground">
                Invite artists to collaborate on this project
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pb-8"
        >
          <Button 
            onClick={handleCreateProject}
            disabled={!isFormValid || isCreating}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg disabled:opacity-50"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Project...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Create Project
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}