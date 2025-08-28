import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Users, MessageCircle, Send, Eye, Edit3 } from 'lucide-react';

interface CollaborationPanelProps {
  projectName: string;
  showComments?: boolean;
}

export function CollaborationPanel({ projectName, showComments = true }: CollaborationPanelProps) {
  const [newComment, setNewComment] = useState('');
  
  const activeUsers = [
    { id: 1, name: 'Sarah Chen', avatar: 'SC', status: 'editing', color: 'bg-green-500' },
    { id: 2, name: 'Mike Johnson', avatar: 'MJ', status: 'viewing', color: 'bg-blue-500' },
    { id: 3, name: 'Luna Ray', avatar: 'LR', status: 'commenting', color: 'bg-primary' },
  ];

  const comments = [
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: 'SC',
      message: 'Love the new bass line! Can we add some reverb?',
      timestamp: '2 min ago',
      isNew: true,
    },
    {
      id: 2,
      user: 'Mike Johnson', 
      avatar: 'MJ',
      message: 'The vocals sound perfect. Ready for mixing.',
      timestamp: '5 min ago',
      isNew: false,
    },
    {
      id: 3,
      user: 'Luna Ray',
      avatar: 'LR', 
      message: 'Added some ambient layers to track 3',
      timestamp: '12 min ago',
      isNew: false,
    },
  ];

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Mock sending comment
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Collaborators */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Active Now</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {activeUsers.length} online
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {activeUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-muted">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${user.color} rounded-full border-2 border-white`} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium">{user.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {user.status === 'editing' && <Edit3 className="w-3 h-3" />}
                  {user.status === 'viewing' && <Eye className="w-3 h-3" />}
                  {user.status === 'commenting' && <MessageCircle className="w-3 h-3" />}
                  <span>{user.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Comments */}
      {showComments && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Live Comments</h3>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              Live
            </Badge>
          </div>

          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-muted">
                    {comment.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium">{comment.user}</p>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    {comment.isNew && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
            />
            <Button 
              size="sm" 
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}