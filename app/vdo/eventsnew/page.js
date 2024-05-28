"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import useStore from "@/store/store"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  ReloadIcon,
  SpeakerLoudIcon,
  SpeakerQuietIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@radix-ui/react-icons"
import { Client } from "@stomp/stompjs"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import html2canvas from "html2canvas"
import * as $ from "jquery"
import jsPDF from "jspdf"
import { Bar, Doughnut } from "react-chartjs-2"
import ReactPlayer from "react-player"
import SockJS from "sockjs-client"
import { useToast } from "@/components/ui/use-toast"

import {
  getAllChannels,
  getBarClips,
  getChannels,
  getFileContent,
  getHotlistedEvent,
  getJunctions,
  getLpSnap,
  getViolationStringData,
  keepAlive,
  startLive,
  stopLive,
} from "@/lib/api"
import isRTL from "@/lib/isRTL"
import Pagination from "@/lib/pagination"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/event-accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DTable from "@/components/datatable/dynamic"
import DoughnutChart from "@/components/doughnut-charts"
import EventTemplate from "@/components/event-template"
import EventStomp from "@/components/eventStomp"
import Filteroptions from "@/components/filteroptions"
import ImageWithMagnifier from "@/components/imageMag"
import LoadingDots from "@/components/loadingDots"
import { QuickView } from "@/components/quick-view"
import Spinner from "@/components/spinner"
import { ValidateEventsView } from "@/components/validate-events"
import { ValidateView } from "@/components/validate-view"
import { VehicleTypeView } from "@/components/vehicle-type"
import VideoPlayer from "@/components/videoPlayer"

