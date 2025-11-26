import express from 'express';
import taskController from '../controllers/taskController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { validate, createTaskSchema, updateTaskSchema } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
