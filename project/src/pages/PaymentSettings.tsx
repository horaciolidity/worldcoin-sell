import React, { useState, useEffect } from "react";

interface PaymentMethod {
  alias?: string;
  cbu?: string;
  wallet?: string;
}

export default function PaymentSettings() {
  const [methods, setMethods] = useState<PaymentMethod>({
    alias: "",
    cbu: "",
    wallet: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("paymentMethods");
    if (stored) {
      setMethods(JSON.parse(stored));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("paymentMethods", JSON.stringify(methods));
    alert("✅ Métodos de cobro guardados correctamente.");
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Configuración de Cobro</h1>

      <div className="space-y-5">

        {/* Alias Mercado Pago */}
        <div>
          <label className="block mb-1 text-gray-300">Alias de Mercado Pago</label>
          <input
            type="text"
            placeholder="ej: juanperez.mp"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={methods.alias}
            onChange={(e) => setMethods({ ...methods, alias: e.target.value })}
          />
        </div>

        {/* CBU / CVU */}
        <div>
          <label className="block mb-1 text-gray-300">CBU / CVU</label>
          <input
            type="text"
            placeholder="ej: 0000003100030023456781"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={methods.cbu}
            onChange={(e) => setMethods({ ...methods, cbu: e.target.value })}
          />
        </div>

        {/* Wallet Crypto */}
        <div>
          <label className="block mb-1 text-gray-300">Wallet (USDT / WLD / ETH)</label>
          <input
            type="text"
            placeholder="ej: 0xD21FA0bA83C9D3E784... "
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={methods.wallet}
            onChange={(e) => setMethods({ ...methods, wallet: e.target.value })}
          />
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
