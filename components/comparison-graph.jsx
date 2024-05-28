import React, { useState } from "react"
import Image from "next/image"
import { format, set } from "date-fns"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/event-accordion"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompareChart from "@/components/compareChart"
import DTable from "@/components/datatable/dynamic"
import ViewFootageModal from "@/components/view-footage-modal"

import DataTable from "./data-table"

const ComparisonGraph = ({
  dataList,
  dataList2,
  compareType,
  firstDate,
  secondDate,
  timeInterval,
  setTimeInterval,
  firstEventList,
  secondEventList,
  violationList,
  secondGraphDate,
  firstGraphDate,
}) => {
  const [showTable, setShowTable] = useState(false)
  let [selectedElement, setselectedElement] = useState(null)
  const [open, setOpen] = useState(false)
  const viewDetails = (data) => {
    console.log(data, "eventdata")
    setselectedElement(data)
    setOpen(true)
  }

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
        return "Black"
      case 1:
        return "White"
      case 2:
        return "Grey"
      case 3:
        return "Red"
      case 4:
        return "Yellow"
      case 5:
        return "Green"
      case 6:
        return "Blue"
      case 7:
        return "Orange"
      case 8:
        return "Silver"
      case 9:
        return "Brown"
      default:
        return "white"
    }
  }
  const convertToVehicleType = (type) => {
    switch (type) {
      case 0:
        return "Two Wheeler"
      case 1:
        return "Three Wheeler"
      case 2:
        return "Four Wheeler"
      case 3:
        return "Heavy Vehicle"
      default:
        return "Others"
    }
  }

  const convertToViolationType = (type) => {
    const violation = violationList.find(
      (violation) => violation.alerttype === type
    )
    if (violation) {
      return violation.alertname
    } else {
      return "Others"
    }
  }

  const columns = [
    {
      accessorKey: "eventType",
      header: "Type of Events",
      cell: ({ row }) => (
        <div>{convertToViolationType(row.getValue("eventType"))}</div>
      ),
    },
    {
      accessorKey: "objectProperty2",
      header: "Vehicle Type",
      cell: ({ row }) => (
        <div> {convertToVehicleType(row.getValue("objectProperty2"))}</div>
      ),
    },
    {
      accessorKey: "objectProperty6",
      header: "Registration Type",
      cell: ({ row }) => (
        <div>
          {" "}
          {convertToRegType(
            convertToVehicleType(row.getValue("objectProperty6"))
          )}{" "}
        </div>
      ),
    },
    {
      accessorKey: "objectProperty1",
      header: "Color",
      cell: ({ row }) => (
        <div>
          {" "}
          {convertToColour(
            convertToVehicleType(row.getValue("objectProperty1"))
          )}{" "}
        </div>
      ),
    },
    {
      accessorKey: "cameraName",
      header: "Camera Name",
      cell: ({ row }) => <div> {row.getValue("cameraName")} </div>,
    },
    {
      accessorKey: "junctionName",
      header: "Location",
      cell: ({ row }) => <div> {row.getValue("junctionName")} </div>,
    },
    {
      accessorKey: "objectId",
      header: "license Plate",
      cell: ({ row }) => <div> {row.getValue("objectId")} </div>,
    },
    {
      accessorKey: "startTime",
      header: "Timestamp",
      cell: ({ row }) => (
        <div> {convertToDate(row.getValue("startTime"))} </div>
      ),
    },
    {
      accessorKey: "id",
      header: "View",
      cell: ({ row }) => {
        console.log(row.original)
        return (
          <div>
            <Button
              variant="ghost"
              className="px-0 text-[14px] font-bold text-[#2A94E5] hover:bg-transparent"
              onClick={() => {
                viewDetails(row.original)
              }}
            >
              View Snap
            </Button>
          </div>
        )
      },
    },
  ]

  const convertToDate = (epochTimestamp) => {
    const date = new Date(epochTimestamp * 1000)
    const formattedDateTime = date.toLocaleString()
    return formattedDateTime
  }

  return (
    <div className="mt-4 w-full bg-white p-8">
      <div className="flex flex-row items-start justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-black">
            {compareType}
          </h1>
          <p className="mt-4 text-sm">
            {format(firstGraphDate, "PPP")} | {format(secondGraphDate, "PPP")}
          </p>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <p className="text-16px">Time Interval</p>
          <Select
            defaultValue={120}
            value={timeInterval}
            onValueChange={(value) => setTimeInterval(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="4 hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={120}>2 hours</SelectItem>
              <SelectItem value={240}>4 hours</SelectItem>
            </SelectContent>
          </Select>
          {/* <Popover>
            <PopoverTrigger className="mb-2 p-2 text-lg font-bold">
              ...
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4"></PopoverContent>
          </Popover> */}
        </div>
      </div>
      <div className="relative left-[-2em]">
        <CompareChart
          dataList={dataList}
          dataList2={dataList2}
          timeInterval={timeInterval}
          firstDate={firstDate}
          secondDate={secondDate}
          secondGraphDate={secondGraphDate}
          firstGraphDate={firstGraphDate}
        />
      </div>
      <div className="mt-[2em] w-full grow-0">
        <div className="flex flex-row items-center justify-between">
          {/* <div className="flex items-center justify-between gap-2 py-2 text-sm text-black">
            <Checkbox
              id="show-data"
              value={showTable}
              onCheckedChange={setShowTable}
            />
            <Label htmlFor="show-data">Show Data Table</Label>
          </div> */}
        </div>
        <div className=" mt-4 min-h-screen">
          {showTable && (
            <Tabs defaultValue="tab-1">
              <TabsList className="">
                <TabsTrigger
                  value="tab-1"
                  className="border border-slate-200 px-4 py-1 text-sm hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {format(firstDate, "PPP")}
                </TabsTrigger>
                <TabsTrigger
                  value="tab-2"
                  className="border border-slate-200 px-4 py-1 text-sm hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {format(secondDate, "PPP")}
                </TabsTrigger>
                <TabsTrigger
                  value="tab-3"
                  className="border border-slate-200 px-4 py-1 text-sm hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  View both Dates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab-1">
                {/* <DataTable events={firstEventList} /> */}
                <DTable data={firstEventList} columns={columns} />
              </TabsContent>
              <TabsContent value="tab-2">
                {/* <DataTable events={secondEventList} /> */}
                <DTable data={secondEventList} columns={columns} />
              </TabsContent>
              <TabsContent value="tab-3">
                <div className="flex max-w-[99%] flex-row gap-4 overflow-auto  ">
                  <div>
                    <DTable data={firstEventList} columns={columns} />
                  </div>
                  <div>
                    <DTable data={secondEventList} columns={columns} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-auto lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Quick Event View</DialogTitle>
              <DialogDescription>
                {selectedElement && (
                  <ViewFootageModal events={selectedElement} />
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
export default ComparisonGraph;