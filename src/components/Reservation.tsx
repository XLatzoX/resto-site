import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import restaurantInterior from '@/assets/restaurant-interior.jpg';

const Reservation = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    datetime: '',
    guests: '',
    requests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name || !formData.phone || !formData.datetime || !formData.guests) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'envoi de réservation
    toast({
      title: "Réservation confirmée !",
      description: "Nous avons bien reçu votre demande de réservation. Nous vous contacterons sous peu pour confirmer.",
    });

    // Reset du formulaire
    setFormData({
      name: '',
      phone: '',
      datetime: '',
      guests: '',
      requests: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="reservation" className="py-20 bg-background relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-2.097 19.82l1.732-1 10 17.32-1.732 1-10-17.32zm2.097-39.64l1.732 1-10 17.32-1.732-1 10-17.32z' fill='%23D4AF37' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
            Un clic, une table, une expérience unique. <span className="text-primary">Réservez maintenant !</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Image du restaurant */}
          <div className="relative scroll-reveal">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={restaurantInterior} 
                alt="Intérieur du restaurant AfriSpot"
                className="w-full h-[600px] object-cover hover-scale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Overlay décoratif */}
              <div className="absolute top-8 left-8 bg-primary/90 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm">★★★★★</div>
                  <div className="text-xs mt-1">Excellent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="scroll-reveal">
            <Card className="bg-secondary/95 backdrop-blur-sm border-none shadow-2xl">
              <CardContent className="p-8">
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-0.5 bg-primary"></div>
                    <span className="text-primary font-medium italic text-xl">Réservation</span>
                    <div className="w-12 h-0.5 bg-primary"></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Prénom & Nom"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-white/95 border-white/20 text-gray-900 placeholder:text-gray-500 h-12"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Téléphone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/95 border-white/20 text-gray-900 placeholder:text-gray-500 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="datetime-local"
                        placeholder="Date & Heure"
                        value={formData.datetime}
                        onChange={(e) => handleInputChange('datetime', e.target.value)}
                        className="bg-white/95 border-white/20 text-gray-900 h-12"
                        required
                      />
                    </div>
                    <div>
                      <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                        <SelectTrigger className="bg-white/95 border-white/20 text-gray-900 h-12">
                          <SelectValue placeholder="Nbres de personnes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 personne</SelectItem>
                          <SelectItem value="2">2 personnes</SelectItem>
                          <SelectItem value="3">3 personnes</SelectItem>
                          <SelectItem value="4">4 personnes</SelectItem>
                          <SelectItem value="5">5 personnes</SelectItem>
                          <SelectItem value="6">6 personnes</SelectItem>
                          <SelectItem value="7">7 personnes</SelectItem>
                          <SelectItem value="8">8 personnes</SelectItem>
                          <SelectItem value="8+">Plus de 8 personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Textarea
                      placeholder="Requêtes spéciales"
                      value={formData.requests}
                      onChange={(e) => handleInputChange('requests', e.target.value)}
                      className="bg-white/95 border-white/20 text-gray-900 placeholder:text-gray-500 min-h-[120px] resize-none"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl"
                  >
                    RÉSERVER
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;