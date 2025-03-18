import { SignIn } from '@/components/auth/signin'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Journal App Login</h1>
        <SignIn />
      </div>
    </div>
  )
}