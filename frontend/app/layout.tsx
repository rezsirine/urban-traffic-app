import type { Metadata } from 'next';
import './globals.css';
import ApolloWrapper from '../components/ApolloWrapper';
import LayoutWrapper from './LayoutWrapper';

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
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ApolloWrapper>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ApolloWrapper>
      </body>
    </html>
  );
}