let channelId
let streamsessionid

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const EventsNew = () => {
  const { toast } = useToast()
  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    const getViolations = async () => {
      try {
        const response = await getViolationStringData()
        setViolationAlertTypes(response?.map((x) => x.alerttype))
      } catch (error) {
        console.log(error)
      }
    }
    getViolations()
  }, [])
  const contentRef = useRef()
  const areas = useStore((state) => state.areas)
  const emailSms = useStore((state) => state.emailSms)
  const setEmailSms = useStore((state) => state.setEmailSms)
  const { updateCamera } = useStore()
  const fetchViolationsData = useStore((state) => state.violationsData)
  const [violationAlertTypes, setViolationAlertTypes] = useState([])
  const fetchAreas = useStore((state) => state.setAreas)
  const selectedCity = useStore((state) => state.selectedCity)
  const fetchCities = useStore((state) => state.setCities)
  const [selectedArea, setSelectedArea] = useState(null)
  const [junctionList, setJunctionList] = useState([])
  const [selectedJunction, setSelectedJunction] = useState(null)
  const [channelList, setChannelList] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [isValidateOpen, setValidateIsOpen] = useState(false)
  const [fetchGraphs, setFetchGraphs] = useState(false)
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [fullEventObjState, setFullEventObjState] = useState([])
  const [selectedMsId, setSelectedMsId] = useState()
  const [emailChecked, setEmailChecked] = useState(false)
  const [smsChecked, setSmsChecked] = useState(false)
  const [uncheckedUpdated, setUncheckedUpdated] = useState(false)

  // const [storeRes, setStoreRes] = useState([])
  const [vehicleNumber, setVehicleNumber] = useState()
  const [allEvents, setAllEvents] = useState(true)
  let [hotlistedevents, sethotlistedevents] = useState([])
  let [lastHotlistedElement, setlastHotlistedElement] = useState({})
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
  let [pause, setPause] = useState(true)
  let [snapArray, setSnapArray] = useState([])
  let [snapArray1, setSnapArray1] = useState([])
  let [lastElement, setlastElement] = useState({})
  let [hotlistedid, setHotListedId] = useState([])
  const videoRef = useRef(null)
  const [nextHours, setNextHours] = useState(false)
  const [showPreGraph, setShowPreGraph] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [openEvidenceSnap, setOpenEvidenceSnap] = useState(false)
  const [selectedChannelName, setSelectedChannelName] = useState("")
  const [showLoader, setShowLoader] = useState(false)
  // const [eventBarClip, setEventBarClip] = useState()
  // const [openVideoClip, setOpenVideoClip] = useState(false)
  const {
    selectedCameras,
    retryCamera,
    resetCamera,
    channels,
    addCamera,
    resetSelectedCamera,
  } = useStore()
  useEffect(() => {
    resetCamera()
  }, [])
  const fetchFlowChartsData = useStore((state) => state.setFlowChartsData)
  const fetchTrafficViolationsPieChartsData = useStore(
    (state) => state.setTrafficViolationsPieChartsData
  )
  const fetchTrafficFlowViolationsPieChartsData = useStore(
    (state) => state.setTrafficFlowViolationsPieChartsData
  )
  const trafficFlowViolationsPieChartsData = useStore(
    (state) => state.trafficFlowViolationsPieChartsData
  )
  const setSelectedCameras = useStore((state) => state.setSelectedCameras)
  const flowChartsData = useStore((state) => state.flowChartsData)
  const flowXaxisData = flowChartsData[0]?.patterndatalist?.map(
    (item) => item.starttimestamp
  )
  const arrFlow = flowChartsData[0]?.patterndatalist?.map(
    (item) => item.datalist
  )

  const firstArrayFlow = arrFlow?.find(
    (element) => Array.isArray(element) && element.length > 0
  )

  const unNullifiedArrayFlow = arrFlow?.map((array) => {
    if (array === null && firstArrayFlow) {
      return [
        ...firstArrayFlow?.map(({ totalrecords, ...rest }) => ({
          ...rest,
          totalrecords: 0,
        })),
      ]
    } else {
      return array?.map(({ totalrecords, ...rest }) => ({
        ...rest,
        totalrecords: totalrecords || 0,
      }))
    }
  })
  const extractedOnesFlow = []

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mute, setMute] = useState(true)
  const selectedAreaId = useStore((state) => state.selectedAreaId)
  const junctionId = useStore((state) => state.junctionId)
  const selectedChannelId = useStore((state) => state.selectedChannelId)
  const fromLive = useStore((state) => state.fromLive)
  const setFromLive = useStore((state) => state.setFromLive)

  const VideoSnapshot = () => {
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const snapshotURL = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = snapshotURL
    downloadLink.download = "snapshot.png"
    downloadLink.click()
  }
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1)
  }

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.1))
  }

  const handleMaximizeMinimize = (channelId) => {
    const videoElement = document.getElementById("videoplayer")
    if (videoElement) {
      if (!document.fullscreenElement) {
        // If no element is in fullscreen, make the video fullscreen
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen()
        } else if (videoElement.mozRequestFullScreen) {
          /* Firefox */
          videoElement.mozRequestFullScreen()
        } else if (videoElement.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          videoElement.webkitRequestFullscreen()
        } else if (videoElement.msRequestFullscreen) {
          /* IE/Edge */
          videoElement.msRequestFullscreen()
        }
      } else {
        // If an element is in fullscreen, exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen()
        }
      }
    }
  }

  const arr2 = unNullifiedArrayFlow?.forEach((childArr) => {
    childArr?.forEach((obj) => {
      const { name, totalrecords } = obj
      extractedOnesFlow.push({ name, totalrecords })
    })
  })

  const mergedDataFlow = extractedOnesFlow?.reduce((acc, obj) => {
    const { name, totalrecords } = obj
    if (acc[name]) {
      acc[name].push(totalrecords)
    } else {
      acc[name] = [totalrecords]
    }
    return acc
  }, {})
  
  const backgroundColors = [
    "#56fc03",
    "#ff0000",
    "#F87575",
    "#785EF0",
    "#78A9FF",
    "#B8C327",
    "#FF7093",
    "black",
  ]
  const datasetsFlow = Object.entries(mergedDataFlow)?.map(
    ([key, value], index) => ({
      label: key,
      data: value,
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderColor: backgroundColors[index % backgroundColors.length],
    })
  )
  const handleRefreshClick = () => {
    setRefresh(!refresh)
  }

  //////
  let latestAllElements = []
  // let latestElement;
  let mergedArray = []
  let filteredArray = []
  let regfilteredArray = []
  let violationfilteredArray = []
  let hotlistmergedArray = []
  let hotlistfilteredArray = []
  let hotlistregfilteredArray = []
  let hotlistviolationfilteredArray = []
  if (colorfilterValues.length > 0 && colorfilterValues.length < 12) {
    filteredArray = snapArray.filter((obj) =>
      colorfilterValues.includes(obj.color)
    )
    hotlistfilteredArray = hotlistedevents.filter((obj) =>
      colorfilterValues.includes(obj.color)
    )
  }
  if (regTypeValues.length > 0) {
    regfilteredArray = snapArray.filter((obj) =>
      regTypeValues.includes(obj.registrationType)
    )
    hotlistregfilteredArray = hotlistedevents.filter((obj) =>
      regTypeValues.includes(obj.registrationType)
    )
  }
  if (violationTypeValues.length > 0) {
    violationfilteredArray = snapArray.filter((obj) =>
      violationTypeValues.includes(obj.violationType)
    )
    hotlistviolationfilteredArray = hotlistedevents.filter((obj) =>
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
    hotlistmergedArray = [
      ...hotlistfilteredArray,
      ...hotlistregfilteredArray.filter(
        (obj2) => !hotlistfilteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    hotlistmergedArray = [
      ...hotlistmergedArray,
      ...hotlistviolationfilteredArray.filter(
        (obj2) => !hotlistfilteredArray.some((obj1) => obj1.id === obj2.id)
      ),
    ]
    latestAllElements = allEvents
      ? mergedArray.slice(process.env.NEXT_PUBLIC_EVENTS_LIMIT)
      : hotlistmergedArray.slice(process.env.NEXT_PUBLIC_EVENTS_LIMIT)
  } else {
    latestAllElements = allEvents
      ? snapArray.slice(process.env.NEXT_PUBLIC_EVENTS_LIMIT)
      : hotlistedevents.slice(process.env.NEXT_PUBLIC_EVENTS_LIMIT)
  }
  // useEffect(()=>{
  //   console.log("hotlistedevents",hotlistedevents)
  // },[latestAllElements])
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

    return formattedTime
  }
  const xAxisDataFormatted = flowXaxisData?.map((item) =>
    epochToNormalTime(item)
  )
  const xAxisDataFormattedMidpoint = Math.ceil(xAxisDataFormatted?.length / 2)
  const firstHalfXaxisData = xAxisDataFormatted?.slice(0, 7)
  const secondHalfXaxisData = xAxisDataFormatted?.slice(
    xAxisDataFormattedMidpoint
  )

  const firstHalfDatasetsFlow = datasetsFlow.map((item) => ({
    ...item,
    data: item.data.slice(0, item.data?.length / 2),
  }))
  const secondHalfDatasetsFlow = datasetsFlow.map((item) => ({
    ...item,
    data: item.data.slice(item.data?.length / 2),
  }))
  const data1 = {
    labels: firstHalfXaxisData,
    datasets: firstHalfDatasetsFlow,
  }
  const data2 = {
    labels: secondHalfXaxisData,
    datasets: secondHalfDatasetsFlow,
  }
  //Events
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
  const router = useRouter()
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
    const getHotlisted = async () => {
      const hotlistedidval = await getHotlistedEvent()
      setHotListedId(hotlistedidval)
    }
    getHotlisted()
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
    // console.log(channelData?.data?.result)
    setChannelList(channelData?.data?.result)
  }
  useEffect(() => {
    if (selectedJunction) {
      fetchChannels()
    }
  }, [selectedJunction])
  useEffect(() => {
    setSelectedChannel(null)
    setSelectedJunction(null)
  }, [selectedArea])

  const fetchJunctionData = async () => {
    const junctionData = await getJunctions(selectedCity, selectedArea)
    // console.log(junctionData)
    setJunctionList(junctionData?.data?.result)
  }

  const trafficViolationsPieChartsData = useStore(
    (state) => state.trafficViolationsPieChartsData
  )
  const type1ViolationAreaBased =
    trafficViolationsPieChartsData[0]?.patterndatalist?.[1]
  const type2ViolationFlowBased =
    trafficFlowViolationsPieChartsData[0]?.patterndatalist?.[0]
  const violationsLabels = type1ViolationAreaBased?.datalist?.map(
    (label) => label?.name
  )
  const totalRecordsViolations = type1ViolationAreaBased?.datalist?.map(
    (data) => data.totalrecords
  )
  const totalCountViolations = totalRecordsViolations?.reduce(
    (a, b) => a + b,
    0
  )
  const flowLabels = type2ViolationFlowBased?.datalist?.map(
    (label) => label?.name
  )
  const totalRecordsFlow = type2ViolationFlowBased?.datalist?.map(
    (data) => data.totalrecords
  )
  const totalCountFlow = totalRecordsFlow?.reduce((a, b) => a + b, 0)

  const donutsDataViolations = {
    labels: violationsLabels ? violationsLabels : ["No Data"],
    datasets: [
      {
        label: type1ViolationAreaBased?.name,
        data: totalRecordsViolations,
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: [
          "#7FC7FF",
          "#86E3CE",
          "#FA897B",
          "#FFDD94",
          "#CCABD8",
          "#56fc03",
          "#ff0000",
        ],
        pointBackgroundColor: "rgba(255,206,86,0.2)",
      },
    ],
  }
  const donutsDataFlow = {
    labels: flowLabels ? flowLabels : ["No Data"],
    datasets: [
      {
        label: type2ViolationFlowBased?.name,
        data: totalRecordsFlow,
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: [
          "#7FC7FF",
          "#86E3CE",
          "#FA897B",
          "#FFDD94",
          "#CCABD8",
          "#56fc03",
          "#ff0000",
        ],
        pointBackgroundColor: "rgba(255,206,86,0.2)",
      },
    ],
  }
  const options = {
    plugins: {
      title: {
        display: true,
        color: "blue",
        font: {
          size: 34,
        },
        responsive: true,
        animation: {
          animateScale: true,
        },
      },
    },
  }
  const retryStream = async () => {
    const liveVideopayload = {
      channelid: selectedChannel,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: true,
    }
    await retryCamera(selectedChannel)
    updateCameraRequest(selectedChannel, liveVideopayload)
  }
  // console.log(selectedChannel, "selectedChannel")
  const handleLive = async () => {
    setFetchGraphs(!fetchGraphs)
    setShowLoader(true)
    setSelectedCamera(selectedChannel)
    if (selectedCameras.length > 0) {
      // console.log(selectedCameras[0].streamsessionid)
      document.getElementById("videoplayer")["webrtc"].stop()
      await stopLive(selectedCameras[0].streamsessionid)
      resetCamera()
    }
    const selectedChannelInList = channelList.find(
      (channel) => channel.id === selectedChannel
    )
    addCamera({
      camId: selectedChannelInList.id,
      isLoading: true,
      name: selectedChannelInList.name,
      loadingMessage: "Starting Stream",
    })
    const liveVideopayload = {
      channelid: selectedChannelInList.id,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: false,
    }
    updateCameraRequest(selectedChannelInList.id, liveVideopayload)
    setSelectedChannelName(selectedChannelInList?.ip)
  }
  useEffect(() => {
    if (selectedChannelId !== null) {
      const selectedChannelInList = channelList?.find(
        (channel) => channel.id === selectedChannelId
      )
      setSelectedChannelName(selectedChannelInList?.ip)
    }
  }, [channelList, selectedChannelId])
  useEffect(() => {
    const startEvents = async () => {
      const junctionData = await getJunctions(selectedCity, selectedAreaId)
      setJunctionList(junctionData?.data?.result)
      setSelectedJunction(junctionId)
      setSelectedChannel(selectedChannelId)
      // setSelectedCamera(selectedChannelId)
      setFetchGraphs(!fetchGraphs)
      const selectedChannelInList = channelList?.find(
        (channel) => channel.id === selectedChannelId
      )
      addCamera({
        camId: selectedChannelInList.id,
        isLoading: true,
        name: selectedChannelInList.name,
        loadingMessage: "Starting Stream",
      })
      const liveVideopayload = {
        channelid: selectedChannelInList.id,
        resolutionwidth: 892,
        resolutionheight: 481,
        withaudio: false,
      }
      updateCameraRequest(selectedChannelInList.id, liveVideopayload)
    }
    if (selectedAreaId !== null && fromLive === true) {
      setSelectedArea(selectedAreaId)
      startEvents()
    }
  }, [selectedAreaId, channelList])

  const updateCameraRequest = async (id, payload) => {
    const response = await startLive(payload, id)
    const liveRes = response.data.result[0]
    if (response.status === 200) {
      var streamingserveraddress =
        response.data.result[0].streamingserveraddress
      var streamingserverport = response.data.result[0].streamingserverport
      var stunserveraddress = response.data.result[0].stunserveraddress
      var stunserverport = response.data.result[0].stunserverport
      channelId = response.data.result[0].vStreamingDetailsModel.channelId
      streamsessionid = response.data.result[0].streamsessionid

      setSelectedCameras([
        ...selectedCameras,
        {
          ...liveRes,
          camId: id,
          isLoading: false,
          loadingMessage: "Stream Loaded",
        },
      ])

      // console.log(
      //   "Element with ID " + id + " is loaded:",
      //   document.getElementById("videoplayer")
      // )

      var webrtcURL =
        "http://" + streamingserveraddress + ":" + streamingserverport
      setTimeout(function () {
        var element = document.getElementById("videoplayer")
        if (element) {
          var webrtc = new WebRTC(
            webrtcURL,
            1,
            id,
            -1,
            1,
            1,
            1,
            element,
            stunserveraddress,
            stunserverport
          )
          element["webrtc"] = webrtc
          element["webrtc"].start()
          element["webrtcURL"] = webrtcURL
          element["isplaying"] = true
        } else {
          console.log("Element with ID " + id + " not found.")
        }
      }, 1000) // 1000 milliseconds = 1 second
    } else {
      setSelectedCameras([
        ...selectedCameras,
        {
          hasError: true,
          camId: id,
          isLoading: false,
          loadingMessage: "Error",
        },
      ])
    }
  }

  const handleChannelSelection = async (value) => {
    // alert(value);
    setSelectedChannel(value)
    // setSelectedCamera(value)
  }
  //Events
  async function addImage(imgsrc, imgsrc1) {
    setSnapArray((prevArray) => [...prevArray, imgsrc])
    setSnapArray1((prevArray) => [...prevArray, imgsrc1])
    let tempObj = { ...imgsrc }
    if (pause) {
      addLastEvent(tempObj)
    }
    if (hotlistedid.length > 0) {
      if (hotlistedid.includes(imgsrc.eventType)) {
        addhotlistedImage(imgsrc)
      }
    }
  }
  const showSelectedEvent = (eventId) => {
    console.log(eventId)
    const selectedObj = snapArray.find((item) => item.id === eventId)
    let tempObj = { ...selectedObj }
    addLastEvent(tempObj)
    setSelectedEventId(eventId)
    setSelectedMsId(fullEventObjState.msId)
    setPause(false)
  }
  const viewDetails = async (event) => {
    let tempObj = { ...event }
    let tempSnapurlArry = []
    let eventDataArray = event.snapurlArry
    eventDataArray.map(async (item) => {
      let eventobj = {
        filepath: item,
      }
      let response = await getFileContent(eventobj)
      let base64String = "data:image/png;base64," + response
      tempSnapurlArry.push(base64String)
    })
    tempObj.snapurlArry = tempSnapurlArry

    let eventData = event.eventsrc
    let eventobj2 = {
      filepath: eventData,
    }
    const response2 = await getFileContent(eventobj2)
    let base64String2 = "data:image/png;base64," + response2
    tempObj.eventsrc = base64String2

    console.log("tempObj - ", tempSnapurlArry)
    setSelectedEvent(tempObj)
    setShowEventDialog(true)
  }
  const viewEventDetails = (event) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }
  async function addLastEvent(tempObj) {
    let eventData = tempObj.eventsrc
    let eventobj = {
      filepath: eventData,
    }
    const response = await getFileContent(eventobj)
    let base64String = "data:image/png;base64," + response
    tempObj.eventsrc = base64String
    // console.log("imgsrc - ",tempObj)
    setlastElement(tempObj)
  }
  function addhotlistedImage(eventobj) {
    const objectExists = hotlistedevents.some((obj) => obj.id === eventobj.id)
    // console.log("objectExists",objectExists)
    if (!objectExists) {
      // console.log("Add",eventobj.id)
      sethotlistedevents((prevArray) => [...prevArray, eventobj])
      let tempObj = { ...eventobj }
      if (pause) {
        addLastHotlistedEvent(tempObj)
      }
    }
  }
  async function addLastHotlistedEvent(tempObj) {
    let eventData = tempObj.eventsrc
    let eventobj = {
      filepath: eventData,
    }
    const response = await getFileContent(eventobj)
    let base64String = "data:image/png;base64," + response
    tempObj.eventsrc = base64String
    // console.log("imgsrc - ",tempObj)
    setlastHotlistedElement(tempObj)
  }
  useEffect(() => {
    if (selectedCamera !== null) {
      setSnapArray([])
      setSnapArray1([])
      sethotlistedevents([])
      setlastElement({})
      setPause(true)
    }
  }, [selectedCamera])
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
        // console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    client.heartbeatIncoming = 10000
    client.heartbeatOutgoing = 10000

    client.onConnect = function (frame) {
      console.log("Connected: " + frame)
      client.subscribe("/authentication/admin", (message) => {
        console.log(JSON.parse(message.body))
      })
      client.subscribe("/event", async function (message) {
        let receivedData = JSON.parse(message.body)
        if (receivedData.result[0].channelId == selectedCamera) {
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
          let lane = 1
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
          var fullEventObj = receivedData.result[0]
          setFullEventObjState(fullEventObj)
          fullEventObj["eventSrc"] = receivedData.result[0].snapUrls[0]
          var lpImage = await fetchLpImages(eventData)
          var eventObj = {
            id: eventId,
            vehicleNo: vehicleNo,
            cameraName: cameraName,
            junctionName: junctionName,
            eventMessage: eventMessage,
            violationType: violationType,
            eventType: receivedData.result[0].eventType,
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
            eventsrc: receivedData.result[0].snapUrls[0],
            snapurlArry: receivedData.result[0].snapUrls,
            channelId: channelId,
            lpImage: lpImage,
            enddatetime: receivedData.result[0].endTime,
          }
          console.log("fullEventObj", fullEventObj)
          addImage(eventObj, fullEventObj)
        }
      })
      // hotlistedid.map((item) => {
      //   let subString = "/event/" + item
      //   client.subscribe(subString, async function (message) {
      //     let receivedData = JSON.parse(message.body)
      //     if(receivedData.result[0].channelId == selectedCamera) {
      //       let eventId = receivedData.result[0].id
      //       let vehicleNo = receivedData.result[0].objectId
      //       let cameraName = receivedData.result[0].cameraName
      //       let junctionName = receivedData.result[0].junctionName
      //       let eventMessage = receivedData.result[0].message
      //       let severityval = severity[receivedData.result[0].priority]
      //       let violationType =
      //         alertTypes.find(
      //           (alert) => alert.alerttype == receivedData.result[0].eventType
      //         )?.alertname || ""
      //       let objectProperty6 = receivedData.result[0].objectProperty6
      //       let registrationType = regType[objectProperty6]
      //       let speed = receivedData.result[0].objectProperty4
      //       let color = vehicleColor[receivedData.result[0].objectProperty1]
      //       let vehicleclass =
      //         vehicleClass[receivedData.result[0].objectProperty2]
      //       let speedLimit = receivedData.result[0].objectProperty3
      //       let channelId = receivedData.result[0].channelId
      //       let datetime = receivedData.result[0].startTime
      //       datetime = new Date(datetime).toLocaleString()
      //       let datetimeArray = datetime.split(",")
      //       let date = datetimeArray[0]
      //       let time = datetimeArray[1]
      //       let enddatetime = receivedData.result[0].endTime
      //       enddatetime = new Date(enddatetime).toLocaleString()
      //       let enddatetimeArray = enddatetime.split(",")
      //       let enddate = enddatetimeArray[0]
      //       let endtime = enddatetimeArray[1]
      //       let eventData = receivedData.result[0].snapUrls[0]
      //       let lane = 1
      //       const channelResponse = allChannels.length
      //         ? allChannels
      //         : await getAllChannels()
      //       const filteredchannel = channelResponse.filter(
      //         (obj) => obj.id === channelId
      //       )
      //       const channelValue = filteredchannel[0].mediaChannelParam
      //       if (channelValue !== null) {
      //         const laneValue = channelValue.laneNumber
      //         if (laneValue !== null) {
      //           lane = laneValue
      //         }
      //       }
      //       var fullEventObj = receivedData.result[0]
      //       fullEventObj["eventSrc"] = receivedData.result[0].snapUrls[0]
      //         var lpImage = await fetchLpImages(eventData)
      //         var eventObj = {
      //           id: eventId,
      //           vehicleNo: vehicleNo,
      //           cameraName: cameraName,
      //           junctionName: junctionName,
      //           eventMessage: eventMessage,
      //           violationType: violationType,
      //           severity: severityval,
      //           registrationType: registrationType,
      //           speed: speed,
      //           speedLimit: speedLimit,
      //           color: color,
      //           vehicleclass: vehicleclass,
      //           lane: lane,
      //           date: date,
      //           time: time,
      //           enddate: enddate,
      //           endtime: endtime,
      //           eventsrc: receivedData.result[0].snapUrls[0],
      //           snapurlArry: receivedData.result[0].snapUrls,
      //           channelId: channelId,
      //           lpImage: lpImage,
      //           enddatetime: receivedData.result[0].endTime
      //         }
      //         addhotlistedImage(eventObj)
      //     }
      //   })
      // })
    }
    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"])
      console.log("Additional details: " + frame.body)
    }
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [pause, alertTypes, fetchGraphs])
  const resumeEvents = () => {
    setPause(true)
    // setlastElement(snapArray.slice(-1))
  }
  useEffect(() => {}, [fullEventObjState])
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
  const fetchLpImages = async (img) => {
    const payload = {
      filepath: img,
      height: 50,
      width: 150,
    }
    const response = await getLpSnap(payload)
    var lpImage = "data:image/jpg;base64," + response.data.result[0]
    // var lpImage = response.data.result[0]
    return lpImage
  }
  const convertToViolationType = (type) => {
    for (let i = 0; i < alertTypes?.length; i++) {
      if (alertTypes[i].alerttype === type) {
        return alertTypes[i].alertname
      }
    }
    return "Others"
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
  const toggleValidate = () => {
    setValidateIsOpen(!isValidateOpen)
    // setOpen2(true)
  }
  const handleClose = () => {
    setShowEventDialog(false)
  }
  const handleCheckbox = () => {
    // alert(allEvents);
    setAllEvents(!allEvents)
    clearAll()
  }
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
  const filteredFullEventObj = snapArray1?.find(
    (item) => item.id === selectedEvent?.id
  )
  const currentDate = new Date()

  const selectedJunctionInList = junctionList?.find(
    (junction) => junction?.id === selectedJunction
  )?.serverid
  const validateNextHours = () => {
    let currentDate = new Date().getHours()
    currentDate = parseInt(currentDate)
    // currentDate = 3
    let checkIfOdd =
      currentDate % 2 !== 0 ? (currentDate = currentDate - 1) : currentDate
    checkIfOdd = parseInt(checkIfOdd) < 10 ? "0" + checkIfOdd : checkIfOdd
    const isBelongsToFirstHalf = checkIfOdd <= 10 ? true : false
    const validation1 = firstHalfXaxisData?.includes(
      checkIfOdd.toString() + ":00"
    )
    const validation2 = secondHalfXaxisData?.includes(
      checkIfOdd.toString() + ":00"
    )
    return {
      validation1,
      validation2,
      checkIfOdd,
    }
  }
  const { validation1, validation2, checkIfOdd } = validateNextHours()
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()
    const todayStartTimestamp = new Date(year, month, day, 0, 0, 0, 0).getTime()
    const todayEndTimestamp = new Date(
      year,
      month,
      day,
      23,
      59,
      59,
      999
    ).getTime()
    const todayPayloadLineChartFlow = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList: [207],
      charttype: 0,
      durationinminute: 120,
      vehicleclass: -1,
      registrationtype: -1,
      channelidList: selectedChannel !== null ? [selectedChannel] : [],
      msId:
        selectedJunctionInList !== undefined ? selectedJunctionInList : null,
    }
    const todayPayloadpPieChartViolations = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList: violationAlertTypes,
      channelidList: selectedChannel !== null ? [selectedChannel] : [],
      msId:
        selectedJunctionInList !== undefined ? selectedJunctionInList : null,
    }
    const todayPayloadpPieChartflowViolations = {
      starttimestamp: todayStartTimestamp,
      endtimestamp: todayEndTimestamp,
      applicationList: [207],
      channelidList: selectedChannel !== null ? [selectedChannel] : [],
      msId:
        selectedJunctionInList !== undefined ? selectedJunctionInList : null,
    }
    const fetchGraphsData = async () => {
      await fetchFlowChartsData(todayPayloadLineChartFlow)
      await fetchTrafficViolationsPieChartsData(todayPayloadpPieChartViolations)
      await fetchTrafficFlowViolationsPieChartsData(
        todayPayloadpPieChartflowViolations
      )
      setShowLoader(true)
    }
    fetchGraphsData()
    return () => {
      setShowLoader(false)
    }
  }, [violationAlertTypes, fetchGraphs, refresh])
  const columns = [
    { accessorKey: "endtime", header: "Time" },
    { accessorKey: "vehicleclass", header: "Vehicle Type" },
    { accessorKey: "violationType", header: "Event Type" },
    { accessorKey: "color", header: "Color" },
    { accessorKey: "vehicleNo", header: "Vehicle Number" },
    {
      accessorKey: "lpImage",
      header: "License Plate Image",
      cell: ({ row }) => (
        <Image
          src={row.original.lpImage}
          alt="lpImage"
          width={120}
          height={30}
          className="h-[30px] w-[120px]"
        />
      ),
    },
    {
      accessorKey: "",
      header: "View Details",
      cell: ({ row }) => (
        <div>
          <Button
            size={"sm"}
            className="text-xs"
            onClick={() => {
              viewDetails(row.original)
            }}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ]
  const firstHalfValidation = validation1 || nextHours
  const secondHalfValidation = validation2 || !nextHours
  // console.log(latestAllElements, "latestAllElements")
  const exportToPDF = () => {
    const content = contentRef.current
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save(selectedEvent.id + ".pdf")
    })
  }

  // const vehicleNo = details?.vehicleNo
  //   ? details?.vehicleNo
  //   : props?.objectId
  //   ? props?.objectId
  //   : ""

  const handleEmailChange = () => {
    setEmailChecked(!emailChecked)
  }

  const handleSmsChange = () => {
    setSmsChecked(!smsChecked)
  }


