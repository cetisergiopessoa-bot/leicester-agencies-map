import { Agency, requiredDocuments } from "@/lib/agencies";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgencySidebarProps {
  selectedAgency: Agency | null;
}

export function AgencySidebar({ selectedAgency }: AgencySidebarProps) {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
      {selectedAgency ? (
        <div className="p-6 space-y-6">
          {/* Agency Header */}
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedAgency.name}
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedAgency.address}
                </p>
              </div>
              {selectedAgency.phone !== "Not publicly available" && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a
                    href={`tel:${selectedAgency.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedAgency.phone}
                  </a>
                </div>
              )}
              {selectedAgency.email !== "Not publicly available" && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a
                    href={`mailto:${selectedAgency.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedAgency.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Documents Required */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Required Documents
            </h3>
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Proof of Identity
                </h4>
                <ul className="space-y-1">
                  {requiredDocuments.identity.map((doc, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Right to Work in UK
                </h4>
                <ul className="space-y-1">
                  {requiredDocuments.rightToWork.map((doc, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Proof of Address
                </h4>
                <ul className="space-y-1">
                  {requiredDocuments.address.map((doc, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-purple-50 border-purple-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Additional Documents
                </h4>
                <ul className="space-y-1">
                  {requiredDocuments.other.map((doc, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">
              Select an agency on the map
            </p>
            <p className="text-sm text-slate-500">
              Click on any marker to view details and required documents
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
