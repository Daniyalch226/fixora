const Parser = {
    categories: ['food', 'transport', 'shopping', 'health', 'rent', 'others', 'travel', 'grocery', 'bills'],

    parse(text) {
        const lowerText = text.toLowerCase();
        
        // 1. Extract Amount
        const amountMatch = lowerText.match(/\d+(?:\.\d+)?/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

        // 2. Extract Category
        let category = 'Others';
        for (const cat of this.categories) {
            if (lowerText.includes(cat)) {
                category = cat.charAt(0).toUpperCase() + cat.slice(1);
                break;
            }
        }

        // 3. Extract Mood (Optional)
        let mood = 'Neutral';
        if (lowerText.includes('happy') || lowerText.includes('great')) mood = 'Happy';
        if (lowerText.includes('sad') || lowerText.includes('bad') || lowerText.includes('stressed')) mood = 'Stressed';

        // 4. Extract Date (Basic logic)
        let date = new Date().toISOString().split('T')[0];
        if (lowerText.includes('yesterday')) {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            date = d.toISOString().split('T')[0];
        }

        return {
            amount,
            category,
            mood,
            date,
            note: text
        };
    }
};

export default Parser;
