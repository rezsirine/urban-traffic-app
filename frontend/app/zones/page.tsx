'use client';
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ZONES } from '../../lib/queries';
import styles from './zones.module.css';

export default function ZonesPage() {
  const { data, loading, error } = useQuery<any>(GET_ZONES);

  const stats = useMemo(() => {
    if (!data) return { faible: 0, moyen: 0, eleve: 0 };
    return {
      faible: (data as any).zones.filter((z: any) => z.densityLevel === 'FAIBLE').length,
      moyen: (data as any).zones.filter((z: any) => z.densityLevel === 'MOYEN').length,
      eleve: (data as any).zones.filter((z: any) => z.densityLevel === 'ELEVE').length,
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
            {(data as any).zones.map((zone: any) => (
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
                  <span>- véhicules</span>
                  <span>- km²</span>
                  <span suppressHydrationWarning>Màj {new Date(zone.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h3>Carte de densité — Alger</h3>
              <span className={styles.realtimeBadge}>
                <span className={styles.liveDot}></span> Temps réel
              </span>
            </div>

            <div className={styles.mapGrid}>
              {(data as any).zones.map((zone: any) => (
                <div key={zone.id} className={`${styles.mapBlock} ${zone.densityLevel === 'ELEVE' ? styles.blockRed :
                    zone.densityLevel === 'MOYEN' ? styles.blockYellow : styles.blockGreen
                  }`}>
                  <div className={styles.blockName}>{zone.name}</div>
                  <div className={styles.blockDensity}>{getProgressWidth(zone.densityLevel)}</div>
                </div>
              ))}
            </div>

            <div className={styles.mapLegend}>
              <span><span className={`${styles.dot} ${styles.dotGreen}`}></span> Faible</span>
              <span><span className={`${styles.dot} ${styles.dotYellow}`}></span> Moyen</span>
              <span><span className={`${styles.dot} ${styles.dotRed}`}></span> Élevé</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <h3>Détail — {(data as any).zones[0]?.name}</h3>
              <span className={`${styles.badge} ${getStatusClass((data as any).zones[0]?.densityLevel)}`}>
                {getStatusLabel((data as any).zones[0]?.densityLevel)}
              </span>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Surface</span>
                <span className={styles.detailValue}>- km²</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Véhicules</span>
                <span className={styles.detailValue}>-</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Densité</span>
                <span className={styles.detailValue}>{getProgressWidth((data as any).zones[0]?.densityLevel)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dernière mise à jour</span>
                <span className={styles.detailValue}>
                  {new Date((data as any).zones[0]?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