const handleOkButtonClick = async () => {
    let triggerSmsEmail = 0;

    try {
        if (emailChecked && !smsChecked) {
            triggerSmsEmail = 0;
            await setEmailSms(selectedEventId, selectedMsId, 0);
        } else if (!emailChecked && smsChecked) {
            triggerSmsEmail = 1;
            await setEmailSms(selectedEventId, selectedMsId, 1);
        } else if (emailChecked && smsChecked) {
            await setEmailSms(selectedEventId, selectedMsId, 0);
            await setEmailSms(selectedEventId, selectedMsId, 1);
        }

        setEmailChecked(false);
        setSmsChecked(false);

        toast({
          variant: "success",
          description:
            "Notification sent successfully!",
          duration: 3000,
        })
    } catch (error) {
        toast({
          variant: "destructive",
          description:
            "Failed to send notification!",
          duration: 3000,
        })
    }
};

  useEffect(() => {
    setVehicleNumber(selectedEvent?.vehicleNo)
  }, [selectedEvent])

  const handleVehicleNumberChange = (event) => {
    setVehicleNumber(event.target.value)
  }
  
 
  return (
    <section className="w-[55%]flex-row flex gap-2">
      <section className="mt-4 flex w-full flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center justify-start gap-6">
          <Popover>
            <PopoverTrigger className="flex w-[180px] flex-row items-center justify-between gap-2 rounded-md border p-[7px]">
              {!selectedArea
                ? "Area"
                : areas.find((area) => area.id === selectedArea)?.name ||
                  "Select Area"}{" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="z-50 w-[245px] p-4">
              <div className="max-h-40 overflow-y-scroll">
                <p className="text-md mb-2 w-[180px] justify-between font-medium text-black">
                  Area 
                </p>
                <RadioGroup
                  value={selectedArea}
                  onValueChange={(value) => setSelectedArea(value)}
                >
                  {areas?.map((area, index) => (
                    <div
                      className="flex items-center justify-start gap-2 py-2 text-sm text-black"
                      key={index}
                    >
                      <RadioGroupItem value={area.id} id={`area${index}`} />
                      <Label htmlFor={`area${index}`}>{area.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {!areas?.length && (
                  <div className="text-center text-sm">
                    Please Select the city from top Menu
                  </div>
                )}
              </div>
              <PopoverClose className="w-full">
                <Button
                  disabled={!areas?.length || !selectedArea}
                  variant="default"
                  onClick={() => fetchJunctionData()}
                  className="mt-2 w-full"
                >
                  Apply
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-[7px] ">
              Junction & Camera{" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4">
              {selectedArea && (
                <Accordion collapsible>
                  <AccordionItem value="filter-1">
                    <AccordionTrigger>Junction</AccordionTrigger>
                    <AccordionContent className="max-h-40 overflow-y-scroll">
                      <RadioGroup
                        value={selectedJunction}
                        defaultValue={selectedJunction}
                        onValueChange={(value) => setSelectedJunction(value)}
                      >
                        {/* {JSON.stringify(junctionList)} */}
                        {junctionList?.map((junction, index) => (
                          <div
                            className="flex items-center justify-start gap-2 py-2 text-sm text-black"
                            key={index}
                          >
                            <RadioGroupItem
                              value={junction.id}
                              id={`junction${index}`}
                            />
                            <Label htmlFor={`junction${index}`}>
                              {junction.name}
                            </Label>
                          </div>
                        ))}
                        {/* <Button variant="default" onClick={()=>fetchChannels()}>Apply</Button> */}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="filter-2">
                    <AccordionTrigger>Camera</AccordionTrigger>
                    <AccordionContent className="max-h-40 overflow-y-scroll">
                      <RadioGroup
                        value={selectedChannel}
                        defaultValue={selectedChannel}
                        onValueChange={(value) => handleChannelSelection(value)}
                      >
                        {/* {JSON.stringify(junctionList)} */}
                        {channelList?.map((channel, index) => (
                          <div
                            className="flex items-center justify-start gap-2 py-2 text-sm text-black"
                            key={index}
                          >
                            <RadioGroupItem
                              value={channel.id}
                              id={`channel${index}`}
                            />
                            <Label htmlFor={`channel${index}`}>
                              {channel.ip}
                            </Label>
                          </div>
                        ))}
                        {/* <Button variant="default" onClick={()=>fetchChannels()}>Apply</Button> */}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              {selectedArea && (
                <PopoverClose className="w-full">
                  <Button
                    variant="default"
                    className="mt-4 w-full"
                    onClick={handleLive}
                  >
                    Apply Location
                  </Button>
                </PopoverClose>
              )}
              {!selectedArea && (
                <div className="text-center text-xs">Please Select Area</div>
              )}
            </PopoverContent>
          </Popover>
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
          <div className="flex flex-row items-center gap-2">
          <Checkbox onCheckedChange={handleCheckbox} />
          <label
            htmlFor="hotlisted"
            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Hotlisted Events
          </label>
          </div>
          {pause ? (
            <></>
          ) : (
            <Button onClick={() => resumeEvents()}>Resume Events</Button>
          )}
        </div>
        <section className="mt-4 flex flex-row gap-2">
          <div className="w-[50%]">
            {!selectedCameras.length > 0 ? (
              <AspectRatio ratio={16 / 9} className="bg-gray-900">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <Image
                    src="/vectors/Videonetics_logo (1).svg"
                    alt="logo"
                    width={80}
                    height={80}
                  />
                </div>
              </AspectRatio>
            ) : (
              <AspectRatio
                ratio={16 / 9}
                className={`w-full bg-gray-900 ${
                  selectedCameras[0]?.isLoading ? "" : ""
                }`}
              >
                {selectedCameras[0]?.hasError && (
                  <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center text-red-600">
                    <div>Error!.. </div>
                    <div
                      className="cursor-pointer bg-black p-1 text-xs text-white opacity-50 hover:bg-gray-700"
                      onClick={retryStream}
                    >
                      Retry
                    </div>
                  </div>
                )}
                {selectedCameras[0]?.isLoading ? (
                  <div className="flex  h-full w-full flex-col items-center justify-center text-white">
                    <div>
                      <div className="h-4 w-4 animate-spin rounded-full border-4 border-gray-200 border-t-primary ease-linear"></div>
                    </div>
                    <div className="ml-2 mt-4 animate-bounce text-xs">
                      {" "}
                      {selectedCameras[0]?.loadingMessage
                        ? selectedCameras[0]?.loadingMessage
                        : "Loading"}{" "}
                      <span className="animate-bounce">...</span>{" "}
                    </div>
                  </div>
                ) : (
                  <AspectRatio
                    ratio={16 / 9}
                    className={`relative w-full bg-gray-900`}
                  >
                    <video
                      // url={`${process.env.NEXT_PUBLIC_URL}${selectedCameras[0]?.hlsurl}`}
                      muted={true}
                      playing={true}
                      width="100%"
                      height="100%"
                      className="max-h-full"
                      id="videoplayer"
                      style={{ objectFit: "contain" }}
                      ref={videoRef}
                      // gridFullScreen={isFullScreen}
                    />

                    <div className="absolute left-0 top-0 flex h-full w-full items-end  justify-end gap-4 p-4">
                      <Image
                        alt="icon"
                        src="/vectors/snapshot.svg"
                        width={16}
                        height={12}
                        className="cursor-pointer"
                        onClick={VideoSnapshot}
                      />
                      <button
                        onClick={() => setMute(false)}
                        className={`z-30  rounded-xl p-1 text-white opacity-50 transition-all ${
                          isFullscreen ? "h-8 w-8" : "h-5 w-5"
                        } `}
                        disabled={mute ? false : true}
                      >
                        <SpeakerLoudIcon />
                      </button>
                      <button
                        onClick={() => setMute(true)}
                        className={`z-30  rounded-xl  p-1 text-white opacity-50 transition-all ${
                          isFullscreen ? "h-8 w-8" : "h-5 w-5"
                        } `}
                        disabled={mute ? true : false}
                      >
                        <SpeakerQuietIcon />
                      </button>
                      {/* <button
                        onClick={handleZoomIn}
                        className={`z-30  rounded-xl  p-1 text-white opacity-50 transition-all ${
                          isFullscreen ? "h-8 w-8" : "h-5 w-5"
                        } `}
                      >
                        <ZoomInIcon />
                      </button>
                      <button
                        onClick={handleZoomOut}
                        className={`z-30  rounded-xl  p-1 text-white opacity-50 transition-all ${
                          isFullscreen ? "h-8 w-8" : "h-5 w-5"
                        } `}
                      >
                        <ZoomOutIcon />
                      </button> */}
                      <button
                        onClick={() =>
                          handleMaximizeMinimize(selectedCameras[0]?.camId)
                        }
                        className={`z-30  rounded-xl  p-1 text-white opacity-50 transition-all ${
                          isFullscreen ? "h-8 w-8" : "h-5 w-5"
                        } `}
                      >
                        {isFullscreen ? (
                          <ExitFullScreenIcon className="h-full w-full" />
                        ) : (
                          <EnterFullScreenIcon className="h-full w-full" />
                        )}
                      </button>
                    </div>
                  </AspectRatio>
                )}
              </AspectRatio>
            )}
          </div>
          <div className="w-[50%]">
            {allEvents && pause && latestAllElements.length > 0 ? (
              <EventTemplate
                // event={latestAllElements[0]}
                event={lastElement}
                viewDetails={viewEventDetails}
                downloadSnap={downloadSnap}
                videoRef={videoRef}
              />
            ) : !pause ? (
              <EventTemplate
                event={lastElement}
                viewDetails={viewEventDetails}
                downloadSnap={downloadSnap}
              />
            ) : !allEvents && lastHotlistedElement.id ? (
              <EventTemplate
                event={lastHotlistedElement}
                viewDetails={viewEventDetails}
                downloadSnap={downloadSnap}
              />
            ) : (
              <AspectRatio ratio={16 / 9} className="border p-0">
                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900">
                  <Image
                    src="/vectors/Videonetics_logo (1).svg"
                    alt="logo"
                    width={80}
                    height={80}
                  />
                </div>
              </AspectRatio>
            )}
          </div>
        </section>
        <section className="ml-2 mt-4">
          <span className="text-base  font-semibold">
            Events for {currentDate.toLocaleDateString()}
          </span>
        </section>
        <section className="mt-4">
          <DTable
            data={latestAllElements.reverse()}
            columns={columns}
            showSelectedEvent={showSelectedEvent}
            selectedEventId={selectedEventId}
          />
        </section>
      </section>
      <div className="ml-2 border border-[#DBDBDB]"></div>
      <section className="mt-4 flex w-[35%] flex-col gap-8">
        <div className="flex items-center justify-center gap-8 ">
          {selectedChannelName !== "" && (
            <span className="text-[rgba(15, 15, 16, 1)] font-semibold">
              @ {selectedChannelName}
            </span>
          )}
          <button cursor={"pointer"} onClick={handleRefreshClick}>
            <ReloadIcon />
          </button>
        </div>
        {firstHalfValidation ? (
          !showLoader ? (
            <div className="eventSpinner flex w-full flex-col items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Bar data={data1} />
          )
        ) : secondHalfValidation ? (
          !showLoader ? (
            <div className="eventSpinner flex w-full flex-col items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Bar data={data2} />
          )
        ) : null}
        <div className="flex  items-center justify-center">
          <button>
            <ArrowLeftIcon onClick={() => setNextHours(true)} />
          </button>

          <button className="cursor-pointer">
            <ArrowRightIcon onClick={() => setNextHours(false)} />{" "}
          </button>
        </div>
        <div className="border border-[#DBDBDB]"></div>
        <div className="flex  flex-col items-center">
          <span className="text-[rgba(15, 15, 16, 1)] font-semibold">
            {type1ViolationAreaBased?.name}
          </span>
          <div className=" mt-[0.5em] flex items-center justify-center bg-[#EEF8FF] text-[#2A94E5]">
            Total:{" "}
            {showLoader ? (
              totalCountViolations
            ) : (
              <div className="eventLoader flex flex-col items-center justify-center px-2.5">
                <LoadingDots />
              </div>
            )}
          </div>
          {!showLoader ? (
            <div className="eventSpinner flex w-full flex-col items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Doughnut data={donutsDataViolations} options={options} />
          )}
        </div>
        <div className="border border-[#DBDBDB]"></div>
        <div className="flex  flex-col items-center">
          <span className="text-[rgba(15, 15, 16, 1)] font-semibold">
            {type2ViolationFlowBased?.name}
          </span>
          <div className=" mt-[0.5em] flex items-center justify-center bg-[#EEF8FF] text-[#2A94E5]">
            Total:{" "}
            {showLoader ? (
              totalCountFlow
            ) : (
              <div className="eventLoader flex flex-col items-center justify-center px-2.5">
                <LoadingDots />
              </div>
            )}
          </div>
          {!showLoader ? (
            <div className="eventSpinner flex w-full flex-col items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Doughnut data={donutsDataFlow} options={options} />
          )}
        </div>
      </section>
      <Dialog
        open={showEventDialog}
        onOpenChange={() => setShowEventDialog(!showEventDialog)}
      >
        <DialogContent className="max-h-fit w-[900px] lg:max-w-screen-md gap-2 pb-0">
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl">Event Viewer</DialogTitle>
          </DialogHeader>
          <div id="event-viewer-popup" ref={contentRef}>
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-[550px]">
            <div className="flex text-[#3F3F40] text-sm font-medium gap-2">
                <span>
                  {selectedEvent?.violationType}
                </span>
                <span>
                  |
                </span>
                <span>
                  {selectedEvent?.vehicleclass}
                </span>
                <span>
                  |
                </span>
                <span
                  dir={isRTL(selectedEvent?.vehicleNo) ? "rtl" : "ltr"}
                >
                  {selectedEvent?.vehicleNo}
                </span>
              </div>
              <div className="flex w-[72px]">
                <Button
                  variant="ghost"
                  className="flex flex-row items-center justify-start gap-2 p-1"
                >
                  <Image
                    alt="icon"
                    src="/vectors/Download (1).svg"
                    width={24}
                    height={24}
                  />
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-row items-center justify-start gap-2 p-1"
                  onClick={() => {
                    exportToPDF()
                  }}
                >
                  <Image
                    alt="icon"
                    src="/vectors/eventPrinter.svg"
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
              </div>
              
              <div className="flex text-[#333333] bg-[#F3F3F3] rounded-md w-[166px] text-sm p-2 gap-2">
                <span className="font-normal">Status: </span>
                <span className="font-bold">
                  {convertToAcknowledge(filteredFullEventObj?.acknowledge)}
                </span>
                {
                  !uncheckedUpdated ? 
                  <Image
                  src="/images/Group 1000002710.svg"
                  alt="icon"
                  width={20}
                  height={20}
                  className="pr-1"
                />
                :
                <Image
                src="/vectors/Group 1000002709.svg"
                alt="icon"
                width={20}
                height={20}
                className="pr-1"
              />
                }
              </div>
            </div>
            <div className="max-h-fit flex gap-2 ">
              <AspectRatio
                ratio={16 / 4}
                className="relative overflow-hidden bg-muted rounded w-[532px]"
              >
                {selectedEvent?.eventsrc ? (
                  <ImageWithMagnifier
                    src={selectedEvent?.eventsrc}
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
              <div className="justify-top flex flex-col w-[218px]">
                <div className="flex flex-col bg-[#fff]">
                  <Image
                    src={selectedEvent?.lpImage}
                    alt="lpImage"
                    width={160}
                    height={150}
                    className="rounded-sm"
                  />
                  <span className="font-normal text-sm text-[#666666] pt-2 pl-2">
                    License plate
                  </span>
                  <span className="relative right-6 pl-2">
                    <Input
                     placeholder="Search Vehicle No."
                      value={vehicleNumber}
                      onChange={handleVehicleNumberChange}
                      className="h-10 border-none text-[#333333] text-xs font-bold gap-2"
                    />
                    <Image
                      src="/vectors/icon-edit-2.svg"
                      alt="edit"
                      width={13}
                      height={24}
                      className="bottom-3 left-[130px] absolute"
                    />
                  </span>
                  <VehicleTypeView
                    onRequestClose={toggleValidate}
                    props={filteredFullEventObj}
                  />
                  <span className="pt-2 font-normal text-sm text-[#666666]">
                    Severity
                  </span>
                  <p className="font-semibold px-1 text-xs text-[#D94545]">
                    {selectedEvent?.severity}
                  </p>
                </div>
              </div>
              </div>
            <div className="h-30 mt-2">
              <Table className="border-collapse text-[#333] ">
                <TableRow >
                  <TableCell className="p-2">
                    <span className=" font-normal text-xs">Location</span>
                    <p className="font-semibold text-xs">
                      {selectedEvent?.junctionName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">Junction</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.junctionName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">Camera</span>
                    <p className="mt-1 font-semibold text-xs text-[#333]">
                      {selectedEvent?.cameraName}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">Lane</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.lane}
                    </p>
                  </TableCell>
                  <TableCell colSpan="2" className="p-2">
                    <span className="font-normal text-[#333] text-xs">
                      Capture Time
                    </span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.date}, {selectedEvent?.time}
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">
                      Vehicle Type
                    </span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.vehicleclass}
                    </p>{" "}
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs" >Speed</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.speed}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">Color</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {selectedEvent?.color}
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-[#333] text-xs">Message</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {filteredFullEventObj?.action}-
                    </p>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="font-normal text-xs text-[#333]">Action</span>
                    <p className="font-semibold text-xs text-[#333]">
                      {filteredFullEventObj?.action}-
                    </p>
                  </TableCell>
                </TableRow>
              </Table>
            </div>
            <div className="flex flex-row gap-10">
              <ValidateView
                onRequestClose={toggleValidate}
                props={filteredFullEventObj}
                setUncheckedUpdated={setUncheckedUpdated}
              />

              <div>
                <Button
                  variant="outline"
                  className="rounded-sm border-[#2A94E5] font-semibold text-[#2A94E5] my-1"
                  // disabled={selectedEvent?.snapUrls?.length < 2}
                  onClick={() => setOpenEvidenceSnap(true)}
                >
                  Evidence
                </Button>
                <div className="mt-2">
                <span className="font-semibold text-sm items-center leading-6 text-[#000]">
                Inform through
                </span>
                  <div className="justify-between">
              
              <p className="flex gap-1 items-center font-normal text-xs leading-6	text-[#333333]" >
                <input
                  type="checkbox"
                  checked={emailChecked}
                  onChange={handleEmailChange}
                  className="mr-1"
                />
                Email
              </p>
              <p className="flex gap-1 items-center font-normal text-xs leading-6 text-[#333333]	">
                <input
                  type="checkbox"
                  checked={smsChecked}
                  onChange={handleSmsChange}
                  className="mr-1"
                />
                SMS
              </p>
              <Button onClick={handleOkButtonClick} disabled={!emailChecked && !smsChecked} 
              className="rounded-sm py-3 h-2 mt-2"
              >
                Send
                </Button>
            </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-3">
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={"max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"}
        >
          <DialogHeader>
            <DialogTitle>Event Viewer</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* <EventViewerPopup eventImgObj={selectedElement} downloadSnap={downloadSnap}/> */}
          {/* <QuickView
          onRequestClose={toggleModal}
          details={selectedElement}
          selectedChannel={props.selectedChannel}
          playerRefs={props.playerRefs}
          handleSessionId={props.handleSessionId}
        /> */}
          <div className="h-[500px] bg-black p-2 pl-6">
            <div className="flex justify-between text-[#6F6F70]">
              <Image
                src="/vectors/video-icon.svg"
                alt="video-icon"
                width={20}
                height={2}
              />
              <span>{selectedEvent?.cameraName}</span>
              <span className="font-medium text-[#6F6F70]">
                ...
                {/* <Button
                  variant="outline"
                  className="border-none "
                  onClick={props.onRequestClose}
                >
                  x
                </Button> */}
              </span>
            </div>
            <div>
              {/* <div className="align-center relative top-5 flex justify-center">
                <AspectRatio ratio={16 / 9} className="">
                  {storeRes[0]?.hlsurl ? (
                    <ReactPlayer
                      url={`${process.env.NEXT_PUBLIC_URL}${storeRes[0].hlsurl}`}
                      muted={true}
                      playing={true}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div
                      className={`relative top-[20%] flex flex-row items-center justify-center `}
                    >
                      <Image
                        alt="videonetics-logo"
                        src="/vectors/Videonetics_logo.svg"
                        width={80}
                        height={80}
                      />
                    </div>
                  )}
                </AspectRatio>
              </div> */}
            </div>
          </div>
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
              <ImageWithMagnifier src={selectedEvent?.eventsrc} />
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

//Testing
class WebRTC {
  constructor(
    base_url,
    site,
    channel,
    app,
    live,
    stream,
    timestamp,
    video_element,
    stunserverip,
    stunserverport
  ) {
    this.url =
      base_url +
      "/stream/site/" +
      site +
      "/channel/" +
      channel +
      "/app/" +
      app +
      "/live/" +
      live +
      "/stream/" +
      stream +
      "/timestamp/" +
      timestamp +
      "/webrtc"

    this.videoElement = video_element
    this.videoElement.addEventListener("loadeddata", (event) => {
      this.videoElement.play()
    })
    this.mediaStream
    this.rtcPeer
    this.stunserverip = stunserverip
    this.stunserverport = stunserverport
  }

  async start() {
    console.log("start streaming, url:", this.url)
    const peerConfig = {
      iceServers: [
        {
          urls: ["stun:" + this.stunserverip + ":" + this.stunserverport],
        },
      ],
      sdpSemantics: "unified-plan",
    }
    this.mediaStream = new MediaStream()
    this.videoElement.srcObject = this.mediaStream
    this.rtcPeer = new RTCPeerConnection(peerConfig)

    let offer = await this.rtcPeer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    console.log("offer:", offer)
    await this.rtcPeer.setLocalDescription(offer)

    this.rtcPeer.onsignalingstatechange = this.signalingStateChangeHandler(
      this.rtcPeer
    )
    this.rtcPeer.ontrack = (event) => this.onTrackHandler(event)
  }

  async signalingStateChangeHandler(rtcPeer) {
    console.log("signaling state changed, state: " + rtcPeer.signalingState)
    switch (rtcPeer.signalingState) {
      case "have-local-offer":
        $.post(
          this.url,
          {
            data: btoa(rtcPeer.localDescription.sdp),
          },
          function (arg_data) {
            try {
              console.log("answer:\n", atob(arg_data))
              rtcPeer.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: atob(arg_data),
                })
              )
            } catch (e) {
              console.warn(e)
            }
          }
        )
        break
      case "stable":
        break
      case "closed":
        break
    }
  }

  async onTrackHandler(event) {
    if (event.streams.length > 0) {
      console.log(event.streams.length + " track is received")
    } else {
      console.log("no track is received")
    }
    this.mediaStream.addTrack(event.track)
  }

  async stop() {
    console.log("stop live called")
    this.mediaStream.getTracks().forEach((track) => track.stop())
    this.rtcPeer.close()
    this.videoElement.srcObject = null
  }
}

export default EventsNew
