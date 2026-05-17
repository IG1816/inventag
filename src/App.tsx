import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth-context';
import { ThemeProvider } from './lib/theme-context';
import ProtectedRoute from './components/ProtectedRoute';

// Landing page
import Landing from './pages/Landing';

// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Unauthorized from './pages/Unauthorized';

// Operator module
import OperatorDashboard from './pages/operator/OperatorDashboard';

// Admin / Manager pages
import Dashboard from './pages/Dashboard';
import AssetList from './pages/assets/AssetList';
import AssetDetail from './pages/assets/AssetDetail';
import NewAsset from './pages/assets/NewAsset';
import ProductList from './pages/inventory/ProductList';
import ProductDetail from './pages/inventory/ProductDetail';
import NewProduct from './pages/inventory/NewProduct';
import ScanList from './pages/scans/ScanList';
import NewScan from './pages/scans/NewScan';
import ScanDetail from './pages/scans/ScanDetail';
import MaintenanceList from './pages/maintenance/MaintenanceList';
import DivergenceList from './pages/divergences/DivergenceList';
import DivergenceDetail from './pages/divergences/DivergenceDetail';
import LocationList from './pages/locations/LocationList';
import LocationDetail from './pages/locations/LocationDetail';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Presentation from './pages/Presentation';

// Smart root redirect based on role
function DashboardRedirect() {
  const { session, userProfile, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  if (userProfile && (userProfile.role === 'operator' || userProfile.role === 'viewer')) {
    return <Navigate to="/operator" replace />;
  }
  return <Dashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — public */}
      <Route path="/" element={<Landing />} />

      {/* Auth — public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Operator module */}
      <Route path="/operator" element={
        <ProtectedRoute>
          <OperatorDashboard />
        </ProtectedRoute>
      } />

      {/* Dashboard — smart redirect */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRedirect />
        </ProtectedRoute>
      } />

      {/* Admin / Manager routes */}
      <Route path="/assets" element={<ProtectedRoute allowedRoles={['admin','manager','operator','viewer']}><AssetList /></ProtectedRoute>} />
      <Route path="/assets/new" element={<ProtectedRoute allowedRoles={['admin','manager']}><NewAsset /></ProtectedRoute>} />
      <Route path="/assets/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />

      <Route path="/inventory" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/inventory/new" element={<ProtectedRoute allowedRoles={['admin','manager']}><NewProduct /></ProtectedRoute>} />
      <Route path="/inventory/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />

      <Route path="/scans" element={<ProtectedRoute><ScanList /></ProtectedRoute>} />
      <Route path="/scans/new" element={<ProtectedRoute><NewScan /></ProtectedRoute>} />
      <Route path="/scans/:id" element={<ProtectedRoute><ScanDetail /></ProtectedRoute>} />

      <Route path="/maintenance" element={<ProtectedRoute><MaintenanceList /></ProtectedRoute>} />

      <Route path="/divergences" element={<ProtectedRoute><DivergenceList /></ProtectedRoute>} />
      <Route path="/divergences/:id" element={<ProtectedRoute><DivergenceDetail /></ProtectedRoute>} />

      <Route path="/locations" element={<ProtectedRoute><LocationList /></ProtectedRoute>} />
      <Route path="/locations/:id" element={<ProtectedRoute><LocationDetail /></ProtectedRoute>} />

      <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin','manager']}><Reports /></ProtectedRoute>} />
      <Route path="/integrations" element={<ProtectedRoute allowedRoles={['admin']}><Integrations /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin','manager']}><Settings /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/presentation" element={<ProtectedRoute><Presentation /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
