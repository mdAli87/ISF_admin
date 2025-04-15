
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const ScheduleItem = ({ 
  title, 
  date, 
  time, 
  location, 
  attendees 
}: { 
  title: string; 
  date: string; 
  time: string; 
  location: string; 
  attendees: number;
}) => {
  return (
    <div className="p-4 border border-secondary/20 rounded-lg hover:border-success-green/30 hover:bg-success-green/5 transition-colors">
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-success-green" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-success-green" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-success-green" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-success-green" />
          <span>{attendees} attendees</span>
        </div>
      </div>
    </div>
  );
};

const Schedule = () => {
  const upcomingSchedules = [
    {
      title: "Fire Safety Training",
      date: "April 10, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Training Center Room 101",
      attendees: 24
    },
    {
      title: "First Aid Certification",
      date: "April 15, 2025",
      time: "1:00 PM - 5:00 PM",
      location: "Medical Wing, Building B",
      attendees: 18
    },
    {
      title: "Emergency Response Drill",
      date: "April 20, 2025",
      time: "9:00 AM - 11:00 AM",
      location: "Main Campus Grounds",
      attendees: 42
    },
    {
      title: "Workplace Hazard Identification",
      date: "April 25, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Conference Room A",
      attendees: 15
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-white tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your training schedule
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        <Card className="elegant-card overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-card/80">
            <CardTitle className="text-lg font-semibold text-white">Upcoming Training Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {upcomingSchedules.map((schedule, index) => (
                <ScheduleItem key={index} {...schedule} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
