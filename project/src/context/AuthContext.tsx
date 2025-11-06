import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  balance: number;
  isSubscribed: boolean; // ✅ NUEVO
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
  setSubscription: (state: boolean) => void; // ✅ NUEVO
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
    await new Promise(resolve => setTimeout(resolve, 300));

    // ⚠️ Si el usuario no está registrado → rechazar login
    const stored = localStorage.getItem(email);
    if (!stored) throw new Error("Esta cuenta no está registrada o no está suscripta.");

    const account = JSON.parse(stored);

    // ⚠️ Si no está suscripto → bloquear acceso
    if (!account.isSubscribed) throw new Error("Tu cuenta no está suscripta. Suscribite para ingresar.");

    setUser(account);
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newUser: User = {
      email,
      name,
      balance: 0,
      isSubscribed: false, // ✅ Empieza NO suscripto
      alias: '',
      cbu: '',
      walletAddress: ''
    };

    // Guardamos la cuenta en localStorage como “registro”
    localStorage.setItem(email, JSON.stringify(newUser));
    setUser(newUser);
  };

  const updatePaymentInfo = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const setBalance = (newBalance: number) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : prev);
  };

  const setSubscription = (state: boolean) => {
    setUser(prev => prev ? { ...prev, isSubscribed: state } : prev);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, updatePaymentInfo, setBalance, setSubscription, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
