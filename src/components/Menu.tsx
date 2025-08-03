import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Coffee, IceCream, Star, Soup } from 'lucide-react';
import dish1 from '@/assets/dish-1.jpg';
import dish2 from '@/assets/dish-2.jpg';
import dish3 from '@/assets/dish-3.jpg';
import dish4 from '@/assets/dish-4.jpg';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('entrees');

  const categories = [
    { id: 'entrees', name: 'Nos Entrées', icon: UtensilsCrossed },
    { id: 'desserts', name: 'Nos Desserts', icon: IceCream },
    { id: 'boissons', name: 'Nos Boissons', icon: Coffee },
    { id: 'specialites', name: 'Nos Spécialités', icon: Star },
    { id: 'accompagnements', name: 'Nos Accompagnements', icon: Soup },
  ];

  const menuItems = {
    entrees: [
      { id: 1, name: 'Yassa au Poulet', description: 'Poulet mariné aux oignons et citron, riz parfumé', price: '10 000 FRCS', image: dish1 },
      { id: 2, name: 'Thieboudienne Rouge', description: 'Riz au poisson traditionnel avec légumes', price: '12 000 FRCS', image: dish2 },
      { id: 3, name: 'Mafé au Bœuf', description: 'Bœuf mijoté dans une sauce arachide onctueuse', price: '11 000 FRCS', image: dish3 },
      { id: 4, name: 'Caldou de Poisson', description: 'Poisson frais aux légumes et riz blanc', price: '13 000 FRCS', image: dish4 },
      { id: 5, name: 'Thiebou Yapp', description: 'Riz à la viande avec légumes de saison', price: '10 500 FRCS', image: dish1 },
      { id: 6, name: 'Domoda Traditionnel', description: 'Plat traditionnel à la pâte d\'arachide', price: '9 500 FRCS', image: dish2 },
      { id: 15, name: 'Poulet DG', description: 'Poulet aux légumes et plantains', price: '11 500 FRCS', image: dish3 },
      { id: 16, name: 'Capitaine à la Braise', description: 'Poisson grillé sauce yassa', price: '13 500 FRCS', image: dish4 },
    ],
    desserts: [
      { id: 7, name: 'Thiakry au Coco', description: 'Dessert traditionnel au lait de coco et vanille', price: '3 000 FRCS', image: dish3 },
      { id: 8, name: 'Sombi aux Fruits', description: 'Riz au lait parfumé aux fruits tropicaux', price: '3 500 FRCS', image: dish4 },
      { id: 17, name: 'Ngalakh', description: 'Mélange de mil, fruits secs et pâte d\'arachide', price: '2 500 FRCS', image: dish1 },
      { id: 18, name: 'Chakery aux Raisins', description: 'Dessert crémeux aux raisins secs', price: '3 200 FRCS', image: dish2 },
      { id: 19, name: 'Salade de Fruits', description: 'Fruits tropicaux frais de saison', price: '2 800 FRCS', image: dish3 },
      { id: 20, name: 'Glace Bissap', description: 'Glace artisanale à l\'hibiscus', price: '2 000 FRCS', image: dish4 },
    ],
    boissons: [
      { id: 9, name: 'Bissap Glacé', description: 'Boisson d\'hibiscus fraîche et parfumée', price: '2 000 FRCS', image: dish1 },
      { id: 10, name: 'Jus de Baobab', description: 'Jus naturel du fruit de baobab', price: '2 500 FRCS', image: dish2 },
      { id: 21, name: 'Jus de Tamarin', description: 'Boisson rafraîchissante au tamarin', price: '2 200 FRCS', image: dish3 },
      { id: 22, name: 'Café Touba', description: 'Café épicé traditionnel sénégalais', price: '1 500 FRCS', image: dish4 },
      { id: 23, name: 'Thé Attaya', description: 'Thé à la menthe préparé traditionnellement', price: '1 000 FRCS', image: dish1 },
      { id: 24, name: 'Jus de Ditakh', description: 'Jus de fruit local exotique', price: '2 800 FRCS', image: dish2 },
    ],
    specialites: [
      { id: 11, name: 'Ceebu Jën Spécial', description: 'Notre thieboudienne signature aux fruits de mer', price: '15 000 FRCS', image: dish3 },
      { id: 12, name: 'Yassa Poisson Royal', description: 'Poisson noble préparé selon la tradition', price: '14 000 FRCS', image: dish4 },
      { id: 25, name: 'Thiou à la Viande', description: 'Couscous sénégalais aux légumes', price: '12 500 FRCS', image: dish1 },
      { id: 26, name: 'Lakhou Bissap', description: 'Plat festif aux épices rares', price: '16 000 FRCS', image: dish2 },
      { id: 27, name: 'Ndambé', description: 'Haricots à la sauce tomate épicée', price: '8 500 FRCS', image: dish3 },
      { id: 28, name: 'Firire', description: 'Plat de pâtes africaines aux légumes', price: '9 000 FRCS', image: dish4 },
    ],
    accompagnements: [
      { id: 13, name: 'Riz Parfumé', description: 'Riz basmati aux épices sénégalaises', price: '2 000 FRCS', image: dish1 },
      { id: 14, name: 'Légumes Sautés', description: 'Mélange de légumes frais de saison', price: '2 500 FRCS', image: dish2 },
      { id: 29, name: 'Beignets de Niébé', description: 'Beignets aux haricots noirs', price: '1 500 FRCS', image: dish3 },
      { id: 30, name: 'Salade Sénégalaise', description: 'Salade de tomates, oignons et concombres', price: '2 000 FRCS', image: dish4 },
      { id: 31, name: 'Plantains Grillés', description: 'Bananes plantains caramélisées', price: '2 200 FRCS', image: dish1 },
      { id: 32, name: 'Pain Traditionnel', description: 'Pain local fait maison', price: '500 FRCS', image: dish2 },
    ],
  };

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
            const IconComponent = category.icon;
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
          {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover-lift bg-card border-border scroll-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover-scale"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right mt-4">
                      <span className="text-2xl font-bold text-secondary">{item.price}</span>
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