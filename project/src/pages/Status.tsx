import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface StatusProps {
  onNavigate: (page: string) => void;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  convertedAmount: string;
  status: 'pending' | 'verifying' | 'completed' | 'failed';
  date: string;
  method: string;
}

export function Status({ onNavigate }: StatusProps) {
  const transactions: Transaction[] = [
    {
      id: 'TX001',
      amount: 5.5,
      currency: 'USD',
      convertedAmount: '13.48',
      status: 'completed',
      date: '2025-11-04 10:30',
      method: 'World App'
    },
    {
      id: 'TX002',
      amount: 10.0,
      currency: 'ARS',
      convertedAmount: '8575.00',
      status: 'verifying',
      date: '2025-11-04 14:15',
      method: 'Envío Manual'
    },
    {
      id: 'TX003',
      amount: 2.3,
      currency: 'USD',
      convertedAmount: '5.64',
      status: 'pending',
      date: '2025-11-04 15:45',
      method: 'World App'
    }
  ];

  const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completado',
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'verifying':
        return {
          label: 'Verificando',
          icon: Clock,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'pending':
        return {
          label: 'Pendiente',
          icon: Clock,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'failed':
        return {
          label: 'Fallido',
          icon: AlertCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30'
        };
    }
  };

  const getStatusTimeline = (status: Transaction['status']) => {
    const steps = [
      { label: 'Pendiente', status: 'pending' },
      { label: 'Verificando', status: 'verifying' },
      { label: 'Completado', status: 'completed' }
    ];

    const currentIndex = steps.findIndex(step => step.status === status);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Estado de Transacciones</h1>
        <p className="text-gray-300">Seguí el progreso de tus intercambios</p>
      </div>

      <div className="space-y-6">
        {transactions.map((tx) => {
          const statusConfig = getStatusConfig(tx.status);
          const StatusIcon = statusConfig.icon;
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
                        ${tx.convertedAmount} {tx.currency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">ID: {tx.id}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    <span className={`font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Método de envío</p>
                  <p className="text-white font-medium">{tx.method}</p>
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
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white/5 border-white/20'
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
                              step.isCompleted ? 'bg-blue-500' : 'bg-white/20'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-semibold mb-1 ${
                            step.isCompleted ? 'text-white' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-400">
                          {step.isCompleted
                            ? step.status === tx.status
                              ? 'En proceso...'
                              : 'Completado'
                            : 'Pendiente'}
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
        <p className="text-gray-300 mb-4">¿Querés realizar otra transacción?</p>
        <button
          onClick={() => onNavigate('exchange')}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
        >
          Nueva Transacción
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
