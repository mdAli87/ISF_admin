import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { supabase } from '@/lib/supabaseClient';

const TrainerSelect = ({ onSelect }) => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('id, name, email, phone_number');
      
      if (!error && data) {
        setTrainers(data);
      }
    };

    fetchTrainers();
  }, []);

  const handleTrainerChange = (selectedIds) => {
    const selected = trainers.filter(trainer => selectedIds.includes(trainer.id));
    setSelectedTrainers(selected);
    onSelect(selected); // Pass full trainer objects to parent
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="trainers">Select Trainers</Label>
      <MultiSelect
        id="trainers"
        placeholder="Select trainers"
        options={trainers.map(trainer => ({
          value: trainer.id,
          label: trainer.name,
          trainer: trainer // Store full trainer object
        }))}
        value={selectedTrainers.map(trainer => trainer.id)}
        onChange={handleTrainerChange}
      />
    </div>
  );
};

export default TrainerSelect;
