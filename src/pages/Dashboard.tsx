import { Grid, Paper, Text, Title, Group, RingProgress } from '@mantine/core';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import useStore from '../store/useStore';
import { 
  calculateTotalExpenses, 
  calculateTotalIncome, 
  calculateSavingsRate,
  formatCurrency,
  generateDateRanges 
} from '../utils/helpers';

const Dashboard = () => {
  const { transactions, user } = useStore();
  const dateRanges = generateDateRanges();

  const monthlyExpenses = calculateTotalExpenses(transactions, dateRanges.thisMonth);
  const monthlyIncome = calculateTotalIncome(transactions, dateRanges.thisMonth);
  const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses);

  // Generate data for the spending trend chart
  const last3MonthsData = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date.toISOString().split('T')[0] === dateStr
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: dateStr,
      amount: dayExpenses
    };
  }).reverse();

  return (
    <div>
      <Title order={2} mb="md">Dashboard</Title>
      
      <Grid>
        {/* Overview Cards */}
        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">Monthly Income</Text>
            </Group>
            <Text fw={700} size="xl">
              {formatCurrency(monthlyIncome, user?.currency)}
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">Monthly Expenses</Text>
            </Group>
            <Text fw={700} size="xl" c={monthlyExpenses > monthlyIncome ? 'red' : undefined}>
              {formatCurrency(monthlyExpenses, user?.currency)}
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">Savings Rate</Text>
            </Group>
            <Group justify="space-between" align="center">
              <Text fw={700} size="xl">
                {savingsRate.toFixed(1)}%
              </Text>
              <RingProgress
                size={80}
                thickness={8}
                sections={[{ value: savingsRate, color: 'blue' }]}
                label={
                  <Text c="blue" fw={700} ta="center" size="xs">
                    {savingsRate.toFixed(0)}%
                  </Text>
                }
              />
            </Group>
          </Paper>
        </Grid.Col>

        {/* Spending Trend Chart */}
        <Grid.Col span={12}>
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Spending Trend</Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last3MonthsData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1971c2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1971c2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    interval={14}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value, user?.currency)}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value, user?.currency)}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#1971c2"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard; 