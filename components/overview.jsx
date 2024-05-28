"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import Card from "@/components/card"
import LoadingDots from "@/components/loadingDots"

const checkboxes = [
  {
    id: 1,
    label: "Decrease in Violation",
    checked: false,
  },
  {
    id: 2,
    label: "Vehicle Tagged to Crime",
    checked: false,
  },
  {
    id: 3,
    label: "Signal Timers",
    checked: false,
  },
  {
    id: 4,
    label: "Challan Payouts",
    checked: false,
  },
  {
    id: 5,
    label: "Total Vehicle Flow",
    checked: false,
  },
  {
    id: 6,
    label: "Crime Violation",
    checked: false,
  },
  {
    id: 7,
    label: "Total Individuals Notified",
    checked: false,
  },
  {
    id: 8,
    label: "Vehicle Flow",
    checked: false,
  },
]
const Image = dynamic(() => import("next/image"))
const Card = dynamic(() => import("@/components/card"))
const Overview = ({
  date,
  setDate,
  selectedJunctions,
  selectedChannels,
  selectedAreas,
  showDateRange,
}) => {
  // const dateRangeSelected = date.from !== "" && date.to !== ""
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(11)
  const cardVariable = () => {
    if (trimmedPathname === "today") {
      return "Yesterday"
    }
    if (trimmedPathname === "week") {
      return "Last Week"
    }
    if (trimmedPathname === "month") {
      return "Last Month"
    }
  }
  cardVariable()
  const cardText = cardVariable()
  const [open, setOpen] = useState(false)
  const [checks, setChecks] = useState(checkboxes)
  const [showEditView, setShowEditView] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [choosenChecks, setChoosenchecks] = useState([])
  const [nan, setNan] = useState(false)
  const totalIndividualsNotified = useStore(
    (state) => state.totalIndividualsNotified
  )
  const totalIndividualsNotifiedYesterday = useStore(
    (state) => state.totalIndividualsNotifiedYesterday
  )
  const totalIndividualsNotified2 = useStore(
    (state) => state.totalIndividualsNotified2
  )
  const totalIndividualsNotified2Yesterday = useStore(
    (state) => state.totalIndividualsNotified2Yesterday
  )
  const totalVehicleFlow = useStore((state) => state.totalVehicleFlow)
  const totalViolations = useStore((state) => state.totalViolations)

  const totalVehicleFlowYesterday = useStore(
    (state) => state.totalVehicleFlowYesterDay
  )

  const totalViolationsYesterday = useStore(
    (state) => state.totalViolationsYesterDay
  )

  const averageTrafficSpeed = useStore((state) => state.averageTrafficSpeed)

  const averageTrafficSpeedYesterday = useStore(
    (state) => state.averageTrafficSpeedYesterday
  )
  const individualsCustomTotalRecords =
    totalIndividualsNotified[0]?.totalrecords +
    totalIndividualsNotified2[0]?.totalrecords

  const individualsPatternCustomTotalRecords =
    totalIndividualsNotified[0]?.patterndatalist[0]?.totalrecords +
    totalIndividualsNotified2[0]?.patterndatalist[0]?.totalrecords

  const individualsTodayTotalRecords =
    totalIndividualsNotifiedYesterday[0]?.totalrecords +
    totalIndividualsNotified2Yesterday[0]?.totalrecords

  const vehicleFlowPercentageContext =
    (cardText !== "Yesterday" || showDateRange
      ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
      : totalVehicleFlowYesterday[0]?.totalrecords) >
    totalVehicleFlow[0]?.totalrecords

  const individualsPercentageContext =
    (cardText !== "Yesterday" || showDateRange
      ? individualsPatternCustomTotalRecords
      : individualsTodayTotalRecords) > individualsCustomTotalRecords

  const ViolationsPercentageContext =
    (cardText !== "Yesterday" || showDateRange
      ? totalViolations[0]?.patterndatalist[0]?.totalrecords
      : totalViolationsYesterday[0]?.totalrecords) >
    totalViolations[0]?.totalrecords

  const averageTrafficPercentageContext =
    (cardText !== "Yesterday" || showDateRange
      ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]?.averageSpeed
      : averageTrafficSpeedYesterday[0]?.averageSpeed) >
    averageTrafficSpeed[0]?.averageSpeed

  const percentageOfIndividuals = individualsPercentageContext
    ? Math.round(
        (((cardText !== "Yesterday" || showDateRange
          ? individualsPatternCustomTotalRecords
          : individualsTodayTotalRecords) -
          individualsCustomTotalRecords) /
          (cardText !== "Yesterday" || showDateRange
            ? individualsPatternCustomTotalRecords
            : individualsTodayTotalRecords)) *
          100
      )
    : Math.abs(
        Math.round(
          (((cardText !== "Yesterday" || showDateRange
            ? individualsPatternCustomTotalRecords
            : individualsTodayTotalRecords) -
            individualsCustomTotalRecords) /
            (cardText !== "Yesterday" || showDateRange
              ? individualsPatternCustomTotalRecords
              : individualsTodayTotalRecords)) *
            100
        )
      )

  const percentageOfVehicleFlow = vehicleFlowPercentageContext
    ? Math.round(
        (((cardText !== "Yesterday" || showDateRange
          ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
          : totalVehicleFlowYesterday[0]?.totalrecords) -
          totalVehicleFlow[0]?.totalrecords) /
          (cardText !== "Yesterday" || showDateRange
            ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
            : totalVehicleFlowYesterday[0]?.totalrecords)) *
          100
      )
    : Math.abs(
        Math.round(
          (((cardText !== "Yesterday" || showDateRange
            ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
            : totalVehicleFlowYesterday[0]?.totalrecords) -
            totalVehicleFlow[0]?.totalrecords) /
            (cardText !== "Yesterday" || showDateRange
              ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
              : totalVehicleFlowYesterday[0]?.totalrecords)) *
            100
        )
      )
  const percentageOfViolations = ViolationsPercentageContext
    ? Math.round(
        (((cardText !== "Yesterday" || showDateRange
          ? totalViolations[0]?.patterndatalist[0]?.totalrecords
          : totalViolationsYesterday[0]?.totalrecords) -
          totalViolations[0]?.totalrecords) /
          (cardText !== "Yesterday" || showDateRange
            ? totalViolations[0]?.patterndatalist[0]?.totalrecords
            : totalViolationsYesterday[0]?.totalrecords)) *
          100
      )
    : Math.abs(
        Math.round(
          (((cardText !== "Yesterday" || showDateRange
            ? totalViolations[0]?.patterndatalist[0]?.totalrecords
            : totalViolationsYesterday[0]?.totalrecords) -
            totalViolations[0]?.totalrecords) /
            (cardText !== "Yesterday" || showDateRange
              ? totalViolations[0]?.patterndatalist[0]?.totalrecords
              : totalViolationsYesterday[0]?.totalrecords)) *
            100
        )
      )
  const percentageOfAverageSpeed = averageTrafficPercentageContext
    ? Math.round(
        (((cardText !== "Yesterday" || showDateRange
          ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]?.averageSpeed
          : averageTrafficSpeedYesterday[0]?.averageSpeed) -
          averageTrafficSpeed[0]?.averageSpeed) /
          (cardText !== "Yesterday" || showDateRange
            ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]
                ?.averageSpeed
            : averageTrafficSpeedYesterday[0]?.averageSpeed)) *
          100
      )
    : Math.abs(
        Math.round(
          (((cardText !== "Yesterday" || showDateRange
            ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]
                ?.averageSpeed
            : averageTrafficSpeedYesterday[0]?.averageSpeed) -
            averageTrafficSpeed[0]?.averageSpeed) /
            (cardText !== "Yesterday" || showDateRange
              ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]
                  ?.averageSpeed
              : averageTrafficSpeedYesterday[0]?.averageSpeed)) *
            100
        )
      )
  const getAlertConfigvalues = () => {
    const alertConfig = process.env.NEXT_PUBLIC_ALERTS_CONFIGURATION.split(",")
    return alertConfig
  }
  const [alertValue, range] = getAlertConfigvalues()
  useEffect(() => {
    if (!isNaN(percentageOfVehicleFlow)) {
      setNan(true)
    }
  }, [percentageOfVehicleFlow])
  useEffect(() => {
    const percent =
      isNaN(percentageOfVehicleFlow) || !isFinite(percentageOfVehicleFlow)
        ? 0
        : percentageOfVehicleFlow

    const todaysRecIncreased =
      cardText === "Yesterday" && !showDateRange
        ? totalVehicleFlow[0]?.totalrecords >
          totalVehicleFlowYesterday[0]?.totalrecords
        : totalVehicleFlow[0]?.totalrecords >
          totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
    const todaysRecDecreased =
      cardText === "Yesterday" && !showDateRange
        ? totalVehicleFlow[0]?.totalrecords <
          totalVehicleFlowYesterday[0]?.totalrecords
        : totalVehicleFlow[0]?.totalrecords <
          totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords

    const condition = range === "less"
    // console.log("log", percent , alertValue, percent < alertValue, percent < alertValue);
    const comparisionResult = condition
      ? percent < alertValue
      : percent > alertValue

    if (range === "less") {
      if (todaysRecDecreased) {
        setOpen(true)
      } else if (percent < alertValue && todaysRecDecreased) {
        setOpen(true)
      } else {
        return
      }
    } else if (range === "greater") {
      if (todaysRecDecreased) {
        return
      } else if (todaysRecIncreased) {
        if (percent > alertValue) {
          setOpen(true)
        }
      }
    } else {
      setOpen(false)
    }
  }, [
    alertValue,
    nan,
    percentageOfVehicleFlow,
    range,
    totalVehicleFlow[0]?.totalrecords,
    totalVehicleFlowYesterday[0]?.totalrecords,
    totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords,
  ])

  const handleCheckboxes = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id])
      setChoosenchecks([
        ...choosenChecks,
        checks.find((item) => item.id === id),
      ])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
      setChoosenchecks(choosenChecks.filter((item) => item.id !== id))
    }
  }
  const isCheckboxDisabled = (id) => {
    return selectedItems.length === 4 && !selectedItems.includes(id)
  }
  const dateObjectTo = new Date(date?.to)
  const dateObjectFrom = new Date(date?.from)

  const monthTo = dateObjectTo.toLocaleString("default", { month: "short" })
  const dayTo = dateObjectTo.getDate()
  const yearTo = dateObjectTo.getFullYear()
  const formattedDateTo = `${monthTo} ${dayTo} ${yearTo}`

  const monthFrom = dateObjectFrom.toLocaleString("default", { month: "short" })
  const dayFrom = dateObjectFrom.getDate()
  const yearFrom = dateObjectFrom.getFullYear()
  const formattedDateFrom = `${monthFrom} ${dayFrom} ${yearFrom}`

  let formattedDateToOrCurrent
  if (isNaN(date?.to)) {
    formattedDateToOrCurrent = getCurrentDate()
  } else if (!isNaN(date?.to)) {
    formattedDateToOrCurrent = formattedDateTo
  }

  function getCurrentDate() {
    const currDate = new Date()
    const year = currDate.getFullYear()
    const month = currDate.toLocaleString("default", { month: "short" })
    const day = currDate.getDate()
    const formattedCurrDate = `${month} ${day}, ${year}`
    return formattedCurrDate
  }

  let totalViolationsVerified =
    totalIndividualsNotified[0]?.totalrecords +
    totalIndividualsNotified2[0]?.totalrecords
  return (
    <section className=" mt-[1em] w-full bg-[#FFFFFF] p-[1em]">
      <div className="flex flex-row items-center justify-between">
        <span className="h-9 w-24 text-2xl font-semibold">Overview</span>
        {/* <Button variant="ghost" onClick={() => setShowEditView(true)}>
          <Image
            src="/vectors/Edit_overview.svg"
            alt="edit overview"
            width={24}
            height={24}
          />
          <span className=" text-blue-600">Edit Overview</span>
        </Button> */}
      </div>
      <div className="mt-[1em] flex flex-row items-center justify-start gap-[4em] ">
        <Card
          title="Total Vehicle Flow"
          content={
            totalVehicleFlow[0]?.totalrecords === null ||
            totalVehicleFlow[0]?.totalrecords === undefined ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 bg-white text-sm pr-3.5 pt-3.5 text-slate-400">
                <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
                Loading total vehicle flow. Please wait...
              </div>
            ) : (
              totalVehicleFlow[0]?.totalrecords
            )
          }
          footer={
            totalVehicleFlow[0]?.totalrecords === null ||
            totalVehicleFlow[0]?.totalrecords === undefined
              ? ""
              : `Total Vehicle Flow is ${
                  totalVehicleFlow[0]?.totalrecords
                }${" "} as compared to 
          ${
            cardText !== "Yesterday" || showDateRange
              ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
              : totalVehicleFlowYesterday[0]?.totalrecords
          } 
          ${" "}  
          ${
            showDateRange
              ? // ? `between ${formattedDateFrom} to ${formattedDateToOrCurrent}`
                "between similar timeline"
              : cardText
          }
          `
          }
          percentage={percentageOfVehicleFlow}
          todayRecords={totalVehicleFlow[0]?.totalrecords}
          yesterdayRecords={
            cardText !== "Yesterday" || showDateRange
              ? totalVehicleFlow[0]?.patterndatalist[0]?.totalrecords
              : totalVehicleFlowYesterday[0]?.totalrecords
          }
        />
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Vehicle flow threshold reached
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have reached the vehicle flow threshold of {range} than{" "}
                {alertValue} %
                <div className="mt-4 flex flex-row items-center gap-4">
                  {selectedAreas.length > 0 && (
                    <span className="font-bold">
                      Location: {selectedAreas?.map((area) => area.name)}
                    </span>
                  )}
                  {selectedJunctions.length > 0 && (
                    <span className="font-bold">
                      Junction:{" "}
                      {selectedJunctions?.map((junction) => junction.name)}
                    </span>
                  )}
                  {selectedChannels.length > 0 && (
                    <span className="font-bold">
                      Channel:{" "}
                      {selectedChannels?.map((channel) => channel.name)}
                    </span>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Acknowledge</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Card
          title="Average Traffic Speed"
          content={
            averageTrafficSpeed[0]?.averageSpeed === null ||
            averageTrafficSpeed[0]?.averageSpeed === undefined ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 bg-white text-sm pr-3.5 pt-3.5 text-slate-400">
                <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
                Loading average traffic speed. Please wait...
              </div>
            ) : (
              averageTrafficSpeed[0]?.averageSpeed
            )
          }
          footer={
            averageTrafficSpeed[0]?.averageSpeed === null ||
            averageTrafficSpeed[0]?.averageSpeed === undefined
              ? " "
              : `Average Traffic Speed is ${
                  averageTrafficSpeed[0]?.averageSpeed
                } ${" "} as compared to ${
                  cardText !== "Yesterday" || showDateRange
                    ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]
                        ?.averageSpeed
                    : averageTrafficSpeedYesterday[0]?.averageSpeed
                }
            ${" "} 
          ${
            showDateRange
              ? // ? `between ${formattedDateFrom} to ${formattedDateToOrCurrent}`
                "between similar timeline"
              : cardText
          }
          `
          }
          percentage={percentageOfAverageSpeed}
          todayRecords={averageTrafficSpeed[0]?.averageSpeed}
          yesterdayRecords={
            cardText !== "Yesterday" || showDateRange
              ? averageTrafficSpeed[0]?.previousAvgSpeedRecordsList[0]
                  ?.averageSpeed
              : averageTrafficSpeedYesterday[0]?.averageSpeed
          }
        />
        <Card
          title="Total Violations"
          content={
            totalViolations[0]?.totalrecords === null ||
            totalViolations[0]?.totalrecords === undefined ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 bg-white text-sm pr-3.5 pt-3.5 text-slate-400">
                <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
                Loading total violation. Please wait...
              </div>
            ) : (
              totalViolations[0]?.totalrecords
            )
          }
          footer={
            totalViolations[0]?.totalrecords === null ||
            totalViolations[0]?.totalrecords === undefined
              ? ""
              : `Total Violations are ${
                  totalViolations[0]?.totalrecords
                } ${" "} as compared to ${
                  cardText !== "Yesterday" || showDateRange
                    ? totalViolations[0]?.patterndatalist[0]?.totalrecords
                    : totalViolationsYesterday[0]?.totalrecords
                }
            ${" "} 
          ${
            showDateRange
              ? // ? `between ${formattedDateFrom} to ${formattedDateToOrCurrent}`
                "between similar timeline"
              : cardText
          }
          `
          }
          percentage={percentageOfViolations}
          todayRecords={totalViolations[0]?.totalrecords}
          yesterdayRecords={
            cardText !== "Yesterday" || showDateRange
              ? totalViolations[0]?.patterndatalist[0]?.totalrecords
              : totalViolationsYesterday[0]?.totalrecords
          }
        />

        {/* <Card
          title="Total Violations Verified"
          content={
            (typeof totalViolationsVerified === null || totalViolationsVerified === undefined || isNaN(totalViolationsVerified))  ||  isNaN(individualsCustomTotalRecords) || isNaN(individualsPatternCustomTotalRecords)?  (
              <div className="flex w-full flex-col items-center justify-center gap-4 bg-white text-sm pr-3.5 pt-3.5 text-slate-400">
                <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
                Loading total violations Verified. Please wait...
              </div>
            ): (
              totalViolationsVerified
            )
          }
          footer={(typeof totalViolationsVerified === null || totalViolationsVerified === undefined || isNaN(totalViolationsVerified))? ""
          :
          ` Total ${
            totalViolationsVerified
          } Violations verified as compared to ${
            cardText !== "Yesterday" || showDateRange ? individualsPatternCustomTotalRecords: individualsTodayTotalRecords
          } ${" "} 
          ${
            showDateRange
              ? // ? `between ${formattedDateFrom} to ${formattedDateToOrCurrent}`
                "between similar timeline"
              : cardText
          }
          `
      }
          percentage={percentageOfIndividuals}
          todayRecords={
            individualsCustomTotalRecords
          }
          yesterdayRecords={
            cardText !== "Yesterday" || showDateRange
              ? individualsPatternCustomTotalRecords
              : individualsTodayTotalRecords
          } 
        /> */}
        <Dialog open={showEditView} onOpenChange={setShowEditView}>
          <DialogContent className="max-h-screen lg:max-w-screen-lg">
            <DialogHeader>
              <DialogTitle className="flex flex-row items-center justify-start gap-[25em]">
                <span>Edit Overview</span>
                <span>Preview</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-[500px] flex-wrap gap-[1em]">
              {choosenChecks.length > 0 &&
                choosenChecks.map((item) => {
                  return (
                    <div
                      className="flex h-[40px] w-[230px] items-center justify-between bg-[#FAF7FB]"
                      key={item.id}
                    >
                      <span>{item.label}</span>
                      <Image
                        src="/vectors/Close.svg"
                        width={24}
                        height={24}
                        alt="close"
                      />
                    </div>
                  )
                })}
              <div className="flex h-[30px] w-[170px] items-center justify-center rounded-2xl bg-[#FFEECA] text-xs text-black">
                Note: Can add upto 4 stats
              </div>
              <div className="w-[444px]">
                <span>Choose the Overview</span>
                <div className="flex flex-wrap justify-start gap-[2em] p-[0.5em]">
                  {checks.map((check) => (
                    <div key={check.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxes(e, check.id)}
                        checked={selectedItems?.id}
                        disabled={isCheckboxDisabled(check.id)}
                      />
                      <label>{check.label}</label>
                    </div>
                  ))}
                </div>
                <Button
                  variant="active"
                  className="mt-[1em] bg-[#2A94E5] text-white"
                >
                  Save & Add
                </Button>
              </div>
              <div className="width-[500px] absolute left-[35em] flex flex-wrap gap-[1em]">
                {choosenChecks.length > 0 &&
                  choosenChecks.map((item) => {
                    return (
                      <div className="flex h-48 w-52 flex-col items-center gap-[1em] border border-[rgba(223,223,233,1)] pl-[1em] pt-[1em]">
                        <span className="text-[rgba(111, 111, 112, 1)] h-7 w-52 ">
                          {item.label}
                        </span>
                        <div className="flex flex-row items-center justify-between gap-[1em]">
                          <span className="h-12 w-24 text-3xl font-semibold">
                            10,120
                          </span>
                          <span>10%</span>
                        </div>
                        <span className="text-[rgba(111, 111, 112, 1)] w-50 text-sm">
                          3452 out of 10,120 violation notices have been sent
                          out for individuals
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default Overview
