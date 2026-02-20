document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
});

function updateDashboard() {
  let transactions = [];
  try {
    transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    if (!Array.isArray(transactions)) transactions = [];
  } catch (e) {
    console.error('Error parsing transactions for dashboard:', e);
    transactions = [];
  }

  // Calculate Stats
  let totalBalance = 0;
  let monthlySpend = 0;
  let totalAmount = 0;
  const categoryCounts = {};
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount) || 0;
    const txDate = new Date(tx.date); // Convert transaction date string to Date object

    totalAmount += amount;

    // Track category frequency
    const cat = tx.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // Use transaction type if available, otherwise fallback to legacy "Income" check
    const isIncome = tx.type ? tx.type === 'income' : (tx.category && tx.category.toLowerCase() === 'income');

    if (isIncome) {
      totalBalance += amount;
    } else {
      totalBalance -= amount;
      // Calculate monthly spend (only expenses)
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        monthlySpend += amount;
      }
    }
  });

  // Determine top category
  let topCategory = '-';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  }

  // Calculate Budget Status
  const monthlyTarget = parseFloat(localStorage.getItem('sf_monthly_target')) || 0;
  let budgetStatus = '-';
  if (monthlyTarget > 0) {
    const diff = monthlyTarget - monthlySpend;
    if (diff >= 0) {
      budgetStatus = `Remaining ${formatCurrency(diff)}`;
    } else {
      budgetStatus = `Over by ${formatCurrency(Math.abs(diff))}`;
    }
  } else {
    budgetStatus = 'Target not set';
  }

  // Update UI Stats (with safety checks for removed elements)
  const elements = {
    'total-records': transactions.length.toString(),
    'total-amount': formatCurrency(totalAmount),
    'top-category': topCategory,
    'total-balance': formatCurrency(totalBalance),
    'monthly-spend': formatCurrency(monthlySpend),
    'budget-status': budgetStatus
  };

  for (const [id, value] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;

      // Rubric requirement: ARIA live regions (polite when under, assertive when exceeded)
      if (id === 'budget-status' && monthlyTarget > 0) {
        const diff = monthlyTarget - monthlySpend;
        el.setAttribute('aria-live', diff >= 0 ? 'polite' : 'assertive');
      }
    }
  }

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
        <div class="chart-tooltip">${formatCurrency(dailyData[i])}</div>
      </div>
      <div class="chart-label">${label}</div>
    `;
    chart.appendChild(wrapper);
  });
}
