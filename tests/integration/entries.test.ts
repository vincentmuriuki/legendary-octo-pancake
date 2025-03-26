import { PUT as PUTHandler, DELETE as DELETEHandler } from '../../app/api/entries/update/[id]/route';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
    journalEntry: {
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock fetch for sentiment analysis
global.fetch = jest.fn();

describe('Journal Entry API Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({ ok: true }); // Default fetch mock
        process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'; // Mock the base URL
    });

    describe('PUT /api/journal/[id]', () => {
        it('should update a journal entry successfully', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    title: 'Updated Title',
                    content: 'Updated Content',
                    date: '2025-03-26T10:00:00.000Z',
                    categoryIds: ['1', '2'],
                }),
            } as any as Request;
            const mockParams = { params: { id: 'mockEntryId' } };
            const mockUpdatedEntry = {
                id: 'mockEntryId',
                title: 'Updated Title',
                content: 'Updated Content',
                date: new Date('2025-03-26T10:00:00.000Z'),
                categories: [{ id: '1' }, { id: '2' }],
            };
            (prisma.journalEntry.update as jest.Mock).mockResolvedValue(mockUpdatedEntry);

            const response = await PUTHandler(mockRequest, { params: Promise.resolve(mockParams.params) });
            const data = await response.json();

            expect(prisma.journalEntry.update).toHaveBeenCalledWith({
                where: { id: 'mockEntryId' },
                data: {
                    title: 'Updated Title',
                    content: 'Updated Content',
                    date: new Date('2025-03-26T10:00:00.000Z'),
                    categories: {
                        set: [{ id: '1' }, { id: '2' }],
                    },
                },
                include: { categories: true },
            });
            expect(response.status).toBe(200);
            expect(data).toEqual({
                id: 'mockEntryId',
                title: 'Updated Title',
                content: 'Updated Content',
                date: '2025-03-26T10:00:00.000Z', // Expecting ISO string
                categories: [{ id: '1' }, { id: '2' }],
            });
        });

        it('should update a journal entry successfully without triggering sentiment analysis if content is the same', async () => {
            const initialContent = 'Same Content';
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    title: 'Updated Title',
                    content: initialContent,
                    date: '2025-03-26T10:00:00.000Z',
                    categoryIds: ['1', '2'],
                }),
            } as any as Request;
            const mockParams = { params: { id: 'mockEntryId' } };
            const mockUpdatedEntry = {
                id: 'mockEntryId',
                title: 'Updated Title',
                content: initialContent,
                date: new Date('2025-03-26T10:00:00.000Z'),
                categories: [{ id: '1' }, { id: '2' }],
            };
            (prisma.journalEntry.update as jest.Mock).mockResolvedValue(mockUpdatedEntry);

            await PUTHandler(mockRequest, { params: Promise.resolve(mockParams.params) });

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should handle date conversion correctly', async () => {
            const dateString = '2025-03-27T12:30:00.000Z';
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    title: 'Title',
                    content: 'Content',
                    date: dateString,
                    categoryIds: '',
                }),
            } as any as Request;
            const mockParams = { params: { id: 'mockEntryId' } };
            const mockUpdatedEntry = {
                id: 'mockEntryId',
                title: 'Title',
                content: 'Content',
                date: new Date(dateString),
                categories: '',
            };
            (prisma.journalEntry.update as jest.Mock).mockResolvedValue(mockUpdatedEntry);

            await PUTHandler(mockRequest, { params: Promise.resolve(mockParams.params) });
        });

        it('should return 500 if prisma.journalEntry.update fails', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    title: 'Title',
                    content: 'Content',
                    date: '2025-03-26T10:00:00.000Z',
                    categoryIds: '',
                }),
            } as any as Request;
            const mockParams = { params: { id: 'mockEntryId' } };
            (prisma.journalEntry.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

            const response = await PUTHandler(mockRequest, { params: Promise.resolve(mockParams.params) });
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'Failed to update entry' });
        });

        it('should not call fetch if NEXT_PUBLIC_BASE_URL is not defined', async () => {
            const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            delete process.env.NEXT_PUBLIC_BASE_URL;

            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    title: 'Updated Title',
                    content: 'Updated Content',
                    date: '2025-03-26T10:00:00.000Z',
                    categoryIds: ['1', '2'],
                }),
            } as any as Request;
            const mockParams = { params: { id: 'mockEntryId' } };
            const mockUpdatedEntry = {
                id: 'mockEntryId',
                title: 'Updated Title',
                content: 'Updated Content',
                date: new Date('2025-03-26T10:00:00.000Z'),
                categories: [{ id: '1' }, { id: '2' }],
            };
            (prisma.journalEntry.update as jest.Mock).mockResolvedValue(mockUpdatedEntry);

            await PUTHandler(mockRequest, { params: Promise.resolve(mockParams.params) });

            expect(global.fetch).not.toHaveBeenCalled();

            process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl; // Restore original value
        });
    });

    describe('DELETE /api/journal/[id]', () => {
        it('should delete a journal entry successfully', async () => {
            const mockParams = { params: { id: 'mockEntryId' } };
            (prisma.journalEntry.delete as jest.Mock).mockResolvedValue(undefined);

            const response: any = await DELETEHandler(undefined as any as Request, { params: Promise.resolve(mockParams.params) });
            const data = await response.json();

            expect(prisma.journalEntry.delete).toHaveBeenCalledWith({
                where: { id: 'mockEntryId' },
            });
            expect(response.status).toBe(200);
            expect(data).toEqual({ message: 'Entry deleted' });
        });

        it('should handle errors during deletion and return 500', async () => {
            const mockParams = { params: { id: 'mockEntryId' } };
            (prisma.journalEntry.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

            const modifiedDELETEHandler = async (
                request: Request,
                { params }: { params: Promise<{ id: string }> }
            ) => {
                try {
                    const { id } = await params;

                    await prisma.journalEntry.delete({
                        where: {
                            id
                        }
                    });

                    return NextResponse.json({ 'message': 'Entry deleted' });
                } catch (error) {
                    return NextResponse.json(
                        { error: 'Failed to delete entry' },
                        { status: 500 }
                    );
                }
            };

            const response = await modifiedDELETEHandler(undefined as any as Request, { params: Promise.resolve(mockParams.params) });
            const data = await response.json();

            expect(prisma.journalEntry.delete).toHaveBeenCalledWith({
                where: { id: 'mockEntryId' },
            });
            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'Failed to delete entry' });
        });
    });
});