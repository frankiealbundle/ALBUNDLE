import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Settings, MapPin, Calendar, Music, Award, Users, UserPlus } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { motion } from 'motion/react';

export function ArtistProfileScreen() {
  const artistData = {
    name: 'Luna Ray',
    username: '@luna_ray_music',
    bio: 'Electronic music producer & ambient sound designer. Creating ethereal soundscapes since 2019.',
    followers: '24.5K',
    following: '892',
    location: 'Los Angeles, CA',
    verified: true,
    joinDate: 'Joined October 2019',
    totalTracks: 47,
    achievements: 3
  };

  const stats = [
    { label: 'Followers', value: artistData.followers, icon: Users },
    { label: 'Following', value: artistData.following, icon: UserPlus },
    { label: 'Tracks', value: artistData.totalTracks, icon: Music },
    { label: 'Awards', value: artistData.achievements, icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Profile" 
        subtitle="Your artist profile"
        actions={
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Settings className="w-5 h-5" />
          </Button>
        }
      />
      
      <div className="pb-20">
        {/* Profile Card */}
        <div className="px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      LR
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <h2 className="text-2xl font-semibold text-foreground">{artistData.name}</h2>
                  {artistData.verified && (
                    <motion.div 
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
                
                <p className="text-sm text-muted-foreground mb-4">{artistData.username}</p>
                
                <p className="text-sm text-foreground leading-relaxed mb-4 max-w-sm">
                  {artistData.bio}
                </p>
                
                {/* Location and Join Date */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{artistData.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{artistData.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 gap-4 py-4 border-y border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{artistData.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{artistData.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{artistData.totalTracks}</p>
                  <p className="text-xs text-muted-foreground">Tracks</p>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{artistData.achievements}</p>
                  <p className="text-xs text-muted-foreground">Awards</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="mt-6 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full border-border hover:bg-muted/50 h-10">
                      <Music className="w-4 h-4 mr-2" />
                      My Music
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full border-border hover:bg-muted/50 h-10">
                      <Award className="w-4 h-4 mr-2" />
                      Achievements
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Additional Profile Sections */}
        <div className="px-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-4 bg-white border border-border hover:shadow-md transition-shadow">
              <h3 className="font-medium text-foreground mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-foreground">Completed "Midnight Dreams" recording</span>
                  <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-foreground">Started new project "Ethereal Sounds"</span>
                  <span className="text-xs text-muted-foreground ml-auto">1d ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-foreground">Collaborated with @sarah_beats</span>
                  <span className="text-xs text-muted-foreground ml-auto">3d ago</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}