import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('turistgo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userAccount = mockUsers[email];
    
    if (!userAccount) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }

    if (userAccount.password !== password) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }

    if (userAccount.status === 'Pendiente') {
      return { success: false, error: 'Tu solicitud está en revisión (24-48h)' };
    }

    if (userAccount.status === 'Suspendido') {
      return { success: false, error: 'Tu cuenta ha sido suspendida. Contacta al administrador' };
    }

    const { password: _, ...userWithoutPassword } = userAccount;
    setUser(userWithoutPassword);
    localStorage.setItem('turistgo_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('turistgo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
