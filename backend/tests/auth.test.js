import { jest } from '@jest/globals';

// Mock dependencies using unstable_mockModule
jest.unstable_mockModule('../src/models/userModel.js', () => ({
    default: {
        findUserByEmail: jest.fn(),
        createUser: jest.fn(),
        findUserById: jest.fn(),
    },
}));

jest.unstable_mockModule('bcrypt', () => ({
    default: {
        genSalt: jest.fn(),
        hash: jest.fn(),
        compare: jest.fn(),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn(),
        verify: jest.fn(),
    },
}));

// Import modules after mocking
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');
const { default: userModel } = await import('../src/models/userModel.js');
const { default: bcrypt } = await import('bcrypt');
const { default: jwt } = await import('jsonwebtoken');

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
