document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // Collect user inputs
    const hourlyWage = parseFloat(document.getElementById("hourlyWage").value);
    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    const age = parseInt(document.getElementById("age").value);
    const goal = document.getElementById("goal").value;

    // Calculate monthly income
    const monthlyIncome = hourlyWage * hoursWorked * 4;
    alert(`Monthly Income: $${monthlyIncome.toFixed(2)} \nGoal: ${goal}`);
});

const expenses = [];

document.getElementById("expenseForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // Collect expense data
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    expenses.push({ category, amount, date });
    updateExpenseList();
    updateChart();
});

function updateExpenseList() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement("div");
        expenseItem.textContent = `${expense.date} - ${expense.category}: $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(expenseItem);
    });
}

function updateChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const labels = expenses.map(expense => expense.category);
    const data = expenses.map(expense => expense.amount);
    
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses",
                data: data,
                backgroundColor: "rgba(92, 103, 242, 0.6)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
