import { useState } from "react";
import { AgencyMap } from "@/components/AgencyMap";
import { AgencySidebar } from "@/components/AgencySidebar";
import { agencies, Agency } from "@/lib/agencies";
import { MapPin } from "lucide-react";

/**
 * Design Philosophy: Professional Information Architecture
 * - Clean, functional layout with map as primary focus
 * - Sidebar for contextual information and document guidance
 * - Accessible color coding for document categories
 * - Responsive two-column layout for desktop, stacked for mobile
 */
export default function Home() {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
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
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-[calc(100vh-140px)]">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-slate-100 p-4 lg:p-6">
            <AgencyMap
              agencies={agencies}
              onAgencySelect={setSelectedAgency}
              selectedAgency={selectedAgency}
            />
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-1 bg-white border-l border-slate-200 overflow-hidden">
            <AgencySidebar selectedAgency={selectedAgency} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-4 text-center text-sm">
        <p>
          Employment Agencies in Leicester, England • Required Documents for UK
          Registration
        </p>
      </footer>
    </div>
  );
}
