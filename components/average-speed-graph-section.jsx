"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const AverageSpeedGraphSection = ({
  handleSpeedDuration,
  speedDuration,
  showDateRange,
  junctionDetails,
  todayStartTimestamp,
  todayEndTimestamp,
  weekStartTimestamp,
  weekEndTimestamp,
  monthStartTimestamp,
  monthEndTimestamp,
  checkDate,
  isDateChanged,
  cameraSelection,
  refresh,
  selectedTab
}) => {
  const fetchAverageSpeedGraphsData = useStore(
    (state) => state.setAverageTrafficSpeedGraphs
  )
  const averageSpeedData = useStore(
    (state) => state.averageTrafficSpeedGraphsData
  )
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(11)
  const convertToEpochFormatToTime = (date1) => {
    let dateObj = new Date(date1)

    dateObj.setHours(23, 59, 59, 0)

    let epochTimeInMilliseconds = dateObj.getTime()

    return epochTimeInMilliseconds
  }
  const convertToEpochFormat = (date1) => {
    let epoch = date1?.toString().slice(0, -31)
    epoch = (new Date(epoch).getTime() * 1000) / 1000
    return epoch
  }
 
  const startDate = new Date(convertToEpochFormat(checkDate?.from));
  const endDate = new Date(convertToEpochFormatToTime(checkDate?.to));
  const isSameDate = startDate.toDateString() === endDate.toDateString();
  let durationInMin = isSameDate ? 120 : 1440
  
  function epochToNormalTime(epoch) {
    const date = new Date(epoch) // Convert epoch to milliseconds
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const days = date.getDay()
    const months = date.getMonth()
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`
    const convertDay = (day) => {
      if (day === 0) {
        return "Sun"
      }
      if (day === 1) {
        return "Mon"
      }
      if (day === 2) {
        return "Tue"
      }
      if (day === 3) {
        return "Wed"
      }
      if (day === 4) {
        return "Thu"
      }
      if (day === 5) {
        return "Fri"
      }
      if (day === 6) {
        return "Sat"
      }
    }
    const formattedDay = `${convertDay(days)}`

    const formattedMonth = date.toDateString()
    // if (trimmedPathname === "today" &&checkDate.to !== "") {
    //   return formattedMonth
    // }
    // if (trimmedPathname === "week" && checkDate.to !== "") {
    //   return formattedMonth
    // }
    // if (trimmedPathname === "month" && checkDate.to !== "") {
    //   return formattedMonth
    // }
    if (selectedTab === "Week" && !showDateRange) {
      return formattedDay
    }
    if (selectedTab === "Today" && !showDateRange) {
      return formattedTime
    }
    if (selectedTab === "Month" && !showDateRange) {
      return formattedMonth
    }
    if (
      selectedTab === "Custom" &&
      showDateRange && !isSameDate
    ) {
      return formattedMonth
    }
    if (
      selectedTab === "Custom" &&
      showDateRange && isSameDate
    ) {
      return formattedTime
    }
    // return formattedMonth
  }
 
  useEffect(() => {
    const startTime1 = new Date()
    startTime1.setHours(0, 0, 0, 0)
    const startTimestamp1 = Math.floor((startTime1.getTime() * 1000) / 1000)

    // End time: 12:00 pm (noon)
    const endTime1 = new Date()
    endTime1.setHours(12, 0, 0, 0)
    const endTimestamp1 = Math.floor((endTime1.getTime() * 1000) / 1000)

    // Start time: 12:00 pm
    const startTime2 = new Date()
    startTime2.setHours(12, 0, 0, 0)
    const startTimestamp2 = Math.floor((startTime2.getTime() * 1000) / 1000)

    // End time: 11:59 pm
    const endTime2 = new Date()
    endTime2.setHours(23, 59, 0, 0)
    const endTimestamp2 = Math.floor((endTime2.getTime() * 1000) / 1000)
    const todayPayloadAverageSpeedGraphs = {
      starttimestamp:
        speedDuration === "24 Hours"
          ? todayStartTimestamp
          : speedDuration === "00:00-12:00"
          ? startTimestamp1
          : speedDuration === "12:00-24:00"
          ? startTimestamp2
          : "",
      endtimestamp:
        speedDuration === "24 Hours"
          ? todayEndTimestamp
          : speedDuration === "00:00-12:00"
          ? endTimestamp1
          : speedDuration === "12:00-24:00"
          ? endTimestamp2
          : "",
          durationinminute:120,
      msId:  junctionDetails?.id ,
    }
    const weekPayloadAverageSpeedGraphs = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      durationinminute:1440,
      msId: junctionDetails?.id,
    }
    const monthPayloadAverageSpeedGraphs = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimestamp,
      durationinminute:10080,
      msId: junctionDetails?.id,
    }
    const customPayloadAverageSpeedGraphs = {
      starttimestamp: convertToEpochFormat(checkDate?.from),
      endtimestamp:  convertToEpochFormatToTime(checkDate?.to),
      durationinminute:durationInMin,
      msId: junctionDetails ? junctionDetails?.id : null,
    }
    if (selectedTab === "Today") {
      fetchAverageSpeedGraphsData(todayPayloadAverageSpeedGraphs)
    }
    if (selectedTab === "Week") {
      fetchAverageSpeedGraphsData(weekPayloadAverageSpeedGraphs)
    }
    if (selectedTab === "Month") {
      fetchAverageSpeedGraphsData(monthPayloadAverageSpeedGraphs)
    }
    if (selectedTab==='Custom'){
      fetchAverageSpeedGraphsData(customPayloadAverageSpeedGraphs)
    }
  }, [junctionDetails.id, selectedTab, speedDuration,refresh,isDateChanged,cameraSelection])
 
  // useEffect(() => {
  //     if (
  //         checkDate?.from !== "" ||
  //         (checkDate.from !== undefined && checkDate.to !== "")
  //       ){

  //           const customPayloadAverageSpeedGraphs = {
  //               starttimestamp: convertToEpochFormat(checkDate?.from),
  //               endtimestamp:  convertToEpochFormatToTime(checkDate?.to),
  //               durationinminute:durationInMin,
  //               msId: junctionDetails ? junctionDetails?.id : null,
  //             }
  //             fetchAverageSpeedGraphsData(customPayloadAverageSpeedGraphs)
  //         }
  // },[refresh,isDateChanged,cameraSelection])
// console.log(selectedTab,'selectedTab')
  const options = { 
    responsive: true,
    maintainAspectRatio: false,
  }
  const averageTrafficSpeed = useStore(
    (state) => state.averageTrafficSpeedGraphsData
  )

  const averageSpeedXaxisData = averageSpeedData[0]?.patterndatalist?.map(
    (item) => item.starttimestamp
  )
  // console.log(averageSpeedData, "averageSpeedData")
  // console.log("averageSpeedXaxisData", averageSpeedXaxisData)
  const arrayOfAverageSpeedData = averageSpeedData[0]?.patterndatalist?.map(
    (item) => item.averageSpeed
  )
  let datasetsAverageSpeed = [
    {
      label: "Average Speed",
      data: arrayOfAverageSpeedData,
      backgroundColor: "black",
      borderColor: "black",
    },
  ]
  const xAxisDataFormatted = averageSpeedXaxisData?.map((item) =>
    epochToNormalTime(item)
  )
  const data = {
    labels: xAxisDataFormatted,
    datasets: datasetsAverageSpeed,
  }
  // console.log(data)
  //   const data = {
  //     labels: ["January", "February", "March", "April", "May", "June", "July"],
  //     datasets: [
  //       {
  //         label: "My First Dataset",
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //         fill: false,
  //         borderColor: "rgb(75, 192, 192)",
  //         tension: 0.1,
  //       },
  //     ],
  //   }
  const updatedDate = new Date(
  ).toLocaleTimeString()
  return (
    <section className="flex w-full flex-col items-center bg-[#fff]">
      <section className="mt-[1em] flex w-full flex-row items-center justify-between px-8">
        <section className="flex flex-col items-center justify-center gap-[1em]">
          <span className=" text-5xl font-semibold  text-[#242424]">
            {/* 24 Kmph */}
            {averageTrafficSpeed[0]?.averageSpeed} Kmph
          </span>
          <span className="text-sm font-normal text-[#7A7A7A]">
            {/* Last Updated on 11:17:20 AM */}
            Last Updated on {updatedDate}
          </span>
        </section>
        <div className="flex flex-col items-center gap-[1em]">
          <p>Time</p>
          <Select
            value={speedDuration}
            onValueChange={(e) => handleSpeedDuration(e)}
            className="w-[180px]"
          >
            <SelectTrigger className=" font-medium ">
              <SelectValue>{speedDuration}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="00:00-12:00">00:00-12:00</SelectItem>
              {/* <SelectItem value="12:00-13:00">12:00-13:00</SelectItem> */}
              <SelectItem value="12:00-24:00">12:00-24:00</SelectItem>
              <SelectItem value="24 Hours">24 Hours</SelectItem>
              {/* <SelectItem value="week">Week</SelectItem> */}
              {/* <SelectItem value="month">Month</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="mt-[2em] flex  h-[500px] w-3/4 flex-row  justify-center py-4">
        <Line data={data} options={options} />
      </section>
    </section>
  )
}

export default AverageSpeedGraphSection
