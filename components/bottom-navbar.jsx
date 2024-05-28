"use client"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const details = [
  {
    Severity: "Critical",
    Time: "10-12-2022 12:04 PM",
    Camera: "4th Phase_02",
    Applications: "-",
    Messages: "-",
    Action: "-",
    details: "View Details",
    id: 1,
  },
  {
    Severity: "Medium",
    Time: "10-12-2022 12:04 PM",
    Camera: "4th Phase_02",
    Applications: "-",
    Messages: "-",
    Action: "-",
    details: "View Details",
    id: 2,
  },
  {
    Severity: "Critical",
    Time: "10-12-2022 12:04 PM",
    Camera: "4th Phase_02",
    Applications: "-",
    Messages: "-",
    Action: "-",
    details: "View Details",
    id: 3,
    color: "",
  },
  {
    Severity: "Low",
    Time: "10-12-2022 12:04 PM",
    Camera: "4th Phase_02",
    Applications: "-",
    Messages: "-",
    Action: "-",
    details: "View Details",
    id: 4,
  },
  {
    Severity: "Critical",
    Time: "10-12-2022 12:04 PM",
    Camera: "4th Phase_02",
    Applications: "-",
    Messages: "-",
    Action: "-",
    details: "View Details",
    id: 5,
  },
]
export default function BottomNavBar() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Severity</TableHead>
            <TableHead className="text-black">Time</TableHead>
            <TableHead className="text-black">Camera</TableHead>
            <TableHead className="text-black">Applications</TableHead>
            <TableHead className="text-black">Messages</TableHead>
            <TableHead className="text-black">Action</TableHead>
            <TableHead>
              <Image
                alt="caret-down-icon"
                src="/vectors/caret-down.svg"
                width={24}
                height={24}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {details.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell>
                <Badge variant="outline" className="bg-[#FDC4BD]">
                  {detail.Severity}
                </Badge>
              </TableCell>
              <TableCell>{detail.Time}</TableCell>
              <TableCell>{detail.Camera}</TableCell>
              <TableCell>{detail.Applications}</TableCell>
              <TableCell>{detail.Messages}</TableCell>
              <TableCell>{detail.Action}</TableCell>
              <TableCell>{detail.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
