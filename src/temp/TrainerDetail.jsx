
import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  FileText, 
  Star,
  Clock, 
  CheckCircle, 
  Users,
  ChevronLeft,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Find the trainer from the mock data
  // This would be replaced with a Supabase fetch in a real implementation
  const trainers = [
    { 
      id: "t1", 
      name: "Raj Kumar", 
      specialty: "Fire Safety", 
      initials: "RK", 
      trainings: 32,
      rating: 4.8,
      email: "raj.kumar@email.com",
      phone: "+91 9876543210",
      status: "active",
      certifications: ["Fire Safety Expert", "Hazard Management"],
      avatar: "/avatars/raj-kumar.jpg",
      bio: "10+ years of experience in fire safety training. Expert in evacuation procedures and fire prevention techniques."
    },
    { 
      id: "t2", 
      name: "Priya Singh", 
      specialty: "Road Safety", 
      initials: "PS", 
      trainings: 28,
      rating: 4.7,
      email: "priya.singh@email.com",
      phone: "+91 9876543211",
      status: "active",
      certifications: ["Traffic Safety Specialist", "Driver Education"],
      avatar: "/avatars/priya-singh.jpg",
      bio: "Former traffic police officer with specialized knowledge in road safety protocols and defensive driving techniques."
    },
    { 
      id: "t3", 
      name: "Vikram Mehta", 
      specialty: "Industrial Safety", 
      initials: "VM", 
      trainings: 45,
      rating: 4.9,
      email: "vikram.mehta@email.com",
      phone: "+91 9876543212",
      status: "vacation",
      certifications: ["Industrial Safety Expert", "Machine Operation Safety"],
      avatar: "/avatars/vikram-mehta.jpg",
      bio: "Industrial engineering background with extensive experience in factory safety procedures and risk assessment."
    }
  ];
  
  const trainer = trainers.find(t => t.id === id) || {
    id: id,
    name: `Trainer ${id}`,
    specialty: "Safety Training",
    initials: "TR",
    trainings: 30,
    rating: 4.5,
    email: "contact@example.com",
    phone: "+91 9876543200",
    status: "active",
    certifications: ["Safety Training"],
    avatar: "/placeholder.svg",
    bio: "An experienced safety trainer."
  };

  // Sample upcoming sessions
  const upcomingTrainings = [
    {
      id: 1,
      title: "Fire Safety Workshop",
      date: "2025-04-15",
      time: "10:00 - 12:00",
      location: "Chennai Central Office",
      participants: 15,
    },
    {
      id: 2,
      title: "Emergency Response Drill",
      date: "2025-04-17",
      time: "13:00 - 15:00",
      location: "Chennai Central Office",
      participants: 30,
    },
    {
      id: 3,
      title: "Hazard Identification Training",
      date: "2025-04-22",
      time: "09:00 - 11:00",
      location: "Bangalore Manufacturing Plant",
      participants: 12,
    },
  ];

  // Sample feedback data
  const feedbackData = [
    {
      id: 1,
      name: "Priya Sharma",
      feedback: "Excellent training session. Very informative and engaging.",
      date: "April 5, 2025",
      rating: 5,
      avatar: "/placeholder.svg",
      initials: "PS",
    },
    {
      id: 2,
      name: "Vikram Singh",
      feedback: "Practical demonstrations were very helpful. Clear explanations.",
      date: "April 1, 2025",
      rating: 4,
      avatar: "/placeholder.svg",
      initials: "VS",
    },
    {
      id: 3,
      name: "Ananya Patel",
      feedback: "Knowledgeable and answered all our questions thoroughly.",
      date: "March 28, 2025",
      rating: 5,
      avatar: "/placeholder.svg",
      initials: "AP",
    },
  ];

  const handleScheduleTraining = () => {
    toast({
      title: "Schedule Training",
      description: `Schedule a training session with ${trainer.name}`,
    });
    navigate("/schedule", { state: { trainerId: trainer.id } });
  };
  
  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: `Your message will be sent to ${trainer.name}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/trainers')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Trainer Profile</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSendMessage}>
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <Button onClick={handleScheduleTraining}>
              <Calendar className="mr-2 h-4 w-4" /> Schedule Training
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Trainer Profile */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-success-green/10 to-vibrant-green/5 border-b border-success-green/20">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg mb-3">
                  <AvatarImage src={trainer.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-success-green to-vibrant-green text-white text-xl font-semibold">
                    {trainer.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-bold text-center">{trainer.name}</CardTitle>
                <Badge className="mt-2 bg-gradient-to-r from-cambridge-blue to-tea-green text-white border-none">
                  {trainer.specialty}
                </Badge>
                <div className="flex items-center mt-3 bg-white/10 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{trainer.rating} rating</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-cambridge-blue" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-cambridge-blue" />
                    <span className="text-sm">{trainer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-cambridge-blue" />
                    <span className="text-sm">Mumbai, India</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/20 mt-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-cambridge-blue" />
                    Certifications
                  </h3>
                  <ul className="space-y-2">
                    {trainer.certifications.map((cert, index) => (
                      <li key={index} className="text-xs flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-success-green mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 mt-4">
                  <Button className="w-full" onClick={handleScheduleTraining}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Tabs with Training Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
              <TabsTrigger value="sessions" onClick={() => setActiveTab("sessions")}>Sessions</TabsTrigger>
              <TabsTrigger value="feedback" onClick={() => setActiveTab("feedback")}>Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-success-green" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trainings</p>
                        <p className="text-xl font-bold">{trainer.trainings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-success-green" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Participants</p>
                        <p className="text-xl font-bold">580</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-success-green" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Duration</p>
                        <p className="text-xl font-bold">2.5 hrs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Training Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted/30 flex items-center justify-center rounded-md">
                      <span className="text-muted-foreground">Monthly Training Sessions Chart</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted/30 flex items-center justify-center rounded-md">
                      <span className="text-muted-foreground">Session Categories Chart</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Trainings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingTrainings.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-success-green/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-success-green" />
                        </div>
                        <div>
                          <h4 className="font-medium">{training.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {training.date} • {training.time} • {training.location}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-success-green/10 text-success-green border-success-green/20">
                        {training.participants} Participants
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Training Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-muted/30 flex items-center justify-center rounded-md">
                    <span className="text-muted-foreground">Monthly Training Sessions Chart</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chennai Central Office</span>
                      <span className="text-sm font-medium">18 Sessions</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-success-green h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm">Bangalore Manufacturing Plant</span>
                      <span className="text-sm font-medium">12 Sessions</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-success-green h-2 rounded-full" style={{ width: '27%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm">Mumbai Transportation Hub</span>
                      <span className="text-sm font-medium">8 Sessions</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-success-green h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Attendance</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-success-green/10 flex items-center justify-center">
                        <Users className="h-8 w-8 text-success-green" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Participants</p>
                        <p className="text-2xl font-bold">580</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Average Attendance Rate</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div className="bg-success-green h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-success-green/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Avg. Participants</p>
                        <p className="text-xl font-bold">12.9</p>
                        <p className="text-xs text-muted-foreground">per session</p>
                      </div>
                      <div className="bg-cambridge-blue/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Highest Attendance</p>
                        <p className="text-xl font-bold">32</p>
                        <p className="text-xs text-muted-foreground">participants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
                  <CardTitle className="text-lg">Participant Feedback</CardTitle>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{trainer.rating}/5.0</span>
                    <span className="ml-2 text-sm text-muted-foreground">(42 reviews)</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {feedbackData.map((item) => (
                    <div key={item.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback className="bg-cambridge-blue text-white">
                            {item.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.date}</p>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${star <= item.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{item.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">View All Reviews</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDetail;
