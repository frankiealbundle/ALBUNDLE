import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, MapPin, Filter, Database, Wifi, ArrowLeft, MessageCircle, UserPlus, Music, Users, Star, Settings, Share, MoreVertical } from 'lucide-react';
import { SupabaseStatus } from './SupabaseStatus';
import { AppHeader } from './AppHeader';
import { motion, AnimatePresence } from 'motion/react';
import { searchApi } from '../utils/supabase/client';

interface SearchScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  onArtistProfile?: (artistId: string) => void;
}

export function SearchScreen({ onNavigate, onArtistProfile }: SearchScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [followerRange, setFollowerRange] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [followedArtists, setFollowedArtists] = useState<number[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const genres = ['Electronic', 'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'R&B', 'Country', 'Folk', 'Reggae'];
  const locations = ['Los Angeles', 'New York', 'Nashville', 'Atlanta', 'Miami', 'Austin', 'Chicago', 'Seattle'];
  const followerRanges = ['1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K+'];

  const mockArtists = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: '@sarah_beats',
      location: 'New York, NY',
      followers: '156K',
      following: '1.2K',
      verified: true,
      avatar: 'SC',
      genre: 'Electronic',
      bio: 'Electronic music producer specializing in ambient soundscapes and experimental beats. Available for collaborations.',
      joinDate: 'Joined March 2020',
      projects: 12,
      collaborations: 28,
      rating: 4.8,
      skills: ['Production', 'Mixing', 'Sound Design'],
      equipment: ['Ableton Live', 'Moog Synthesizer', 'Audio Interface'],
      availability: 'Available for projects'
    },
    {
      id: 2,
      name: 'Beat Master',
      username: '@beatmaster_prod',
      location: 'Atlanta, GA',
      followers: '89K',
      following: '543',
      verified: false,
      avatar: 'BM',
      genre: 'Hip-Hop',
      bio: 'Hip-hop producer and sound engineer. Creating beats that move souls and inspire creativity.',
      joinDate: 'Joined July 2019',
      projects: 45,
      collaborations: 67,
      rating: 4.9,
      skills: ['Beat Making', 'Mixing', 'Mastering'],
      equipment: ['FL Studio', 'MPC', 'Studio Monitors'],
      availability: 'Open to collaborations'
    },
    {
      id: 3,
      name: 'Nina Torres',
      username: '@nina_music',
      location: 'Miami, FL',
      followers: '245K',
      following: '2.1K',
      verified: true,
      avatar: 'NT',
      genre: 'Pop',
      bio: 'Pop artist and songwriter. Crafting melodies that connect hearts and tell stories.',
      joinDate: 'Joined January 2018',
      projects: 23,
      collaborations: 34,
      rating: 4.7,
      skills: ['Songwriting', 'Vocals', 'Piano'],
      equipment: ['Logic Pro', 'Neumann Microphone', 'Piano'],
      availability: 'Booking for 2025'
    },
    {
      id: 4,
      name: 'DJ Alex',
      username: '@dj_alex_official',
      location: 'Las Vegas, NV',
      followers: '78K',
      following: '892',
      verified: false,
      avatar: 'DA',
      genre: 'Electronic',
      bio: 'DJ and electronic music producer. Bringing the dance floor to life with innovative sounds.',
      joinDate: 'Joined September 2020',
      projects: 18,
      collaborations: 41,
      rating: 4.6,
      skills: ['DJing', 'Live Performance', 'Remixing'],
      equipment: ['CDJ', 'Mixer', 'Synthesizers'],
      availability: 'Available weekends'
    },
    {
      id: 5,
      name: 'Echo Sound',
      username: '@echo_sound_studio',
      location: 'Nashville, TN',
      followers: '312K',
      following: '1.8K',
      verified: true,
      avatar: 'ES',
      genre: 'Rock',
      bio: 'Rock band and sound studio. Creating anthems for the next generation of music lovers.',
      joinDate: 'Joined May 2017',
      projects: 56,
      collaborations: 89,
      rating: 4.9,
      skills: ['Recording', 'Production', 'Live Performance'],
      equipment: ['Pro Tools', 'Live Room', 'Vintage Gear'],
      availability: 'Studio bookings open'
    },
    {
      id: 6,
      name: 'Midnight Vibes',
      username: '@midnight_vibes',
      location: 'Austin, TX',
      followers: '67K',
      following: '423',
      verified: false,
      avatar: 'MV',
      genre: 'Jazz',
      bio: 'Jazz ensemble creating smooth, late-night soundscapes perfect for intimate venues.',
      joinDate: 'Joined November 2021',
      projects: 14,
      collaborations: 22,
      rating: 4.8,
      skills: ['Jazz Performance', 'Improvisation', 'Arrangement'],
      equipment: ['Acoustic Instruments', 'Recording Setup'],
      availability: 'Touring spring 2025'
    },
  ];

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem('albundle_search_history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchArtists = async () => {
      setIsLoading(true);
      
      try {
        if (searchTerm.trim()) {
          // Use backend search API
          const response = await searchApi.artists(searchTerm, 20);
          let filtered = response.artists || [];

          // Apply additional client-side filters
          if (selectedGenre) {
            filtered = filtered.filter(artist => 
              artist.genre === selectedGenre
            );
          }

          if (selectedLocation) {
            filtered = filtered.filter(artist => 
              artist.location?.includes(selectedLocation)
            );
          }

          // Transform backend data to component format
          const transformedArtists = filtered.map(artist => ({
            id: parseInt(artist.id),
            name: artist.name,
            username: `@${artist.name.toLowerCase().replace(' ', '')}`,
            genre: artist.plan === 'pro' ? 'Electronic' : 'Indie',
            location: 'Remote',
            followers: `${Math.floor(Math.random() * 300) + 50}K`,
            following: `${Math.floor(Math.random() * 2000) + 500}`,
            projects: artist.projectCount || 0,
            collaborations: Math.floor(Math.random() * 50) + 10,
            rating: 4.5 + Math.random() * 0.5,
            verified: artist.plan === 'pro',
            avatar: artist.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            bio: `${artist.name} is a talented artist specializing in music production and collaboration.`,
            joinDate: 'Joined 2023',
            skills: ['Producer', 'Vocalist', 'Songwriter'],
            equipment: ['DAW', 'Microphone', 'Studio'],
            availability: 'Available for projects',
            online: Math.random() > 0.5
          }));

          setFilteredArtists(transformedArtists);
        } else {
          // Show mock data when no search term
          setFilteredArtists(mockArtists.filter(artist => {
            const matchesGenre = !selectedGenre || artist.genre === selectedGenre;
            const matchesLocation = !selectedLocation || artist.location.includes(selectedLocation);
            
            const followerCount = parseInt(artist.followers.replace('K', '000').replace('.', ''));
            const matchesFollowers = !followerRange || 
              (followerRange === '1K-10K' && followerCount <= 10000) ||
              (followerRange === '10K-50K' && followerCount > 10000 && followerCount <= 50000) ||
              (followerRange === '50K-100K' && followerCount > 50000 && followerCount <= 100000) ||
              (followerRange === '100K-500K' && followerCount > 100000 && followerCount <= 500000) ||
              (followerRange === '500K+' && followerCount > 500000);

            return matchesGenre && matchesLocation && matchesFollowers;
          }));
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to filtered mock data
        setFilteredArtists(mockArtists.filter(artist => {
          const matchesSearch = searchTerm.length === 0 || 
            artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artist.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
          
          const matchesGenre = !selectedGenre || artist.genre === selectedGenre;
          const matchesLocation = !selectedLocation || artist.location.includes(selectedLocation);
          
          const followerCount = parseInt(artist.followers.replace('K', '000').replace('.', ''));
          const matchesFollowers = !followerRange || 
            (followerRange === '1K-10K' && followerCount <= 10000) ||
            (followerRange === '10K-50K' && followerCount > 10000 && followerCount <= 50000) ||
            (followerRange === '50K-100K' && followerCount > 50000 && followerCount <= 100000) ||
            (followerRange === '100K-500K' && followerCount > 100000 && followerCount <= 500000) ||
            (followerRange === '500K+' && followerCount > 500000);

          return matchesSearch && matchesGenre && matchesLocation && matchesFollowers;
        }));
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchArtists();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedGenre, selectedLocation, followerRange]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem('albundle_search_history', JSON.stringify(newHistory));
    }
  };

  const handleFollowArtist = (artistId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setFollowedArtists(prev => 
      prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const handleMessageArtist = (artistId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Navigate to collaboration screen with messaging focus
    if (onNavigate) {
      onNavigate('collaboration', { artistId, mode: 'message' });
    }
  };

  const handleCollaborate = (artistId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onNavigate) {
      onNavigate('collaboration', { artistId });
    }
  };

  const handleViewProfile = (artist: any) => {
    setSelectedArtist(artist);
    if (onArtistProfile) {
      onArtistProfile(artist.id.toString());
    }
  };

  const handleShareProfile = (artistId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // In a real app, this would open share options
    navigator.share?.({
      title: 'Check out this artist on Albundle',
      url: `https://albundle.app/artist/${artistId}`
    });
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedLocation('');
    setFollowerRange('');
  };

  if (selectedArtist) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader 
          title="Artist Profile"
          subtitle={selectedArtist.username}
          actions={
            <Button 
              variant="ghost" 
              onClick={() => setSelectedArtist(null)}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          }
        />
        
        <div className="pb-20">
          {/* Artist Detail View */}
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
                    <Avatar className="w-20 h-20 mb-4 ring-4 ring-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {selectedArtist.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <h2 className="text-xl font-semibold text-foreground">{selectedArtist.name}</h2>
                    {selectedArtist.verified && (
                      <motion.div 
                        className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{selectedArtist.username}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{selectedArtist.genre}</Badge>
                    <Badge variant="outline">{selectedArtist.availability}</Badge>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-4 max-w-xs">
                    {selectedArtist.bio}
                  </p>
                  
                  {/* Location and Join Date */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedArtist.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedArtist.joinDate}</p>
                  </div>
                </div>

                {/* Enhanced Stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{selectedArtist.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{selectedArtist.projects}</p>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{selectedArtist.collaborations}</p>
                    <p className="text-sm text-muted-foreground">Collaborations</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-lg font-semibold text-foreground">{selectedArtist.rating}</p>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </motion.div>

                {/* Skills & Equipment */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.equipment.map((item: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        className={`w-full ${followedArtists.includes(selectedArtist.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white`}
                        onClick={() => handleFollowArtist(selectedArtist.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {followedArtists.includes(selectedArtist.id) ? 'Following' : 'Follow'}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-border hover:bg-muted/50"
                        onClick={() => handleMessageArtist(selectedArtist.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleCollaborate(selectedArtist.id)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Collaborate
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-border hover:bg-muted/50"
                        onClick={() => handleShareProfile(selectedArtist.id)}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Search Artists" 
        subtitle="Discover and connect with artists"
        actions={<SupabaseStatus />}
      />
      
      <div className="pb-20">
        {/* Search and Filters Section */}
        <div className="px-6 py-6">
          {/* Search Bar */}
          <motion.div 
            className="relative mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, handle, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white border-border"
            />
          </motion.div>

          {/* Search History */}
          {searchHistory.length > 0 && searchTerm === '' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Recent searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Backend Integration Status */}
          <motion.div 
            className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Database className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Connected to Supabase</span>
            <Wifi className="w-3 h-3 text-green-500" />
          </motion.div>

          {/* Filter Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 border-border hover:bg-muted/50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(selectedGenre || selectedLocation || followerRange) && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {[selectedGenre, selectedLocation, followerRange].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 mb-4 bg-white border border-border">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Genre</label>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <motion.div key={genre} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant={selectedGenre === genre ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                              className={selectedGenre === genre ? 'bg-primary text-white' : 'border-border hover:bg-muted/50'}
                            >
                              {genre}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                      <div className="flex flex-wrap gap-2">
                        {locations.map(location => (
                          <motion.div key={location} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant={selectedLocation === location ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedLocation(selectedLocation === location ? '' : location)}
                              className={selectedLocation === location ? 'bg-primary text-white' : 'border-border hover:bg-muted/50'}
                            >
                              {location}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Followers</label>
                      <div className="flex flex-wrap gap-2">
                        {followerRanges.map(range => (
                          <motion.div key={range} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant={followerRange === range ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFollowerRange(followerRange === range ? '' : range)}
                              className={followerRange === range ? 'bg-primary text-white' : 'border-border hover:bg-muted/50'}
                            >
                              {range}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {(selectedGenre || selectedLocation || followerRange) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Results */}
        <div className="px-6">
          {searchTerm.length > 0 && filteredArtists.length === 0 && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No artists found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </motion.div>
          )}
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-4 bg-white border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleViewProfile(artist)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {artist.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Artist Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {artist.name}
                          </h3>
                          {artist.verified && (
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                          <Badge variant="secondary" className="text-xs">{artist.genre}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {artist.username}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{artist.location}</span>
                          </div>
                          <span className="flex-shrink-0">{artist.followers} followers</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{artist.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => handleFollowArtist(artist.id, e)}
                        >
                          <UserPlus className={`w-4 h-4 ${followedArtists.includes(artist.id) ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => handleMessageArtist(artist.id, e)}
                        >
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => handleCollaborate(artist.id, e)}
                        >
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show all artists by default when no search */}
          {searchTerm === '' && filteredArtists.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <p className="text-sm text-muted-foreground">
                Showing {filteredArtists.length} artists • Start typing to search
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}