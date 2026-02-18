document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
});

function updateDashboard() {
  const transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');

  // Calculate Stats
  let totalBalance = 0;
  let monthlySpend = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    const amount = parseFloat(tx.amount);

    // Assume "Income" category adds to balance, others subtract
    if (tx.category.toLowerCase() === 'income') {
      totalBalance += amount;
    } else {
      totalBalance -= amount;
      // Calculate monthly spend (only expenses)
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        monthlySpend += amount;
      }
    }
  });

  // Update UI Stats
  document.getElementById('total-balance').textContent = `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  document.getElementById('monthly-spend').textContent = `$${monthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Budget logic (simple placeholder: assume $2000 budget for now or pull from settings if available)
  const budget = 2000;
  const remaining = budget - monthlySpend;
  document.getElementById('remaining-budget').textContent = `$${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Update Trend Chart (Last 7 Days)
  const chart = document.getElementById('spending-chart');
  if (!chart) return;
  chart.innerHTML = '';

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const dailyData = last7Days.map(dateStr => {
    return transactions
      .filter(tx => tx.date === dateStr && tx.category.toLowerCase() !== 'income')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  });

  const dayLabels = last7Days.map(dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const max = Math.max(...dailyData, 10); // Min max of 10 for scaling

  dayLabels.forEach((label, i) => {
    const height = (dailyData[i] / max) * 100;
    const wrapper = document.createElement('div');
    wrapper.className = 'chart-bar-wrapper';

    wrapper.innerHTML = `
      <div class="chart-bar ${i === 6 ? 'active' : ''}" style="height: ${height}%">
        <div class="chart-tooltip">$${dailyData[i].toFixed(2)}</div>
      </div>
      <div class="chart-label">${label}</div>
    `;
    chart.appendChild(wrapper);
  });
}
