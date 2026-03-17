import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Layers2 } from "lucide-react";
import { Button } from "./ui/button";
import type { Agency } from "@/lib/types";
import {
  getMapboxStyle,
  handleMapboxError,
  initializeMapbox,
  type MapboxStyleMode,
} from "@/lib/mapbox";

interface MapboxMapWithMarkersProps {
  agencies: Agency[];
  onAgencyClick?: (agencyId: string) => void;
}

export function MapboxMapWithMarkers({
  agencies,
  onAgencyClick,
}: MapboxMapWithMarkersProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [styleMode, setStyleMode] = useState<MapboxStyleMode>("default");

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!initializeMapbox()) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(styleMode),
      center: [0, 0],
      zoom: 2,
    });

    map.current.on("error", handleMapboxError);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [styleMode]);

  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(getMapboxStyle(styleMode));
  }, [styleMode]);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (agencies.length === 0) return;

    agencies.forEach((agency) => {
      const lat = Number(agency.latitude);
      const lng = Number(agency.longitude);

      const marker = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="font-semibold text-sm">${agency.name}</div><div class="text-xs text-slate-600">${agency.region}</div>`
          )
        )
        .addTo(map.current!);

      marker.getElement().addEventListener("click", () => {
        onAgencyClick?.(agency.id);
      });

      markersRef.current.push(marker);
    });

    const bounds = new mapboxgl.LngLatBounds();
    agencies.forEach((agency) => {
      bounds.extend([Number(agency.longitude), Number(agency.latitude)]);
    });

    map.current.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 500 });
  }, [agencies, onAgencyClick]);

  return (
    <div className="w-full">
      <div
        ref={mapContainer}
        className="h-96 w-full overflow-hidden rounded-lg bg-slate-200"
        style={{ minHeight: "400px" }}
      />
      <div className="mt-4 flex gap-2">
        <Button
          variant={styleMode === "satellite" ? "default" : "outline"}
          size="sm"
          onClick={() =>
            setStyleMode((current) =>
              current === "default" ? "satellite" : "default"
            )
          }
          className="flex items-center gap-2"
        >
          <Layers2 className="h-4 w-4" />
          {styleMode === "satellite" ? "Standard Map" : "Satellite View"}
        </Button>
      </div>
    </div>
  );
}
