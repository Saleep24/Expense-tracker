import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Progress,
  Text,
  Grid,
  ActionIcon,
  RingProgress,
  Select,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/helpers';
import { FinancialGoal } from '../types';

const defaultCategories = [
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const Goals = () => {
  const { goals, addGoal, removeGoal, updateGoal, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [newGoal, setNewGoal] = useState<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    category: string;
  }>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date(),
    category: '',
  });

  const handleSubmit = () => {
    const goalData = {
      ...newGoal,
      id: editingGoal?.id || Math.random().toString(36).substr(2, 9),
      category: {
        id: newGoal.category,
        name: defaultCategories.find(c => c.value === newGoal.category)?.label || '',
        color: '#000',
        icon: '',
      },
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
      setEditingGoal(null);
    } else {
      addGoal(goalData);
    }

    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date(),
      category: '',
    });
    setIsModalOpen(false);
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: new Date(goal.deadline),
      category: goal.category.id,
    });
    setIsModalOpen(true);
  };

  const calculateDaysLeft = (deadline: Date) => {
    const today = new Date();
    const daysLeft = Math.ceil((new Date(deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Financial Goals</Title>
        <Button onClick={() => setIsModalOpen(true)}>Add Goal</Button>
      </Group>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
          setNewGoal({
            name: '',
            targetAmount: 0,
            currentAmount: 0,
            deadline: new Date(),
            category: '',
          });
        }}
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
      >
        <Stack gap="md">
          <TextInput
            label="Goal Name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            required
          />
          <NumberInput
            label="Target Amount"
            value={newGoal.targetAmount}
            onChange={(value) => setNewGoal({ ...newGoal, targetAmount: Number(value) || 0 })}
            required
            min={0}
            decimalScale={2}
            prefix={user?.currency === 'USD' ? '$' : ''}
          />
          <NumberInput
            label="Current Amount"
            value={newGoal.currentAmount}
            onChange={(value) => setNewGoal({ ...newGoal, currentAmount: Number(value) || 0 })}
            required
            min={0}
            decimalScale={2}
            prefix={user?.currency === 'USD' ? '$' : ''}
          />
          <DateInput
            label="Deadline"
            value={newGoal.deadline}
            onChange={(value) => setNewGoal({ ...newGoal, deadline: value || new Date() })}
            required
            minDate={new Date()}
          />
          <Select
            label="Category"
            data={defaultCategories}
            value={newGoal.category}
            onChange={(value: string | null) => setNewGoal({ ...newGoal, category: value || '' })}
            required
          />
          <Button onClick={handleSubmit} fullWidth mt="md">
            {editingGoal ? 'Update' : 'Add'} Goal
          </Button>
        </Stack>
      </Modal>

      <Grid>
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysLeft = calculateDaysLeft(goal.deadline);
          const isOverdue = daysLeft < 0;

          return (
            <Grid.Col key={goal.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500} size="lg">{goal.name}</Text>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(goal)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => removeGoal(goal.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Text c="dimmed" size="sm" mb="md">
                  {goal.category.name}
                </Text>

                <Group justify="space-between" align="center" mb="md">
                  <Stack gap="xs">
                    <Text size="sm">Target: {formatCurrency(goal.targetAmount, user?.currency)}</Text>
                    <Text size="sm">Current: {formatCurrency(goal.currentAmount, user?.currency)}</Text>
                    <Text size="sm" c={isOverdue ? 'red' : undefined}>
                      {isOverdue ? 'Overdue' : `${daysLeft} days left`}
                    </Text>
                  </Stack>
                  <RingProgress
                    size={80}
                    thickness={8}
                    sections={[{ value: Math.min(progress, 100), color: 'blue' }]}
                    label={
                      <Text c="blue" fw={700} ta="center" size="xs">
                        {progress.toFixed(0)}%
                      </Text>
                    }
                  />
                </Group>

                <Progress
                  value={Math.min(progress, 100)}
                  color={progress >= 100 ? 'green' : isOverdue ? 'red' : 'blue'}
                />
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default Goals; 