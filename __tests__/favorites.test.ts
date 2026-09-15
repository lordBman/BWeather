import { useLocationStore } from '../src/store/locationStore';
import { Location } from '../src/types/location';

const lagos: Location = {
  id: '6.5244:3.3792',
  name: 'Lagos',
  administrativeArea: 'Lagos',
  country: 'Nigeria',
  countryCode: 'NG',
  latitude: 6.5244,
  longitude: 3.3792,
  timezone: 'Africa/Lagos',
};

const abuja: Location = {
  id: '9.0765:7.3986',
  name: 'Abuja',
  administrativeArea: 'FCT',
  country: 'Nigeria',
  countryCode: 'NG',
  latitude: 9.0765,
  longitude: 7.3986,
  timezone: 'Africa/Lagos',
};

describe('favorites persistence store', () => {
  beforeEach(() => {
    useLocationStore.setState({ favorites: [], currentLocation: null, selectedLocation: null });
  });

  it('adds a favorite', () => {
    useLocationStore.getState().addFavorite(lagos);
    expect(useLocationStore.getState().favorites).toHaveLength(1);
    expect(useLocationStore.getState().isFavorite(lagos.id)).toBe(true);
  });

  it('prevents duplicate favorites by stable id', () => {
    useLocationStore.getState().addFavorite(lagos);
    useLocationStore.getState().addFavorite(lagos);
    useLocationStore.getState().addFavorite({ ...lagos, name: 'Lagos (dup)' });
    expect(useLocationStore.getState().favorites).toHaveLength(1);
  });

  it('removes a favorite by id', () => {
    useLocationStore.getState().addFavorite(lagos);
    useLocationStore.getState().addFavorite(abuja);
    useLocationStore.getState().removeFavorite(lagos.id);
    const favorites = useLocationStore.getState().favorites;
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(abuja.id);
  });

  it('reorders favorites', () => {
    useLocationStore.getState().addFavorite(lagos);
    useLocationStore.getState().addFavorite(abuja);
    useLocationStore.getState().reorderFavorites(0, 1);
    const favorites = useLocationStore.getState().favorites;
    expect(favorites[0].id).toBe(abuja.id);
    expect(favorites[1].id).toBe(lagos.id);
  });

  it('ignores out-of-range reorder indices', () => {
    useLocationStore.getState().addFavorite(lagos);
    useLocationStore.getState().reorderFavorites(0, 5);
    expect(useLocationStore.getState().favorites[0].id).toBe(lagos.id);
  });
});
