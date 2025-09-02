import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { useMenuCategories } from '@/hooks/useMenuCategories';

const MenuManagement = () => {
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { categories } = useMenuCategories();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_url: '',
    available: true
  });
  const [isAdding, setIsAdding] = useState(false);

  // Ajouter un plat
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category_id) {
      return;
    }

    await addMenuItem({
      name: newItem.name!,
      description: newItem.description!,
      price: newItem.price!,
      category_id: newItem.category_id!,
      image_url: newItem.image_url || undefined,
      available: newItem.available!,
    });

    setNewItem({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      image_url: '',
      available: true
    });
    setIsAdding(false);
  };

  // Modifier un plat
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    await updateMenuItem(editingItem.id, {
      name: editingItem.name,
      description: editingItem.description,
      price: editingItem.price,
      category_id: editingItem.category_id,
      image_url: editingItem.image_url,
      available: editingItem.available
    });

    setEditingItem(null);
  };

  // Supprimer un plat
  const handleDeleteItem = async (id: string) => {
    await deleteMenuItem(id);
  };

  // Basculer la disponibilité
  const toggleAvailability = async (item: MenuItem) => {
    await updateMenuItem(item.id, { available: !item.available });
  };

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  // Grouper les items par catégorie
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = menuItems.filter(item => item.category_id === category.id);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Gestion du Menu</h2>
          <p className="text-muted-foreground">Gérez les plats, prix et disponibilités</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un plat
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau plat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom du plat"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Prix (FCFA)"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
            <Textarea
              placeholder="Description du plat"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Select onValueChange={(value) => setNewItem(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="URL de l'image"
                value={newItem.image_url}
                onChange={(e) => setNewItem(prev => ({ ...prev, image_url: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddItem} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des plats par catégorie */}
      {categories.map(category => {
        const categoryItems = itemsByCategory[category.id] || [];
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="capitalize">{category.name} ({categoryItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-4">
                    {editingItem?.id === item.id ? (
                      // Mode édition
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                          />
                          <Input
                            type="number"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                          />
                        </div>
                        <Textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                        />
                        <Input
                          placeholder="URL de l'image"
                          value={editingItem.image_url || ''}
                          onChange={(e) => setEditingItem(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdateItem} size="sm">
                            <Save className="w-4 h-4" />
                            Sauvegarder
                          </Button>
                          <Button variant="outline" onClick={() => setEditingItem(null)} size="sm">
                            <X className="w-4 h-4" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Badge variant={item.available ? "default" : "secondary"}>
                              {item.available ? 'Disponible' : 'Indisponible'}
                            </Badge>
                            <span className="text-primary font-bold">{item.price} FCFA</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          {item.image_url && (
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(item)}
                          >
                            {item.available ? 'Marquer indisponible' : 'Marquer disponible'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MenuManagement;