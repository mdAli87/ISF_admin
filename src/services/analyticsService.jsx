import { supabase } from '../lib/supabase';

// Training Categories Analytics
export const getTrainingCategoriesAnalytics = async (timeRange) => {
  const { data, error } = await supabase
    .from('training_events')
    .select('date, type, category')
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
};

// Category Distribution
export const getCategoryDistribution = async () => {
  const { data, error } = await supabase
    .from('training_events')
    .select(`
      type,
      count(*) as count
    `)
    .group('type');

  if (error) throw error;
  return data;
};

// Weekly Trends
export const getWeeklyTrends = async () => {
  // Get sessions from the last 7 days
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: sessions, error: sessionsError } = await supabase
    .from('training_events')
    .select('date')
    .gte('date', oneWeekAgo)
    .order('date', { ascending: true });

  if (sessionsError) throw sessionsError;

  // Get participant count from the last 7 days
  const { data: participants, error: participantsError } = await supabase
    .from('profiles')
    .select('count')
    .gte('created_at', oneWeekAgo);

  if (participantsError) throw participantsError;

  return {
    sessions,
    participants
  };
};

// Regional Performance
export const getRegionalPerformance = async () => {
  const { data, error } = await supabase
    .from('training_events')
    .select(`
      location,
      count(*) as total_trainings,
      count(case when status = 'completed' then 1 end) as completed_trainings
    `)
    .group('location');

  if (error) throw error;

  // Calculate completion rate for each region
  return data.map(region => ({
    region: region.location,
    completion_rate: (region.completed_trainings / region.total_trainings) * 100,
    total_trainings: region.total_trainings,
    completed_trainings: region.completed_trainings
  }));
}; 