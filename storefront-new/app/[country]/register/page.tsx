// This is a server component
import Link from 'next/link'
import RegisterForm from './register-form'

type RegisterPageProps = {
  params: {
    country: string
  }
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { country } = params

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-gray-600">
          Join us to track orders, save products, and get personalized recommendations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <RegisterForm country={country} />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href={`/${country}/login`}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}