const db = require('../config/db');

const createUser = async (email, passwordHash) => {
    const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email;
  `;
    const values = [email, passwordHash];
    const result = await db.query(query, values);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
};

const findUserById = async (id) => {
    const query = 'SELECT id, email FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
};
