import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">Acesso Negado</h1>
        <p className="text-slate-500 text-sm mb-6">
          Você não tem permissão para acessar esta página. Contate o administrador se acredita que isso é um erro.
        </p>
        <button onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-xl hover:bg-yellow-700 transition-colors">
          Voltar
        </button>
      </div>
    </div>
  );
}
