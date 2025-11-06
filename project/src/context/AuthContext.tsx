import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  balance: number;
  isSubscribed: boolean; // ✅ Nuevo

  alias?: string;
  cbu?: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updatePaymentInfo: (data: Partial<User>) => void;
  setBalance: (newBalance: number) => void;
  subscribe: () => void; // ✅ Nuevo
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setUser({
      email,
      name: email.split('@')[0],
      balance: 0,
      isSubscribed: false, // ✅ Por defecto NO suscripto
      alias: '',
      cbu: '',
      walletAddress: ''
    });
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setUser({
      email,
      name,
      balance: 0,
      isSubscribed: false,
      alias: '',
      cbu: '',
      walletAddress: ''
    });
  };

  const updatePaymentInfo = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const setBalance = (newBalance: number) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : prev);
  };

  const subscribe = () => {
    setUser(prev => prev ? { ...prev, isSubscribed: true } : prev);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      updatePaymentInfo,
      setBalance,
      subscribe,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
