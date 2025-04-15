
// This file extends the auto-generated types from Supabase
import { Database as GeneratedDatabase } from "./types";

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  user_id?: string;
}

export interface TrainingEvent {
  id: string;
  title: string;
  date: string; // ISO date string in database
  time: string;
  type: string;
  category: string;
  trainer_id: number;
  location: string;
  created_at?: string;
  created_by?: string;
}

export interface CustomDatabase extends GeneratedDatabase {
  public: {
    Tables: {
      profiles: GeneratedDatabase['public']['Tables']['profiles'];
      documents: {
        Row: Document;
        Insert: Omit<Document, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Document, 'id'>>;
      };
      training_events: {
        Row: TrainingEvent;
        Insert: Omit<TrainingEvent, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<TrainingEvent, 'id'>>;
      };
      notifications: {
        Row: {
          id: string;
          training_event_id: string;
          title: string;
          body: string;
          sent_at?: string;
          scheduled_for?: string;
          status?: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          training_event_id: string;
          title: string;
          body: string;
          sent_at?: string;
          scheduled_for?: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<{
          training_event_id: string;
          title: string;
          body: string;
          sent_at?: string;
          scheduled_for?: string;
          status?: string;
        }>;
      };
      device_tokens: {
        Row: {
          id: string;
          user_id: string;
          device_token: string;
          device_type?: string;
          created_at?: string;
          last_used_at?: string;
          is_active?: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_token: string;
          device_type?: string;
          created_at?: string;
          last_used_at?: string;
          is_active?: boolean;
        };
        Update: Partial<{
          user_id: string;
          device_token: string;
          device_type?: string;
          last_used_at?: string;
          is_active?: boolean;
        }>;
      };
    };
    Views: GeneratedDatabase['public']['Views'];
    Functions: GeneratedDatabase['public']['Functions'];
    Enums: GeneratedDatabase['public']['Enums'];
    CompositeTypes: GeneratedDatabase['public']['CompositeTypes'];
  };
}
