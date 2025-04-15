import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TabsContent, 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Grid, 
  List, 
  MessageSquare, 
  Phone, 
  Search, 
  UserPlus, 
  Calendar,
  Award,
  Star,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const getSpecialtyColor = specialty => {
  switch (specialty) {
    case "Fire Safety":
      return "bg-oxford-blue/10 text-oxford-blue border-oxford-blue/30";
    case "Road Safety":
      return "bg-charcoal/10 text-charcoal border-charcoal/30";
    case "Industrial Safety":
      return "bg-cambridge-blue/10 text-cambridge-blue border-cambridge-blue/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = status => {
  switch (status) {
    case "active":
      return "bg-olivine/10 text-olivine border-olivine/30";
    case "vacation":
      return "bg-tea-green/10 text-charcoal border-tea-green/30";
    case "inactive":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Trainers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addTrainerOpen, setAddTrainerOpen] = useState(false);
  const [deleteTrainerOpen, setDeleteTrainerOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "Fire Safety",
    status: "active",
    bio: "",
    initials: ""
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trainers')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast({
        title: "Error fetching trainers",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewTrainerChange = (e) => {
    const { name, value } = e.target;
    
    let updates = {
      [name]: value
    };
    
    // Auto-generate initials when name changes
    if (name === 'name') {
      const nameParts = value.split(' ');
      const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
      updates.initials = initials.slice(0, 2); // Limit to 2 characters
    }
    
    setNewTrainer(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('trainers')
        .insert([{
          name: newTrainer.name,
          email: newTrainer.email,
          phone: newTrainer.phone,
          specialty: newTrainer.specialty,
          status: newTrainer.status,
          bio: newTrainer.bio || `New trainer specializing in ${newTrainer.specialty}`,
          initials: newTrainer.initials,
          trainings: 0,
          rating: 0.0,
          certifications: []
        }])
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Trainer Added",
        description: `${newTrainer.name} has been added as a trainer.`,
      });
      
      setAddTrainerOpen(false);
      setNewTrainer({
        name: "",
        email: "",
        phone: "",
        specialty: "Fire Safety",
        status: "active",
        bio: "",
        initials: ""
      });
      
      // Refresh trainers list
      fetchTrainers();
      
    } catch (error) {
      console.error('Error adding trainer:', error);
      toast({
        title: "Error adding trainer",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = (trainerId) => {
    navigate(`/trainer/${trainerId}`);
  };

  const handleDeleteTrainer = async () => {
    if (!trainerToDelete) return;
    
    try {
      // First, delete all associated training events
      const { error: eventsError } = await supabase
        .from('training_events')
        .delete()
        .eq('trainer_id', trainerToDelete.id);
        
      if (eventsError) {
        throw eventsError;
      }
      
      // Then delete the trainer
      const { error: trainerError } = await supabase
        .from('trainers')
        .delete()
        .eq('id', trainerToDelete.id);
        
      if (trainerError) {
        throw trainerError;
      }
      
      toast({
        title: "Trainer Deleted",
        description: `${trainerToDelete.name} has been removed from the system.`,
      });
      
      setDeleteTrainerOpen(false);
      setTrainerToDelete(null);
      
      // Refresh trainers list
      fetchTrainers();
      
    } catch (error) {
      console.error('Error deleting trainer:', error);
      toast({
        title: "Error deleting trainer",
        description: "Cannot delete trainer. Please ensure all associated training events are removed first.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <CardHeader>
        <CardTitle>Training Specialists</CardTitle>
        <div className="text-sm text-muted-foreground">
          Manage and view all safety training specialists
        </div>
      </CardHeader>

      <div className="flex items-center justify-between space-x-2 mb-4">
        <div className="flex items-center relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search trainers..." 
            className="pl-8 w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="border rounded-md p-1">
            <Button variant="ghost" size="sm" className="px-2 py-1">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="px-2 py-1">
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={addTrainerOpen} onOpenChange={setAddTrainerOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Trainer</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new safety trainer to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTrainer}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newTrainer.name}
                      onChange={handleNewTrainerChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newTrainer.email}
                      onChange={handleNewTrainerChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newTrainer.phone}
                      onChange={handleNewTrainerChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialty" className="text-right">
                      Specialty
                    </Label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={newTrainer.specialty}
                      onChange={handleNewTrainerChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Fire Safety">Fire Safety</option>
                      <option value="Road Safety">Road Safety</option>
                      <option value="Industrial Safety">Industrial Safety</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={newTrainer.bio}
                      onChange={handleNewTrainerChange}
                      className="col-span-3 flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Trainer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cambridge-blue"></div>
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No trainers found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't added any trainers yet. Get started by adding your first training specialist.
          </p>
          <Button onClick={() => setAddTrainerOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Your First Trainer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers
            .filter(trainer => search ? trainer.name.toLowerCase().includes(search.toLowerCase()) : true)
            .map((trainer) => (
            <Card key={trainer.id} className="relative">
              <CardContent className="p-4">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={trainer.avatar_url} />
                      <AvatarFallback>
                        {trainer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{trainer.name}</h3>
                      <Badge className={getSpecialtyColor(trainer.specialty)}>{trainer.specialty}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(trainer.status)}>
                      {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrainerToDelete(trainer);
                        setDeleteTrainerOpen(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                    <span className="text-lg font-semibold">{trainer.trainings}</span>
                    <span className="text-xs text-muted-foreground">Trainings</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                    <span className="text-lg font-semibold">{trainer.rating || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">Rating</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewProfile(trainer.id)}
                  >
                    Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className="absolute top-0 right-0 h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" align="end">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={trainer.avatar_url} />
                      <AvatarFallback>
                        {trainer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{trainer.name}</h4>
                      <div className="flex items-center text-xs">
                        <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        <span>{trainer.rating || "No ratings yet"}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{trainer.trainings || 0} sessions conducted</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">{trainer.bio || "No bio available."}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" /> 
                      <h5 className="text-sm font-medium">Certifications</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trainer.certifications && trainer.certifications.length > 0 ? (
                        trainer.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No certifications added</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full" onClick={() => handleViewProfile(trainer.id)}>
                      View Full Profile
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteTrainerOpen} onOpenChange={setDeleteTrainerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Trainer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trainer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {trainerToDelete && (
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Avatar>
                  <AvatarImage src={trainerToDelete.avatar_url} />
                  <AvatarFallback>{trainerToDelete.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{trainerToDelete.name}</h4>
                  <p className="text-sm text-muted-foreground">{trainerToDelete.specialty}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTrainerOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrainer}>
              Delete Trainer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Trainers;
