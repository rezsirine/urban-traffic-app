'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GET_VEHICLE, GET_VEHICLE_HISTORY } from '../../../lib/queries';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './vehicle-detail.module.css';

const VehicleMap = dynamic(() => import('../../../components/VehicleMap'), {
  ssr: false,
});

export default function VehicleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: vehicleData, loading: vehicleLoading } = useQuery(GET_VEHICLE, {
    variables: { id },
    skip: !id
  });

  const { data: historyData, loading: historyLoading } = useQuery(GET_VEHICLE_HISTORY, {
    variables: { vehicleId: id },
    skip: !id,
    pollInterval: 10000 // Poll every 10s for new positions
  });

  if (vehicleLoading || historyLoading) return <div className={styles.loading}>Chargement des détails...</div>;
  if (!vehicleData?.vehicle) return <div className={styles.error}>Véhicule introuvable.</div>;

  const vehicle = vehicleData.vehicle;
  const history = historyData?.vehicleHistory || [];
  
  // Get latest position
  const latestPos = history.length > 0 ? history[0] : null;

  return (
    <div className={styles.container}>
      <Link href="/vehicles" className={styles.backLink}>
        &larr; Retour aux véhicules
      </Link>

      <div className={styles.grid}>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </div>
            <div>
              <h2 className={styles.plateTitle}>{vehicle.licensePlate}</h2>
              <span className={styles.subtitle}>{vehicle.type}</span>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.label}>ID</span>
              <span className={styles.value}>{vehicle.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Conducteur</span>
              <span className={styles.value}>Karim Benali</span> {/* MOCK */}
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Zone actuelle</span>
              <span className={styles.value}>Centre-Ville</span> {/* MOCK */}
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Statut</span>
              <span className={`${styles.statusBadge} ${vehicle.status === 'Actif' ? styles.statusActive : styles.statusInactive}`}>
                {vehicle.status}
              </span>
            </div>
            {latestPos && (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Dernière position</span>
                  <span className={styles.value} suppressHydrationWarning>
                    {new Date(latestPos.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Latitude</span>
                  <span className={styles.value}>{Number(latestPos.lat).toFixed(4)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Longitude</span>
                  <span className={styles.value}>{Number(latestPos.lng).toFixed(4)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <h3>Position GPS en temps réel</h3>
            <span className={styles.liveIndicator}><span className={styles.liveDot}></span> Live</span>
          </div>
          <div className={styles.mapPlaceholder} style={{ background: 'none', border: 'none', padding: 0 }}>
            <VehicleMap latestPos={latestPos} history={history} />
          </div>
        </div>
      </div>

      <div className={styles.historyCard}>
        <h3>Historique des déplacements</h3>
        <div className={styles.timeline}>
          {history.length > 0 ? history.map((pos: any, index: number) => (
            <div key={pos.id} className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTime} suppressHydrationWarning>
                  {new Date(pos.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className={styles.timelineLoc}>
                  {Number(pos.lat).toFixed(4)}N, {Number(pos.lng).toFixed(4)}E
                </div>
              </div>
            </div>
          )) : (
            <div className={styles.noDataText}>Aucun historique enregistré.</div>
          )}
        </div>
      </div>
    </div>
  );
}
