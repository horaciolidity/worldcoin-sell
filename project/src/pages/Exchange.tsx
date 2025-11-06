import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Copy, Check, Wallet, Smartphone } from 'lucide-react';

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

export function Exchange({ onNavigate }: ExchangeProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [sendMethod, setSendMethod] = useState<'manual' | 'worldapp' | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const exchangeRate = currency === 'USD' ? 2.45 : 857.50;
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const convertedAmount = amount ? (Number(amount) * exchangeRate).toFixed(2) : '0.00';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) > 0 && Number(amount) <= (user?.balance || 0)) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    onNavigate('status');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Intercambiar WLD</h1>
        <p className="text-gray-300">Convertí tus Worldcoin a dinero real</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Cantidad a intercambiar
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max={user?.balance || 0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-2xl font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                WLD
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Balance disponible: {user?.balance?.toFixed(2)} WLD
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Recibir en
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                } border border-white/20`}
              >
                USD (Dólares)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('ARS')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  currency === 'ARS'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                } border border-white/20`}
              >
                ARS (Pesos)
              </button>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Recibirás aproximadamente</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {currency === 'USD' ? '$' : '$'}{convertedAmount}
                </p>
                <p className="text-sm text-gray-300">{currency}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Método de envío</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSendMethod('manual')}
              className={`w-full p-5 rounded-xl border transition-all text-left ${
                sendMethod === 'manual'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">Envío Manual</h4>
                  <p className="text-sm text-gray-300">Enviá WLD a nuestra wallet</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSendMethod('worldapp')}
              className={`w-full p-5 rounded-xl border transition-all text-left ${
                sendMethod === 'worldapp'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">World App</h4>
                  <p className="text-sm text-gray-300">Conectá tu World App</p>
                </div>
              </div>
            </button>
          </div>

          {sendMethod === 'manual' && (
            <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/20">
              <p className="text-sm text-gray-300 mb-3">Enviá tus WLD a esta dirección:</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/10">
                <code className="flex-1 text-white text-sm break-all">{walletAddress}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          )}

          {sendMethod === 'worldapp' && (
            <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/20 text-center">
              <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-300 mb-4">
                Conectá tu World App para enviar WLD directamente
              </p>
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Conectar World App
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!amount || !sendMethod || Number(amount) <= 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          Confirmar Intercambio
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Confirmar Transacción</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Cantidad:</span>
                <span className="font-semibold text-white">{amount} WLD</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Recibirás:</span>
                <span className="font-semibold text-white">
                  {currency === 'USD' ? '$' : '$'}{convertedAmount} {currency}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Método:</span>
                <span className="font-semibold text-white">
                  {sendMethod === 'manual' ? 'Envío Manual' : 'World App'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
