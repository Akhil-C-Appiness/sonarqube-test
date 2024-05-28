"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import { format, parse, set } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import {
  fetchPagination,
  getAllAnalytics,
  getAllChannels,
  getChannels,
  getEventRecords,
  getFileContent,
  getLpSnap,
} from "@/lib/api"
import isRTL from "@/lib/isRTL"
import Pagination from "@/lib/pagination"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import ImageWithMagnifier from "@/components/imageMag"
import TimePicker from "@/components/timePicker"
import { ValidateView } from "@/components/validate-view"
import { VehicleTypeView } from "@/components/vehicle-type"

import Spinner from "./spinner"
import { TimePickerDemo } from "./time-picker-demo"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"

const QuickSearch = () => {
  const { toast } = useToast()
  let today = new Date()
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const [fromDate, setFromDate] = useState(yesterday)
  const [toDate, setToDate] = useState(today)
  const [startTime, setStartTime] = useState("12:00:00 AM")
  const [endTime, setEndTime] = useState("11:59:00 PM")
  const [firstDate, setFirstDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  )
  const [secondDate, setSecondDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 59))
  )
  const [startingTime, setStartingTime] = useState("")
  const [endingTime, setEndingTime] = useState("")
  const selectedCity = useStore((state) => state.selectedCity)
  const fetchAreas = useStore((state) => state.setAreas)
  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedJunction, setSelectedJunction] = useState(null)
  const [channelList, setChannelList] = useState([])
  const [vehicleNo, setVehicleNo] = useState("")
  const [speedRange, setSpeedRange] = useState("")
  const [onlyDelete, setOnlyDelete] = useState(false)
  const [acknowledgement, setAcknowledgement] = useState(-1)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [priority, setPriority] = useState(-1)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [color, setColor] = useState(null)
  const [vehicleClass, setVehicleClass] = useState(-1)
  const [signature, setSignature] = useState(-1)
  const [regType, setRegType] = useState(null)
  const [lpQuality, setLpQuality] = useState(null)
  const [lpStandard, setLpStandard] = useState(null)
  const [ocr, setOcr] = useState("")
  const [analytics, setAnalytics] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsCount, setEventsCount] = useState(null)
  const [eventsData, setEventsData] = useState([])
  const [imgArr, setImgArr] = useState([])
  const totalPages = Math.ceil(eventsCount / 100)
  const setAreas = useStore((state) => state.setAreas)
  const areas = useStore((state) => state.areas)
  const setJunctions = useStore((state) => state.setJunctions)
  const junctions = useStore((state) => state.junctions)
  const pathname = usePathname()
  const trimmedPathname = pathname.slice(13)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [filteredEventObj, setFilteredEventObj] = useState(null)
  const [uncheckedUpdated, setUncheckedUpdated] = useState(false)
  const [vehicleNumber, setVehicleNumber] = useState()
  const [isValidateOpen, setValidateIsOpen] = useState(false)
  const [openEvidenceSnap, setOpenEvidenceSnap] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)
  const [smsChecked, setSmsChecked] = useState(false)
  const [selectedMsId, setSelectedMsId] = useState(null)
  const { setAlertTypes, alertTypes, setAllChannels, allChannels } = useStore()
  const setEmailSms = useStore((state) => state.setEmailSms)
  const severity = ["Critical", "Medium", "Low"]
  const vehicleColor = [
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
  useEffect(() => {
    setAlertTypes()
    setAllChannels()
  }, [])
  useEffect(() => {
    setAreas()
  }, [selectedCity, setAreas])
  useEffect(() => {
    if ((selectedArea, selectedCity)) {
      setJunctions(selectedCity, selectedArea)
    }
  }, [selectedCity, selectedArea, setJunctions])

  useEffect(() => {
    const fetchChannels = async () => {
      const channelData = await getChannels(
        selectedCity,
        selectedArea,
        selectedJunction
      )
      console.log(channelData?.data?.result)
      setChannelList(channelData?.data?.result)
    }
    if (selectedJunction) {
      fetchChannels()
    }
  }, [selectedArea, selectedCity, selectedJunction])
  useEffect(() => {
    const fetchAnalytics = async () => {
      const analyticsData = await getAllAnalytics()
      setAnalytics(analyticsData)
    }
    fetchAnalytics()
  }, [])
  const acknowledgeValues = [
    { code: -1, value: "All" },
    { code: 0, value: "Unchecked" },
    { code: 1, value: "Valid Event" },
    { code: 2, value: "Spurious" },
    { code: 3, value: "Auto Valid" },
    { code: 4, value: "Auto Spurious" },
  ]
  const priorityValues = [
    { code: -1, value: "All" },
    { code: 0, value: "Critical" },
    { code: 1, value: "Medium" },
    { code: 2, value: "Low" },
  ]
  const objectColorValues = [
    { code: null, value: "All" },
    { code: 0, value: "Undetermined" },
    { code: 1, value: "Black" },
    { code: 2, value: "White" },
    { code: 3, value: "Gray" },
    { code: 4, value: "Red" },
    { code: 5, value: "Yellow" },
    { code: 6, value: "Green" },
    { code: 7, value: "Blue" },
    { code: 8, value: "Orange" },
    { code: 9, value: "Silver" },
    { code: 10, value: "Brown" },
    { code: 99, value: "Not Applicable" },
  ]
  const vehicleClassValues = [
    { code: -1, value: "All" },
    { code: 0, value: "Motorbike" },
    { code: 1, value: "Auto" },
    { code: 2, value: "Car" },
    { code: 3, value: "Carrier" },
    { code: 4, value: "Bus" },
    { code: 5, value: "Lorry" },
    { code: 6, value: "Maxicab" },
    { code: 7, value: "Jeep" },
    { code: 8, value: "Electric Scooter" },
    { code: 9, value: "Electric Car" },
    { code: 99, value: "Undetermined" },
  ]
  const regTypeValues = [
    { code: null, value: "All" },
    { code: 0, value: "Others" },
    { code: 1, value: "Private" },
    { code: 2, value: "Commercial" },
    { code: 3, value: "Army" },
    { code: 4, value: "Electrical" },
  ]
  const handleSearch = async () => {
    setImgArr([])
    let parsedDate = new Date(fromDate)
    let parsedStartTime = parse(startTime, "h:mm:ss aa", new Date())
    let combinedStartTime = set(parsedDate, {
      hours: firstDate.getHours(),
      minutes: firstDate.getMinutes(),
      seconds: firstDate.getSeconds(),
    })
    let startingTime = Math.floor(combinedStartTime.getTime())
    let parsedToDate = new Date(toDate)
    let parsedEndTime = parse(endTime, "h:mm:ss aa", new Date())
    let combinedEndTime = set(parsedToDate, {
      hours: secondDate.getHours(),
      minutes: secondDate.getMinutes(),
      seconds: secondDate.getSeconds(),
    })

    let endingTime = Math.floor(combinedEndTime.getTime())
    setStartingTime(startingTime)
    setEndingTime(endingTime)
    const offset = (currentPage - 1) * 100
    const payload = {
      acknowledge: acknowledgement,
      dontDeleteOnly: onlyDelete,
      channelId: selectedChannel ? selectedChannel : -1,
      endTime: endingTime,
      startingTime: startingTime,
      limit: 100,
      offset: offset,
      priority: priority,
      profileId: 1,
      textFilter: vehicleNo !== "" ? vehicleNo : null,
      objectProperty: color,
      junctionServerId: junctions[0]?.serverid,
      vehicleClass: vehicleClass,
      lpSignature: signature !== null ? signature : -1,
      searchParam: selectedEvents ? selectedEvents : [],
      objectProperty4: speedRange !== "" ? [speedRange] : [],
      objectProperty5: ocr !== "" ? ocr : null,
      objectProperty6: regType,
      objectProperty7: lpQuality,
      objectProperty8: lpStandard,
    }
    const data = await fetchPagination(payload)
    setEventsCount(data?.data?.result[0])
    const data1 = await getEventRecords(payload)
    setEventsData(data1?.data?.result)
    const convertToLp = data1?.data?.result?.map((item) => {
      return item
    })
    function appendSnaps() {
      convertToLp?.map(async (item) => {
        if (trimmedPathname === "quicklpsearch") {
          const payload = {
            filepath: item.snapUrls[0],
            height: 50,
            width: 185,
          }
          const res = await getLpSnap(payload)
          const updatedEvent = {
            ...item,
            snap: "data:image/jpg;base64," + res?.data?.result[0],
          }
          setImgArr((prev) => [...prev, updatedEvent])
        } else {
          const payload = {
            filepath: item.snapUrls[0],
          }
          const res = await getFileContent(payload)
          const updatedEvent = {
            ...item,
            snap: "data:image/png;base64," + res,
          }
          setImgArr((prev) => [...prev, updatedEvent])
        }
      })
    }
    appendSnaps()
    // const resArray = []
    // for (const img of convertToLp) {
    //   const payload = {
    //     filepath: img,
    //     height: 50,
    //     width: 185,
    //   }
    //   if (trimmedPathname === "quicklpsearch") {
    //     const res = await getLpSnap(payload)
    //     // resArray.push("data:image/jpg;base64," + res?.data?.result[0])
    //     setImgArr((prev) => [
    //       ...prev,
    //       "data:image/jpg;base64," + res?.data?.result[0],
    //     ])
    //   } else {
    //     const payload = {
    //       filepath: img,
    //     }
    //     const res = await getFileContent(payload)
    //     // resArray.push("data:image/jpg;base64," + res?.data?.result[0])
    //     setImgArr((prev) => [...prev, "data:image/png;base64," + res])
    //   }
    // }
    // setImgArr(resArray)
  }
  const handleOcr = (val) => {
    if (/^\d*$/.test(val) && val <= 100) {
      setOcr(val)
    }
  }
  const handleSpeedRange = (val) => {
    if (/^\d*$/.test(val) && val <= 100) {
      setSpeedRange(val)
    }
  }
  const handleEventSelection = (val, id) => {
    if (val) {
      setSelectedEvents((prev) => [...prev, id])
    } else {
      setSelectedEvents((prev) => prev.filter((item) => item !== id))
    }
  }
  const handleFirstPage = async () => {
    setCurrentPage(1)
    setImgArr([])
    const payload = {
      acknowledge: acknowledgement,
      dontDeleteOnly: onlyDelete,
      channelId: selectedChannel ? selectedChannel : -1,
      endTime: endingTime,
      startingTime: startingTime,
      limit: 100,
      offset: 0,
      priority: priority,
      profileId: 1,
      textFilter: vehicleNo !== "" ? vehicleNo : null,
      objectProperty: color,
      junctionServerId: junctions[0]?.serverid,
      vehicleClass: vehicleClass,
      lpSignature: signature !== null ? signature : -1,
      searchParam: selectedEvents ? selectedEvents : [],
      objectProperty4: speedRange !== "" ? [speedRange] : [],
      objectProperty5: ocr !== "" ? ocr : null,
      objectProperty6: regType,
      objectProperty7: lpQuality,
      objectProperty8: lpStandard,
    }
    const data1 = await getEventRecords(payload)
    setEventsData(data1?.data?.result)
    const convertToLp = data1?.data?.result?.map((item) => {
      return item
    })
    const appendSnaps = convertToLp?.map(async (item) => {
      if (trimmedPathname === "quicklpsearch") {
        const payload = {
          filepath: item.snapUrls[0],
          height: 50,
          width: 185,
        }
        const res = await getLpSnap(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/jpg;base64," + res?.data?.result[0],
        }
        setImgArr((prev) => [...prev, updatedEvent])
      } else {
        const payload = {
          filepath: item.snapUrls[0],
        }
        const res = await getFileContent(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/png;base64," + res,
        }
        setImgArr((prev) => [...prev, updatedEvent])
      }
    })
    appendSnaps()
  }
  const handlePrevPage = async () => {
    setCurrentPage((prevPage) => prevPage - 1)
    setImgArr([])
    const offset = (currentPage - 2) * 100
    const payload = {
      acknowledge: acknowledgement,
      dontDeleteOnly: onlyDelete,
      channelId: selectedChannel ? selectedChannel : -1,
      endTime: endingTime,
      startingTime: startingTime,
      limit: 100,
      offset: offset,
      priority: priority,
      profileId: 1,
      textFilter: vehicleNo !== "" ? vehicleNo : null,
      objectProperty: color,
      junctionServerId: junctions[0]?.serverid,
      vehicleClass: vehicleClass,
      lpSignature: signature !== null ? signature : -1,
      searchParam: selectedEvents ? selectedEvents : [],
      objectProperty4: speedRange !== "" ? [speedRange] : [],
      objectProperty5: ocr !== "" ? ocr : null,
      objectProperty6: regType,
      objectProperty7: lpQuality,
      objectProperty8: lpStandard,
    }
    const data1 = await getEventRecords(payload)
    setEventsData(data1?.data?.result)
    const convertToLp = data1?.data?.result?.map((item) => {
      return item
    })
    const appendSnaps = convertToLp?.map(async (item) => {
      if (trimmedPathname === "quicklpsearch") {
        const payload = {
          filepath: item.snapUrls[0],
          height: 50,
          width: 185,
        }
        const res = await getLpSnap(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/jpg;base64," + res?.data?.result[0],
        }
        setImgArr((prev) => [...prev, updatedEvent])
      } else {
        const payload = {
          filepath: item.snapUrls[0],
        }
        const res = await getFileContent(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/png;base64," + res,
        }
        setImgArr((prev) => [...prev, updatedEvent])
      }
    })
    appendSnaps()
  }
  const handleNextPage = async () => {
    setCurrentPage((prevPage) => prevPage + 1)
    setImgArr([])
    const offset = currentPage * 100
    const payload = {
      acknowledge: acknowledgement,
      dontDeleteOnly: onlyDelete,
      channelId: selectedChannel ? selectedChannel : -1,
      endTime: endingTime,
      startingTime: startingTime,
      limit: 100,
      offset: offset,
      priority: priority,
      profileId: 1,
      textFilter: vehicleNo !== "" ? vehicleNo : null,
      objectProperty: color,
      junctionServerId: junctions[0]?.serverid,
      vehicleClass: vehicleClass,
      lpSignature: signature !== null ? signature : -1,
      searchParam: selectedEvents ? selectedEvents : [],
      objectProperty4: speedRange !== "" ? [speedRange] : [],
      objectProperty5: ocr !== "" ? ocr : null,
      objectProperty6: regType,
      objectProperty7: lpQuality,
      objectProperty8: lpStandard,
    }
    const data1 = await getEventRecords(payload)
    setEventsData(data1?.data?.result)
    const convertToLp = data1?.data?.result?.map((item) => {
      return item
    })
    const appendSnaps = convertToLp?.map(async (item) => {
      if (trimmedPathname === "quicklpsearch") {
        const payload = {
          filepath: item.snapUrls[0],
          height: 50,
          width: 185,
        }
        const res = await getLpSnap(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/jpg;base64," + res?.data?.result[0],
        }
        setImgArr((prev) => [...prev, updatedEvent])
      } else {
        const payload = {
          filepath: item.snapUrls[0],
        }
        const res = await getFileContent(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/png;base64," + res,
        }
        setImgArr((prev) => [...prev, updatedEvent])
      }
    })
    appendSnaps()
  }
  const handleLastPage = async () => {
    setCurrentPage(totalPages)
    setImgArr([])
    const offset = (totalPages - 1) * 100
    const payload = {
      acknowledge: acknowledgement,
      dontDeleteOnly: onlyDelete,
      channelId: selectedChannel ? selectedChannel : -1,
      endTime: endingTime,
      startingTime: startingTime,
      limit: 100,
      offset: offset,
      priority: priority,
      profileId: 1,
      textFilter: vehicleNo !== "" ? vehicleNo : null,
      objectProperty: color,
      junctionServerId: junctions[0]?.serverid,
      vehicleClass: vehicleClass,
      lpSignature: signature !== null ? signature : -1,
      searchParam: selectedEvents ? selectedEvents : [],
      objectProperty4: speedRange !== "" ? [speedRange] : [],
      objectProperty5: ocr !== "" ? ocr : null,
      objectProperty6: regType,
      objectProperty7: lpQuality,
      objectProperty8: lpStandard,
    }
    const data1 = await getEventRecords(payload)
    setEventsData(data1?.data?.result)
    const convertToLp = data1?.data?.result?.map((item) => {
      return item
    })
    const appendSnaps = convertToLp?.map(async (item) => {
      if (trimmedPathname === "quicklpsearch") {
        const payload = {
          filepath: item.snapUrls[0],
          height: 50,
          width: 185,
        }
        const res = await getLpSnap(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/jpg;base64," + res?.data?.result[0],
        }
        setImgArr((prev) => [...prev, updatedEvent])
      } else {
        const payload = {
          filepath: item.snapUrls[0],
        }
        const res = await getFileContent(payload)
        const updatedEvent = {
          ...item,
          snap: "data:image/png;base64," + res,
        }
        setImgArr((prev) => [...prev, updatedEvent])
      }
    })
    appendSnaps()
  }
  const viewDetails = async (event) => {
    const filteredEvent = imgArr?.find((item) => item.id === event)
    let lane = 1
    let channelId = filteredEvent?.channelId
    const channelResponse = allChannels.length
      ? allChannels
      : await getAllChannels()
    const filteredchannel = channelResponse.filter(
      (obj) => obj.id === channelId
    )
    const channelValue = filteredchannel[0].mediaChannelParam
    if (channelValue !== null) {
      const laneValue = channelValue.laneNumber
      if (laneValue !== null) {
        lane = laneValue
      }
    }
    let eventData = filteredEvent.snapUrls[0]
    let eventobj2 = {
      filepath: eventData,
    }
    const response2 = await getFileContent(eventobj2)
    let base64String2 = "data:image/png;base64," + response2
    setFilteredEventObj({
      ...filteredEvent,
      lane: lane,
      eventSrc: base64String2,
    })
    setShowEventDialog(true)
    setSelectedMsId(filteredEvent?.msId)
  }
  const handleReset = () => {
    setCurrentPage(1)
    setImgArr([])
    setEventsData([])
    setEventsCount(null)
    setSelectedArea(null)
    setSelectedJunction(null)
    setVehicleNo("")
    setSpeedRange("")
    setOnlyDelete(false)
    setAcknowledgement(-1)
    setSelectedChannel(null)
    setPriority(-1)
    setSelectedEvent(null)
    setColor(null)
    setVehicleClass(-1)
    setSignature(-1)
    setRegType(null)
    setLpQuality(null)
    setLpStandard(null)
    setOcr("")
    let today = new Date()
    let yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    setFromDate(yesterday)
    setToDate(today)
    setStartTime("12:00:00 AM")
    setEndTime("11:59:00 PM")
    setFirstDate(new Date(new Date().setHours(0, 0, 0, 0)))
    setSecondDate(new Date(new Date().setHours(23, 59, 59, 59)))
  }
  const convertToAcknowledge = (acknowledge) => {
    switch (acknowledge) {
      case 0:
        return "Unchecked"
      case 1:
        return "Valid Event"
      case 2:
        return "Spurious"
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
  const convertToVehicleType = (type) => {
    switch (type) {
      case 0:
        return "Motorbike"
      case 1:
        return "Auto"
      case 2:
        return "Car"
      case 3:
        return "Carrier"
      case 4:
        return "Bus"
      case 5:
        return "Lorry"
      case 6:
        return "Maxicab"
      case 7:
        return "Jeep"
      case 8:
        return "Electric Scooter"
      case 9:
        return "Electric Car"
      case 99:
        return "Undetermined"
      default:
        return "Others"
    }
  }
  useEffect(() => {
    setVehicleNumber(filteredEventObj?.objectId)
  }, [filteredEventObj])

  const handleVehicleNumberChange = (event) => {
    setVehicleNumber(event.target.value)
  }
  const toggleValidate = () => {
    setValidateIsOpen(!isValidateOpen)
    // setOpen2(true)
  }
  const handleEmailChange = () => {
    setEmailChecked(!emailChecked)
  }

  const handleSmsChange = () => {
    setSmsChecked(!smsChecked)
  }
  const handleOkButtonClick = async () => {
    let triggerSmsEmail = 0
    try {
      if (emailChecked && !smsChecked) {
        triggerSmsEmail = 0
        await setEmailSms(filteredEventObj.id, selectedMsId, 0)
      } else if (!emailChecked && smsChecked) {
        triggerSmsEmail = 1
        await setEmailSms(filteredEventObj.id, selectedMsId, 1)
      } else if (emailChecked && smsChecked) {
        await setEmailSms(filteredEventObj.id, selectedMsId, 0)
        await setEmailSms(filteredEventObj.id, selectedMsId, 1)
      }

      setEmailChecked(false)
      setSmsChecked(false)

      toast({
        variant: "success",
        description: "Notification sent successfully!",
        duration: 3000,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to send notification!",
        duration: 3000,
      })
    }
  }

  return (
    <>
      <div className=" flex max-h-[15em] flex-row flex-wrap gap-8 overflow-y-auto border border-black p-4 px-7">
        {imgArr?.length > 0 ? (
          imgArr.map((img, index) => {
            return (
              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-1"
                onClick={() => viewDetails(img.id)}
              >
                <Image
                  src={img.snap}
                  key={index}
                  alt="lpimage"
                  width={185}
                  height={50}
                  loading="lazy"
                  className="max-h-[50px]"
                />
                <span>{new Date(img.startTime).toLocaleString("en-GB")}</span>
              </div>
            )
          })
        ) : (
          <span className="ml-[45%] flex flex-row items-center justify-center">
            Please Select the Filters...
          </span>
        )}
      </div>
      {imgArr?.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-[2em]"
          style={{ marginTop: "1em" }}
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
      )}
      <section className="mt-4 flex flex-col gap-2">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col gap-4">
            <p className="0F0F10 font-semibold">Location</p>
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Area</p>
                <Select
                  value={selectedArea}
                  onValueChange={(e) => setSelectedArea(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="max-h-36 overflow-y-scroll">
                    {areas?.map((area, index) => (
                      <SelectItem key={index} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Junction</p>
                <Select
                  value={selectedJunction}
                  onValueChange={(e) => setSelectedJunction(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select Junction" />
                  </SelectTrigger>
                  <SelectContent className="max-h-36 overflow-y-scroll">
                    {junctions?.map((junction, index) => (
                      <SelectItem key={index} value={junction.id}>
                        {junction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Camera</p>
                <Select
                  value={selectedChannel}
                  onValueChange={(e) => setSelectedChannel(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent className="max-h-36 overflow-y-scroll">
                    {channelList?.map((channel, index) => (
                      <SelectItem key={index} value={channel.id}>
                        {channel.ip}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="0F0F10 font-semibold">Date & Time</p>
            <div className="flex flex-row items-center gap-6">
              <div className="flex flex-col items-start gap-2">
                <p className="rounded-sm font-normal text-[#999999]">From</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[154px] justify-start rounded-sm text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? (
                        format(fromDate, "PPP")
                      ) : (
                        <p className="rounded-sm">Pick a date</p>
                      )}

                      {/* {fromDate ? (
                 toDate ? (
                   <>
                     {format(fromDate, "LLL dd, y")} -{" "}
                     {format(toDate, "LLL dd, y")}
                   </>
                 ) : (
                   format(fromDate, "LLL dd, y")
                 )
               ) : (
                 <span>Pick a date</span>
               )} */}
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
              <div className="relative top-2 flex flex-col items-start gap-2">
                <p className="rounded-sm font-normal text-[#999999]">
                  StartTime
                </p>
                {/* <TimePicker
                  value={startTime}
                  onChange={(val) => setStartTime(val)}
                /> */}
                <TimePickerDemo date={firstDate} setDate={setFirstDate} />
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">To</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start rounded-sm text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? (
                        format(toDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
              <div className="relative top-2 flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">EndTime</p>
                {/* <TimePicker
                  value={endTime}
                  onChange={(val) => setEndTime(val)}
                /> */}
                <TimePickerDemo date={secondDate} setDate={setSecondDate} />
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col items-start gap-4">
            <p className="0F0F10 font-semibold">Event</p>
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-col items-start gap-2">
                <span>Event</span>
                <Select
                  value={selectedEvent}
                  onValueChange={(e) => setSelectedEvent(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {analytics?.map((item, index) => (
                        <div className="flex items-center " id={item.alerttype}>
                          <Checkbox
                            checked={selectedEvents.includes(item.alerttype)}
                            onCheckedChange={(e) => {
                              handleEventSelection(e, item.alerttype)
                            }}
                          />
                          <SelectItem key={index} value={item.alerttype}>
                            {item.alertname}
                          </SelectItem>
                        </div>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Priority</p>
                <Select value={priority} onValueChange={(e) => setPriority(e)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityValues.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="0F0F10 font-semibold">Vehicle</p>
            <div className="flex flex-row items-end gap-8 ">
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Object Color</p>
                <Select value={color} onValueChange={(e) => setColor(e)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectColorValues.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Vehicle No</p>
                <Input
                  className="h-[40px] w-[130px]"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Vehicle Class</p>
                <Select
                  value={vehicleClass}
                  onValueChange={(e) => setVehicleClass(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleClassValues.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Reg Type</p>
                <Select value={regType} onValueChange={(e) => setRegType(e)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {regTypeValues.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Speed Range</p>
                <Input
                  className="h-[40px] w-[130px]"
                  value={speedRange}
                  onChange={(e) => handleSpeedRange(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-normal text-[#999999]">Signature</p>
                <Select
                  value={signature}
                  onValueChange={(e) => setSignature(e)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={-1}>All</SelectItem>
                    <SelectItem value="0">Matched</SelectItem>
                    <SelectItem value="1">Mismatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-col items-start gap-2">
            <p className="font-normal text-[#999999]">Acknowledgement</p>
            <Select
              value={acknowledgement}
              onValueChange={(e) => setAcknowledgement(e)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {acknowledgeValues.map((item, index) => (
                  <SelectItem key={index} value={item.code}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="font-normal text-[#999999]">Vehicle LP Quality</p>
            <Select value={lpQuality} onValueChange={(e) => setLpQuality(e)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All</SelectItem>
                <SelectItem value={1}>Good</SelectItem>
                <SelectItem value={2}>Bad</SelectItem>
                <SelectItem value={3}>Blank</SelectItem>
                <SelectItem value={4}>Covered</SelectItem>
                <SelectItem value={5}>Noise</SelectItem>
                <SelectItem value={0}>Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="font-normal text-[#999999]">Vehicle LP Standard</p>
            <Select value={lpStandard} onValueChange={(e) => setLpStandard(e)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All</SelectItem>
                <SelectItem value={1}>HSRP</SelectItem>
                <SelectItem value={2}>NON-HSRP</SelectItem>
                <SelectItem value={0}>Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="font-normal text-[#999999]">Confidence</p>
            <Input
              type="range"
              min="0"
              max="100"
              step="1"
              value={ocr}
              onChange={(e) => handleOcr(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Input
              name=""
              placeholder=""
              className="h-10 w-24 "
              value={ocr !== null ? `${ocr} %` : ""}
              onChange={(e) => handleOcr(e.target.value)}
            />
          </div>
          <div className="flex w-[180px] flex-row items-center gap-2">
            <Checkbox
              checked={onlyDelete}
              onCheckedChange={(e) => setOnlyDelete(e)}
            />
            <span>Do Not Delete Only</span>
          </div>
          <div className="flex flex-row items-center justify-start gap-8 ">
            <Button
              className="rounded border-[#2A94E5] text-[#2A94E5]"
              variant="outline"
              onClick={handleReset}
            >
              Cancel
            </Button>
            <Button onClick={handleSearch}>Apply</Button>
          </div>
        </div>
      </section>
      <Dialog
        open={showEventDialog}
        onOpenChange={() => setShowEventDialog(!showEventDialog)}
      >
        <DialogContent className="max-h-fit w-[900px] gap-2 pb-0 lg:max-w-screen-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Event Viewer
            </DialogTitle>
          </DialogHeader>
          <div id="event-viewer-popup">
            <div className="flex items-center justify-between">
              <div className="flex w-[550px] items-center justify-between">
                <div className="flex gap-2 text-sm font-medium text-[#3F3F40]">
                  <span>
                    {convertToViolationType(filteredEventObj?.eventType)}
                  </span>
                  <span>|</span>
                  <span>
                    {convertToVehicleType(filteredEventObj?.objectProperty2)}
                  </span>
                  <span>|</span>
                  <span dir={isRTL(filteredEventObj?.objectId) ? "rtl" : "ltr"}>
                    {filteredEventObj?.objectId}
                  </span>
                </div>
              </div>

              <div className="flex w-[166px] gap-2 rounded-md bg-[#F3F3F3] p-2 text-sm text-[#333333]">
                <span className="font-normal">Status: </span>
                <span className="font-bold">
                  {convertToAcknowledge(filteredEventObj?.acknowledge)}
                </span>
                {!uncheckedUpdated ? (
                  <Image
                    src="/images/Group 1000002710.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="pr-1"
                  />
                ) : (
                  <Image
                    src="/vectors/Group 1000002709.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="pr-1"
                  />
                )}
              </div>
            </div>
            <div className="flex max-h-fit gap-2 ">
              <AspectRatio
                ratio={16 / 4}
                className="relative w-[532px] overflow-hidden rounded bg-muted"
              >
                {filteredEventObj?.eventSrc ? (
                  <ImageWithMagnifier
                    src={filteredEventObj?.eventSrc}
                    alt="event snap"
                  />
                ) : (
                  <div className="flex h-full w-full shrink-0 items-center justify-center bg-[#000]">
                    <Image
                      src="/vectors/camera2.svg"
                      width="30"
                      height="30"
                      alt="event snap"
                    />
                  </div>
                )}
              </AspectRatio>
              <div className="justify-top mt-1 flex flex-col">
                <div className="flex flex-col items-center gap-1 bg-[#fff]">
                  <Image
                    src={filteredEventObj?.snap}
                    alt="lpImage"
                    width={160}
                    height={150}
                    className="rounded-sm"
                  />
                  <span className="text-sm font-normal text-[#666666]">
                    License plate
                  </span>
                  <div className="flex items-center justify-start">
                    <Input
                      placeholder="Search Vehicle No"
                      value={vehicleNumber}
                      onChange={handleVehicleNumberChange}
                      className="h-6 border-none text-xs font-bold text-[#333333]"
                    />
                    <Image
                      src="/vectors/icon-edit-2.svg"
                      alt="edit"
                      width={13}
                      height={24}
                      className="mt-1"
                    />
                  </div>
                  <VehicleTypeView
                    onRequestClose={toggleValidate}
                    props={filteredEventObj}
                  />
                  <span className="pt-2 text-sm font-normal text-[#666666]">
                    Severity
                  </span>
                  <p className="px-1 text-xs font-semibold text-[#D94545]">
                    {severity[filteredEventObj?.priority]}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-30 mt-2">
              <Table className="border-collapse text-[#333] ">
                <TableRow>
                  <TableCell className="p-2">
                    <span className=" text-xs font-normal">Location</span>
                    <p className="text-xs font-semibold">
                      {filteredEventObj?.junctionName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Junction
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {filteredEventObj?.junctionName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Camera
                    </span>
                    <p className="mt-1 text-xs font-semibold text-[#333]">
                      {filteredEventObj?.cameraName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Lane
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {filteredEventObj?.lane}
                    </p>
                  </TableCell>
                  <TableCell colSpan="2" className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Capture Time
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {new Date(filteredEventObj?.endTime).toLocaleString(
                        "en-GB"
                      )}
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Vehicle Type
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {convertToVehicleType(filteredEventObj?.objectProperty2)}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Speed
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {filteredEventObj?.objectProperty4}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Color
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {vehicleColor[filteredEventObj?.objectProperty1]}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Message
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {filteredEventObj?.action}-
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-normal text-[#333]">
                      Action
                    </span>
                    <p className="text-xs font-semibold text-[#333]">
                      {filteredEventObj?.action}-
                    </p>
                  </TableCell>
                </TableRow>
              </Table>
            </div>
            <div className="flex flex-row gap-10">
              <ValidateView
                onRequestClose={toggleValidate}
                props={filteredEventObj}
                setUncheckedUpdated={setUncheckedUpdated}
              />
              <div>
                <Button
                  variant="outline"
                  className="my-1 rounded-sm border-[#2A94E5] font-semibold text-[#2A94E5]"
                  // disabled={filteredEventObj?.snapUrls?.length < 2}
                  onClick={() => setOpenEvidenceSnap(true)}
                >
                  Evidence
                </Button>
                <div className="mt-2">
                  <span className="items-center text-sm font-semibold leading-6 text-[#000]">
                    Inform through
                  </span>
                  <div className="justify-between">
                    <p className="flex items-center gap-1 text-xs font-normal leading-6	text-[#333333]">
                      <input
                        type="checkbox"
                        checked={emailChecked}
                        onChange={handleEmailChange}
                        className="mr-1"
                      />
                      Email
                    </p>
                    <p className="flex items-center gap-1 text-xs font-normal leading-6 text-[#333333]	">
                      <input
                        type="checkbox"
                        checked={smsChecked}
                        onChange={handleSmsChange}
                        className="mr-1"
                      />
                      SMS
                    </p>
                    <Button
                      onClick={handleOkButtonClick}
                      disabled={!emailChecked && !smsChecked}
                      className="mt-2 h-2 rounded-sm py-3"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-3"></div>
        </DialogContent>
      </Dialog>
      <Dialog open={openEvidenceSnap} onOpenChange={setOpenEvidenceSnap}>
        <DialogContent
          className={"max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"}
        >
          <DialogHeader>
            <DialogTitle>Evidence Snap</DialogTitle>
          </DialogHeader>
          <div className="h-[550px]">
            <AspectRatio ratio={16 / 9}>
              <ImageWithMagnifier src={filteredEventObj?.eventSrc} />
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default QuickSearch
