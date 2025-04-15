
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Sample data for upcoming trainings
const upcomingTrainings = [
  {
    id: 1,
    title: "Industrial Safety Protocol Workshop",
    date: "2023-11-20T10:00:00",
    location: "Chennai Manufacturing Hub",
    trainer: {
      name: "Raj Kumar",
      avatar: "/placeholder.svg",
      initials: "RK"
    },
    participants: 24,
    type: "industrial"
  },
  {
    id: 2,
    title: "Fire Emergency Response Training",
    date: "2023-11-21T14:30:00",
    location: "Bangalore Tech Park",
    trainer: {
      name: "Priya Singh",
      avatar: "/placeholder.svg",
      initials: "PS"
    },
    participants: 18,
    type: "fire"
  },
  {
    id: 3,
    title: "Road Safety Awareness Program",
    date: "2023-11-22T09:00:00",
    location: "Mumbai Transportation Center",
    trainer: {
      name: "Vikram Mehta",
      avatar: "/placeholder.svg",
      initials: "VM"
    },
    participants: 35,
    type: "road"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "fire":
      return "bg-safety-orange/10 text-safety-orange border-safety-orange/30";
    case "road":
      return "bg-deep-blue/10 text-deep-blue border-deep-blue/30";
    case "industrial":
      return "bg-success-green/10 text-success-green border-success-green/30";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "fire":
      return "Fire Safety";
    case "road":
      return "Road Safety";
    case "industrial":
      return "Industrial Safety";
    default:
      return "Other";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

const UpcomingTrainings = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Trainings</CardTitle>
            <CardDescription>Next scheduled training sessions</CardDescription>
          </div>
          <Button size="sm" variant="outline">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {upcomingTrainings.map((training) => (
            <div 
              key={training.id} 
              className="p-4 border rounded-lg transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className={`mb-2 ${getTypeColor(training.type)}`}>
                    {getTypeLabel(training.type)}
                  </Badge>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {training.title}
                  </h3>
                </div>
                <Avatar>
                  <AvatarImage src={training.trainer.avatar} alt={training.trainer.name} />
                  <AvatarFallback className="bg-secondary">{training.trainer.initials}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(training.date)}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock size={16} className="mr-2" />
                  <span>{formatTime(training.date)}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-2" />
                  <span>{training.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Users size={16} className="mr-2" />
                  <span>{training.participants} participants</span>
                </div>
              </div>
              
              <div className="flex justify-end mt-3 gap-2">
                <Button variant="ghost" size="sm">Reschedule</Button>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTrainings;
