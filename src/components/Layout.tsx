import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package2, Boxes, Radio, AlertTriangle,
  MapPin, FileBarChart2, Plug, Settings, Tag, ChevronRight,
  Cpu, DollarSign, Bell, User, Menu, X, Wrench, LogOut,
  Sun, Moon, Glasses
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/assets',    label: 'Ativos',         icon: Package2 },
  { to: '/inventory', label: 'Estoque',        icon: Boxes },
  { to: '/scans',     label: 'Leituras RFID',  icon: Radio },
  { to: '/maintenance',label: 'Manutenção',    icon: Wrench },
  { to: '/divergences',label: 'Divergências',  icon: AlertTriangle },
  { to: '/locations', label: 'Localizações',   icon: MapPin },
  { to: '/reports',   label: 'Relatórios',     icon: FileBarChart2 },
  { to: '/integrations',label: 'Integrações',  icon: Plug },
  { to: '/settings',  label: 'Configurações',  icon: Settings },
];

const bottomItems = [
  { to: '/pricing', label: 'Planos e Preços', icon: DollarSign },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  function goHome() {
    onClose?.();
    navigate('/');
  }

  return (
    <aside className="w-60 bg-white dark:bg-black flex flex-col h-full border-r border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-semibold text-sm leading-tight">RFID Control</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Ativos &amp; Estoque</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
          <p className="text-slate-700 dark:text-slate-300 text-xs font-medium truncate">TechCorp Industries</p>
          <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium">
            Profissional
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-yellow-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-yellow-500/10 dark:hover:bg-yellow-500/10'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
        {bottomItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/10'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          onClick={goHome}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/10"
        >
          <Cpu className="w-4 h-4" />
          <span>Visão Geral</span>
        </button>
      </div>
    </aside>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Layout({ children, title, subtitle, actions }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userProfile, logout } = useAuth();
  const { theme, toggleTheme, elderlyMode, toggleElderlyMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-[#141414] border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
                {subtitle && <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              {actions}

              {/* Elderly / accessibility toggle */}
              <button
                onClick={toggleElderlyMode}
                className={`p-2 rounded-lg transition-all ${
                  elderlyMode
                    ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={elderlyMode ? 'Desativar modo acessível' : 'Ativar modo acessível'}
              >
                <Glasses className="w-4 h-4" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4 transition-transform duration-300" />
                  : <Moon className="w-4 h-4 transition-transform duration-300" />
                }
              </button>

              <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-2 lg:pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{userProfile?.full_name ?? 'Usuário'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{userProfile?.role ?? 'admin'}</p>
                </div>
                <button onClick={() => logout().then(() => navigate('/login'))}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Sair">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
