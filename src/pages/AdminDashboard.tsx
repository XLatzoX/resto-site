import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Menu, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MenuManagement from '@/components/admin/MenuManagement';
import ReservationsManagement from '@/components/admin/ReservationsManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, session, loading, signIn, signOut, isAdmin } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(credentials.email, credentials.password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Affichage du loader pendant le chargement initial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Chargement...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si pas connecté, afficher le formulaire de connexion
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Administration AfriSpot</CardTitle>
            <CardDescription>Connectez-vous pour accéder au tableau de bord</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si connecté mais pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Accès refusé</h2>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleSignOut} variant="outline">
                Se déconnecter
              </Button>
              <Link to="/">
                <Button variant="ghost">
                  Retour au site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard admin
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au site
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration AfriSpot</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user?.email} - Gestion du restaurant
              </p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Se déconnecter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Avis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Menu</CardTitle>
                <CardDescription>
                  Gérez les catégories et les plats de votre restaurant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Réservations</CardTitle>
                <CardDescription>
                  Consultez et gérez les réservations des clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Avis</CardTitle>
                <CardDescription>
                  Modérez et approuvez les avis clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;