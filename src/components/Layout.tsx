import { ReactNode } from 'react';
import { AppShell, Group, Title, ActionIcon, Box, rem, Text, UnstyledButton } from '@mantine/core';
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
    { symbol: '›', label: 'Dashboard', path: '/' },
    { symbol: '•', label: 'Transactions', path: '/transactions' },
    { symbol: '•', label: 'Budget', path: '/budget' },
    { symbol: '•', label: 'Goals', path: '/goals' },
    { symbol: '•', label: 'Settings', path: '/settings' },
  ];

  return (
    <AppShell
      header={{ height: rem(45) }}
      navbar={{ width: rem(160), breakpoint: 'sm' }}
      padding="xs"
    >
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
          <Title order={3} size="h6">Expense Tracker</Title>
          <ActionIcon
            variant="subtle"
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            size="xs"
            radius="xs"
          >
            {themeMode === 'dark' ? <IconSun size={rem(12)} /> : <IconMoon size={rem(12)} />}
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
              <UnstyledButton
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '3px 6px',
                  borderRadius: 'var(--mantine-radius-xs)',
                  backgroundColor:
                    location.pathname === item.path ? 'var(--mantine-color-blue-light)' : 'transparent',
                  transition: 'all 100ms ease',
                  marginBottom: '1px',
                  '&:hover': {
                    backgroundColor: location.pathname === item.path 
                      ? 'var(--mantine-color-blue-light)' 
                      : 'var(--mantine-color-gray-0)',
                  },
                }}
              >
                <Group gap={4} wrap="nowrap">
                  <Text 
                    size="xs"
                    style={{ 
                      color: location.pathname === item.path 
                        ? 'var(--mantine-color-blue-filled)' 
                        : 'var(--mantine-color-gray-6)',
                      opacity: 0.8,
                      width: '8px',
                      fontSize: '10px'
                    }}
                  >
                    {item.symbol}
                  </Text>
                  <Text 
                    size="xs"
                    fw={500}
                    style={{ 
                      color: location.pathname === item.path 
                        ? 'var(--mantine-color-blue-filled)' 
                        : 'var(--mantine-color-gray-7)',
                      fontSize: '12px',
                      letterSpacing: '-0.1px'
                    }}
                  >
                    {item.label}
                  </Text>
                </Group>
              </UnstyledButton>
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