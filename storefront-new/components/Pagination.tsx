'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null
  }
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return
    }
    
    if (typeof onPageChange === 'function') {
      onPageChange(page)
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Update URL with new page parameter
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      
      const url = window.location.pathname + '?' + params.toString()
      router.push(url)
    }
  }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = 4
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push('...')
      }
      
      // Add page numbers in range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...')
      }
      
      // Always show last page
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6 pt-6">
      {/* Mobile pagination with page indicator */}
      <div className="flex items-center justify-between w-full sm:hidden mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {pageNumbers.map((page, index) => (
              <div key={index}>
                {typeof page === 'number' ? (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    {page}
                  </span>
                )}
              </div>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
      
      {/* Jump to page (desktop only) */}
      <div className="hidden sm:block mt-4 sm:mt-0 sm:ml-6">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value)
              if (!isNaN(page) && page >= 1 && page <= totalPages) {
                handlePageChange(page)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value)
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  handlePageChange(page)
                }
              }
            }}
            className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </nav>
  )
}