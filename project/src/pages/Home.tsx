import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWLDPrice } from '../hooks/useWLDPrice';
import WorldcoinCarousel from '../components/WorldcoinCarousel';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { isAuthenticated } = useAuth();
  const { usd, ars, loading } = useWLDPrice(); // ✅ Cotización en tiempo real

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* NAV */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">WLD Exchange Hub</h1>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
            >
              Ir al Panel
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              Iniciar Sesión
            </button>
          )}
        </nav>

        {/* HERO */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Intercambiá tus Worldcoin<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              fácil y rápido
            </span>
          </h2>

          {/* ✅ Mostrar tasas reales */}
          <p className="text-xl text-gray-300 mb-4">
            Tasa actual: <span className="text-white font-semibold">
              {loading ? "..." : `$${usd} USD`}
            </span> por WLD
          </p>

          <p className="text-lg text-gray-400 mb-8">
            ≈ <span className="text-white font-semibold">
              {loading ? "..." : `$${ars} ARS`}
            </span>
          </p>

          <button
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'login')}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            {isAuthenticated ? "Ir al Panel" : "Comenzar"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ✅ Carrusel de imágenes de Worldcoin */}
        <WorldcoinCarousel />

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instantáneo</h3>
            <p className="text-gray-300">Transacciones procesadas en minutos.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Seguro</h3>
            <p className="text-gray-300">Protección y confianza en cada operación.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Mejor Tasa</h3>
            <p className="text-gray-300">Automático y siempre actualizado.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
