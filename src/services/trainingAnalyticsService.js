import { supabase } from '../lib/supabaseClient';

export async function getTrainingCategories() {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('category, session_date, participants_count')
      .order('session_date');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching training categories:', error);
    return [];
  }
}

export async function getCategoryDistribution() {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('category, count(*)')
      .group('category');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    return [];
  }
}

export async function getWeeklyTrends() {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('session_date, participants_count')
      .order('session_date');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching weekly trends:', error);
    return [];
  }
}

export async function getRegionalPerformance() {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('region, participants_count, completion_count')
      .order('region');

    if (error) throw error;

    // Calculate completion rates by region
    const regionalStats = {};
    data?.forEach(session => {
      if (!regionalStats[session.region]) {
        regionalStats[session.region] = {
          total_participants: 0,
          total_completions: 0
        };
      }
      regionalStats[session.region].total_participants += session.participants_count;
      regionalStats[session.region].total_completions += session.completion_count;
    });

    // Convert to array with completion rates
    return Object.entries(regionalStats).map(([region, stats]) => ({
      region,
      completion_rate: stats.total_completions / stats.total_participants * 100
    })) || [];
  } catch (error) {
    console.error('Error fetching regional performance:', error);
    return [];
  }
} 