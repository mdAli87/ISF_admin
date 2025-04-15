import { supabase } from '../lib/supabaseClient';

export async function getCategoryDistribution() {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('category, count(*)')
      .group('category');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    return [];
  }
}

export async function getSeverityDistribution() {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('severity, count(*)')
      .group('severity');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching severity distribution:', error);
    return [];
  }
}

export async function getMonthlyIncidentTrends() {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('created_at, count(*)')
      .group('created_at')
      .order('created_at');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching monthly incident trends:', error);
    return [];
  }
}

export async function getTopReportedLocations(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('location, count(*)')
      .group('location')
      .order('count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching top reported locations:', error);
    return [];
  }
}

export async function getRecentIncidents(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent incidents:', error);
    return [];
  }
} 