import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Exchange } from './pages/Exchange';
import { Status } from './pages/Status';

type Page = 'home' | 'login' | 'dashboard' | 'exchange' | 'status';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'dashboard':
        return (
          <Layout currentPage="dashboard" onNavigate={handleNavigate}>
            <Dashboard onNavigate={handleNavigate} />
          </Layout>
        );
      case 'exchange':
        return (
          <Layout currentPage="exchange" onNavigate={handleNavigate}>
            <Exchange onNavigate={handleNavigate} />
          </Layout>
        );
      case 'status':
        return (
          <Layout currentPage="status" onNavigate={handleNavigate}>
            <Status onNavigate={handleNavigate} />
          </Layout>
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  if (!isAuthenticated && (currentPage === 'dashboard' || currentPage === 'exchange' || currentPage === 'status')) {
    setCurrentPage('login');
  }

  return renderPage();
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
