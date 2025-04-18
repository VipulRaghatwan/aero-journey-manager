
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import mockData from "@/services/mockData";
import { 
  Plane, 
  CalendarDays, 
  Clock, 
  Users, 
  CreditCard, 
  FileText, 
  AlertTriangle,
  Download,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  flightId: string;
  flight: any;
  passengerName: string;
  passengerEmail: string;
  seatNumber: string;
  bookingDate: Date;
  status: string;
  paymentStatus: string;
}

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Get user's bookings
    const userBookings = mockData.bookings.filter(
      booking => booking.passengerEmail === user?.email
    );
    
    setBookings(userBookings);
  }, [user]);

  const upcomingBookings = bookings.filter(booking => {
    return new Date(booking.flight.date) > new Date() && booking.status !== "cancelled";
  });
  
  const completedBookings = bookings.filter(booking => {
    return new Date(booking.flight.date) < new Date() && booking.status !== "cancelled";
  });
  
  const cancelledBookings = bookings.filter(booking => {
    return booking.status === "cancelled";
  });

  const handleCancelBooking = (bookingId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, status: "cancelled" };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setIsLoading(false);
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFlightStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-green-100 text-green-800 border-green-200">On Time</Badge>;
      case "delayed":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Delayed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Scheduled</Badge>;
    }
  };

  const getBookingsForTab = () => {
    switch (currentTab) {
      case "upcoming":
        return upcomingBookings;
      case "completed":
        return completedBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return bookings;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-600">View and manage your flight reservations</p>
      </div>

      <Tabs 
        value={currentTab} 
        onValueChange={setCurrentTab} 
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {upcomingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          {getBookingsForTab().length > 0 ? (
            <div className="space-y-6">
              {getBookingsForTab().map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Plane className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {booking.flight.departureAirport.city} to {booking.flight.arrivalAirport.city}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {format(new Date(booking.flight.date), "EEE, MMM d, yyyy")}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Departure</p>
                                <p className="font-medium">
                                  {booking.flight.departureTime} • {booking.flight.departureAirport.code}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Arrival</p>
                                <p className="font-medium">
                                  {booking.flight.arrivalTime} • {booking.flight.arrivalAirport.code}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Passenger</p>
                                <p className="font-medium">{booking.passengerName}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Booking Date</p>
                                <p className="font-medium">
                                  {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Booking Status</p>
                                <div>{getStatusBadge(booking.status)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Plane className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Flight Status</p>
                                <div>{getFlightStatusBadge(booking.flight.status)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 lg:mt-0 lg:ml-6 lg:border-l lg:pl-6 flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                            <p className="font-medium text-lg mb-2">{booking.id}</p>
                            
                            <p className="text-sm text-gray-500 mb-1">Seat</p>
                            <p className="font-medium">{booking.seatNumber}</p>
                          </div>
                          
                          <div className="mt-4 flex flex-col gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Booking Details</DialogTitle>
                                  <DialogDescription>
                                    Confirmation #{booking.id}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div className="bg-muted/50 p-3 rounded-md">
                                    <h4 className="font-medium mb-2">Flight Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="text-gray-500">Flight Number</p>
                                        <p>{booking.flight.flightNumber}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Date</p>
                                        <p>{format(new Date(booking.flight.date), "MMM d, yyyy")}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">From</p>
                                        <p>{booking.flight.departureAirport.city} ({booking.flight.departureAirport.code})</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">To</p>
                                        <p>{booking.flight.arrivalAirport.city} ({booking.flight.arrivalAirport.code})</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Departure</p>
                                        <p>{booking.flight.departureTime}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Arrival</p>
                                        <p>{booking.flight.arrivalTime}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-muted/50 p-3 rounded-md">
                                    <h4 className="font-medium mb-2">Passenger Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="text-gray-500">Passenger</p>
                                        <p>{booking.passengerName}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Seat</p>
                                        <p>{booking.seatNumber}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-gray-500">Email</p>
                                        <p>{booking.passengerEmail}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-muted/50 p-3 rounded-md">
                                    <h4 className="font-medium mb-2">Booking Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="text-gray-500">Booking Date</p>
                                        <p>{format(new Date(booking.bookingDate), "MMM d, yyyy")}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Status</p>
                                        <div>{getStatusBadge(booking.status)}</div>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Payment Status</p>
                                        <p className={cn(
                                          booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                                        )}>
                                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Amount Paid</p>
                                        <p>${booking.flight.price}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter className="flex justify-between">
                                  <Button variant="outline" onClick={() => window.print()}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print
                                  </Button>
                                  <Button>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            {currentTab === "upcoming" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cancel Booking</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel this booking? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="py-4">
                                    <div className="bg-muted/50 p-3 rounded-md mb-4">
                                      <h4 className="font-medium mb-2">Booking Information</h4>
                                      <div className="text-sm">
                                        <p><span className="text-gray-500">Flight:</span> {booking.flight.flightNumber}</p>
                                        <p><span className="text-gray-500">Route:</span> {booking.flight.departureAirport.code} to {booking.flight.arrivalAirport.code}</p>
                                        <p><span className="text-gray-500">Date:</span> {format(new Date(booking.flight.date), "MMM d, yyyy")}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-amber-800 text-sm">
                                      <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                                      Cancellation might be subject to fees depending on the fare rules and timing.
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      Keep Booking
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <div className="flex items-center">
                                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                                          Processing...
                                        </div>
                                      ) : (
                                        "Confirm Cancellation"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="bg-muted/70 p-4 rounded-full mb-4">
                  {currentTab === "upcoming" ? (
                    <Plane className="h-8 w-8 text-gray-500" />
                  ) : currentTab === "completed" ? (
                    <CheckCircle className="h-8 w-8 text-gray-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No {currentTab} bookings</h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  {currentTab === "upcoming" 
                    ? "You don't have any upcoming flight reservations. Ready to plan your next trip?"
                    : currentTab === "completed"
                    ? "You don't have any completed flight bookings yet."
                    : "You don't have any cancelled flight bookings."
                  }
                </p>
                {currentTab === "upcoming" && (
                  <Button asChild>
                    <Link to="/book-flight">Book a Flight</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Define CheckCircle component since it's used in the code but not imported
const CheckCircle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default MyBookings;
