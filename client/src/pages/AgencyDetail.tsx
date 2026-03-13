import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, ArrowLeft, Loader2 } from "lucide-react";

/**
 * Agency detail page showing full information about a specific agency
 */
export default function AgencyDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const agencyId = params?.id as string;

  // Fetch agency details
  const { data: agency, isLoading } = trpc.agencies.getById.useQuery(
    { id: agencyId },
    { enabled: !!agencyId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-slate-500 text-lg mb-4">Agency not found</p>
        <Button onClick={() => navigate("/")} variant="default">
          Back to Agencies
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-blue-500 mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agencies
          </Button>
          <h1 className="text-3xl font-bold">{agency.name}</h1>
          {agency.region && (
            <p className="text-blue-100 mt-2">Region: {agency.region}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2">
            {/* Description */}
            {agency.description && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 text-lg">{agency.description}</p>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-slate-600">{agency.address}</p>
                  </div>
                </div>

                {/* Phone */}
                {agency.phone && (
                  <div className="flex gap-4 items-start">
                    <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <a
                        href={`tel:${agency.phone}`}
                        className="text-blue-600 hover:underline text-lg"
                      >
                        {agency.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {agency.email && (
                  <div className="flex gap-4 items-start">
                    <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a
                        href={`mailto:${agency.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {agency.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {agency.website && (
                  <div className="flex gap-4 items-start">
                    <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Website</p>
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {agency.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Location on Map */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Location</h2>
              <div className="bg-slate-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-slate-600">
                  Latitude: {agency.latitude}, Longitude: {agency.longitude}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Info</h3>

              <div className="space-y-4">
                {agency.region && (
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">REGION</p>
                    <p className="text-slate-900 font-medium">{agency.region}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 font-semibold mb-2">COORDINATES</p>
                  <p className="text-xs text-slate-600">
                    {parseFloat(agency.latitude.toString()).toFixed(4)}, {parseFloat(agency.longitude.toString()).toFixed(4)}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Button className="w-full" size="lg">
                    Contact Agency
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
