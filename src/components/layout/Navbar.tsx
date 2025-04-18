
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plane, Menu, User, LogOut, Search, Bell, BarChart } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Change navbar background on scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">SkyWave</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/flight-status" className="text-sm font-medium hover:text-primary transition-colors">
              Flight Status
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/book-flight" className="text-sm font-medium hover:text-primary transition-colors">
                  Book Flight
                </Link>
                <Link to="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                  My Bookings
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                    Home
                  </Link>
                  <Link to="/flight-status" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                    Flight Status
                  </Link>
                  
                  {isAuthenticated && !isAdmin && (
                    <>
                      <Link to="/book-flight" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        Book Flight
                      </Link>
                      <Link to="/my-bookings" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        My Bookings
                      </Link>
                      <Link to="/profile" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        Profile
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link to="/admin" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/flights" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        Manage Flights
                      </Link>
                      <Link to="/admin/passengers" className="px-2 py-1 hover:bg-muted rounded-md transition-colors">
                        Manage Passengers
                      </Link>
                    </>
                  )}

                  {isAuthenticated ? (
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/login">Log In</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
