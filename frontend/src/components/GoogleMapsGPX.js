import React, { useEffect, useRef } from "react";

// ----------------------------------------------------
// Shared Google Maps loader
// ----------------------------------------------------
let googleMapsLoaderPromise = null;
const loadGoogleMapsScript = (apiKey) => {
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
  if (googleMapsLoaderPromise) return googleMapsLoaderPromise;

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return googleMapsLoaderPromise;
};

// ----------------------------------------------------
// GPX parser
// ----------------------------------------------------
function parseGPX(gpxText) {
  const xml = new DOMParser().parseFromString(gpxText, "application/xml");
  const trkpts = [...xml.getElementsByTagName("trkpt")];
  const wpts = [...xml.getElementsByTagName("wpt")];

  return {
    route: trkpts.map((pt) => ({
      lat: parseFloat(pt.getAttribute("lat")),
      lng: parseFloat(pt.getAttribute("lon")),
    })),
    waypoints: wpts.map((wpt) => ({
      lat: parseFloat(wpt.getAttribute("lat")),
      lng: parseFloat(wpt.getAttribute("lon")),
      name: wpt.getElementsByTagName("name")[0]?.textContent,
      type: wpt.getElementsByTagName("type")[0]?.textContent || "SPRING",
    })),
  };
}

// ----------------------------------------------------
// Clean minimalist SVG icons (Garmin-style)
// ----------------------------------------------------
const ICONS = {
  START: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26'>
        <circle cx='13' cy='13' r='11' fill='#28a745' stroke='white' stroke-width='2'/>
        <polygon points='10,8 18,13 10,18' fill='white'/>
      </svg>`),

  // ✅ Round marker, white square flag icon
  FINISH: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26'>
        <circle cx='13' cy='13' r='11' fill='#dc3545' stroke='white' stroke-width='2'/>
        <rect x='9' y='8' width='8' height='8' rx='1' fill='white'/>
      </svg>`),

  FOOD: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'>
        <circle cx='11' cy='11' r='9' fill='#f28c28' stroke='white' stroke-width='2'/>
        <text x='11' y='15' font-size='10' text-anchor='middle' fill='white'>🍴</text>
      </svg>`),

  SPRING: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'>
        <circle cx='11' cy='11' r='9' fill='#0099ff' stroke='white' stroke-width='2'/>
        <text x='11' y='15' font-size='11' text-anchor='middle' fill='white'>💧</text>
      </svg>`),

  VIEW: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'>
        <circle cx='11' cy='11' r='9' fill='#9c27b0' stroke='white' stroke-width='2'/>
        <text x='11' y='15' font-size='11' text-anchor='middle' fill='white'>👁</text>
      </svg>`),

  DEFAULT: "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'>
        <circle cx='11' cy='11' r='9' fill='#17a2b8' stroke='white' stroke-width='2'/>
        <text x='11' y='15' font-size='12' text-anchor='middle' fill='white' font-family='Arial, sans-serif'>i</text>
      </svg>
    `),

};

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
const GoogleMapsGPX = ({ gpxUrl, height = "400px" }) => {
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  useEffect(() => {
    let map;

    (async () => {
      try {
        const maps = await loadGoogleMapsScript(apiKey);
        const gpxText = await (await fetch(gpxUrl)).text();
        const data = parseGPX(gpxText);
        if (!data.route.length) return;

        const bounds = new maps.LatLngBounds();
        data.route.forEach((p) => bounds.extend(p));

        map = new maps.Map(mapRef.current, {
          center: data.route[0],
          zoom: 13,
          mapTypeId: "terrain",
          mapId,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true, // ✅ allow switching to Satellite
          fullscreenControl: true, // ✅ allow fullscreen
          streetViewControl: false,
        });

        // Trail line
        new maps.Polyline({
          path: data.route,
          strokeColor: "#0050ff",
          strokeOpacity: 0.9,
          strokeWeight: 4,
          map,
        });

        // Start marker
        new maps.Marker({
          position: data.route[0],
          map,
          icon: { url: ICONS.START, scaledSize: new maps.Size(26, 26) },
          title: "Start",
        });

        // Finish marker
        new maps.Marker({
          position: data.route[data.route.length - 1],
          map,
          icon: { url: ICONS.FINISH, scaledSize: new maps.Size(26, 26) },
          title: "Finish",
        });

        // Waypoints
        data.waypoints.forEach((w) => {
          const type = w.type?.toUpperCase();
          const icon = ICONS[type] || ICONS.DEFAULT;
          new maps.Marker({
            position: { lat: w.lat, lng: w.lng },
            map,
            icon: { url: icon, scaledSize: new maps.Size(22, 22) },
            title: w.name || type,
          });
        });

        setTimeout(() => {
            if (
                map &&
                window.google &&
                map instanceof window.google.maps.Map &&
                typeof map.getCenter === "function"
            ) {
                try {
                map.fitBounds(bounds);
                } catch (err) {
                console.warn("Skipped fitBounds (map not fully initialized yet)", err);
                }
            }
            }, 300);

                } catch (err) {
                    console.error("Error loading map:", err);
                }
        })();

    return () => {
      map = null;
    };
  }, [gpxUrl, apiKey, mapId]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
};

export default GoogleMapsGPX;
