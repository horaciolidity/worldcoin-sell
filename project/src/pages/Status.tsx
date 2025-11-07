import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface StatusProps {
  onNavigate: (page: string) => void;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  received: string; // ✅ antes era convertedAmount
  status: "pending" | "verifying" | "completed" | "failed";
  date: string;
  method?: string; // ✅ ahora puede no existir
}

export function Status({ onNavigate }: StatusProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ✅ Cargar historial desde LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const getStatusConfig = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return {
          label: "Completado",
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
        };
      case "verifying":
        return {
          label: "Verificando",
          icon: Clock,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
        };
      case "pending":
        return {
          label: "Pendiente",
          icon: Clock,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
        };
      case "failed":
        return {
          label: "Fallido",
          icon: AlertCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
        };
    }
  };

  const getStatusTimeline = (status: Transaction["status"]) => {
    const steps = [
      { label: "Pendiente", status: "pending" },
      { label: "Verificando", status: "verifying" },
      { label: "Completado", status: "completed" },
    ];

    const currentIndex = steps.findIndex((step) => step.status === status);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  // ✅ Mostrar método de cobro correctamente
  const formatMethod = (method?: string) => {
    if (!method) return "Sin método configurado";
    if (method.startsWith("0x")) return `Wallet Crypto: ${method}`;
    if (method.includes(".")) return `Alias MP: ${method}`;
    if (method.length >= 20) return `CBU/CVU: ${method}`;
    return method;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Estado de Transacciones</h1>
        <p className="text-gray-300">Seguimiento en tiempo real</p>
      </div>

      {transactions.length === 0 && (
        <p className="text-gray-400 text-center py-10">
          Todavía no realizaste ninguna transacción.
        </p>
      )}

      <div className="space-y-6">
        {transactions.map((tx) => {
          const statusCfg = getStatusConfig(tx.status);
          const StatusIcon = statusCfg.icon;
          const timeline = getStatusTimeline(tx.status);

          return (
            <div
              key={tx.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{tx.amount} WLD</h3>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-xl font-bold text-white">
                        ${tx.received} {tx.currency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">ID: {tx.id}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusCfg.bgColor} border ${statusCfg.borderColor}`}
                  >
                    <StatusIcon className={`w-5 h-5 ${statusCfg.color}`} />
                    <span className={`font-semibold ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Método de cobro</p>
                  <p className="text-white font-medium">{formatMethod(tx.method)}</p>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Progreso</h4>
                <div className="relative">
                  {timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.isCompleted
                              ? "bg-blue-500 border-blue-500"
                              : "bg-white/5 border-white/20"
                          }`}
                        >
                          {step.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 mt-2 transition-all ${
                              step.isCompleted ? "bg-blue-500" : "bg-white/20"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-semibold mb-1 ${
                            step.isCompleted ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-400">
                          {step.isCompleted
                            ? step.status === tx.status
                              ? "En proceso..."
                              : "Completado"
                            : "Pendiente"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
        <p className="text-gray-300 mb-4">¿Querés hacer otro intercambio?</p>
        <button
          onClick={() => onNavigate("exchange")}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
        >
          Nueva Transacción
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
