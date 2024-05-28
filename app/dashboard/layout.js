"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import { addDays, format } from "date-fns"

// import ChangePasswordDialog from "./components/changePasswordDialog"
import {
  getAreas,
  getChannels,
  getCities,
  getDashboardOverviewCount,
  getJunctions,
  getViolationString,
  getViolationStringData,
} from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ChangeUserPassword from "@/components/changeUserPassword"
import NavigationMenu from "@/components/dashboard-navigation-menu"
import Overview from "@/components/overview"
import PreActions from "@/components/pre-actions"

const vehicleTypeData = [
  {
    code: 0,
    name: "Two Wheeler",
  },
  {
    code: 1,
    name: "Three Wheeler",
  },
  {
    code: 2,
    name: "Four Wheeler",
  },
  {
    code: 3,
    name: "Heavy Vehicle",
  },
]
const regTypeData = [
  {
    code: 0,
    name: "Private",
  },
  {
    code: 1,
    name: "Commercial",
  },
  {
    code: 2,
    name: "Army",
  },
  {
    code: 3,
    name: "EV",
  },
  {
    code: 4,
    name: "Undetermined",
  },
]
const DashboardLayout = () => {
  const [openResetPassword, setOpenResetPassword] = useState(false)
  const [violationAlertTypes, setViolationAlertTypes] = useState([])

  useEffect(() => {
    const userInfoString = localStorage.getItem("user-info")
    let userInfo = userInfoString ? JSON.parse(userInfoString) : null
    if (userInfo?.passwordHistory === null && userInfo !== null) {
      // alert(userInfo.passwordHistory)
      setOpenResetPassword(true)
    }
  }, [])
  useEffect(() => {
    const getViolations = async () => {
      try {
        const response = await getViolationStringData()
        setViolationResponse(response)
        setViolationAlertTypes(response?.map((x) => x.alerttype))
        setSelectedViolationFilter(response?.map((x) => x.alerttype))
      } catch (error) {
        console.log(error)
      }
    }
    getViolations()
  }, [])
  const [violationResponse, setViolationResponse] = useState([])
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(11)
  const fetchCities = useStore((state) => state.setCities)
  const city = useStore((state) => state.selectedCity)
  const fetchAreas = useStore((state) => state.setAreas)
  const [selectedAreaId, setSelectedAreaId] = useState([])
  const [selArea, setSelArea] = useState(null)
  const resetFlow = useStore((state) => state.resetOverview)
  const [selectedJunctionId, setSelectedJunctionId] = useState([])
  const [selectedChannelIds, setSelectedChannelIds] = useState([])
  const [duration, setDuration] = useState("24 Hours")
  const [speedDuration, setSpeedDuration] = useState("24 Hours")
  const [violationType, setViolationType] = useState("Vehicle Type")
  const [vehicleClass, setVehicleClass] = useState(0)
  const [showDataTable, setShowDataTable] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedTab, setSelectedTab] = useState("Today")
  const [subTab, setSubTab] = useState("Traffic Flow")
  const [selectedChannels, setSelectedChannels] = useState([])
  const [selectedJunctions, setSelectedJunctions] = useState([])
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const [date, setDate] = useState({
    from: "",
    to: "",
  })
  const [flow, setFlow] = useState(true)
  const fetchJunctions = useStore((state) => state.setJunctions)
  const junctions = useStore((state) => state.junctions)
  const [msId, setmsId] = useState(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState(null)
  const [selectedViolationType, setSelectedViolationType] = useState([])
  const [selectedRegistrationType, setSelectedRegistrationType] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [cameraSelection, setCameraSelection] = useState(false)
  const [isDateChanged, setIsDateChanged] = useState(false)
  const [showDateRange, setShowDateRange] = useState(false)
  const [selectedValue, setSelectedValue] = useState(15)
  const fetchChannels = useStore((state) => state.setChannels)
  const resetChannelIds = useStore((state) => state.resetChannelIds)
  const [selectAllJunctions, setSelectAllJunctions] = useState(false)

  const fetchIndividualsNotified = useStore(
    (state) => state.setTotalIndividualsNotified
  )
  const fetchIndividualsNotified2 = useStore(
    (state) => state.setTotalIndividualsNotified2
  )
  const fetchIndividualsNotifiedYesterday = useStore(
    (state) => state.setTotalIndividualsNotifiedYesterday
  )
  const fetchIndividualsNotified2Yesterday = useStore(
    (state) => state.setTotalIndividualsNotified2Yesterday
  )
  const fetchAverageTrafficSpeed = useStore(
    (state) => state.setAverageTrafficSpeed
  )
  const fetchAverageTrafficSpeedYesterday = useStore(
    (state) => state.setAverageTrafficSpeedYesterday
  )
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState(
    vehicleTypeData.map((x) => x.code)
  )
  const [selectedViolationFilter, setSelectedViolationFilter] = useState([])

  const [selectedRegFilter, setSelectedRegFilter] = useState(
    regTypeData.map((x) => x.code)
  )
  const fetchViolations = useStore((state) => state.setViolations)
  const fetchtotalVehicleFlow = useStore((state) => state.setTotalVehicleFlow)
  const fetchtotalVehicleFlowYesterday = useStore(
    (state) => state.setTotalVehicleFlowYesterday
  )
  const fetchtotalViolationsYesterday = useStore(
    (state) => state.setTotalViolationsYesterday
  )
  const fetchtotalViolations = useStore((state) => state.setTotalViolations)
  const fetchTrafficViolationsPieChartsData = useStore(
    (state) => state.setTrafficViolationsPieChartsData
  )
  const fetchTrafficFlowViolationsPieChartsData = useStore(
    (state) => state.setTrafficFlowViolationsPieChartsData
  )
  const fetchViolationChartsData = useStore(
    (state) => state.setViolationChartsData
  )
  const fetchFlowChartsData = useStore((state) => state.setFlowChartsData)
  const fetchAverageSpeedGraphsData = useStore(
    (state) => state.setAverageTrafficSpeedGraphs
  )
  const channelIds = useStore((state) => state.channelIds)
  const convertToEpochFormat = (date1) => {
    let epoch = date1?.toString().slice(0, -31)
    epoch = (new Date(epoch).getTime() * 1000) / 1000
    return epoch
  }
  const [resetTimer, setResetTimer] = useState(false)
  const convertToEpochFormatToTime = (date1) => {
    let dateObj = new Date(date1)

    dateObj.setHours(23, 59, 59, 0)

    let epochTimeInMilliseconds = dateObj.getTime()

    return epochTimeInMilliseconds
  }
  useEffect(() => {
    const startDate = new Date(convertToEpochFormat(date?.from))
    const endDate = new Date(convertToEpochFormatToTime(date?.to))
    const isSameDate = startDate.toDateString() === endDate.toDateString()
    let durationInMin = isSameDate ? 120 : 1440
    if (
      date?.from !== "" ||
      (date.from !== undefined && date.to !== "") ||
      (date.to !== undefined &&
        violationAlertTypes.length > 1 &&
        selectedTab === "Custom")
    ) {
      const customPayloadIndividuals = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        acknowledge: 1,
        durationinminute: Math.round(
          (convertToEpochFormatToTime(date?.to) -
            convertToEpochFormat(date?.from)) /
            60000
        ),
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadIndividuals2 = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        acknowledge: 3,
        durationinminute: Math.round(
          (convertToEpochFormatToTime(date?.to) -
            convertToEpochFormat(date?.from)) /
            60000
        ),
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadVehicleFlow = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        durationinminute: Math.round(
          (convertToEpochFormatToTime(date?.to) -
            convertToEpochFormat(date?.from)) /
            60000
        ),
        applicationList: [207],
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadTotalViolations = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        applicationList:
          selectedViolationFilter.length > 1
            ? selectedViolationFilter
            : violationAlertTypes,
        durationinminute: Math.round(
          (convertToEpochFormatToTime(date?.to) -
            convertToEpochFormat(date?.from)) /
            60000
        ),
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadAverageSpeed = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        msId: msId ? msId : null,
      }
      const customPayloadPieChartViolations = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        applicationList:
          selectedViolationFilter.length > 1
            ? selectedViolationFilter
            : violationAlertTypes,
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadPieChartflowViolations = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        applicationList: [207],
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadLineChartFlow = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        applicationList: [207],
        charttype: vehicleClass,
        durationinminute: durationInMin,
        vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        msId: msId ? msId : null,
      }
      const customPayloadLineChartViolations = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        applicationList:
          selectedViolationFilter.length > 1
            ? selectedViolationFilter
            : violationAlertTypes,
        charttype: vehicleClass,
        durationinminute: durationInMin,
        vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
        channelidList: selectAllJunctions
          ? channelIds[0]?.map((item) => item.id)
          : selectedChannelIds,
        registrationtype:
          selectedRegistrationType !== null ? selectedRegistrationType : -1,
        msId: msId ? msId : null,
      }
      const customPayloadAverageSpeedGraphs = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
        msId: msId ? msId : null,
      }
      fetchtotalVehicleFlow(customPayloadVehicleFlow)
      fetchAverageTrafficSpeed(customPayloadAverageSpeed)
      fetchtotalViolations(customPayloadTotalViolations)
      // fetchIndividualsNotified(customPayloadIndividuals)
      // fetchIndividualsNotified2(customPayloadIndividuals2)
      fetchTrafficFlowViolationsPieChartsData(
        customPayloadPieChartflowViolations
      )
      fetchFlowChartsData(customPayloadLineChartFlow)
      fetchTrafficViolationsPieChartsData(customPayloadPieChartViolations)
      fetchViolationChartsData(customPayloadLineChartViolations)
      fetchAverageSpeedGraphsData(customPayloadAverageSpeedGraphs)
      // setIsDateChanged(false)
    }
  }, [
    // date,
    isDateChanged,
    cameraSelection,
    refresh,
    // fetchFlowChartsData,
    // fetchIndividualsNotified,
    // fetchIndividualsNotified2,
    // fetchTrafficFlowViolationsPieChartsData,
    // fetchTrafficViolationsPieChartsData,
    // fetchViolationChartsData,
    // fetchtotalVehicleFlow,
    // fetchtotalViolations,
    // msId,
    // // selectAllJunctions ? channelIds[0]?.map((item)=>item.id):selectedChannelIds,
    // selectedRegistrationType,
    // selectedVehicleType,
    // selectedViolationFilter,
    // vehicleClass,
    // violationAlertTypes,
    // cameraSelection,
  ])
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  useEffect(() => {
    fetchCities()
    if (selectedJunctionId.length > 0) {
      let junctionwithmsId = junctions?.find(
        (junction) => junction.id === selectedJunctionId[0]
      )?.serverid
      setmsId(junctionwithmsId)
    } else {
      setmsId(null)
    }
  }, [fetchCities, junctions, selectedJunctionId])

  useEffect(() => {
    if (violationType === "Vehicle Class") {
      setVehicleClass(0)
    }
    if (violationType === "Type of Events") {
      setVehicleClass(2)
    }
    if (violationType === "Registration Type") {
      setVehicleClass(1)
    }
  }, [violationType])
  useEffect(() => {
    setSelArea(null)
    setSelectAllJunctions(false)
    setSelectedJunctionId([])
    setSelectedChannelIds([])
    setSelectedJunctions([])
    setSelectedChannels([])
    resetChannelIds([])
  }, [])
  useEffect(() => {
    if (selectedTab !== "Custom") {
      setShowDateRange(false)
    }
  }, [selectedTab])
  const calculateDayTimestamps = () => {
    const currentDate = new Date()
    const todayStartTimestamp = new Date().setHours(0, 0, 0, 0)
    const todayEndTimestamp = currentDate.getTime()
    let yesterday = new Date(currentDate)
    yesterday.setDate(currentDate.getDate() - 1)
    const yesterdayStartTimestamp = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      0,
      0,
      0,
      0
    ).getTime()
    const yesterdayEndTimestamp = Math.floor(yesterday.getTime())
    const startDate = new Date()
    startDate.setMonth(currentDate.getMonth() - 1) // One month from current date
    const monthStartTimestamp = startDate.getTime()

    const monthEndTimeStamp = currentDate.getTime()

    const startDateForWeek = new Date()

    startDateForWeek.setDate(currentDate.getDate() - 7) // 1 week (7 days) before current date
    const weekStartTimestamp = startDateForWeek.getTime()

    const weekEndTimestamp = currentDate.getTime()

    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(12, 0, 0, 0)

    const midOfDay = new Date(now)
    midOfDay.setHours(12, 0, 0, 0)
    const midNight = new Date(now)
    midNight.setHours(11, 59, 59, 999)
    const startTimeStampForTwelveHours = Math.floor(startOfDay.getTime() / 1000)

    const endTimeStampForTwelveHours = Math.floor(endOfDay.getTime() / 1000)
    const startTimeStampForMidTwelveHours = Math.floor(
      midOfDay.getTime() / 1000
    )
    const endTimeStampForMidTwelveHours = Math.floor(midNight.getTime() / 1000)
    return {
      todayStartTimestamp,
      todayEndTimestamp,
      weekStartTimestamp,
      weekEndTimestamp,
      monthStartTimestamp,
      monthEndTimeStamp,
      startTimeStampForTwelveHours,
      endTimeStampForTwelveHours,
      startTimeStampForMidTwelveHours,
      endTimeStampForMidTwelveHours,
      yesterdayStartTimestamp,
      yesterdayEndTimestamp,
    }
  }
  const {
    todayStartTimestamp,
    todayEndTimestamp,
    weekStartTimestamp,
    weekEndTimestamp,
    monthStartTimestamp,
    monthEndTimeStamp,
    yesterdayStartTimestamp,
    yesterdayEndTimestamp,
  } = calculateDayTimestamps()
  useEffect(() => {
    // console.log("Effect triggered")

    const todayPayloadIndividuals = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      acknowledge: 1,
      durationinminute: Math.round(
        (todayEndTimestamp - todayStartTimestamp) / 60000
      ),
      // durationinminute: 1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const yesterdayPayloadIndividuals = {
      starttimestamp: yesterdayStartTimestamp,
      endtimestamp: yesterdayEndTimestamp,
      acknowledge: 1,
      durationinminute: Math.round(
        (yesterdayEndTimestamp - yesterdayStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const todayPayloadIndividuals2 = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      acknowledge: 3,
      durationinminute: Math.round(
        (todayEndTimestamp - todayStartTimestamp) / 60000
      ),
      // durationinminute: 1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const yesterdayPayloadIndividuals2 = {
      starttimestamp: yesterdayStartTimestamp,
      endtimestamp: yesterdayEndTimestamp,
      acknowledge: 3,
      durationinminute: Math.round(
        (yesterdayEndTimestamp - yesterdayStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadIndividuals = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      acknowledge: 1,
      durationinminute: Math.round(
        (weekEndTimestamp - weekStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadIndividuals2 = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      acknowledge: 3,
      durationinminute: Math.round(
        (weekEndTimestamp - weekStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadIndividuals = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      acknowledge: 1,
      durationinminute: Math.round(
        (monthEndTimeStamp - monthStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadIndividuals2 = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      acknowledge: 3,
      durationinminute: Math.round(
        (monthEndTimeStamp - monthStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const todayPayloadVehicleFlow = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      durationinminute: Math.round(
        (todayEndTimestamp - todayStartTimestamp) / 60000
      ),
      // durationinminute: 1,
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const yesterdayPayloadVehicleFlow = {
      starttimestamp: yesterdayStartTimestamp,
      endtimestamp: yesterdayEndTimestamp,
      durationinminute: Math.round(
        (yesterdayEndTimestamp - yesterdayStartTimestamp) / 60000
      ),
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadVehicleFlow = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      durationinminute: Math.round(
        (weekEndTimestamp - weekStartTimestamp) / 60000
      ),
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadVehicleFlow = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      durationinminute: Math.round(
        (monthEndTimeStamp - monthStartTimestamp) / 60000
      ),
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }

    const todayPayloadTotalViolations = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      durationinminute: Math.round(
        (todayEndTimestamp - todayStartTimestamp) / 60000
      ),
      // durationinminute: 1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const yesterdayPayloadTotalViolations = {
      starttimestamp: yesterdayStartTimestamp,
      endtimestamp: yesterdayEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      durationinminute: Math.round(
        (yesterdayEndTimestamp - yesterdayStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadTotalViolations = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      durationinminute: Math.round(
        (weekEndTimestamp - weekStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadTotalViolations = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      durationinminute: Math.round(
        (monthEndTimeStamp - monthStartTimestamp) / 60000
      ),
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const todayPayloadAverageSpeed = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      msId: msId ? msId : null,
    }
    const yesterdayPayloadAverageSpeed = {
      starttimestamp: yesterdayStartTimestamp,
      endtimestamp: yesterdayEndTimestamp,
      msId: msId ? msId : null,
    }
    const weekPayloadAverageSpeed = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      msId: msId ? msId : null,
    }
    const monthPayloadAverageSpeed = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      msId: msId ? msId : null,
    }
    const todayPayloadpPieChartViolations = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadPieChartViolations = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadPieChartViolations = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const todayPayloadpPieChartflowViolations = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadPieChartflowViolations = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadPieChartflowViolations = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      applicationList: [207],
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    // Start time: 12:00 am (midnight)
    const startTime1 = new Date()
    startTime1.setHours(0, 0, 0, 0)
    const startTimestamp1 = Math.floor((startTime1.getTime() * 1000) / 1000)

    // End time: 12:00 pm (noon)
    const endTime1 = new Date()
    endTime1.setHours(12, 0, 0, 0)
    const endTimestamp1 = Math.floor((endTime1.getTime() * 1000) / 1000)

    // Start time: 1:00 pm
    const startTime2 = new Date()
    startTime2.setHours(13, 0, 0, 0)
    const startTimestamp2 = Math.floor((startTime2.getTime() * 1000) / 1000)

    // End time: 11:59 pm
    const endTime2 = new Date()
    endTime2.setHours(23, 59, 0, 0)
    const endTimestamp2 = Math.floor((endTime2.getTime() * 1000) / 1000)
    const todayPayloadLineChartFlow = {
      starttimestamp:
        duration === "24 Hours"
          ? todayStartTimestamp
          : duration === "00:00-12:00"
          ? startTimestamp1
          : duration === "12:00-24:00"
          ? new Date().setHours(12, 0, 0, 0)
          : "",
      endtimestamp:
        duration === "24 Hours"
          ? todayEndTimestamp
          : duration === "00:00-12:00"
          ? endTimestamp1
          : duration === "12:00-24:00"
          ? new Date().setHours(23, 59, 59, 59)
          : "",
      applicationList: [207],
      charttype: vehicleClass,
      durationinminute: 120,
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      registrationtype:
        selectedRegistrationType !== null ? selectedRegistrationType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadLineChartFlow = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      applicationList: [207],
      charttype: vehicleClass,
      durationinminute: 1440,
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      registrationtype:
        selectedRegistrationType !== null ? selectedRegistrationType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadLineChartFlow = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      applicationList: [207],
      charttype: vehicleClass,
      durationinminute: Math.round(
        (weekEndTimestamp - weekStartTimestamp) / 60000
      ),
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }

    const todayPayloadLineChartViolations = {
      starttimestamp:
        duration === "24 Hours"
          ? todayStartTimestamp
          : duration === "00:00-12:00"
          ? startTimestamp1
          : duration === "12:00-24:00"
          ? new Date().setHours(12, 0, 0, 0)
          : "",
      endtimestamp:
        duration === "24 Hours"
          ? todayEndTimestamp
          : duration === "00:00-12:00"
          ? endTimestamp1
          : duration === "12:00-24:00"
          ? new Date().setHours(23, 59, 59, 59)
          : "",
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      charttype: vehicleClass,
      durationinminute: 120,
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      registrationtype:
        selectedRegistrationType !== null ? selectedRegistrationType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const weekPayloadLineChartViolations = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      charttype: vehicleClass,
      durationinminute: 1440,
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      registrationtype:
        selectedRegistrationType !== null ? selectedRegistrationType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      msId: msId ? msId : null,
    }
    const monthPayloadLineChartViolations = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      applicationList:
        selectedViolationFilter.length > 1
          ? selectedViolationFilter
          : violationAlertTypes,
      charttype: vehicleClass,
      durationinminute: 10080,
      vehicleclass: selectedVehicleType !== null ? selectedVehicleType : -1,
      channelidList: selectAllJunctions
        ? channelIds[0]?.map((item) => item.id)
        : selectedChannelIds,
      registrationtype:
        selectedRegistrationType !== null ? selectedRegistrationType : -1,
      msId: msId ? msId : null,
    }
    const todayPayloadAverageSpeedGraphs = {
      starttimestamp:
        speedDuration === "24 Hours"
          ? todayStartTimestamp
          : speedDuration === "00:00-12:00"
          ? startTimestamp1
          : speedDuration === "12:00-24:00"
          ? new Date().setHours(12, 0, 0, 0)
          : "",
      endtimestamp:
        speedDuration === "24 Hours"
          ? todayEndTimestamp
          : speedDuration === "00:00-12:00"
          ? endTimestamp1
          : speedDuration === "12:00-24:00"
          ? new Date().setHours(23, 59, 59, 59)
          : "",
      msId: msId ? msId : null,
    }
    const weekPayloadAverageSpeedGraphs = {
      starttimestamp: weekStartTimestamp,
      endtimestamp: weekEndTimestamp,
      msId: msId ? msId : null,
    }
    const monthPayloadAverageSpeedGraphs = {
      starttimestamp: monthStartTimestamp,
      endtimestamp: monthEndTimeStamp,
      msId: msId ? msId : null,
    }
    const fetchData = async () => {
      if (selectedTab === "Today" && violationAlertTypes.length > 0) {
        fetchtotalVehicleFlow(todayPayloadVehicleFlow)
        fetchtotalVehicleFlowYesterday(yesterdayPayloadVehicleFlow)
        fetchtotalViolations(todayPayloadTotalViolations)
        fetchtotalViolationsYesterday(yesterdayPayloadTotalViolations)
        fetchAverageTrafficSpeed(todayPayloadAverageSpeed)
        fetchAverageTrafficSpeedYesterday(yesterdayPayloadAverageSpeed)
        // fetchIndividualsNotified(todayPayloadIndividuals)
        // fetchIndividualsNotifiedYesterday(yesterdayPayloadIndividuals)
        // fetchIndividualsNotified2(todayPayloadIndividuals2)
        // fetchIndividualsNotified2Yesterday(yesterdayPayloadIndividuals2)
        fetchTrafficFlowViolationsPieChartsData(
          todayPayloadpPieChartflowViolations
        )
        fetchFlowChartsData(todayPayloadLineChartFlow)
        fetchTrafficViolationsPieChartsData(todayPayloadpPieChartViolations)
        fetchViolationChartsData(todayPayloadLineChartViolations)
        fetchAverageSpeedGraphsData(todayPayloadAverageSpeedGraphs)
      }
      if (selectedTab === "Week" && violationAlertTypes.length > 0) {
        fetchtotalVehicleFlow(weekPayloadVehicleFlow)
        fetchtotalViolations(weekPayloadTotalViolations)
        fetchAverageTrafficSpeed(weekPayloadAverageSpeed)
        // fetchIndividualsNotified(weekPayloadIndividuals)
        // fetchIndividualsNotified2(weekPayloadIndividuals2)
        fetchTrafficFlowViolationsPieChartsData(
          weekPayloadPieChartflowViolations
        )
        fetchFlowChartsData(weekPayloadLineChartFlow)
        fetchTrafficViolationsPieChartsData(weekPayloadPieChartViolations)

        fetchViolationChartsData(weekPayloadLineChartViolations)
        fetchAverageSpeedGraphsData(weekPayloadAverageSpeedGraphs)
      }
      if (selectedTab === "Month" && violationAlertTypes.length > 0) {
        fetchtotalVehicleFlow(monthPayloadVehicleFlow)
        fetchtotalViolations(monthPayloadTotalViolations)
        fetchAverageTrafficSpeed(monthPayloadAverageSpeed)
        // fetchIndividualsNotified(monthPayloadIndividuals)
        // fetchIndividualsNotified2(monthPayloadIndividuals2)
        fetchTrafficFlowViolationsPieChartsData(
          monthPayloadPieChartflowViolations
        )
        fetchFlowChartsData(monthPayloadLineChartFlow)
        fetchTrafficViolationsPieChartsData(monthPayloadPieChartViolations)

        fetchViolationChartsData(monthPayloadLineChartViolations)
        fetchAverageSpeedGraphsData(monthPayloadAverageSpeedGraphs)
      }
    }

    fetchData()
    const interval = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
      // setCameraSelection(false)
    }
  }, [
    selectedTab,
    violationAlertTypes,
    // selectedChannelIds,
    // msId,
    vehicleClass,
    duration,
    selectedVehicleType,
    selectedRegistrationType,
    selectedViolationType,
    selectedViolationFilter,
    refresh,
    cameraSelection,
    // isDateChanged,
  ])
  // console.log(selectedTab,'selectedTab')
  useEffect(() => {
    if (city !== 0) {
      fetchAreas(city)
    }
  }, [city, fetchAreas])

  useEffect(() => {
    if (selArea) {
      fetchJunctions(city, selArea)
    }
  }, [city, fetchJunctions, selArea])
  useEffect(() => {
    if (selectedJunctionId.length > 0) {
      const fetchDataForId = async (id) => {
        await fetchChannels(city, selArea, id)
      }
      selectedJunctionId?.forEach(fetchDataForId)
      // fetchChannels(city, selArea, selectedJunctionId)
    }
  }, [city, fetchChannels, selArea, selectedJunctionId])
  const handleRefreshClick = useCallback(() => {
    setRefresh(!refresh)
    setResetTimer((prev) => !prev)
    resetFlow([])
  }, [refresh, resetFlow])
  useEffect(() => {
    let intervalId
    const refreshInterval = (val) => {
      intervalId = setInterval(() => {
        handleRefreshClick()
      }, val * 60 * 1000)
    }
    // if (trimmedPathname === "today") {
    if (selectedValue !== null || selectedValue !== undefined) {
      refreshInterval(selectedValue)
      // }
    }

    return () => clearInterval(intervalId)
  }, [handleRefreshClick, refresh, selectedValue, resetTimer])

  const handleShowTable = () => {
    setShowDataTable(!showDataTable)
  }

  const handleVehicleTypeCheck = (e, id) => {
    if (e.target.checked) {
      setSelectedVehicleType(id)
      setSelectedVehicleFilter((prev) => [...prev, id])
    } else {
      // const filtered = selectedVehicleFilter?.filter((item) => item !== id)
      setSelectedVehicleFilter((prev) => prev.filter((item) => item !== id))
      setSelectedVehicleType(null)
    }
  }
  const handleRegistrationTypeCheck = (e, id) => {
    if (e.target.checked) {
      setSelectedRegistrationType(id)
      setSelectedRegFilter((prev) => [...prev, id])
    } else {
      setSelectedRegFilter((prev) => prev.filter((item) => item !== id))
      setSelectedRegistrationType(null)
    }
  }
  const handleViolationTypeCheck = (e, alerttype) => {
    if (e.target.checked) {
      setSelectedViolationType((prev) => [...prev, alerttype])
      setSelectedViolationFilter((prev) => [...prev, alerttype])
    } else {
      setSelectedViolationType((prev) => prev.filter((id) => id !== alerttype))
      setSelectedViolationFilter((prev) =>
        prev.filter((id) => id !== alerttype)
      )
    }
  }
  const handleClearAll = () => {
    setSelectedVehicleType(null)
    setSelectedRegistrationType(null)
    setSelectedViolationType([])
    setSelectedViolationFilter([])
    setSelectedRegFilter([])
    setSelectedVehicleFilter([])
  }

  const handleSelectAll = () => {
    setSelectedVehicleFilter([0, 1, 2, 3])
    setSelectedRegFilter(regTypeData.map((x) => x.code))
    setSelectedVehicleType(-1)
    setSelectedRegistrationType(-1)
    setSelectedViolationType(violationResponse.map((x) => x.alerttype))
    setSelectedViolationFilter(violationResponse.map((x) => x.alerttype))
  }
  const isVehicleCheckboxDisabled = (id) => {
    return (
      selectedVehicleFilter.length === 1 && !selectedVehicleFilter.includes(id)
    )
  }
  const isRegistrationCheckboxDisabled = (id) => {
    return selectedRegFilter.length === 1 && !selectedRegFilter.includes(id)
  }
  const handleFlow = () => {
    setFlow(!flow)
  }

  const handleLocationSelection = () => {
    setCameraSelection(!cameraSelection)
    setResetTimer((prev) => !prev)
    resetFlow([])
  }
  const handleDateChange = () => {
    setIsDateChanged(!isDateChanged)
    setShowDateRange(true)
    setResetTimer((prev) => !prev)
    resetFlow([])
    setSelectedTab("Custom")

    // if (
    //   date?.from !== "" ||
    //   (date.from !== undefined && date.to !== "") ||
    //   date.to !== undefined
    // ) {

    // }
  }
  const handleSpeedDuration = (val) => {
    setSpeedDuration(val)
  }
  const getSelectedTab = (val) => {
    setSelectedTab(val)
    setSubTab("Traffic Flow")
  }
  return (
    <div className="mt-[1em]flex grow flex-col gap-[1em]">
      <PreActions
        selectedAreaId={selectedAreaId}
        selArea={selArea}
        setSelArea={setSelArea}
        setSelectedAreaId={setSelectedAreaId}
        selectedJunctionId={selectedJunctionId}
        setSelectedJunctionId={setSelectedJunctionId}
        setSelectedChannelIds={setSelectedChannelIds}
        selectedChannelIds={selectedChannelIds}
        date={date}
        setDate={setDate}
        handleRefreshClick={handleRefreshClick}
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
        selectedJunctions={selectedJunctions}
        setSelectedJunctions={setSelectedJunctions}
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
        handleLocationSelection={handleLocationSelection}
        handleDateChange={handleDateChange}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        showDateRange={showDateRange}
        setResetTimer={setResetTimer}
        resetTimer={resetTimer}
        setShowDateRange={setShowDateRange}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        getSelectedTab={getSelectedTab}
        selectAllJunctions={selectAllJunctions}
        setSelectAllJunctions={setSelectAllJunctions}
        setmsId={setmsId}
        
      />
      <Overview
        date={date}
        setDate={setDate}
        selectedAreas={selectedAreas}
        selectedChannels={selectedChannels}
        selectedJunctions={selectedJunctions}
        showDateRange={showDateRange}
      />
      <NavigationMenu
        handleShowTable={handleShowTable}
        duration={duration}
        setDuration={setDuration}
        handleSpeedDuration={handleSpeedDuration}
        speedDuration={speedDuration}
        violationType={violationType}
        setViolationType={setViolationType}
        showDataTable={showDataTable}
        violationResponse={violationResponse}
        handleVehicleTypeCheck={handleVehicleTypeCheck}
        handleRegistrationTypeCheck={handleRegistrationTypeCheck}
        handleViolationTypeCheck={handleViolationTypeCheck}
        selectedVehicleFilter={selectedVehicleFilter}
        selectedViolationFilter={selectedViolationFilter}
        selectedRegFilter={selectedRegFilter}
        handleClearAll={handleClearAll}
        handleSelectAll={handleSelectAll}
        isVehicleCheckboxDisabled={isVehicleCheckboxDisabled}
        isRegistrationCheckboxDisabled={isRegistrationCheckboxDisabled}
        todayEndTimestamp={todayEndTimestamp}
        todayStartTimestamp={todayStartTimestamp}
        weekStartTimestamp={weekStartTimestamp}
        weekEndTimestamp={weekEndTimestamp}
        monthStartTimestamp={monthStartTimestamp}
        monthEndTimestamp={monthEndTimeStamp}
        checkDate={date}
        vehicleTypeData={vehicleTypeData}
        regTypeData={regTypeData}
        flow={flow}
        handleFlow={handleFlow}
        setResetTimer={setResetTimer}
        resetTimer={resetTimer}
        selectedAreas={selectedAreas}
        selectedChannels={selectedChannels}
        selectedJunctions={selectedJunctions}
        showDateRange={showDateRange}
        date={date}
        convertToEpochFormat={convertToEpochFormat}
        convertToEpochFormatToTime={convertToEpochFormatToTime}
        refresh={refresh}
        cameraSelection={cameraSelection}
        isDateChanged={isDateChanged}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        subTab={subTab}
        setSubTab={setSubTab}
      />
      {openResetPassword && (
        <Dialog open={openResetPassword}>
          <DialogContent className={"max-h-screen overflow-y-scroll"}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                <ChangeUserPassword
                  setOpenAdminPassword={setOpenResetPassword}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default DashboardLayout
