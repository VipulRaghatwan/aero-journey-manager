
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FlightSearchForm from "@/components/flights/FlightSearchForm";
import { Plane, Shield, Clock, CreditCard, Star, MapPin } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90 z-10"></div>
        <div 
          className="relative h-[70vh] md:h-[80vh] bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')" 
          }}
        >
          <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Fly with Confidence and Comfort
              </h1>
              <p className="text-xl text-white mb-8">
                Discover a new way to travel with SkyWave Airlines. Book your next journey today.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
                <Link to="/flight-status">Check Flight Status</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Search Section */}
      <section className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-30 mb-16">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Find Your Flight</h2>
          <FlightSearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyWave</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Your safety is our top priority. Experience worry-free travel with our industry-leading safety measures.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Time Flights</h3>
              <p className="text-gray-600">We value your time. Our flights maintain one of the highest on-time performance ratings in the industry.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Plans change. Enjoy flexible booking options with easy modifications and cancellations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Destinations</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover our most sought-after destinations for your next adventure
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                city: "New York", 
                country: "United States", 
                image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
                price: 349
              },
              { 
                city: "Paris", 
                country: "France", 
                image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80",
                price: 429
              },
              { 
                city: "Tokyo", 
                country: "Japan", 
                image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1536&q=80",
                price: 599
              },
            ].map((destination, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-md hover-scale"
              >
                <img 
                  src={destination.image} 
                  alt={destination.city} 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{destination.city}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{destination.country}</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold">From ${destination.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/book-flight">Explore All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                rating: 5,
                comment: "The best airline experience I've ever had. The staff was incredibly attentive and the flight was smooth. Will definitely fly with SkyWave again!"
              },
              {
                name: "Michael Rodriguez",
                location: "Los Angeles",
                rating: 5,
                comment: "I love how easy it is to book flights and manage my trips with SkyWave. Their mobile app is intuitive and their customer service is top-notch."
              },
              {
                name: "Emma Thompson",
                location: "London",
                rating: 4,
                comment: "SkyWave made my international travel a breeze. From booking to landing, everything was well-organized and comfortable. Highly recommended!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Flight?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who choose SkyWave for their journeys.
            Book your flight today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/book-flight">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
