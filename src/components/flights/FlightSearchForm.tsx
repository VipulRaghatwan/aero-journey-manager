import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar as CalendarIcon, Plane, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const airports = [
  { code: "JFK", city: "New York" },
  { code: "LAX", city: "Los Angeles" },
  { code: "ORD", city: "Chicago" },
  { code: "ATL", city: "Atlanta" },
  { code: "SFO", city: "San Francisco" },
  { code: "LHR", city: "London" },
  { code: "CDG", city: "Paris" },
  { code: "DXB", city: "Dubai" },
  { code: "SIN", city: "Singapore" },
  { code: "HND", city: "Tokyo" }
];

const FlightSearchForm = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1");

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departDate || !from || !to) {
      return;
    }
    
    // If authenticated, navigate to booking page
    if (isAuthenticated) {
      navigate("/book-flight", { 
        state: { 
          search: {
            tripType,
            from,
            to,
            departDate,
            returnDate,
            passengers: Number(passengers)
          } 
        } 
      });
    } else {
      // Otherwise go to login page
      navigate("/login", { 
        state: { 
          redirectTo: "/book-flight",
          search: {
            tripType,
            from,
            to,
            departDate,
            returnDate,
            passengers: Number(passengers)
          }
        } 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="mb-6">
        <RadioGroup
          value={tripType}
          onValueChange={setTripType}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="roundtrip" id="roundtrip" />
            <label htmlFor="roundtrip" className="text-sm font-medium cursor-pointer">
              Round Trip
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oneway" id="oneway" />
            <label htmlFor="oneway" className="text-sm font-medium cursor-pointer">
              One Way
            </label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex items-center">
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code} disabled={airport.code === from}>
                  {airport.city} ({airport.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            size="icon"
            variant="ghost" 
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:static md:transform-none md:ml-2 z-10 bg-white shadow-sm hover:bg-gray-50"
            onClick={handleSwapLocations}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Swap locations</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? (
                  format(departDate, "PPP")
                ) : (
                  <span>Departure Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className={cn(tripType === "oneway" ? "opacity-50" : "")}>
          <Popover>
            <PopoverTrigger asChild disabled={tripType === "oneway"}>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate && tripType !== "oneway" ? (
                  format(returnDate, "PPP")
                ) : (
                  <span>Return Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
                disabled={(date) => 
                  date < new Date() || (departDate ? date < departDate : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Plane className="mr-2 h-4 w-4" />
        Search Flights
      </Button>
    </form>
  );
};

export default FlightSearchForm;
