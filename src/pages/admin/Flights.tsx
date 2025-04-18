
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  Plane, 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Clock, 
  Calendar, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { FlightType } from "@/components/flights/FlightCard";
import dbService from "@/services/dbService";

const AdminFlights = () => {
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    departureAirportCode: "",
    departureAirportCity: "",
    arrivalAirportCode: "",
    arrivalAirportCity: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    price: "",
    seatsAvailable: "",
    aircraft: "",
    status: "scheduled"
  });
  
  const [editingFlight, setEditingFlight] = useState<FlightType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadFlights();
  }, []);
  
  useEffect(() => {
    filterFlights();
  }, [searchQuery, statusFilter, flights]);
  
  const loadFlights = () => {
    setLoading(true);
    dbService.getFlights()
      .then(data => {
        setFlights(data);
        setFilteredFlights(data);
      })
      .catch(error => {
        console.error("Error loading flights:", error);
        toast({
          title: "Error",
          description: "Failed to load flights. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };
  
  const filterFlights = () => {
    let filtered = [...flights];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(flight => flight.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(flight => 
        flight.flightNumber.toLowerCase().includes(query) ||
        flight.departureAirport.code.toLowerCase().includes(query) ||
        flight.departureAirport.city.toLowerCase().includes(query) ||
        flight.arrivalAirport.code.toLowerCase().includes(query) ||
        flight.arrivalAirport.city.toLowerCase().includes(query)
      );
    }
    
    setFilteredFlights(filtered);
  };
  
  const handleAddFlight = () => {
    setLoading(true);
    
    const flightData = {
      flightNumber: newFlight.flightNumber,
      departureAirport: {
        code: newFlight.departureAirportCode,
        city: newFlight.departureAirportCity
      },
      arrivalAirport: {
        code: newFlight.arrivalAirportCode,
        city: newFlight.arrivalAirportCity
      },
      departureTime: newFlight.departureTime,
      arrivalTime: newFlight.arrivalTime,
      date: new Date(newFlight.date),
      duration: calculateDuration(newFlight.departureTime, newFlight.arrivalTime),
      price: parseFloat(newFlight.price),
      seatsAvailable: parseInt(newFlight.seatsAvailable),
      aircraft: newFlight.aircraft,
      status: newFlight.status,
      amenities: ["WiFi", "Entertainment", "Meals"]
    };
    
    dbService.createFlight(flightData)
      .then(() => {
        toast({
          title: "Success",
          description: "Flight has been added successfully.",
        });
        loadFlights();
        resetNewFlightForm();
        setIsNewDialogOpen(false);
      })
      .catch(error => {
        console.error("Error adding flight:", error);
        toast({
          title: "Error",
          description: "Failed to add flight. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };
  
  const handleEditFlight = () => {
    if (!editingFlight) return;
    
    setLoading(true);
    
    dbService.updateFlight(editingFlight.id, editingFlight)
      .then(() => {
        toast({
          title: "Success",
          description: "Flight has been updated successfully.",
        });
        loadFlights();
        setEditingFlight(null);
        setIsEditDialogOpen(false);
      })
      .catch(error => {
        console.error("Error updating flight:", error);
        toast({
          title: "Error",
          description: "Failed to update flight. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };
  
  const handleDeleteFlight = () => {
    if (!flightToDelete) return;
    
    setLoading(true);
    
    dbService.deleteFlight(flightToDelete)
      .then(success => {
        if (success) {
          toast({
            title: "Success",
            description: "Flight has been deleted successfully.",
          });
          loadFlights();
        } else {
          toast({
            title: "Error",
            description: "Failed to delete flight. It may not exist or is referenced by bookings.",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        console.error("Error deleting flight:", error);
        toast({
          title: "Error",
          description: "Failed to delete flight. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setFlightToDelete(null);
        setIsDeleteDialogOpen(false);
        setLoading(false);
      });
  };
  
  const resetNewFlightForm = () => {
    setNewFlight({
      flightNumber: "",
      departureAirportCode: "",
      departureAirportCity: "",
      arrivalAirportCode: "",
      arrivalAirportCity: "",
      departureTime: "",
      arrivalTime: "",
      date: "",
      price: "",
      seatsAvailable: "",
      aircraft: "",
      status: "scheduled"
    });
  };
  
  const calculateDuration = (departureTime: string, arrivalTime: string) => {
    // This is a simplified duration calculation
    const [departureHour, departureMinute] = departureTime.split(':').map(Number);
    const [arrivalHour, arrivalMinute] = arrivalTime.split(':').map(Number);
    
    let hourDiff = arrivalHour - departureHour;
    let minuteDiff = arrivalMinute - departureMinute;
    
    if (minuteDiff < 0) {
      hourDiff--;
      minuteDiff += 60;
    }
    
    if (hourDiff < 0) {
      hourDiff += 24;
    }
    
    return `${hourDiff}h ${minuteDiff}m`;
  };
  
  const getStatusBadge = (status: string) => {
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
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flight Management</h1>
          <p className="text-gray-600">Manage flight schedules, routes, and details</p>
        </div>
        
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Add New Flight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Flight</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new flight to the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="flight-number">Flight Number</Label>
                <Input 
                  id="flight-number" 
                  value={newFlight.flightNumber}
                  onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                  placeholder="e.g. SW123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aircraft">Aircraft</Label>
                <Input 
                  id="aircraft" 
                  value={newFlight.aircraft}
                  onChange={(e) => setNewFlight({...newFlight, aircraft: e.target.value})}
                  placeholder="e.g. Boeing 737"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departure-code">Departure Airport Code</Label>
                <Input 
                  id="departure-code" 
                  value={newFlight.departureAirportCode}
                  onChange={(e) => setNewFlight({...newFlight, departureAirportCode: e.target.value})}
                  placeholder="e.g. JFK"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departure-city">Departure City</Label>
                <Input 
                  id="departure-city" 
                  value={newFlight.departureAirportCity}
                  onChange={(e) => setNewFlight({...newFlight, departureAirportCity: e.target.value})}
                  placeholder="e.g. New York"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival-code">Arrival Airport Code</Label>
                <Input 
                  id="arrival-code" 
                  value={newFlight.arrivalAirportCode}
                  onChange={(e) => setNewFlight({...newFlight, arrivalAirportCode: e.target.value})}
                  placeholder="e.g. LAX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival-city">Arrival City</Label>
                <Input 
                  id="arrival-city" 
                  value={newFlight.arrivalAirportCity}
                  onChange={(e) => setNewFlight({...newFlight, arrivalAirportCity: e.target.value})}
                  placeholder="e.g. Los Angeles"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departure-time">Departure Time</Label>
                <Input 
                  id="departure-time" 
                  type="time"
                  value={newFlight.departureTime}
                  onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival-time">Arrival Time</Label>
                <Input 
                  id="arrival-time" 
                  type="time"
                  value={newFlight.arrivalTime}
                  onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newFlight.date}
                  onChange={(e) => setNewFlight({...newFlight, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newFlight.status}
                  onValueChange={(value) => setNewFlight({...newFlight, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="on-time">On Time</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={newFlight.price}
                  onChange={(e) => setNewFlight({...newFlight, price: e.target.value})}
                  placeholder="e.g. 299.99"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats">Available Seats</Label>
                <Input 
                  id="seats" 
                  type="number"
                  value={newFlight.seatsAvailable}
                  onChange={(e) => setNewFlight({...newFlight, seatsAvailable: e.target.value})}
                  placeholder="e.g. 120"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFlight} disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                    Saving...
                  </span>
                ) : (
                  "Add Flight"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Flight List</CardTitle>
          <CardDescription>
            View and manage all flights in the system
          </CardDescription>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by flight number, airport or city..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flights</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="on-time">On Time</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading && filteredFlights.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredFlights.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-380px)] w-full rounded-md border">
              <div className="w-full">
                <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-muted/50 text-sm font-medium">
                  <div>Flight</div>
                  <div>Route</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Seats/Price</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                <div className="divide-y">
                  {filteredFlights.map((flight) => (
                    <div key={flight.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 hidden md:flex">
                          <Plane className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{flight.flightNumber}</div>
                          <div className="text-sm text-gray-500">{flight.aircraft}</div>
                        </div>
                      </div>
                      
                      <div className="md:flex flex-col justify-center">
                        <div className="flex items-center">
                          <span className="font-medium">{flight.departureAirport.code}</span>
                          <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                          <span className="font-medium">{flight.arrivalAirport.code}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.departureAirport.city} to {flight.arrivalAirport.city}
                        </div>
                      </div>
                      
                      <div className="md:flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2 hidden md:inline" />
                        <span>{format(new Date(flight.date), "MMM d, yyyy")}</span>
                      </div>
                      
                      <div className="md:flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2 hidden md:inline" />
                        <div>
                          <div>
                            {flight.departureTime} - {flight.arrivalTime}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:flex flex-col justify-center">
                        <div className="font-medium">${flight.price}</div>
                        <div className="text-sm text-gray-500">
                          {flight.seatsAvailable} seat{flight.seatsAvailable !== 1 && 's'} left
                        </div>
                      </div>
                      
                      <div className="md:flex items-center">
                        {getStatusBadge(flight.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog open={isEditDialogOpen && editingFlight?.id === flight.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingFlight(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingFlight(flight)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            {editingFlight && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Edit Flight</DialogTitle>
                                  <DialogDescription>
                                    Update flight details for {editingFlight.flightNumber}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-flight-number">Flight Number</Label>
                                    <Input 
                                      id="edit-flight-number" 
                                      value={editingFlight.flightNumber}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        flightNumber: e.target.value
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-aircraft">Aircraft</Label>
                                    <Input 
                                      id="edit-aircraft" 
                                      value={editingFlight.aircraft}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        aircraft: e.target.value
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-departure-time">Departure Time</Label>
                                    <Input 
                                      id="edit-departure-time" 
                                      type="time"
                                      value={editingFlight.departureTime}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        departureTime: e.target.value
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-arrival-time">Arrival Time</Label>
                                    <Input 
                                      id="edit-arrival-time" 
                                      type="time"
                                      value={editingFlight.arrivalTime}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        arrivalTime: e.target.value
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input 
                                      id="edit-date" 
                                      type="date"
                                      value={format(new Date(editingFlight.date), "yyyy-MM-dd")}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        date: new Date(e.target.value)
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      value={editingFlight.status}
                                      onValueChange={(value) => setEditingFlight({
                                        ...editingFlight, 
                                        status: value
                                      })}
                                    >
                                      <SelectTrigger id="edit-status">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="on-time">On Time</SelectItem>
                                        <SelectItem value="delayed">Delayed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-price">Price ($)</Label>
                                    <Input 
                                      id="edit-price" 
                                      type="number"
                                      value={editingFlight.price}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        price: parseFloat(e.target.value)
                                      })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-seats">Available Seats</Label>
                                    <Input 
                                      id="edit-seats" 
                                      type="number"
                                      value={editingFlight.seatsAvailable}
                                      onChange={(e) => setEditingFlight({
                                        ...editingFlight, 
                                        seatsAvailable: parseInt(e.target.value)
                                      })}
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {
                                    setEditingFlight(null);
                                    setIsEditDialogOpen(false);
                                  }}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditFlight} disabled={loading}>
                                    {loading ? (
                                      <span className="flex items-center">
                                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                                        Updating...
                                      </span>
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog open={isDeleteDialogOpen && flightToDelete === flight.id} onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setFlightToDelete(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => setFlightToDelete(flight.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete flight {flight.flightNumber}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <div className="bg-muted p-3 rounded-md space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Flight Number:</span>
                                  <span className="font-medium">{flight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Route:</span>
                                  <span className="font-medium">
                                    {flight.departureAirport.code} to {flight.arrivalAirport.code}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Date:</span>
                                  <span className="font-medium">
                                    {format(new Date(flight.date), "MMM d, yyyy")}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center text-amber-600 bg-amber-50 p-3 rounded-md">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <p className="text-sm">
                                  Deleting this flight will also remove all associated bookings.
                                </p>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                setFlightToDelete(null);
                                setIsDeleteDialogOpen(false);
                              }}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteFlight} disabled={loading}>
                                {loading ? (
                                  <span className="flex items-center">
                                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                                    Deleting...
                                  </span>
                                ) : (
                                  "Delete Flight"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center">
                {searchQuery || statusFilter !== "all" ? (
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                ) : (
                  <Plane className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchQuery || statusFilter !== "all" ? "No flights found" : "No flights available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first flight to get started"
                }
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => setIsNewDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Flight
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFlights;
