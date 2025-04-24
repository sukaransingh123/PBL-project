
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define user types
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function (simulated)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation (in real app, this would be a backend call)
      if (!email.includes('@') || password.length < 6) {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        throw new Error('Invalid credentials');
      }

      const mockUser: User = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        name: email.split('@')[0],
        email,
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function (simulated)
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation (in real app, this would be a backend call)
      if (!email.includes('@') || password.length < 6 || !name) {
        toast({
          title: "Registration failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
        throw new Error('Invalid registration data');
      }

      const mockUser: User = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        name,
        email,
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to StockML, ${name}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
