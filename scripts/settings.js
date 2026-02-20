document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('sf_theme') || 'light';
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
        themeToggle.addEventListener('change', () => {
            const isDark = toggleTheme();
            showToast(`${isDark ? 'Dark' : 'Light'} theme enabled.`, 'info');
        });
    }

    // Currency Selection
    const currencySelect = document.getElementById('currency-select');
    const currentCurrency = localStorage.getItem('sf_currency') || 'USD';
    if (currencySelect) {
        currencySelect.value = currentCurrency;
        currencySelect.addEventListener('change', () => {
            localStorage.setItem('sf_currency', currencySelect.value);
            showToast(`Currency changed to ${currencySelect.value}.`, 'info');
        });
    }

    // Monthly Budget Target
    const targetInput = document.getElementById('target-input');
    const saveTargetBtn = document.getElementById('save-target-btn');
    const currentTarget = localStorage.getItem('sf_monthly_target') || '';

    if (targetInput) {
        targetInput.value = currentTarget;
        if (saveTargetBtn) {
            saveTargetBtn.addEventListener('click', () => {
                const value = targetInput.value.trim();
                localStorage.setItem('sf_monthly_target', value);
                showToast(`Monthly target saved: ${value || 'None'}`, 'success');
            });
        }
    }

    // Data Management
    const exportBtn = document.getElementById('export-btn');
    const clearBtn = document.getElementById('clear-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (clearBtn) clearBtn.addEventListener('click', clearData);
    if (importBtn) importBtn.addEventListener('click', () => importFile.click());
    if (importFile) importFile.addEventListener('change', handleImport);
});

function exportData() {
    const transactions = localStorage.getItem('sf_transactions') || '[]';
    const blob = new Blob([transactions], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_finance_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

function clearData() {
    if (confirm('Are you sure you want to clear ALL transactions? This action cannot be undone.')) {
        localStorage.removeItem('sf_transactions');
        showToast('All transaction data has been cleared.', 'info');
    }
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);

            // Basic validation
            if (!Array.isArray(data)) {
                throw new Error('Data format must be an array of transactions.');
            }

            // More detailed validation (optional but recommended)
            const isValid = data.every(tx =>
                tx.id && tx.description && typeof tx.amount === 'number' && tx.date
            );

            if (!isValid) {
                throw new Error('Some transactions are missing required fields (id, description, amount, date).');
            }

            if (confirm(`Importing ${data.length} transactions. This will merge with your current data. Continue?`)) {
                const existing = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
                const combined = [...existing, ...data];
                localStorage.setItem('sf_transactions', JSON.stringify(combined));
                showToast('Data imported successfully!', 'success');
                // Potential reset of file input
                e.target.value = '';
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast(`Import failed: ${error.message}`, 'error');
        }
    };
    reader.readAsText(file);
}
