
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "@/components/flights/SearchForm";
import PassengerForm from "@/components/flights/PassengerForm";
import BookingConfirmation from "@/components/flights/BookingConfirmation";
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
    generateAvailableSeats(flight.seatsAvailable);
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

  const handleBookAnother = () => {
    setSearchCriteria({});
    setSelectedFlight(null);
    setBookingConfirmed(false);
    setCurrentTab("search");
    navigate("/book-flight");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a Flight</h1>
        <p className="text-gray-600">Search and book your next journey with SkyWave Airlines</p>
      </div>
      
      {bookingConfirmed ? (
        <BookingConfirmation
          selectedFlight={selectedFlight!}
          passenger={passenger}
          seatSelection={seatSelection}
          onBookAnother={handleBookAnother}
        />
      ) : (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Flights</TabsTrigger>
            <TabsTrigger value="passenger" disabled={!selectedFlight}>
              Passenger Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <SearchForm
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
              handleSearch={handleSearch}
              loading={loading}
              errors={errors}
            />
            
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
          </TabsContent>
          
          <TabsContent value="passenger">
            {selectedFlight && (
              <PassengerForm
                passenger={passenger}
                setPassenger={setPassenger}
                seatSelection={seatSelection}
                setSeatSelection={setSeatSelection}
                availableSeats={availableSeats}
                errors={errors}
                selectedFlight={selectedFlight}
                handleBooking={handleBooking}
                loading={loading}
                setCurrentTab={setCurrentTab}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BookFlight;
