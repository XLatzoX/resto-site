-- Insérer des plats d'exemple
WITH categories AS (
  SELECT id, slug FROM public.menu_categories
)
INSERT INTO public.menu_items (name, description, price, category_id, available, image_url) VALUES
('Salade Africaine', 'Salade fraîche aux légumes locaux et vinaigrette épicée', 850, (SELECT id FROM categories WHERE slug = 'entrees'), true, 'src/assets/dish-1.jpg'),
('Accras de Morue', 'Beignets épicés à la morue, spécialité des îles', 1200, (SELECT id FROM categories WHERE slug = 'entrees'), true, 'src/assets/dish-2.jpg'),
('Soupe Kandja', 'Soupe traditionnelle aux légumes et épices', 950, (SELECT id FROM categories WHERE slug = 'entrees'), true, null),
('Thieboudienne', 'Riz au poisson, plat national sénégalais', 2500, (SELECT id FROM categories WHERE slug = 'plats-principaux'), true, 'src/assets/dish-3.jpg'),
('Poulet Yassa', 'Poulet mariné aux oignons et citron', 2200, (SELECT id FROM categories WHERE slug = 'plats-principaux'), true, 'src/assets/dish-4.jpg'),
('Mafé de Boeuf', 'Ragoût de bœuf à la pâte darachide', 2800, (SELECT id FROM categories WHERE slug = 'plats-principaux'), true, 'src/assets/hero-dish.jpg'),
('Capitaine Braisé', 'Poisson grillé aux épices africaines', 3200, (SELECT id FROM categories WHERE slug = 'plats-principaux'), true, null),
('Thiakry', 'Dessert traditionnel au mil et lait caillé', 800, (SELECT id FROM categories WHERE slug = 'desserts'), true, null),
('Beignets au Miel', 'Beignets croustillants nappés de miel', 650, (SELECT id FROM categories WHERE slug = 'desserts'), true, null),
('Salade de Fruits Exotiques', 'Mangue, papaye, ananas frais', 750, (SELECT id FROM categories WHERE slug = 'desserts'), true, null),
('Bissap', 'Boisson à base dhibiscus, rafraîchissante', 450, (SELECT id FROM categories WHERE slug = 'boissons'), true, null),
('Gingembre', 'Jus de gingembre épicé et revigorant', 500, (SELECT id FROM categories WHERE slug = 'boissons'), true, null),
('Café Touba', 'Café traditionnel aux épices', 350, (SELECT id FROM categories WHERE slug = 'boissons'), true, null),
('Eau Minérale', 'Eau plate ou gazeuse', 250, (SELECT id FROM categories WHERE slug = 'boissons'), true, null);

-- Insérer des réservations d'exemple  
INSERT INTO public.reservations (name, email, phone, guests, datetime, special_requests, status) VALUES
('Marie Dubois', 'marie.dubois@email.com', '+33123456789', 4, '2024-01-15 19:30:00+00'::timestamptz, 'Table près de la fenêtre', 'confirmed'),
('Jean Martin', 'jean.martin@email.com', '+33987654321', 2, '2024-01-16 20:00:00+00'::timestamptz, 'Anniversaire, gâteau possible?', 'pending'),
('Sophie Bernard', 'sophie.bernard@email.com', '+33456789123', 6, '2024-01-17 19:00:00+00'::timestamptz, 'Groupe dentreprise', 'confirmed'),
('Ahmed Diallo', 'ahmed.diallo@email.com', '+221701234567', 3, '2024-01-18 20:30:00+00'::timestamptz, 'Menu végétarien disponible?', 'pending'),
('Fatou Ndiaye', 'fatou.ndiaye@email.com', '+221709876543', 5, '2024-01-19 19:15:00+00'::timestamptz, null, 'confirmed');

-- Insérer des avis d'exemple
INSERT INTO public.reviews (name, email, rating, comment, approved, featured) VALUES
('Claire Moreau', 'claire.moreau@email.com', 5, 'Excellente découverte ! La cuisine africaine authentique dans un cadre magnifique. Le thieboudienne était délicieux.', true, true),
('Pierre Lefebvre', 'pierre.lefebvre@email.com', 5, 'Service impeccable et plats savoureux. Je recommande vivement le mafé de bœuf, un délice !', true, true),
('Aminata Sow', 'aminata.sow@email.com', 4, 'Très bon restaurant, ambiance chaleureuse. Les saveurs me rappellent mon pays natal.', true, false),
('Lucas Petit', 'lucas.petit@email.com', 5, 'Une expérience culinaire exceptionnelle ! Chaque plat est une explosion de saveurs authentiques.', true, true),
('Aïcha Ba', 'aicha.ba@email.com', 4, 'Cuisine traditionnelle bien préparée, personnel accueillant. Juste un peu bruyant le soir.', true, false),
('Thomas Dubois', 'thomas.dubois@email.com', 3, 'Correct sans plus, service un peu lent', false, false),
('Mariama Cissé', 'mariama.cisse@email.com', 5, 'Magnifique restaurant ! La décoration et les plats sont à la hauteur de mes attentes.', true, false);