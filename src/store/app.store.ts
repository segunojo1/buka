import { create } from 'zustand';

export interface BusynessInfo {
  currentLevel: number; // 0-4 scale (0=not busy, 4=extremely busy)
  lastUpdated: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export interface Spot {
  id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  openingTime: string | null;
  closingTime: string | null;
  averageRating: number;
  reviewCount: number;
  priceRange: number;
  specialties: string[];
  categories: string[];
  busyness: BusynessInfo;
  rating: number; // Alias for averageRating for compatibility
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  distanceKm: number;
  reviews: any[] | null;
  busynessInfo: BusynessInfo | null; // Legacy, use busyness instead
}

export interface SearchResult {
  data: Spot[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppStore {
  // Search state
  searchSpotsResult: SearchResult | null;
  searchQuery: string;
  loadingSearchedSpots: boolean;
  selectedSpot: Spot | null;
  setSearchSpotsResult: (result: SearchResult | null) => void;
  setSearchQuery: (query: string) => void;
  setLoadingSearchedSpots: (loading: boolean) => void;
  setSelectedSpot: (spot: Spot | null) => void;
  clearSearch: () => void;
  
  // Location state
  location: Location | null;
  setLocation: (location: Location | null) => void;
  
  // User state
  user: User | null ;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const useAppStore = create<AppStore>((set) => ({
  // Search state
  searchSpotsResult: null,
  searchQuery: '',
  selectedSpot: null,
  setSearchSpotsResult: (result) => set({ searchSpotsResult: result }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  clearSearch: () => set({ searchQuery: '', searchSpotsResult: null }),
  
  // Location state
  location: null,
  setLocation: (location) => set({ location }),
  
  // Loading states
  loadingSearchedSpots: false,
  setLoadingSearchedSpots: (loading) => set({ loadingSearchedSpots: loading }),
  
  // User state
  user: null,
  isAuthenticated: false,

  isLoading: false,
  
  // User actions
  setUser: (user) => set({ 
    user,
    isAuthenticated: !!user 
  }),
  
  login: (userData) => set({ 
    user: userData,
    isAuthenticated: true 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  updateUserProfile: (updates) => 
    set((state) => ({ 
      user: state.user ? { ...state.user, ...updates } : null 
    })),
}));

export default useAppStore;