import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/.netlify/functions/get-user');
      const data = await response.json();
      if (data.user) {
        // Re-hydrate dates from string format
        const parsedUser = data.user;
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.updatedAt = new Date(parsedUser.updatedAt);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = () => {
    window.location.href = '/.netlify/functions/auth-start';
  };

  const logout = useCallback(async () => {
    await fetch('/.netlify/functions/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return { user, login, logout, loading };
};