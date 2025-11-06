import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Copy, Check, AlertCircle, Settings } from "lucide-react";
import { useWLDPrice } from "../hooks/useWLDPrice";

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

export function Exchange({ onNavigate }: ExchangeProps) {
  const { user } = useAuth();
  const { usd, ars, loading } = useWLDPrice();

  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");

  const walletAddress = "0xc46f4a60b9bac52c1583abeb4f956d5d798a02e8";

  // ✅ Método de cobro configurado por el usuario (alias / cbu / wallet)
  const selectedMethod =
    user?.alias || user?.cbu || user?.walletAddress || null;

  // ✅ Tasa real
  const rate = currency === "USD" ? usd : ars;
  const convertedAmount =
    amount && rate ? (Number(amount) * rate).toFixed(2) : "0.00";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Guardar transacción real
  const saveTransaction = () => {
    const newTx = {
      id: crypto.randomUUID(),
      amount: Number(amount),
      currency,
      convertedAmount,
      method: selectedMethod || "Sin método configurado",
      status: "pending",
      date: new Date().toLocaleString(),
    };

    const prev = JSON.parse(localStorage.getItem("transactions") || "[]");
    prev.unshift(newTx);
    localStorage.setItem("transactions", JSON.stringify(prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod)
      return alert("Antes de continuar, configurá tu método de cobro.");

    if (Number(amount) > 0 && Number(amount) <= (user?.balance || 0)) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    saveTransaction();
    setShowConfirmModal(false);
    onNavigate("status");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Intercambiar WLD</h1>
        <p className="text-gray-300">Convertí tus Worldcoin a dinero real.</p>
      </div>

      {/* ⚠️ Aviso si no tiene método configurado */}
      {!selectedMethod && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div className="flex-1 text-red-300">
            <p className="font-semibold mb-1">No tenés configurado un método de cobro.</p>
            <p className="text-sm">Configurá cómo querés recibir tu dinero.</p>
            <button
              onClick={() => onNavigate("payment-settings")}
              className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Configurar método
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cantidad */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <label className="block text-sm text-gray-200 mb-2">
            Cantidad a intercambiar
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={user?.balance || 0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-2xl font-semibold"
            placeholder="0.00"
            required
          />
          <p className="mt-2 text-sm text-gray-400">
            Balance disponible: {user?.balance?.toFixed(2)} WLD
          </p>
        </div>

        {/* Selección moneda */}
        <div className="grid grid-cols-2 gap-3">
          {["USD", "ARS"].map((cur) => (
            <button
              key={cur}
              type="button"
              onClick={() => setCurrency(cur as "USD" | "ARS")}
              className={`py-3 rounded-xl font-semibold border transition-all ${
                currency === cur
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border-white/20"
              }`}
            >
              {cur}
            </button>
          ))}
        </div>

        {/* Resultado */}
        <div className="p-6 rounded-xl bg-blue-500/20 border border-white/20">
          <p className="text-gray-300 mb-1">Recibirás aprox:</p>
          <p className="text-3xl font-bold text-white">
            {loading ? "Calculando..." : `$${convertedAmount} ${currency}`}
          </p>
        </div>

        {/* Dirección de envío */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-3">Enviar WLD a:</h3>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/10">
            <code className="flex-1 text-white text-sm break-all">{walletAddress}</code>
            <button onClick={handleCopy} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Las acreditaciones tardan **3 a 15 min**.
          </p>
        </div>

        {/* Confirmar */}
        <button
          type="submit"
          disabled={!amount || Number(amount) <= 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold shadow-lg hover:scale-[1.02] transition-all"
        >
          Confirmar Intercambio <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-white/20 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Confirmar</h3>
            <p className="text-gray-300 mb-6">
              Después de confirmar, enviá los WLD a la dirección mostrada.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
