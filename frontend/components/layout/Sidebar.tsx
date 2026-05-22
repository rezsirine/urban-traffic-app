'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CarFront, Map, AlertTriangle, Bell, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/vehicles', label: 'Véhicules', icon: CarFront },
    { path: '/zones', label: 'Zones de trafic', icon: Map },
    { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { path: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h4l2-6 4 12 2-6h4" />
          </svg>
        </div>
        <div className={styles.logoText}>
          <h2>UrbanFlow</h2>
          <span>Traffic Management</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link href={item.path} key={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <Icon className={styles.icon} size={20} />
              <span className={styles.label}>{item.label}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>{user ? getInitials(user.name) : 'MA'}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user ? user.name : 'Utilisateur'}</span>
          <span className={styles.userRole}>{user ? user.role : 'OPERATOR'}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Se déconnecter">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
