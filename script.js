const userForm = document.getElementById('userForm');
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const earningsDisplay = document.getElementById('earningsDisplay'); // New element to display earnings
const ctx = document.getElementById('expenseChart').getContext('2d');

let expenses = [];
let chart;

// Handle user information submission
userForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const hourlyWage = parseFloat(document.getElementById('hourlyWage').value);
    const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);
    const age = parseInt(document.getElementById('age').value);
    const goal = document.getElementById('goal').value;

    const totalEarnings = hourlyWage * hoursWorked; // Calculate total earnings

    // Display the total earnings on the page
    earningsDisplay.textContent = `Total Earnings: $${totalEarnings.toFixed(2)}`;

    console.log(`Hourly Wage: $${hourlyWage}, Hours Worked: ${hoursWorked}, Age: ${age}, Goal: ${goal}, Total Earnings: $${totalEarnings.toFixed(2)}`);

    userForm.reset();
});

// Handle expense submission
expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = new Date(document.getElementById('date').value);

    // Add expense to the list
    expenses.push({ category, amount, date });
    displayExpenses();
    updateChart();
    expenseForm.reset();
});

// Display expenses in a list
function displayExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.textContent = `${expense.date.toLocaleDateString()}: ${expense.category} - $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(expenseItem);
    });
}

function updateChart() {
    const expenseMap = {};


    expenses.forEach(exp => {
        if (!expenseMap[exp.category]) {
            expenseMap[exp.category] = [];
        }
        expenseMap[exp.category].push({ date: exp.date.toLocaleDateString(), amount: exp.amount });
    });

    const labels = Object.keys(expenseMap);
    const datasets = [];


    labels.forEach(label => {
        const data = expenseMap[label];
        data.forEach((entry, index) => {
            if (!datasets[index]) {
                datasets[index] = {
                    label: entry.date,
                    data: new Array(labels.length).fill(0), 
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Random color
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                    borderWidth: 1,
                };
            }
            datasets[index].data[labels.indexOf(label)] += entry.amount; 
        });
    });

    if (chart) {
        chart.destroy(); 
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Expenses',
                    },
                }
            }
        }
    });
}
