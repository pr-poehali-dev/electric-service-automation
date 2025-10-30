
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Confirmation from "./pages/Confirmation";
import OrderHistory from "./pages/OrderHistory";
import ExecutorProfile from "./pages/ExecutorProfile";
import ExecutorPublicProfile from "./pages/ExecutorPublicProfile";
import Login from "./pages/Login";
import ExecutorDashboard from "./pages/ExecutorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/executor-profile" element={<ExecutorProfile />} />
      <Route path="/executor-public-profile" element={<ExecutorPublicProfile />} />
      <Route 
        path="/executor" 
        element={
          <ProtectedRoute allowedRoles={['executor']}>
            <ExecutorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-panel" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-products" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <AdminProducts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-users" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;