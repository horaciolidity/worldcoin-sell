import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [exchangeRate, setExchangeRate] = useState(2.45);
  const [loading, setLoading] = useState(false);

  const handleRefreshRate = () => {
    setLoading(true);
    setTimeout(() => {
      setExchangeRate(Number((2.40 + Math.random() * 0.15).toFixed(2)));
      setLoading(false);
    }, 1000);
  };

  const balanceInUSD = user?.balance ? (user.balance * exchangeRate).toFixed(2) : '0.00';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hola, {user?.name}
        </h1>
        <p className="text-gray-300">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Balance Total</p>
                <p className="text-xs text-gray-400">Worldcoin (WLD)</p>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <h2 className="text-5xl font-bold text-white mb-1">
              {user?.balance?.toFixed(2)}
            </h2>
            <p className="text-lg text-gray-300">
              ≈ ${balanceInUSD} USD
            </p>
          </div>
          <button
            onClick={() => onNavigate('exchange')}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Intercambiar ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Tasa de Cambio</p>
                <p className="text-xs text-gray-400">Actualizada hace 5 min</p>
              </div>
            </div>
            <button
              onClick={handleRefreshRate}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">1 WLD</span>
                <span className="text-2xl font-bold text-white">${exchangeRate} USD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-xs font-medium">
                  +2.3%
                </span>
                <span className="text-xs text-gray-400">últimas 24h</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">1 WLD</span>
                <span className="text-2xl font-bold text-white">${(exchangeRate * 350).toFixed(2)} ARS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-xs font-medium">
                  +1.8%
                </span>
                <span className="text-xs text-gray-400">últimas 24h</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Las tasas pueden variar según el mercado
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('exchange')}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Intercambiar</h4>
            <p className="text-sm text-gray-400">Convertí tus WLD a dinero</p>
          </button>

          <button
            onClick={() => onNavigate('status')}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Ver Estado</h4>
            <p className="text-sm text-gray-400">Seguí tus transacciones</p>
          </button>

          <button
            onClick={handleRefreshRate}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Actualizar Tasas</h4>
            <p className="text-sm text-gray-400">Obtené precios actuales</p>
          </button>
        </div>
      </div>
    </div>
  );
}
