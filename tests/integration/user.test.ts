import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from '../../app/api/user/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

jest.mock('@/lib/prisma', () => ({
    user: {
        deleteMany: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({ id: 'mockedUserId' }),
    },
}));

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
    authOptions: {},
}));

describe('User API Integration Tests', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
        (getServerSession as jest.Mock).mockClear();
        (prisma.user.findUnique as jest.Mock).mockClear();
        (prisma.user.update as jest.Mock).mockClear();
    });

    describe('GET /api/user', () => {
        test('should return user data when authenticated (using session ID)', async () => {
            const mockSession = { user: { id: 'sessionUserId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            const mockUser = { id: 'sessionUserId', name: 'Test User', email: 'test@example.com', twoFactorEnabled: false };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch();
                    expect(response.status).toBe(200);
                    const data = await response.json();
                    expect(data).toEqual(mockUser);
                    expect(prisma.user.findUnique).toHaveBeenCalledWith({
                        where: { id: 'sessionUserId' },
                        select: { id: true, name: true, email: true, twoFactorEnabled: true },
                    });
                },
            });
        });

        test('should return user data when authenticated (using userId query parameter)', async () => {
            const mockSession = { user: { id: 'someOtherId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            const mockUserId = 'queryUserId';
            const mockUser = { id: mockUserId, name: 'Query User', email: 'query@example.com', twoFactorEnabled: true };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            await testApiHandler({
                appHandler,
                url: `/api/user?userId=${mockUserId}`,
                test: async ({ fetch }) => {
                    const response = await fetch();
                    expect(response.status).toBe(200);
                    const data = await response.json();
                    expect(data).toEqual(mockUser);
                    expect(prisma.user.findUnique).toHaveBeenCalledWith({
                        where: { id: mockUserId },
                        select: { id: true, name: true, email: true, twoFactorEnabled: true },
                    });
                },
            });
        });

        test('should return null if user not found (using session ID)', async () => {
            const mockSession = { user: { id: 'nonExistentId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch();
                    expect(response.status).toBe(200);
                    const data = await response.json();
                    expect(data).toBeNull();
                    expect(prisma.user.findUnique).toHaveBeenCalledWith({
                        where: { id: 'nonExistentId' },
                        select: { id: true, name: true, email: true, twoFactorEnabled: true },
                    });
                },
            });
        });

        test('should return null if user not found (using userId query parameter)', async () => {
            const mockSession = { user: { id: 'someId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            const mockUserId = 'nonExistentQueryId';
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await testApiHandler({
                appHandler,
                url: `/api/user?userId=${mockUserId}`,
                test: async ({ fetch }) => {
                    const response = await fetch();
                    expect(response.status).toBe(200);
                    const data = await response.json();
                    expect(data).toBeNull();
                    expect(prisma.user.findUnique).toHaveBeenCalledWith({
                        where: { id: mockUserId },
                        select: { id: true, name: true, email: true, twoFactorEnabled: true },
                    });
                },
            });
        });

        test('should return 500 error if Prisma fails', async () => {
            const mockSession = { user: { id: 'errorId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch();
                    expect(response.status).toBe(500);
                    const data = await response.json();
                    expect(data).toHaveProperty('error', 'Something went wrong');
                },
            });
        });
    });

    describe('PUT /api/user', () => {
        test('should update user name when authenticated', async () => {
            const mockSession = { user: { id: 'sessionUserId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            const newName = 'Updated Name';

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch({
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName }),
                    });
                    expect(response.status).toBe(200);
                    const data = await response.json();
                    expect(data).toHaveProperty('message', 'User updated');
                    expect(prisma.user.update).toHaveBeenCalledWith({
                        where: { id: 'sessionUserId' },
                        data: { name: newName },
                    });
                },
            });
        });

        test('should return 401 unauthorized if not authenticated', async () => {
            (getServerSession as jest.Mock).mockResolvedValue(null);
            const newName = 'Updated Name';

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch({
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName }),
                    });
                    expect(response.status).toBe(401);
                    const data = await response.json();
                    expect(data).toHaveProperty('error', 'Unauthorized');
                    expect(prisma.user.update).not.toHaveBeenCalled();
                },
            });
        });

        test('should return 500 error if Prisma fails', async () => {
            const mockSession = { user: { id: 'errorId' } };
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);
            const newName = 'Failed Update';
            (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

            await testApiHandler({
                appHandler,
                url: '/api/user',
                test: async ({ fetch }) => {
                    const response = await fetch({
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName }),
                    });
                    expect(response.status).toBe(500);
                    const data = await response.json();
                    expect(data).toHaveProperty('error', 'Something went wrong');
                    expect(prisma.user.update).toHaveBeenCalled();
                },
            });
        });
    });
});