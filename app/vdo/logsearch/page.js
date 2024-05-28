"use client"

import { useEffect, useState } from "react"
import { format, parse, set } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { getLogCount, getLogs } from "@/lib/api"
import Pagination from "@/lib/pagination"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TimePicker from "@/components/timePicker"

const components = [
  "Media Server",
  "IVMS",
  "Analytic Server",
  "Camera",
  "Storage",
  "Site Map",
  "Login User",
  "Location",
  "Group",
  "Alert",
  "Vehicle",
  "Recorder",
]
const statuses = [
  "OK",
  "Inaccessible",
  "Pause",
  "Storage Low",
  "Storage Full",
  "Stop",
  "Start",
  "Add",
  "Delete",
  "Update",
  "Login",
  "Logout",
  "Registration",
  "Update",
]
const LogSearch = () => {
  const [component, setComponent] = useState("")
  const [status, setStatus] = useState("")
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [startTime, setStartTime] = useState("12:00:00 AM")
  const [endTime, setEndTime] = useState("11:59:00 PM")
  const [startingTime, setStartingTime] = useState("")
  const [endingTime, setEndingTime] = useState("")
  const [message, setMessage] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [payload, setPayload] = useState({})
  const totalPages = Math.ceil(totalRecords / 20)
  const currentOffset = (currentPage - 1) * 20
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await getLogs(payload)
      setData(res.data.result)
    }
    fetchLogs()
  }, [payload])
  const handleOptionChange = (val) => {
    setSelectedOption(val)
  }
  const handleLogSearch = async () => {
    let parsedDate = new Date(fromDate)
    let parsedStartTime = parse(startTime, "h:mm aa", new Date())
    let combinedStartTime = set(parsedDate, {
      hours: parsedStartTime.getHours(),
      minutes: parsedStartTime.getMinutes(),
      seconds: parsedStartTime.getSeconds(),
    })
    let startingTime = Math.floor(combinedStartTime.getTime())
    let parsedToDate = new Date(toDate)
    let parsedEndTime = parse(endTime, "h:mm aa", new Date())
    let combinedEndTime = set(parsedToDate, {
      hours: parsedEndTime.getHours(),
      minutes: parsedEndTime.getMinutes(),
      seconds: parsedEndTime.getSeconds(),
    })

    let endingTime = Math.floor(combinedEndTime.getTime())
    setStartingTime(startingTime)
    setEndingTime(endingTime)
    const payload = {
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "latest" ? true : false,
    }
    const offset = (currentPage - 1) * 20

    const payload1 = {
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "newest" ? true : false,
      limit: 20,
      offset: offset,
    }
    const res = await getLogCount(payload)
    setTotalRecords(res.data?.result[0])
    console.log(payload1)
    const res2 = await getLogs(payload1)
    setData(res2.data?.result)
  }
  const handleFirstPage = async () => {
    setCurrentPage(1)
    const payload = {
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "newest" ? true : false,
      limit: 20,
      offset: 0,
    }
    const res = await getLogs(payload)
    setData(res.data?.result)
  }
  const handleLastPage = async () => {
    setCurrentPage(totalPages)
    const offset = (totalPages - 1) * 20
    const payload = {
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "newest" ? true : false,
      limit: 20,
      offset: offset,
    }
    const res = await getLogs(payload)
    setData(res.data?.result)
  }
  const convertToNormalTime = (time) => {
    const date = new Date(time)
    const formattedDate = date.toLocaleDateString()
    const formattedTime = date.toLocaleTimeString()
    const formattedDateTime = `${formattedDate} ${formattedTime}`
    return formattedDateTime
  }

  const handleNextPage = async () => {
    setCurrentPage((prevPage) => prevPage + 1)
    setPayload({
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "newest" ? true : false,
      limit: 20,
      offset: currentOffset,
    })
    // const payload = {
    //     startTime: startingTime,
    //     endTime: endingTime,
    //     component: component,
    //     status: status,
    //     message: message,
    //     level: -1,
    //     descedingOrder: selectedOption === "newest" ? true : false,
    //     limit: 20,
    //     offset: currentOffset,
    //   }
    //   console.log(payload)
    //   const res = await getLogs(payload)
    //   setData(res.data?.result)
  }
  console.log(currentPage, "currentPage")
  console.log(currentOffset, "currentOffset")
  const handlePrevPage = async () => {
    setCurrentPage((prevPage) => prevPage - 1)
    setPayload({
      startTime: startingTime,
      endTime: endingTime,
      component: component,
      status: status,
      message: message,
      level: -1,
      descedingOrder: selectedOption === "newest" ? true : false,
      limit: 20,
      offset: currentOffset,
    })
  }
  return (
    <>
      <section className="mt-8 w-full">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4">
            <div className="flex items-center gap-4">
              <span>Component :</span>
              <Select value={component} onValueChange={(e) => setComponent(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Component" />
                </SelectTrigger>
                <SelectContent>
                  {components.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span>From :</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      format(fromDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-4">
              <TimePicker
                value={startTime}
                onChange={(val) => setStartTime(val)}
              />
            </div>
            <div className="flex items-center gap-4">
              <span>Message Filter :</span>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-12">
            <div className="flex items-center gap-4">
              <span>Status :</span>
              <Select value={status} onValueChange={(e) => setStatus(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span>To :</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-4">
              <TimePicker value={endTime} onChange={(val) => setEndTime(val)} />
            </div>
            <div className="flex items-center gap-4">
              <span>Oldest First</span>
              <input
                value="oldest"
                type="radio"
                checked={selectedOption === "oldest"}
                onChange={(e) => handleOptionChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <span>Newest First</span>
              <input
                value="newest"
                type="radio"
                checked={selectedOption === "newest"}
                onChange={(e) => handleOptionChange(e.target.value)}
              />
            </div>
            <Button onClick={handleLogSearch}>Search</Button>
          </div>
        </div>
      </section>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#0F0F10]">
                Time
              </TableHead>
              <TableHead className=" font-semibold text-[#0F0F10]">
                Component
              </TableHead>
              <TableHead className="font-semibold text-[#0F0F10]">
                Status
              </TableHead>
              <TableHead className="font-semibold text-[#0F0F10]">
                User
              </TableHead>
              <TableHead className="font-semibold text-[#0F0F10]">
                Message
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{convertToNormalTime(item?.timeStamp)}</TableCell>
                <TableCell>{item?.component}</TableCell>
                <TableCell>{item?.status}</TableCell>
                <TableCell>{item?.module}</TableCell>
                <TableCell>{item?.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          className="flex flex-wrap items-center justify-center gap-[2em]"
          style={{ marginBottom: "2em", marginTop: "1em" }}
        >
          <Button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            variant="blueoutline"
          >
            Go to First
          </Button>
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="blueoutline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="blueoutline"
            className=""
          >
            Next
          </Button>
          <Button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            variant="blueoutline"
            className=""
          >
            Go to Last
          </Button>
        </div>
      </section>
    </>
  )
}

export default LogSearch
