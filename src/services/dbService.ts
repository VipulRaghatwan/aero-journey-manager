
// This is a simulated database service since we can't connect to a real MySQL database in this environment
// In a real application, this would be replaced with actual database calls

import mockData from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Create a copy of the mock data to simulate a database
let db = {
  users: [...mockData.users],
  flights: [...mockData.flights],
  bookings: [...mockData.bookings],
  airports: [...mockData.airports]
};

export const dbService = {
  // User operations
  getUsers: () => {
    return Promise.resolve([...db.users]);
  },
  
  getUserById: (id: string) => {
    const user = db.users.find(user => user.id === id);
    return Promise.resolve(user ? { ...user } : null);
  },
  
  getUserByEmail: (email: string) => {
    const user = db.users.find(user => user.email === email);
    return Promise.resolve(user ? { ...user } : null);
  },
  
  createUser: (userData: any) => {
    const newUser = {
      id: uuidv4(),
      ...userData,
      role: 'user',
      createdAt: new Date()
    };
    db.users.push(newUser);
    return Promise.resolve({ ...newUser });
  },
  
  updateUser: (id: string, userData: any) => {
    const index = db.users.findIndex(user => user.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedUser = { ...db.users[index], ...userData };
    db.users[index] = updatedUser;
    return Promise.resolve({ ...updatedUser });
  },
  
  deleteUser: (id: string) => {
    const index = db.users.findIndex(user => user.id === id);
    if (index === -1) return Promise.resolve(false);
    
    db.users.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Flight operations
  getFlights: () => {
    return Promise.resolve([...db.flights]);
  },
  
  getFlightById: (id: string) => {
    const flight = db.flights.find(flight => flight.id === id);
    return Promise.resolve(flight ? { ...flight } : null);
  },
  
  createFlight: (flightData: any) => {
    const newFlight = {
      id: uuidv4(),
      ...flightData,
      createdAt: new Date()
    };
    db.flights.push(newFlight);
    return Promise.resolve({ ...newFlight });
  },
  
  updateFlight: (id: string, flightData: any) => {
    const index = db.flights.findIndex(flight => flight.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedFlight = { ...db.flights[index], ...flightData };
    db.flights[index] = updatedFlight;
    return Promise.resolve({ ...updatedFlight });
  },
  
  deleteFlight: (id: string) => {
    const index = db.flights.findIndex(flight => flight.id === id);
    if (index === -1) return Promise.resolve(false);
    
    db.flights.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Booking operations
  getBookings: () => {
    return Promise.resolve([...db.bookings]);
  },
  
  getBookingById: (id: string) => {
    const booking = db.bookings.find(booking => booking.id === id);
    return Promise.resolve(booking ? { ...booking } : null);
  },
  
  getBookingsByUser: (email: string) => {
    const bookings = db.bookings.filter(booking => booking.passengerEmail === email);
    return Promise.resolve([...bookings]);
  },
  
  createBooking: (bookingData: any) => {
    const newBooking = {
      id: uuidv4(),
      ...bookingData,
      bookingDate: new Date(),
      status: 'confirmed',
      paymentStatus: 'paid'
    };
    
    // Update flight seats available
    const flightIndex = db.flights.findIndex(flight => flight.id === bookingData.flightId);
    if (flightIndex !== -1) {
      db.flights[flightIndex].seatsAvailable -= 1;
    }
    
    db.bookings.push(newBooking);
    return Promise.resolve({ ...newBooking });
  },
  
  updateBooking: (id: string, bookingData: any) => {
    const index = db.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedBooking = { ...db.bookings[index], ...bookingData };
    db.bookings[index] = updatedBooking;
    
    // Handle seat changes if status changes to cancelled
    if (bookingData.status === 'cancelled' && db.bookings[index].status !== 'cancelled') {
      const flightIndex = db.flights.findIndex(flight => flight.id === db.bookings[index].flightId);
      if (flightIndex !== -1) {
        db.flights[flightIndex].seatsAvailable += 1;
      }
    }
    
    return Promise.resolve({ ...updatedBooking });
  },
  
  deleteBooking: (id: string) => {
    const index = db.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return Promise.resolve(false);
    
    // Return seats if booking is deleted
    const flightIndex = db.flights.findIndex(flight => flight.id === db.bookings[index].flightId);
    if (flightIndex !== -1 && db.bookings[index].status !== 'cancelled') {
      db.flights[flightIndex].seatsAvailable += 1;
    }
    
    db.bookings.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Search operations
  searchFlights: (criteria: any) => {
    let results = [...db.flights];
    
    if (criteria.from) {
      results = results.filter(flight => 
        flight.departureAirport.code === criteria.from
      );
    }
    
    if (criteria.to) {
      results = results.filter(flight => 
        flight.arrivalAirport.code === criteria.to
      );
    }
    
    if (criteria.date) {
      const searchDate = new Date(criteria.date);
      results = results.filter(flight => {
        const flightDate = new Date(flight.date);
        return flightDate.toDateString() === searchDate.toDateString();
      });
    }
    
    return Promise.resolve(results);
  },
  
  // Admin operations
  getFlightStatistics: () => {
    // Total flights per route
    const routeStats = {};
    db.flights.forEach(flight => {
      const route = `${flight.departureAirport.code}-${flight.arrivalAirport.code}`;
      if (!routeStats[route]) {
        routeStats[route] = 0;
      }
      routeStats[route]++;
    });
    
    // Total earnings
    const totalEarnings = db.bookings
      .filter(booking => booking.status !== 'cancelled')
      .reduce((total, booking) => {
        const flight = db.flights.find(f => f.id === booking.flightId);
        return total + (flight ? flight.price : 0);
      }, 0);
    
    // Passenger count
    const passengerCount = db.bookings.filter(booking => booking.status !== 'cancelled').length;
    
    // Most popular routes
    const popularRoutes = Object.entries(routeStats)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return Promise.resolve({
      totalFlights: db.flights.length,
      totalBookings: db.bookings.length,
      activeBookings: db.bookings.filter(b => b.status !== 'cancelled').length,
      totalEarnings,
      passengerCount,
      popularRoutes
    });
  }
};

export default dbService;
