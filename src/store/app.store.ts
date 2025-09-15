import { create } from 'zustand';

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  price: string;
  latitude: number;
  longitude: number;
  description: string;
  reviews: string[];
  amenities: string[];
  opening_hours: string;
  contact: string;
  website: string;
  distance: number;
  duration: string;
  tags: string[];
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
  setSearchSpotsResult: (result: SearchResult | null) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Location state
  location: Location | null;
  setLocation: (location: Location | null) => void;
  
  // Loading states
  loadingSearchedSpots: boolean;
  setLoadingSearchedSpots: (loading: boolean) => void;
  
  // User state
  user: User | null ;
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
  setSearchSpotsResult: (result) => set({ searchSpotsResult: result }),
  setSearchQuery: (query) => set({ searchQuery: query }),
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