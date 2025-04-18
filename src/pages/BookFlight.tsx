
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, CreditCard, User, CalendarDays, Clock, MapPin, AlertCircle } from "lucide-react";
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
    address: "",
    passportNumber: ""
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  
  const [currentTab, setCurrentTab] = useState("search");
  const [seatSelection, setSeatSelection] = useState("");
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  
  useEffect(() => {
    if (flightId) {
      // If flightId is provided, fetch that specific flight
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
      // If search criteria is provided via state, perform search automatically
      handleSearch();
    }
  }, [flightId]);
  
  useEffect(() => {
    if (selectedFlight) {
      generateAvailableSeats(selectedFlight.seatsAvailable);
    }
  }, [selectedFlight]);
  
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
  
  const handleSearch = () => {
    setLoading(true);
    setSearchPerformed(true);
    
    dbService.searchFlights(searchCriteria)
      .then(results => {
        setFlights(results);
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
        toast({
          title: "Booking Confirmed!",
          description: `Your flight has been booked successfully. Booking reference: ${booking.id}`,
        });
        
        navigate("/my-bookings");
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
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a Flight</h1>
        <p className="text-gray-600">Search and book your next journey with SkyWave Airlines</p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Flights</TabsTrigger>
          <TabsTrigger value="passenger" disabled={!selectedFlight}>Passenger Details</TabsTrigger>
          <TabsTrigger value="payment" disabled={!selectedFlight || !passenger.name}>Payment</TabsTrigger>
        </TabsList>
        
        {/* Search Tab */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Flight Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Select 
                    value={searchCriteria.from || ""} 
                    onValueChange={(value) => setSearchCriteria({...searchCriteria, from: value})}
                  >
                    <SelectTrigger id="from">
                      <SelectValue placeholder="Departure Airport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JFK">New York (JFK)</SelectItem>
                      <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                      <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                      <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                      <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
                      <SelectItem value="LHR">London (LHR)</SelectItem>
                      <SelectItem value="CDG">Paris (CDG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="to">To</Label>
                  <Select 
                    value={searchCriteria.to || ""} 
                    onValueChange={(value) => setSearchCriteria({...searchCriteria, to: value})}
                  >
                    <SelectTrigger id="to">
                      <SelectValue placeholder="Arrival Airport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JFK">New York (JFK)</SelectItem>
                      <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                      <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                      <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                      <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
                      <SelectItem value="LHR">London (LHR)</SelectItem>
                      <SelectItem value="CDG">Paris (CDG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={searchCriteria.date || ""} 
                    onChange={(e) => setSearchCriteria({...searchCriteria, date: e.target.value})}
                  />
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
        
        {/* Passenger Details Tab */}
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
                        onChange={(e) => setPassenger({...passenger, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passenger-email">Email</Label>
                      <Input 
                        id="passenger-email" 
                        type="email" 
                        value={passenger.email} 
                        onChange={(e) => setPassenger({...passenger, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passenger-phone">Phone Number</Label>
                      <Input 
                        id="passenger-phone" 
                        value={passenger.phone} 
                        onChange={(e) => setPassenger({...passenger, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passenger-passport">Passport/ID Number</Label>
                      <Input 
                        id="passenger-passport" 
                        value={passenger.passportNumber} 
                        onChange={(e) => setPassenger({...passenger, passportNumber: e.target.value})}
                        placeholder="Enter passport or ID number"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="passenger-address">Address</Label>
                      <Input 
                        id="passenger-address" 
                        value={passenger.address} 
                        onChange={(e) => setPassenger({...passenger, address: e.target.value})}
                        placeholder="Enter your address"
                      />
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
                            onClick={() => setSeatSelection(seat)}
                          >
                            {seat}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab("search")}>
                      Back to Search
                    </Button>
                    <Button 
                      onClick={() => setCurrentTab("payment")}
                      disabled={!passenger.name || !passenger.email || !seatSelection}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment">
          {selectedFlight && (
            <div className="space-y-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Plane className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {selectedFlight.departureAirport.city} to {selectedFlight.arrivalAirport.city}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Flight {selectedFlight.flightNumber}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {format(new Date(selectedFlight.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">
                            {selectedFlight.departureTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Seat</p>
                          <p className="font-medium">{seatSelection}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Passenger</p>
                          <p className="font-medium">{passenger.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md mt-4">
                      <div className="flex justify-between">
                        <span>Base fare</span>
                        <span>${selectedFlight.price}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Taxes and fees</span>
                        <span>$25</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                        <span>Total amount</span>
                        <span>${selectedFlight.price + 25}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup defaultValue="credit-card" className="space-y-3">
                    <div className="flex items-center space-x-3 bg-muted/30 p-3 rounded-md cursor-pointer">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="cursor-pointer flex-1">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <span>Credit/Debit Card</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="card-number" 
                        value={paymentDetails.cardNumber} 
                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input 
                        id="card-name" 
                        value={paymentDetails.cardName} 
                        onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input 
                          id="expiry-date" 
                          value={paymentDetails.expiryDate} 
                          onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          value={paymentDetails.cvv} 
                          onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                          placeholder="123"
                          type="password"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab("passenger")}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleBooking}
                      disabled={
                        loading || 
                        !paymentDetails.cardNumber || 
                        !paymentDetails.cardName || 
                        !paymentDetails.expiryDate || 
                        !paymentDetails.cvv
                      }
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
    </div>
  );
};

export default BookFlight;
