
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Download, 
  RefreshCw, 
  Plane,
  Users,
  CreditCard
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import mockData from "@/services/mockData";

const AdminReports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("month");
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // Data for charts
  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue (USD)",
        data: [18500, 22400, 24600, 26900, 28000, 32500, 37800, 42100, 38600, 35700, 31200, 29800],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2
      }
    ]
  });
  
  const [flightsData, setFlightsData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Number of Flights",
        data: [120, 145, 158, 162, 180, 195, 210, 225, 190, 175, 156, 140],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2
      }
    ]
  });
  
  const [passengersData, setPassengersData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Number of Passengers",
        data: [1850, 2240, 2460, 2690, 2800, 3250, 3780, 4210, 3860, 3570, 3120, 2980],
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 2
      }
    ]
  });
  
  const [routesData, setRoutesData] = useState({
    labels: ["JFK-LAX", "LAX-JFK", "SFO-JFK", "LHR-JFK", "ORD-LAX", "LAX-ORD", "SFO-ORD", "DXB-LHR", "CDG-JFK", "JFK-CDG"],
    datasets: [
      {
        label: "Number of Flights",
        data: [128, 124, 97, 86, 82, 78, 74, 72, 68, 65],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", 
          "rgba(16, 185, 129, 0.7)", 
          "rgba(245, 158, 11, 0.7)", 
          "rgba(239, 68, 68, 0.7)", 
          "rgba(139, 92, 246, 0.7)",
          "rgba(6, 182, 212, 0.7)",
          "rgba(96, 165, 250, 0.7)",
          "rgba(248, 113, 113, 0.7)",
          "rgba(52, 211, 153, 0.7)",
          "rgba(251, 191, 36, 0.7)"
        ]
      }
    ]
  });

  const [dailyFlightsData, setDailyFlightsData] = useState({
    labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: "Scheduled",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 10),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1
      },
      {
        label: "Completed",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 8),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1
      },
      {
        label: "Cancelled",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3)),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1
      }
    ]
  });

  const generateReportData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would fetch data based on the date range and report type
      setIsLoading(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF report
    alert("In a real application, this would generate and download a PDF report.");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };

  const getDaysInMonth = () => {
    if (!customDate) return [];
    
    const start = startOfMonth(customDate);
    const end = endOfMonth(customDate);
    
    return eachDayOfInterval({ start, end });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view detailed reports on flights, passengers, and revenue</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Analysis</SelectItem>
                  <SelectItem value="flights">Flight Statistics</SelectItem>
                  <SelectItem value="passengers">Passenger Data</SelectItem>
                  <SelectItem value="routes">Popular Routes</SelectItem>
                  <SelectItem value="daily">Daily Flights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === "custom" && (
              <div>
                <label className="block text-sm font-medium mb-1">Custom Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDate ? formatDate(customDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDate}
                      onSelect={setCustomDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-right">
            <Button onClick={generateReportData} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Visualizations */}
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          {reportType === "revenue" && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>
                  Monthly revenue data for {format(new Date(), "yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LineChart
                    data={revenueData}
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
                </div>
              </CardContent>
            </Card>
          )}
          
          {reportType === "flights" && (
            <Card>
              <CardHeader>
                <CardTitle>Flight Statistics</CardTitle>
                <CardDescription>
                  Monthly flight counts for {format(new Date(), "yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart
                    data={flightsData}
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
                </div>
              </CardContent>
            </Card>
          )}
          
          {reportType === "passengers" && (
            <Card>
              <CardHeader>
                <CardTitle>Passenger Data</CardTitle>
                <CardDescription>
                  Monthly passenger counts for {format(new Date(), "yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LineChart
                    data={passengersData}
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
                </div>
              </CardContent>
            </Card>
          )}
          
          {reportType === "routes" && (
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>
                  Top 10 most popular routes for {format(new Date(), "yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart
                    data={routesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          grid: {
                            display: false,
                          },
                        },
                        x: {
                          beginAtZero: true,
                          grid: {
                            drawBorder: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {reportType === "daily" && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Flight Breakdown</CardTitle>
                <CardDescription>
                  Flight statistics for {customDate ? format(customDate, "MMMM yyyy") : format(new Date(), "MMMM yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart
                    data={dailyFlightsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          stacked: true,
                          grid: {
                            drawBorder: false,
                          },
                        },
                        x: {
                          stacked: true,
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-3xl font-bold">$348,150</h3>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <span className="text-green-500">↑</span>
                      12.5% from last year
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Flights</p>
                    <h3 className="text-3xl font-bold">1,856</h3>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <span className="text-green-500">↑</span>
                      8.2% from last year
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Plane className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                    <h3 className="text-3xl font-bold">34,770</h3>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <span className="text-green-500">↑</span>
                      15.3% from last year
                    </p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Routes by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Flights</th>
                        <th className="px-4 py-3">Passengers</th>
                        <th className="px-4 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { route: "JFK-LAX", flights: 128, passengers: 18560, revenue: 5568000 },
                        { route: "LAX-JFK", flights: 124, passengers: 17980, revenue: 5394000 },
                        { route: "LHR-JFK", flights: 86, passengers: 12470, revenue: 4988000 },
                        { route: "JFK-CDG", flights: 65, passengers: 9425, revenue: 3770000 },
                        { route: "SFO-JFK", flights: 97, passengers: 14065, revenue: 3516250 },
                      ].map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 font-medium">{item.route}</td>
                          <td className="px-4 py-3">{item.flights}</td>
                          <td className="px-4 py-3">{item.passengers.toLocaleString()}</td>
                          <td className="px-4 py-3">${(item.revenue).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Month</th>
                        <th className="px-4 py-3">Flights</th>
                        <th className="px-4 py-3">On-time %</th>
                        <th className="px-4 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { month: "Jan", flights: 120, onTime: 92, revenue: 18500 },
                        { month: "Feb", flights: 145, onTime: 88, revenue: 22400 },
                        { month: "Mar", flights: 158, onTime: 91, revenue: 24600 },
                        { month: "Apr", flights: 162, onTime: 93, revenue: 26900 },
                        { month: "May", flights: 180, onTime: 90, revenue: 28000 },
                      ].map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 font-medium">{item.month}</td>
                          <td className="px-4 py-3">{item.flights}</td>
                          <td className="px-4 py-3">{item.onTime}%</td>
                          <td className="px-4 py-3">${item.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
