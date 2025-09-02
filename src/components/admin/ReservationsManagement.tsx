import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Users, MessageCircle } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';

const ReservationsManagement = () => {
  const { reservations, loading, updateReservationStatus } = useReservations();

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

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

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    await updateReservationStatus(id, status);
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
                  {reservations.filter(r => r.special_requests && r.special_requests.length > 0).length}
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
                    {reservation.email && (
                      <p className="text-muted-foreground text-sm">{reservation.email}</p>
                    )}
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
                    Reçue le {formatDateTime(reservation.created_at)}
                  </div>
                </div>

                {reservation.special_requests && (
                  <div className="mb-4 p-3 bg-muted/50 rounded">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Demandes spéciales:</div>
                        <div className="text-sm text-muted-foreground">{reservation.special_requests}</div>
                      </div>
                    </div>
                  </div>
                )}

                {reservation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {reservations.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              Aucune réservation trouvée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsManagement;