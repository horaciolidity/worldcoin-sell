import { useAuth } from "../context/AuthContext";
import { Wallet, TrendingUp, RefreshCw, ArrowRight, Settings } from "lucide-react";
import { useWLDPrice } from "../hooks/useWLDPrice";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { usd, ars, loading, refresh } = useWLDPrice();

  // ✅ Balance en USD usando la cotización real
  const balanceUSD =
    user?.balance && usd
      ? (user.balance * usd).toFixed(2)
      : "...";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hola, {user?.name}
        </h1>
        <p className="text-gray-300">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* ✅ CARD BALANCE */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Balance Total</p>
              <p className="text-xs text-gray-400">Worldcoin (WLD)</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-1">
            {user?.balance?.toFixed(2)}
          </h2>
          <p className="text-lg text-gray-300">
            ≈ ${balanceUSD} USD
          </p>

          <button
            onClick={() => onNavigate("exchange")}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
          >
            Intercambiar ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* ✅ CARD COTIZACIÓN EN VIVO */}
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Tasa de Cambio</p>
                <p className="text-xs text-gray-400">Datos en tiempo real</p>
              </div>
            </div>

            <button
              onClick={refresh}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">1 WLD</span>
                <span className="text-2xl font-bold text-white">
                  {loading ? "..." : `$${usd} USD`}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">1 WLD</span>
                <span className="text-2xl font-bold text-white">
                  {loading ? "..." : `$${ars} ARS`}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Cotización obtenida en vivo desde el mercado.
          </p>
        </div>
      </div>

      {/* ✅ ACCIONES */}
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>

        <div className="grid md:grid-cols-3 gap-4">

          <button
            onClick={() => onNavigate("exchange")}
            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <h4 className="font-semibold text-white mb-1">Intercambiar</h4>
            <p className="text-sm text-gray-400">Convertí tus WLD</p>
          </button>

          <button
            onClick={() => onNavigate("status")}
            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <h4 className="font-semibold text-white mb-1">Ver Estado</h4>
            <p className="text-sm text-gray-400">Seguimiento de operaciones</p>
          </button>

          <button
            onClick={() => onNavigate("payment-settings")}
            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
              <Settings className="w-5 h-5 text-orange-300" />
            </div>
            <h4 className="font-semibold text-white mb-1">Método de Cobro</h4>
            <p className="text-sm text-gray-400">Alias / CBU / Wallet</p>
          </button>

        </div>
      </div>
    </div>
  );
}
