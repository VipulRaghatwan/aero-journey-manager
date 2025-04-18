
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminFlights from "@/pages/admin/Flights";
import AdminPassengers from "@/pages/admin/Passengers";
import AdminReports from "@/pages/admin/Reports";
import BookFlight from "@/pages/BookFlight";
import FlightStatus from "@/pages/FlightStatus";
import MyBookings from "@/pages/MyBookings";
import Profile from "@/pages/Profile";

// Layout components
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="flight-status" element={<FlightStatus />} />
              
              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="book-flight" element={<BookFlight />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="flights" element={<AdminFlights />} />
                <Route path="passengers" element={<AdminPassengers />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
