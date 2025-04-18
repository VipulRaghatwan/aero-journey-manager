
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Link } from "react-router-dom";
import { Plane, Users, CreditCard, Briefcase, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import mockData from "@/services/mockData";

const AdminDashboard = () => {
  const [totalFlights, setTotalFlights] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cancelledFlights, setCancelledFlights] = useState(0);
  const [flightStatusData, setFlightStatusData] = useState<any>({});
  const [revenueData, setRevenueData] = useState<any>({});
  const [routePopularityData, setRoutePopularityData] = useState<any>({});
  
  useEffect(() => {
    // Calculate total flights
    const flights = mockData.flights;
    setTotalFlights(flights.length);
    
    // Calculate cancelled flights
    const cancelled = flights.filter(flight => flight.status === "cancelled");
    setCancelledFlights(cancelled.length);
    
    // Calculate total passengers (from bookings)
    const bookings = mockData.bookings;
    setTotalPassengers(bookings.length);
    
    // Calculate total revenue
    const revenue = bookings.reduce((total, booking) => {
      if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
        return total + booking.flight.price;
      }
      return total;
    }, 0);
    setTotalRevenue(revenue);
    
    // Generate flight status data for pie chart
    const statusCounts = {
      "On-time": flights.filter(flight => flight.status === "on-time").length,
      "Delayed": flights.filter(flight => flight.status === "delayed").length,
      "Cancelled": flights.filter(flight => flight.status === "cancelled").length,
      "Scheduled": flights.filter(flight => flight.status === "scheduled").length,
      "Completed": flights.filter(flight => flight.status === "completed").length
    };
    
    setFlightStatusData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Flight Status",
          data: Object.values(statusCounts),
          backgroundColor: [
            "rgba(34, 197, 94, 0.7)",  // green for on-time
            "rgba(245, 158, 11, 0.7)", // amber for delayed
            "rgba(239, 68, 68, 0.7)",  // red for cancelled
            "rgba(59, 130, 246, 0.7)", // blue for scheduled
            "rgba(107, 114, 128, 0.7)" // gray for completed
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(107, 114, 128, 1)"
          ],
          borderWidth: 1
        }
      ]
    });
    
    // Generate monthly revenue data
    const monthlyRevenue = {
      Jan: 18500,
      Feb: 22400,
      Mar: 24600,
      Apr: 26900,
      May: 28000,
      Jun: 32500,
      Jul: 37800,
      Aug: 42100,
      Sep: 38600,
      Oct: 35700,
      Nov: 31200,
      Dec: 29800
    };
    
    setRevenueData({
      labels: Object.keys(monthlyRevenue),
      datasets: [
        {
          label: "Revenue",
          data: Object.values(monthlyRevenue),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2
        }
      ]
    });
    
    // Generate route popularity data
    const routeData = {
      "JFK-LAX": 128,
      "LAX-JFK": 124,
      "SFO-JFK": 97,
      "LHR-JFK": 86,
      "ORD-LAX": 82,
      "LAX-ORD": 78,
      "SFO-ORD": 74,
      "DXB-LHR": 72,
      "CDG-JFK": 68,
      "JFK-CDG": 65
    };
    
    setRoutePopularityData({
      labels: Object.keys(routeData),
      datasets: [
        {
          label: "Number of Bookings",
          data: Object.values(routeData),
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1
        }
      ]
    });
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of system operations and statistics</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/reports">
              <Briefcase className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/flights">
              <Plane className="mr-2 h-4 w-4" />
              Manage Flights
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Flights</p>
                <h3 className="text-3xl font-bold">{totalFlights}</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2% from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                <h3 className="text-3xl font-bold">{totalPassengers}</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5% from last month
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.4% from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled Flights</p>
                <h3 className="text-3xl font-bold">{cancelledFlights}</h3>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  2.1% from last month
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Plane className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="routes">Popular Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(flightStatusData).length > 0 && (
                  <PieChart
                    data={flightStatusData}
                    width={400}
                    height={300}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        }
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Flight SK1234 delayed by 45 minutes", time: "10 mins ago", type: "warning" },
                    { action: "New booking for flight SK5678", time: "30 mins ago", type: "success" },
                    { action: "Flight SK9012 status changed to 'on-time'", time: "1 hour ago", type: "info" },
                    { action: "Passenger refund processed", time: "2 hours ago", type: "info" },
                    { action: "Flight SK3456 cancelled due to weather", time: "5 hours ago", type: "error" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        activity.type === "success" ? "bg-green-500" :
                        activity.type === "warning" ? "bg-amber-500" :
                        activity.type === "error" ? "bg-red-500" : 
                        "bg-blue-500"
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 px-0">
                  View all activity <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Flights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Flight #</th>
                      <th className="px-6 py-3">Route</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Departure</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Bookings</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.flights.slice(0, 5).map((flight) => (
                      <tr key={flight.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{flight.flightNumber}</td>
                        <td className="px-6 py-4">
                          {flight.departureAirport.code} → {flight.arrivalAirport.code}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(flight.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{flight.departureTime}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            flight.status === "on-time" ? "bg-green-100 text-green-800" :
                            flight.status === "delayed" ? "bg-amber-100 text-amber-800" :
                            flight.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {Math.floor(Math.random() * 150)} / {150 - flight.seatsAvailable + Math.floor(Math.random() * 50)}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/admin/flights">View All Flights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue (USD)</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(revenueData).length > 0 && (
                <LineChart
                  data={revenueData}
                  width={1000}
                  height={400}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          drawBorder: false,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Routes</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(routePopularityData).length > 0 && (
                <BarChart
                  data={routePopularityData}
                  width={1000}
                  height={400}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          drawBorder: false,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
