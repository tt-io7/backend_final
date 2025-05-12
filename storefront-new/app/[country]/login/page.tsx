// This is a server component
import Link from 'next/link'
import LoginForm from './login-form'

type LoginPageProps = {
  params: {
    country: string
  }
}

export default function LoginPage({ params }: LoginPageProps) {
  const { country } = params

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-gray-600">
          Access your account and manage your orders
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <LoginForm country={country} />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href={`/${country}/register`}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}