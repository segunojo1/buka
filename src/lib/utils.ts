import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type GeolocationError = {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
};

interface LocationResult {
  latitude: number;
  longitude: number;
}

export const handleLocationAccess = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds (reduced from 5 minutes to fail faster)
      maximumAge: 0 // Force getting a fresh position
    };

    const errorMessages: { [key: number]: string } = {
      1: 'Location access denied. Please enable location services and try again.',
      2: 'Location information is unavailable. Please check your connection and try again.',
      3: 'Location request timed out. Please try again.'
    };

    const successHandler = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      resolve({ latitude, longitude });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      const errorMessage = errorMessages[error.code] || 'An unknown error occurred while getting your location.';
      console.error('Geolocation error:', error);
      reject(new Error(errorMessage));
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );
  });
};