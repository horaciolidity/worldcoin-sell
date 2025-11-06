import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  balance: number;

  // ✅ Datos para método de cobro
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Restaurar sesión
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ✅ Guardar sesión cuando cambie
  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    setUser({
      email,
      name: email.split('@')[0],
      balance: 0, // ✅ Ahora SI empieza en 0 real
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
      alias: '',
      cbu: '',
      walletAddress: ''
    });
  };

  // ✅ Actualizar método de cobro
  const updatePaymentInfo = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  // ✅ Cambiar saldo real (depósitos, ventas, etc.)
  const setBalance = (newBalance: number) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : prev);
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
