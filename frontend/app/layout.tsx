import type { Metadata } from 'next';
import './globals.css';
import ApolloWrapper from '../components/ApolloWrapper';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'UrbanFlow Traffic Management',
  description: 'Professional dashboard for traffic management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ApolloWrapper>
          <div className={styles.appContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
              <Header />
              <main className={styles.pageContent}>
                {children}
              </main>
            </div>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
