import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Agency } from "@/lib/agencies";
import { getMapboxStyle, handleMapboxError, initializeMapbox } from "@/lib/mapbox";

interface AgencyMapProps {
  agencies: Agency[];
  onAgencySelect: (agency: Agency) => void;
  selectedAgency: Agency | null;
}

export function AgencyMap({
  agencies,
  onAgencySelect,
  selectedAgency,
}: AgencyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!initializeMapbox()) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(),
      center: [-1.1398, 52.6369],
      zoom: 12,
    });

    map.current.on("error", handleMapboxError);
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    agencies.forEach((agency) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage =
        selectedAgency?.id === agency.id
          ? "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%232563eb%22><path d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z%22/></svg>')"
          : "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2364748b%22><path d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z%22/></svg>')";
      el.style.width = selectedAgency?.id === agency.id ? "32px" : "24px";
      el.style.height = selectedAgency?.id === agency.id ? "32px" : "24px";
      el.style.backgroundSize = "100%";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s ease";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([agency.lng, agency.lat])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onAgencySelect(agency);
      });

      markers.current[agency.id] = marker;
    });
  }, [mapLoaded, agencies, selectedAgency, onAgencySelect]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedAgency) return;

    map.current.flyTo({
      center: [selectedAgency.lng, selectedAgency.lat],
      zoom: 14,
      duration: 1000,
    });
  }, [selectedAgency, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full overflow-hidden rounded-lg shadow-lg"
    />
  );
}
