import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-yellow-600 rounded-xl flex items-center justify-center">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <p className="font-bold text-slate-900">RFID Manager</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-2">E-mail enviado!</h1>
            <p className="text-slate-500 text-sm mb-6">
              Verifique sua caixa de entrada em <strong>{email}</strong> e siga as instruções para redefinir sua senha.
            </p>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
            </Link>

            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-5">
              <Mail className="w-7 h-7 text-yellow-600" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-1">Esqueceu a senha?</h1>
            <p className="text-slate-500 text-sm mb-6">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail cadastrado</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" required autoFocus
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white transition-shadow"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-yellow-600 text-white text-sm font-semibold rounded-xl hover:bg-yellow-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                ) : 'Enviar link de redefinição'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
