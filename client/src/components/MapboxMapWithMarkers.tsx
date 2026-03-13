import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Agency } from "@/lib/types";

interface MapboxMapWithMarkersProps {
  agencies: Agency[];
  onAgencyClick?: (agencyId: string) => void;
}

export function MapboxMapWithMarkers({ agencies, onAgencyClick }: MapboxMapWithMarkersProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || agencies.length === 0) return;

    // Set Mapbox token
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = token;

    // Calculate center and bounds
    const lats = agencies.map((a) => parseFloat(a.latitude.toString()));
    const lngs = agencies.map((a) => parseFloat(a.longitude.toString()));
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [centerLng, centerLat],
      zoom: 12,
    });

    // Add markers for all agencies
    agencies.forEach((agency) => {
      const lat = parseFloat(agency.latitude.toString());
      const lng = parseFloat(agency.longitude.toString());

      const marker = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="font-semibold text-sm">${agency.name}</div><div class="text-xs text-slate-600">${agency.region}</div>`
          )
        )
        .addTo(map.current!);

      // Add click handler to marker
      marker.getElement().addEventListener("click", () => {
        if (onAgencyClick) {
          onAgencyClick(agency.id);
        }
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [agencies, onAgencyClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg overflow-hidden bg-slate-200"
      style={{ minHeight: "400px" }}
    />
  );
}
