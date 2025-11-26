import { query } from '../config/db.js';

export const createTask = async (userId, title, description, status, dueDate) => {
    const sql = `
    INSERT INTO tasks (user_id, title, description, status, due_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [userId, title, description, status, dueDate];
    const result = await query(sql, values);
    return result.rows[0];
};

export const getTasksByUserId = async (userId, { status, limit = 10, offset = 0 }) => {
    let sql = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    let paramCount = 1;

    if (status) {
        paramCount++;
        sql += ` AND status = $${paramCount}`;
        values.push(status);
    }

    sql += ` ORDER BY id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await query(sql, values);
    return result.rows;
};

export const getTaskById = async (taskId) => {
    const sql = 'SELECT * FROM tasks WHERE id = $1';
    const result = await query(sql, [taskId]);
    return result.rows[0];
};

export const updateTask = async (taskId, updates) => {
    const { title, description, status, due_date } = updates;
    const sql = `
    UPDATE tasks
    SET title = COALESCE($1, title),
    description = COALESCE($2, description),
    status = COALESCE($3, status),
    due_date = COALESCE($4, due_date)
    WHERE id = $5
    RETURNING *;
  `;
    const values = [title, description, status, due_date, taskId];
    const result = await query(sql, values);
    return result.rows[0];
};

export const deleteTask = async (taskId) => {
    const sql = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await query(sql, [taskId]);
    return result.rows[0];
};
