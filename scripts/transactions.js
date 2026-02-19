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
    let transactions = [];
    try {
        transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
        if (!Array.isArray(transactions)) {
            console.warn('sf_transactions is not an array, resetting to empty array');
            transactions = [];
        }
    } catch (e) {
        console.error('Error parsing transactions from localStorage:', e);
        transactions = [];
    }

    const tbody = document.getElementById('transactions-body');
    if (!tbody) return;

    const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';
    const categoryQuery = document.getElementById('category-filter')?.value || '';
    const sortQuery = document.getElementById('sort-select')?.value || 'date-desc';

    // 1. Filtering
    let filteredTransactions = transactions.filter(tx => {
        if (!tx || typeof tx.description !== 'string') return false;
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

        const isIncome = tx.type === 'income';
        const formattedAmount = formatCurrency(tx.amount);
        const amountDisplay = isIncome ? `+${formattedAmount}` : `-${formattedAmount}`;
        const amountColor = isIncome ? 'var(--color-success)' : 'var(--color-danger)';

        row.innerHTML = `
            <td data-label="Date">${formatDate(tx.date)}</td>
            <td data-label="Description"><strong>${tx.description}</strong></td>
            <td data-label="Category"><span class="badge badge-neutral">${tx.category}</span></td>
            <td data-label="Amount" class="text-right" style="color: ${amountColor}; font-weight: 600;">${amountDisplay}</td>
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
    let transactions = [];
    try {
        transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    } catch (e) {
        console.error('Error parsing transactions for deletion:', e);
    }
    transactions = transactions.filter(tx => tx.id !== id);
    localStorage.setItem('sf_transactions', JSON.stringify(transactions));
    showToast('Transaction deleted.', 'info');
    loadTransactions();
}

function editRow(id) {
    let transactions = [];
    try {
        transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    } catch (e) {
        console.error('Error parsing transactions for editing:', e);
    }
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const categories = {
        expense: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
        income: ['Allowance', 'Salary', 'Part-time', 'Investment', 'Other']
    };

    row.innerHTML = `
        <td data-label="Date"><input type="date" class="form-input" value="${tx.date}" id="edit-date-${id}"></td>
        <td data-label="Description"><input type="text" class="form-input" value="${tx.description}" id="edit-desc-${id}"></td>
        <td data-label="Category">
            <div class="flex flex-col gap-2">
                <select class="form-select btn-sm" id="edit-type-${id}">
                    <option value="expense" ${tx.type === 'expense' ? 'selected' : ''}>Expense</option>
                    <option value="income" ${tx.type === 'income' ? 'selected' : ''}>Income</option>
                </select>
                <select class="form-select btn-sm" id="edit-cat-${id}">
                    <!-- Populated via JS -->
                </select>
            </div>
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

    const typeSelect = document.getElementById(`edit-type-${id}`);
    const catSelect = document.getElementById(`edit-cat-${id}`);

    function updateEditCategories() {
        const type = typeSelect.value;
        catSelect.innerHTML = '';
        categories[type].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === tx.category && type === tx.type) option.selected = true;
            catSelect.appendChild(option);
        });
    }

    typeSelect.addEventListener('change', updateEditCategories);
    updateEditCategories();
}

function saveRow(id) {
    const date = document.getElementById(`edit-date-${id}`).value;
    const description = document.getElementById(`edit-desc-${id}`).value.trim();
    const type = document.getElementById(`edit-type-${id}`).value;
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

    let transactions = [];
    try {
        transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    } catch (e) {
        console.error('Error parsing transactions for saving row:', e);
    }
    const index = transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], date, description, type, category, amount: parseFloat(amount) };
        localStorage.setItem('sf_transactions', JSON.stringify(transactions));
        showToast('Transaction updated.', 'success');
        loadTransactions();
    }
}
