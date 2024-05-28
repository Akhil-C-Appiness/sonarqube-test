"use client"

import React, { useEffect, useState } from "react"
// import Image from "next/image"
import dynamic  from "next/dynamic";
import useStore from "@/store/store"

import {
  getChannels,
  getDashboardChartEvents,
  getJunctions,
  getSiteStatus,
  getViolationStringData,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
// import { ComparisonGraph } from "@/components/comparison-graph"
// import { ComparisonHeader } from "@/components/comparison-header"

const Image = dynamic(() => import("next/image"));
const ComparisonGraph = dynamic(()=>import("@/components/comparison-graph"))
const ComparisonHeader = dynamic(()=>import("@/components/comparison-header"))

export default function IndexPage() {
  const [showCompare, setShowCompare] = useState(false)
  const [violationList, setViolationList] = useState([])
  const [compareType, setCompareType] = useState(
    "Traffic Flow by Registration Type"
  )
  const areas = useStore((state) => state.areas)
  const selectedCity = useStore((state) => state.selectedCity)
  const fetchAreas = useStore((state) => state.setAreas)
  const [selectedArea, setSelectedArea] = useState(null)
  const [junctionList, setJunctionList] = useState([])
  const [selectedJunction, setSelectedJunction] = useState(null)
  const [channelList, setChannelList] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [selectedViolationType, setSelectedViolationType] = useState([])
  const [selectedRegType, setSelectedRegType] = useState(-1)
  const [dataList, setDataList] = useState([])
  const [dataList2, setDataList2] = useState([])
  const [timeInterval, setTimeInterval] = useState(120)
  const [firstEventList, setFirstEventList] = useState([])
  const [secondEventList, setSecondEventList] = useState([])
  const [selectedVehicleType, setSelectedVehicleType] = useState(-1)
  const { toast } = useToast()
  let today = new Date()
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const [firstDate, setFirstDate] = useState(yesterday)
  const [secondDate, setSecondDate] = useState(today)
  const [firstGraphDate, setFirstGraphDate] = useState()
  const [secondGraphDate, setSecondGraphDate] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const fetchCities = useStore((state) => state.setCities)
  useEffect(() => {
    const fetchViolationData = async () => {
      const violationData = await getViolationStringData()
      console.log(violationData)
      setViolationList(violationData)
    }

    fetchViolationData()
  }, [])
  useEffect(() => {
    fetchCities()
  }, [])
  useEffect(() => {
    if (selectedCity) {
      fetchAreas(selectedCity)
    }
  }, [selectedCity])
  const fetchChannels = async () => {
    const channelData = await getChannels(
      selectedCity,
      selectedArea,
      selectedJunction
    )
    console.log(channelData?.data?.result)
    setChannelList(channelData?.data?.result)
  }
  useEffect(() => {
    // cityid, areaid, junctionid

    if (selectedJunction) {
      fetchChannels()
    }
  }, [selectedJunction])

  const fetchJunctionData = async () => {
    const junctionData = await getJunctions(selectedCity, selectedArea)
    console.log(junctionData)
    setJunctionList(junctionData?.data?.result)
  }
  useEffect(() => {
    console.log(dataList, "dataList")
  }, [dataList])

  function getCurrentHourIn12HourFormat() {
    const currentDate = new Date()
    let currentHour = currentDate.getHours()
    currentHour = currentHour % 2 === 1 ? currentHour + 1 : currentHour
    let period = "AM"

    if (currentHour >= 12) {
      period = "PM"
      if (currentHour > 12) {
        currentHour -= 12
      }
    }

    return `${currentHour} ${period}`
  }

  function getStartAndEndTimestamps(dateString) {
    // Parse the date string and get the year, month, and day
    let date = new Date(dateString)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()

    // Create new Date objects for the start and end of the day
    let startTime = new Date(year, month, day, 0, 0, 0)
    let endTime = new Date(year, month, day, 23, 59, 59)

    // Convert the Date objects to Unix timestamps
    let startUnixTime = Math.floor(startTime.getTime())
    let endUnixTime = Math.floor(endTime.getTime())

    return {
      start: startUnixTime,
      end: endUnixTime,
    }
  }
  // const addTotalVehicleVolume = (data) => {
  //   return data.map((entry) => {
  //     const totalrecordsSum = entry.datalist.reduce(
  //       (sum, item) => sum + item.totalrecords,
  //       0
  //     )
  //     entry.datalist.push({
  //       typeid: 999,
  //       name: "Total Vehicle Volume",
  //       totalrecords: totalrecordsSum,
  //     })

  //     return entry
  //   })
  // }

  const compare = async () => {
    setDataList([])
    setDataList2([])
    setFirstGraphDate(firstDate)
    setSecondGraphDate(secondDate)
    // console.log(compareType)
    // console.log(compareType)
    // console.log(selectedChannel)
    // console.log(selectedRegType)
    // console.log(selectedViolationType)

    setShowCompare(true)
    var appList = selectedViolationType
    var charttype
    if (!appList.length) {
      var appList = violationList.map((vl) => vl.alerttype)
    }
    if (compareType.includes("Traffic Flow")) {
      appList = [207]
    }
    if (compareType.includes("Vehicle Type")) {
      charttype = 0
    } else if (compareType.includes("Registration Type")) {
      charttype = 1
    } else if (compareType.includes("Violation Type")) {
      charttype = 2
    }
    // console.log(firstDate, "firstDate")
    // console.log(secondDate, "secondDate")

    if (!firstDate) {
      toast({
        variant: "destructive",
        description: "Please Select First Date",
        duration: 3000,
      })
      return
    }
    if (!secondDate) {
      toast({
        variant: "destructive",
        description: "Please Select Second Date",
        duration: 3000,
      })
      return
    }
    const currentHourIn12HourFormat = getCurrentHourIn12HourFormat()
    const isTodaySelected =
      secondDate && secondDate.toDateString() === new Date().toDateString()
    const isYesterDaySelected =
      firstDate && firstDate.toDateString() === yesterday.toDateString()
    const date = new Date()
    const hours = currentHourIn12HourFormat.split(" ")[0].split(":")
    const isPM = currentHourIn12HourFormat.toLowerCase().includes("pm")
    let hour = parseInt(hours, 10)
    if (isPM && hour !== 12) {
      hour += 12
    } else if (!isPM && hour === 12) {
      hour = 0
    }
    date.setHours(hour, 0, 0, 0)
    let firstTimestamps = getStartAndEndTimestamps(firstDate)
    let secondTimestamps = getStartAndEndTimestamps(secondDate)

    const payload = {
      starttimestamp: firstTimestamps.start,
      endtimestamp:
        !isTodaySelected && !isYesterDaySelected
          ? firstTimestamps.end
          : isTodaySelected && isYesterDaySelected
          ? yesterday.setHours(hour, 0, 0, 0)
          : new Date(firstTimestamps.end).setHours(hour, 0, 0, 0),
      applicationList: appList, //Type of violation hide if Traffic Flow
      charttype: charttype,
      durationinminute: timeInterval,
      channelidList: selectedChannel ? [selectedChannel] : [],
      msId: "",
      vehicleclass: -1,
      registrationType: selectedRegType ? selectedRegType : -1,
    }
    const payload2 = {
      ...payload,
      starttimestamp: secondTimestamps.start,
      endtimestamp: isTodaySelected
        ? Math.floor(date.getTime())
        : secondTimestamps.end,
    }
    // console.log(payload)
    try {
      setIsLoading(true)
      const chartResponse = await getDashboardChartEvents(payload)
      const chartResponse2 = await getDashboardChartEvents(payload2)
      // console.log(chartResponse?.[0]?.eventlist, "chartResponse")
      if (chartResponse) {
        // chartResponse?.[0]?.eventlist &&
        setDataList(chartResponse?.[0]?.patterndatalist)
        // const volume = addTotalVehicleVolume(
        //   chartResponse?.[0]?.patterndatalist
        // )
        // setDataList(volume)
        chartResponse?.[0]?.eventlist &&
          setFirstEventList(chartResponse?.[0]?.eventlist)
      }
      if (chartResponse2) {
        chartResponse2?.[0]?.patterndatalist &&
          setDataList2(chartResponse2?.[0]?.patterndatalist)
        // const volume = addTotalVehicleVolume(
        //   chartResponse2?.[0]?.patterndatalist
        // )
        // chartResponse2?.[0]?.patterndatalist && setDataList2(volume)
        chartResponse2?.[0]?.eventlist &&
          setSecondEventList(chartResponse2?.[0]?.eventlist)
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      toast({
        variant: "destructive",
        description: "Something went wrong",
        duration: 3000,
      })
    }
  }
  useEffect(() => {
    setSelectedChannel(null)
    setSelectedJunction(null)
  }, [selectedArea])
  useEffect(() => {
    console.log(timeInterval, "timeInterval")
    showCompare && compare()
  }, [timeInterval])
  return (
    <div className="flex w-full flex-col gap-4 overflow-auto">
      <ComparisonHeader
        compare={compare}
        violationList={violationList}
        compareType={compareType}
        setCompareType={setCompareType}
        areas={areas}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        fetchJunctionData={fetchJunctionData}
        junctionList={junctionList}
        selectedJunction={selectedJunction}
        setSelectedJunction={setSelectedJunction}
        fetchChannels={fetchChannels}
        channelList={channelList}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        selectedViolationType={selectedViolationType}
        setSelectedViolationType={setSelectedViolationType}
        selectedRegType={selectedRegType}
        setSelectedRegType={setSelectedRegType}
        selectedVehicleType={selectedVehicleType}
        setSelectedVehicleType={setSelectedVehicleType}
        firstDate={firstDate}
        setFirstDate={setFirstDate}
        secondDate={secondDate}
        setSecondDate={setSecondDate}
        setDataList={setDataList}
        setDataList2={setDataList2}
      />
      {!showCompare ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 bg-white p-14">
          <Image src="/images/compare-vector.svg" width={300} height={250} />
          <div>Please select the criteria above to start comparison</div>
        </div>
      ) : (
        <div>
          {!!dataList?.length && !!dataList2?.length && (
            <ComparisonGraph
              dataList={dataList}
              dataList2={dataList2}
              compareType={compareType}
              firstDate={firstDate}
              secondDate={secondDate}
              timeInterval={timeInterval}
              setTimeInterval={setTimeInterval}
              firstEventList={firstEventList}
              secondEventList={secondEventList}
              violationList={violationList}
              firstGraphDate={firstGraphDate}
              secondGraphDate={secondGraphDate}
            />
          )}
        </div>
      )}
      {isLoading && (
        <div className="flex h-96 w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
          <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
          Preparing comparison charts. Please wait...
        </div>
      )}

      {(!dataList?.length || !dataList2?.length) &&
        showCompare &&
        !isLoading && (
          <div className="flex h-96 w-full items-center justify-center bg-white">
            No Data
          </div>
        )}
      {/* <ComparisonGraph /> */}
    </div>
  )
}
