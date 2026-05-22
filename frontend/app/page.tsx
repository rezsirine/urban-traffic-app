'use client';
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_DATA } from '../lib/queries';
import { Car, Map, AlertTriangle, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styles from './page.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { data, loading, error } = useQuery<any>(GET_DASHBOARD_DATA);

  const stats = useMemo(() => {
    if (!data) return { vehicles: 0, zones: 0, incidents: 0 };
    return {
      vehicles: (data as any).vehicles.filter((v: any) => v.status === 'Actif').length || (data as any).vehicles.length,
      zones: (data as any).zones.filter((z: any) => z.densityLevel === 'ELEVE').length || 0,
      incidents: (data as any).incidents.filter((i: any) => i.status === 'EN_COURS').length || (data as any).incidents.length,
    };
  }, [data]);

  const lineChartData = {
    labels: ['06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h'],
    datasets: [
      {
        label: 'Centre-Ville',
        data: [25, 40, 75, 80, 65, 60, 60, 74, 85],
        borderColor: '#1A56DB',
        backgroundColor: 'rgba(26, 86, 219, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Bab El Oued',
        data: [25, 42, 78, 82, 63, 58, 62, 75, 88],
        borderColor: '#ef4444',
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: 'El Harrach',
        data: [25, 40, 75, 80, 65, 60, 60, 74, 85],
        borderColor: '#10b981',
        borderDash: [2, 2],
        tension: 0.4,
      }
    ],
  };

  const barChartData = {
    labels: ['Accident', 'Travaux', 'Route fermée', 'Embouteillage'],
    datasets: [
      {
        data: [12, 7, 4, 18],
        backgroundColor: ['#1A56DB', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  if (loading) return <div className={styles.loading}>Chargement des données...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;
  if (!data) return <div className={styles.loading}>Aucune donnée disponible.</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.iconWrapper} style={{ color: '#1A56DB', backgroundColor: '#eff6ff' }}>
              <Car size={20} />
            </div>
            <span className={styles.kpiTrend} style={{ color: '#10b981' }}>
              <ArrowUpRight size={16} /> +2 ce matin
            </span>
          </div>
          <div className={styles.kpiValue}>{stats.vehicles}</div>
          <div className={styles.kpiLabel}>Véhicules actifs</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.iconWrapper} style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }}>
              <Map size={20} />
            </div>
            <span className={styles.kpiTrend} style={{ color: '#6b7280' }}>
              2 zone(s) rouge
            </span>
          </div>
          <div className={styles.kpiValue}>{(data as any).zones?.length ?? 0}</div>
          <div className={styles.kpiLabel}>Zones surveillées</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.iconWrapper} style={{ color: '#f59e0b', backgroundColor: '#fffbeb' }}>
              <AlertTriangle size={20} />
            </div>
            <span className={styles.kpiTrend} style={{ color: '#ef4444' }}>
              <ArrowDownRight size={16} /> -1 depuis hier
            </span>
          </div>
          <div className={styles.kpiValue}>{stats.incidents}</div>
          <div className={styles.kpiLabel}>Incidents actifs</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.iconWrapper} style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
              <Bell size={20} />
            </div>
            <span className={styles.kpiTrend} style={{ color: '#10b981' }}>
              <ArrowUpRight size={16} /> 3 prioritaires
            </span>
          </div>
          <div className={styles.kpiValue}>3</div>
          <div className={styles.kpiLabel}>Notifications non lues</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`${styles.card} ${styles.densityChartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Densité du trafic — Aujourd'hui</h3>
            <span className={styles.dateBadge}>21 mai 2026</span>
          </div>
          <div className={styles.chartContainer}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.incidentsChartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Incidents par type</h3>
            <p className={styles.cardSubtitle}>30 derniers jours</p>
          </div>
          <div className={styles.chartContainer}>
            <Bar data={barChartData} options={{...chartOptions, indexAxis: 'y'}} />
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={`${styles.card} ${styles.recentIncidents}`}>
          <div className={styles.cardHeader}>
            <h3>Incidents récents</h3>
            <a href="/incidents" className={styles.link}>Voir tout &rarr;</a>
          </div>
          <div className={styles.incidentList}>
            {(data as any).incidents.slice(0,3).map((incident: any) => (
              <div key={incident.id} className={styles.incidentItem}>
                <div className={styles.incidentIcon}>
                  <AlertTriangle size={16} color="#ef4444" />
                </div>
                <div className={styles.incidentInfo}>
                  <div className={styles.incidentTop}>
                    <h4>{incident.type}</h4>
                    <span className={styles.badge}>{incident.status}</span>
                  </div>
                  <p>{incident.location}</p>
                  <span>{new Date(incident.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.zoneStatus}`}>
          <div className={styles.cardHeader}>
            <h3>État des zones</h3>
            <a href="/zones" className={styles.link}>Voir tout &rarr;</a>
          </div>
          <div className={styles.zoneList}>
            {(data as any).zones.slice(0, 5).map((zone: any) => {
              const level = (zone.densityLevel || zone.level || 'NORMAL').toLowerCase();
              const displayLevel = (zone.densityLevel || zone.level || 'NORMAL');
              return (
                <div key={zone.id} className={styles.zoneItem}>
                  <div className={styles.zoneTop}>
                    <h4>{zone.name}</h4>
                    <span className={`${styles.zoneBadge} ${styles[level] || ''}`}>
                      {displayLevel}
                    </span>
                  </div>
                  <div className={styles.progressContainer}>
                    <div 
                      className={`${styles.progressBar} ${styles[`bg-${level}`] || ''}`} 
                      style={{ width: level === 'eleve' ? '85%' : level === 'moyen' ? '55%' : '25%' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
