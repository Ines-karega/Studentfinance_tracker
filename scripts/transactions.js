document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();

    // Event listeners for search, filter, and sort
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) searchInput.addEventListener('input', loadTransactions);
    if (categoryFilter) categoryFilter.addEventListener('change', loadTransactions);
    if (sortSelect) sortSelect.addEventListener('change', loadTransactions);
});

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    const tbody = document.getElementById('transactions-body');
    if (!tbody) return;

    const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';
    const categoryQuery = document.getElementById('category-filter')?.value || '';
    const sortQuery = document.getElementById('sort-select')?.value || 'date-desc';

    // 1. Filtering
    let filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryQuery === '' || tx.category === categoryQuery;
        return matchesSearch && matchesCategory;
    });

    // 2. Sorting
    filteredTransactions.sort((a, b) => {
        switch (sortQuery) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            case 'category-asc':
                return a.category.localeCompare(b.category);
            case 'category-desc':
                return b.category.localeCompare(a.category);
            default:
                return 0;
        }
    });

    tbody.innerHTML = '';

    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No transactions found.</td></tr>';
        return;
    }

    filteredTransactions.forEach(tx => {
        const row = document.createElement('tr');
        row.dataset.id = tx.id;
        row.innerHTML = `
            <td data-label="Date">${formatDate(tx.date)}</td>
            <td data-label="Description"><strong>${tx.description}</strong></td>
            <td data-label="Category"><span class="badge badge-neutral">${tx.category}</span></td>
            <td data-label="Amount" class="text-right" style="color: ${tx.amount < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">$${Math.abs(tx.amount).toFixed(2)}</td>
            <td data-label="Actions">
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-outline" onclick="editRow('${tx.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${tx.id}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    let transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    transactions = transactions.filter(tx => tx.id !== id);
    localStorage.setItem('sf_transactions', JSON.stringify(transactions));
    showToast('Transaction deleted.', 'info');
    loadTransactions();
}

function editRow(id) {
    const transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    row.innerHTML = `
        <td data-label="Date"><input type="date" class="form-input" value="${tx.date}" id="edit-date-${id}"></td>
        <td data-label="Description"><input type="text" class="form-input" value="${tx.description}" id="edit-desc-${id}"></td>
        <td data-label="Category">
            <select class="form-select" id="edit-cat-${id}">
                <option value="Food" ${tx.category === 'Food' ? 'selected' : ''}>Food</option>
                <option value="Books" ${tx.category === 'Books' ? 'selected' : ''}>Books</option>
                <option value="Transport" ${tx.category === 'Transport' ? 'selected' : ''}>Transport</option>
                <option value="Entertainment" ${tx.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                <option value="Fees" ${tx.category === 'Fees' ? 'selected' : ''}>Fees</option>
                <option value="Other" ${tx.category === 'Other' ? 'selected' : ''}>Other</option>
                <option value="Income" ${tx.category === 'Income' ? 'selected' : ''}>Income</option>
            </select>
        </td>
        <td data-label="Amount" class="text-right">
            <input type="number" class="form-input" step="0.01" value="${tx.amount}" id="edit-amount-${id}">
        </td>
        <td data-label="Actions">
            <div class="flex gap-2">
                <button class="btn btn-sm btn-primary" onclick="saveRow('${id}')">Save</button>
                <button class="btn btn-sm btn-outline" onclick="loadTransactions()">Cancel</button>
            </div>
        </td>
    `;
}

function saveRow(id) {
    const date = document.getElementById(`edit-date-${id}`).value;
    const description = document.getElementById(`edit-desc-${id}`).value.trim();
    const category = document.getElementById(`edit-cat-${id}`).value;
    const amount = document.getElementById(`edit-amount-${id}`).value;

    const descriptionRegex = /^[A-Za-z0-9\s,.-]{3,50}$/;
    const amountRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;

    if (!descriptionRegex.test(description)) {
        showToast('Invalid description. Use 3-50 characters.', 'error');
        return;
    }
    if (!amountRegex.test(amount) || parseFloat(amount) <= 0) {
        showToast('Invalid amount. Use a positive number.', 'error');
        return;
    }

    let transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    const index = transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], date, description, category, amount: parseFloat(amount) };
        localStorage.setItem('sf_transactions', JSON.stringify(transactions));
        showToast('Transaction updated.', 'success');
        loadTransactions();
    }
}
