
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plane, 
  Clock, 
  ArrowRight, 
  CalendarDays, 
  Circle, 
  Wifi, 
  Utensils, 
  Music,
  PlaySquare
} from "lucide-react";
import { format } from "date-fns";

export interface FlightType {
  id: string;
  flightNumber: string;
  departureAirport: {
    code: string;
    city: string;
  };
  arrivalAirport: {
    code: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  date: Date;
  duration: string;
  price: number;
  seatsAvailable: number;
  aircraft: string;
  status: "scheduled" | "on-time" | "delayed" | "cancelled" | "completed";
  stopover?: {
    airport: string;
    duration: string;
  };
  amenities: string[];
}

interface FlightCardProps {
  flight: FlightType;
  isBookable?: boolean;
}

const FlightCard = ({ flight, isBookable = false }: FlightCardProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBookFlight = () => {
    if (isAuthenticated) {
      navigate(`/book-flight/${flight.id}`);
    } else {
      navigate("/login", { state: { redirectTo: `/book-flight/${flight.id}` } });
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.replace(/:/g, ":");
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

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "meals":
        return <Utensils className="h-4 w-4" />;
      case "entertainment":
        return <PlaySquare className="h-4 w-4" />;
      case "music":
        return <Music className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Flight info section */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-8 mb-4 lg:mb-0">
            {/* Airline and flight number */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <Plane className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">{flight.flightNumber}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">{flight.aircraft}</span>
            </div>

            {/* Route/Time info */}
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{formatTime(flight.departureTime)}</span>
                <span className="text-sm font-medium">{flight.departureAirport.code}</span>
                <span className="text-xs text-gray-500">{flight.departureAirport.city}</span>
              </div>

              <div className="flex flex-col items-center mx-2">
                <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                <div className="relative w-20 md:w-32">
                  <div className="border-t border-gray-300 w-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                  {flight.stopover && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                    </div>
                  )}
                </div>
                {flight.stopover && (
                  <div className="text-xs text-gray-500 mt-1">
                    via {flight.stopover.airport}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{formatTime(flight.arrivalTime)}</span>
                <span className="text-sm font-medium">{flight.arrivalAirport.code}</span>
                <span className="text-xs text-gray-500">{flight.arrivalAirport.city}</span>
              </div>
            </div>
          </div>

          {/* Price and booking section */}
          <div className="flex flex-col items-start lg:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {format(flight.date, "dd MMM yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(flight.status)} text-white`}>
                {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
              </Badge>
              <span className="text-sm">
                {flight.seatsAvailable} seat{flight.seatsAvailable !== 1 ? 's' : ''} left
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary">
                ${flight.price}
              </span>
              <span className="text-sm text-gray-500 ml-1">/ person</span>
            </div>
            
            {isBookable && (
              <Button 
                onClick={handleBookFlight} 
                disabled={flight.status === "cancelled" || flight.seatsAvailable < 1}
                className="mt-2 w-full md:w-auto"
              >
                Book Now
              </Button>
            )}
          </div>
        </div>

        {/* Expandable details section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            className="flex items-center text-sm text-gray-500 hover:text-primary w-full justify-start"
            onClick={toggleExpand}
          >
            <span>{isExpanded ? "Hide details" : "Show details"}</span>
          </button>

          {isExpanded && (
            <div className="mt-4 animate-fade-in">
              {flight.stopover && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Stopover</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <p>
                      {flight.stopover.airport} - {flight.stopover.duration} layover
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-4">
                  {flight.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      {renderAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Flight Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Flight</p>
                    <p>{flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Aircraft</p>
                    <p>{flight.aircraft}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p>{flight.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Distance</p>
                    <p>Calculated based on airports</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
