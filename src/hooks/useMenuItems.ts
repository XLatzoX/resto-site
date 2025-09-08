import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching menu items...');
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:menu_categories(id, name, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Menu items fetched:', data?.length || 0, 'items');
      setMenuItems(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les éléments du menu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;

      await fetchMenuItems();
      
      toast({
        title: "Succès",
        description: "Plat ajouté au menu"
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

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchMenuItems();
      
      toast({
        title: "Succès",
        description: "Plat mis à jour"
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

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMenuItems();
      
      toast({
        title: "Succès",
        description: "Plat supprimé du menu"
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
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch: fetchMenuItems
  };
};