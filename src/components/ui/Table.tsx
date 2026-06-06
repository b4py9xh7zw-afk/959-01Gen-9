import { useState, useMemo, ReactNode } from 'react'
import { cn } from '../../utils'
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  title: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  showPagination?: boolean
  className?: string
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  showPagination = true,
  className,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey], bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal ?? ''), bStr = String(bVal ?? '')
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [data, sortKey, sortOrder])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, showPagination])

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const getPageNum = (i: number): number => {
    if (totalPages <= 5) return i + 1
    if (currentPage <= 3) return i + 1
    if (currentPage >= totalPages - 2) return totalPages - 4 + i
    return currentPage - 2 + i
  }

  const btnBase = 'p-2 rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary transition-colors'

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 font-medium text-text-secondary text-left',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-text-primary transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key as keyof T)}
                >
                  <div className={cn(
                    'inline-flex items-center gap-1',
                    col.align === 'center' && 'justify-center w-full',
                    col.align === 'right' && 'justify-end w-full'
                  )}>
                    {col.title}
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">暂无数据</td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-light/50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-4 py-3 text-text-primary',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-text-muted">共 {sortedData.length} 条，第 {currentPage} / {totalPages} 页</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={btnBase}>
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={btnBase}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = getPageNum(i)
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === pageNum ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={btnBase}>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={btnBase}>
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Table }
