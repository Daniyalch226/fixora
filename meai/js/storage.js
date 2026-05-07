const API_BASE = 'http://localhost:3000/api';

const Storage = {
    async getExpenses() {
        try {
            const resp = await fetch(`${API_BASE}/expenses`);
            return await resp.json();
        } catch (e) {
            console.error('Fetch error:', e);
            return [];
        }
    },

    async addExpense(expense) {
        try {
            const resp = await fetch(`${API_BASE}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            return await resp.json();
        } catch (e) {
            console.error('Add error:', e);
        }
    },

    async getBudgets() {
        try {
            const resp = await fetch(`${API_BASE}/budgets`);
            return await resp.json();
        } catch (e) {
            console.error('Fetch budgets error:', e);
            return {};
        }
    },

    async updateBudget(category, amount) {
        try {
            const resp = await fetch(`${API_BASE}/budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, amount })
            });
            return await resp.json();
        } catch (e) {
            console.error('Update budget error:', e);
        }
    },

    async askAI(query) {
        try {
            const resp = await fetch(`${API_BASE}/ai/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const data = await resp.json();
            return data.reply;
        } catch (e) {
            return "I'm having trouble reaching the server right now.";
        }
    },

    getSettings() {
        // Settings can stay in localStorage for user preference
        return JSON.parse(localStorage.getItem('meai_settings')) || { theme: 'light', currency: 'PKR' };
    },

    updateSettings(newSettings) {
        const settings = this.getSettings();
        const updated = { ...settings, ...newSettings };
        localStorage.setItem('meai_settings', JSON.stringify(updated));
        return updated;
    }
};

export default Storage;
