document.getElementById('add-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const description = document.getElementById('desc').value.trim();
    const amount = document.getElementById('amount').value;
    const categorySelect = document.getElementById('category');
    const category = categorySelect.options[categorySelect.selectedIndex].text;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();

    // Regex patterns
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    // Validation
    if (!descriptionRegex.test(description)) {
        alert('Invalid description. Please avoid leading/trailing whitespace.');
        return;
    }
    if (!amountRegex.test(amount)) {
        alert('Invalid amount. Please use numbers (e.g., 10 or 10.50).');
        return;
    }
    // Category regex check (though it's a select, the requirement mentioned it)
    if (!categoryRegex.test(category)) {
        alert('Invalid category format.');
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

    // Redirect back to transactions page
    window.location.href = 'transactions.html';
});

// Set default date to today
document.getElementById('date').valueAsDate = new Date();
