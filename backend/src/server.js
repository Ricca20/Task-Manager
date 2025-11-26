import 'dotenv/config';
import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    pool.query('SELECT NOW()', (err) => {
        if (err) console.error('Database connection error:', err);
    });
});
