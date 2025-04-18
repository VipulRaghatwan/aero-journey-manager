
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  Bell, 
  Shield, 
  RefreshCw, 
  CreditCard 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  
  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    }, 1500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Your new password and confirmation password do not match.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
    }, 1500);
  };

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been successfully updated.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <UserCircle className="w-16 h-16" />
                </div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                <Button variant="outline" size="sm">Change photo</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member since</span>
                  <span>Jan 15, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SkyMiles</span>
                  <span>2,450 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total bookings</span>
                  <span>8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
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
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security options
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Two-factor authentication</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                          Updating...
                        </div>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you want to be notified
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateNotifications}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                          </div>
                          <p className="text-sm text-gray-500">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Notification Types</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="booking-updates">Booking Updates</Label>
                            <p className="text-sm text-gray-500">
                              Flight status changes, gate updates, etc.
                            </p>
                          </div>
                          <Switch 
                            id="booking-updates" 
                            checked={bookingUpdates} 
                            onCheckedChange={setBookingUpdates} 
                            disabled={!emailNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="price-alerts">Price Alerts</Label>
                            <p className="text-sm text-gray-500">
                              Notifications when prices drop for your saved routes
                            </p>
                          </div>
                          <Switch 
                            id="price-alerts" 
                            checked={priceAlerts} 
                            onCheckedChange={setPriceAlerts} 
                            disabled={!emailNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="special-offers">Special Offers</Label>
                            <p className="text-sm text-gray-500">
                              Promotional deals and exclusive offers
                            </p>
                          </div>
                          <Switch 
                            id="special-offers" 
                            checked={specialOffers} 
                            onCheckedChange={setSpecialOffers} 
                            disabled={!emailNotifications}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Payment Methods</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
                          <div className="flex items-center">
                            <CreditCard className="h-10 w-10 text-gray-500 mr-3" />
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-500">Expires 12/25</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                          Saving...
                        </div>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
