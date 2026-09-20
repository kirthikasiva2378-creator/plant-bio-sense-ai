import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserAccount {
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isOnboarded: boolean;
  isLoading: boolean;
  signup: (name: string, email: string) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY_USER = '@plantbiosense_user';
const STORAGE_KEY_ONBOARDED = '@plantbiosense_onboarded';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
      const storedOnboarded = await AsyncStorage.getItem(STORAGE_KEY_ONBOARDED);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedOnboarded === 'true') {
        setIsOnboarded(true);
      }
    } catch (e) {
      console.warn('Failed to load local auth state', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string) => {
    const newUser: UserAccount = { name: name.trim(), email: email.trim() };
    setUser(newUser);
    setIsOnboarded(true);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      await AsyncStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
    } catch (e) {
      console.warn('Failed to save signup auth state', e);
    }
  };

  const login = async (email: string) => {
    // If no user exists yet, create default account with email
    const existingName = user?.name || email.split('@')[0] || 'User';
    const loggedUser: UserAccount = { name: existingName, email: email.trim() };

    setUser(loggedUser);
    setIsOnboarded(true);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
      await AsyncStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
    } catch (e) {
      console.warn('Failed to save login auth state', e);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsOnboarded(false);

    try {
      await AsyncStorage.removeItem(STORAGE_KEY_USER);
      await AsyncStorage.removeItem(STORAGE_KEY_ONBOARDED);
    } catch (e) {
      console.warn('Failed to clear auth state', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOnboarded,
        isLoading,
        signup,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
