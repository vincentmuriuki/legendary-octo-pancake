import { loginSchema, signupSchema } from '../../lib/validators'

describe('Auth Schemas', () => {
    describe('Login Schema', () => {
        test('validates correct input', () => {
            const validData = {
                email: 'user@example.com',
                password: 'validPassword123'
            }
            expect(() => loginSchema.parse(validData)).not.toThrow()
        })

        test('rejects invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password123'
            }
            expect(() => loginSchema.parse(invalidData)).toThrow('In valid email')
        })

        test('rejects short password', () => {
            const invalidData = {
                email: 'user@example.com',
                password: '1234'
            }
            expect(() => loginSchema.parse(invalidData)).toThrow('at least 5 characters')
        })
    })

    describe('Signup Schema', () => {
        test('validates correct input', () => {
            const validData = {
                email: 'user@example.com',
                password: 'ValidPass123'
            }
            expect(() => signupSchema.parse(validData)).not.toThrow()
        })

        test('rejects password without uppercase', () => {
            const invalidData = {
                email: 'user@example.com',
                password: 'invalidpass123'
            }
            expect(() => signupSchema.parse(invalidData)).toThrow('uppercase letter')
        })

        test('rejects password without number', () => {
            const invalidData = {
                email: 'user@example.com',
                password: 'InvalidPassword'
            }
            expect(() => signupSchema.parse(invalidData)).toThrow('number')
        })
    })
})