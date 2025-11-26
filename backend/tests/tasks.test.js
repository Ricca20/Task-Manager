const request = require('supertest');
const app = require('../src/app');
const taskModel = require('../src/models/taskModel');
const authMiddleware = require('../src/middlewares/authMiddleware');

// Mock dependencies
jest.mock('../src/models/taskModel');
jest.mock('../src/middlewares/authMiddleware');

describe('Task Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock auth middleware to pass through with a mock user
        authMiddleware.mockImplementation((req, res, next) => {
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
