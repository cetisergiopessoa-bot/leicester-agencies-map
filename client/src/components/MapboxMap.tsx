import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "./ui/button";
import { Layers3, Navigation } from "lucide-react";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  agencyName?: string;
  agencyAddress?: string;
}

export function MapboxMap({ latitude, longitude, zoom = 16, agencyName, agencyAddress }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

    // Add agency marker
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

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLng = position.coords.longitude;
          const userLat = position.coords.latitude;
          setUserLocation([userLng, userLat]);

          // Add user location marker
          if (map.current) {
            new mapboxgl.Marker({ color: "#3b82f6" })
              .setLngLat([userLng, userLat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  `<div class="font-semibold">Your Location</div>`
                )
              )
              .addTo(map.current);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, zoom, agencyName]);

  // Toggle 3D view
  useEffect(() => {
    if (!map.current) return;

    if (is3D) {
      map.current.setPitch(60);
      map.current.setBearing(-30);
      
      // Add 3D buildings layer if not already present
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
  }, [is3D]);

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
      <div className="flex gap-2 mt-4">
        <Button
          variant={is3D ? "default" : "outline"}
          size="sm"
          onClick={() => setIs3D(!is3D)}
          className="flex items-center gap-2"
        >
          <Layers3 className="w-4 h-4" />
          {is3D ? "2D View" : "3D View"}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleGetDirections}
          className="flex items-center gap-2"
          disabled={!userLocation}
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
      </div>
    </div>
  );
}
