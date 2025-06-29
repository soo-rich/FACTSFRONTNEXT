import * as React from "react"
import {ChevronLeft, ChevronRight, MoreHorizontal} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"

interface PaginationProps {
    total: number
    page: number
    onChange: (page: number) => void
    siblings?: number
    boundaries?: number
    size?: "sm" | "md" | "lg"
    showControls?: boolean
    isCompact?: boolean
    className?: string
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
    (
        {
            total,
            page,
            onChange,
            siblings = 1,
            boundaries = 1,
            size = "md",
            showControls = true,
            isCompact = false,
            className,
            ...props
        },
        ref
    ) => {
        const range = React.useMemo(() => {
            const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
            if (totalPageNumbers >= total) {
                return Array.from({length: total}, (_, i) => i + 1)
            }

            const leftSiblingIndex = Math.max(page - siblings, boundaries)
            const rightSiblingIndex = Math.min(page + siblings, total - boundaries)

            const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
            const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1)

            if (!shouldShowLeftDots && shouldShowRightDots) {
                const leftItemCount = siblings * 2 + boundaries + 2
                return [
                    ...Array.from({length: leftItemCount}, (_, i) => i + 1),
                    "dots",
                    ...Array.from({length: boundaries}, (_, i) => total - boundaries + i + 1),
                ]
            }

            if (shouldShowLeftDots && !shouldShowRightDots) {
                const rightItemCount = boundaries + 1 + 2 * siblings
                return [
                    ...Array.from({length: boundaries}, (_, i) => i + 1),
                    "dots",
                    ...Array.from({length: rightItemCount}, (_, i) => total - rightItemCount + i + 1),
                ]
            }

            return [
                ...Array.from({length: boundaries}, (_, i) => i + 1),
                "dots",
                ...Array.from(
                    {length: rightSiblingIndex - leftSiblingIndex + 1},
                    (_, i) => leftSiblingIndex + i
                ),
                "dots",
                ...Array.from({length: boundaries}, (_, i) => total - boundaries + i + 1),
            ]
        }, [total, page, siblings, boundaries])

        const sizeClasses = {
            sm: "h-8 min-w-8 text-xs",
            md: "h-10 min-w-10 text-sm",
            lg: "h-12 min-w-12 text-base"
        }

        const handlePageChange = (newPage: number) => {
            if (newPage >= 1 && newPage <= total && newPage !== page) {
                onChange(newPage)
            }
        }

        const PaginationButton = ({
                                      pageNumber,
                                      isActive = false,
                                      children
                                  }: {
            pageNumber?: number
            isActive?: boolean
            children: React.ReactNode
        }) => {
            return (
                <Button
                    variant={isActive ? "default" : "outline"}
                    size="icon"
                    className={cn(
                        sizeClasses[size],
                        "rounded-lg font-medium transition-colors",
                        isActive && "bg-primary text-primary-foreground shadow-md",
                        !isActive && "border-border hover:bg-accent hover:text-accent-foreground",
                        isCompact && "min-w-0"
                    )}
                    onClick={() => pageNumber && handlePageChange(pageNumber)}
                    disabled={!pageNumber}
                >
                    {children}
                </Button>
            )
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center gap-1",
                    isCompact && "gap-0.5",
                    className
                )}
                {...props}
            >
                {showControls && (
                    <PaginationButton
                        pageNumber={page - 1}
                    >
                        <ChevronLeft className="h-4 w-4"/>
                    </PaginationButton>
                )}

                {range.map((item, index) => {
                    if (item === "dots") {
                        return (
                            <div
                                key={`dots-${index}`}
                                className={cn(
                                    "flex items-center justify-center",
                                    sizeClasses[size]
                                )}
                            >
                                <MoreHorizontal className="h-4 w-4"/>
                            </div>
                        )
                    }

                    return (
                        <PaginationButton
                            key={item}
                            pageNumber={item as number}
                            isActive={item === page}
                        >
                            {item}
                        </PaginationButton>
                    )
                })}

                {showControls && (
                    <PaginationButton
                        pageNumber={page + 1}
                    >
                        <ChevronRight className="h-4 w-4"/>
                    </PaginationButton>
                )}
            </div>
        )
    }
)

Pagination.displayName = "Pagination"

export {Pagination}

// Hook utilitaire pour gérer l'état de pagination
export const usePagination = (initialPage = 1) => {
    const [page, setPage] = React.useState(initialPage)

    const handlePageChange = React.useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const reset = React.useCallback(() => {
        setPage(1)
    }, [])

    return {
        page,
        onChange: handlePageChange,
        reset
    }
}