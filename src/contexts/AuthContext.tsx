
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "../components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Simulated login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes only - in a real app, this would be a backend call
      if (email === "admin@skywave.com" && password === "password") {
        const adminUser = {
          id: "admin-123",
          name: "Admin User",
          email: "admin@skywave.com",
          role: "admin" as const
        };
        
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        return true;
      } else if (email === "user@example.com" && password === "password") {
        const regularUser = {
          id: "user-456",
          name: "Regular User",
          email: "user@example.com",
          role: "user" as const
        };
        
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Simulated register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes only
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "user" as const
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred during registration",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
