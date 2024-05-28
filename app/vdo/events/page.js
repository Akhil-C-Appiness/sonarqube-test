"use client"

import React, { use, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useStore from "@/store/store"
import { Client } from "@stomp/stompjs"
import * as FileSaver from "file-saver"
import html2canvas from "html2canvas"
import SockJS from "sockjs-client"
import * as XLSX from "xlsx"
import isRTL from '@/lib/isRTL'


import {
  deleteEventAudio,
  deleteEventColor,
  getAllAnalytics,
  getAllChannels,
  getEventAudio,
  getEventColor,
  getFileContent,
  getHotlistedEvent,
  getViolationString,
  saveEventAudio,
  saveEventColor,
  updateEventAudio,
  updateEventColor,
} from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventsDetails from "@/components/event-details"
import EventDetailsPopup from "@/components/event-details-popup"
import EventViewerPopup from "@/components/event-viewer-popup"
import Filteroptions from "@/components/filteroptions"
import RecentFilteroptions from "@/components/filteroptions-recent"
import HotlistedEvents from "@/components/hotlisted-events"
import NewEvents from "@/components/new-events"

const Events = () => {
  const router = useRouter()
  const targetRef = useRef(null)
  const [selectedNumber, setSelectedNumber] = useState("-4")
  let [pause, setPause] = useState(true)
  let [snapArray, setSnapArray] = useState([])
  let [colorfilterValues, setcolorfilterValues] = useState([])
  let [regTypeValues, setregTypeValues] = useState([])
  let [violationTypeValues, setviolationTypeValues] = useState([])
  //
  let [recentcolorfilterValues, setrecentcolorfilterValues] = useState([])
  let [recentregTypeValues, setrecentregTypeValues] = useState([])
  let [recentviolationTypeValues, setrecentviolationTypeValues] = useState([])
  //
  let [hotlistedevents, sethotlistedevents] = useState([])
  let [recentevents, setrecentevents] = useState([])
  let [lastElement, setlastElement] = useState({})
  let [selectedElement, setselectedElement] = useState({})
  let [lastHotlistedElement, setlastHotlistedElement] = useState({})
  const [eventColorDialog, setEventColorDialog] = useState(false)
  const [eventAudioDialog, setEventAudioDialog] = useState(false)
  const [analytics3, setAnalytics3] = useState([])
  const [analytic, setAnalytic] = useState("")
  const [analyticAudio, setAnalyticAudio] = useState("")
  const [priorityVal, setPriorityVal] = useState("")
  const [priorityValAudio, setPriorityValAudio] = useState("")
  const [color, setColor] = useState("#ffffff")
  const [savedAudio, setSavedAudio] = useState(null)
  const [savedColors, setSavedColors] = useState([])
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [selectedAnalyticType, setSelectedAnayticType] = useState("")
  const [selectedAnalyticTypeAudio, setSelectedAnayticTypeAudio] = useState("")
  const [selectedColor, setSelectedColor] = useState("#ffffff")
  const [selectedColorAudio, setSelectedColorAudio] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [number, setNumber] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const handleInput = (data) => {
    const filteredData = data.map(({ snapurlArry, eventsrc, ...rest }) => {
      return { ...rest }
    })
    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    const excelBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const ppo = new Blob([excelBlob], {
      type: "xlsx",
    })
    FileSaver.saveAs(ppo, "data.xlsx")
    setNumber(1)
    setOpenDialog(false)
  }
  const handleScreenshot = async () => {
    html2canvas(targetRef.current).then((canvas) => {
      const screenshotDataUrl = canvas.toDataURL("image/png")
      downloadScreenshot(screenshotDataUrl)
    })
  }
  const downloadScreenshot = (dataUrl) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "screenshot.png"
    a.click()
  }
  const {
    setAlertTypes,
    setAllChannels,
    allChannels,
    alertTypes,
    setShowEventDetails,
    updateEventDetails,
  } = useStore()

  useEffect(() => {
    setAlertTypes()
    setAllChannels()
  }, [])
  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await getAllAnalytics()
      const res2 = await getEventColor()
      setSavedColors(res2.data.result)
      setAnalytics3(res)
    }
    fetchAnalytics()
  }, [eventColorDialog])
  useEffect(() => {
    const fetchEventAudio = async () => {
      const res = await getEventAudio()
      setSavedAudio(res.data.result)
    }
    fetchEventAudio()
  }, [])
  let mergedArray = []
  let filteredArray = []
  let regfilteredArray = []
  let violationfilteredArray = []
  //
  let recentmergedArray = []
  let recentfilteredArray = []
  let recentregfilteredArray = []
  let recentviolationfilteredArray = []
  //
  let hotlistedid = []
  let lastFourElements
  let recentEventsArray
  if (colorfilterValues.length > 0) {
    filteredArray = snapArray.filter((obj) =>
      colorfilterValues.includes(obj.color)
    )
  }
  if (regTypeValues.length > 0) {
    regfilteredArray = snapArray.filter((obj) =>
      regTypeValues.includes(obj.registrationType)
    )
  }
  if (violationTypeValues.length > 0) {
    violationfilteredArray = snapArray.filter((obj) =>
      violationTypeValues.includes(obj.violationType)
    )
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
      ...violationfilteredArray.filter(
        (obj2) => !filteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    lastFourElements = mergedArray.slice(selectedNumber)
    //   recentEventsArray = mergedArray.slice(-10);
  } else {
    lastFourElements = snapArray.slice(selectedNumber)
    // recentEventsArray = snapArray.slice(-10);
  }
  ////////
  if (recentcolorfilterValues.length > 0) {
    recentfilteredArray = recentevents.filter((obj) =>
      recentcolorfilterValues.includes(obj.color)
    )
  }
  if (recentregTypeValues.length > 0) {
    recentregfilteredArray = recentevents.filter((obj) =>
      recentregTypeValues.includes(obj.registrationType)
    )
  }
  if (recentviolationTypeValues.length > 0) {
    recentviolationfilteredArray = recentevents.filter((obj) =>
      recentviolationTypeValues.includes(obj.violationType)
    )
  }
  if (
    recentcolorfilterValues.length > 0 ||
    recentregTypeValues.length > 0 ||
    recentviolationTypeValues.length > 0
  ) {
    recentmergedArray = [
      ...recentfilteredArray,
      ...recentregfilteredArray.filter(
        (obj2) => !recentfilteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    recentmergedArray = [
      ...recentmergedArray,
      ...recentviolationfilteredArray.filter(
        (obj2) => !recentfilteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    //   lastFourElements = recentmergedArray.slice(selectedNumber);
    recentEventsArray = recentmergedArray.slice(-10)
  } else {
    // lastFourElements = snapArray.slice(selectedNumber);
    recentEventsArray = recentevents.slice(-10)
  }
  /////////
  // recentEventsArray = snapArray.slice(-10);
  const severity = ["Critical", "Medium", "Low"]
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
  const submitFilter = (event, option) => {
    if (event) {
      setcolorfilterValues([...colorfilterValues, option])
    } else {
      setcolorfilterValues(colorfilterValues.filter((val) => val !== option))
    }
  }
  const submitregFilter = (event, option) => {
    if (event) {
      setregTypeValues([...regTypeValues, option])
    } else {
      setregTypeValues(regTypeValues.filter((val) => val !== option))
    }
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
  //
  const submitrecentFilter = (event, option) => {
    if (event) {
      setrecentcolorfilterValues([...recentcolorfilterValues, option])
    } else {
      setrecentcolorfilterValues(
        recentcolorfilterValues.filter((val) => val !== option)
      )
    }
  }
  const submitrecentregFilter = (event, option) => {
    if (event) {
      setrecentregTypeValues([...recentregTypeValues, option])
    } else {
      setrecentregTypeValues(
        recentregTypeValues.filter((val) => val !== option)
      )
    }
  }
  const submitrecentViolationFilter = (event, option) => {
    if (event) {
      setrecentviolationTypeValues([...recentviolationTypeValues, option])
    } else {
      setrecentviolationTypeValues(
        recentviolationTypeValues.filter((val) => val !== option)
      )
    }
  }
  //
  const clearAll = () => {
    setcolorfilterValues([])
    setregTypeValues([])
    setviolationTypeValues([])
  }
  const recentclearAll = () => {
    setrecentcolorfilterValues([])
    setrecentregTypeValues([])
    setrecentregTypeValues([])
  }
  function addImage(imgsrc) {
    setSnapArray((prevArray) => [...prevArray, imgsrc])
    setrecentevents((prevArray) => [...prevArray, imgsrc])
    setlastElement(imgsrc)
  }
  function addhotlistedImage(eventobj) {
    sethotlistedevents((prevArray) => [...prevArray, eventobj])
    setlastHotlistedElement(eventobj)
  }
  function handleRecentEvent(data) {
    let lastElementitem = snapArray.find((element) => {
      return element.id == data
    })
    setlastElement(lastElementitem)
  }
  function viewDetails(data) {
    let selectedElement = snapArray.find((element) => {
      return element.id == data
    })
    setselectedElement(selectedElement)
    setOpen(true)
  }
  // const viewDetails = async (eventDetails)=>{
  //   console.log(eventDetails)
  //   setShowEventDetails(true)
  //   updateEventDetails(eventDetails)
  // }
  function viewEventDetails(data) {
    let selectedElement = snapArray.find((element) => {
      return element.id == data
    })
    setselectedElement(selectedElement)
    setOpen2(true)
  }
  function downloadSnap(data) {
    let selectedSnapobj = snapArray.find((element) => {
      return element.id == data
    })
    let snapsrc = selectedSnapobj.eventsrc
    const link = document.createElement("a")
    link.href = snapsrc // Replace with the actual path to your image
    link.download = `${data}.jpg` // Replace with the desired filename for the downloaded image
    link.click()
  }
  const pauseEvent = () => {
    setPause(!pause)
  }
  const clearAllEvents = () => {
    setSnapArray([])
  }
  useEffect(() => {
    const getHotlisted = async () => {
      hotlistedid = await getHotlistedEvent()
    }
    getHotlisted()
  }, [])
  useEffect(() => {
    let isloggedin = localStorage.getItem("isloggedin")
    let userName
    let JSESSIONID
    if (isloggedin) {
      let userInfo = JSON.parse(localStorage.getItem("user-info"))
      userName = userInfo.id
      JSESSIONID = localStorage.getItem("JSESSIONID")
    } else {
      router.push("/login")
    }
    const client = new Client({
      webSocketFactory: () => new SockJS("/v-notificationserver/notification"),
      connectHeaders: {
        login: userName,
        JSESSIONID: JSESSIONID,
        // passcode: password,
      },
      debug: function (str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    client.heartbeatIncoming = 10000
    client.heartbeatOutgoing = 10000

    client.onConnect = function (frame) {
      //   console.log('Connected: ' + frame);
      if (pause) {
        client.subscribe("/authentication/admin", (message) => {
          console.log(JSON.parse(message.body))
        })
        client.subscribe("/event", async function (message) {
          let receivedData = JSON.parse(message.body)
          console.log("receivedData", receivedData.result[0])
          let eventId = receivedData.result[0].id
          let vehicleNo = receivedData.result[0].objectId
          let cameraName = receivedData.result[0].cameraName
          let junctionName = receivedData.result[0].junctionName
          let eventMessage = receivedData.result[0].message
          let severityval = severity[receivedData.result[0].priority]
          let violationType =
            alertTypes.find(
              (alert) => alert.alerttype == receivedData.result[0].eventType
            )?.alertname || ""
          // await getViolationString(
          //   receivedData.result[0].eventType
          // )
          let objectProperty6 = receivedData.result[0].objectProperty6
          let registrationType = regType[objectProperty6]
          let speed = receivedData.result[0].objectProperty4
          let color = vehicleColor[receivedData.result[0].objectProperty1]
          let vehicleclass =
            vehicleClass[receivedData.result[0].objectProperty2]
          let speedLimit = receivedData.result[0].objectProperty3
          let channelId = receivedData.result[0].channelId
          let datetime = receivedData.result[0].startTime
          datetime = new Date(datetime).toLocaleString()
          let datetimeArray = datetime.split(",")
          let date = datetimeArray[0]
          let time = datetimeArray[1]

          let enddatetime = receivedData.result[0].endTime
          enddatetime = new Date(enddatetime).toLocaleString()
          let enddatetimeArray = enddatetime.split(",")
          let enddate = enddatetimeArray[0]
          let endtime = enddatetimeArray[1]

          let eventData = receivedData.result[0].snapUrls[0]
          let eventDataArray = receivedData.result[0].snapUrls
          let snapurlArry = []

          let eventobj = {
            filepath: eventData,
          }
          const response = await getFileContent(eventobj)

          eventDataArray.map(async (item) => {
            let eventobj2 = {
              filepath: item,
            }
            let response2 = await getFileContent(eventobj2)
            let base64String2 = "data:image/png;base64," + response2
            snapurlArry.push(base64String2)
            // console.log("snapurlArry",snapurlArry)
          })

          // console.log("Response",response);

          const channelResponse = allChannels.length
            ? allChannels
            : await getAllChannels()
          let lane = 1
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
          if (response) {
            // console.log("Response1",response);

            // console.log("test", eventobj)
            var base64String = "data:image/png;base64," + response
            var eventObj = {
              id: eventId,
              vehicleNo: vehicleNo,
              cameraName: cameraName,
              junctionName: junctionName,
              eventMessage: eventMessage,
              violationType: violationType,
              severity: severityval,
              registrationType: registrationType,
              speed: speed,
              speedLimit: speedLimit,
              color: color,
              vehicleclass: vehicleclass,
              lane: lane,
              date: date,
              time: time,
              enddate: enddate,
              endtime: endtime,
              eventsrc: base64String,
              snapurlArry: snapurlArry,
              channelId: channelId,
            }
            // console.log("test2--", eventObj)

            addImage(eventObj)
          }
        })
        hotlistedid.map((item) => {
          // console.log("item",item);
          // item = 207;
          let subString = "/event/" + item
          client.subscribe(subString, async function (message) {
            let receivedData = JSON.parse(message.body)
            // console.log("Hotlisted - "+subString+"  -",receivedData);
            let eventId = receivedData.result[0].id
            let vehicleNo = receivedData.result[0].objectId
            let cameraName = receivedData.result[0].cameraName
            let junctionName = receivedData.result[0].junctionName
            let eventMessage = receivedData.result[0].message
            let severityval = severity[receivedData.result[0].priority]
            let violationType = await getViolationString(
              receivedData.result[0].eventType
            )
            let objectProperty6 = receivedData.result[0].objectProperty6
            let registrationType = regType[objectProperty6]
            let speed = receivedData.result[0].objectProperty4
            let color = vehicleColor[receivedData.result[0].objectProperty1]
            let vehicleclass =
              vehicleClass[receivedData.result[0].objectProperty2]
            let speedLimit = receivedData.result[0].objectProperty3
            let channelId = receivedData.result[0].channelId
            let datetime = receivedData.result[0].startTime
            datetime = new Date(datetime).toLocaleString()
            let datetimeArray = datetime.split(",")
            let date = datetimeArray[0]
            let time = datetimeArray[1]
            let eventData = receivedData.result[0].snapUrls[0]
            let eventDataArray = receivedData.result[0].snapUrls
            let snapurlArry = []
            let eventobj = {
              filepath: eventData,
            }
            const response = await getFileContent(eventobj)
            eventDataArray.map(async (item) => {
              let eventobj2 = {
                filepath: item,
              }
              let response2 = await getFileContent(eventobj2)
              let base64String2 = "data:image/png;base64," + response2
              snapurlArry.push(base64String2)
              // console.log("snapurlArry",snapurlArry)
            })
            const channelResponse = await getAllChannels()
            let lane = 1
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
            if (response) {
              var base64String = "data:image/png;base64," + response
              var eventObj = {
                id: eventId,
                vehicleNo: vehicleNo,
                cameraName: cameraName,
                junctionName: junctionName,
                eventMessage: eventMessage,
                violationType: violationType,
                severity: severityval,
                registrationType: registrationType,
                speed: speed,
                speedLimit: speedLimit,
                color: color,
                vehicleclass: vehicleclass,
                lane: lane,
                date: date,
                time: time,
                eventsrc: base64String,
                snapurlArry: snapurlArry,
                channelId: channelId,
              }
              addhotlistedImage(eventObj)
            }
          })
        })
      }
    }
    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"])
      console.log("Additional details: " + frame.body)
    }
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [pause, getAllChannels])
  // console.log(snapArray)
  const handleEventColor = async () => {
    const appId = analytics3.find(
      (item) => item.alertname === analytic
    ).alerttype
    const payload = {
      applicationId: appId,
      color: color,
    }
    if (selectedColor === "#ffffff") {
      await saveEventColor(payload)
    } else {
      await updateEventColor(payload)
    }
    setColor("#ffffff")
    setPriorityVal("")
    setAnalytic("")
    setSelectedColor("#ffffff")
    setEventColorDialog(false)
  }
  useEffect(() => {
    if (analytic !== "") {
      const selectedAnalyticType = analytics3.find(
        (obj) => obj.alertname === analytic
      ).alerttype
      const selectedColor = savedColors.find(
        (obj) => obj.applicationId === selectedAnalyticType
      )?.color
      setSelectedAnayticType(selectedAnalyticType)
      selectedColor === undefined
        ? setSelectedColor("#ffffff")
        : setSelectedColor(selectedColor)
    }
  }, [analytic, analytics3, savedColors])

  useEffect(() => {
    if (analyticAudio !== "") {
      const selectedAnalyticType = analytics3.find(
        (obj) => obj.alertname === analyticAudio
      ).alerttype
      const selectedAudio = savedAudio.find(
        (obj) => obj.applicationId === selectedAnalyticType
      )?.audioUrl
      setSelectedAnayticTypeAudio(selectedAnalyticType)
      selectedAudio === undefined
        ? setSelectedColorAudio("")
        : setSelectedColorAudio(selectedAudio)
    }
  }, [analyticAudio, analytics3, savedAudio])

  const handleRemoveColor = () => {
    const appId = analytics3.find(
      (item) => item.alertname === analytic
    ).alerttype
    deleteEventColor(appId)
    setPriorityVal("")
    setAnalytic("")
    setSelectedColor("#ffffff")
    setEventColorDialog(false)
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    console.log(file, "file")
    // const formData = new FormData()
    // formData.append("applicationId", appId)
    // formData.append("audio", file)
    // formData.append("filename", file.name)
    // formData.append("priority", priorityValAudio)

    setSelectedFile(file)
  }
  const handleEventAudio = async () => {
    const appId = analytics3.find(
      (item) => item.alertname === analyticAudio
    ).alerttype
    const formData = new FormData()
    formData.append("applicationId", appId)
    formData.append("audiofile", selectedFile)
    formData.append("filename", selectedFile.name)
    formData.append("priority", priorityValAudio)
    if (selectedColorAudio === "") {
      await saveEventAudio(formData)
    } else {
      await updateEventAudio(formData)
    }

    setPriorityValAudio("")
    setAnalyticAudio("")
    setSelectedFile(null)
    setEventAudioDialog(false)
  }
  const handleRemoveAudio = () => {
    const appId = analytics3.find(
      (item) => item.alertname === analyticAudio
    ).alerttype
    deleteEventAudio(appId)
    setPriorityValAudio("")
    setAnalyticAudio("")
    setSelectedColorAudio("")
    setEventAudioDialog(false)
  }
  return (
    <>
      <Popover>
        <PopoverTrigger className="relative left-[97%] top-[-3%] cursor-pointer">
          <Image
            src="/vectors/message-menu.svg"
            width={24}
            height={24}
            alt="Kebab"
          />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4">
          <div
            className="flex w-full cursor-pointer flex-row items-center justify-start gap-2"
            onClick={() => setOpenDialog(true)}
          >
            <Image
              alt="export-report"
              src="/vectors/exportReport.svg"
              width={24}
              height={24}
            />
            <span className="text-[#6F6F70]">Export Report</span>
          </div>
          {/* <div className="flex w-full cursor-pointer flex-row items-center justify-start gap-2">
            <Image
              alt="snapshot"
              src="/vectors/snapshot.svg"
              width={24}
              height={24}
            />
            <span className="text-[#6F6F70]">Snapshot</span>
          </div> */}
        </PopoverContent>
      </Popover>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-6">
                <span className="mt-[1em]">Select Number</span>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-24 py-2"
                />
                <Button
                  onClick={() => {
                    handleInput(snapArray)
                  }}
                >
                  Export
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Tabs defaultValue="live" className="my-8">
        <TabsList>
          <TabsTrigger value="live" className="text-[14px]">
            Live Events
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-[14px]">
            Recent Events ({recentEventsArray.length})
          </TabsTrigger>
          <TabsTrigger value="hotlisted" className="text-[14px]">
            Hotlisted Events ({hotlistedevents.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live">
          <div className="flex h-20 items-center justify-between">
            <Popover>
              <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
                Menu Options{" "}
                <Image
                  alt="Down"
                  src="/vectors/Down.svg"
                  width={24}
                  height={24}
                />
              </PopoverTrigger>
              <PopoverContent className="p-1">
                <Button
                  variant="ghost"
                  className="flex w-full flex-row items-center justify-start gap-2"
                  onClick={clearAllEvents}
                >
                  <Image
                    alt="icon"
                    src="/vectors/Clear.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#6F6F70]">Clear</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full flex-row items-center justify-start gap-2"
                  onClick={() => setEventColorDialog(true)}
                >
                  <Image
                    alt="replay-icon"
                    src="/vectors/SetEventColors.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#6F6F70]">Set Event Colour</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full flex-row items-center justify-start gap-2"
                  onClick={() => setEventAudioDialog(true)}
                >
                  <Image
                    alt="replay-icon"
                    src="/vectors/mic.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#6F6F70]">Set Event Audio</span>
                </Button>
              </PopoverContent>
            </Popover>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="flex flex-row items-center gap-2"
              >
                <Image
                  alt="Audio"
                  src="/vectors/mute.svg"
                  width={24}
                  height={24}
                />
                Audio
              </Button>
              {pause ? (
                <Button
                  variant="outline"
                  className="flex flex-row items-center gap-2"
                  onClick={pauseEvent}
                >
                  <Image
                    alt="Pause"
                    src="/vectors/pause.svg"
                    width={24}
                    height={24}
                  />
                  Pause Events
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex flex-row items-center gap-2"
                  onClick={pauseEvent}
                >
                  <Image
                    alt="Pause"
                    src="/vectors/playEvents.svg"
                    width={24}
                    height={24}
                  />
                  Play Events
                </Button>
              )}
              <Filteroptions
                onCheckboxChange={submitFilter}
                colorfilterValues={colorfilterValues}
                regTypeValues={regTypeValues}
                onChangereg={submitregFilter}
                onChangeviolation={submitViolationFilter}
                violationTypeValues={violationTypeValues}
                clearAll={clearAll}
              />
              <Select onValueChange={setSelectedNumber}>
                <SelectTrigger className="h-11 w-[110px]">
                  <SelectValue placeholder="4 Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-[#6F6F70]">1 Event</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="-2">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-[#6F6F70]">2 Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="-4">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-[#6F6F70]">4 Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="-8">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-[#6F6F70]">8 Events</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div
            className={`mx-auto grid min-h-[700px] w-full grid-cols-2 gap-4`}
          >
            {lastFourElements.map((eventImgObj, index) => (
              <div className="flex h-[340px] w-full flex-col items-start border p-0">
                <div className="flex h-[40px] w-full flex-row items-center justify-between p-[14px]">
                  <div className="flex flex-row gap-2">
                    <Image
                      alt="icon"
                      src="/vectors/camera.svg"
                      width={20}
                      height={14}
                    />
                    <p className="text-[12px]">{eventImgObj.cameraName}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button
                      variant="ghost"
                      className="text-[14px] font-bold text-[#2A94E5] hover:bg-transparent"
                      onClick={() => {
                        viewDetails(eventImgObj.id)
                      }}
                    >
                      View Details
                    </Button>
                    <Image
                      alt="icon"
                      src="/vectors/snapshot.svg"
                      width={20}
                      height={14}
                      className="cursor-pointer"
                      onClick={handleScreenshot}
                    />
                  </div>
                </div>
                <div className="relative h-[260px] w-full bg-black">
                  <Image
                    className="h-full w-full"
                    src={eventImgObj.eventsrc}
                    width="100"
                    height="100"
                    alt="event snap"
                    ref={targetRef}
                  />
                  <Button
                    variant="ghost"
                    className="absolute bottom-2 left-2 hover:bg-transparent"
                    onClick={() => {
                      downloadSnap(eventImgObj.id)
                    }}
                  >
                    <Image
                      alt="icon"
                      src="/vectors/eventDownload.svg"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
                <div className="flex h-[40px] w-full flex-row items-center justify-between p-[14px]">
                  <div className="flex flex-row items-center gap-2">
                    {/* <Image alt="icon" src="/vectors/over-speeding.svg" width={20} height={20} /> */}
                    <p className="text-[12px]">{eventImgObj.violationType} |</p>
                    {/* <p className="text-[12px]">Four Wheeler |</p> */}
                    <p className="text-[12px]"  dir={isRTL(eventImgObj.vehicleNo) ? 'rtl' : 'ltr'}>{eventImgObj.vehicleNo}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-[10px]">12:23 PM</p>
                    <Badge variant="outline" className="bg-[#FDC4BD]">
                      {eventImgObj.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          {snapArray.length > 0 ? (
            <div className="flex w-full flex-row flex-wrap justify-between">
              <EventsDetails
                eventDetailObj={lastElement}
                downloadSnap={downloadSnap}
                viewEventDetails={viewEventDetails}
              />
              <div className="h-full w-[35%] overflow-y-scroll p-2 shadow-inner">
                <div className="flex flex-wrap items-center justify-between">
                  <RecentFilteroptions
                    onCheckboxChange={submitrecentFilter}
                    colorfilterValues={recentcolorfilterValues}
                    regTypeValues={recentregTypeValues}
                    onChangereg={submitrecentregFilter}
                    onChangeviolation={submitrecentViolationFilter}
                    violationTypeValues={recentviolationTypeValues}
                    clearAl={recentclearAll}
                  />
                </div>
                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="filter-1">
                    <AccordionTrigger className="bg-[#EEF8FF] px-4">
                      View New Events (10)
                    </AccordionTrigger>
                    <AccordionContent>
                      {recentEventsArray.map((eventImgObj, index) => (
                        <NewEvents
                          id={eventImgObj.id}
                          eventImgObj={eventImgObj}
                          onClick={handleRecentEvent}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ) : (
            <div class="p-4"></div>
          )}
        </TabsContent>
        <TabsContent value="hotlisted">
          <HotlistedEvents
            hotlistedevent={hotlistedevents}
            lasthotlistedElement={lastHotlistedElement}
          />
        </TabsContent>
      </Tabs>
      <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-auto lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Quick Event View</DialogTitle>
              <DialogDescription>
                <EventDetailsPopup eventImgObj={selectedElement} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open2} onOpenChange={setOpen2}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-scroll lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Event Viewer</DialogTitle>
              <DialogDescription>
                <EventViewerPopup
                  eventImgObj={selectedElement}
                  downloadSnap={downloadSnap}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full items-center justify-center">
        <Dialog open={eventColorDialog} onOpenChange={setEventColorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Event Color Picker</DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span>Select Analytics</span>
                <Select value={analytic} onValueChange={(e) => setAnalytic(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Analytics" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-52">
                      {analytics3.map((item, index) => (
                        <SelectItem key={index} value={item.alertname}>
                          {item.alertname}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <span>Select Priority</span>
                <Select
                  value={priorityVal}
                  onValueChange={(e) => setPriorityVal(e)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Critical</SelectItem>
                    <SelectItem value="1">Medium</SelectItem>
                    <SelectItem value="2">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  Current Color:
                  <div
                    className="h-[20px] w-[20px] border-2 border-black"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                </div>
                <Button onClick={handleRemoveColor}>Remove color</Button>
              </div>
              <div className="flex flex-col gap-2">
                <label>Select Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <Button onClick={handleEventColor}>OK</Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full items-center justify-center">
        <Dialog open={eventAudioDialog} onOpenChange={setEventAudioDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Event Audio</DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span>Select Analytics</span>
                <Select
                  value={analyticAudio}
                  onValueChange={(e) => setAnalyticAudio(e)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Analytics" />
                  </SelectTrigger>
                  <SelectContent>
                    {analytics3.map((item, index) => (
                      <SelectItem key={index} value={item.alertname}>
                        {item.alertname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <span>Select Priority</span>
                <Select
                  value={priorityValAudio}
                  onValueChange={(e) => setPriorityValAudio(e)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Critical</SelectItem>
                    <SelectItem value="1">Medium</SelectItem>
                    <SelectItem value="2">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  Current Audio:
                  <audio controls>
                    <source src={selectedColorAudio} type="audio/mpeg" />
                  </audio>
                </div>
                <Button onClick={handleRemoveAudio}>Remove audio</Button>
              </div>
              <div className="flex flex-col gap-2">
                <label>Upload Audio:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
              <Button onClick={handleEventAudio}>OK</Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
export default Events
