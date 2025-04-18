
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlightCard, { FlightType } from "@/components/flights/FlightCard";

interface PassengerFormProps {
  passenger: {
    name: string;
    email: string;
    phone: string;
    passportNumber: string;
  };
  setPassenger: (passenger: any) => void;
  seatSelection: string;
  setSeatSelection: (seat: string) => void;
  availableSeats: string[];
  errors: any;
  selectedFlight: FlightType;
  handleBooking: () => void;
  loading: boolean;
  setCurrentTab: (tab: string) => void;
}

const PassengerForm = ({
  passenger,
  setPassenger,
  seatSelection,
  setSeatSelection,
  availableSeats,
  errors,
  selectedFlight,
  handleBooking,
  loading,
  setCurrentTab
}: PassengerFormProps) => {
  return (
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
                onChange={(e) => setPassenger({...passenger, phone: e.target.value})}
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
                onChange={(e) => setPassenger({...passenger, passportNumber: e.target.value})}
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
                    onClick={() => setSeatSelection(seat)}
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
  );
};

export default PassengerForm;
