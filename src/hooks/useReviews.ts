import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviews = async (onlyApproved = false) => {
    try {
      setLoading(true);
      console.log('Fetching reviews, onlyApproved:', onlyApproved);
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyApproved) {
        query = query.eq('approved', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Reviews fetched:', data?.length || 0, 'reviews');
      setReviews(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'approved' | 'featured'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...review, approved: false, featured: false }])
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      
      toast({
        title: "Succès",
        description: "Avis soumis avec succès"
      });

      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      return { data: null, error: err };
    }
  };

  const updateReview = async (id: string, updates: Partial<Review>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      
      toast({
        title: "Succès",
        description: "Avis mis à jour"
      });

      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      return { data: null, error: err };
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchReviews();
      
      toast({
        title: "Succès",
        description: "Avis supprimé"
      });

      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      return { error: err };
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews
  };
};