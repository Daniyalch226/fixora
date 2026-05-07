import Storage from './storage.js';
import Parser from './parser.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('magic-input');
    const preview = document.getElementById('parse-preview');
    const previewText = document.getElementById('preview-text');
    const confirmBtn = document.getElementById('confirm-expense');
    const voiceBtn = document.getElementById('voice-btn');
    const transList = document.getElementById('transactions-list');
    const totalBalanceEl = document.getElementById('total-balance');
    const budgetLeftEl = document.getElementById('budget-left');
    const budgetProgress = document.getElementById('budget-progress');
    const themeToggle = document.getElementById('theme-toggle');
    const aiInsights = document.getElementById('ai-insights');

    let currentParsed = null;
    let categoryChart = null;

    // --- UI Update Functions ---
    const updateDashboard = async () => {
        const expenses = await Storage.getExpenses();
        const budgets = await Storage.getBudgets();
        const settings = Storage.getSettings();

        // Calculate Totals
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        totalBalanceEl.textContent = `${settings.currency} ${total.toLocaleString()}`;

        // Budget Logic
        const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
        const remaining = totalBudget - total;
        budgetLeftEl.textContent = `${settings.currency} ${remaining.toLocaleString()}`;
        
        const percent = Math.min(100, (total / totalBudget) * 100);
        budgetProgress.style.width = `${percent}%`;
        budgetProgress.style.background = percent > 90 ? '#ef4444' : (percent > 70 ? '#f59e0b' : 'var(--secondary)');

        // Transactions List
        transList.innerHTML = '';
        expenses.slice(0, 5).forEach(exp => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="transaction-icon">
                    <i class="${getCategoryIcon(exp.category)}"></i>
                </div>
                <div class="transaction-info">
                    <h4>${exp.category}</h4>
                    <p>${exp.note || 'No note'}</p>
                </div>
                <div class="transaction-amount">
                    ${settings.currency} ${exp.amount}
                </div>
            `;
            transList.appendChild(item);
        });

        // AI Insights & Chart
        generateInsights(expenses, totalBudget, total);
        updateChart(expenses);
        generateStory(expenses);
    };

    const updateChart = (expenses) => {
        const ctx = document.getElementById('categoryChart')?.getContext('2d');
        if (!ctx) return;

        const catTotals = {};
        expenses.forEach(e => {
            catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
        });

        const data = {
            labels: Object.keys(catTotals),
            datasets: [{
                data: Object.values(catTotals),
                backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
                borderWidth: 0
            }]
        };

        if (categoryChart) {
            categoryChart.data = data;
            categoryChart.update();
        } else {
            // @ts-ignore
            categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: document.body.classList.contains('dark-mode') ? '#f1f5f9' : '#1e293b' } } }
                }
            });
        }
    };

    const generateStory = (expenses) => {
        if (expenses.length < 2) return;
        const insightsBlock = document.getElementById('ai-insights');
        const recent = expenses.slice(0, 3);
        const cats = [...new Set(recent.map(e => e.category))];
        
        const story = document.createElement('p');
        story.style.marginTop = '1rem';
        story.style.fontStyle = 'italic';
        story.style.borderTop = '1px solid var(--glass-border)';
        story.style.paddingTop = '1rem';
        story.innerHTML = `<i class="fas fa-book-open" style="color: var(--primary);"></i> <strong>Story Mode:</strong> Lately, you've been focused on <strong>${cats.join(' and ')}</strong>. You seem to be ${expenses[0].mood === 'Stressed' ? 'spending to cope with stress' : 'managing your finances with an upbeat attitude'}!`;
        insightsBlock.innerHTML += story.outerHTML;
    };

    const getCategoryIcon = (cat) => {
        const icons = { 'Food': 'fas fa-utensils', 'Transport': 'fas fa-car', 'Shopping': 'fas fa-shopping-bag', 'Health': 'fas fa-heartbeat', 'Rent': 'fas fa-home', 'Travel': 'fas fa-plane', 'Education': 'fas fa-book', 'Others': 'fas fa-ellipsis-h' };
        return icons[cat] || icons['Others'];
    };

    const generateInsights = (expenses, totalBudget, total) => {
        if (expenses.length === 0) return;
        const catTotals = {};
        expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
        const topCat = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b);
        const percent = (total / totalBudget) * 100;

        let insightHTML = `<p><i class="fas fa-lightbulb" style="color: gold;"></i> <strong>${topCat}</strong> is your highest category ($${catTotals[topCat]}).</p>`;
        if (percent > 80) insightHTML += `<p><i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> Warning: You've used ${percent.toFixed(0)}% of your total budget!</p>`;
        else insightHTML += `<p><i class="fas fa-check-circle" style="color: #10b981;"></i> You are on track with your spending this month.</p>`;

        aiInsights.innerHTML = insightHTML;
    };

    // --- Event Listeners ---
    input.addEventListener('input', (e) => {
        const text = e.target.value;
        if (text.length > 5) {
            currentParsed = Parser.parse(text);
            preview.style.display = 'block';
            previewText.innerHTML = `Detecting: <strong>${currentParsed.amount}</strong> for <strong>${currentParsed.category}</strong> (${currentParsed.mood})`;
        } else { preview.style.display = 'none'; }
    });

    confirmBtn.addEventListener('click', async () => {
        if (currentParsed) {
            await Storage.addExpense(currentParsed);
            showNotification(`Added ${currentParsed.amount} to ${currentParsed.category}`);
            input.value = '';
            preview.style.display = 'none';
            await updateDashboard();
        }
    });

    document.getElementById('cancel-expense').addEventListener('click', () => {
        preview.style.display = 'none';
        currentParsed = null;
    });

    document.getElementById('show-manual').addEventListener('click', () => {
        const manualArea = document.getElementById('manual-input-area');
        const isHidden = manualArea.style.display === 'none';
        manualArea.style.display = isHidden ? 'block' : 'none';
        document.getElementById('show-manual').textContent = isHidden ? 'Hide manual input' : 'Type manually instead';
    });

    const showNotification = (msg) => {
        const notify = document.getElementById('notification');
        notify.textContent = msg;
        notify.style.display = 'block';
        setTimeout(() => notify.style.display = 'none', 3000);
    };

    voiceBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();
        
        document.querySelector('.voice-hub').classList.add('recording');
        document.getElementById('voice-status').textContent = 'Listening...';
        
        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            input.value = speechToText;
            input.dispatchEvent(new Event('input'));
            document.querySelector('.voice-hub').classList.remove('recording');
            document.getElementById('voice-status').textContent = 'Tap to speak';
        };

        recognition.onerror = () => {
            document.querySelector('.voice-hub').classList.remove('recording');
            document.getElementById('voice-status').textContent = 'Tap to speak';
            alert('Voice recognition failed. Please try again.');
        };
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        Storage.updateSettings({ theme: isDark ? 'dark' : 'light' });
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        if (categoryChart) {
            categoryChart.options.plugins.legend.labels.color = isDark ? '#f1f5f9' : '#1e293b';
            categoryChart.update();
        }
    });

    const init = async () => {
        const settings = Storage.getSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        const now = new Date();
        document.getElementById('current-date').textContent = `Today is ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        await updateDashboard();
    };

    init();
});
