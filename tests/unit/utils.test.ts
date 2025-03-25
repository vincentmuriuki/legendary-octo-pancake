import { bcryptCompare } from '../../utils/utils'
import { cn, formatDate } from '../../lib/utils'

describe('Password Utilities', () => {
    test('hashes and verifies password correctly', async () => {
        const password = '1Password'
        const hash = '$2b$12$bFgRME07gOXvKykAJHaAzuhEBlTh/cbGjtS6Hr/pbpGxfSnmv5YQu'

        expect(await bcryptCompare(password, hash)).toBe(true)
    })

    test('rejects invalid password comparison', async () => {
        const hash = '$2b$12$bFgRME07gOXvKykAJHaAzuhEBlTh/cbGjtS6Hr/pbpGxfSnmv5YQ'

        expect(await bcryptCompare('1Password', hash)).toBe(false)
    })
})

describe('Utility Functions', () => {
    describe('cn (className merger)', () => {
        test('merges Tailwind classes correctly', () => {
            const result = cn('px-2', 'px-4')
            expect(result).toBe('px-4')
        })

        test('handles conditional classes', () => {
            const result = cn('bg-red-500', false && 'bg-blue-500', true && 'text-white')
            expect(result).toBe('bg-red-500 text-white')
        })
    })

    describe('formatDate', () => {
        test('formats date correctly', () => {
            const date = new Date('2023-12-25')
            expect(formatDate(date)).toMatch(/Dec 25, 2023/)
        })

        test('handles string input', () => {
            expect(formatDate('2023-12-25T00:00:00')).toMatch(/Dec 25, 2023/)
        })
    })
})