import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  elderlyMode: boolean;
  toggleElderlyMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('no-transition');
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try { localStorage.setItem('rfid_theme', theme); } catch { /* ignore */ }
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-transition')));
}

function applyElderly(enabled: boolean) {
  const root = document.documentElement;
  if (enabled) {
    root.classList.add('elderly');
  } else {
    root.classList.remove('elderly');
  }
  try { localStorage.setItem('rfid_elderly', enabled ? 'true' : 'false'); } catch { /* ignore */ }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('rfid_theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* ignore */ }
    return 'dark';
  });

  const [elderlyMode, setElderlyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rfid_elderly') === 'true';
    } catch { /* ignore */ }
    return false;
  });

  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { applyElderly(elderlyMode); }, [elderlyMode]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleElderlyMode = () => setElderlyMode(v => !v);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, elderlyMode, toggleElderlyMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
