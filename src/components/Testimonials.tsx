import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sacky Mall",
      text: "Si j'avais découvert AfriSpot plus tôt, j'aurais tout l'argent du pays dans leur filet de boeuf...",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      featured: false
    },
    {
      id: 2,
      name: "Moustapha Name",
      text: "J'en ai mangé du Yassa, mais chez AfriSpot c'est un autre niveau... J'en ai versé des larmes. Best Yassa de la ville je vous assure !",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b13c?w=100&h=100&fit=crop&crop=face",
      featured: true
    },
    {
      id: 3,
      name: "Khady Mbarane",
      text: "Le meilleur spot de Dakar pour un date. Je me demande qui je vais ramener cette semaine...",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      featured: false
    },
    {
      id: 4,
      name: "Omar Diallo",
      text: "Une expérience culinaire exceptionnelle ! L'ambiance, le service, la qualité des plats... tout est parfait chez AfriSpot.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      featured: false
    },
    {
      id: 5,
      name: "Awa Seck",
      text: "Enfin un restaurant qui valorise notre cuisine sénégalaise avec une touche moderne. Je recommande vivement !",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      featured: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visible.push({ ...testimonials[index], position: i });
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-20 bg-muted/20 relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-0.5 bg-primary"></div>
            <span className="text-primary font-medium italic text-lg">Vos Retours</span>
            <div className="w-16 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary">
            Que disent nos clients ?
          </h2>
        </div>

        {/* Témoignages */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card 
                key={`${testimonial.id}-${currentSlide}`}
                className={`relative overflow-hidden transition-all duration-500 hover-lift scroll-reveal ${
                  testimonial.featured || index === 1
                    ? 'bg-primary text-primary-foreground transform scale-105 shadow-2xl' 
                    : 'bg-card text-card-foreground'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  {/* Icône de citation */}
                  <div className={`mb-6 ${testimonial.featured || index === 1 ? 'text-primary-foreground' : 'text-primary'}`}>
                    <Quote className="w-12 h-12" />
                  </div>

                  {/* Texte du témoignage */}
                  <blockquote className="text-lg leading-relaxed mb-8 italic">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Profil */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-current/20">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=d4af37&color=fff`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className={`text-sm ${testimonial.featured || index === 1 ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        Client fidèle
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Effet de brillance pour le témoignage mis en avant */}
                {(testimonial.featured || index === 1) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
                )}
              </Card>
            ))}
          </div>

          {/* Indicateurs de pagination */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary shadow-lg scale-125' 
                    : 'bg-primary/30 hover:bg-primary/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;