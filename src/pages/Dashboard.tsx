
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import mockData from "@/services/mockData";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";
import { Plane, Calendar, CreditCard, MapPin, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingFlights, setUpcomingFlights] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Get user's bookings
    const bookings = mockData.bookings.filter(
      booking => booking.passengerEmail === user?.email && booking.status === "confirmed"
    );
    
    // Get upcoming flights
    const upcoming = bookings
      .filter(booking => new Date(booking.flight.date) > new Date())
      .sort((a, b) => new Date(a.flight.date).getTime() - new Date(b.flight.date).getTime())
      .slice(0, 3);
    
    setUpcomingFlights(upcoming);
    
    // Get recent bookings
    const recent = [...bookings]
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      .slice(0, 5);
    
    setRecentBookings(recent);
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Here's an overview of your travel plans and account information.</p>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flights">My Flights</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Flights</CardTitle>
                <CardDescription>Your next scheduled trips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{upcomingFlights.length}</div>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link to="/my-bookings">View all flights</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">SkyMiles</CardTitle>
                <CardDescription>Your frequent flyer points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,450</div>
                <Button variant="link" className="p-0 h-auto mt-2">
                  View reward options
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Saved Locations</CardTitle>
                <CardDescription>Your favorite destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Manage saved locations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Next Flight */}
          <div>
            <h2 className="text-xl font-bold mb-4">Your Next Flight</h2>
            {upcomingFlights.length > 0 ? (
              <FlightCard flight={upcomingFlights[0].flight} />
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plane className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No upcoming flights</h3>
                  <p className="text-gray-500 mb-4 text-center">You don't have any upcoming trips scheduled yet.</p>
                  <Button asChild>
                    <Link to="/book-flight">Book a Flight</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Bookings */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Plane className="h-6 w-6 text-primary" />
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{booking.flight.departureAirport.city} to {booking.flight.arrivalAirport.city}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              {format(new Date(booking.flight.date), "EEE, MMM d, yyyy")} • Flight {booking.flight.flightNumber}
                            </div>
                            <div className="flex items-center mt-2 text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              <span>Booked on {format(new Date(booking.bookingDate), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end mt-4 md:mt-0">
                          <span className="text-lg font-bold">${booking.flight.price}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            Confirmation: {booking.id}
                          </span>
                          <Link 
                            to={`/my-bookings/${booking.id}`} 
                            className="text-primary hover:underline text-sm mt-2"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-gray-500">No recent bookings found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Flights Tab */}
        <TabsContent value="flights" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Flights</h2>
            <Button asChild>
              <Link to="/book-flight">Book New Flight</Link>
            </Button>
          </div>

          {upcomingFlights.length > 0 ? (
            <div className="space-y-4">
              {upcomingFlights.map((booking) => (
                <FlightCard key={booking.id} flight={booking.flight} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No flights found</h3>
                <p className="text-gray-500 mb-4">You don't have any upcoming flights scheduled.</p>
                <Button asChild>
                  <Link to="/book-flight">Book a Flight</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/my-bookings">View All Bookings</Link>
            </Button>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Profile Information</h2>
            <Button asChild>
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">123 Example St, City</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">Standard Member</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">January 15, 2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Notification Preferences</p>
                  <p className="font-medium">Email notifications enabled</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
