import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Phone, Users, MessageCircle } from 'lucide-react';

interface Reservation {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  guests: string;
  requests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  // Mock data pour les réservations
  useEffect(() => {
    const mockReservations: Reservation[] = [
      {
        id: '1',
        name: 'Amadou Diallo',
        phone: '+221 77 123 45 67',
        datetime: '2024-02-15T19:30',
        guests: '4',
        requests: 'Table près de la fenêtre',
        status: 'pending',
        createdAt: '2024-02-10T10:30:00'
      },
      {
        id: '2',
        name: 'Fatou Sall',
        phone: '+221 78 987 65 43',
        datetime: '2024-02-16T20:00',
        guests: '2',
        requests: 'Anniversaire - dessert spécial',
        status: 'confirmed',
        createdAt: '2024-02-11T14:20:00'
      },
      {
        id: '3',
        name: 'Ousmane Ndiaye',
        phone: '+221 76 555 44 33',
        datetime: '2024-02-17T18:45',
        guests: '6',
        requests: '',
        status: 'pending',
        createdAt: '2024-02-12T09:15:00'
      }
    ];
    setReservations(mockReservations);
  }, []);

  const updateReservationStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status } : res
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary">Gestion des Réservations</h2>
        <p className="text-muted-foreground">Gérez les réservations et confirmations</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {reservations.length}
                </div>
                <div className="text-sm text-muted-foreground">Réservations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {reservations.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {reservations.filter(r => r.requests.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Avec demandes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{reservation.name}</h3>
                    <p className="text-muted-foreground">{reservation.phone}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDateTime(reservation.datetime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{reservation.guests} personne(s)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reçue le {formatDateTime(reservation.createdAt)}
                  </div>
                </div>

                {reservation.requests && (
                  <div className="mb-4 p-3 bg-muted/50 rounded">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Demandes spéciales:</div>
                        <div className="text-sm text-muted-foreground">{reservation.requests}</div>
                      </div>
                    </div>
                  </div>
                )}

                {reservation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsManagement;