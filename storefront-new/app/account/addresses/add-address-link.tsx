'use client'

import { useRouter } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function AddAddressLink() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/us/account/addresses/new')}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Add New Address
    </button>
  )
}
