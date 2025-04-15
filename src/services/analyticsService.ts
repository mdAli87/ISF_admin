import { supabase } from '@/lib/supabase';

// Training Categories Analytics
export const getTrainingCategoriesAnalytics = async (timeRange: 'monthly' | 'weekly') => {
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
    .select('type, count')
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
  const { data: sessions, error: sessionsError } = await supabase
    .from('training_events')
    .select('date')
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: true });

  if (sessionsError) throw sessionsError;

  // Get participant count (assuming you have a participants or attendance table)
  const { data: participants, error: participantsError } = await supabase
    .from('profiles')
    .select('count')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

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

  return data.map(region => ({
    region: region.location,
    completion_rate: (region.completed_trainings / region.total_trainings) * 100
  }));
}; 