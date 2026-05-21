'use client';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_VEHICLES } from '../../lib/queries';
import { Search, Plus, Eye } from 'lucide-react';
import styles from './vehicles.module.css';

export default function VehiclesPage() {
  const { data, loading, error } = useQuery(GET_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className={styles.loading}>Chargement des véhicules...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  const vehicles = data?.vehicles || [];
  
  const stats = {
    total: vehicles.length,
    actifs: vehicles.filter((v: any) => v.status === 'Actif').length,
    inactifs: vehicles.filter((v: any) => v.status === 'Inactif').length,
    enPanne: vehicles.filter((v: any) => v.status === 'En panne').length,
  };

  const filteredVehicles = vehicles.filter((v: any) => 
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Rechercher par plaque, conducteur, modèle..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actions}>
          <select className={styles.filterSelect}>
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>Inactif</option>
            <option>En panne</option>
          </select>
          <button className={styles.addBtn}>
            <Plus size={18} /> Ajouter un véhicule
          </button>
        </div>
      </div>

      <div className={styles.statsBar}>
        <span>Total : {stats.total}</span>
        <span className={styles.statActive}>Actifs : {stats.actifs}</span>
        <span className={styles.statInactive}>Inactifs : {stats.inactifs}</span>
        <span className={styles.statError}>En panne : {stats.enPanne}</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>PLAQUE</th>
              <th>TYPE / MODÈLE</th>
              <th>CONDUCTEUR</th>
              <th>ZONE</th>
              <th>STATUT</th>
              <th>DERNIÈRE POSITION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle: any) => (
              <tr key={vehicle.id}>
                <td className={styles.idCell}>{vehicle.id.slice(0,4)}</td>
                <td className={styles.boldCell}>{vehicle.licensePlate}</td>
                <td>
                  <div className={styles.multilineCell}>
                    <span className={styles.primaryText}>{vehicle.type}</span>
                    <span className={styles.secondaryText}>{vehicle.model}</span>
                  </div>
                </td>
                <td>{vehicle.driverName}</td>
                <td>{vehicle.zoneName}</td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    vehicle.status === 'Actif' ? styles.statusActive : 
                    vehicle.status === 'En panne' ? styles.statusError : styles.statusInactive
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className={styles.timeCell}>{new Date(vehicle.lastPositionTime).toLocaleTimeString()}</td>
                <td>
                  <button className={styles.actionBtn}>
                    <Eye size={16} /> Détail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
