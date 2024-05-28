import React, { useEffect, useState } from "react"
import {format} from 'date-fns'
import { getScheduleList } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ViewSchedule = (props) => {
  const [selectedDates, setSelectedDates] = useState()
  const [scheduleList, setScheduleList] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const fetchScheduleList = async () => {
    const slist = await getScheduleList()
    console.log(slist)
    setScheduleList(slist)
    console.log(slist, "slist")
  }
  useEffect(() => {
    console.log(scheduleList)
    if (scheduleList?.length > 0) {
      setSelectedSchedule(scheduleList[0])
    }
  }, [scheduleList])

  useEffect(() => {
    fetchScheduleList()
  }, [])
  const removeSpecialDate = (index) => {
    console.log(index)
    const tmpDates = [...selectedDates]
    const remainingDates = tmpDates.filter((_, i) => i !== index)
    console.log(remainingDates)
    setSelectedDates(remainingDates)
  }
  // const changeSelectedSchedule = (selectedName)=>{
  //     console.log(selectedName)
  //     const selectedSch = scheduleList.find((schedule)=>{
  //         return schedule.name === selectedName
  //     }
  //     )
  //     console.log(selectedSch)
  //     setSelectedSchedule(selectedSch)

  // }
  const WeekDay = ({ index }) => {
    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Special"]
    console.log(weeks)
    console.log(index)
    return weeks[index]
  }

  const updateScheduleSwitch = (weekIndex, hourIndex) => {
    console.log(weekIndex, hourIndex)
    console.log(selectedSchedule?.recordingSchedule[weekIndex][hourIndex])
    var tmpSelectedSchedule = { ...selectedSchedule }
    tmpSelectedSchedule.recordingSchedule[weekIndex][hourIndex] =
      !tmpSelectedSchedule?.recordingSchedule[weekIndex][hourIndex]
    setSelectedSchedule(tmpSelectedSchedule)
  }
  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        onRequestClose()
      }
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = "visible"
      document.removeEventListener("keydown", onKeyDown)
    }
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center border-4 bg-[#0F0F10] bg-opacity-10 backdrop-blur-[1px]">
      <div className="w-[900px]">
        <div className="h-[580px] bg-white p-2 pl-6">
          <div className="flex justify-between text-[#6F6F70]">
            <span className="p-1 font-semibold text-[#0F0F10]">
              View Schedule
            </span>
            <span className="font-medium text-[#6F6F70]">
              ...
              <Button
                variant="outline"
                className="border-none "
                onClick={props.onRequestClose}
              >
                x
              </Button>
            </span>
          </div>
          <ScrollArea className="h-[500px] w-full rounded-md ">
            <div className="flex flex-row space-x-4 pt-4">
              <Label for="schedule_name" className="leading-8">
                Recording Schedule Details{" "}
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Schedule</SelectLabel>
                    <SelectItem value="Default_24*7">Default 24*7</SelectItem>
                    <SelectItem value="Schedule2">Schedule2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full overflow-auto pt-4">
              <div className="flex flex-row flex-nowrap w-fit">
                <div className=" w-24 p-2 bg-blue-100 text-center  text-xs font-semibold py-3  border-b border-r border-slate-300">
                  Hours/Day
                </div>
                {selectedSchedule?.recordingSchedule &&
                  selectedSchedule?.recordingSchedule[0].map((val, ind) => {
                    return (
                      <div className=" w-12 p-2 bg-blue-100 text-center  text-xs font-semibold py-3  border-b border-r border-slate-300">
                        {ind + 1}
                      </div>
                    )
                  })}
              </div>
              <div className="flex flex-col w-fit">
                {/* <div className=" w-full p-2 bg-blue-100 text-center  text-xs font-semibold py-3  border-b border-r border-slate-300">Hour/Day</div> */}
                {selectedSchedule?.recordingSchedule &&
                  selectedSchedule?.recordingSchedule.map((sch, weekIndex) => {
                    return (
                      <div className="flex flex-row flex-nowrap">
                        <div className="w-24 p-2 bg-blue-100 text-center  text-xs font-semibold py-3  border-b border-r border-slate-300">
                          <WeekDay index={weekIndex} />
                        </div>
                        {sch.map((schStatus, hourIndex) => {
                          return (
                            <div
                              onClick={() =>
                                updateScheduleSwitch(weekIndex, hourIndex)
                              }
                              className={`w-12 cursor-pointer px-2 py-3 ${
                                weekIndex % 2 == 0 ? "bg-slate-100" : "bg-white"
                              } text-xs font-semibold text-center border-b border-r border-slate-300 ${
                                schStatus ? "text-green-500" : "text-red-500"
                              } `}
                            >
                              {schStatus ? "ON" : "OFF"}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
              </div>
            </div>
            <div className="flex flex-row">
              <div>
                <div className="py-4 font-semibold">Special Date Selection</div>

                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                />
              </div>
              <div className="flex flex-wrap items-start items- border p-4 grow content-start gap-4 ">
                {selectedDates?.map((date, index) => {
                  return (
                    <div className="p-2 h-10 flex border border-violet-400 bg-violet-50 w-fit rounded-xl">
                      {format(date, "dd MMM yyyy")}
                      <div className="flex flex-row justify-end">
                        <Image
                          src="/images/close-icon.svg"
                          width={40}
                          height={20}
                          className="ml-2"
                          onClick={() => removeSpecialDate(index)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* {!schedule&&<div className="flex justify-end mt-4">
            <Button variant="destructivoutline">Delete Schedule</Button>
            <Button variant="default" className="ml-4">Save Schedule</Button>
        </div>} */}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default ViewSchedule;
