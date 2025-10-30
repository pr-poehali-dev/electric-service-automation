import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  phone: string;
  name: string;
  role: 'client' | 'executor' | 'admin' | 'owner';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    const mockUser: User = {
      id: 1,
      phone,
      name: phone === '+79991234567' ? 'Алексей Иванов' : 'Пользователь',
      role: phone === '+79999999999' ? 'admin' : phone === '+79991234567' ? 'executor' : 'client'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (phone: string, password: string, name: string, role: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now(),
      phone,
      name,
      role: role as any
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
