
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";

const NoTrainingSelected = () => (
  <div className="text-center py-10">
    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
    <h3 className="text-lg font-medium text-gray-700 mb-2">No Training Selected</h3>
    <p className="text-muted-foreground">Select a date with a training session to view details.</p>
  </div>
);

const TrainingInfo = ({ training }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{training.title}</h3>
      {training.description && (
        <p className="text-gray-700 mb-6">{training.description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <div className="text-success-green">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-gray-700">{training.date}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-success-green">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p className="text-gray-700">{training.time}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-success-green">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-700">{training.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-success-green">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Attendees</p>
            <p className="text-gray-700">{training.attendees}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TrainingDetails = ({ selectedTraining }) => {
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl font-semibold">
          {selectedTraining ? 'Training Details' : 'No Training Selected'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedTraining ? <TrainingInfo training={selectedTraining} /> : <NoTrainingSelected />}
      </CardContent>
    </Card>
  );
};

export default TrainingDetails;
