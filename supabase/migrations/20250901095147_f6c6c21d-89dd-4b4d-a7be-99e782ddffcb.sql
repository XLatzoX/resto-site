-- PHASE 1: Création du schéma de base de données AfriSpot

-- Table des catégories de menu
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des items du menu
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Prix en FCFA
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des réservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des avis clients
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des profils admin (utilisant Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS sur toutes les tables
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour menu_categories (lecture publique, modification admin)
CREATE POLICY "Tout le monde peut voir les catégories" 
ON public.menu_categories FOR SELECT 
USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les catégories" 
ON public.menu_categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour menu_items (lecture publique des disponibles, modification admin)
CREATE POLICY "Tout le monde peut voir les items disponibles" 
ON public.menu_items FOR SELECT 
USING (available = true);

CREATE POLICY "Les admins peuvent voir tous les items" 
ON public.menu_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Seuls les admins peuvent modifier les items" 
ON public.menu_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour reservations (création publique, gestion admin)
CREATE POLICY "Tout le monde peut créer une réservation" 
ON public.reservations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Seuls les admins peuvent voir et modifier les réservations" 
ON public.reservations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour reviews (création publique, gestion admin, lecture des approuvés)
CREATE POLICY "Tout le monde peut créer un avis" 
ON public.reviews FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Tout le monde peut voir les avis approuvés" 
ON public.reviews FOR SELECT 
USING (approved = true);

CREATE POLICY "Les admins peuvent voir et modifier tous les avis" 
ON public.reviews FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Les admins peuvent voir tous les profils" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertion des données initiales
INSERT INTO public.menu_categories (name, slug, icon) VALUES
('Entrées', 'entrees', 'Utensils'),
('Plats Principaux', 'plats-principaux', 'ChefHat'),
('Desserts', 'desserts', 'Cookie'),
('Boissons', 'boissons', 'Coffee');

-- Insertion des items de menu initiaux
INSERT INTO public.menu_items (name, description, price, category_id, image_url, available) VALUES
-- Entrées
('Salade César Africaine', 'Salade fraîche avec vinaigrette à base d''arachide et légumes locaux', 3500, (SELECT id FROM public.menu_categories WHERE slug = 'entrees'), '/src/assets/dish-1.jpg', true),
('Beignets de Crevettes', 'Crevettes fraîches enrobées de pâte épicée, servies avec sauce tamarind', 4500, (SELECT id FROM public.menu_categories WHERE slug = 'entrees'), '/src/assets/dish-2.jpg', true),

-- Plats Principaux  
('Thiéboudienne Royal', 'Riz au poisson traditionnel avec légumes de saison et sauce tomate', 6500, (SELECT id FROM public.menu_categories WHERE slug = 'plats-principaux'), '/src/assets/dish-3.jpg', true),
('Mafé d''Agneau', 'Ragoût d''agneau mijoté dans une sauce riche aux arachides', 7500, (SELECT id FROM public.menu_categories WHERE slug = 'plats-principaux'), '/src/assets/dish-4.jpg', true),

-- Desserts
('Tarte à la Banane Plantain', 'Dessert traditionnel revisité avec bananes caramélisées', 2500, (SELECT id FROM public.menu_categories WHERE slug = 'desserts'), '/src/assets/hero-dish.jpg', true),

-- Boissons
('Bissap Artisanal', 'Boisson rafraîchissante à l''hibiscus avec gingembre et menthe', 1500, (SELECT id FROM public.menu_categories WHERE slug = 'boissons'), '/src/assets/dish-1.jpg', true),
('Jus de Baobab', 'Jus naturel riche en vitamines, saveur unique d''Afrique', 2000, (SELECT id FROM public.menu_categories WHERE slug = 'boissons'), '/src/assets/dish-2.jpg', true);