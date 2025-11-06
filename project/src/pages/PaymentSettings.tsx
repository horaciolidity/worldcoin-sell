import { useState, useEffect } from "react";
import { ArrowLeft, Save, Copy, Check, Loader2 } from "lucide-react";

interface PaymentSettingsProps {
  onNavigate: (page: string) => void;
}

export function PaymentSettings({ onNavigate }: PaymentSettingsProps) {
  const [alias, setAlias] = useState("");
  const [cbu, setCbu] = useState("");
  const [wallet, setWallet] = useState("");

  const [checkingAlias, setCheckingAlias] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<"none" | "valid" | "invalid" | "error">("none");

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("paymentMethods") || "{}");
    if (stored.alias) setAlias(stored.alias);
    if (stored.cbu) setCbu(stored.cbu);
    if (stored.wallet) setWallet(stored.wallet);
  }, []);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // ✅ Verificador de Alias (Usando API pública de Mercado Pago)
  const validateAlias = async () => {
    if (!alias) return;
    setCheckingAlias(true);
    setAliasStatus("none");

    try {
      const res = await fetch(`https://api.mercadopago.com/v1/users/search?alias=${alias}`);
      const data = await res.json();

      if (data.results?.length > 0) {
        setAliasStatus("valid");
      } else {
        setAliasStatus("invalid");
      }
    } catch {
      setAliasStatus("error");
    }

    setCheckingAlias(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "paymentMethods",
      JSON.stringify({ alias, cbu, wallet })
    );
    onNavigate("dashboard");
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-white mb-6">Método de Cobro</h1>

      <div className="space-y-6 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-xl">

        {/* ALIAS */}
        <div>
          <label className="block text-gray-300 mb-2">Alias de Mercado Pago</label>

          <div className="flex gap-2">
            <input
              value={alias}
              onChange={(e) => { setAlias(e.target.value); setAliasStatus("none"); }}
              placeholder="ejemplo.mp"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            />

            <button
              onClick={validateAlias}
              disabled={!alias || checkingAlias}
              className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {checkingAlias ? <Loader2 className="animate-spin w-5 h-5" /> : "Verificar"}
            </button>
          </div>

          {aliasStatus === "valid" && (
            <p className="text-green-400 mt-1">✅ Alias válido</p>
          )}
          {aliasStatus === "invalid" && (
            <p className="text-red-400 mt-1">❌ No existe, revisá el alias</p>
          )}
          {aliasStatus === "error" && (
            <p className="text-yellow-400 mt-1">⚠ Error al verificar, intentar de nuevo</p>
          )}
        </div>

        {/* CBU */}
        <div>
          <label className="block text-gray-300 mb-2">CBU / CVU</label>
          <div className="flex gap-2">
            <input
              value={cbu}
              onChange={(e) => setCbu(e.target.value)}
              placeholder="0000000000000000000000"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            />
            <button
              onClick={() => copyText(cbu, "cbu")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {copiedField === "cbu" ? <Check className="text-green-400" /> : <Copy />}
            </button>
          </div>
        </div>

        {/* WALLET */}
        <div>
          <label className="block text-gray-300 mb-2">Wallet Crypto</label>
          <div className="flex gap-2">
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            />
            <button
              onClick={() => copyText(wallet, "wallet")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {copiedField === "wallet" ? <Check className="text-green-400" /> : <Copy />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Guardar Cambios
        </button>
      </div>
    </div>
  );
}
