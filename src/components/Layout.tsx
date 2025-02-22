import { ReactNode } from 'react';
import { AppShell, Group, Title, ActionIcon, Box, rem } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconReceipt,
  IconPigMoney,
  IconTarget,
  IconSettings,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import useStore from '../store/useStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { themeMode, setThemeMode } = useStore();

  const navItems = [
    { icon: IconDashboard, label: 'Dashboard', path: '/' },
    { icon: IconReceipt, label: 'Transactions', path: '/transactions' },
    { icon: IconPigMoney, label: 'Budget', path: '/budget' },
    { icon: IconTarget, label: 'Goals', path: '/goals' },
    { icon: IconSettings, label: 'Settings', path: '/settings' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
          <Title order={1} size="h3">Expense Tracker</Title>
          <ActionIcon
            variant="default"
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            size="lg"
          >
            {themeMode === 'dark' ? <IconSun size={rem(16)} /> : <IconMoon size={rem(16)} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <Box>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group
                p="xs"
                style={{
                  backgroundColor:
                    location.pathname === item.path ? 'var(--mantine-color-blue-light)' : 'transparent',
                  borderRadius: 'var(--mantine-radius-sm)',
                  marginBottom: 'var(--mantine-spacing-xs)',
                }}
              >
                <item.icon size={rem(20)} />
                <Box style={{ flex: 1 }}>{item.label}</Box>
              </Group>
            </Link>
          ))}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout; 