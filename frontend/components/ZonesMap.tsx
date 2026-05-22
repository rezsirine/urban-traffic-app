'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Fix for default marker icons in Leaflet with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ZonesMapProps {
  zones: any[];
}

export default function ZonesMap({ zones }: ZonesMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  const [center, setCenter] = useState<[number, number]>([36.7525, 3.04197]); // Default: Algiers

  useEffect(() => {
    setIsMounted(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Erreur géolocalisation: ", error);
        }
      );
    }
  }, []);

  if (!isMounted) return <div style={{ height: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement de la carte...</div>;

  const getColor = (level: string) => {
    switch (level) {
      case 'FAIBLE': return '#22c55e'; // green
      case 'MOYEN': return '#eab308'; // yellow
      case 'ELEVE': return '#ef4444'; // red
      default: return '#3b82f6'; // blue
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => {
          let positions = [];
          if (Array.isArray(zone.bounds)) {
            positions = zone.bounds;
          } else {
            try {
              positions = JSON.parse(zone.bounds);
            } catch (e) {
              // fallback square
              positions = [
                [36.76, 3.03],
                [36.76, 3.05],
                [36.74, 3.05],
                [36.74, 3.03]
              ];
            }
          }

          return (
            <Polygon
              key={zone.id}
              positions={positions}
              pathOptions={{
                color: getColor(zone.densityLevel),
                fillColor: getColor(zone.densityLevel),
                fillOpacity: 0.4,
                weight: 2
              }}
            >
              <Popup>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{zone.name}</div>
                <div style={{ marginTop: '4px' }}>Densité: {zone.densityLevel}</div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
