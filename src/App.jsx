import { Navigate, Route, Routes } from 'react-router-dom';
import { ArcadeProvider, useArcade } from './hooks/useArcade';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';

function AppRouter() {
  const { state } = useArcade();

  if (!state.username) {
    return <ProfilePage onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ArcadeProvider>
      <AppRouter />
    </ArcadeProvider>
  );
}
