
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { 
  Plane, 
  Search, 
  PlusCircle, 
  RefreshCw, 
  Calendar as CalendarIcon, 
  Edit, 
  Trash2, 
  CheckCircle2,
  XCircle, 
  Clock
} from "lucide-react";
import { format } from "date-fns";
import mockData from "@/services/mockData";
import { FlightType } from "@/components/flights/FlightCard";
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

const aircrafts = [
  "Boeing 737-800",
  "Airbus A320",
  "Boeing 787-9 Dreamliner",
  "Airbus A350-900",
  "Boeing 777-300ER"
];

const flightStatuses = ["scheduled", "on-time", "delayed", "cancelled", "completed"];

const AdminFlights = () => {
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Add/edit flight state
  const [showFlightDialog, setShowFlightDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [flightToEdit, setFlightToEdit] = useState<FlightType | null>(null);
  
  // Form state for new/edit flight
  const [formFlightNumber, setFormFlightNumber] = useState("");
  const [formDepartureAirport, setFormDepartureAirport] = useState("");
  const [formArrivalAirport, setFormArrivalAirport] = useState("");
  const [formDepartureTime, setFormDepartureTime] = useState("");
  const [formArrivalTime, setFormArrivalTime] = useState("");
  const [formDate, setFormDate] = useState<Date | undefined>(new Date());
  const [formDuration, setFormDuration] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formSeatsAvailable, setFormSeatsAvailable] = useState("");
  const [formAircraft, setFormAircraft] = useState("");
  const [formStatus, setFormStatus] = useState("scheduled");
  const [formAmenities, setFormAmenities] = useState<string[]>([]);

  // Fetch flights on component mount
  useEffect(() => {
    setFlights(mockData.flights);
  }, []);

  // Filter flights based on search and filters
  const filteredFlights = flights.filter(flight => {
    // First check current tab
    if (currentTab !== "all" && flight.status !== currentTab) {
      return false;
    }
    
    // Then check search term
    if (searchTerm && 
      !flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !flight.departureAirport.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !flight.arrivalAirport.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Then check date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      
      const flightDate = new Date(flight.date);
      flightDate.setHours(0, 0, 0, 0);
      
      if (filterDate.getTime() !== flightDate.getTime()) {
        return false;
      }
    }
    
    // Finally check status filter
    if (statusFilter && flight.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter(undefined);
    setStatusFilter("");
  };

  const handleAddFlight = () => {
    setIsEditing(false);
    setFlightToEdit(null);
    
    // Reset form
    setFormFlightNumber("");
    setFormDepartureAirport("");
    setFormArrivalAirport("");
    setFormDepartureTime("");
    setFormArrivalTime("");
    setFormDate(new Date());
    setFormDuration("");
    setFormPrice("");
    setFormSeatsAvailable("");
    setFormAircraft("");
    setFormStatus("scheduled");
    setFormAmenities([]);
    
    setShowFlightDialog(true);
  };

  const handleEditFlight = (flight: FlightType) => {
    setIsEditing(true);
    setFlightToEdit(flight);
    
    // Set form values
    setFormFlightNumber(flight.flightNumber);
    setFormDepartureAirport(flight.departureAirport.code);
    setFormArrivalAirport(flight.arrivalAirport.code);
    setFormDepartureTime(flight.departureTime);
    setFormArrivalTime(flight.arrivalTime);
    setFormDate(new Date(flight.date));
    setFormDuration(flight.duration);
    setFormPrice(flight.price.toString());
    setFormSeatsAvailable(flight.seatsAvailable.toString());
    setFormAircraft(flight.aircraft);
    setFormStatus(flight.status);
    setFormAmenities(flight.amenities || []);
    
    setShowFlightDialog(true);
  };

  const handleDeleteFlight = (flight: FlightType) => {
    if (window.confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
      // Simulate API call
      setIsLoading(true);
      
      setTimeout(() => {
        setFlights(flights.filter(f => f.id !== flight.id));
        setIsLoading(false);
        
        toast({
          title: "Flight deleted",
          description: `Flight ${flight.flightNumber} has been successfully deleted.`,
        });
      }, 500);
    }
  };

  const handleFlightStatusChange = (flight: FlightType, newStatus: string) => {
    // Simulate API call
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedFlights = flights.map(f => {
        if (f.id === flight.id) {
          return { ...f, status: newStatus as any };
        }
        return f;
      });
      
      setFlights(updatedFlights);
      setIsLoading(false);
      
      toast({
        title: "Status updated",
        description: `Flight ${flight.flightNumber} status changed to ${newStatus}.`,
      });
    }, 500);
  };

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formFlightNumber ||
      !formDepartureAirport ||
      !formArrivalAirport ||
      !formDepartureTime ||
      !formArrivalTime ||
      !formDate ||
      !formDuration ||
      !formPrice ||
      !formSeatsAvailable ||
      !formAircraft
    ) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (formDepartureAirport === formArrivalAirport) {
      toast({
        variant: "destructive",
        title: "Invalid route",
        description: "Departure and arrival airports cannot be the same.",
      });
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    
    setTimeout(() => {
      if (isEditing && flightToEdit) {
        // Update existing flight
        const updatedFlights = flights.map(f => {
          if (f.id === flightToEdit.id) {
            return {
              ...f,
              flightNumber: formFlightNumber,
              departureAirport: {
                code: formDepartureAirport,
                city: airports.find(a => a.code === formDepartureAirport)?.city || ""
              },
              arrivalAirport: {
                code: formArrivalAirport,
                city: airports.find(a => a.code === formArrivalAirport)?.city || ""
              },
              departureTime: formDepartureTime,
              arrivalTime: formArrivalTime,
              date: formDate || new Date(),
              duration: formDuration,
              price: Number(formPrice),
              seatsAvailable: Number(formSeatsAvailable),
              aircraft: formAircraft,
              status: formStatus as any,
              amenities: formAmenities
            };
          }
          return f;
        });
        
        setFlights(updatedFlights);
        toast({
          title: "Flight updated",
          description: `Flight ${formFlightNumber} has been successfully updated.`,
        });
      } else {
        // Add new flight
        const newFlight: FlightType = {
          id: `FL${Date.now()}`,
          flightNumber: formFlightNumber,
          departureAirport: {
            code: formDepartureAirport,
            city: airports.find(a => a.code === formDepartureAirport)?.city || ""
          },
          arrivalAirport: {
            code: formArrivalAirport,
            city: airports.find(a => a.code === formArrivalAirport)?.city || ""
          },
          departureTime: formDepartureTime,
          arrivalTime: formArrivalTime,
          date: formDate || new Date(),
          duration: formDuration,
          price: Number(formPrice),
          seatsAvailable: Number(formSeatsAvailable),
          aircraft: formAircraft,
          status: formStatus as any,
          amenities: formAmenities
        };
        
        setFlights([newFlight, ...flights]);
        toast({
          title: "Flight added",
          description: `Flight ${formFlightNumber} has been successfully added.`,
        });
      }
      
      setIsLoading(false);
      setShowFlightDialog(false);
    }, 1000);
  };

  const toggleAmenity = (amenity: string) => {
    if (formAmenities.includes(amenity)) {
      setFormAmenities(formAmenities.filter(a => a !== amenity));
    } else {
      setFormAmenities([...formAmenities, amenity]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "delayed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Flight Management</h1>
          <p className="text-gray-600">Add, edit, and manage all flights</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleAddFlight}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Flight
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search flights..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {flightStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button 
                  variant="ghost" 
                  onClick={resetFilters}
                  disabled={!searchTerm && !dateFilter && !statusFilter}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Flight List */}
      <Tabs 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Flights</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="on-time">On Time</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {currentTab === "all" ? "All Flights" : 
                    currentTab.charAt(0).toUpperCase() + currentTab.slice(1) + " Flights"
                  }
                </span>
                <Badge variant="outline">{filteredFlights.length} flight(s)</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-gray-600">Loading flights...</p>
                  </div>
                </div>
              ) : (
                <>
                  {filteredFlights.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Flight #</th>
                            <th className="px-6 py-3">Route</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Aircraft</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Seats</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFlights.map((flight) => (
                            <tr key={flight.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium">
                                <div className="flex items-center">
                                  <Plane className="h-4 w-4 text-primary mr-2" />
                                  {flight.flightNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {flight.departureAirport.code} → {flight.arrivalAirport.code}
                              </td>
                              <td className="px-6 py-4">
                                {format(new Date(flight.date), "dd MMM yyyy")}
                              </td>
                              <td className="px-6 py-4">
                                {flight.departureTime} - {flight.arrivalTime}
                              </td>
                              <td className="px-6 py-4">
                                {flight.aircraft}
                              </td>
                              <td className="px-6 py-4">
                                ${flight.price}
                              </td>
                              <td className="px-6 py-4">
                                {flight.seatsAvailable}
                              </td>
                              <td className="px-6 py-4">
                                <Badge 
                                  variant="outline" 
                                  className={cn(getStatusColor(flight.status))}
                                >
                                  {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon" title="Change Status">
                                        <Clock className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Change Flight Status</DialogTitle>
                                        <DialogDescription>
                                          Update the status for flight {flight.flightNumber}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {flightStatuses.map((status) => (
                                          <div 
                                            key={status}
                                            className={cn(
                                              "flex items-center p-3 rounded-md border cursor-pointer",
                                              flight.status === status ? "border-primary bg-primary/5" : ""
                                            )}
                                            onClick={() => handleFlightStatusChange(flight, status)}
                                          >
                                            {status === "on-time" && <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />}
                                            {status === "delayed" && <Clock className="h-5 w-5 text-amber-600 mr-2" />}
                                            {status === "cancelled" && <XCircle className="h-5 w-5 text-red-600 mr-2" />}
                                            {status === "scheduled" && <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />}
                                            {status === "completed" && <CheckCircle2 className="h-5 w-5 text-gray-600 mr-2" />}
                                            <span className="font-medium">
                                              {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button type="button" variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handleEditFlight(flight)}
                                    title="Edit Flight"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handleDeleteFlight(flight)}
                                    title="Delete Flight"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No flights found matching your criteria.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Flight Dialog */}
      <Dialog open={showFlightDialog} onOpenChange={setShowFlightDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? `Update the information for flight ${flightToEdit?.flightNumber}` 
                : "Fill in the details to add a new flight to the system"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveFlight}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number*</Label>
                <Input 
                  id="flightNumber" 
                  value={formFlightNumber} 
                  onChange={(e) => setFormFlightNumber(e.target.value)} 
                  placeholder="e.g. SK1234" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aircraft">Aircraft*</Label>
                <Select value={formAircraft} onValueChange={setFormAircraft} required>
                  <SelectTrigger id="aircraft">
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircrafts.map((aircraft) => (
                      <SelectItem key={aircraft} value={aircraft}>
                        {aircraft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departureAirport">From*</Label>
                <Select value={formDepartureAirport} onValueChange={setFormDepartureAirport} required>
                  <SelectTrigger id="departureAirport">
                    <SelectValue placeholder="Select departure airport" />
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
              
              <div className="space-y-2">
                <Label htmlFor="arrivalAirport">To*</Label>
                <Select value={formArrivalAirport} onValueChange={setFormArrivalAirport} required>
                  <SelectTrigger id="arrivalAirport">
                    <SelectValue placeholder="Select arrival airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem 
                        key={airport.code} 
                        value={airport.code}
                        disabled={airport.code === formDepartureAirport}
                      >
                        {airport.city} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formDate ? format(formDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={setFormDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select value={formStatus} onValueChange={setFormStatus} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {flightStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time*</Label>
                <Input 
                  id="departureTime" 
                  value={formDepartureTime} 
                  onChange={(e) => setFormDepartureTime(e.target.value)} 
                  placeholder="e.g. 09:30" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time*</Label>
                <Input 
                  id="arrivalTime" 
                  value={formArrivalTime} 
                  onChange={(e) => setFormArrivalTime(e.target.value)} 
                  placeholder="e.g. 11:45" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration*</Label>
                <Input 
                  id="duration" 
                  value={formDuration} 
                  onChange={(e) => setFormDuration(e.target.value)} 
                  placeholder="e.g. 2h 15m" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)*</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={formPrice} 
                  onChange={(e) => setFormPrice(e.target.value)} 
                  placeholder="e.g. 299" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seatsAvailable">Available Seats*</Label>
                <Input 
                  id="seatsAvailable" 
                  type="number" 
                  value={formSeatsAvailable} 
                  onChange={(e) => setFormSeatsAvailable(e.target.value)} 
                  placeholder="e.g. 120" 
                  required 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {["WiFi", "Meals", "Entertainment", "USB Power", "Music"].map((amenity) => (
                    <div 
                      key={amenity} 
                      className="flex items-center space-x-2"
                    >
                      <Checkbox 
                        id={`amenity-${amenity}`} 
                        checked={formAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowFlightDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </div>
                ) : (
                  <>{isEditing ? "Update Flight" : "Add Flight"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFlights;
