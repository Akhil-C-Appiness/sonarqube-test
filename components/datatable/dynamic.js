"use client"

import * as React from "react"
import { useEffect } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DataTable = ({
  data,
  columns,
  savedColors,
  savedAudios,
  selectedEventId,
  showSelectedEvent,
}) => {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  // console.log(table, 'table ')
  // console.log(table.getTotalSize(), 'table getTotalSize')
  // console.log(table.getPageCount(), 'table getPageCount')
  // console.log(table.getPageOptions(), 'table getPageOptions')
  // console.log(table.getState().pagination, 'table pagination')
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  function isRTL(str) {
    const rtlChars =
      "\u0590-\u05FF\u0600-\u06FF\u0700-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF"
    const rtlDirCheck = new RegExp(`[${rtlChars}]`)
    return rtlDirCheck.test(str)
  }
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#EEF8FF]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      selectedEventId === row.original.id
                        ? "cursor-pointer bg-sky-200 hover:bg-sky-200"
                        : "cursor-pointer"
                    }
                    onClick={() => {
                      showSelectedEvent(row.original.id)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          // style={cell.column.id === "eventType" ? rowStyle : {}}
                        >
                          <span
                            dir={isRTL(cell?.getValue() || "") ? "rtl" : "ltr"}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center  space-x-2 py-4">
        <div> Page {currentPage} </div>
        <div className="flex grow justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
