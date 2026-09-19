import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicPage } from './components/public/PublicPage';
import { TrackRequestPage } from './components/public/TrackRequestPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';

const MainRouter: React.FC = () => {
  const { isAdminRoute, isTrackingRoute, isAuthenticated } = useApp();

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminLayout />;
  }

  if (isTrackingRoute) {
    return <TrackRequestPage />;
  }

  return <PublicPage />;
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
