import db from '../config/db.js';

const createTask = async (userId, title, description, status, dueDate) => {
    const query = `
    INSERT INTO tasks (user_id, title, description, status, due_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [userId, title, description, status, dueDate];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getTasksByUserId = async (userId, { status, limit = 10, offset = 0 }) => {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    let paramCount = 1;

    if (status) {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        values.push(status);
    }

    query += ` ORDER BY id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
};

const getTaskById = async (taskId) => {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await db.query(query, [taskId]);
    return result.rows[0];
};

const updateTask = async (taskId, updates) => {
    const { title, description, status, due_date } = updates;
    const query = `
    UPDATE tasks
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        due_date = COALESCE($4, due_date)
    WHERE id = $5
    RETURNING *;
  `;
    const values = [title, description, status, due_date, taskId];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteTask = async (taskId) => {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await db.query(query, [taskId]);
    return result.rows[0];
};

export default {
    createTask,
    getTasksByUserId,
    getTaskById,
    updateTask,
    deleteTask,
};
