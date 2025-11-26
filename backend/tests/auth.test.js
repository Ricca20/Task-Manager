const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the userModel and other dependencies
jest.mock('../src/models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            userModel.findUserByEmail.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            userModel.createUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 409 if user already exists', async () => {
            userModel.findUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashedPassword' };
            userModel.findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token', 'mockToken');
        });

        it('should return 401 with invalid credentials', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashedPassword' };
            userModel.findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});
