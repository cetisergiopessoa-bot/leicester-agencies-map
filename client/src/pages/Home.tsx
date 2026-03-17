import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapboxMapWithMarkers } from "@/components/MapboxMapWithMarkers";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  TriangleAlert,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data: agenciesData, isLoading } = trpc.agencies.list.useQuery();
  const agencies = agenciesData?.items ?? [];

  const filteredAgencies = useMemo(() => {
    return agencies.filter((agency) => {
      const matchesSearch =
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || agency.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [agencies, searchQuery, selectedRegion]);

  const regions = useMemo(() => {
    return Array.from(new Set(agencies.map((agency) => agency.region).filter(Boolean)));
  }, [agencies]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

        .home-root * { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Fraunces', Georgia, serif; }

        .hero-bg {
          background: linear-gradient(135deg, #0c1628 0%, #0f2050 50%, #1a1060 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(245,158,11,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 80% at 10% 80%, rgba(99,102,241,0.10) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .stat-pill {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 6px 18px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .agency-card {
          background: #ffffff;
          border: 1px solid #e8edf5;
          border-radius: 14px;
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .agency-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .agency-card:hover {
          box-shadow: 0 12px 40px rgba(15,32,80,0.12);
          transform: translateY(-3px);
          border-color: #c7d6f0;
        }
        .agency-card:hover::after {
          transform: scaleX(1);
        }

        .search-wrap {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(15,32,80,0.08);
          border: 1px solid #e8edf5;
        }

        .region-chip {
          border-radius: 999px;
          padding: 5px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          border: 1.5px solid #d1daf0;
          background: transparent;
          color: #334155;
        }
        .region-chip:hover, .region-chip.active {
          background: #0f2050;
          border-color: #0f2050;
          color: #ffffff;
        }
        .region-chip.active {
          box-shadow: 0 2px 10px rgba(15,32,80,0.3);
        }

        .map-section {
          background: linear-gradient(180deg, #f8faff 0%, #eef2fb 100%);
          border-top: 1px solid #e2e8f4;
          border-bottom: 1px solid #e2e8f4;
        }

        .contact-link {
          color: #1d4ed8;
          transition: color 0.15s;
        }
        .contact-link:hover { color: #f59e0b; }

        .footer-bar {
          background: linear-gradient(135deg, #080f1f 0%, #0f2050 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .badge-region {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1e40af;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: 3px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .view-btn {
          width: 100%;
          margin-top: 16px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .view-btn:hover {
          background: #0f2050;
          border-color: #0f2050;
          color: #ffffff;
        }
        .view-btn svg {
          transition: transform 0.18s ease;
        }
        .view-btn:hover svg {
          transform: translateX(3px);
        }
      `}</style>

      <div className="home-root min-h-screen" style={{ background: "#f5f7fc" }}>
        <header className="hero-bg sticky top-0 z-10">
          <div className="hero-grid" />
          <div className="container relative px-6 py-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: "#f59e0b" }} />
                  <span
                    style={{
                      color: "#f59e0b",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Leicester, England
                  </span>
                </div>
                <h1
                  className="display-font"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.8rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.15,
                    marginBottom: 8,
                  }}
                >
                  Employment Agencies
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 15,
                    fontWeight: 300,
                    maxWidth: 460,
                  }}
                >
                  Discover local recruitment agencies and the documents required for
                  registration in the UK.
                </p>
              </div>
              {!isLoading && agencies.length > 0 && (
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <span className="stat-pill">
                    <Building2 size={13} />
                    {agencies.length} agencies listed
                  </span>
                  {regions.length > 0 && (
                    <span className="stat-pill">
                      <MapPin size={13} />
                      {regions.length} regions
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {!isLoading && agencies.length > 0 && (
          <div className="map-section w-full">
            <div className="container px-6 py-8">
              <h2
                className="display-font mb-1"
                style={{ fontSize: "1.4rem", fontWeight: 600, color: "#0f2050" }}
              >
                Agencies on the Map
              </h2>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
                Click a marker to view agency details.
              </p>
              <div
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid #dde5f5",
                  boxShadow: "0 4px 24px rgba(15,32,80,0.08)",
                }}
              >
                <MapboxMapWithMarkers
                  agencies={agencies}
                  onAgencyClick={(agencyId) => navigate(`/agency/${agencyId}`)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container px-6 py-8">
          <div className="search-wrap mb-6 p-6">
            {agenciesData?.source === "fallback" && (
              <Alert
                className="mb-5"
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 10,
                }}
              >
                <TriangleAlert className="h-4 w-4" style={{ color: "#b45309" }} />
                <AlertTitle style={{ color: "#92400e", fontWeight: 600 }}>
                  Fallback data enabled
                </AlertTitle>
                <AlertDescription style={{ color: "#78350f" }}>
                  {agenciesData.fallbackReason || "The primary data source is unavailable."}{" "}
                  Showing bundled agency data so search and browsing keep working on
                  localhost.
                </AlertDescription>
              </Alert>
            )}

            <div className="relative mb-4">
              <Search
                className="absolute"
                style={{
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  width: 18,
                  height: 18,
                }}
              />
              <input
                type="text"
                placeholder="Search by agency name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: 44,
                  paddingRight: 16,
                  paddingTop: 12,
                  paddingBottom: 12,
                  border: "1.5px solid #dde5f5",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  background: "#f8fafc",
                  color: "#0f172a",
                  transition: "border-color 0.18s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#dde5f5")}
              />
            </div>

            {regions.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  className={`region-chip ${selectedRegion === null ? "active" : ""}`}
                  onClick={() => setSelectedRegion(null)}
                >
                  All Regions
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    className={`region-chip ${selectedRegion === region ? "active" : ""}`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Showing{" "}
              <span style={{ fontWeight: 700, color: "#0f2050" }}>
                {filteredAgencies.length}
              </span>{" "}
              of{" "}
              <span style={{ fontWeight: 700, color: "#0f2050" }}>{agencies.length}</span>{" "}
              agencies
            </p>
          </div>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
              }}
            >
              <Loader2
                style={{
                  width: 36,
                  height: 36,
                  color: "#3b82f6",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : filteredAgencies.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 16, color: "#94a3b8" }}>
                No agencies found matching your search.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {filteredAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="agency-card"
                  onClick={() => navigate(`/agency/${agency.id}`)}
                >
                  <div style={{ padding: "24px 24px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #0f2050, #1d4ed8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={18} color="#ffffff" />
                      </div>
                      {agency.region && <span className="badge-region">{agency.region}</span>}
                    </div>

                    <h3
                      className="display-font"
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        marginBottom: 14,
                        lineHeight: 1.3,
                      }}
                    >
                      {agency.name}
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <MapPin
                          size={14}
                          style={{ color: "#94a3b8", marginTop: 2, flexShrink: 0 }}
                        />
                        <p
                          style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}
                        >
                          {agency.address}
                        </p>
                      </div>

                      {agency.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Phone
                            size={14}
                            style={{ color: "#94a3b8", flexShrink: 0 }}
                          />
                          <a
                            href={`tel:${agency.phone}`}
                            className="contact-link"
                            style={{ fontSize: 13 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {agency.phone}
                          </a>
                        </div>
                      )}

                      {agency.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Mail
                            size={14}
                            style={{ color: "#94a3b8", flexShrink: 0 }}
                          />
                          <a
                            href={`mailto:${agency.email}`}
                            className="contact-link"
                            style={{ fontSize: 13 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {agency.email}
                          </a>
                        </div>
                      )}
                    </div>

                    <button className="view-btn">
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="footer-bar mt-16 py-8" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.06em",
            }}
          >
            EMPLOYMENT AGENCIES · LEICESTER, ENGLAND · REQUIRED DOCUMENTS FOR UK
            REGISTRATION
          </p>
        </footer>
      </div>
    </>
  );
}
