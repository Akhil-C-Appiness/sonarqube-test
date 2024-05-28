"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import Pagination from "@/lib/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ViewFootageModal from "@/components/view-footage-modal"

import { Button } from "./ui/button"

const convertToRegType = (type) => {
  switch (type) {
    case 0:
      return "Others"
    case 1:
      return "Private"
    case 2:
      return "Commercial"
    case 3:
      return "Army"
    case 4:
      return "Electrical"
    default:
      return "Others"
  }
}

const convertToColour = (type) => {
  switch (type) {
    case 0:
      return "Undetermined"
    case 1:
      return "Black"
    case 2:
      return "White"
    case 3:
      return "Grey"
    case 4:
      return "Red"
    case 5:
      return "Yellow"
    case 6:
      return "Green"
    case 7:
      return "Blue"
    case 8:
      return "Orange"
    case 9:
      return "Silver"
    case 10:
      return "Brown"
    case 99:
      return "Not Applicable"
    default:
      return "white"
  }
}
const convertToVehicleType = (type) => {
  switch (type) {
    case 0:
      return "Motorbike"
    case 1:
      return "Auto"
    case 2:
      return "Car"
    case 3:
      return "Carrier"
    case 4:
      return "Bus"
    case 5:
      return "Lorry"
    case 6:
      return "Maxicab"
    case 7:
      return "Jeep"
    case 8:
      return "Electric Scooter"
    case 9:
      return "Electric Car"
    case 99:
      return "Undetermined"
    default:
      return "Others"
  }
}
const convertToViolationType = (type) => {
  switch (type) {
    case 323:
      return "Stop Line Violation"
    case 320:
      return "Over Speed"
    case 300:
      return "Red Light Violation Detection"
    case 327:
      return "Pillion Rider No Helmet"
    case 326:
      return "Triple Ride"
    case 325:
      return "No Helmet"
    case 322:
      return "No Seat Belt"
    case 412:
      return "Without Side Mirror"
    case 318:
      return "Obstruction to Traffic"
    case 411:
      return "Without Uniform"
    case 364:
      return "Average Speed Violation"
    case 317:
      return "No Entry Violation"
    case 410:
      return "Footpath Driving"
    case 316:
      return "Rash Driving"
    case 315:
      return "Wrong Number Plate"
    case 220:
      return "No Parking"
    case 405:
      return "Wrong Parking"
    case 311:
      return "Vehicle Wrong Way"
    case 403:
      return "Parking on Footpath"
    case 396:
      return "Parking near Traffic Light / Stopping on Zebra Cross"
    case 394:
      return "Parking in a main road"
    case 393:
      return "Double Parking"
    case 392:
      return "Using black film/other materials"
    case 391:
      return "Obstructing Driver"
    case 335:
      return "Heavy Vehicle Not Covered"
    case 334:
      return "Wrong Lane Violation"
    case 333:
      return "Solid Line Violation"
    case 332:
      return "Left Lane Blocking"
    case 331:
      return "Fancy License Plate"
    case 381:
      return "Vehicle Wrong Turn"
    case 329:
      return "Driver On Call"
    case 380:
      return "Two Wheeler Driver On Call"
    case 330:
      return "No License Plate"
    default:
      return "Others"
  }
}

const convertToDate = (epochTimestamp) => {
  const date = new Date(epochTimestamp)
  const formattedDateTime = date.toLocaleString()
  return formattedDateTime
}

const DataTable = (events) => {
  // useEffect(() => {
  //   setquantity(events?.events.slice(0, 100))
  // }, [events?.events])
  // const [quantity, setquantity] = useState([])
  let [selectedElement, setselectedElement] = useState({})
  const [open, setOpen] = useState(false)
  function viewDetails(data) {
    let selectedElement = events.events?.find((element) => {
      return element.id == data
    })
    setselectedElement(selectedElement)
    setOpen(true)
  }
  // const pageHandler = (page) => {
  //   setquantity(events?.events?.slice(page * 100, (page + 1) * 100))
  // }
  const totalPages = Math.ceil(events?.events?.length / 20)
  const [currentPage, setCurrentPage] = useState(1)
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1)
  }
  const handleFirstPage = () => {
    setCurrentPage(1)
  }
  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }
  const startIndex = (currentPage - 1) * 20
  const endIndex = startIndex + 20
  const currentItems = events?.events?.slice(startIndex, endIndex)
  return (
    <section className=" relative top-[2em] w-full bg-[#FFFFFF]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-[#0F0F10]">
              Type of Events
            </TableHead>
            <TableHead className=" font-semibold text-[#0F0F10]">
              Vehicle Type
            </TableHead>
            <TableHead className="font-semibold text-[#0F0F10]">
              Registration Type
            </TableHead>
            <TableHead className="font-semibold text-[#0F0F10]">
              Color
            </TableHead>
            <TableHead className="font-semibold text-[#0F0F10]">
              Camera Name
            </TableHead>
            <TableHead className="font-semibold text-[#0F0F10]">
              Location
            </TableHead>
            <TableHead className="font-semibold text-[#0F0F10]">
              License Plate
            </TableHead>
            <TableHead className=" font-semibold text-[#0F0F10]">
              Timestamp
            </TableHead>
            <TableHead className=" font-semibold text-[#0F0F10]">
              View
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems?.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{convertToViolationType(event.eventType)}</TableCell>
              <TableCell>
                {convertToVehicleType(event.objectProperty2)}
              </TableCell>
              <TableCell>{convertToRegType(event.objectProperty6)}</TableCell>
              <TableCell>{convertToColour(event.objectProperty1)}</TableCell>
              <TableCell>{event.cameraName}</TableCell>
              <TableCell>{event.junctionName}</TableCell>
              <TableCell>{event.objectId}</TableCell>
              <TableCell>{convertToDate(event.startTime)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  className="text-[14px] font-bold text-[#2A94E5] hover:bg-transparent"
                  onClick={() => {
                    viewDetails(event.id)
                  }}
                >
                  View Snap
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        data={events.events}
        // pageHandler={pageHandler}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        totalPages={totalPages}
        currentPage={currentPage}
        handleFirstPage={handleFirstPage}
        handleLastPage={handleLastPage}
      />
      <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-auto lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Quick Event View</DialogTitle>
              <DialogDescription>
                <ViewFootageModal events={selectedElement} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default DataTable
