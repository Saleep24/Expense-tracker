import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Button,
  TextInput,
  NumberInput,
  Select,
  Text,
  Divider,
  Switch,
} from '@mantine/core';
import useStore from '../store/useStore';

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
];

const Settings = () => {
  const { user, setUser, themeMode, setThemeMode } = useStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    monthlyIncome: user?.monthlyIncome || 0,
  });

  const handleSubmit = () => {
    setUser({
      ...user,
      ...formData,
      id: user?.id || Math.random().toString(36).substr(2, 9),
      budgets: user?.budgets || [],
      goals: user?.goals || [],
    });
  };

  const handleExportData = () => {
    const data = {
      user,
      transactions: useStore.getState().transactions,
      budgets: useStore.getState().budgets,
      goals: useStore.getState().goals,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-tracker-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Settings</Title>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Profile Settings</Title>
          
          <TextInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
          />
          
          <TextInput
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            type="email"
          />
          
          <NumberInput
            label="Monthly Income"
            value={formData.monthlyIncome}
            onChange={(value) => setFormData({ ...formData, monthlyIncome: Number(value) || 0 })}
            min={0}
            decimalScale={2}
            prefix={formData.currency === 'USD' ? '$' : ''}
          />
          
          <Select
            label="Currency"
            data={currencies}
            value={formData.currency}
            onChange={(value: string | null) => setFormData({ ...formData, currency: value || 'USD' })}
          />
          
          <Button onClick={handleSubmit} mt="md">
            Save Changes
          </Button>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Appearance</Title>
          
          <Group justify="space-between">
            <Stack gap={0}>
              <Text>Dark Mode</Text>
              <Text size="sm" c="dimmed">
                Switch between light and dark theme
              </Text>
            </Stack>
            <Switch
              checked={themeMode === 'dark'}
              onChange={(e) => setThemeMode(e.currentTarget.checked ? 'dark' : 'light')}
              size="lg"
            />
          </Group>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Data Management</Title>
          
          <Group justify="space-between">
            <Stack gap={0}>
              <Text>Export Data</Text>
              <Text size="sm" c="dimmed">
                Download all your data as JSON
              </Text>
            </Stack>
            <Button variant="light" onClick={handleExportData}>
              Export
            </Button>
          </Group>

          <Divider />

          <Group justify="space-between">
            <Stack gap={0}>
              <Text c="red">Delete Account</Text>
              <Text size="sm" c="dimmed">
                This action cannot be undone
              </Text>
            </Stack>
            <Button
              color="red"
              variant="light"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  setUser(null);
                }
              }}
            >
              Delete Account
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Settings; 