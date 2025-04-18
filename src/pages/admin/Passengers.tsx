
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Users, 
  Search, 
  User, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Plane
} from "lucide-react";
import mockData from "@/services/mockData";

interface Passenger {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bookingCount: number;
  totalSpent: number;
  frequentFlyerNumber: string | null;
}

const AdminPassengers = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassengerDialog, setShowPassengerDialog] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formFrequentFlyerNumber, setFormFrequentFlyerNumber] = useState("");

  // Fetch passengers on component mount
  useEffect(() => {
    setPassengers(mockData.passengers);
  }, []);

  // Filter passengers based on search term
  const filteredPassengers = passengers.filter(passenger => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      passenger.firstName.toLowerCase().includes(searchTermLower) ||
      passenger.lastName.toLowerCase().includes(searchTermLower) ||
      passenger.email.toLowerCase().includes(searchTermLower) ||
      (passenger.frequentFlyerNumber && passenger.frequentFlyerNumber.toLowerCase().includes(searchTermLower))
    );
  });

  const handleViewPassenger = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setIsEditing(false);
    
    // Set form values
    setFormTitle(passenger.title);
    setFormFirstName(passenger.firstName);
    setFormLastName(passenger.lastName);
    setFormEmail(passenger.email);
    setFormPhone(passenger.phone);
    setFormAddress(passenger.address);
    setFormFrequentFlyerNumber(passenger.frequentFlyerNumber || "");
    
    setShowPassengerDialog(true);
  };

  const handleEditPassenger = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setIsEditing(true);
    
    // Set form values
    setFormTitle(passenger.title);
    setFormFirstName(passenger.firstName);
    setFormLastName(passenger.lastName);
    setFormEmail(passenger.email);
    setFormPhone(passenger.phone);
    setFormAddress(passenger.address);
    setFormFrequentFlyerNumber(passenger.frequentFlyerNumber || "");
    
    setShowPassengerDialog(true);
  };

  const handleDeletePassenger = (passenger: Passenger) => {
    if (window.confirm(`Are you sure you want to delete passenger ${passenger.firstName} ${passenger.lastName}?`)) {
      // Simulate API call
      setIsLoading(true);
      
      setTimeout(() => {
        setPassengers(passengers.filter(p => p.id !== passenger.id));
        setIsLoading(false);
        
        toast({
          title: "Passenger deleted",
          description: `Passenger ${passenger.firstName} ${passenger.lastName} has been successfully deleted.`,
        });
      }, 500);
    }
  };

  const handleSavePassenger = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPassenger) return;
    
    // Validate form
    if (!formFirstName || !formLastName || !formEmail) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedPassengers = passengers.map(p => {
        if (p.id === selectedPassenger.id) {
          return {
            ...p,
            title: formTitle,
            firstName: formFirstName,
            lastName: formLastName,
            email: formEmail,
            phone: formPhone,
            address: formAddress,
            frequentFlyerNumber: formFrequentFlyerNumber || null
          };
        }
        return p;
      });
      
      setPassengers(updatedPassengers);
      setIsLoading(false);
      setShowPassengerDialog(false);
      
      toast({
        title: "Passenger updated",
        description: `Passenger ${formFirstName} ${formLastName} has been successfully updated.`,
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Passenger Management</h1>
          <p className="text-gray-600">View and manage passenger information</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search passengers..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passenger List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Passenger List</span>
            <Badge variant="outline">{filteredPassengers.length} passenger(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-600">Loading passengers...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredPassengers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Phone</th>
                        <th className="px-6 py-3">Bookings</th>
                        <th className="px-6 py-3">Total Spent</th>
                        <th className="px-6 py-3">Frequent Flyer</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPassengers.map((passenger) => (
                        <tr key={passenger.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                                <User className="h-4 w-4" />
                              </div>
                              {passenger.title} {passenger.firstName} {passenger.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {passenger.email}
                          </td>
                          <td className="px-6 py-4">
                            {passenger.phone}
                          </td>
                          <td className="px-6 py-4">
                            {passenger.bookingCount}
                          </td>
                          <td className="px-6 py-4">
                            ${passenger.totalSpent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            {passenger.frequentFlyerNumber ? (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                {passenger.frequentFlyerNumber}
                              </Badge>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleViewPassenger(passenger)}
                                title="View Passenger"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEditPassenger(passenger)}
                                title="Edit Passenger"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleDeletePassenger(passenger)}
                                title="Delete Passenger"
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
                  <p className="text-gray-500">No passengers found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View/Edit Passenger Dialog */}
      <Dialog open={showPassengerDialog} onOpenChange={setShowPassengerDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Passenger" : "Passenger Details"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update passenger information" 
                : "View detailed passenger information"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSavePassenger}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={formTitle} 
                    onChange={(e) => setFormTitle(e.target.value)} 
                    placeholder="Mr/Mrs/Ms" 
                    readOnly={!isEditing}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input 
                    id="firstName" 
                    value={formFirstName} 
                    onChange={(e) => setFormFirstName(e.target.value)} 
                    readOnly={!isEditing}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input 
                  id="lastName" 
                  value={formLastName} 
                  onChange={(e) => setFormLastName(e.target.value)} 
                  readOnly={!isEditing}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    value={formEmail} 
                    onChange={(e) => setFormEmail(e.target.value)} 
                    readOnly={!isEditing}
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="phone" 
                    value={formPhone} 
                    onChange={(e) => setFormPhone(e.target.value)} 
                    readOnly={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="address" 
                    value={formAddress} 
                    onChange={(e) => setFormAddress(e.target.value)} 
                    readOnly={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequentFlyerNumber">Frequent Flyer Number</Label>
                <div className="relative">
                  <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="frequentFlyerNumber" 
                    value={formFrequentFlyerNumber} 
                    onChange={(e) => setFormFrequentFlyerNumber(e.target.value)} 
                    readOnly={!isEditing}
                    className="pl-10"
                    placeholder={!formFrequentFlyerNumber && !isEditing ? "Not enrolled" : ""}
                  />
                </div>
              </div>
              
              {selectedPassenger && !isEditing && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-lg font-medium">{selectedPassenger.bookingCount}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-lg font-medium">${selectedPassenger.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              {isEditing ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPassengerDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPassengerDialog(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPassengers;
