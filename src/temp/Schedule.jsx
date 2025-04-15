import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { format, addDays, startOfWeek, getDay, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  RefreshCw,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please enter a time" }),
  type: z.string({ required_error: "Please select a training type" }),
  trainer: z.string({ required_error: "Please select a trainer" }),
  location: z.string().optional(),
  sendNotification: z.boolean().default(false),
  notificationTitle: z.string().optional(),
  notificationBody: z.string().optional(),
});

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      time: "",
      type: "",
      trainer: "",
      location: "",
      sendNotification: false,
      notificationTitle: "",
      notificationBody: "",
    },
  });

  // Fetch trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from('trainers')
          .select('*')
          .eq('status', 'active');
        
        if (error) throw error;
        if (data) setTrainers(data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch trainers",
          variant: "destructive",
        });
      }
    };

    fetchTrainers();
  }, [toast]);

  // Fetch training types
  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        // Default training types if fetch fails
        const defaultTypes = [
          { id: 1, name: 'Fire Safety', category: 'Safety' },
          { id: 2, name: 'Road Safety', category: 'Safety' },
          { id: 3, name: 'First Aid', category: 'Medical' },
          { id: 4, name: 'Emergency Response', category: 'Safety' }
        ];

        const { data, error } = await supabase
          .from('training_types')
          .select('*');
        
        if (error) {
          console.warn('Falling back to default training types:', error);
          setTrainingTypes(defaultTypes);
          return;
        }

        if (data && data.length > 0) {
          setTrainingTypes(data);
        } else {
          console.warn('No training types found, using defaults');
          setTrainingTypes(defaultTypes);
        }
      } catch (error) {
        console.error('Error fetching training types:', error);
        // Set default types on error
        setTrainingTypes([
          { id: 1, name: 'Fire Safety', category: 'Safety' },
          { id: 2, name: 'Road Safety', category: 'Safety' },
          { id: 3, name: 'First Aid', category: 'Medical' },
          { id: 4, name: 'Emergency Response', category: 'Safety' }
        ]);
        toast({
          title: "Warning",
          description: "Using default training types",
          variant: "warning",
        });
      }
    };

    fetchTrainingTypes();
  }, [toast]);

  useEffect(() => {
    if (selectedDate) {
      form.setValue("date", selectedDate);
    }
  }, [selectedDate, form]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('training_events')
          .select(`
            *,
            trainers (
              name,
              email,
              phone
            )
          `);
        
        if (error) throw error;
        
        if (data) {
          const formattedEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            date: parseISO(event.date),
            time: event.time,
            type: event.type,
            category: event.category,
            trainer: event.trainers,
            trainer_id: event.trainer_id,
            location: event.location,
            created_at: event.created_at
          }));
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch training events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const generateCalendarDays = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    let days = [];
    
    for (let i = 0; i < 35; i++) {
      const date = addDays(startDate, i);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  const onSubmit = async (values) => {
    try {
      const trainingType = trainingTypes.find(t => t.name === values.type);
      const category = trainingType ? trainingType.category : "";
      const formattedDate = values.date.toISOString().split('T')[0];
      
      // Create the training event
      const { data: eventData, error: eventError } = await supabase
        .from('training_events')
        .insert({
          title: values.title,
          date: formattedDate,
          time: values.time,
          type: values.type,
          category: category,
          trainer_id: values.trainer, // This should be a UUID from the trainers table
          location: values.location || "",
        })
        .select(`
          *,
          trainers (
            name,
            email,
            phone
          )
        `);
      
      if (eventError) throw eventError;
      
      // Send notification if checkbox is checked
      if (values.sendNotification && eventData && eventData.length > 0) {
        try {
          const headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHRpbnRsdnNtbXBnYXBjemxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Njk3MTEsImV4cCI6MjA1ODU0NTcxMX0.sxYIkGTWU2NgqZN0a4yGD5J0tNByQwWyTaqmJ0MGBjE',
            'Content-Type': 'application/json'
          };

          const trainer = eventData[0].trainers;
          const body = {
            userId: '2023.taha.sayyed@ves.ac.in',
            userEmail: '2023.taha.sayyed@ves.ac.in',
            mergeTags: {
              trainingTitle: values.title,
              trainingDate: format(values.date, 'yyyy-MM-dd'),
              trainingTime: values.time,
              trainingLocation: values.location || 'TBD',
              trainerName: trainer?.name || 'Not Specified'
            }
          };

          const response = await fetch('https://xaltintlvsmmpgapczlp.supabase.co/functions/v1/send-welcome-notification', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
          });

          if (!response.ok) throw new Error('Failed to send notification');
          const result = await response.json();

          if (!result.success) throw new Error('Notification API error');

          toast({
            title: "Success",
            description: "Training scheduled and notification sent",
            variant: "success",
          });
        } catch (error) {
          console.error('Notification error:', error);
          toast({
            title: "Warning",
            description: "Training scheduled but notification failed",
            variant: "warning",
          });
        }
      } else {
        // Just show training scheduled message if no notification
        toast({
          title: "Success",
          description: "Training scheduled successfully",
          variant: "success",
        });
      }
      
      if (eventData && eventData.length > 0) {
        const newEvent = {
          ...eventData[0],
          date: values.date,
          trainer: eventData[0].trainers
        };
        
        setEvents(prevEvents => [...prevEvents, newEvent]);
        setIsAddEventOpen(false);
        form.reset();
        
        toast({
          title: "Success",
          description: "Training session scheduled successfully",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error scheduling training:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule training",
        variant: "destructive",
      });
    }
  };

  const navigatePrevious = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const navigateNext = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };
  
  const getTrainerName = (id) => {
    const trainer = trainers.find(t => t.id === id);
    return trainer ? trainer.name : "Unknown";
  };

  const handleRefreshCalendar = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_events')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        const formattedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          date: parseISO(event.date),
          time: event.time,
          type: event.type,
          category: event.category,
          trainer_id: event.trainer_id,
          location: event.location,
        }));
        
        setEvents(formattedEvents);
      }
      
      toast({
        title: "Calendar Refreshed",
        description: "Latest training schedule has been loaded",
        variant: "default",
      });
    } catch (error) {
      console.error("Error refreshing events:", error);
      toast({
        title: "Error",
        description: "Failed to refresh training events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('training_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Remove event from local state
      setEvents(events.filter(event => event.id !== eventId));

      toast({
        title: "Success",
        description: "Training event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete training event",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="page-title">Training Schedule</h1>
            <p className="text-charcoal font-raleway mt-1">
              Manage and view upcoming training sessions
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="glass-button" onClick={handleRefreshCalendar} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button variant="creative">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Training
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel pointer-events-auto">
                <DialogHeader>
                  <DialogTitle>Schedule New Training</DialogTitle>
                  <DialogDescription>
                    Create a new training session for your team.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter training title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-3 text-left font-normal glass-button"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 glass-panel pointer-events-auto">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                    setSelectedDate(date);
                                  }
                                }}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="e.g. 10:00 AM" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="glass-button">
                                <SelectValue placeholder="Select training type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-panel pointer-events-auto">
                              {trainingTypes.map((type) => (
                                <SelectItem key={type.id} value={type.name}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trainer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trainer</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="glass-button">
                                <SelectValue placeholder="Select a trainer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-panel pointer-events-auto">
                              {trainers.map((trainer) => (
                                <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                  {trainer.name} - {trainer.specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sendNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Send Notification</FormLabel>
                            <FormDescription>
                              Send a push notification for this training session
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("sendNotification") && (
                      <>
                        <FormField
                          control={form.control}
                          name="notificationTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notification Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Custom notification title (optional)" {...field} />
                              </FormControl>
                              <FormDescription>
                                Leave blank to use default: "New Training: [Title]"
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notificationBody"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notification Message</FormLabel>
                              <FormControl>
                                <Input placeholder="Custom notification message (optional)" {...field} />
                              </FormControl>
                              <FormDescription>
                                Leave blank to use default message with training details
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Bell className="w-4 h-4 mr-2" />
                        Save Training
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="glass-panel mb-6 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold font-montserrat">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="ghost" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-semibold">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const dayEvents = getEventsForDate(day);
                
                return (
                  <div 
                    key={index}
                    className={`calendar-day group ${
                      isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                    } ${
                      isSameDay(day, new Date()) ? 'calendar-day-active' : ''
                    } ${
                      selectedDate && isSameDay(day, selectedDate) ? 'bg-tea-green/30 font-medium' : ''
                    }`}
                    onClick={() => {
                      setSelectedDate(day);
                      if (dayEvents.length === 0) {
                        setIsAddEventOpen(true);
                      }
                    }}
                  >
                    <div className="relative h-full w-full group-hover:bg-tea-green/20 rounded-md transition-colors p-2">
                      <span className="absolute top-0 right-2">{day.getDate()}</span>
                      <div className="mt-6 space-y-1">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <div 
                            key={idx} 
                            className={`calendar-event ${event.category || 'default'}`}
                            title={`${event.title} - ${event.time}`}
                          >
                            {event.title.length > 10 ? event.title.substring(0, 10) + '...' : event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-center font-medium text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {selectedDate && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold font-montserrat">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <Button 
                variant="outline" 
                className="glass-button" 
                onClick={() => {
                  setIsAddEventOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getEventsForDate(selectedDate).map((event) => (
                <Card key={event.id} className={`glass-card-${event.category === 'fire' ? 'accent' : 'success'}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg font-raleway">{event.title}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${event.category === 'fire' ? 'chart-orange' : event.category === 'road' ? 'oxford-blue' : 'cambridge-blue'}/20 text-${event.category === 'fire' ? 'chart-orange' : event.category === 'road' ? 'oxford-blue' : 'cambridge-blue'}`}>
                        {event.type}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {event.time}
                      </div>
                      <div>|</div>
                      <div>{event.location}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${event.trainer_id}`} />
                            <AvatarFallback className="avatar-gradient">
                              {getTrainerName(event.trainer_id).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{getTrainerName(event.trainer_id)}</div>
                            <div className="text-xs text-muted-foreground">
                              {trainers.find(t => t.id === event.trainer_id)?.specialty}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-500/10 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
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
                  </CardContent>
                </Card>
              ))}
              
              {getEventsForDate(selectedDate).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground glass-panel">
                  <p>No training sessions scheduled for this date.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 glass-button" 
                    onClick={() => setIsAddEventOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Training
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
