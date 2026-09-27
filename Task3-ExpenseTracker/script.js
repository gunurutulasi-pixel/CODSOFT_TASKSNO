// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const netBalanceEl = document.getElementById('net-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const transactionList = document.getElementById('transaction-list');
const emptyState = document.getElementById('empty-state');
const filterCategory = document.getElementById('filter-category');

// App State
let transactions = JSON.parse(localStorage.getItem('codsoft_transactions')) || [];

// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    dateInput.valueAsDate = new Date();
    renderTransactions();
});

// Add Transaction Event
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const desc = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!desc || isNaN(amount) || amount <= 0 || !date) return;

    const newTransaction = {
        id: Date.now(),
        description: desc,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    transactions.push(newTransaction);
    saveAndRender();
    
    // Reset Form Fields
    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.valueAsDate = new Date();
});

// Save to LocalStorage & Refresh View
function saveAndRender() {
    localStorage.setItem('codsoft_transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Render Transactions & Update Calculations
function renderTransactions() {
    transactionList.innerHTML = '';

    const selectedCategory = filterCategory.value;

    // Filter transactions based on category selection
    const filteredTransactions = transactions.filter(tx => {
        if (selectedCategory === 'all') return true;
        return tx.category === selectedCategory;
    });

    // Toggle Empty State
    if (filteredTransactions.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Sort transactions by date descending (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredTransactions.forEach(tx => {
        const li = document.createElement('li');
        li.className = `transaction-item ${tx.type}`;
        
        const sign = tx.type === 'income' ? '+' : '-';
        
        li.innerHTML = `
            <div class="tx-info">
                <h4>${escapeHtml(tx.description)}</h4>
                <div class="tx-meta">
                    <span><i class="fas fa-tag"></i> ${tx.category}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${tx.date}</span>
                </div>
            </div>
            <div class="tx-right">
                <span class="tx-amount">${sign}₹${tx.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteTransaction(${tx.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    updateFinancialSummary();
}

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(tx => tx.id !== id);
    saveAndRender();
}

// Calculate and Display Summary Cards
function updateFinancialSummary() {
    const income = transactions
        .filter(tx => tx.type === 'income')
        .reduce((acc, tx) => acc + tx.amount, 0);

    const expense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => acc + tx.amount, 0);

    const balance = income - expense;

    netBalanceEl.textContent = `₹${balance.toFixed(2)}`;
    totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
    totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
}

// Category Filter Event Listener
filterCategory.addEventListener('change', () => {
    renderTransactions();
});

// Security Helper to avoid basic XSS injection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}