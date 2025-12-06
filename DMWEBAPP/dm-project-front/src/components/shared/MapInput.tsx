import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapInputProps {
  initialLat?: number | null;
  initialLng?: number | null;
}

const MapClickMarker: React.FC<{
  initialPosition: [number, number] | null;
}> = ({ initialPosition }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialPosition
  );

  useEffect(() => {
    if (initialPosition) {
      setMarkerPosition(initialPosition);
    }
  }, [initialPosition]);

  const map = useMapEvents({
    click: (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setMarkerPosition([lat, lng]);
    },
  });

  useEffect(() => {
    if (markerPosition) {
      map.panTo(markerPosition);
    }
  }, [markerPosition, map]);

  useEffect(() => {
    if (initialPosition) {
      map.setView(initialPosition);
    }
  }, [initialPosition]);

  return markerPosition ? <Marker position={markerPosition}></Marker> : null;
};

const MapInput: React.FC<MapInputProps> = ({ initialLat, initialLng }) => {
  console.log(initialLat, initialLng);
  const defaultCenter: [number, number] = [35.56, 45.43];
  const zoomLevel = 12;

  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!initialLat || !initialLng) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentPos([lat, lng]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const initialPosition: [number, number] | null =
    initialLat && initialLng ? [initialLat, initialLng] : null;

  const center = initialPosition || currentPos || defaultCenter;
  return (
    <div className="h-[300px] w-full border rounded-md overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickMarker initialPosition={initialPosition} />
      </MapContainer>

      <div className="absolute top-2 left-2 bg-white p-2 rounded text-sm shadow-md">
        {initialLat && initialLng
          ? `Lat: ${initialLat.toFixed(6)}, Lng: ${initialLng.toFixed(6)}`
          : "Click on the map to select location."}
      </div>
    </div>
  );
};

export default MapInput;
