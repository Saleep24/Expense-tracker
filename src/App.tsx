import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useStore from './store/useStore';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

function App() {
  const { themeMode } = useStore();

  return (
    <MantineProvider
      defaultColorScheme={themeMode}
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </MantineProvider>
  );
}

export default App;
