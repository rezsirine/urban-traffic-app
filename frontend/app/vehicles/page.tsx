'use client';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_VEHICLES, ADD_VEHICLE } from '../../lib/queries';
import { Search, Plus, Eye, X } from 'lucide-react';
import Link from 'next/link';
import styles from './vehicles.module.css';

export default function VehiclesPage() {
  const { data, loading, error } = useQuery(GET_VEHICLES);
  const [addVehicle] = useMutation(ADD_VEHICLE, {
    refetchQueries: [{ query: GET_VEHICLES }],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ licensePlate: '', type: 'Bus', status: 'Actif' });

  if (loading) return <div className={styles.loading}>Chargement des véhicules...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  const vehicles = (data as any)?.vehicles || [];
  
  const stats = {
    total: vehicles.length,
    actifs: vehicles.filter((v: any) => v.status === 'Actif').length,
    inactifs: vehicles.filter((v: any) => v.status === 'Inactif').length,
    enPanne: vehicles.filter((v: any) => v.status === 'En panne').length,
  };

  const filteredVehicles = vehicles.filter((v: any) => 
    (statusFilter === 'Tous les statuts' || v.status === statusFilter) &&
    (v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
     v.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVehicle({ variables: { input: newVehicle } });
    setIsModalOpen(false);
    setNewVehicle({ licensePlate: '', type: 'Bus', status: 'Actif' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Rechercher par plaque ou type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actions}>
          <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Tous les statuts">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="En panne">En panne</option>
          </select>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
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
              <th>TYPE</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle: any) => (
              <tr key={vehicle.id}>
                <td className={styles.idCell}>{vehicle.id.slice(0,4)}</td>
                <td className={styles.boldCell}>{vehicle.licensePlate}</td>
                <td>
                  <span className={styles.primaryText}>{vehicle.type}</span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    vehicle.status === 'Actif' ? styles.statusActive : 
                    vehicle.status === 'En panne' ? styles.statusError : styles.statusInactive
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>
                  <Link href={`/vehicles/${vehicle.id}`} className={styles.actionBtn}>
                    <Eye size={16} /> Détail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Ajouter un véhicule</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddVehicle} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Plaque d'immatriculation</label>
                <input 
                  type="text" 
                  required 
                  placeholder="ex: 16-1234-ALG"
                  value={newVehicle.licensePlate}
                  onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type de véhicule</label>
                <select 
                  value={newVehicle.type}
                  onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                  className={styles.input}
                >
                  <option value="Bus">Bus</option>
                  <option value="Tram">Tram</option>
                  <option value="Métro">Métro</option>
                  <option value="Voiture de service">Voiture de service</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Statut</label>
                <select 
                  value={newVehicle.status}
                  onChange={e => setNewVehicle({...newVehicle, status: e.target.value})}
                  className={styles.input}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En panne">En panne</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Annuler</button>
                <button type="submit" className={styles.submitBtn}>Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
