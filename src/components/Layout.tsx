import { ReactNode } from 'react';
import { AppShell, Group, Title, ActionIcon, Box, rem, Text } from '@mantine/core';
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
      header={{ height: rem(60) }}
      navbar={{ width: rem(240), breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Title order={2} size="h4">Expense Tracker</Title>
          <ActionIcon
            variant="light"
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            size="md"
            radius="md"
          >
            {themeMode === 'dark' ? <IconSun size={rem(18)} /> : <IconMoon size={rem(18)} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Box>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group
                py="xs"
                px="sm"
                style={{
                  backgroundColor:
                    location.pathname === item.path ? 'var(--mantine-color-blue-light)' : 'transparent',
                  borderRadius: 'var(--mantine-radius-sm)',
                  marginBottom: 'var(--mantine-spacing-xs)',
                  transition: 'background-color 150ms ease',
                }}
              >
                <item.icon 
                  size={rem(18)} 
                  style={{ 
                    color: location.pathname === item.path 
                      ? 'var(--mantine-color-blue-filled)' 
                      : 'var(--mantine-color-dimmed)' 
                  }} 
                />
                <Text 
                  size="sm" 
                  fw={500}
                  style={{ 
                    color: location.pathname === item.path 
                      ? 'var(--mantine-color-blue-filled)' 
                      : 'inherit'
                  }}
                >
                  {item.label}
                </Text>
              </Group>
            </Link>
          ))}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Box p="md">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout; 