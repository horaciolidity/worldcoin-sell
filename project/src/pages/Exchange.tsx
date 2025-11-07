import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWLDPrice } from '../hooks/useWLDPrice';
import {
  ArrowRight,
  Copy,
  Check,
  Shield,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

export function Exchange({ onNavigate }: ExchangeProps) {
  const { user } = useAuth();

  // Precios en tiempo real 🔥
  const { usd, ars, loading } = useWLDPrice();

  // Estado de pasos
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [copied, setCopied] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const WALLET_ADDRESS = '0xc46f4a60b9bac52c1583abeb4f956d5d798a02e8';

  const exchangeRate = currency === 'USD' ? (usd || 0) : (ars || 0);

  const convertedAmount = useMemo(() => {
    const total = Number(amount || 0) * exchangeRate;
    return isFinite(total) ? total.toFixed(2) : '0.00';
  }, [amount, exchangeRate]);

  // Requisitos para cada paso
  const canStep1 = Number(amount) > 0 && Number(amount) <= (user?.balance || 0);
  const canStep3 = accepted;

  // Guardar transacción
  const confirmSwap = () => {
    const prev = JSON.parse(localStorage.getItem('transactions') || '[]');
    prev.unshift({
      id: crypto.randomUUID(),
      amount: Number(amount),
      currency,
      received: convertedAmount,
      status: 'pending',
      date: new Date().toLocaleString(),
    });
    localStorage.setItem('transactions', JSON.stringify(prev));
    onNavigate('status');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Barra de progreso */}
      <div className="flex justify-between mb-10 text-sm text-gray-300">
        {['Monto', 'Moneda', 'Enviar', 'Confirmar'].map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center pb-2 border-b-2 ${
              step === i + 1 ? 'border-purple-400 text-white' : 'border-white/20'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* PASO 1 */}
      {step === 1 && (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/20">
          <h2 className="text-xl text-white font-semibold mb-4">¿Cuántos WLD querés vender?</h2>

          <input
            type="number"
            value={amount}
            min={0}
            max={user?.balance ?? 0}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-4xl px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white"
            placeholder="0.0"
          />

          <p className="mt-3 text-gray-300 text-sm">
            Balance disponible: {user?.balance?.toFixed(2)} WLD
          </p>

          <button
            disabled={!canStep1}
            onClick={() => setStep(2)}
            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/20">
          <h2 className="text-xl text-white font-semibold mb-6">Vas a recibir en:</h2>

          <div className="grid grid-cols-2 gap-4">
            {['USD', 'ARS'].map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur as any)}
                className={`py-3 rounded-xl font-semibold border ${
                  currency === cur
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 border-white/20'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="mt-6 text-white">
            <p className="text-gray-300">Recibirás aprox:</p>
            <p className="text-4xl font-bold">${convertedAmount} {currency}</p>
            <p className="text-xs text-gray-400 mt-2">
              {loading ? 'Actualizando tasa…' : `Tasa: ${exchangeRate.toFixed(2)} ${currency}/WLD`}
            </p>
          </div>

          <button
            onClick={() => setStep(3)}
            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
          >
            Continuar
          </button>
        </div>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/20">
          <h2 className="text-xl text-white font-semibold mb-4">Enviá tus WLD a esta dirección</h2>

          <div className="p-4 bg-black/30 border border-white/10 rounded-xl flex items-center gap-3">
            <code className="text-white text-sm break-all flex-1">{WALLET_ADDRESS}</code>
            <button onClick={copyAddress} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
              {copied ? <Check className="text-green-300" /> : <Copy className="text-white" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-300">
            <Clock className="w-4 h-4" />
            Acreditación estimada: <span className="text-white font-medium ml-1">3–15 minutos</span>
          </div>

          <label className="flex items-start gap-3 mt-6 text-gray-300 text-sm">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            Confirmo que enviaré EXACTAMENTE la cantidad indicada.
          </label>

          <button
            disabled={!canStep3}
            onClick={() => setStep(4)}
            className="mt-6 w-full py-4 rounded-xl bg-purple-600 text-white font-semibold disabled:opacity-40"
          >
            Ya envié los WLD
          </button>
        </div>
      )}

      {/* PASO 4 */}
      {step === 4 && (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/20 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <h2 className="text-2xl text-white font-bold mb-2">¡Listo!</h2>
          <p className="text-gray-300 mb-6">
            Estamos verificando tu envío. Esto suele tardar entre 3–15 minutos.
          </p>

          <button
            onClick={confirmSwap}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
          >
            Ver Estado
          </button>
        </div>
      )}
    </div>
  );
}
