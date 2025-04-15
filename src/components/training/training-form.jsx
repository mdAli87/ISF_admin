import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import TrainerSelect from './trainer-select';
import { toast } from 'sonner';

const TrainingForm = ({ open, setOpen, onSubmit }) => {
  const [selectedTrainers, setSelectedTrainers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // First submit the form data
      await onSubmit(e);

      // Then send notifications to all selected trainers
      if (selectedTrainers.length > 0) {
        const notificationPromises = selectedTrainers.map(trainer => 
          supabase.functions.invoke('send-welcome-notification', {
            body: {
              userId: trainer.id,
              userEmail: trainer.email,
              userNumber: trainer.phone_number, // Include phone number if available
              mergeTags: {
                trainingTitle: data.title,
                trainingDate: data.date,
                trainingTime: data.time,
                trainingLocation: data.location
              }
            }
          })
        );

        const results = await Promise.allSettled(notificationPromises);
        const failures = results.filter(r => r.status === 'rejected');
        
        if (failures.length === 0) {
          toast.success(`Notifications sent to ${selectedTrainers.length} trainers`);
        } else {
          toast.warning(`${failures.length} notifications failed to send`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send notifications');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Training Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Training Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Training Title</Label>
            <Input id="title" name="title" placeholder="Enter training title" required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Enter location" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attendees">Expected Attendees</Label>
            <Input id="attendees" name="attendees" type="number" min="1" placeholder="Number of attendees" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Enter training description" required />
          </div>

          <TrainerSelect onSelect={setSelectedTrainers} />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Training</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingForm;
