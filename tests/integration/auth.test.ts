import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from '../../app/api/signup/route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
    user: {
        deleteMany: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1 }),
    },
}));

describe('Auth API Integration Tests', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    describe('POST /api/signup', () => {
        test('should create new user', async () => {
            await testApiHandler({
                appHandler,
                test: async ({ fetch }) => {
                    const response = await fetch({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: 'test@example.com',
                            password: 'ValidPass123!',
                        }),
                    });

                    expect(response.status).toBe(201);
                    const data = await response.json();
                    expect(data).toHaveProperty('userId');
                },
            });
        });

        test('should return error for invalid input', async () => {
            await testApiHandler({
                appHandler,
                test: async ({ fetch }) => {
                    const response = await fetch({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: 'invalid-email',
                            password: 'short',
                        }),
                    });

                    expect(response.status).toBe(400);
                    const data = await response.json();
                    expect(data).toHaveProperty('error');
                },
            });
        });
    });
});