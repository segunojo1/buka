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

export const handleLocationAccess = (
  onSuccess: (location: { latitude: number; longitude: number }) => void, 
  onError?: (error: string) => void
) => {
  if (!navigator.geolocation) {
    onError?.('Geolocation is not supported by your browser');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 15000, // 10 seconds
    maximumAge: 0 // Force getting a fresh position
  };

  const errorMessages: { [key: number]: string } = {
    1: 'Location access denied. Please enable location services and try again.',
    2: 'Location information is unavailable. Please check your connection and try again.',
    3: 'Location request timed out. Please try again.'
  };

  const errorHandler = (error: GeolocationPositionError) => {
    const geoError = error as unknown as GeolocationError;
    const errorMessage = errorMessages[geoError.code] || 'An unknown error occurred while getting your location.';
    console.error('Geolocation error:', error);
    onError?.(errorMessage);
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onSuccess({ latitude, longitude });
    },
    errorHandler,
    options
  );
};