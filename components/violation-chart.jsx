"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Spinner from "@/components/spinner"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ViolationChart = ({
  handleShowTable,
  duration,
  setDuration,
  violationType,
  setViolationType,
  title,
  subTitle,
  violationResponse,
  handleVehicleTypeCheck,
  handleRegistrationTypeCheck,
  handleViolationTypeCheck,
  dataList,
  totalViolationRecords,
  selectedVehicleFilter,
  selectedViolationFilter,
  selectedRegFilter,
  handleClearAll,
  isVehicleCheckboxDisabled,
  isRegistrationCheckboxDisabled,
  isViolationCheckboxDisabled,
  datasets,
  datasetsFlow,
  xAxisData,
  handleSelectAll,
  checkDate,
  vehicleTypeData,
  regTypeData,
  flow,
  type0Violations,
  setResetTimer,
  resetTimer,
  showDateRange,
  date,
  showTotal,
  handleCheckboxChange,
  totalDataset,
  selectedTab,
  convertToEpochFormat,
  convertToEpochFormatToTime
}) => {
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(11)
  let comparisionPathname = pathname.slice(1)
  const startDate = new Date(convertToEpochFormat(date?.from));
    const endDate = new Date(convertToEpochFormatToTime(date?.to));
    const isSameDate = startDate.toDateString() === endDate.toDateString();
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
      showDateRange && isSameDate
    ) {
      return formattedTime
    }
    if (
      selectedTab === "Custom" &&
      showDateRange && !isSameDate
    ) {
      return  formattedMonth
    }
    // return formattedMonth
  }
  
  const xAxisDataFormatted = xAxisData?.map((item) => epochToNormalTime(item))
  // console.log(
  //   (trimmedPathname === "month" ||
  //     trimmedPathname === "today" ||
  //     trimmedPathname === "week") &&
  //     showDateRange,
  //   "condition"
  // )
  // console.log(date?.from, "date1")
  // console.log(date?.to, "date2")

  const data = {
    labels: selectedTab === "Custom" || selectedTab === "Week" ||selectedTab === "Month" ? xAxisDataFormatted : xAxisData,
    datasets: datasets,
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (datasets && datasetsFlow) {
              let summedData = []
              datasets?.forEach((dataset) => {
                const matchingFlowDataset = datasetsFlow.find(
                  (flowData) => flowData.label === dataset.label
                )

                if (matchingFlowDataset) {
                  const summedLabelData = dataset.data.map(
                    (value, index) => matchingFlowDataset.data[index] || 0
                  )

                  summedData.push({
                    label: dataset.label,
                    summedLabelData,
                  })
                }
              })
              const checkBool = summedData.find(
                (val, index) => val.label === context.dataset.label
              )
              // console.log("checkBool", checkBool)
              const dataIndex = context.dataIndex
              let matchedValue
              let percentageViolation
              if (
                checkBool &&
                dataIndex >= 0 &&
                dataIndex < checkBool.summedLabelData.length
              ) {
                matchedValue = checkBool.summedLabelData[dataIndex]
                const percentageOfTrafficViolation =
                  context.dataset.data[dataIndex] < matchedValue

                percentageViolation = percentageOfTrafficViolation
                  ? (
                      (context.dataset.data[dataIndex] / matchedValue) *
                      100
                    ).toFixed(1)
                  : Math.abs(
                      (
                        (context.dataset.data[dataIndex] / matchedValue) *
                        100
                      ).toFixed(1)
                    )
              } else {
              }
              return violationType !== "Type of Events" &&
                matchedValue !== undefined
                ? [
                    `${context.dataset.label} : ${context.dataset.data[dataIndex]} (${percentageViolation} %)`,
                    `All ${context.dataset.label}: ${matchedValue}`,
                  ]
                : `${context.dataset.label}: ${context.dataset.data[dataIndex]}`
            } else {
              const dataIndex = context.dataIndex
              return `${context.dataset.label}: ${context.dataset.data[dataIndex]}`
            }
          },
        },
      },
    },
  }
  const currentDate = new Date()
  const [startDateOneMonth, setStartDateOneMonth] = useState(null)
  const [endDateOneMonth, setEndDateOneMonth] = useState(null)
  const [startDateOneWeek, setStartDateOneWeek] = useState(null)
  const [endDateOneWeek, setEndDateOneWeek] = useState(null)
  const resetFlow = useStore((state) => state.resetOverview)

  useEffect(() => {
    const currentDate = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    setStartDateOneMonth(oneMonthAgo.toISOString().slice(0, 10))
    setEndDateOneMonth(currentDate.toISOString().slice(0, 10))

    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    setStartDateOneWeek(oneWeekAgo.toISOString().slice(0, 10))
    setEndDateOneWeek(currentDate.toISOString().slice(0, 10))
  }, [])
  const handleViolations = (e) => {
    setViolationType(e)
    setResetTimer((prev) => !prev)
  }
  const handleDuration = (e) => {
    setDuration(e)
    setResetTimer((prev) => !prev)
    resetFlow([])
  }
  return (
    <section className=" relative top-[1em] h-full bg-[#FFFFFF] p-[1em]">
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-semibold">{title}</div>
        <Image
          src="/vectors/Kebab_menu.svg"
          alt="kebab_menu"
          width={24}
          height={24}
        />
      </div>
      {datasets.length!==1 ?(<section className="mt-[1em] h-[700px]  w-full border-2 border-[#DBDBDB] p-[1em]">
        {comparisionPathname !== "comparison" && (
          <>
            <div className="flex flex-row">
              <div className="flex items-center gap-[1em]">
                <div>{subTitle}</div>
                <Select
                  value={violationType}
                  onValueChange={(e) => handleViolations(e)}
                >
                  <SelectTrigger>
                    <SelectValue>{violationType}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vehicle Class">Vehicle Class</SelectItem>
                    <SelectItem value="Type of Events" disabled={flow}>
                      Type of Events
                    </SelectItem>
                    <SelectItem value="Registration Type">
                      Registration Type
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-[24em] flex items-center gap-[1em]">
                <div>Duration</div>
                <Select
                  value={duration}
                  onValueChange={(e) => handleDuration(e)}
                  disabled={
                    trimmedPathname === "week" ||
                    trimmedPathname === "month" ||
                    showDateRange
                  }
                >
                  <SelectTrigger className=" font-medium ">
                    <SelectValue>{duration}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:00-12:00">00:00-12:00</SelectItem>
                    {/* <SelectItem value="12:00-13:00">12:00-13:00</SelectItem> */}
                    {new Date().getHours() >= 12 && <SelectItem value="12:00-24:00">12:00-24:00</SelectItem>}
                    <SelectItem value="24 Hours">24 Hours</SelectItem>
                    {/* <SelectItem value="week">Week</SelectItem> */}
                    {/* <SelectItem value="month">Month</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-[1em]">
              {date?.from && date?.to && showDateRange
                ? `${new Date(date?.from).toLocaleDateString()} -
                    ${new Date(date?.to).toLocaleDateString()}`
                : trimmedPathname === "today"
                ? currentDate.toDateString()
                : trimmedPathname === "month"
                ? startDateOneMonth + " - " + endDateOneMonth
                : trimmedPathname === "week"
                ? startDateOneWeek + " - " + endDateOneWeek
                : ""}{" "}
              {/* | {duration} (Total:{totalViolationRecords.totalrecords}) */}
            </div>
          </>
        )}

        <div className="flex h-[80%]  items-center justify-start">
          <div className="h-full w-full">
            <div className="relative flex justify-center text-xs text-primary">
              <span class="relative flex h-2 w-2 pt-1">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="ml-1">
                Clicking on legends, at the top of the chart, will
                select/de-select the respective value
              </span>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showTotal}
                onChange={handleCheckboxChange}
              />
              <span className="pl-2">Show Total</span>
            </label>
              <Line
                data={
                  showTotal
                    ? { labels: selectedTab === "Custom" || selectedTab === "Week" ||selectedTab === "Month" ? xAxisDataFormatted : xAxisData, datasets: [totalDataset] }
                    : data
                }
                options={options}
              />
          </div>
          {comparisionPathname !== "comparison" && (
            <div className="relative top-[-4em] ml-auto hidden">
              <span>Filter Options</span>
              <Accordion type="single" collapsible className="w-[250px]">
                <AccordionItem value="vehicle type" className="px-2">
                  <AccordionTrigger>
                    Vehicle Type ({selectedVehicleFilter.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {vehicleTypeData?.map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between py-2"
                      >
                        {item.name}
                        <input
                          onChange={(e) => handleVehicleTypeCheck(e, item.code)}
                          checked={selectedVehicleFilter.includes(item.code)}
                          type="checkbox"
                          // disabled={() => isVehicleCheckboxDisabled(item.code)}
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {!flow && (
                  <AccordionItem value="Type of Violation" className="px-2">
                    <AccordionTrigger>
                      Type of Events ({selectedViolationFilter.length})
                    </AccordionTrigger>
                    <AccordionContent className="max-h-[200px] overflow-y-scroll">
                      {violationResponse?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2"
                        >
                          {item.alertname}
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleViolationTypeCheck(e, item.alerttype)
                            }
                            checked={selectedViolationFilter.includes(
                              item.alerttype
                            )}
                            // disabled={() =>
                            //   isViolationCheckboxDisabled(item.code)
                            // }
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="Registration Type" className="px-2">
                  <AccordionTrigger>
                    {" "}
                    Registration Type ({selectedRegFilter.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {regTypeData?.map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between py-2"
                      >
                        {item.name}
                        <input
                          onChange={(e) =>
                            handleRegistrationTypeCheck(e, item.code)
                          }
                          type="checkbox"
                          checked={selectedRegFilter.includes(item.code)}
                          // disabled={() =>
                          //   isRegistrationCheckboxDisabled(item.code)
                          // }
                        />
                      </div>
                    ))}
                  </AccordionContent>
                  <AccordionItem>
                    <div className="flex items-center justify-center gap-7 py-2">
                      <Button
                        variant="secondary"
                        className="text-[#2A94E5]"
                        onClick={handleClearAll}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="default"
                        className="text-white"
                        onClick={handleSelectAll}
                      >
                        Select All
                      </Button>
                    </div>
                  </AccordionItem>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
        {/* {comparisionPathname !== "comparison" && (
          <div className=" mt-[2em] flex items-center gap-[1em]">
            <input type="checkbox" onChange={handleShowTable} />
            <label className="text-sm">Show Data Table</label>
          </div>
        )} */}
      </section>):<div className="flex h-48 w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
              <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
              Loading...
            </div>}
    </section>
  )
}

export default ViolationChart
