const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await db.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const expense = await db.addExpense(req.body);
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/budgets', async (req, res) => {
    try {
        const budgets = await db.getBudgets();
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/budgets', async (req, res) => {
    try {
        const { category, amount } = req.body;
        const result = await db.updateBudget(category, amount);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Simulation endpoint
app.post('/api/ai/query', async (req, res) => {
    const { query } = req.body;
    const lowerQuery = query.toLowerCase();
    const expenses = await db.getAllExpenses();
    const budgets = await db.getBudgets();

    let reply = "";

    if (lowerQuery.includes('spent') || lowerQuery.includes('how much')) {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        reply = `You have spent a total of PKR ${total.toLocaleString()}.`;
    } else if (lowerQuery.includes('budget')) {
        const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        reply = `Your total budget is PKR ${totalBudget.toLocaleString()} and you have ${((totalBudget - totalSpent) / totalBudget * 100).toFixed(1)}% remaining.`;
    } else {
        reply = "I'm analyzing your data. Currently, you have " + expenses.length + " transactions recorded.";
    }

    res.json({ reply });
});

app.listen(PORT, () => {
    console.log(`MEAI Server running at http://localhost:${PORT}`);
});
