import { create } from "zustand";

interface Spot {
  id: string;
  name: string;
  address?: string;
  distance?: number;
  rating?: number;
  priceRange?: string;
  isOpen?: boolean;
}

interface SearchResult {
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
}

const useAppStore = create<AppStore>((set) => ({
  searchSpotsResult: null,
  searchQuery: '',
  setSearchSpotsResult: (result) => set({ searchSpotsResult: result }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchSpotsResult: null, searchQuery: '' }),
}));

export default useAppStore;