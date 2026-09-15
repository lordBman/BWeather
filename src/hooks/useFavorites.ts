import { useLocationStore } from '../store/locationStore';
import { Location } from '../types/location';

export function useFavorites() {
  const favorites = useLocationStore((s) => s.favorites);
  const addFavorite = useLocationStore((s) => s.addFavorite);
  const removeFavorite = useLocationStore((s) => s.removeFavorite);
  const isFavorite = useLocationStore((s) => s.isFavorite);
  const reorderFavorites = useLocationStore((s) => s.reorderFavorites);

  const toggleFavorite = (location: Location) => {
    if (isFavorite(location.id)) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, reorderFavorites };
}
