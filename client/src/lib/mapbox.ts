import mapboxgl from "mapbox-gl";

const DEFAULT_MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v12";
const SATELLITE_MAPBOX_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

export type MapboxStyleMode = "default" | "satellite";

declare global {
  interface Window {
    VITE_MAPBOX_ACCESS_TOKEN?: string;
    __MAPBOX_AUTH_ERROR_LOGGED__?: boolean;
  }
}

export function getMapboxToken() {
  return (
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
    (typeof window !== "undefined" ? window.VITE_MAPBOX_ACCESS_TOKEN : undefined)
  );
}

export function getMapboxStyle(mode: MapboxStyleMode = "default") {
  if (mode === "satellite") {
    return SATELLITE_MAPBOX_STYLE;
  }

  return import.meta.env.VITE_MAPBOX_STYLE_URL || DEFAULT_MAPBOX_STYLE;
}

export function initializeMapbox() {
  const token = getMapboxToken();

  if (!token) {
    console.error(
      "Mapbox token not found. Set VITE_MAPBOX_ACCESS_TOKEN in your .env or pass it via window.VITE_MAPBOX_ACCESS_TOKEN."
    );
    return null;
  }

  mapboxgl.accessToken = token;
  return token;
}

export function handleMapboxError(event: { error?: Error & { status?: number } }) {
  if (
    event.error?.status === 401 &&
    typeof window !== "undefined" &&
    !window.__MAPBOX_AUTH_ERROR_LOGGED__
  ) {
    window.__MAPBOX_AUTH_ERROR_LOGGED__ = true;
    console.error(
      "Mapbox authentication failed (401). Verify VITE_MAPBOX_ACCESS_TOKEN is valid and has styles:read and tiles:read scopes."
    );
  }
}
