
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { NotificationProvider } from "./contexts/NotificationContext";
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
import ElectricalHome from "./pages/ElectricalHome";
import Calculator from "./pages/Calculator";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutPage from "./pages/CheckoutPage";
import Orders from "./pages/Orders";
import AllOrders from "./pages/AllOrders";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Services from "./pages/Services";

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
      <Route path="/" element={<Services />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/electrical" element={<ElectricalHome />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/all-orders" element={<AllOrders />} />
      <Route path="/old-home" element={<Home />} />
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
      <NotificationProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;