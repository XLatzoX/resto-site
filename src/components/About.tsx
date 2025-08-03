import { Utensils, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dish1 from '@/assets/dish-1.jpg';
import dish2 from '@/assets/dish-2.jpg';
import dish3 from '@/assets/dish-3.jpg';
import dish4 from '@/assets/dish-4.jpg';

const About = () => {
  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Grid d'images */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 scroll-reveal">
            <div className="space-y-3 lg:space-y-4">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <img 
                  src={dish1} 
                  alt="Plat traditionnel sénégalais"
                  className="w-full h-48 lg:h-56 object-cover hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <img 
                  src={dish3} 
                  alt="Entrées africaines"
                  className="w-full h-36 lg:h-44 object-cover hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4 pt-6 lg:pt-8">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <img 
                  src={dish2} 
                  alt="Burger africain"
                  className="w-full h-36 lg:h-44 object-cover hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <img 
                  src={dish4} 
                  alt="Plat traditionnel"
                  className="w-full h-48 lg:h-56 object-cover hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Contenu texte */}
          <div className="space-y-8 scroll-reveal">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-0.5 bg-primary"></div>
                <span className="text-primary font-medium italic">À propos de nous</span>
                <div className="w-12 h-0.5 bg-primary"></div>
              </div>

              <div className="flex items-center space-x-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-secondary">Bienvenue à</h2>
                <div className="flex items-center space-x-2">
                  <Utensils className="w-8 h-8 text-primary" />
                  <span className="text-4xl lg:text-5xl font-bold text-primary">AfriSpot</span>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu 
                  diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem sit.
                </p>
                <p>
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu 
                  diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet 
                  lorem sit clita duo justo magna dolore erat amet
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">+20</div>
                <div className="text-secondary font-semibold">plats</div>
                <div className="text-muted-foreground">au menu</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">90%</div>
                <div className="text-secondary font-semibold">d'ingrédients</div>
                <div className="text-muted-foreground">locaux</div>
              </div>
            </div>

            {/* Bouton Instagram */}
            <Button 
              className="btn-primary flex items-center gap-3"
              onClick={() => window.open('https://instagram.com', '_blank')}
            >
              <Instagram className="w-5 h-5" />
              Suivez-nous sur Instagram
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;