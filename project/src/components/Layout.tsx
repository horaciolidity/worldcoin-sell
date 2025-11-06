import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, ArrowLeftRight, Clock, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  const navigation = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Intercambiar', icon: ArrowLeftRight, page: 'exchange' },
    { name: 'Estado', icon: Clock, page: 'status' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="lg:flex">
        <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 transition-transform duration-300`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h1 className="text-xl font-bold text-white">WLD Exchange</h1>
              <button onClick={() => setMenuOpen(false)} className="lg:hidden text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate?.(item.page);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentPage === item.page
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/20">
              <button
                onClick={() => {
                  logout();
                  onNavigate?.('home');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-h-screen">
          <header className="lg:hidden bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
            <button onClick={() => setMenuOpen(true)} className="text-white">
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
