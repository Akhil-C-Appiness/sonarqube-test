"use client"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import isRTL from '@/lib/isRTL'

export default function EventsTable(props) {
  // console.log("updatedData",props.updatedData[0])
  return (
    <div className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Event ID</TableHead>
            <TableHead className="text-black">Severity</TableHead>
            <TableHead className="text-black">Date and Time</TableHead>
            <TableHead className="text-black">Camera</TableHead>
            <TableHead className="text-black">Vehicle Number</TableHead>
            <TableHead className="text-black">Violation Type</TableHead>
            <TableHead className="text-black">Action</TableHead>
            {/* <TableHead>
              <Image
                alt="caret-down-icon"
                src="/vectors/caret-down.svg"
                width={24}
                height={24}
              />
            </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {props.eventDetailObj.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-[#FDC4BD]">
                  {event.severity}
                </Badge>
              </TableCell>
              <TableCell>
                {event.date} {event.time}
              </TableCell>
              <TableCell>{event.cameraName}</TableCell>
              <TableCell className="max-w-[15%]"   dir={isRTL(event.vehicleNo) ? 'rtl' : 'ltr'}>{event.vehicleNo}</TableCell>
              <TableCell>{event.violationType}</TableCell>
              <TableCell>
                <Button variant="default" onClick={() => {props.viewDetails(event.id)}}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
