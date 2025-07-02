'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  onPageIndexChange: (page: number) => void
  className?: string
}

export function DataPagination({
                                 currentPage,
                                 totalPages,
                                 totalElements,
                                 onPageIndexChange,
                                 className
                               }: DataPaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageIndexChange(currentPage - 1)}
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer hover:bg-accent'
              }
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageIndexChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer hover:bg-accent"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageIndexChange(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer hover:bg-accent'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Info pagination */}
      <p className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages} • {totalElements} résultat{totalElements > 1 ? 's' : ''}
      </p>
    </div>
  )
}