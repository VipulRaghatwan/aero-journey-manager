
import { FlightType } from "@/components/flights/FlightCard";

// Generate flights for the next 30 days
const generateFlights = (): FlightType[] => {
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

  const statuses = ["scheduled", "on-time", "delayed", "cancelled", "completed"];
  const amenities = ["WiFi", "Meals", "Entertainment", "USB Power", "Music"];

  const flights: FlightType[] = [];

  // Generate flights for the next 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);

    // Generate 10-15 flights per day
    const flightsPerDay = Math.floor(Math.random() * 5) + 10;
    
    for (let i = 0; i < flightsPerDay; i++) {
      // Randomly select departure and arrival airports
      let departureIndex = Math.floor(Math.random() * airports.length);
      let arrivalIndex;
      do {
        arrivalIndex = Math.floor(Math.random() * airports.length);
      } while (arrivalIndex === departureIndex);

      const departureAirport = airports[departureIndex];
      const arrivalAirport = airports[arrivalIndex];

      // Random departure time between 5:00 AM and 11:00 PM
      const departureHour = Math.floor(Math.random() * 18) + 5;
      const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
      
      // Format departure time
      const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
      
      // Random flight duration between 1 and 15 hours
      let durationHours;
      if (Math.random() < 0.7) {
        // 70% chance of a flight between 1-5 hours
        durationHours = Math.floor(Math.random() * 4) + 1;
      } else {
        // 30% chance of a longer flight between 6-15 hours
        durationHours = Math.floor(Math.random() * 10) + 6;
      }
      
      const durationMinutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
      const duration = `${durationHours}h ${durationMinutes > 0 ? durationMinutes + 'm' : ''}`;

      // Calculate arrival time
      let arrivalHour = departureHour + durationHours;
      let arrivalMinute = departureMinute + durationMinutes;
      
      // Handle overflow
      if (arrivalMinute >= 60) {
        arrivalHour += 1;
        arrivalMinute -= 60;
      }
      
      // Handle 24-hour overflow
      if (arrivalHour >= 24) {
        arrivalHour -= 24;
      }
      
      // Format arrival time
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;

      // Random price between $100 and $2000
      let price;
      if (durationHours <= 3) {
        price = Math.floor(Math.random() * 300) + 100; // $100-$399
      } else if (durationHours <= 6) {
        price = Math.floor(Math.random() * 500) + 300; // $300-$799
      } else {
        price = Math.floor(Math.random() * 1200) + 800; // $800-$1999
      }

      // Random number of available seats
      const seatsAvailable = Math.floor(Math.random() * 50) + 1;

      // Random status
      let status;
      if (day === 0) {
        // Today's flights
        status = statuses[Math.floor(Math.random() * 4)]; // Exclude "completed"
      } else if (day < 0) {
        // Past flights
        status = "completed";
      } else {
        // Future flights
        status = "scheduled";
      }

      // 30% chance of having a stopover
      let stopover = undefined;
      if (Math.random() < 0.3 && durationHours > 3) {
        let stopoverAirportIndex;
        do {
          stopoverAirportIndex = Math.floor(Math.random() * airports.length);
        } while (
          stopoverAirportIndex === departureIndex || 
          stopoverAirportIndex === arrivalIndex
        );
        
        const stopoverDurationHours = Math.floor(Math.random() * 3) + 1;
        const stopoverDurationMinutes = Math.floor(Math.random() * 4) * 15;
        
        stopover = {
          airport: airports[stopoverAirportIndex].code,
          duration: `${stopoverDurationHours}h ${stopoverDurationMinutes > 0 ? stopoverDurationMinutes + 'm' : ''}`
        };
      }

      // Random flight amenities (2-5)
      const numAmenities = Math.floor(Math.random() * 4) + 2;
      const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
      const flightAmenities = shuffledAmenities.slice(0, numAmenities);

      flights.push({
        id: `FL${day}${i}${Math.floor(Math.random() * 1000)}`,
        flightNumber: `SK${Math.floor(Math.random() * 9000) + 1000}`,
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        departureTime,
        arrivalTime,
        date: new Date(date),
        duration,
        price,
        seatsAvailable,
        aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
        status: status as any,
        stopover,
        amenities: flightAmenities
      });
    }
  }

  return flights;
};

// Generate passenger bookings
const generateBookings = () => {
  const bookings = [];
  const flights = mockData.flights;
  
  for (let i = 0; i < 10; i++) {
    const flight = flights[Math.floor(Math.random() * flights.length)];
    
    bookings.push({
      id: `BK${Math.floor(Math.random() * 10000)}`,
      flightId: flight.id,
      flight: flight,
      passengerName: "John Doe",
      passengerEmail: "user@example.com",
      seatNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 30) + 1}`,
      bookingDate: new Date(),
      status: Math.random() > 0.2 ? "confirmed" : "cancelled",
      paymentStatus: Math.random() > 0.1 ? "paid" : "pending",
    });
  }

  return bookings;
};

// Generate passenger data
const generatePassengers = () => {
  const passengers = [];
  const titles = ["Mr", "Mrs", "Ms", "Dr"];
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "Robert", "Lisa"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson"];
  
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    passengers.push({
      id: `P${Math.floor(Math.random() * 10000)}`,
      title,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
      address: "123 Sample Street, City, Country",
      bookingCount: Math.floor(Math.random() * 10),
      totalSpent: Math.floor(Math.random() * 10000),
      frequentFlyerNumber: Math.random() > 0.5 ? `FF${Math.floor(Math.random() * 100000)}` : null,
    });
  }

  return passengers;
};

// Mock data object
const mockData = {
  flights: generateFlights(),
  get bookings() {
    return generateBookings();
  },
  get passengers() {
    return generatePassengers();
  }
};

export default mockData;
