import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  datetime: string;
  guests: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('datetime', { ascending: false });

      if (error) throw error;

      setReservations((data || []) as Reservation[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ ...reservation, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;

      await fetchReservations();
      
      toast({
        title: "Succès",
        description: "Réservation créée avec succès"
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

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchReservations();
      
      toast({
        title: "Succès",
        description: `Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}`
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

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    error,
    addReservation,
    updateReservationStatus,
    refetch: fetchReservations
  };
};