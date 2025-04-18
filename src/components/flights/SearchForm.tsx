
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane } from "lucide-react";

interface SearchFormProps {
  searchCriteria: any;
  setSearchCriteria: (criteria: any) => void;
  handleSearch: () => void;
  loading: boolean;
  errors: any;
}

const SearchForm = ({ searchCriteria, setSearchCriteria, handleSearch, loading, errors }: SearchFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flight Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Select 
              value={searchCriteria.from || ""} 
              onValueChange={(value) => setSearchCriteria({...searchCriteria, from: value})}
            >
              <SelectTrigger id="from" className={errors.from ? "border-red-500" : ""}>
                <SelectValue placeholder="Departure Airport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JFK">New York (JFK)</SelectItem>
                <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
              </SelectContent>
            </Select>
            {errors.from && (
              <p className="text-sm text-red-500">{errors.from}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Select 
              value={searchCriteria.to || ""} 
              onValueChange={(value) => setSearchCriteria({...searchCriteria, to: value})}
            >
              <SelectTrigger id="to" className={errors.to ? "border-red-500" : ""}>
                <SelectValue placeholder="Arrival Airport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JFK">New York (JFK)</SelectItem>
                <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                <SelectItem value="ORD">Chicago (ORD)</SelectItem>
                <SelectItem value="ATL">Atlanta (ATL)</SelectItem>
                <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
              </SelectContent>
            </Select>
            {errors.to && (
              <p className="text-sm text-red-500">{errors.to}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={searchCriteria.date || ""} 
              onChange={(e) => setSearchCriteria({...searchCriteria, date: e.target.value})}
              className={errors.date ? "border-red-500" : ""}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>
        </div>
        
        <Button onClick={handleSearch} className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
              Searching...
            </span>
          ) : (
            <span className="flex items-center">
              <Plane className="mr-2 h-4 w-4" />
              Search Flights
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
