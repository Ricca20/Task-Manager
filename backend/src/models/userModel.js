import { query } from '../config/db.js';

export const createUser = async (email, passwordHash) => {
    const sql = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email;
  `;
    const values = [email, passwordHash];
    const result = await query(sql, values);
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [email]);
    return result.rows[0];
};

export const findUserById = async (id) => {
    const sql = 'SELECT id, email FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
};
