import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../src/models/taskModel.js', () => ({
    createTask: jest.fn(),
    getTasksByUserId: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
}));

jest.unstable_mockModule('../src/middlewares/authMiddleware.js', () => ({
    authenticateToken: jest.fn((req, res, next) => {
        req.user = { userId: 1, email: 'test@example.com' };
        next();
    }),
}));

// Import modules after mocking
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');
const taskModel = await import('../src/models/taskModel.js');
const { authenticateToken } = await import('../src/middlewares/authMiddleware.js');

describe('Task Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset auth middleware implementation if needed, though the default mock covers it
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { userId: 1, email: 'test@example.com' };
            next();
        });
    });

    describe('POST /api/tasks', () => {
        it('should create a new task successfully', async () => {
            const newTask = { id: 1, title: 'New Task', status: 'pending', user_id: 1 };
            taskModel.createTask.mockResolvedValue(newTask);

            const res = await request(app)
                .post('/api/tasks')
                .send({ title: 'New Task' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(newTask);
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({});

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('GET /api/tasks', () => {
        it('should return a list of tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', user_id: 1 },
                { id: 2, title: 'Task 2', user_id: 1 }
            ];
            taskModel.getTasksByUserId.mockResolvedValue(mockTasks);

            const res = await request(app)
                .get('/api/tasks');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockTasks);
            expect(taskModel.getTasksByUserId).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });
});
