
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, Calendar as CalendarIcon, Plane, ArrowRight, Clock, Info } from "lucide-react";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";
import mockData from "@/services/mockData";
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

const FlightStatus = () => {
  const [searchMethod, setSearchMethod] = useState("flight");
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<FlightType[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todayFlights, setTodayFlights] = useState<FlightType[]>([]);
  
  // Load today's flights on component mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const flights = mockData.flights.filter(flight => {
      const flightDate = new Date(flight.date);
      flightDate.setHours(0, 0, 0, 0);
      return flightDate.getTime() === today.getTime();
    });
    
    setTodayFlights(flights.slice(0, 10));
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredFlights = [...mockData.flights];
      
      if (searchMethod === "flight" && flightNumber) {
        filteredFlights = filteredFlights.filter(
          flight => flight.flightNumber.toLowerCase().includes(flightNumber.toLowerCase())
        );
      } else if (searchMethod === "route" && from && to) {
        filteredFlights = filteredFlights.filter(
          flight => flight.departureAirport.code === from && flight.arrivalAirport.code === to
        );
      }
      
      if (date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        
        filteredFlights = filteredFlights.filter(flight => {
          const flightDate = new Date(flight.date);
          flightDate.setHours(0, 0, 0, 0);
          return flightDate.getTime() === searchDate.getTime();
        });
      }
      
      setResults(filteredFlights);
      setSearched(true);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "on-time":
        return "bg-green-500";
      case "delayed":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Flight Status</h1>
        <p className="text-gray-600">Check the status of your flight instantly</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Flight Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={searchMethod} onValueChange={setSearchMethod} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="flight">By Flight Number</TabsTrigger>
              <TabsTrigger value="route">By Route</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flight">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Flight Number</label>
                  <Input
                    placeholder="e.g. SK1234"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="route">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airport" />
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
                
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airport" />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code} disabled={airport.code === from}>
                          {airport.city} ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-6">
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || (searchMethod === "flight" ? !flightNumber : (!from || !to))}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                    Searching...
                  </span>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Flight Status
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searched && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Info className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No flights found</h3>
                <p className="text-gray-500 mb-4 text-center">
                  We couldn't find any flights matching your search criteria. Please try with different parameters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Today's Flights */}
      {!searched && (
        <div>
          <h2 className="text-xl font-bold mb-4">Today's Flights</h2>
          {todayFlights.length > 0 ? (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Flight</th>
                      <th className="px-6 py-3">Route</th>
                      <th className="px-6 py-3">Departure</th>
                      <th className="px-6 py-3">Arrival</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayFlights.map((flight) => (
                      <tr 
                        key={flight.id} 
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium">
                          <div className="flex items-center">
                            <Plane className="h-4 w-4 text-primary mr-2" />
                            {flight.flightNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span>{flight.departureAirport.code}</span>
                            <ArrowRight className="h-3 w-3 mx-2" />
                            <span>{flight.arrivalAirport.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {flight.departureTime}
                        </td>
                        <td className="px-6 py-4">
                          {flight.arrivalTime}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn("text-white", getStatusColor(flight.status))}>
                            {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline">View All Flights</Button>
              </div>
            </div>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex items-center justify-center p-6">
                <p className="text-gray-500">No flights scheduled for today.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Flight Status Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Understanding Flight Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Badge className="bg-green-500 text-white mr-2">On Time</Badge>
              Flight is on schedule
            </h3>
            <p className="text-gray-600 text-sm ml-16">
              The flight is expected to depart and arrive as scheduled.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Badge className="bg-amber-500 text-white mr-2">Delayed</Badge>
              Flight is delayed
            </h3>
            <p className="text-gray-600 text-sm ml-16">
              The flight's departure or arrival is delayed from the scheduled time.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Badge className="bg-red-500 text-white mr-2">Cancelled</Badge>
              Flight is cancelled
            </h3>
            <p className="text-gray-600 text-sm ml-16">
              The flight has been cancelled and will not operate.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Badge className="bg-blue-500 text-white mr-2">Completed</Badge>
              Flight has arrived
            </h3>
            <p className="text-gray-600 text-sm ml-16">
              The flight has successfully arrived at its destination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightStatus;
