import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DayPlanDetailPage } from './pages/DayPlanDetailPage';
import { AllTreatsPage } from './pages/AllTreatsPage';
import MyBillsPage from './pages/MyBillsPage';
import UnscheduledEventsPage from './pages/UnscheduledEventsPage';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/all-treats" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/all-treats" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DayPlanDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-treats"
        element={
          <ProtectedRoute>
            <Layout>
              <AllTreatsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bills"
        element={
          <ProtectedRoute>
            <Layout>
              <MyBillsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/unscheduled"
        element={
          <ProtectedRoute>
            <Layout>
              <UnscheduledEventsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/all-treats" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
