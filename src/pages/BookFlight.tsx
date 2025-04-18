import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, User, CalendarDays, Clock, MapPin, AlertCircle } from "lucide-react";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";
import { format } from "date-fns";
import dbService from "@/services/dbService";

const BookFlight = () => {
  const { id: flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchCriteria, setSearchCriteria] = useState<any>(
    location.state?.search || {}
  );
  
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const [passenger, setPassenger] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    passportNumber: ""
  });
  
  const [currentTab, setCurrentTab] = useState("search");
  const [seatSelection, setSeatSelection] = useState("");
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  useEffect(() => {
    if (flightId) {
      setLoading(true);
      dbService.getFlightById(flightId)
        .then(flight => {
          if (flight) {
            setSelectedFlight(flight);
            setCurrentTab("passenger");
            generateAvailableSeats(flight.seatsAvailable);
          } else {
            toast({
              title: "Flight Not Found",
              description: "The requested flight could not be found.",
              variant: "destructive"
            });
            navigate("/book-flight");
          }
        })
        .finally(() => setLoading(false));
    } else if (Object.keys(searchCriteria).length > 0) {
      handleSearch();
    }
  }, [flightId]);

  const generateAvailableSeats = (count: number) => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let i = 1; i <= Math.ceil(count / rows.length); i++) {
      for (let j = 0; j < rows.length; j++) {
        if (seats.length < count) {
          seats.push(`${i}${rows[j]}`);
        }
      }
    }
    
    setAvailableSeats(seats);
  };
  
  const validateSearch = () => {
    const errors: any = {};
    if (!searchCriteria.from) errors.from = "Departure airport is required";
    if (!searchCriteria.to) errors.to = "Arrival airport is required";
    if (!searchCriteria.date) errors.date = "Date is required";
    if (searchCriteria.from === searchCriteria.to) {
      errors.to = "Departure and arrival airports cannot be the same";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassengerDetails = () => {
    const errors: any = {};
    if (!passenger.name.trim()) errors.name = "Name is required";
    if (!passenger.phone.trim()) errors.phone = "Phone number is required";
    if (!passenger.passportNumber.trim()) errors.passportNumber = "Passport/ID number is required";
    if (!seatSelection) errors.seat = "Please select a seat";
    
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (passenger.phone && !phoneRegex.test(passenger.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = () => {
    if (!validateSearch()) return;
    
    setLoading(true);
    setSearchPerformed(true);
    
    dbService.searchFlights(searchCriteria)
      .then(results => {
        setFlights(results);
        if (results.length === 0) {
          toast({
            title: "No Flights Available",
            description: "No flights found for the selected criteria. Please try different dates or locations.",
            variant: "default"
          });
        }
      })
      .catch(error => {
        console.error("Search error:", error);
        toast({
          title: "Search Error",
          description: "An error occurred while searching for flights.",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };
  
  const handleFlightSelection = (flight: FlightType) => {
    setSelectedFlight(flight);
    setCurrentTab("passenger");
  };
  
  const handleBooking = () => {
    if (!validatePassengerDetails()) return;
    
    if (!selectedFlight || !user) return;
    
    setLoading(true);
    
    const bookingData = {
      flightId: selectedFlight.id,
      flight: selectedFlight,
      passengerName: passenger.name,
      passengerEmail: user.email,
      seatNumber: seatSelection,
      status: "confirmed",
      paymentStatus: "paid"
    };
    
    dbService.createBooking(bookingData)
      .then(booking => {
        setBookingConfirmed(true);
        toast({
          title: "Booking Confirmed!",
          description: `Your flight has been booked successfully. Booking reference: ${booking.id}`,
        });
      })
      .catch(error => {
        console.error("Booking error:", error);
        toast({
          title: "Booking Error",
          description: "An error occurred while processing your booking.",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };
  
  const renderBookingConfirmation = () => {
    if (!selectedFlight) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ✅ Your flight is booked!
            </h3>
            <p className="text-green-700">
              Thank you for booking with us. Your booking details are below.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Passenger Details</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{passenger.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{passenger.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{passenger.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium">{seatSelection}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Flight Details</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight Number:</span>
                  <span className="font-medium">{selectedFlight.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {format(new Date(selectedFlight.date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">
                    {selectedFlight.departureAirport.city} ({selectedFlight.departureTime})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival:</span>
                  <span className="font-medium">
                    {selectedFlight.arrivalAirport.city} ({selectedFlight.arrivalTime})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/my-bookings")}
              className="flex-1"
            >
              View All Bookings
            </Button>
            <Button 
              onClick={() => {
                setSearchCriteria({});
                setSelectedFlight(null);
                setBookingConfirmed(false);
                setCurrentTab("search");
                navigate("/book-flight");
              }}
              className="flex-1"
            >
              Book Another Flight
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a Flight</h1>
        <p className="text-gray-600">Search and book your next journey with SkyWave Airlines</p>
      </div>
      
      {bookingConfirmed ? (
        renderBookingConfirmation()
      ) : (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Flights</TabsTrigger>
            <TabsTrigger value="passenger" disabled={!selectedFlight}>
              Passenger Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Flight Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Select 
                      value={searchCriteria.from || ""} 
                      onValueChange={(value) => {
                        setSearchCriteria({...searchCriteria, from: value});
                        setErrors({...errors, from: null});
                      }}
                    >
                      <SelectTrigger id="from" className={errors.from ? "border-red-500" : ""}>
                        <SelectValue placeholder="Departure Airport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JFK">New York (JFK)</SelectItem>
                        <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                        <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                        <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                        <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.from && (
                      <p className="text-sm text-red-500">{errors.from}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Select 
                      value={searchCriteria.to || ""} 
                      onValueChange={(value) => {
                        setSearchCriteria({...searchCriteria, to: value});
                        setErrors({...errors, to: null});
                      }}
                    >
                      <SelectTrigger id="to" className={errors.to ? "border-red-500" : ""}>
                        <SelectValue placeholder="Arrival Airport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JFK">New York (JFK)</SelectItem>
                        <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                        <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                        <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                        <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.to && (
                      <p className="text-sm text-red-500">{errors.to}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={searchCriteria.date || ""} 
                      onChange={(e) => {
                        setSearchCriteria({...searchCriteria, date: e.target.value});
                        setErrors({...errors, date: null});
                      }}
                      className={errors.date ? "border-red-500" : ""}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>
                </div>
                
                <Button onClick={handleSearch} className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Plane className="mr-2 h-4 w-4" />
                      Search Flights
                    </span>
                  )}
                </Button>
                
                {searchPerformed && (
                  <div className="mt-8 space-y-6">
                    <h2 className="text-xl font-bold">Search Results</h2>
                    
                    {flights.length > 0 ? (
                      <div className="space-y-4">
                        {flights.map((flight) => (
                          <div key={flight.id} className="relative">
                            <FlightCard flight={flight} />
                            <div className="mt-4 px-6 pb-6">
                              <Button 
                                onClick={() => handleFlightSelection(flight)}
                                disabled={flight.seatsAvailable < 1 || flight.status === 'cancelled'}
                                className="w-full md:w-auto"
                              >
                                Select This Flight
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/40">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No flights found</h3>
                          <p className="text-gray-500 mb-4 text-center">
                            We couldn't find any flights matching your search criteria.
                            Try different dates or airports.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="passenger">
            {selectedFlight && (
              <div className="space-y-6">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FlightCard flight={selectedFlight} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="passenger-name">Full Name</Label>
                        <Input 
                          id="passenger-name" 
                          value={passenger.name} 
                          onChange={(e) => {
                            setPassenger({...passenger, name: e.target.value});
                            setErrors({...errors, name: null});
                          }}
                          placeholder="Enter your full name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="passenger-phone">Phone Number</Label>
                        <Input 
                          id="passenger-phone" 
                          value={passenger.phone} 
                          onChange={(e) => {
                            setPassenger({...passenger, phone: e.target.value});
                            setErrors({...errors, phone: null});
                          }}
                          placeholder="Enter your phone number"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="passenger-passport">Passport/ID Number</Label>
                        <Input 
                          id="passenger-passport" 
                          value={passenger.passportNumber} 
                          onChange={(e) => {
                            setPassenger({...passenger, passportNumber: e.target.value});
                            setErrors({...errors, passportNumber: null});
                          }}
                          placeholder="Enter passport or ID number"
                          className={errors.passportNumber ? "border-red-500" : ""}
                        />
                        {errors.passportNumber && (
                          <p className="text-sm text-red-500">{errors.passportNumber}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Seat Selection</h3>
                      <p className="text-sm text-gray-500">
                        Please select your preferred seat from the available options.
                      </p>
                      
                      <div className="grid grid-cols-6 gap-2">
                        {availableSeats.map((seat) => (
                          <div key={seat} className="text-center">
                            <button
                              className={`w-12 h-12 rounded-md border transition-colors ${
                                seatSelection === seat
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white hover:border-primary"
                              }`}
                              onClick={() => {
                                setSeatSelection(seat);
                                setErrors({...errors, seat: null});
                              }}
                            >
                              {seat}
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.seat && (
                        <p className="text-sm text-red-500">{errors.seat}</p>
                      )}
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentTab("search")}>
                        Back to Search
                      </Button>
                      <Button 
                        onClick={handleBooking}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                            Processing...
                          </span>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BookFlight;
