import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Layers2, Layers3, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import {
  getMapboxStyle,
  handleMapboxError,
  initializeMapbox,
  type MapboxStyleMode,
} from "@/lib/mapbox";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  agencyName?: string;
  agencyAddress?: string;
}

export function MapboxMap({
  latitude,
  longitude,
  zoom = 16,
  agencyName,
  agencyAddress,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const agencyMarker = useRef<mapboxgl.Marker | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [styleMode, setStyleMode] = useState<MapboxStyleMode>("default");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!initializeMapbox()) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(styleMode),
      center: [longitude, latitude],
      zoom,
    });

    map.current.on("error", handleMapboxError);

    return () => {
      agencyMarker.current?.remove();
      agencyMarker.current = null;
      userMarker.current?.remove();
      userMarker.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude, zoom, styleMode]);

  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(getMapboxStyle(styleMode));
  }, [styleMode]);

  useEffect(() => {
    if (!map.current) return;

    map.current.setCenter([longitude, latitude]);
    map.current.setZoom(zoom);

    agencyMarker.current?.remove();
    agencyMarker.current = new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="font-semibold">${agencyName || "Agency Location"}</div>${
            agencyAddress ? `<div class="text-sm text-slate-600">${agencyAddress}</div>` : ""
          }`
        )
      )
      .addTo(map.current);
  }, [agencyAddress, agencyName, latitude, longitude, zoom]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.log("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    userMarker.current?.remove();
    userMarker.current = new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat(userLocation)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="font-semibold">Your Location</div>`
        )
      )
      .addTo(map.current);
  }, [userLocation]);

  useEffect(() => {
    if (!map.current) return;

    const applyViewMode = () => {
      if (!map.current) return;

      if (is3D) {
        map.current.setPitch(60);
        map.current.setBearing(-30);

        if (!map.current.getLayer("3d-buildings")) {
          map.current.addLayer(
            {
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              type: "fill-extrusion",
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "height"],
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "min_height"],
                ],
                "fill-extrusion-opacity": 0.6,
              },
            },
            "waterway-label"
          );
        }
      } else {
        map.current.setPitch(0);
        map.current.setBearing(0);
        if (map.current.getLayer("3d-buildings")) {
          map.current.removeLayer("3d-buildings");
        }
      }
    };

    applyViewMode();
    map.current.on("style.load", applyViewMode);

    return () => {
      map.current?.off("style.load", applyViewMode);
    };
  }, [is3D, styleMode]);

  const handleGetDirections = () => {
    if (userLocation) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(mapsUrl, "_blank");
    } else {
      alert("Unable to get your location. Please enable location services.");
    }
  };

  return (
    <div className="w-full">
      <div
        ref={mapContainer}
        className="w-full rounded-lg overflow-hidden bg-slate-200"
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
        <Button
          variant={is3D ? "default" : "outline"}
          size="sm"
          onClick={() => setIs3D(!is3D)}
          className="flex items-center gap-2"
        >
          <Layers3 className="h-4 w-4" />
          {is3D ? "2D View" : "3D View"}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleGetDirections}
          className="flex items-center gap-2"
          disabled={!userLocation}
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </div>
  );
}
