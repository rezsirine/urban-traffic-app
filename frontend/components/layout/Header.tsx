'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_NOTIFICATIONS } from '../../lib/queries';
import { io } from 'socket.io-client';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [userId, setUserId] = React.useState('Admin');

  React.useEffect(() => {
    let uid = 'Admin';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        uid = u.id || u.role; // using role if id is somehow missing, but normally u.id
      } catch(e) {}
    }
    setUserId(uid);
    setMounted(true);
  }, []);

  const { data, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { userId },
    skip: !mounted || !userId,
  });

  React.useEffect(() => {
    if (!mounted || !userId) return;
    
    // Connect to WebSockets for real-time notifications
    const socket = io('http://localhost:3005');
    socket.on(`notification_${userId}`, (newNotif) => {
      // Refetch when a new notification comes in
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [mounted, userId, refetch]);
  
  const unreadCount = data?.notifications?.filter((n: any) => !n.isRead).length || 0;

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
        <p className={styles.subtitle}>{mounted ? getPageSubtitle() : ''}</p>
      </div>
      <div className={styles.actions}>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          Système opérationnel
        </div>
        <Link href="/notifications" className={styles.notifBtn}>
          <Bell size={20} />
          {mounted && unreadCount > 0 && (
            <span className={styles.notifIndicator}>{unreadCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
