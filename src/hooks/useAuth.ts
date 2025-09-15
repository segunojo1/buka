'use client';

import { useEffect } from 'react';
import useAppStore from '@/store/app.store';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const { setUser } = useAppStore();

  useEffect(() => {
    // Check for user in cookies on initial load
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      try {
        const user = JSON.parse(userFromCookie);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse user from cookie:', error);
        // Clear invalid user data
        Cookies.remove('user');
      }
    }
  }, [setUser]);

  return useAppStore();
};
