
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Check, CreditCard, Loader2, Plane, ShieldCheck, ChevronsRight } from "lucide-react";
import { format } from "date-fns";
import mockData from "@/services/mockData";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";
import FlightSearchForm from "@/components/flights/FlightSearchForm";

const BookFlight = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState<number>(0);
  const [availableFlights, setAvailableFlights] = useState<FlightType[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightType | null>(null);
  const [searchParams, setSearchParams] = useState(location.state?.search || null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Passenger information form
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [seatSelection, setSeatSelection] = useState("");
  
  // Payment information
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Set default passenger count
  const passengerCount = searchParams?.passengers || 1;

  // Search for specific flight by ID from URL params
  useEffect(() => {
    if (params.flightId) {
      const flight = mockData.flights.find(f => f.id === params.flightId);
      if (flight) {
        setSelectedFlight(flight);
        setActiveStep(1);
      } else {
        toast({
          variant: "destructive",
          title: "Flight not found",
          description: "The requested flight could not be found.",
        });
        navigate("/book-flight");
      }
    } else if (searchParams) {
      searchFlights();
    }
  }, [params.flightId, searchParams]);

  const searchFlights = () => {
    if (!searchParams) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const { from, to, departDate } = searchParams;
      
      let filteredFlights = mockData.flights.filter(flight => 
        flight.departureAirport.code === from && 
        flight.arrivalAirport.code === to &&
        flight.status !== "cancelled" &&
        flight.seatsAvailable >= passengerCount
      );
      
      if (departDate) {
        const searchDate = new Date(departDate);
        searchDate.setHours(0, 0, 0, 0);
        
        filteredFlights = filteredFlights.filter(flight => {
          const flightDate = new Date(flight.date);
          flightDate.setHours(0, 0, 0, 0);
          return flightDate.getTime() === searchDate.getTime();
        });
      }
      
      setAvailableFlights(filteredFlights);
      setIsLoading(false);
    }, 1500);
  };

  const handleFlightSelect = (flight: FlightType) => {
    setSelectedFlight(flight);
    setActiveStep(1);
  };

  const handleSubmitPassengerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!firstName || !lastName || !email || !phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setActiveStep(2);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form if credit card
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all payment details.",
        });
        return;
      }
      
      if (cardNumber.length < 16) {
        toast({
          variant: "destructive",
          title: "Invalid card number",
          description: "Please enter a valid credit card number.",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      setIsLoading(false);
      setActiveStep(3);
      
      toast({
        title: "Booking confirmed!",
        description: "Your flight has been successfully booked.",
      });
      
      // After 2 seconds, redirect to bookings page
      setTimeout(() => {
        navigate("/my-bookings");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book Your Flight</h1>
        <p className="text-gray-600">
          {activeStep === 0 && "Search and select a flight"}
          {activeStep === 1 && "Enter passenger information"}
          {activeStep === 2 && "Payment details"}
          {activeStep === 3 && "Booking confirmation"}
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {["Select Flight", "Passenger Info", "Payment", "Confirmation"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i <= activeStep 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < activeStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`text-sm mt-2 ${i <= activeStep ? "text-primary font-medium" : "text-gray-500"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="hidden sm:flex mt-3 justify-center">
          <div className="relative max-w-3xl w-full">
            <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-gray-200"></div>
            <div 
              className="absolute top-0 left-[10%] h-0.5 bg-primary transition-all duration-500" 
              style={{ width: `${activeStep * (80/3)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step 1: Flight Selection */}
      {activeStep === 0 && (
        <div>
          {!searchParams && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Find Your Flight</CardTitle>
              </CardHeader>
              <CardContent>
                <FlightSearchForm />
              </CardContent>
            </Card>
          )}

          {searchParams && (
            <div>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium mb-2">
                        {searchParams.from} to {searchParams.to}
                      </h2>
                      <p className="text-gray-600">
                        {searchParams.departDate ? format(new Date(searchParams.departDate), "EEE, MMM d, yyyy") : "Any date"} • {searchParams.passengers} {searchParams.passengers === 1 ? "passenger" : "passengers"}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-3 md:mt-0"
                      onClick={() => setSearchParams(null)}
                    >
                      Modify Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Available Flights</h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-gray-600">Searching for flights...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {availableFlights.length > 0 ? (
                      <div className="space-y-6">
                        {availableFlights.map((flight) => (
                          <div key={flight.id} className="relative">
                            <FlightCard flight={flight} />
                            <div className="mt-4 flex justify-end">
                              <Button onClick={() => handleFlightSelect(flight)}>
                                Select Flight
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/40">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Plane className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No flights available</h3>
                          <p className="text-gray-500 mb-4 text-center">
                            We couldn't find any available flights matching your search criteria.
                          </p>
                          <Button variant="outline" onClick={() => setSearchParams(null)}>
                            Try a different search
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Passenger Information */}
      {activeStep === 1 && selectedFlight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassengerInfo}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Select value={title} onValueChange={setTitle}>
                          <SelectTrigger>
                            <SelectValue placeholder="Title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Dr">Dr</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name*</Label>
                          <Input 
                            id="firstName" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name*</Label>
                          <Input 
                            id="lastName" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email*</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                      />
                    </div>

                    <div>
                      <Label htmlFor="seat">Seat Preference</Label>
                      <Select value={seatSelection} onValueChange={setSeatSelection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select seat preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="window">Window</SelectItem>
                          <SelectItem value="aisle">Aisle</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveStep(0)}
                      >
                        Back
                      </Button>
                      <Button type="submit">
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Flight Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Flight</div>
                    <div className="font-medium">{selectedFlight.flightNumber}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{format(new Date(selectedFlight.date), "EEE, MMM d, yyyy")}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Route</div>
                    <div className="font-medium">{selectedFlight.departureAirport.code} to {selectedFlight.arrivalAirport.code}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Departure</div>
                    <div className="font-medium">{selectedFlight.departureTime}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Arrival</div>
                    <div className="font-medium">{selectedFlight.arrivalTime}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{selectedFlight.duration}</div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Base fare</div>
                      <div className="font-medium">${selectedFlight.price}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Taxes & fees</div>
                      <div className="font-medium">${Math.round(selectedFlight.price * 0.18)}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Passengers</div>
                      <div className="font-medium">x {passengerCount}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="font-bold">Total</div>
                      <div className="font-bold text-xl text-primary">
                        ${(selectedFlight.price + Math.round(selectedFlight.price * 0.18)) * passengerCount}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {activeStep === 2 && selectedFlight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayment}>
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Payment Method</Label>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={setPaymentMethod}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-primary" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.5 8.75H16.75M16.75 8.75V6M16.75 8.75H14M12.5 6H4.5L6.5 15H14.5L16.5 6" stroke="#0070ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              PayPal
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input 
                            id="cardName" 
                            placeholder="Name on Card" 
                            value={cardName} 
                            onChange={(e) => setCardName(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input 
                              id="expiryDate" 
                              placeholder="MM/YY" 
                              value={expiryDate} 
                              onChange={(e) => setExpiryDate(e.target.value)} 
                              required 
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              placeholder="123" 
                              value={cvv} 
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="rounded-md bg-blue-50 p-4 text-center">
                        <p className="text-sm text-blue-800 mb-4">
                          You'll be redirected to PayPal to complete your payment securely.
                        </p>
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                          alt="PayPal" 
                          className="h-12 mx-auto" 
                        />
                      </div>
                    )}

                    <div className="rounded-md bg-green-50 p-4 flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-800 font-medium">Secure payment</p>
                        <p className="text-xs text-green-700 mt-1">
                          Your payment information is encrypted and secure. We do not store credit card details.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="min-w-[150px]"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Complete Booking 
                            <ChevronsRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Passenger</div>
                    <div className="font-medium">{title} {firstName} {lastName}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Flight</div>
                    <div className="font-medium">{selectedFlight.flightNumber}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{format(new Date(selectedFlight.date), "EEE, MMM d, yyyy")}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Route</div>
                    <div className="font-medium">{selectedFlight.departureAirport.code} to {selectedFlight.arrivalAirport.code}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Passengers</div>
                    <div className="font-medium">{passengerCount}</div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Base fare</div>
                      <div className="font-medium">${selectedFlight.price}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Taxes & fees</div>
                      <div className="font-medium">${Math.round(selectedFlight.price * 0.18)}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Passengers</div>
                      <div className="font-medium">x {passengerCount}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="font-bold">Total</div>
                      <div className="font-bold text-xl text-primary">
                        ${(selectedFlight.price + Math.round(selectedFlight.price * 0.18)) * passengerCount}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {activeStep === 3 && selectedFlight && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your flight has been successfully booked. A confirmation email has been sent to {email}.
                </p>

                <div className="w-full p-4 rounded-lg bg-gray-50 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-500">Booking Reference</p>
                      <p className="font-medium">BK{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Flight</p>
                      <p className="font-medium">{selectedFlight.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passenger</p>
                      <p className="font-medium">{title} {firstName} {lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{format(new Date(selectedFlight.date), "EEE, MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">{selectedFlight.departureAirport.city} ({selectedFlight.departureAirport.code})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium">{selectedFlight.arrivalAirport.city} ({selectedFlight.arrivalAirport.code})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-medium">{selectedFlight.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-medium">{selectedFlight.arrivalTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <Button className="w-full" onClick={() => navigate("/my-bookings")}>
                    View My Bookings
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    Print Confirmation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookFlight;
