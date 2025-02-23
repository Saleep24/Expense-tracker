import { ReactNode } from 'react';
import { AppShell, Group, Title, ActionIcon, Box, rem, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { IconSun, IconMoon } from '@tabler/icons-react';
import useStore from '../store/useStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { themeMode, setThemeMode } = useStore();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budget', path: '/budget' },
    { label: 'Goals', path: '/goals' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <AppShell
      header={{ height: rem(60) }}
      navbar={{ width: rem(200), breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Title order={3}>Expense Tracker</Title>
          <ActionIcon
            variant="default"
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            size="md"
          >
            {themeMode === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
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
              <Box
                p="xs"
                style={{
                  backgroundColor:
                    location.pathname === item.path ? 'var(--mantine-color-blue-light)' : 'transparent',
                  borderRadius: 'var(--mantine-radius-sm)',
                  marginBottom: '4px',
                }}
              >
                <Text 
                  size="sm"
                  fw={500}
                  c={location.pathname === item.path ? 'blue' : undefined}
                >
                  {item.label}
                </Text>
              </Box>
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