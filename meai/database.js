const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTables();
    }
});

function initializeTables() {
    db.serialize(() => {
        // Expenses Table
        db.run(`CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            mood TEXT,
            note TEXT
        )`);

        // Budgets Table
        db.run(`CREATE TABLE IF NOT EXISTS budgets (
            category TEXT PRIMARY KEY,
            amount REAL NOT NULL
        )`, () => {
            // Seed default budgets if empty
            db.get("SELECT COUNT(*) as count FROM budgets", (err, row) => {
                if (row.count === 0) {
                    const defaults = [
                        ['Food', 5000], ['Transport', 2000], ['Shopping', 3000],
                        ['Health', 1500], ['Rent', 15000], ['Others', 1000]
                    ];
                    const stmt = db.prepare("INSERT INTO budgets (category, amount) VALUES (?, ?)");
                    defaults.forEach(d => stmt.run(d));
                    stmt.finalize();
                }
            });
        });
    });
}

module.exports = {
    getAllExpenses: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM expenses ORDER BY date DESC, id DESC", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    addExpense: (expense) => {
        return new Promise((resolve, reject) => {
            const { amount, category, date, mood, note } = expense;
            db.run("INSERT INTO expenses (amount, category, date, mood, note) VALUES (?, ?, ?, ?, ?)",
                [amount, category, date, mood, note],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...expense });
                }
            );
        });
    },

    getBudgets: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM budgets", [], (err, rows) => {
                if (err) reject(err);
                else {
                    const budgets = {};
                    rows.forEach(r => budgets[r.category] = r.amount);
                    resolve(budgets);
                }
            });
        });
    },

    updateBudget: (category, amount) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT OR REPLACE INTO budgets (category, amount) VALUES (?, ?)",
                [category, amount],
                (err) => {
                    if (err) reject(err);
                    else resolve({ category, amount });
                }
            );
        });
    }
};
