document.getElementById('add-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const description = document.getElementById('desc').value.trim();
    const amount = document.getElementById('amount').value;
    const categorySelect = document.getElementById('category');
    const category = categorySelect.options[categorySelect.selectedIndex].text;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();

    // Regex patterns
    const descriptionRegex = /^[A-Za-z0-9\s,.-]{3,50}$/; // 3-50 chars, alphanumeric and some symbols
    const amountRegex = /^(?!0\d)\d+(\.\d{1,2})?$/; // Positive number, up to 2 decimals, no leading zeros unless 0.xx

    // Validation
    if (!descriptionRegex.test(description)) {
        showToast('Invalid description. Use 3-50 characters (alphanumeric).', 'error');
        return;
    }
    if (!amountRegex.test(amount) || parseFloat(amount) <= 0) {
        showToast('Invalid amount. Please use a positive number (e.g., 10.50).', 'error');
        return;
    }
    // Category regex check (though it's a select, the requirement mentioned it)
    if (category === '') {
        showToast('Please select a category.', 'warning');
        return;
    }

    const newTransaction = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        notes
    };

    // Get existing transactions or initialize empty array
    const transactions = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
    transactions.push(newTransaction);
    localStorage.setItem('sf_transactions', JSON.stringify(transactions));

    showToast('Transaction added successfully!', 'success');

    // Redirect back to transactions page after a short delay
    setTimeout(() => {
        window.location.href = 'transactions.html';
    }, 1000);
});

// Set default date to today
document.getElementById('date').valueAsDate = new Date();
