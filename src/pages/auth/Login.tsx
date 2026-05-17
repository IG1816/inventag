import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, Eye, EyeOff, AlertCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

const DEMO_ACCOUNTS = [
  { email: 'carlos@techcorp.com', password: 'admin123',    role: 'Admin' },
  { email: 'ana@techcorp.com',    password: 'manager123',  role: 'Gerente' },
  { email: 'pedro@techcorp.com',  password: 'operator123', role: 'Operador' },
  { email: 'maria@techcorp.com',  password: 'viewer123',   role: 'Visualizador' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc: { email: string; password: string }) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex">
      {/* Left panel — always dark */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#141414] dark:bg-black p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">RFID Control</p>
            <p className="text-slate-400 text-xs">Ativos &amp; Estoque</p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Controle total de<br />ativos e estoque<br />com RFID
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Elimine auditorias manuais, detecte divergências em tempo real e sincronize com seu ERP automaticamente.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '99%+', label: 'Precisão de inventário' },
              { val: '90%',  label: 'Auditorias mais rápidas' },
              { val: '3x',   label: 'Redução de perdas' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-2xl font-black text-yellow-400">{val}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} RFID Control. Todos os direitos reservados.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 transition-transform duration-300" />
            : <Moon className="w-4 h-4 transition-transform duration-300" />
          }
        </button>

        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-yellow-600 rounded-xl flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">RFID Control</p>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Bem-vindo de volta</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Entre com sua conta para continuar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required autoFocus
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-shadow"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                <Link to="/forgot-password" className="text-xs text-yellow-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10 transition-shadow"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-yellow-600 text-white text-sm font-semibold rounded-xl hover:bg-yellow-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Entrando...</>
                : 'Entrar'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Contas demo — clique para preencher:</p>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => fillDemo(acc)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-yellow-300 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors text-left group">
                <div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-yellow-700 dark:group-hover:text-yellow-400">{acc.email}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{acc.password}</p>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-600 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-500/20 text-slate-500 dark:text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 px-2 py-0.5 rounded-full font-medium transition-colors">
                  {acc.role}
                </span>
              </button>
            ))}
          </div>

          <p className="text-center mt-4 text-xs text-slate-400 dark:text-slate-600">
            <Link to="/" className="hover:text-yellow-500 transition-colors">← Voltar para o site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
