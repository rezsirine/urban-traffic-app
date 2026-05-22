'use client';
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import dynamic from 'next/dynamic';
import { GET_ZONES } from '../../lib/queries';
import styles from './zones.module.css';

const ZonesMap = dynamic(() => import('../../components/ZonesMap'), {
  ssr: false,
});

export default function ZonesPage() {
  const { data, loading, error } = useQuery<any>(GET_ZONES);

  const stats = useMemo(() => {
    const zones = data?.zones || [];
    return {
      faible: zones.filter((z: any) => z.densityLevel === 'FAIBLE').length,
      moyen: zones.filter((z: any) => z.densityLevel === 'MOYEN').length,
      eleve: zones.filter((z: any) => z.densityLevel === 'ELEVE').length,
    };
  }, [data]);

  if (loading) return <div className={styles.loading}>Chargement des zones...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  const getStatusClass = (level: string) => {
    switch (level) {
      case 'FAIBLE': return styles.badgeGreen;
      case 'MOYEN': return styles.badgeYellow;
      case 'ELEVE': return styles.badgeRed;
      default: return styles.badgeGreen;
    }
  };

  const getStatusLabel = (level: string) => {
    switch (level) {
      case 'FAIBLE': return 'Faible';
      case 'MOYEN': return 'Moyen';
      case 'ELEVE': return 'Élevé';
      default: return 'Inconnu';
    }
  };

  const getProgressColorClass = (level: string) => {
    switch (level) {
      case 'FAIBLE': return styles.bgGreen;
      case 'MOYEN': return styles.bgYellow;
      case 'ELEVE': return styles.bgRed;
      default: return styles.bgGreen;
    }
  };

  const getProgressWidth = (level: string) => {
    switch (level) {
      case 'FAIBLE': return '28%';
      case 'MOYEN': return '65%';
      case 'ELEVE': return '92%';
      default: return '28%';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.dot} ${styles.dotGreen}`}></span> Faible
          </div>
          <div className={styles.statValue}>
            {stats.faible} <span className={styles.statLabel}>zone(s)</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.dot} ${styles.dotYellow}`}></span> Moyen
          </div>
          <div className={styles.statValue}>
            {stats.moyen} <span className={styles.statLabel}>zone(s)</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.dot} ${styles.dotRed}`}></span> Élevé
          </div>
          <div className={styles.statValue}>
            {stats.eleve} <span className={styles.statLabel}>zone(s)</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.zoneListSection}>
          <div className={styles.sectionHeader}>Zones de circulation</div>
          <div className={styles.zoneList}>
            {(data?.zones || []).map((zone: any) => (
              <div key={zone.id} className={styles.zoneItem}>
                <div className={styles.zoneTop}>
                  <div className={styles.zoneTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {zone.name}
                  </div>
                  <span className={`${styles.badge} ${getStatusClass(zone.densityLevel)}`}>
                    {getStatusLabel(zone.densityLevel)}
                  </span>
                </div>
                <div className={styles.progressContainer}>
                  <div
                    className={`${styles.progressBar} ${getProgressColorClass(zone.densityLevel)}`}
                    style={{ width: getProgressWidth(zone.densityLevel) }}
                  ></div>
                </div>
                <div className={styles.zoneFooter}>
                  <span suppressHydrationWarning>Màj {(zone.createdAt) ? new Date(zone.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapCard} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
            <div className={styles.mapHeader}>
              <h3>Carte de densité — Alger</h3>
              <span className={styles.realtimeBadge}>
                <span className={styles.liveDot}></span> Temps réel
              </span>
            </div>
            
            <div style={{ flex: 1, minHeight: '400px' }}>
              <ZonesMap zones={data?.zones || []} />
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <h3>Détail — {(data?.zones || [])[0]?.name || 'Aucune zone'}</h3>
              <span className={`${styles.badge} ${getStatusClass((data?.zones || [])[0]?.densityLevel)}`}>
                {getStatusLabel((data?.zones || [])[0]?.densityLevel)}
              </span>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Densité</span>
                <span className={styles.detailValue}>{getProgressWidth((data?.zones || [])[0]?.densityLevel)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dernière mise à jour</span>
                <span className={styles.detailValue}>
                  {(data?.zones || [])[0]?.createdAt ? new Date((data?.zones || [])[0]?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
