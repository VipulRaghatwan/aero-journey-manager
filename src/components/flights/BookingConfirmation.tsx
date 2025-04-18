
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FlightType } from "@/components/flights/FlightCard";

interface BookingConfirmationProps {
  selectedFlight: FlightType;
  passenger: {
    name: string;
    email: string;
    phone: string;
  };
  seatSelection: string;
  onBookAnother: () => void;
}

const BookingConfirmation = ({
  selectedFlight,
  passenger,
  seatSelection,
  onBookAnother
}: BookingConfirmationProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Booking Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Your flight is booked!
          </h3>
          <p className="text-green-700">
            Thank you for booking with us. Your booking details are below.
          </p>
        </div>
        
        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Passenger Details</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{passenger.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{passenger.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{passenger.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seat:</span>
                <span className="font-medium">{seatSelection}</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Flight Details</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight Number:</span>
                <span className="font-medium">{selectedFlight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {format(new Date(selectedFlight.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span className="font-medium">
                  {selectedFlight.departureAirport.city} ({selectedFlight.departureTime})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arrival:</span>
                <span className="font-medium">
                  {selectedFlight.arrivalAirport.city} ({selectedFlight.arrivalTime})
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/my-bookings")}
            className="flex-1"
          >
            View All Bookings
          </Button>
          <Button 
            onClick={onBookAnother}
            className="flex-1"
          >
            Book Another Flight
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmation;
