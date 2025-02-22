import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Button,
  Modal,
  Select,
  NumberInput,
  Progress,
  Text,
  Grid,
  ActionIcon,
} from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { calculateBudgetProgress, formatCurrency } from '../utils/helpers';
import { Budget as BudgetType } from '../types';

const defaultCategories = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

const Budget = () => {
  const { budgets, transactions, addBudget, removeBudget, updateBudget, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  const [newBudget, setNewBudget] = useState<{
    category: string;
    amount: number;
    period: 'monthly' | 'yearly';
  }>({
    category: '',
    amount: 0,
    period: 'monthly',
  });

  const handleSubmit = () => {
    const budgetData = {
      ...newBudget,
      id: editingBudget?.id || Math.random().toString(36).substr(2, 9),
      category: {
        id: newBudget.category,
        name: defaultCategories.find(c => c.value === newBudget.category)?.label || '',
        color: '#000',
        icon: '',
      },
      spent: 0,
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
      setEditingBudget(null);
    } else {
      addBudget(budgetData);
    }

    setNewBudget({
      category: '',
      amount: 0,
      period: 'monthly',
    });
    setIsModalOpen(false);
  };

  const handleEdit = (budget: BudgetType) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category.id,
      amount: budget.amount,
      period: budget.period,
    });
    setIsModalOpen(true);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Budget</Title>
        <Button onClick={() => setIsModalOpen(true)}>Add Budget</Button>
      </Group>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
          setNewBudget({
            category: '',
            amount: 0,
            period: 'monthly',
          });
        }}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <Stack gap="md">
          <Select
            label="Category"
            data={defaultCategories}
            value={newBudget.category}
            onChange={(value) => setNewBudget({ ...newBudget, category: value || '' })}
            required
          />
          <NumberInput
            label="Amount"
            value={newBudget.amount}
            onChange={(value) => setNewBudget({ ...newBudget, amount: Number(value) || 0 })}
            required
            min={0}
            decimalScale={2}
            prefix={user?.currency === 'USD' ? '$' : ''}
          />
          <Select
            label="Period"
            data={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={newBudget.period}
            onChange={(value) => setNewBudget({ ...newBudget, period: (value as 'monthly' | 'yearly') || 'monthly' })}
            required
          />
          <Button onClick={handleSubmit} fullWidth mt="md">
            {editingBudget ? 'Update' : 'Add'} Budget
          </Button>
        </Stack>
      </Modal>

      <Grid>
        {budgets.map((budget) => {
          const progress = calculateBudgetProgress(budget, transactions);
          const isOverBudget = progress > 100;

          return (
            <Grid.Col key={budget.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500} size="lg">{budget.category.name}</Text>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(budget)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => removeBudget(budget.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Text c="dimmed" size="sm" mb="md">
                  {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                </Text>

                <Text fw={500} mb="xs">
                  {formatCurrency(budget.amount, user?.currency)}
                </Text>

                <Progress
                  value={Math.min(progress, 100)}
                  color={isOverBudget ? 'red' : progress > 80 ? 'yellow' : 'blue'}
                  mb="xs"
                />

                <Group justify="space-between" align="center">
                  <Text size="sm" c={isOverBudget ? 'red' : undefined}>
                    Spent: {formatCurrency(budget.spent, user?.currency)}
                  </Text>
                  <Text size="sm" c={isOverBudget ? 'red' : undefined}>
                    {progress.toFixed(1)}%
                  </Text>
                </Group>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default Budget; 