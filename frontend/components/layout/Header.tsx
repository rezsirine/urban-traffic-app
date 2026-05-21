'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Tableau de bord';
      case '/vehicles': return 'Gestion des véhicules';
      case '/zones': return 'Zones de trafic';
      case '/incidents': return 'Incidents';
      default: return 'UrbanFlow';
    }
  };

  const getPageSubtitle = () => {
    const today = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    switch (pathname) {
      case '/': return `Vue d'ensemble — ${today}`;
      case '/vehicles': return 'Flotte en service — Wilaya d\'Alger';
      case '/zones': return 'Densité et supervision en temps réel';
      default: return '';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{getPageTitle()}</h1>
        <p className={styles.subtitle}>{getPageSubtitle()}</p>
      </div>
      <div className={styles.actions}>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          Système opérationnel
        </div>
        <button className={styles.notifBtn}>
          <Bell size={20} />
          <span className={styles.notifIndicator}></span>
        </button>
      </div>
    </header>
  );
}
