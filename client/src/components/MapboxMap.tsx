import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  agencyName?: string;
}

export function MapboxMap({ latitude, longitude, zoom = 16, agencyName }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox token
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = token;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add marker
    if (map.current) {
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="font-semibold">${agencyName || "Agency Location"}</div>`
          )
        )
        .addTo(map.current);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, zoom, agencyName]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg overflow-hidden bg-slate-200"
      style={{ minHeight: "400px" }}
    />
  );
}
