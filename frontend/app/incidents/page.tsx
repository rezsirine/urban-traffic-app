'use client';
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_INCIDENTS, UPDATE_INCIDENT_STATUS, DECLARE_INCIDENT } from '../../lib/queries';
import { AlertCircle, PenTool, Activity, XCircle, CheckCircle, X } from 'lucide-react';
import styles from './incidents.module.css';

export default function IncidentsPage() {
  const { data, loading, error } = useQuery<any>(GET_INCIDENTS);
  const [updateStatus] = useMutation(UPDATE_INCIDENT_STATUS, {
    refetchQueries: [{ query: GET_INCIDENTS }],
  });
  const [declareIncident] = useMutation(DECLARE_INCIDENT, {
    refetchQueries: [{ query: GET_INCIDENTS }],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ type: 'ACCIDENT', zone: 'Centre-Ville', loc: '', desc: '' });

  const [typeFilter, setTypeFilter] = useState('Tous les types');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');

  const stats = useMemo(() => {
    if (!data) return { signale: 0, enCours: 0, resolu: 0 };
    return {
      signale: (data as any).incidents.filter((i: any) => i.status === 'SIGNALE').length,
      enCours: (data as any).incidents.filter((i: any) => i.status === 'EN_COURS').length,
      resolu: (data as any).incidents.filter((i: any) => i.status === 'RESOLU').length,
    };
  }, [data]);

  const matchType = (type: string, filter: string) => {
    if (filter === 'Tous les types') return true;
    if (filter === 'Accident') return type === 'ACCIDENT';
    if (filter === 'Travaux') return type === 'TRAVAUX';
    if (filter === 'Embouteillage') return type === 'EMBOUTEILLAGE';
    if (filter === 'Route fermée') return type === 'ROUTE_FERMEE';
    return true;
  };

  const matchStatus = (status: string, filter: string) => {
    if (filter === 'Tous les statuts') return true;
    if (filter === 'Signalé') return status === 'SIGNALE';
    if (filter === 'En cours') return status === 'EN_COURS';
    if (filter === 'Résolu') return status === 'RESOLU';
    return true;
  };

  const filteredIncidents = (data?.incidents || []).filter((i: any) =>
    matchType(i.type, typeFilter) && matchStatus(i.status, statusFilter)
  );

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus({ variables: { id, status } });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'ACCIDENT': return <AlertCircle size={20} color="#ef4444" />;
      case 'TRAVAUX': return <PenTool size={20} color="#f59e0b" />;
      case 'EMBOUTEILLAGE': return <Activity size={20} color="#ef4444" />;
      case 'ROUTE_FERMEE': return <XCircle size={20} color="#6b7280" />;
      default: return <AlertCircle size={20} />;
    }
  };

  const formatTitle = (type: string) => {
    switch (type) {
      case 'ACCIDENT': return 'Accident';
      case 'TRAVAUX': return 'Travaux';
      case 'EMBOUTEILLAGE': return 'Embouteillage';
      case 'ROUTE_FERMEE': return 'Route fermée';
      default: return type;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'SIGNALE': return 'Signalé';
      case 'EN_COURS': return 'En cours';
      case 'RESOLU': return 'Résolu';
      default: return status;
    }
  };

  const handleDeclare = async (e: React.FormEvent) => {
    e.preventDefault();
    await declareIncident({
      variables: {
        input: {
          type: newIncident.type,
          description: newIncident.loc + '\n' + newIncident.desc,
          lat: 0,
          lng: 0,
          reportedBy: 'Admin' // En réalité, l'ID de l'utilisateur connecté
        }
      }
    });
    setIsModalOpen(false);
    setNewIncident({ type: 'ACCIDENT', zone: 'Centre-Ville', loc: '', desc: '' });
  };

  if (loading) return <div className={styles.loading}>Chargement des incidents...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select className={styles.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="Tous les types">Tous les types</option>
            <option value="Accident">Accident</option>
            <option value="Travaux">Travaux</option>
            <option value="Embouteillage">Embouteillage</option>
            <option value="Route fermée">Route fermée</option>
          </select>
          <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="Tous les statuts">Tous les statuts</option>
            <option value="Signalé">Signalé</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
          </select>
        </div>
        <button className={styles.declareBtn} onClick={() => setIsModalOpen(true)}>+ Déclarer un incident</button>
      </div>

      <div className={styles.statsBar}>
        <span className={styles.statBadge + ' ' + styles.bgBlue}>Signalé: {stats.signale}</span>
        <span className={styles.statBadge + ' ' + styles.bgYellow}>En cours: {stats.enCours}</span>
        <span className={styles.statBadge + ' ' + styles.bgGreen}>Résolu: {stats.resolu}</span>
      </div>

      <div className={styles.list}>
        {(data as any).incidents.map((incident: any) => (
          <div key={incident.id} className={styles.card}>
            <div className={styles.cardIcon}>
              {getIconForType(incident.type)}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <h3 className={styles.title}>{formatTitle(incident.type)}</h3>
                <span className={`${styles.statusPill} ${incident.status === 'SIGNALE' ? styles.pillBlue :
                    incident.status === 'EN_COURS' ? styles.pillYellow : styles.pillGreen
                  }`}>
                  {formatStatus(incident.status)}
                </span>
                <span className={styles.idText}>{incident.id.split('-')[0].toUpperCase()}</span>
              </div>

              <div className={styles.locationRow}>
                {incident.description.split('\n')[0] || incident.description}
              </div>

              {incident.description.split('\n')[1] && (
                <div className={styles.descRow}>
                  {incident.description.split('\n').slice(1).join(' ')}
                </div>
              )}

              <div className={styles.metaRow}>
                <span>Zone : <b>Alger</b></span>
                <span>Signalé par : <b>{incident.reportedBy}</b></span>
                <span suppressHydrationWarning>{new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              {incident.status === 'SIGNALE' && (
                <button
                  className={styles.actionBtn + ' ' + styles.btnOutlineYellow}
                  onClick={() => handleUpdateStatus(incident.id, 'EN_COURS')}
                >
                  Prendre en charge
                </button>
              )}
              {incident.status !== 'RESOLU' && (
                <button
                  className={styles.actionBtn + ' ' + styles.btnOutlineGreen}
                  onClick={() => handleUpdateStatus(incident.id, 'RESOLU')}
                >
                  Marquer résolu
                </button>
              )}
              {incident.status === 'RESOLU' && (
                <div className={styles.resolvedIcon}>
                  <CheckCircle size={20} color="#10b981" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Déclarer un incident</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleDeclare} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select
                    value={newIncident.type}
                    onChange={e => setNewIncident({ ...newIncident, type: e.target.value })}
                    className={styles.input}
                  >
                    <option value="ACCIDENT">Accident</option>
                    <option value="TRAVAUX">Travaux</option>
                    <option value="EMBOUTEILLAGE">Embouteillage</option>
                    <option value="ROUTE_FERMEE">Route fermée</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Zone</label>
                  <select
                    value={newIncident.zone}
                    onChange={e => setNewIncident({ ...newIncident, zone: e.target.value })}
                    className={styles.input}
                  >
                    <option value="Centre-Ville">Centre-Ville</option>
                    <option value="Bab El Oued">Bab El Oued</option>
                    <option value="El Harrach">El Harrach</option>
                    <option value="Bab Ezzouar">Bab Ezzouar</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Localisation précise</label>
                <input
                  type="text"
                  required
                  placeholder="Rue, carrefour, km..."
                  value={newIncident.loc}
                  onChange={e => setNewIncident({ ...newIncident, loc: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  required
                  placeholder="Décrivez l'incident en détail..."
                  value={newIncident.desc}
                  onChange={e => setNewIncident({ ...newIncident, desc: e.target.value })}
                  className={styles.textarea}
                  rows={4}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Annuler</button>
                <button type="submit" className={styles.submitBtn}>Déclarer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
