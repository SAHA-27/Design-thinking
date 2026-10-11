import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  avatar?: string;
  savedAddresses?: Array<{
    _id?: string;
    title: string;
    street: string;
    area?: string;
    city: string;
    pincode?: string;
    isDefault?: boolean;
  }>;
  technicianProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  quickDemoLogin: (role: 'customer' | 'technician' | 'admin') => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('servease_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('servease_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('servease_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed.');
      return false;
    }
  };

  const quickDemoLogin = async (role: 'customer' | 'technician' | 'admin'): Promise<boolean> => {
    try {
      const res = await api.get(`/auth/demo/${role}`);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('servease_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Demo login error:', err);
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('servease_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      alert(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('servease_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickDemoLogin,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
