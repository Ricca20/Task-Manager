import 'dotenv/config';
import app from './app.js';
import db from './config/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Test database connection
    db.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Database connection error:', err);
        }
    });
});
