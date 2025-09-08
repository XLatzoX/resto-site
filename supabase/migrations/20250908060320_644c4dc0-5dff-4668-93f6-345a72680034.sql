-- Fix RLS policies for menu_items to allow admin access to all items
DROP POLICY IF EXISTS "Anyone can view available items" ON public.menu_items;
DROP POLICY IF EXISTS "Service role can manage items" ON public.menu_items;

-- Create new policies
CREATE POLICY "Anyone can view available items" 
ON public.menu_items 
FOR SELECT 
USING (available = true);

CREATE POLICY "Admins can view all items" 
ON public.menu_items 
FOR SELECT 
USING (auth.role() = 'service_role' OR EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Service role can manage items" 
ON public.menu_items 
FOR ALL 
USING (auth.role() = 'service_role');

-- Clean up menu_items - delete all and recreate with proper data
DELETE FROM public.menu_items;

-- Insert clean menu data with proper category assignments
INSERT INTO public.menu_items (name, description, price, category_id, image_url, available) VALUES
-- Entrées
('Accras de Morue', 'Délicieux beignets de morue épicés, servis avec une sauce piquante', 1500, 'c6a4d4dc-a801-4424-acc4-02799dfc7a4b', '/src/assets/dish-1.jpg', true),
('Pastels au Poisson', 'Chaussons croustillants farcis au poisson frais et aux épices', 1200, 'c6a4d4dc-a801-4424-acc4-02799dfc7a4b', '/src/assets/dish-2.jpg', true),
('Salade de Mangue Verte', 'Salade rafraîchissante à la mangue verte, oignons et piments', 1000, 'c6a4d4dc-a801-4424-acc4-02799dfc7a4b', '/src/assets/dish-3.jpg', true),

-- Plats Principaux
('Thiéboudienne Rouge', 'Le plat national sénégalais avec riz, poisson et légumes', 3500, '7982e4c4-e432-42cb-b5e3-d7995870c876', '/src/assets/hero-dish.jpg', true),
('Mafé au Bœuf', 'Ragoût de bœuf dans une sauce d''arachide onctueuse', 3200, '7982e4c4-e432-42cb-b5e3-d7995870c876', '/src/assets/dish-4.jpg', true),
('Yassa Poulet', 'Poulet mariné aux oignons et citron, accompagné de riz', 2800, '7982e4c4-e432-42cb-b5e3-d7995870c876', '/src/assets/dish-1.jpg', true),
('Poisson Braisé', 'Poisson frais grillé aux épices locales', 3000, '7982e4c4-e432-42cb-b5e3-d7995870c876', '/src/assets/dish-2.jpg', true),

-- Desserts
('Thiakry', 'Dessert traditionnel au couscous et lait caillé', 1500, '048882cc-edf2-400c-83ef-02af6fef6b6a', '/src/assets/dish-3.jpg', true),
('Degue', 'Bouillie de mil sucrée aux raisins secs', 1200, '048882cc-edf2-400c-83ef-02af6fef6b6a', '/src/assets/dish-4.jpg', true),
('Mangue Glacée', 'Sorbet de mangue fraîche maison', 1000, '048882cc-edf2-400c-83ef-02af6fef6b6a', '/src/assets/dish-1.jpg', true),

-- Boissons
('Bissap Glacé', 'Infusion d''hibiscus glacée, rafraîchissante', 800, '20f4a6e6-e782-47e9-a058-10179391f0ad', '/src/assets/dish-2.jpg', true),
('Gingembre', 'Boisson au gingembre épicée et rafraîchissante', 700, '20f4a6e6-e782-47e9-a058-10179391f0ad', '/src/assets/dish-3.jpg', true),
('Baobab Juice', 'Jus de fruit de baobab, riche en vitamines', 900, '20f4a6e6-e782-47e9-a058-10179391f0ad', '/src/assets/dish-4.jpg', true),
('Eau Minérale', 'Eau minérale locale', 500, '20f4a6e6-e782-47e9-a058-10179391f0ad', '/src/assets/dish-1.jpg', true);