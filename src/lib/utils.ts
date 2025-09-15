import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleLocationAccess = (onSuccess: (location: { latitude: number; longitude: number }) => void, onError?: (error: GeolocationPositionError) => void) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSuccess({ latitude, longitude });
        },
        (error) => {
          console.error('Error accessing geolocation:', error);
          if (onError) onError(error);
        }
      );
    } else if (onError) {
      onError(new Error('Geolocation is not supported by this browser') as unknown as GeolocationPositionError);
    }
  }