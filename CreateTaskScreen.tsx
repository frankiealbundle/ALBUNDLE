import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { AppHeader } from './AppHeader';
import { tasksApi } from '../utils/supabase/client';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Bell,
  Repeat,
  Link,
  Plus,
  X,
  Save,
  Mic,
  Camera,
  Music,
  AlertTriangle,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';

interface CreateTaskScreenProps {
  onNavigate?: (screen: string) => void;
  onTaskCreated?: (task: any) => void;
  prefilledData?: {
    projectId?: string;
    type?: string;
    date?: Date;
  };
}

export function CreateTaskScreen({ 
  onNavigate, 
  onTaskCreated,
  prefilledData 
}: CreateTaskScreenProps) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    type: prefilledData?.type || 'recording',
    project: prefilledData?.projectId || '',
    startDate: prefilledData?.date || new Date(),
    startTime: '09:00',
    endDate: prefilledData?.date || new Date(),
    endTime: '12:00',
    location: '',
    priority: 'medium',
    collaborators: [] as string[],
    tags: [] as string[],
    reminders: true,
    recurring: false,
    recurringPattern: 'weekly',
    notes: '',
    attachments: [] as File[]
  });

  const [newCollaborator, setNewCollaborator] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const taskTypes = [
    { id: 'recording', label: 'Recording Session', icon: Mic, color: 'bg-red-500' },
    { id: 'meeting', label: 'Team Meeting', icon: Users, color: 'bg-blue-500' },
    { id: 'photoshoot', label: 'Photo/Video Shoot', icon: Camera, color: 'bg-purple-500' },
    { id: 'deadline', label: 'Project Deadline', icon: AlertTriangle, color: 'bg-orange-500' },
    { id: 'creative', label: 'Creative Session', icon: Music, color: 'bg-green-500' },
    { id: 'collaboration', label: 'Collaboration', icon: Users, color: 'bg-indigo-500' }
  ];

  const projects = [
    { id: 'project_1', name: 'Midnight Dreams', status: 'active' },
    { id: 'project_2', name: 'Starlight', status: 'active' },
    { id: 'project_3', name: 'Ethereal Sounds', status: 'planning' },
    { id: 'project_4', name: 'Acoustic Sessions', status: 'mixing' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-700 border-red-200' }
  ];

  const suggestedTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00', '20:00'
  ];

  const handleAddCollaborator = () => {
    if (newCollaborator.trim() && !taskData.collaborators.includes(newCollaborator.trim())) {
      setTaskData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator.trim()]
      }));
      setNewCollaborator('');
    }
  };

  const handleRemoveCollaborator = (collaborator: string) => {
    setTaskData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== collaborator)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTaskData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async () => {
    if (!taskData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        projectId: taskData.project,
        startDate: format(taskData.startDate, 'yyyy-MM-dd'),
        endDate: format(taskData.endDate, 'yyyy-MM-dd'),
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        location: taskData.location,
        collaborators: taskData.collaborators,
        tags: taskData.tags,
        reminders: taskData.reminders,
        recurring: taskData.recurring,
        recurringPattern: taskData.recurring ? taskData.recurringPattern : undefined,
        notes: taskData.notes,
        status: 'pending'
      };

      const response = await tasksApi.create(taskPayload);
      console.log('Task created successfully:', response.task);

      onTaskCreated?.(response.task);
      
      // Success animation
      setCurrentStep(4); // Success step
      
      setTimeout(() => {
        onNavigate?.('agenda');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedTaskType = () => {
    return taskTypes.find(type => type.id === taskData.type);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return taskData.title.trim().length > 0 && taskData.type && taskData.project;
      case 2:
        return taskData.startTime && taskData.endTime && taskData.startDate && taskData.endDate;
      case 3:
        return true; // Step 3 is optional details, always allow progression
      default:
        return false;
    }
  };

  // Success screen
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Task Created" subtitle="Successfully added to your agenda" />
        
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-semibold text-foreground mb-2"
            >
              Task Created Successfully!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-4"
            >
              "{taskData.title}" has been added to your agenda
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center text-sm text-muted-foreground"
            >
              <Clock className="w-4 h-4 mr-1" />
              Redirecting to agenda...
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Create Task" 
        subtitle={`Step ${currentStep} of ${totalSteps}`}
        showBack={true}
        onBack={() => onNavigate?.('agenda')}
      />

      <div className="pb-24 px-4 pt-4">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div 
              className="bg-primary h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-3">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    i < currentStep 
                      ? 'bg-primary text-white' 
                      : i === currentStep - 1 
                        ? 'bg-primary/20 text-primary border-2 border-primary' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStep - 1 ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={taskData.title}
                    onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskData.description}
                    onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add task description..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Task Type</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {taskTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTaskData(prev => ({ ...prev, type: type.id }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          taskData.type === type.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center`}>
                            <type.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{type.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="project">Project</Label>
                  <Select value={taskData.project} onValueChange={(value) => setTaskData(prev => ({ ...prev, project: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <span>{project.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Scheduling */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Schedule & Timing</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={format(taskData.startDate, 'yyyy-MM-dd')}
                      onChange={(e) => setTaskData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={format(taskData.endDate, 'yyyy-MM-dd')}
                      onChange={(e) => setTaskData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Quick Time Selection</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {suggestedTimes.map((time) => (
                      <Button
                        key={time}
                        variant={taskData.startTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTaskData(prev => ({ ...prev, startTime: time }))}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={taskData.startTime}
                      onChange={(e) => setTaskData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={taskData.endTime}
                      onChange={(e) => setTaskData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={taskData.location}
                      onChange={(e) => setTaskData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Add location..."
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Priority Level</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {priorityOptions.map((priority) => (
                      <Button
                        key={priority.value}
                        variant={taskData.priority === priority.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTaskData(prev => ({ ...prev, priority: priority.value }))}
                        className="text-xs"
                      >
                        {priority.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Additional Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Collaborators</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newCollaborator}
                      onChange={(e) => setNewCollaborator(e.target.value)}
                      placeholder="Add collaborator..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator()}
                    />
                    <Button onClick={handleAddCollaborator} size="icon" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {taskData.collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {taskData.collaborators.map((collaborator, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {collaborator}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleRemoveCollaborator(collaborator)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} size="icon" variant="outline">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {taskData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {taskData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          #{tag}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label>Reminders</Label>
                        <p className="text-xs text-muted-foreground">Get notified before task starts</p>
                      </div>
                    </div>
                    <Switch
                      checked={taskData.reminders}
                      onCheckedChange={(checked) => setTaskData(prev => ({ ...prev, reminders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Repeat className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label>Recurring Task</Label>
                        <p className="text-xs text-muted-foreground">Repeat this task regularly</p>
                      </div>
                    </div>
                    <Switch
                      checked={taskData.recurring}
                      onCheckedChange={(checked) => setTaskData(prev => ({ ...prev, recurring: checked }))}
                    />
                  </div>

                  {taskData.recurring && (
                    <div className="ml-7">
                      <Select value={taskData.recurringPattern} onValueChange={(value) => setTaskData(prev => ({ ...prev, recurringPattern: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={taskData.notes}
                    onChange={(e) => setTaskData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes or requirements..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons - Fixed positioning */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border shadow-lg p-4 z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3"
            >
              Back
            </Button>
            
            <div className="flex items-center gap-2 mx-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="px-6 py-3"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !taskData.title.trim()}
                className="px-6 py-3 relative"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}