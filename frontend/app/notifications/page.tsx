'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ } from '../../lib/queries';
import { AlertCircle, AlertTriangle, Bell, CheckCircle2 } from 'lucide-react';
import { io } from 'socket.io-client';
import styles from './notifications.module.css';

export default function NotificationsPage() {
  // Using a hardcoded userId "admin-1" for demo purposes or it should come from context
  const { data, loading, error } = useQuery<any>(GET_NOTIFICATIONS, {
    variables: { userId: 'admin-1' },
    fetchPolicy: 'network-only' // always fetch latest
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS, variables: { userId: 'Admin' } }],
  });

  useEffect(() => {
    setMounted(true);
    const socket = io('http://localhost:3005');
    socket.on('notification_Admin', () => {
      refetch();
    });
    return () => { socket.disconnect(); };
  }, [refetch]);

  const unreadNotifs = useMemo(() => {
    return data?.notifications?.filter((n: any) => !n.isRead) || [];
  }, [data]);

  const readNotifs = useMemo(() => {
    return data?.notifications?.filter((n: any) => n.isRead) || [];
  }, [data]);

  const handleMarkAsRead = (id: string) => {
    markAsRead({ variables: { id } });
  };

  const handleMarkAllAsRead = () => {
    unreadNotifs.forEach((n: any) => {
      markAsRead({ variables: { id: n.id } });
    });
  };

  const getIcon = (title: string, isRead: boolean) => {
    if (isRead) return <CheckCircle2 size={20} color="#9ca3af" />;
    if (title.toLowerCase().includes('rouge') || title.toLowerCase().includes('danger')) {
      return <AlertCircle size={20} color="#ef4444" />;
    }
    if (title.toLowerCase().includes('incident') || title.toLowerCase().includes('panne')) {
      return <AlertTriangle size={20} color="#f59e0b" />;
    }
    return <Bell size={20} color="#3b82f6" />;
  };

  const getBadgeClass = (title: string) => {
    if (title.toLowerCase().includes('rouge') || title.toLowerCase().includes('danger')) {
      return styles.badgeDanger;
    }
    if (title.toLowerCase().includes('incident') || title.toLowerCase().includes('panne')) {
      return styles.badgeWarning;
    }
    return styles.badgeInfo;
  };

  const getBadgeLabel = (title: string) => {
    if (title.toLowerCase().includes('rouge') || title.toLowerCase().includes('danger')) return 'danger';
    if (title.toLowerCase().includes('incident') || title.toLowerCase().includes('panne')) return 'warning';
    return 'info';
  };

  if (loading) return <div className={styles.loading}>Chargement des notifications...</div>;
  // Ignoring errors to show empty state if API fails for this specific mock user
  // if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.unreadBadge}>
          {unreadNotifs.length} non lue(s)
        </div>
        <button className={styles.markAllBtn} onClick={handleMarkAllAsRead} disabled={unreadNotifs.length === 0}>
          <CheckCircle2 size={16} /> Tout marquer comme lu
        </button>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>NON LUES</h3>
        <div className={styles.list}>
          {unreadNotifs.length === 0 ? (
            <div className={styles.empty}>Aucune notification non lue.</div>
          ) : (
            unreadNotifs.map((notif: any) => (
              <div key={notif.id} className={`${styles.card} ${styles.unreadCard}`}>
                <div className={styles.iconWrapper}>
                  {getIcon(notif.title, false)}
                </div>
                <div className={styles.content}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleGroup}>
                      <h4>{notif.title}</h4>
                      <span className={`${styles.badge} ${getBadgeClass(notif.title)}`}>
                        {getBadgeLabel(notif.title)}
                      </span>
                    </div>
                    <button className={styles.markReadText} onClick={() => handleMarkAsRead(notif.id)}>
                      Marquer lu
                    </button>
                  </div>
                  <p className={styles.message}>{notif.message}</p>
                  <span className={styles.time} suppressHydrationWarning>
                    Aujourd'hui à {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>LUES</h3>
        <div className={styles.list}>
          {readNotifs.length === 0 ? (
            <div className={styles.empty}>Aucune notification lue.</div>
          ) : (
            readNotifs.map((notif: any) => (
              <div key={notif.id} className={`${styles.card} ${styles.readCard}`}>
                <div className={styles.iconWrapper}>
                  {getIcon(notif.title, true)}
                </div>
                <div className={styles.content}>
                  <div className={styles.cardHeader}>
                    <h4>{notif.title}</h4>
                  </div>
                  <p className={styles.message}>{notif.message}</p>
                  <span className={styles.time} suppressHydrationWarning>
                    Aujourd'hui à {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
