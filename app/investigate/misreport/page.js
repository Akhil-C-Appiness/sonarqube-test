"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';
// import Image from "next/image"
import useStore from "@/store/store"
import {
  addDays,
  format,
  parse,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRangePicker } from "react-date-range"

import { exportMis, getAllLoggedUsersStatus } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Image = dynamic(() => import("next/image"));

const MisReport = (props) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  })
  const [startTime, setStartTime] = useState("00:00:00")
  const [endTime, setEndTime] = useState("00:00:00")
  const [startMinute, setStartMinute] = useState("00")
  const [startSecond, setStartSecond] = useState("00")
  const [endMinute, setEndMinute] = useState("00")
  const [endSecond, setEndSecond] = useState("00")
  const [startDateTimeVal, setStartDateTimeVal] = useState("")
  const [endDateTimeVal, setEndDateTimeVal] = useState("")
  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedJunction, setSelectedJunction] = useState(null)
  const [selectedViolation, setSelectedViolation] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const hoursOption = Array.from({ length: 24 }, (_, index) => index)
  const minutsOption = Array.from({ length: 60 }, (_, index) => index)
  const cities = useStore((state) => state.cities)
  const setCities = useStore((state) => state.setCities)
  const setAreas = useStore((state) => state.setAreas)
  const areas = useStore((state) => state.areas)
  const setJunctions = useStore((state) => state.setJunctions)
  const junctions = useStore((state) => state.junctions)
  const setUsersList = useStore((state) => state.setUsersList)
  const usersList = useStore((state) => state.usersList)
  const analytics = useStore((state) => state.analyticsForMis)
  const setAnalytics = useStore((state) => state.setAnalyticsForMis)
  const [selectedTimeMode, setSelectedTimeMode] = useState(0)
  const [date, setDate] = useState({
    from: "",
    to: "",
  })
  useEffect(() => {
    setCities()
    setUsersList()
    setAnalytics()
  }, [])
  useEffect(() => {
    if (cities.length > 0) {
      setAreas(cities[0].id)
    }
  }, [cities, setAreas])
  useEffect(() => {
    if ((selectedArea, cities.length > 0)) {
      setJunctions(cities[0].id, selectedArea)
    }
  }, [cities, selectedArea, setJunctions])

  useEffect(() => {
    const response = getAllLoggedUsersStatus().then((res) => {
      setUsers(res.data.result)
    })
  }, [])

  useEffect(() => {
    const { startDate, endDate } = dateRange
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(endDate)
    const newStartDate2 = changeTimeInDate(
      newStartDate,
      startTime,
      startMinute,
      startSecond
    )
    const newEndDate2 = changeTimeInDate(
      newEndDate,
      endTime,
      endMinute,
      endSecond
    )
    const startOfDayEpoch = newStartDate2.getTime()
    const endOfDayEpoch = newEndDate2.getTime()
    setStartDateTimeVal(startOfDayEpoch)
    setEndDateTimeVal(endOfDayEpoch)
  }, [
    dateRange,
    startTime,
    endTime,
    startMinute,
    startSecond,
    endMinute,
    endSecond,
  ])
  function changeTimeInDate(originalDate, hours, minutes, seconds) {
    return setSeconds(
      setMinutes(setHours(originalDate, hours), minutes),
      seconds
    )
  }
  const handleDateRangeChange = (selectedRange) => {
    setDateRange(selectedRange.selection)
  }
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value)
    setEndTime(endTime)
  }
  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value)
    setStartTime(startTime)
  }
  const handleStartMinuteChange = (event) => {
    setStartMinute(event.target.value)
  }
  const handleStartSecondChange = (event) => {
    setStartSecond(event.target.value)
  }
  const handleEndMinuteChange = (event) => {
    setEndMinute(event.target.value)
  }
  const handleEndSecondChange = (event) => {
    setEndSecond(event.target.value)
  }
  const handleUserSelection = (val, id) => {
    if (val) {
      setSelectedUsers((prev) => [...prev, id])
    } else {
      setSelectedUsers((prev) => prev.filter((item) => item !== id))
    }
  }
  const handleExport = () => {
    const msId = junctions?.find(
      (junction) => junction.id == selectedJunction
    )?.serverid
    const isMsId = msId ? true : false
    const applicationList = selectedEvents.length > 0 ? true : false
    const users = selectedUsers.length > 0 ? true : false
    const removeSpaces = (str) => str.replace(/,\s*/g, ",")
    const modifiedArray = selectedEvents?.map((number) =>
      removeSpaces(number.toString())
    )

    let payload = {
      timeMode: selectedTimeMode,
      starttimestamp: startDateTimeVal,
      endtimestamp: endDateTimeVal,
    }
    if (isMsId) {
      payload = { ...payload, msId: msId }
    }
    if (applicationList) {
      payload = { ...payload, applicationList: selectedEvents }
    }
    if (users) {
      payload = { ...payload, users: selectedUsers }
    }
    console.log(payload)

    const queryString = Object.entries(payload)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // Join array elements with a comma and space
          return `${key}=${value.map(encodeURIComponent).join(", ")}`
        }
        // Encode key and value separately
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join("&")
    console.log(queryString)
    const response = exportMis(queryString)
    console.log(response)
  }
  const handleReset = () => {
    setSelectedArea(null)
    setSelectedJunction(null)
    setSelectedTimeMode(0)
    setSelectedViolation(null)
    setSelectedEvents([])
    setSelectedUser(null)
    setSelectedUsers([])
    handleDateRangeChange({
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    })
    setStartTime("00:00:00")
    setEndTime("00:00:00")
    setStartMinute("0")
    setStartSecond("0")
    setEndMinute("0")
    setEndSecond("0")
  }
  const handleEventSelection = (val, id) => {
    if (val) {
      setSelectedEvents((prev) => [...prev, id])
    } else {
      setSelectedEvents((prev) => prev.filter((item) => item !== id))
    }
  }
  // console.log(selectedJunction, "selectedJunction")
  // console.log(selectedTimeMode, "selectedTimeMode")
  // console.log(selectedViolation, "selectedViolation")
  // console.log(selectedUser, "selectedUser")
  // console.log(startDateTimeVal, "startDateTimeVal")
  // console.log(endDateTimeVal, "endDateTimeVal")
  return (
    <div className="items-top mt-6 flex flex-wrap items-center gap-6">
      <div className="flex flex-col items-start">
        Area
        <Select value={selectedArea} onValueChange={(e) => setSelectedArea(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Area" />
          </SelectTrigger>
          <SelectContent>
            {areas?.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start">
        Junction
        <Select
          value={selectedJunction}
          onValueChange={(e) => setSelectedJunction(e)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Junction" />
          </SelectTrigger>
          <SelectContent>
            {junctions?.map((junction) => (
              <SelectItem key={junction.id} value={junction.id}>
                {junction.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start">
        Time Mode
        <Select
          value={selectedTimeMode}
          onValueChange={(e) => setSelectedTimeMode(e)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Acknowleded At</SelectItem>
            <SelectItem value="0">Violated At</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start">
        Violations
        <Select
          value={selectedViolation}
          onValueChange={(e) => setSelectedViolation(e)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Violations" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px] ">
              {analytics?.map((analytic) => (
                <div className="flex items-center " id={analytic.alerttype}>
                  <Checkbox
                    checked={selectedEvents.includes(analytic.alerttype)}
                    onCheckedChange={(e) => {
                      handleEventSelection(e, analytic.alerttype)
                    }}
                  />
                  <SelectItem
                    key={analytic.alerttype}
                    value={analytic.alerttype}
                  >
                    {analytic.alertname}
                  </SelectItem>
                </div>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start">
        User
        <Select value={selectedUser} onValueChange={(e) => setSelectedUser(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px] ">
              {usersList?.map((user) => (
                <div className="flex items-center " id={user.id}>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(e) => handleUserSelection(e, user.id)}
                  />
                  <SelectItem key={user.id} value={user.id}>
                    {user.id}
                  </SelectItem>
                </div>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      {/* <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={lastMonth}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div> */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col">
            <span>Date</span>
            <Button id="date" variant={"outline"}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.startDate ? (
                dateRange.endDate ? (
                  <>
                    {format(dateRange.startDate, "LLL dd, y")} -{" "}
                    {format(dateRange.endDate, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.startDate, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <Image
                src="/vectors/Down.svg"
                width={24}
                height={24}
                alt="chevron-down"
              />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateRangeChange}
          />
        </PopoverContent>
      </Popover>
      <div className="flex flex-col items-start">
        <p>Start Time</p>
        <div className="flex flex-row items-center rounded-sm border p-2">
          <div>
            <select
              id="startTime"
              value={startTime}
              onChange={handleStartTimeChange}
              className="appearance-none bg-transparent px-1 outline-none"
            >
              {hoursOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          <span className="px-1">:</span>
          <div>
            <select
              id="startMinute"
              value={startMinute}
              onChange={handleStartMinuteChange}
              className="appearance-none bg-transparent px-1 outline-none"
            >
              {minutsOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          <span className="px-1">:</span>
          <div>
            <select
              id="startSecond"
              value={startSecond}
              onChange={handleStartSecondChange}
              className="bg-transparent px-1 outline-none"
            >
              {minutsOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <p>End Time</p>
        <div className="flex flex-row items-center rounded-sm border p-2">
          <div>
            <select
              id="endTime"
              value={endTime}
              onChange={handleEndTimeChange}
              className="appearance-none bg-transparent px-1 outline-none"
            >
              {hoursOption.map((hour) => (
                <option
                  key={hour}
                  value={hour}
                  // selected={hour === 23?}
                >
                  {hour}
                </option>
              ))}
            </select>
          </div>
          <span className="px-1">:</span>
          <div>
            <select
              id="endMinute"
              value={endMinute}
              onChange={handleEndMinuteChange}
              className="appearance-none bg-transparent px-1 outline-none"
            >
              {minutsOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          <span className="px-1">:</span>
          <div>
            <select
              id="endSecond"
              value={endSecond}
              onChange={handleEndSecondChange}
              className="bg-transparent px-1 outline-none"
            >
              {minutsOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <p>&nbsp;</p>
        <Button onClick={handleExport}>Export</Button>
      </div>
      <div className="flex flex-col items-start">
        <p>&nbsp;</p>
        <Button onClick={handleReset} variant={"outline"}>Reset</Button>
      </div>
    </div>
  )
}

export default MisReport
