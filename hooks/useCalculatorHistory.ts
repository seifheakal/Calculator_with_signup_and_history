import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type CalculationHistory = Database['public']['Tables']['calculations_history']['Row'];

export const useCalculatorHistory = (userId: string | undefined) => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calculation history for the current user
  const fetchHistory = async () => {
    if (!userId) {
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('calculations_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to last 50 calculations

      if (error) throw error;

      setHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      console.error('Error fetching calculation history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save a new calculation to history
  const saveCalculation = async (expression: string, result: string) => {
    if (!userId || !expression || !result) return;

    try {
      const { error } = await supabase
        .from('calculations_history')
        .insert({
          user_id: userId,
          expression,
          result,
        });

      if (error) throw error;

      // Refresh history after saving
      await fetchHistory();
    } catch (err) {
      console.error('Error saving calculation:', err);
      setError(err instanceof Error ? err.message : 'Failed to save calculation');
    }
  };

  // Clear all history for the current user
  const clearHistory = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('calculations_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  };

  // Fetch history when userId changes
  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return {
    history,
    loading,
    error,
    saveCalculation,
    clearHistory,
    refreshHistory: fetchHistory,
  };
};