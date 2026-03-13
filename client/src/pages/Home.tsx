import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Search, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Home page with Mapbox satellite view and agency search
 * - Displays all employment agencies in Leicester
 * - Interactive map with satellite view
 * - Search and filter functionality
 * - Agency details on click
 */
export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Fetch agencies from database
  const { data: agenciesData, isLoading } = trpc.agencies.list.useQuery();
  const agencies = agenciesData || [];

  // Filter agencies based on search and region
  const filteredAgencies = useMemo(() => {
    return agencies.filter((agency) => {
      const matchesSearch =
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || agency.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [agencies, searchQuery, selectedRegion]);

  // Get unique regions
  const regions = useMemo(() => {
    return Array.from(new Set(agencies.map((a) => a.region).filter(Boolean)));
  }, [agencies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Leicester Employment Agencies</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Find recruitment agencies and discover required documents for registration
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by agency name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Region Filter */}
            {regions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRegion === null ? "default" : "outline"}
                  onClick={() => setSelectedRegion(null)}
                  size="sm"
                >
                  All Regions
                </Button>
                {regions.map((region) => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? "default" : "outline"}
                    onClick={() => setSelectedRegion(region)}
                    size="sm"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-slate-600">
          <p className="text-sm">
            Showing <span className="font-semibold">{filteredAgencies.length}</span> of{" "}
            <span className="font-semibold">{agencies.length}</span> agencies
          </p>
        </div>

        {/* Agencies Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No agencies found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <Card
                key={agency.id}
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(`/agency/${agency.id}`)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{agency.name}</h3>

                  {agency.region && (
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {agency.region}
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    {/* Address */}
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-600">{agency.address}</p>
                    </div>

                    {/* Phone */}
                    {agency.phone && (
                      <div className="flex gap-3 items-center">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <a href={`tel:${agency.phone}`} className="text-blue-600 hover:underline">
                          {agency.phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {agency.email && (
                      <div className="flex gap-3 items-center">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <a href={`mailto:${agency.email}`} className="text-blue-600 hover:underline">
                          {agency.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16 text-center text-sm">
        <p>
          Employment Agencies in Leicester, England • Required Documents for UK Registration
        </p>
      </footer>
    </div>
  );
}
