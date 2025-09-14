import { create } from "zustand";

export interface Spot {
  id: string;
  name: string;
  address?: string;
  distance?: number;
  rating?: number;
  priceRange?: string;
  isOpen?: boolean;
  location: {
    latitude: number;
    longitude: number
  }
}

export interface SearchResult {
  success: boolean;
  reply: string;                 
  spots: Spot[];
  mapUrl: string | null;
  sessionId: string; 
  timestamp: string;
  errorMessage: string | null;
  metadata: {
    searchRadius: number;
    searchLocation: {
      latitude: number;   
      longitude: number;
    };
    [key: string]: any;
  };
}

interface AppStore {
  searchSpotsResult: SearchResult | null;
  searchQuery: string;
  setSearchSpotsResult: (result: SearchResult | null) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  location: { latitude: number; longitude: number } | null;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;
  loadingSearchedSpots: boolean;
  setLoadingSearchedSpots: (loading: boolean) => void;
}

const useAppStore = create<AppStore>((set) => ({
  searchSpotsResult: null,
  searchQuery: '',
  setSearchSpotsResult: (result) => set({ searchSpotsResult: result }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchSpotsResult: null, searchQuery: '' }),
  location: null,
  setLocation: (location) => set({ location }),
  loadingSearchedSpots: false, 
  setLoadingSearchedSpots: (loading) => set({ loadingSearchedSpots: loading})
}));

export default useAppStore;