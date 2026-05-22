'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VehicleMapProps {
  latestPos: { lat: number; lng: number } | null;
  history: any[];
}

export default function VehicleMap({ latestPos, history }: VehicleMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState<[number, number]>([36.8065, 10.1815]);

  useEffect(() => {
    setIsMounted(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Erreur géolocalisation: ", error);
        }
      );
    }
  }, []);

  if (!isMounted) return <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement de la carte...</div>;

  const center: [number, number] = latestPos ? [latestPos.lat, latestPos.lng] : defaultCenter;
  
  // Extract coordinates for Polyline
  const pathPositions = history.map(pos => [pos.lat, pos.lng] as [number, number]);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pathPositions.length > 0 && (
          <Polyline positions={pathPositions} color="#3b82f6" weight={3} dashArray="5, 10" />
        )}
        
        {latestPos && (
          <Marker position={[latestPos.lat, latestPos.lng]}>
            <Popup>
              <strong>Position Actuelle</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
