import taskModel from '../models/taskModel.js';

const createTask = async (req, res) => {
    try {
        const { title, description, status, due_date } = req.body;
        const userId = req.user.userId;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newTask = await taskModel.createTask(userId, title, description, status, due_date);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTasks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const tasks = await taskModel.getTasksByUserId(userId, {
            status,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;

        const task = await taskModel.getTaskById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(task);
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;
        const updates = req.body;

        const task = await taskModel.getTaskById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedTask = await taskModel.updateTask(taskId, updates);
        res.json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;

        const task = await taskModel.getTaskById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await taskModel.deleteTask(taskId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
};
