-- Corriger la récursion infinie dans les politiques RLS

-- 1. Supprimer toutes les politiques problématiques sur profiles
DROP POLICY IF EXISTS "Les admins peuvent voir tous les profils" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;

-- 2. Supprimer les politiques problématiques sur menu_categories  
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les catégories" ON public.menu_categories;
DROP POLICY IF EXISTS "Tout le monde peut voir les catégories" ON public.menu_categories;

-- 3. Supprimer les politiques problématiques sur menu_items
DROP POLICY IF EXISTS "Les admins peuvent voir tous les items" ON public.menu_items;
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les items" ON public.menu_items;
DROP POLICY IF EXISTS "Tout le monde peut voir les items disponibles" ON public.menu_items;

-- 4. Supprimer les politiques problématiques sur reservations
DROP POLICY IF EXISTS "Seuls les admins peuvent voir et modifier les réservations" ON public.reservations;
DROP POLICY IF EXISTS "Tout le monde peut créer une réservation" ON public.reservations;

-- 5. Supprimer les politiques problématiques sur reviews
DROP POLICY IF EXISTS "Les admins peuvent voir et modifier tous les avis" ON public.reviews;
DROP POLICY IF EXISTS "Tout le monde peut créer un avis" ON public.reviews;
DROP POLICY IF EXISTS "Tout le monde peut voir les avis approuvés" ON public.reviews;

-- 6. Créer des politiques RLS simples sans récursion

-- Politiques pour profiles (simples)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
FOR UPDATE USING (auth.uid() = id);

-- Politiques pour menu_categories (publiques)
CREATE POLICY "Anyone can view categories" ON public.menu_categories
FOR SELECT USING (true);

CREATE POLICY "Service role can manage categories" ON public.menu_categories
FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour menu_items (publiques pour les disponibles)
CREATE POLICY "Anyone can view available items" ON public.menu_items
FOR SELECT USING (available = true);

CREATE POLICY "Service role can manage items" ON public.menu_items
FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour reservations
CREATE POLICY "Anyone can create reservations" ON public.reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage reservations" ON public.reservations
FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
FOR SELECT USING (approved = true);

CREATE POLICY "Anyone can create reviews" ON public.reviews
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage reviews" ON public.reviews
FOR ALL USING (auth.role() = 'service_role');