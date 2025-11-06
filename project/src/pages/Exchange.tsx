import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Copy,
  Check,
  Wallet,
  Smartphone,
  AlertCircle,
  Settings,
  Info,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

type Currency = 'USD' | 'ARS';
type SendMethod = 'manual' | 'worldapp';

type StoredPayment = {
  alias?: string;
  cbu?: string;
  wallet?: string;
};

type TxStatus = 'pending' | 'verifying' | 'completed' | 'failed';

interface NewTransaction {
  id: string;
  amount: number;
  currency: Currency;
  convertedAmount: string;
  method: string;
  status: TxStatus;
  date: string;
  notes?: string;
}

const WALLET_ADDRESS = '0xc46f4a60b9bac52c1583abeb4f956d5d798a02e8';

// Util: formateos
const fmt = (n: number, frac = 2) =>
  new Intl.NumberFormat('es-AR', { minimumFractionDigits: frac, maximumFractionDigits: frac }).format(n);

export function Exchange({ onNavigate }: ExchangeProps) {
  const { user } = useAuth();

  // ---------- Estado principal ----------
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [sendMethod, setSendMethod] = useState<SendMethod>('manual');
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');

  // ---------- Tasa y conversión ----------
  const rateUSD = 2.45;      // simulada
  const rateARS = 857.5;     // simulada
  const exchangeRate = currency === 'USD' ? rateUSD : rateARS;

  const convertedAmount = useMemo(() => {
    const a = Number(amount || 0);
    const total = a * exchangeRate;
    return isFinite(total) ? fmt(total) : '0,00';
  }, [amount, exchangeRate]);

  // ---------- Método de cobro guardado ----------
  const paymentMethods: StoredPayment = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('paymentMethods') || '{}');
    } catch {
      return {};
    }
  }, []);

  const hasPaymentMethod = Boolean(paymentMethods.alias || paymentMethods.cbu || paymentMethods.wallet);

  // ---------- Persistir la tasa para Home ----------
  useEffect(() => {
    localStorage.setItem('exchangeRate', String(rateUSD)); // Home muestra USD * 350 aprox
  }, [rateUSD]);

  // ---------- Copiar dirección ----------
  const handleCopy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ---------- Guardar transacción ----------
  const saveTransaction = () => {
    const selectedMethod =
      paymentMethods.alias ||
      paymentMethods.cbu ||
      paymentMethods.wallet ||
      'Sin método configurado';

    const tx: NewTransaction = {
      id: crypto.randomUUID(),
      amount: Number(amount),
      currency,
      convertedAmount,
      method: selectedMethod,
      status: 'pending',
      date: new Date().toLocaleString(),
      notes: additionalNote?.trim() ? additionalNote.trim() : undefined,
    };

    const prev = JSON.parse(localStorage.getItem('transactions') || '[]');
    prev.unshift(tx);
    localStorage.setItem('transactions', JSON.stringify(prev));
  };

  // ---------- Validación + submit ----------
  const canSubmit =
    Number(amount) > 0 &&
    Number(amount) <= (user?.balance || 0) &&
    hasPaymentMethod &&
    acceptedTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPaymentMethod) {
      alert('Antes de intercambiar, configurá cómo querés recibir tu dinero.');
      return;
    }
    if (!acceptedTerms) {
      alert('Debes confirmar que enviarás los WLD a la dirección indicada.');
      return;
    }
    if (Number(amount) <= 0) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    saveTransaction();
    setShowConfirmModal(false);
    onNavigate('status');
  };

  // ---------- Helpers UI ----------
  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Intercambiar WLD</h1>
        <p className="text-gray-300">
          Convertí tus Worldcoin y recibí el dinero en tu cuenta configurada.
        </p>
      </div>

      {/* Alerta: sin método de cobro */}
      {!hasPaymentMethod && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div className="flex-1 text-red-200">
            <p className="font-semibold">Falta configurar tu método de cobro</p>
            <p className="text-sm opacity-90">
              Para poder acreditarte, indicá si querés recibir por Alias/CBU o una wallet.
            </p>
            <button
              onClick={() => onNavigate('payment-settings')}
              className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-100 hover:bg-red-500/30 transition-all inline-flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurar método de cobro
            </button>
          </div>
        </div>
      )}

      {/* Resumen método de cobro */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-blue-300" />
          <h3 className="text-white font-semibold">Tu método de cobro</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <SummaryRow label="Alias" value={paymentMethods.alias || '—'} />
          <SummaryRow label="CBU/CVU" value={paymentMethods.cbu || '—'} />
          <SummaryRow label="Wallet" value={paymentMethods.wallet || '—'} />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onNavigate('payment-settings')}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm"
          >
            Editar método
          </button>
        </div>
      </div>

      {/* Pasos */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-300" />
          <h3 className="text-white font-semibold">Cómo funciona</h3>
        </div>
        <ol className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="text-white font-semibold">1.</span>
            Ingresá cuántos <span className="text-white font-semibold ml-1">WLD</span> querés vender.
          </li>
          <li className="flex gap-2">
            <span className="text-white font-semibold">2.</span>
            Elegí si querés recibir en <span className="text-white font-semibold ml-1">USD</span> o <span className="text-white font-semibold">ARS</span>.
          </li>
          <li className="flex gap-2">
            <span className="text-white font-semibold">3.</span>
            Confirmá y <span className="text-white font-semibold ml-1">enviá los WLD</span> a la dirección indicada.
          </li>
          <li className="flex gap-2">
            <span className="text-white font-semibold">4.</span>
            Seguimos el estado en <span className="text-white font-semibold ml-1">Estado</span> (acreditamos en 3–15 min).
          </li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Monto */}
        <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Cantidad a intercambiar
          </label>
          <div className="flex gap-2">
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
            <button
              type="button"
              onClick={() => setAmount(String(user?.balance ?? 0))}
              className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 hover:bg-white/20"
            >
              Max
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Balance disponible: <span className="text-white font-semibold">{fmt(user?.balance ?? 0)} WLD</span>
          </p>
        </div>

        {/* Moneda y estimación */}
        <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recibir en</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['USD', 'ARS'] as Currency[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all border ${
                  currency === cur
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/20'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Recibirás aproximadamente</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">${convertedAmount}</p>
                <p className="text-sm text-gray-300">{currency}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Tasa usada: {currency === 'USD' ? `${fmt(rateUSD)} USD/WLD` : `${fmt(rateARS, 2)} ARS/WLD`}.
            </p>
          </div>
        </div>

        {/* Método de envío (UI) */}
        <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Cómo enviar tus WLD</h3>
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
                  <p className="text-sm text-gray-300">Copiá la dirección y enviá desde tu wallet o World App</p>
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
                  <p className="text-sm text-gray-300">Enviá directamente desde tu World App (manual por ahora)</p>
                </div>
              </div>
            </button>
          </div>

          {/* Dirección de envío */}
          <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/20">
            <p className="text-sm text-gray-300 mb-3">Enviá tus WLD a esta dirección:</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/10">
              <code className="flex-1 text-white text-sm break-all">{WALLET_ADDRESS}</code>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-gray-300">
              <Clock className="w-4 h-4" />
              Acreditación estimada: <span className="text-white font-medium ml-1">3–15 minutos</span> después de recibir los WLD.
            </div>
          </div>
        </div>

        {/* Notas + términos */}
        <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Nota para esta operación (opcional)
          </label>
          <textarea
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Mandar ARS por alias preferentemente. "
          />

          <label className="mt-4 flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <span>
              Confirmo que enviaré exactamente la cantidad indicada de WLD a la dirección provista y que el receptor de fondos es el configurado en mi método de cobro.
            </span>
          </label>
        </div>

        {/* Botón principal */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Confirmar transacción</h3>
            </div>

            <div className="space-y-2 mb-6">
              <SummaryRow label="Cantidad" value={`${amount || '0.00'} WLD`} />
              <SummaryRow label="Vas a recibir" value={`$ ${convertedAmount} ${currency}`} />
              <SummaryRow label="Envío" value={sendMethod === 'manual' ? 'Manual / Wallet' : 'World App'} />
              <SummaryRow
                label="Acreditación"
                value="Aprox. 3–15 minutos tras recibir los WLD"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Volver
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Confirmar y ver estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
