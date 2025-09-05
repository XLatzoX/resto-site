import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Coffee, IceCream, Star, Soup } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useMenuCategories } from '@/hooks/useMenuCategories';

const Menu = () => {
  const { menuItems, loading } = useMenuItems();
  const { categories, loading: categoriesLoading } = useMenuCategories();
  const [activeCategory, setActiveCategory] = useState('');

  // Icônes par catégorie
  const categoryIcons: Record<string, any> = {
    'entrees': UtensilsCrossed,
    'plats-principaux': Star,
    'desserts': IceCream,
    'boissons': Coffee,
    'specialites': Star,
    'accompagnements': Soup,
  };

  // Sélectionner automatiquement la première catégorie au chargement
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  if (loading || categoriesLoading) {
    return (
      <section id="menu" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center p-8">Chargement du menu...</div>
        </div>
      </section>
    );
  }

  console.log('Categories:', categories);
  console.log('Menu items:', menuItems);
  console.log('Active category:', activeCategory);

  // Filtrer les plats disponibles de la catégorie active
  const activeMenuItems = menuItems.filter(
    item => item.category_id === activeCategory && item.available
  );

  return (
    <section id="menu" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-0.5 bg-primary"></div>
            <span className="text-5xl font-bold text-primary italic">MENU</span>
            <div className="w-16 h-0.5 bg-primary"></div>
          </div>
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 scroll-reveal">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug] || Star;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 hover-lift ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-card-foreground hover:bg-primary/10'
                }`}
              >
                <IconComponent className="w-8 h-8 mb-3" />
                <span className="font-semibold text-sm text-center leading-tight">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Plats */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {activeMenuItems?.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover-lift bg-card border-border scroll-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover hover-scale"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right mt-4">
                      <span className="text-2xl font-bold text-secondary">{item.price} FCFA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;