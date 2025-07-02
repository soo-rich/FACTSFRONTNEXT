'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

type DataPaginationProps = {
  currentPage: number
  totalPages: number
  totalElements?: number
  onPageIndexChange: (page: number) => void
  className?: string
  currentPageColor?: string
}

type SimplePaginationProps = Omit<DataPaginationProps, 'totalElements'>

function DataPagination({
  currentPage,
  totalPages,
  totalElements,
  onPageIndexChange,
  className,
  currentPageColor,
}: DataPaginationProps) {
  const isMobile = useIsMobile()
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

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

          {!isMobile && getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageIndexChange(page as number)}
                  isActive={currentPage === page}
                  className={`cursor-pointer hover:bg-accent ${currentPage === page && currentPageColor ? currentPageColor : ''}`}
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
        Page {currentPage} sur {totalPages} • {totalElements ?? 0} résultat{(totalElements ?? 0) > 1 ? 's' : ''}
      </p>
    </div>
  );
}


function SimplePagination({
  currentPage,
  totalPages,
  currentPageColor,
  onPageIndexChange,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageIndexChange(Math.max(0, currentPage - 1))}
            className={currentPage <= 0 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          />
        </PaginationItem>

        {/* Afficher les 5 premières pages ou autour de la page courante */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageIndex: number;

          if (totalPages <= 5) {
            pageIndex = i;
          } else if (currentPage <= 2) {
            pageIndex = i;
          } else if (currentPage >= totalPages - 3) {
            pageIndex = totalPages - 5 + i;
          } else {
            pageIndex = currentPage - 2 + i;
          }

          return (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                onClick={() => onPageIndexChange(pageIndex)}
                isActive={currentPage === pageIndex}
                className={`cursor-pointer ${currentPage === pageIndex && currentPageColor ? currentPageColor : ''}`}
              >
                {pageIndex + 1} {/* Affichage 1-indexed */}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageIndexChange(Math.min(totalPages - 1, currentPage + 1))}
            className={currentPage >= totalPages - 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}


export { DataPagination, SimplePagination };
