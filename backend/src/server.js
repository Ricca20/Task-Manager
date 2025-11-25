require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Test database connection
    db.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Database connection error:', err);
        }
    });
});
