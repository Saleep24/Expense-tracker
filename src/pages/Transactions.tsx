import { useState } from 'react';
import {
  Paper,
  Title,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Table,
  Text,
  ActionIcon,
  Modal,
  Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/helpers';
import { Transaction } from '../types';

const defaultCategories = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

const Transactions = () => {
  const { transactions, addTransaction, removeTransaction, updateTransaction, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<{
    description: string;
    amount: number;
    category: string;
    date: Date;
    type: 'expense' | 'income';
  }>({
    description: '',
    amount: 0,
    category: '',
    date: new Date(),
    type: 'expense',
  });

  const handleSubmit = () => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        ...newTransaction,
        id: editingTransaction.id,
        category: {
          id: newTransaction.category,
          name: defaultCategories.find(c => c.value === newTransaction.category)?.label || '',
          color: '#000',
          icon: '',
        },
      });
      setEditingTransaction(null);
    } else {
      addTransaction({
        ...newTransaction,
        id: Math.random().toString(36).substr(2, 9),
        category: {
          id: newTransaction.category,
          name: defaultCategories.find(c => c.value === newTransaction.category)?.label || '',
          color: '#000',
          icon: '',
        },
      });
    }
    
    setNewTransaction({
      description: '',
      amount: 0,
      category: '',
      date: new Date(),
      type: 'expense',
    });
    setIsModalOpen(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category.id,
      date: new Date(transaction.date),
      type: transaction.type,
    });
    setIsModalOpen(true);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Transactions</Title>
        <Button onClick={() => setIsModalOpen(true)}>Add Transaction</Button>
      </Group>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
          setNewTransaction({
            description: '',
            amount: 0,
            category: '',
            date: new Date(),
            type: 'expense',
          });
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <Stack gap="md">
          <TextInput
            label="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            required
          />
          <NumberInput
            label="Amount"
            value={newTransaction.amount}
            onChange={(value) => setNewTransaction({ ...newTransaction, amount: Number(value) || 0 })}
            required
            min={0}
            decimalScale={2}
            prefix={user?.currency === 'USD' ? '$' : ''}
          />
          <Select
            label="Category"
            data={defaultCategories}
            value={newTransaction.category}
            onChange={(value) => setNewTransaction({ ...newTransaction, category: value || '' })}
            required
          />
          <DateInput
            label="Date"
            value={newTransaction.date}
            onChange={(value) => setNewTransaction({ ...newTransaction, date: value || new Date() })}
            required
          />
          <Select
            label="Type"
            data={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
            value={newTransaction.type}
            onChange={(value) => setNewTransaction({ ...newTransaction, type: (value as 'expense' | 'income') || 'expense' })}
            required
          />
          <Button onClick={handleSubmit} fullWidth mt="md">
            {editingTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </Stack>
      </Modal>

      <Paper p="md" radius="md" withBorder>
        <Box style={{ overflowX: 'auto' }}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedTransactions.map((transaction) => (
                <Table.Tr key={transaction.id}>
                  <Table.Td>{new Date(transaction.date).toLocaleDateString()}</Table.Td>
                  <Table.Td>{transaction.description}</Table.Td>
                  <Table.Td>{transaction.category.name}</Table.Td>
                  <Table.Td>
                    <Text c={transaction.type === 'expense' ? 'red' : 'green'} fw={500}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text c={transaction.type === 'expense' ? 'red' : 'green'} fw={500}>
                      {formatCurrency(transaction.amount, user?.currency)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(transaction)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => removeTransaction(transaction.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Transactions; 