"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  format,
  parse,
  set,
  // setDate,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns"
// import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRangePicker } from "react-date-range"

import {
  fetchPagination,
  getAlertTypes,
  getAllEventRecords,
  getFileContent,
  getLpSnap,
} from "@/lib/api"
import isRTL from "@/lib/isRTL"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TimePicker from "@/components/timePicker"
import Videotabheader from "@/components/video-tab-header"

import Filteroptions from "./filteroptions"
import { QuickView } from "./quick-view"
import { TimePickerDemo } from "./time-picker-demo"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import useStore from "@/store/store"
import { SelectLabel } from "@radix-ui/react-select"

import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { SelectGroup } from "./ui/video-menu-select"

function SearchLayout(props) {
  let [arrRecords, setArrRecords] = useState([])
  const areas = useStore((state) => state.areas)
  const setAreas = useStore((state) => state.setAreas)
  const channelList = useStore((state) => state.channelList)
  const setChannelList = useStore((state) => state.setChannelList)
  const [isGridShown, setIsGridShown] = useState(false)
  const [isTableShown, setIsTableShown] = useState(true)
  const [selectedNumber, setSelectedNumber] = useState("-4")
  const [snapArray, setSnapArray] = useState(props?.lastFiveElements)
  const [isChecked, setIsChecked] = useState(false)
  let [selectedElement, setselectedElement] = useState({})
  const [showFilter, setShowFilter] = useState(false)
  const [eventRecords, setEventRecords] = useState([])
  const [eventObj, setEventObj] = useState({})
  const [eventObjPayload, setEventObjPayload] = useState({})
  // const [signature, setSignature] = useState("");
  // const [LPStandard, setLPStandard] = useState("");
  // const [LPQuality, setLPQuality] = useState("");
  // const [OCR, setOCR] = useState("");
  let mergedArray = []
  let filteredArray = []
  let regfilteredArray = []
  let violationfilteredArray = []
  let violationTypeArray = []
  let lastFiveElements
  let filterOptionsElements
  const [isModalOpen, setModalIsOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDateFiltered, setIsDateFiltered] = useState(true)
  // const [startTime, setStartTime] = useState("12:00 AM")
  // const [endTime, setEndTime] = useState("11:59 PM")
  // const [startMinute, setStartMinute] = useState("00")
  // const [startSecond, setStartSecond] = useState("00")
  // const [endMinute, setEndMinute] = useState("00")
  // const [endSecond, setEndSecond] = useState("00")
  const [startTime, setStartTime] = useState("12:00:00 AM")
  const [endTime, setEndTime] = useState("11:59:00 PM")
  const [startingTime, setStartingTime] = useState("")
  const [endingTime, setEndingTime] = useState("")
  const [startDateTimeVal, setStartDateTimeVal] = useState("")
  const [endDateTimeVal, setEndDateTimeVal] = useState("")
  const [selCamId, setSelCamId] = useState(-1)
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)))
  const [secondDate, setSecondDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 59))
  )
  const [isFilterOptionClicked, setFilterOptionClicked] = useState(false)
  // const [filteredTimeData, setFilteredTimeData] = useState([])

  let [colorfilterValues, setcolorfilterValues] = useState([
    "Black",
    "Blue",
    "Brown",
    "Gray",
    "Green",
    "Orange",
    "Red",
    "Silver",
    "Undetermeined",
    "White",
    "Yellow",
    "Notapplicable",
  ])
  let [regTypeValues, setregTypeValues] = useState([
    "Army",
    "Commercial",
    "Electrical",
    "Private",
    "Others",
  ])
  let [violationTypeValues, setviolationTypeValues] = useState([
    "No Seat Belt",
    "Over Speed",
    "No Helmet",
    "Red Light Violation Detection",
    "Stop Line Violation",
    "License Plate Recognition",
  ])

  const regType = ["Others", "Private", "Commercial", "Army", "Electrical"]
  const vehicleColor = [
    "",
    "Black",
    "White",
    "Gray",
    "Red",
    "Yellow",
    "Green",
    "Blue",
    "Orange",
    "Silver",
    "Brown",
  ]
  const vehicleClass = [
    "Motorbike",
    "Auto",
    "Car",
    "Carrier",
    "Bus",
    "Lorry",
    "Maxicab",
    "Jeep",
    "Electric Scooter",
    "Electric Car",
  ]
  const violationType = [
    {
      alerttype: 320,
      alertname: "Over Speed",
    },
    {
      alerttype: 300,
      alertname: "Red Light Violation Detection",
    },
    {
      alerttype: 207,
      alertname: "License Plate Recognition",
    },
    {
      alerttype: 323,
      alertname: "Stop Line Violation",
    },
    {
      alerttype: 311,
      alertname: "Vehicle Wrong Way",
    },
    {
      alerttype: 329,
      alertname: "Driver On Call",
    },
    {
      alerttype: 327,
      alertname: "Pillion Rider No Helmet",
    },
    {
      alerttype: 326,
      alertname: "Triple Ride",
    },
    {
      alerttype: 325,
      alertname: "No Helmet",
    },
    {
      alerttype: 322,
      alertname: "No Seat Belt",
    },
  ]
  // const [isFilterVisible, setIsFilterVisible] = useState(false)

  useEffect(() => {
    // setjunctionList()
    // setAreas(1)
    setChannelList()
  }, [])
  // useEffect(()=>{
  // },[camSearch])
  const updatedFiveData = props?.arrayRecords.slice(-5)
  const [lastFiveFilteredData, setLastFiveFilteredData] =
    useState(updatedFiveData)
  // convert date and time

  // const [filteredDataArr, setFilteredDataArr] = useState(lastFiveFilteredData)
  let today = new Date()
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() + 1)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: yesterday,
    key: "selection",
  })

  function records(allRec) {
    allRec.slice().sort((a, b) => a.msEventId - b.msEventId)
    setArrRecords([...allRec])
  }
  useEffect(() => {
    // console.log("arrRecords",arrRecords)
  }, [arrRecords])
  // console.log("allData", arrRecords)
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(arrRecords.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = arrRecords.slice(indexOfFirstItem, indexOfLastItem)
  const currentItemsFullEvent = eventRecords.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const [open2, setOpen2] = useState(false)
  const [alertTypes, setAlertTypes] = useState([])
  useEffect(() => {
    const fetchAlertTypes = async () => {
      const res = await getAlertTypes()
      setAlertTypes(res)
    }
    fetchAlertTypes()
  }, [])
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const fetchLpImages = async (img) => {
    const payload = {
      filepath: img,
      height: 50,
      width: 150,
    }
    const response = await getLpSnap(payload)
    var lpImage = "data:image/jpg;base64," + response.data.result[0]
    return lpImage
  }
  const fetchEventImages = async (img) => {
    let eventobj = {
      filepath: img,
    }
    const imgRes = await getFileContent(eventobj)
    let base64String = "data:image/png;base64," + imgRes
    return base64String
  }

  const handleDateFilter = (offsetVal) => {
    setArrRecords([])
    // setOffset(offsetVal);
    let searchParam = []
    violationTypeValues.forEach((item) => {
      searchParam.push(
        violationType.find((x) => x?.alertname == item)?.alerttype
      )
    })
    let objPropertyValarray = []
    colorfilterValues?.map((item) => {
      objPropertyValarray.push(vehicleColor.indexOf(item))
    })
    let objPropVal =
      colorfilterValues.length > 0 && colorfilterValues.length < 12
        ? objPropertyValarray[0]
        : -1
    const { startDate, endDate } = dateRange

    let parsedDate = new Date(startDate)
    // let parsedStartTime = parse(startTime, "h:mm:ss aa", new Date())
    let combinedStartTime = set(parsedDate, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    })
    let startingTime = Math.floor(combinedStartTime.getTime())
    let parsedToDate = new Date(endDate)
    // let parsedEndTime = parse(endTime, "h:mm:ss aa", new Date())
    let combinedEndTime = set(parsedToDate, {
      hours: secondDate.getHours(),
      minutes: secondDate.getMinutes(),
      seconds: secondDate.getSeconds(),
    })

    let endingTime = Math.floor(combinedEndTime.getTime())
    setStartingTime(startingTime)
    setEndingTime(endingTime)
    let payload = {
      acknowledge: -1,
      dontDeleteOnly: false,
      channelId: selCamId,
      startingTime: startingTime,
      endTime: endingTime,
      searchParam: searchParam,
      objectProperty: objPropVal,
      objectProperty6:
        regTypeValues.length > 0 && regTypeValues.length < 5
          ? "=" + regType.indexOf(regTypeValues[0])
          : null,
      offset: offsetVal,
      limit: 60,
      priority: -1,
      profileId: 1,
      textFilter: null,
      junctionServerId: null,
      vehicleClass: -1,
      lpSignature: -1,
      objectProperty7: null,
      objectProperty8: null,
      objectProperty5: null,
      objectProperty4: [],
    }
    // console.log(payload);
    setEventObjPayload(payload)
    let eventArr = []
    const getAllRecords = async (payload) => {
      const severity = ["Critical", "Medium", "Low"]
      const eventRecords = await getAllEventRecords(payload)
      if (eventRecords) {
        setEventRecords(eventRecords)
        eventRecords.map(async (eve) => {
          setEventObj(eve)
          let newDateTimeStamp = new Date(eve.startTime)
          newDateTimeStamp = new Date(newDateTimeStamp).toLocaleString()
          let datetimeArray = newDateTimeStamp.split(",")
          let date = datetimeArray[0]
          let time = datetimeArray[1]
          var lpImage = await fetchLpImages(eve.snapUrls[0])
          var eventImage = await fetchEventImages(eve.snapUrls[0])
          var recordObj = {
            msEventId: eve.msEventId,
            endTime: eve.endTime,
            startTime: eve.startTime,
            vehicleType: vehicleClass[eve.vehicleClass],
            vehicleClass: eve.vehicleClass,
            acknowledge: eve.acknowledge,
            cameraName: eve.cameraName,
            junctionName: eve.junctionName,
            channelId: eve.channelId,
            averageSpeed: eve.averageSpeed,
            action: eve.action,
            message: eve.message,
            severityVal: severity[eve.priority],
            speedLimit: eve.objectProperty3,
            color: vehicleColor[eve.objectProperty1],
            registrationType: regType[eve.objectProperty6],
            speed: eve.objectProperty4,
            vehicleNo: eve.objectId,
            id: eve.id,
            msId: eve.msId,
            lpSignature: eve.lpSignature,
            acknowledgeUser: eve.acknowledgeUser,
            modifiedobjectId: eve.modifiedobjectId,
            eventType: eve.eventType,
            acknowledgedTime: eve.acknowledgedTime,
            date: date,
            time: time,
            violation: violationType[eve.eventType],
            snapUrls: eve.snapUrls[0],
            lpImage: lpImage,
            eventImage: eventImage,
          }
          eventArr.push(recordObj)
          records(eventArr)
        })
        setOffset(offsetVal + 60)
        setCurrentPage(1)
      }
    }

    getAllRecords(payload)
  }
  const handleDateRangeChange = (selectedRange) => {
    setDateRange(selectedRange.selection)
  }

  useEffect(() => {
    setLastFiveFilteredData(props?.arrayRecords.slice(-5))
  }, [props])
  async function viewDetails(data) {
    let selectedElement = currentItems.find((element) => {
      return element.id == data
    })
    let selectedElementFullEvent = currentItemsFullEvent.find((element) => {
      return element.id == data
    })
    let eventData = selectedElement.snapUrls
    let eventobj = {
      filepath: eventData,
    }
    const imgRes = await getFileContent(eventobj)
    let base64String = "data:image/png;base64," + imgRes
    selectedElementFullEvent.eventSrc = base64String
    selectedElement.eventSrc = base64String
    setselectedElement(selectedElement)

    setEventObj(selectedElementFullEvent)
    setOpen2(true)
  }
  const handleClose = () => {
    setOpen2(false)
  }
  const toggleModal = () => {
    setModalIsOpen(!isModalOpen)
  }
  const onCloseFilter = () => {
    setShowFilter(true)
  }

  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  if (colorfilterValues.length > 0) {
    filteredArray = arrRecords.filter((obj) =>
      colorfilterValues.includes(obj.color)
    )
  }

  if (regTypeValues.length > 0) {
    regfilteredArray = arrRecords.filter((obj) =>
      regTypeValues.includes(obj.registrationType)
    )
  }
  if (violationTypeValues.length > 0) {
    violationTypeArray = arrRecords.map((obj) => obj.eventType)
    if (violationTypeArray === "207") {
      violationfilteredArray = "License Plate Recognition"
      // console.log("check", violationfilteredArray)
    } else if (violationTypeArray === "300") {
      violationfilteredArray = "Red Light Violation Detection"
    } else if (violationTypeArray === "320") {
      violationfilteredArray = "Over Speed"
    } else if (violationTypeArray === "323") {
      violationfilteredArray = "Stop Line Violation"
      // console.log("check", violationfilteredArray)
    }
  }

  if (
    colorfilterValues.length > 0 ||
    regTypeValues.length > 0 ||
    violationTypeValues.length > 0
  ) {
    mergedArray = [
      ...filteredArray,
      ...regfilteredArray.filter(
        (obj2) => !filteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    mergedArray = [
      ...mergedArray,
      ...violationTypeArray.filter(
        (obj2) => !filteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    // console.log("mergedArray", mergedArray)
    filterOptionsElements = mergedArray.slice(selectedNumber)
    // setLastFiveFilteredData(mergedArray.slice(selectedNumber))
  } else {
    filterOptionsElements = arrRecords?.slice(selectedNumber)
  }
  const severity = ["Critical", "Medium", "Low"]

  const submitFilter = (event, option) => {
    setcolorfilterValues([option])
  }
  const submitregFilter = (event, option) => {
    setregTypeValues([option])
  }
  const submitViolationFilter = (event, option) => {
    if (event) {
      setviolationTypeValues([...violationTypeValues, option])
    } else {
      setviolationTypeValues(
        violationTypeValues.filter((val) => val !== option)
      )
    }
  }
  const clearAll = () => {
    setcolorfilterValues([])
    setregTypeValues([])
    setviolationTypeValues([])
  }
  const selectAll = () => {
    setcolorfilterValues([
      "Black",
      "Blue",
      "Brown",
      "Gray",
      "Green",
      "Orange",
      "Red",
      "Silver",
      "Undetermeined",
      "White",
      "Yellow",
      "Notapplicable",
    ])
    setregTypeValues(["Army", "Commercial", "Electrical", "Private", "Others"])
    setviolationTypeValues([
      "No Seat Belt",
      "Over Speed",
      "No Helmet",
      "Red Light Violation Detection",
      "Stop Line Violation",
      "License Plate Recognition",
    ])
  }

  function addImage(imgsrc) {
    setSnapArray((prevArray) => [...prevArray, imgsrc])
    setlastElement(imgsrc)
  }

  const colorFilters = ["All", "Blue", "Green", "Black", "White", "Yellow"]
  const handleClick = (event) => {
    setIsGridShown(true)
    setIsTableShown(false)
    setItemsPerPage(20)
  }
  const handleClickTable = (event) => {
    setIsTableShown(true)
    setIsGridShown(false)
    setItemsPerPage(10)
  }

  // Date filter
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  })

  // TimeFilter

  const handleReset = () => {
    setDate(new Date(new Date().setHours(0, 0, 0, 0)))
    setSecondDate(new Date(new Date().setHours(23, 59, 59, 59)))
    let today = new Date()
    let yesterday = new Date(today)
    yesterday.setDate(today.getDate() + 1)
    handleDateRangeChange({
      selection: {
        startDate: new Date(),
        endDate: yesterday,
        key: "selection",
      },
    })
    selectAll()
    setSelCamId(-1)
  }
  const findStatusValue = (type) => {
    switch (type) {
      case 0:
        return "Unchecked"
      case 1:
        return "Valid Event"
      case 2:
        return "Spurious"
      case 3:
        return "Auto Valid"
      case 4:
        return "Auto Spurious"
      default:
        return "Others"
    }
  }
  const convertToViolationType = (type) => {
    for (let i = 0; i < alertTypes?.length; i++) {
      if (alertTypes[i].alerttype === type) {
        return alertTypes[i].alertname
      }
    }
    return "Others"
  }
  const renderGrid = () => {
    return Array.from({ length: 20 }).map((_, index) => {
      const lastFiveElementsData = currentItems[index]
      // console.log("test", lastFiveElementsData);
      return (
        <div className="my-2 mr-2 bg-[#F6F6F6]" key={index}>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 p-2 text-[#6F6F70]">
              <Image
                src="/vectors/video-icon.svg"
                alt="video-icon"
                width={20}
                height={2}
              />
              {lastFiveElementsData ? (
                <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]">
                  {lastFiveElementsData.date} |{lastFiveElementsData.time}
                </span>
              ) : (
                ""
              )}
            </div>
            <Button
              // onClick={toggleModal}
              onClick={() => {
                viewDetails(lastFiveElementsData.id)
              }}
              variant="outline"
              className="border-none"
            >
              <span className="pb-4 pr-2">...</span>
            </Button>
          </div>

          <AspectRatio ratio={12 / 6} className="bg-black">
            {lastFiveElementsData ? (
              <Image src={lastFiveElementsData?.eventImage} alt="Photo" fill />
            ) : (
              <div className="relative top-[30%] flex flex-row items-center justify-center">
                <Image
                  src="/vectors/Videonetics_logo (1).svg"
                  alt="videonetics-logo"
                  fill
                />
              </div>
            )}
          </AspectRatio>
          <div className="flex justify-between p-2  ">
            {lastFiveElementsData ? (
              <span className="rounded bg-[#FDC4BD] px-[8px] py-[4px] text-xs text-[#D73D2A]">
                {lastFiveElementsData.severityVal}
              </span>
            ) : (
              <span className="py-4"></span>
            )}
            {lastFiveElementsData ? (
              <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]">
                Status: {findStatusValue(lastFiveElementsData.acknowledge)}
              </span>
            ) : (
              <span className="py-4"></span>
            )}
          </div>
        </div>
      )
    })
  }

  const renderEmptyGrid = () => {
    return Array.from({ length: 16 }).map((_, index) => (
      // <div className="grid-item" key={index}></div>
      <div className="my-2 mr-2 bg-[#F6F6F6]" key={index}>
        <div className="flex justify-between">
          <div className="flex gap-2 p-2 text-[#6F6F70]">
            <Image
              src="/vectors/video-icon.svg"
              alt="video-icon"
              width={20}
              height={2}
            />
            <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]"></span>
          </div>

          <span className="pb-4 pr-2">...</span>
        </div>
        <AspectRatio ratio={12 / 6} className="bg-black">
          <div className="relative top-[30%] flex flex-row items-center justify-center">
            <Image
              src="/vectors/Videonetics_logo (1).svg"
              alt="videonetics-logo"
              fill
            />
          </div>
        </AspectRatio>
        <div className="flex justify-between p-2  ">
          {/* <span className="bg-[#FDC4BD] text-[#D73D2A] rounded py-[4px] px-[8px]">
                Critical
              </span> */}
          <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]">
            {/* Status: Unchecked */}
          </span>
        </div>
      </div>
    ))
  }

  const renderLicenseEmptyGrid = () => {
    return Array.from({ length: 16 }).map((_, index) => (
      // <div className="grid-item" key={index}></div>
      <div className="my-2 mr-2 bg-[#F6F6F6]" key={index}>
        <div className="flex justify-between">
          <div className="flex gap-2 p-2 text-[#6F6F70]">
            <Image
              src="/vectors/video-icon.svg"
              alt="video-icon"
              width={20}
              height={2}
            />
            <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]"></span>
          </div>

          <span className="pb-4 pr-2">...</span>
        </div>
        <AspectRatio ratio={16 / 9} className="bg-black">
          <div className="relative top-[30%] flex flex-row items-center justify-center">
            <Image
              src="/vectors/Videonetics_logo (1).svg"
              alt="videonetics-logo"
              width={80}
              height={80}
            />
          </div>
        </AspectRatio>
        <div className="flex justify-between p-2  ">
          {/* <span className="bg-[#FDC4BD] text-[#D73D2A] rounded py-[4px] px-[8px]">
                Critical
              </span> */}
          <span className="flex items-center text-xs font-medium leading-5 text-[#6F6F70]">
            {/* Status: Unchecked */}
          </span>
        </div>
      </div>
    ))
  }

  // console.log("currentItems", currentItems)

  return (
    <div>
      {/* <Videotabheader /> */}
      <div className="items-top mt-6 flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-col">
              <span>Date</span>
              <Button id="date" variant={"outline"} className="rounded-md">
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
        {/* </div> */}

        <div className="flex flex-col items-start">
          <p>Start Time</p>
          {/* <TimePicker
              value={startTime}
              onChange={(val) => setStartTime(val)}
              className="w-[130px] rounded-sm"
            /> */}
          <TimePickerDemo date={date} setDate={setDate} />
        </div>
        <div className="flex flex-col items-start">
          <p>End Time</p>
          {/* <TimePicker value={endTime} onChange={(val) => setEndTime(val)} />
           */}
          <TimePickerDemo date={secondDate} setDate={setSecondDate} />
        </div>
        <div className="flex flex-col items-start">
          <p>&nbsp;</p>
          <Filteroptions
            onCheckboxChange={submitFilter}
            colorfilterValues={colorfilterValues}
            regTypeValues={regTypeValues}
            onChangereg={submitregFilter}
            onChangeviolation={submitViolationFilter}
            violationTypeValues={violationTypeValues}
            clearAll={clearAll}
            selectAll={selectAll}
          />
        </div>
        <div className="flex flex-col items-start">
          Camera
          <Select onValueChange={(val) => setSelCamId(val)} value={selCamId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={selCamId === null ? "Select Camera" : undefined}
              >
                {selCamId !== null &&
                  channelList.find((channel) => channel.id === selCamId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-50 w-48 rounded-md">
                <SelectGroup>
                  <SelectLabel>Camera</SelectLabel>
                  {channelList?.map((cam) => (
                    <SelectItem key={cam.id} value={cam.id}>
                      {cam.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectItem
                  key={-1}
                  value={null}
                  onClick={() => setSelCamId(-1)}
                >
                  Clear
                </SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p>&nbsp;</p>
          <Button onClick={() => handleDateFilter(0)}>Search</Button>
        </div>
        <div>
          <p>&nbsp;</p>
          <Button onClick={handleReset} variant={"outline"} className="rounded">
            Reset
          </Button>
        </div>

        {/* <div className="mt-10 flex items-center justify-center space-x-2">
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <span>View License Plate</span>
          </label>
        </div> */}
      </div>
      {/* <div className="items-top mt-6 flex flex-wrap gap-2 bg-gray-50 p-4">
        <div className="flex flex-col items-start">
          <p className="text-sm">Signature</p>
          <Select value={signature} onValueChange={(value)=>setSignature(value)} className="p-2">
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" className=" py-4"/>
            </SelectTrigger>
            <SelectContent className="w-[200px]">                                                            
                <SelectItem value="">All</SelectItem>
                <SelectItem value="0">Matched</SelectItem>
                <SelectItem value="1">Mismatched</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm">LP Standard</p>
          <Select value={LPStandard} onValueChange={(value)=>setLPStandard(value)} className="p-2">
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" className=" py-4"/>
            </SelectTrigger>
            <SelectContent className="w-[200px]">                                                            
                <SelectItem value="">All</SelectItem>
                <SelectItem value="1">HSRP</SelectItem>
                <SelectItem value="2">Non HSRP</SelectItem>
                <SelectItem value="0">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm">LP Quality</p>
          <Select value={LPQuality} onValueChange={(value)=>setLPQuality(value)} className="p-2">
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" className=" py-4"/>
            </SelectTrigger>
            <SelectContent className="w-[200px]">                                                            
                <SelectItem value="">All</SelectItem>
                <SelectItem value="1">Good</SelectItem>
                <SelectItem value="2">Bad</SelectItem>
                <SelectItem value="3">Blank</SelectItem>
                <SelectItem value="4">Covered</SelectItem>
                <SelectItem value="5">Noise</SelectItem>
                <SelectItem value="0">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm" onChange={(value)=>setOCR(value)} >OCR Confidence</p>
          <Input className="py-2"/>
        </div>
      </div> */}
      <div className="flex items-center justify-end">
        <div className="mt-4 flex items-center justify-center rounded border-2">
          <Button
            variant="outline"
            className="border-none"
            onClick={handleClick}
          >
            <Image
              alt="grid-icon"
              src="/vectors/grid.svg"
              width={20}
              height={20}
            />
          </Button>
          <Button
            variant="outline"
            className="border-none"
            onClick={handleClickTable}
          >
            <Image
              alt="grid-icon"
              src="/images/Listview.svg"
              width={20}
              height={20}
            />
          </Button>
        </div>
      </div>
      {isGridShown && !isChecked && (
        <div className="grid grid-cols-4 gap-2 py-4">
          {currentItems.length > 0 ? renderGrid() : renderEmptyGrid()}
        </div>
      )}

      {isChecked && (
        <div className="grid grid-cols-4 gap-2 py-4">
          {lastFiveFilteredData.length > 0
            ? renderLicenseGrid()
            : renderLicenseEmptyGrid()}
        </div>
      )}
      <div className="flex flex-row ">
        <div className="w-full">
          {isTableShown && !isGridShown && !isChecked && (
            <Table>
              <TableHeader className="bg-[#fff]">
                <TableRow>
                  <TableHead className="text-black">Severity</TableHead>
                  <TableHead className="text-black">Type of Events</TableHead>
                  <TableHead className="text-black">Vehicle Type</TableHead>
                  <TableHead className="text-black">Camera</TableHead>
                  <TableHead className="text-black">Timestamp</TableHead>
                  <TableHead className="text-black">License Plate</TableHead>
                  <TableHead className="text-black">
                    License Plate Image
                  </TableHead>
                  <TableHead className="text-black">Status</TableHead>
                  <TableHead className="text-black">Speed</TableHead>

                  <TableHead className="text-center text-black">View</TableHead>
                  {/* <TableHead className="text-black"></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white font-[500] not-italic text-[##3F3F40]">
                {currentItems?.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-[#D73D2A]">
                      {detail.severityVal}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Image
                        src="/images/OverSpeeding.svg"
                        width="24"
                        height="24"
                        alt="Overspeeding"
                        className="pr-2"
                      />
                      <span>{convertToViolationType(detail?.eventType)}</span>
                    </TableCell>
                    <TableCell>{detail.vehicleType}</TableCell>
                    <TableCell>{detail.cameraName}</TableCell>
                    <TableCell>
                      {detail.date}, {detail.time}
                    </TableCell>
                    <TableCell>
                      <span dir={isRTL(detail.vehicleNo) ? "rtl" : "ltr"}>
                        {detail.vehicleNo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Image
                        src={detail?.lpImage}
                        alt="lpImage"
                        width={120}
                        height={30}
                        className="ml-2 h-auto w-[120px]"
                      />
                    </TableCell>
                    <TableCell>{findStatusValue(detail.acknowledge)}</TableCell>

                    <TableCell>{detail.speed}</TableCell>
                    <TableCell>
                      <div>
                        <Button
                          // onClick={toggleModal}
                          onClick={() => {
                            viewDetails(detail.id)
                          }}
                          variant="outline"
                          className="border-none"
                        >
                          View Detail
                        </Button>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Image
                        src="/images/CameraIcon.svg"
                        width="48"
                        height="40"
                        alt="camera"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      />
                      {isHovering && (
                    <QuickView onRequestClose={toggleModal} props={detail} />
                  )}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-center">
            {offset > 119 ? (
              <Button
                className="m-2"
                onClick={() => handleDateFilter(offset - 120)}
              >
                Load Previous
              </Button>
            ) : (
              <></>
            )}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              className="m-2"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
                className="m-2"
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="m-2"
            >
              Next
            </Button>
            {offset > 0 ? (
              <Button className="m-2" onClick={() => handleDateFilter(offset)}>
                Load More
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {isChecked && (
          <div className="grid grid-cols-4 gap-2 py-4">
            {currentItems.length > 0
              ? renderLicenseGrid()
              : renderLicenseEmptyGrid()}
          </div>
        )}
      </div>
      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent className={"max-h-fit w-[600px] lg:max-w-screen-md"}>
          <DialogHeader>
            <DialogTitle>Event Viewer</DialogTitle>
            <DialogDescription>
              <QuickView
                onRequestClose={toggleModal}
                details={selectedElement}
                selectedChannel={props.selectedChannel}
                playerRefs={props.playerRefs}
                handleSessionId={props.handleSessionId}
                convertToViolationType={convertToViolationType}
                eventObj={eventObj}
                handleClose={handleClose}
                handleDateFilter={handleDateFilter}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchLayout
