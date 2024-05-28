
import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

const DataTable = ()=>{
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#EEF8FF]">
              <TableRow>
                <TableHead><Checkbox /></TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>FIR</TableHead>
                <TableHead>Police Station</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow className="bg-[#F6F6F6]">
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow className="bg-[#F6F6F6]">
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow className="bg-[#F6F6F6]">
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
            <TableRow className="bg-[#F6F6F6]">
                <TableCell><Checkbox /></TableCell>
                <TableCell>MP04CX7834</TableCell>
                <TableCell>Stolen</TableCell>
                <TableCell>Swapan Das</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default DataTable;