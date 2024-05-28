"use client"

import { useEffect, useRef, useState } from "react"
// import Image from "next/image"
import dynamic from "next/dynamic"
import { usePathname, useRouter } from "next/navigation"
import useStore from "@/store/store"
import {
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  SpeakerLoudIcon,
  SpeakerQuietIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@radix-ui/react-icons"
import TimeRangePicker from "@wojtekmaj/react-timerange-picker"
import { format } from "date-fns"
import html2canvas from "html2canvas"
import * as $ from "jquery"
import { Calendar as CalendarIcon } from "lucide-react"
import ReactPlayer from "react-player"

import {
  enableVehicleNumber,
  getAlertTypes,
  getFileContent,
  keepAlive,
  keepAliveArchive,
  startArchive,
  startLive,
  stopArchive,
  stopLive,
  triggerEvent,
} from "@/lib/api"
import { cn } from "@/lib/utils"
// import VideoPlayer from "@/components/video/video"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Calendar } from "@/components/ui/calendar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import EventStomp from "@/components/eventStomp/index"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import VideoPlayer from "@/components/videoPlayer"

import { Button } from "../ui/button"

// import { display, displayText } from "./sidebar"

export const selectedcameraList = []
export const gridArrayCameraList = []
let selectedCameraListTemp = []
let gridArrayCameraListTemp = []
const Image = dynamic(() => import("next/image"))

const LiveGrid = () => {
  const { displayText, toggleDisplayText } = useStore()
  const { toast } = useToast()
  const [isFullScreen, setIsFullScreen] = useState(false)
  // const selectedCameras = useStore((state) => state.selectedCameras)
  const {
    selectedCameras,
    retryCamera,
    updateCameras,
    resetCamera,
    resetSelectedCamera,
    channels,
    addCamera,
    addCameraToCertainIndex,
    updateCameraArchive,
    setSelectedCameras,
    gridArray,
    pasteStream,
    setGridArray,
    channelList,
    setChannelList,
  } = useStore()
  const addBookMark = useStore((state) => state.addBookMark)
  const setBookMarkedList = useStore((state) => state.setBookMarkedList)
  const gridSize = useStore((state) => state.gridSize)
  const setGridSize = useStore((state) => state.setGridSize)
  const [date, setDate] = useState()
  const [value, onChange] = useState(["00:00", "23:59"])
  const bookMarkedList = useStore((state) => state.bookMarkedList)
  // const [gridSize, setGridSize] =useState(3)
  const router = useRouter()
  const [openBookmarkModal, setOpenBookmarkModal] = useState(true)
  const [bookmarkName, setBookmarkName] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [val, setVal] = useState("")
  const [importDialog, setImportDialog] = useState(false)
  const [triggerEventDialog, setTriggerEventDialog] = useState(false)
  const [replayDialog, setReplayDialog] = useState(false)
  const [camId, setCamId] = useState("")
  const [analytics, setAnalytics] = useState([])
  const [analytics3, setAnalytics3] = useState([])
  const [vehicleNo, setVehicleNo] = useState("")
  const [analyticVal, setAnalyticVal] = useState("")
  const [priorityVal, setPriorityVal] = useState("")
  const [message, setMessage] = useState("")
  const [action, setAction] = useState("")
  const junctionMsId = useStore((state) => state.junctionMsId)
  const [startTimeStamp, setStartTimeStamp] = useState(null)
  const [endTimeStamp, setEndTimeStamp] = useState(null)
  const archiveStreamingId = useStore((state) => state.archiveStreamingId)
  const setArchiveStreamingId = useStore((state) => state.setArchiveStreamingId)
  const [imgData, setImgData] = useState(null)
  const archiveMode = useStore((state) => state.archiveMode)
  const setArchiveMode = useStore((state) => state.setArchiveMode)
  const [isCopy, setIsCopy] = useState(false)
  const [copyId, setCopyId] = useState("")
  const [cellId, setCellId] = useState(null)
  const playerWrapperRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mute, setMute] = useState(true)
  const updateSelectedCamera = useStore((state) => state.updateSelectedCamera)
  const setFromLive = useStore((state) => state.setFromLive)
  const setSelectedChannelId = useStore((state) => state.setSelectedChannelId)
  const pathname = usePathname()
  const inputRef = useRef()

  const focusInput = () => {
    inputRef.current.focus()
  }
  const menuOptionsNoStream = isCopy
    ? [
        {
          src: "/vectors/paste-icon.svg",
          menuOption: "Paste",
          value: "paste",
          alt: "paste-icon",
        },
        {
          src: "/vectors/Import camera.svg",
          menuOption: "Import Camera",
          value: "import",
          alt: "import-camera-icon",
        },
        {
          src: "/vectors/Clear_all.svg",
          menuOption: "Clear All View",
          value: "clear all",
          alt: "clearall-view-icon",
        },
        {
          src: "/vectors/Analytics.svg",
          menuOption: "Set Analytics",
          value: "set analytics",
          alt: "set-analytics-icon",
        },
      ]
    : [
        {
          src: "/vectors/Import camera.svg",
          menuOption: "Import Camera",
          value: "import",
          alt: "import-camera-icon",
        },
        {
          src: "/vectors/Clear_all.svg",
          menuOption: "Clear All View",
          value: "clear all",
          alt: "clearall-view-icon",
        },
        {
          src: "/vectors/Analytics.svg",
          menuOption: "Set Analytics",
          value: "set analytics",
          alt: "set-analytics-icon",
        },
      ]

  const menuOptions = [
    {
      src: "/vectors/copy-icon.svg",
      menuOption: "Copy",
      value: "copy",
      alt: "copy-icon",
    },

    {
      src: "/vectors/Replay_video.svg",
      menuOption: "Replay From",
      value: "replay",
      alt: "replay-icon",
    },
    {
      src: "/vectors/Go to live.svg",
      menuOption: "Go to Live",
      value: "live",
      alt: "live-icon",
    },
    {
      src: "/vectors/Import camera.svg",
      menuOption: "Import Camera",
      value: "import",
      alt: "import-camera-icon",
    },
    {
      src: "/vectors/Analytics View.svg",
      menuOption: "Analytics View",
      value: "analytics view",
      alt: "analytics-view-icon",
    },
    {
      src: "/vectors/Clear.svg",
      menuOption: "Clear View",
      value: "clear",
      alt: "clear-view-icon",
    },
    {
      src: "/vectors/Clear_all.svg",
      menuOption: "Clear All View",
      value: "clear all",
      alt: "clearall-view-icon",
    },
    {
      src: "/vectors/trigger-event.svg",
      menuOption: "Trigger Event",
      value: "Trigger",
      alt: "trigger-event-icon",
    },
    {
      src: "/vectors/Show_Event.svg",
      menuOption: "Show Event",
      value: "show event",
      alt: "show-event-icon",
    },
    {
      src: "/vectors/Analytics.svg",
      menuOption: "Set Analytics",
      value: "set analytics",
      alt: "set-analytics-icon",
    },
    {
      src: "/vectors/Archive.svg",
      menuOption: "Go Archive Search",
      value: "archive",
      alt: "archive-icon",
    },
    {
      src: "/vectors/camera-setting.svg",
      menuOption: "Camera Settings",
      value: "camera setting",
      alt: "camera-setting-icon",
    },
    {
      src: "/vectors/Open in browser.svg",
      menuOption: "Open in Browser",
      value: "browser",
      alt: "open-in-browser-icon",
    },
    {
      src: "/vectors/camera name.svg",
      menuOption: "Show Camera Name",
      value: "camera name",
      alt: "camera-name-icon",
    },
    // {
    //   src: "/vectors/Statistics.svg",
    //   menuOption: "Show Statistics",
    //   value: "statistics",
    //   alt: "statistics-icon",
    // },
  ]
  useEffect(() => {
    const getTimeStamps = () => {
      const startDate =
        date?.toString().split("").slice(0, 15).join("") +
        " " +
        value[0] +
        ":00" +
        " " +
        "GMT+0530 (India Standard Time)"
      const endDate =
        date?.toString().split("").slice(0, 15).join("") +
        " " +
        value[1] +
        ":00" +
        " " +
        "GMT+0530 (India Standard Time)"
      const epochstartTimeStamp = new Date(startDate).getTime()
      const epochendTimeStamp = new Date(endDate).getTime()
      setStartTimeStamp(epochstartTimeStamp)
      setEndTimeStamp(epochendTimeStamp)
    }
    getTimeStamps()
  }, [date, setEndTimeStamp, setStartTimeStamp, value])
  const stopLiveVideos = async () => {
    const streams = selectedCameras.filter((x) => x.streamsessionid)
    console.log(streams, "streams")

    streams.forEach(async (item, index) => {
      await stopLive(item.streamsessionid)
      resetCamera()
    })
  }
  useEffect(() => {
    setBookMarkedList()
    return async () => {
      await stopLiveVideos()
    }
  }, [])
  useEffect(() => {
    setFromLive(false)
    setChannelList()
  }, [])
  console.log(channelList, "channelList")
  useEffect(() => {
    resetCamera()
  }, [])
  // console.log(selectedCameras)
  selectedCameraListTemp = selectedCameras
  gridArrayCameraListTemp = gridArray
  var index
  for (index = 0; index < selectedCameras.length; index++) {
    const cameraObject = {
      camId: selectedCameras[index].camId,
      isLoading: selectedCameras[index].isLoading,
      loadingMessage: selectedCameras[index].loadingMessage,
      name: selectedCameras[index].name,
    }

    selectedcameraList.push(cameraObject)
  }
  var index2
  for (index2 = 0; index2 < gridArray.length; index2++) {
    const cameraObject = {
      camId: gridArray[index2]?.camId,
      isLoading: gridArray[index2]?.isLoading,
      loadingMessage: gridArray[index2]?.loadingMessage,
      name: gridArray[index2]?.name,
    }
    gridArrayCameraList.push(cameraObject)
  }

  useEffect(() => {
    if (selectedCameras.length) {
      selectedCameras.map((camera) => {
        if (camera.loadingMessage === "Stream Loaded") {
          // setSelectedCameraList(camera.camId, true)
        }
      })
    }
  }, [selectedCameras])

  useEffect(() => {
    const cameraStreamSessions = selectedCameras.filter(
      (cam) => cam.streamsessionid
    )

    const interval = setInterval(() => {
      cameraStreamSessions.map((item, index) => {
        keepAlive(item.streamsessionid)
      })
    }, 30000)
    return () => {
      clearInterval(interval)
    }
  }, [pathname, selectedCameras])

  // useEffect(() => {
  //   const cameraStreamSessions = selectedCameras.filter(
  //     (cam) => cam.streamsessionid
  //   )

  //   const interval = setInterval(() => {
  //     cameraStreamSessions.map((item, index) => {
  //       keepAliveArchive(item.streamsessionid)
  //     })
  //   }, 30000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [selectedCameras])

  useEffect(() => {
    const fetchAndValidateTriggerEvent = async () => {
      const res = await getAlertTypes()
      const res3 = await enableVehicleNumber()
      setAnalytics(res)
      setAnalytics3(res3)
    }
    fetchAndValidateTriggerEvent()
  }, [])

  useEffect(() => {
    let intervalId = null
    if (archiveStreamingId.length > 0) {
      intervalId = setInterval(() => {
        keepAliveArchive(archiveStreamingId[0].streamsessionid)
      }, 30000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [archiveStreamingId])
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari & Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        /* Firefox */
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullscreen()
      } else if (playerWrapper.msRequestFullscreen) {
        /* IE/Edge */
        document.documentElement.msRequestFullscreen()
      }
    }
  }

  const getIpName = (channelId) => {
    console.log(channelId)
    const arr = channels.find((x) => x.id === channelId)

    const url = `http://${arr.ip}`
    window.open(url, "_blank")
  }
  const handleShowCamera = () => {
    setShowCamera(!showCamera)
  }
  const handleImportValue = (e) => {
    setVal(e.target.value)
  }
  const importCameraDialog = (camId) => {
    setImportDialog(!importDialog)
    setCamId(camId)
  }
  const imgRes = async (eventObj) => {
    const res = await getFileContent(eventObj)
    let base64String = "data:image/png;base64," + res
    setImgData(base64String)
  }
  const targetElementRef = useRef(null)
  const handleCapture = () => {
    if (!targetElementRef.current) return

    html2canvas(targetElementRef.current).then((canvas) => {
      // Convert the canvas to an image and create a download link
      const screenshotImage = canvas.toDataURL()
      let eventObj = {
        filePath: screenshotImage,
      }
      setImgData(screenshotImage)
      // imgRes(eventObj)
      // const link = document.createElement('a');
      // link.download = 'screenshot.png';
      // link.href = screenshotImage;
      // link.click();
    })
  }
  const handleTriggerEventDialog = (camId) => {
    setTriggerEventDialog(!triggerEventDialog)
    setCamId(camId)
    handleCapture()
  }
  const handleReplay = (camId) => {
    setReplayDialog(!replayDialog)
    setCamId(camId)
    // display()
    // toggleDisplayText()
  }
  const handleSubmit = async (stream) => {
    setImportDialog(false)
    const selCam = selectedCameras.find((x) => x.camId === stream?.camId)

    if (selCam?.streamsessionid) {
      await stopLive(selCam.streamsessionid)
    }
    resetSelectedCamera(stream?.camId)
    const arr =
      val.length > 1
        ? channelList.find((obj) => obj.ip.toLowerCase().includes(val))
        : channelList.find((obj) => obj.id === parseFloat(val))
    console.log(arr)
    if (!arr) {
      toast({
        variant: "destructive",
        // title: "Scheduled: Catch up",
        description: "No camera exists with number/ip " + val,
        duration: 3000,
      })
      setVal("")
      setCamId("")
      return
    }
    setVal("")
    setCamId("")
    addCamera({
      camId: arr.id,
      isLoading: true,
      name: arr.name,
      loadingMessage: "Starting Stream",
    })
    const liveVideopayload = {
      channelid: arr.id,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: true,
    }
    let valueReturned = updateCamera(arr.id, liveVideopayload)
    console.log("valueReturned", valueReturned)
    valueReturned
      .then((liveRes) => {
        console.log("Promise resolved with result:", liveRes)
        updateSelectedCamera(arr.id, "Stream Loaded", liveRes)
        setSelectedCameraList(arr.id, true)
      })
      .catch((error) => {
        console.error("Promise rejected with error:", error)
        updateSelectedCamera(arr.id, "Error")
        setSelectedCameraList(arr.id, false)
      })
  }
  // console.log(selectedCameras,'selectedCameras')
  console.log(gridArray, "gridArray")
  const clearView = (camId) => {
    const playingChannel = selectedCameras.find(
      (x) => x.camId === camId
    ).streamsessionid
    setGridArray(camId)
    if (playingChannel) {
      stopLive(playingChannel)
    }

    resetSelectedCamera(camId)
  }
  const handleArchive = async (stream) => {
    clearView(stream)
    router.push("/vdo/archive")
    const selectedChannel = channels.find((obj) => obj.id === stream)
    addCamera({
      camId: selectedChannel.id,
      isLoading: true,
      name: selectedChannel.name,
      loadingMessage: "Starting Stream",
    })
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const unixTimestamp = currentDate.getTime()
    const archiveVideoPayload = {
      channelid: stream,
      starttimestamp: unixTimestamp,
      resolutionwidth: 898,
      resolutionheight: 505,
      withaudio: true,
    }
    const response = await startArchive(archiveVideoPayload, stream)
    await delay(10000)
    setArchiveStreamingId(response.data.result)
  }
  function base64ToBytes(base64String) {
    let cutBase64 = base64String.split(",")
    cutBase64 = cutBase64[1]
    const binaryString = atob(cutBase64)
    const bytes = new Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    console.log(new Uint8Array(bytes), "bytes")
    return bytes
  }
  const saveTriggerEvent = async () => {
    const payload = {
      event: {
        action: action,
        channelId: camId,
        clipStatus: 0,
        endTime: Math.floor(new Date().getTime()),
        eventType: analytics.find((evnt) =>
          evnt.alertname.includes(analyticVal)
        ).alerttype,
        eventStatus:
          analytics.find((evnt) => evnt.alertname.includes(analyticVal))
            .alerttype === 328 ||
          analytics.find((evnt) => evnt.alertname.includes(analyticVal))
            .alerttype === 302
            ? 2
            : 0,
        message: message,
        objectId: vehicleNo,
        modifiedobjectId: vehicleNo,
        msId: junctionMsId,
        priority: priorityVal,
        snapList: new Array(base64ToBytes(imgData)),
        startTime: Math.floor(new Date().getTime()),
      },
      snapList: new Array(base64ToBytes(imgData)),
    }
    await triggerEvent(payload)
    setTriggerEventDialog(false)
    setMessage("")
    setAction("")
    setVehicleNo("")
    setAnalyticVal("")
    setPriorityVal("")
    setCamId("")
  }
  const handleShowEvent = (id) => {
    clearView(id)
    setSelectedChannelId(id)
    setFromLive(true)
    router.push("/vdo/eventsnew")
  }
  //  console.log(selectedCameras,'selectedCameras')

  const handleGoLive = async (id) => {
    if (archiveMode) {
      if (archiveStreamingId) {
        await stopArchive(archiveStreamingId)
      }
      resetSelectedCamera(id)
      const selectedChannel = channels.find((obj) => obj.id === id)
      addCamera({
        camId: selectedChannel.id,
        isLoading: true,
        name: selectedChannel.name,
        loadingMessage: "Starting Stream",
      })
      const liveVideopayload = {
        channelid: id,
        resolutionwidth: 892,
        resolutionheight: 481,
        withaudio: true,
      }

      updateCamera(id, liveVideopayload)
    }
    setArchiveMode(false)
  }

  const handleCopy = (id) => {
    setIsCopy(true)
    setCopyId(id)
  }
  const handlePaste = async (id) => {
    // setIsCopy(false)
    // const findStream = gridArray?.find((stream) => stream?.camId === id)
    pasteStream(cellId, copyId)
    setIsCopy(false)
    // const findChannelName = channels.find((obj) => obj.id === copyId)?.name
    // addCameraToCertainIndex(findStream, cellId)
    // const liveVideopayload = {
    //   channelid: copyId,
    //   resolutionwidth: 892,
    //   resolutionheight: 481,
    //   withaudio: true,
    // }
    // var valueReturned = updateCamera(copyId, liveVideopayload)
    // valueReturned
    //   .then((liveRes) => {
    //     console.log("Promise resolved with result:", liveRes)

    //     updateSelectedCamera(copyId, "Stream Loaded", liveRes)
    //     setSelectedCameraList(copyId, true)
    //   })
    //   .catch((error) => {
    //     console.error("Promise rejected with error:", error)
    //     // setSelectedCameras([
    //     //   ...selectedCameras,
    //     //   {hasError: true, camId:id, name:name, isLoading:false, loadingMessage:'Error'},
    //     // ])
    //     updateSelectedCamera(copyId, "Error")
    //     setSelectedCameraList(copyId, false)
    //   })
  }

  const handleMenuNoStreamOptions = (menuOption) => {
    console.log(menuOption, "MenuOption")
    switch (menuOption) {
      case "copy":
        handleCopy(stream.camId)
      case "paste":
        handlePaste()
        break
      case "set analytics":
        router.push(`/configuration/server-storage/junction/${junctionMsId}`)
        break
      case "import":
        setImportDialog(!importDialog)
        break
      case "clear all":
        resetCamera()
        break
    }
  }
  const handleMenuOptions = (menuOption, stream) => {
    console.log(menuOption, "MenuOption")
    switch (menuOption) {
      case "clear":
        clearView(stream.camId)
        break
      case "clear all":
        resetCamera()
        break
      case "browser":
        getIpName(stream.camId)
        break
      case "camera name":
        handleShowCamera()
        break
      case "import":
        importCameraDialog(stream.camId)
        break
      case "archive":
        handleArchive(stream.camId)
        break
      case "Trigger":
        handleTriggerEventDialog(stream.camId)
        break
      case "replay":
        handleReplay(stream.camId)
        break
      case "live":
        handleGoLive(stream.camId)
        break
      case "show event":
        handleShowEvent(stream.camId)
        break
      case "camera setting":
        router.push("/configuration/camera-configuration")
        break
      case "set analytics":
        router.push(`/configuration/server-storage/junction/${junctionMsId}`)
        break
      case "copy":
        handleCopy(stream.camId)
      default:
        break
    }
  }
  const addBM = async (bmName) => {
    let emptyGridChannelId = -1
    let itemstore = []
    selectedCameras.forEach((item, index) => {
      if (Object.keys(item).length > 0) {
        const { camId: channelId, streamsessionid: startTimestamp } = item
        itemstore.push({ channelId, startTimestamp })
      }
    })
    const items = new Array(gridSize * gridSize).fill(null).map((_, i) => {
      return itemstore[i] || { id: emptyGridChannelId, startTimestamp: 0 }
    })

    const payload = {
      channelBookmarks: items,
      grid: gridSize,
      name: bmName,
    }
    setOpenBookmarkModal(false)
    setBookmarkName("")
    const profileId = JSON.parse(localStorage.getItem("user-info")).profileId
    console.log(profileId)
    await addBookMark(profileId, payload)
    await setBookMarkedList()
  }
  const handleBookmarkNameChange = (event) => {
    setBookmarkName(event.target.value)
  }
  // console.log(selectedCameras)
  const retryStream = async (stream) => {
    if (!archiveMode) {
      const liveVideopayload = {
        channelid: stream.camId,
        resolutionwidth: 892,
        resolutionheight: 481,
        withaudio: true,
      }
      await retryCamera(stream)
      updateCamera(stream.camId, liveVideopayload)
    } else {
      const archiveVideoPayload = {
        channelid: stream.camId,
        starttimestamp: startTimeStamp,
        resolutionwidth: 898,
        resolutionheight: 505,
        withaudio: true,
      }
      await retryCamera(stream)
      await updateCameraArchive(stream.camId, archiveVideoPayload)
      // const response = await startArchive(archiveVideoPayload, stream)
      // await delay(10000)
      // setArchiveStreamingId(response.data.result)
      // const liveVideopayload = {
      //   channelid: stream.camId,
      //   resolutionwidth: 892,
      //   resolutionheight: 481,
      //   withaudio: false,
      // };
      // await retryCamera(stream);
      // await updateCamera(stream.camId, liveVideopayload);
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1)
  }

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.1))
  }

  const handleMaximizeMinimize = (channelId) => {
    const videoElement = document.getElementById(channelId)
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

  const enableVehicleNumberInput =
    analytics3?.length > 0 &&
    analytics3.some((obj) => obj.alertname.includes(analyticVal))
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const handleReplayFrom = async () => {
    setReplayDialog(!replayDialog)
    setArchiveMode(true)
    clearView(camId)
    const arr = channels.find((obj) => obj.id === camId)
    addCamera({
      camId: arr.id,
      isLoading: true,
      name: arr.name,
      loadingMessage: "Starting Stream",
    })
    const payload = {
      channelid: camId,
      name: arr.name,
      starttimestamp: startTimeStamp,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: true,
    }
    console.log("arr", payload)

    await updateCameraArchive(camId, payload)
    // const response = await startArchive(payload, camId)
    // await delay(10000)
    // setArchiveStreamingId(response.data.result)
  }
  return (
    <div
      className={`bg-white ${
        isFullScreen
          ? "fixed bottom-[10px] right-0 z-50 my-1 h-screen w-screen px-2 py-6"
          : "mt-[-3.5em]"
      }`}
    >
      <div className={`py-2 flex gap-2 justify-end`}>
        <Popover>
          <PopoverTrigger
            onMouseEnter={() => setOpenBookmarkModal(true)}
            asChild
            className="gap-2"
          >
            <Button variant={"outline"}>
              <Image
                src="/vectors/bookmark.svg"
                width={15}
                height={15}
                className="mr-2"
                alt="bookmark icon"
              />
              Add Bookmark
            </Button>
          </PopoverTrigger>
          {openBookmarkModal && (
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="grid w-full grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Bookmark Name</Label>
                    <Input
                      type="text"
                      value={bookmarkName}
                      onChange={handleBookmarkNameChange}
                      placeholder="Enter bookmark "
                      className="h-[18px] w-[180px]"
                    />
                  </div>
                  <Button onClick={() => addBM(bookmarkName)}>Save</Button>
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
        <Button variant={"outline"} onClick={() => toggleFullScreen()}>
          {isFullScreen ? (
            <ExitFullScreenIcon className="mr-2" />
          ) : (
            <Image
              src="/vectors/fullscreen.svg"
              width={15}
              height={15}
              className="mr-2"
              alt="fullscreen icon"
            />
          )}

          {isFullScreen ? "Exit Full Screen" : "Full Screen View"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {" "}
              <Image
                src="/vectors/grid.svg"
                width={15}
                height={15}
                className="mr-2"
                alt="grid icon"
              />
              {gridSize}*{gridSize}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Grid Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={gridSize}
              onValueChange={setGridSize}
            >
              <DropdownMenuRadioItem value={1}>1*1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={2}>2*2</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={3}>3*3</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={`grid grid-cols-${gridSize} grid-rows-${gridSize} gap-1 w-full`}
      >
        {gridArray?.map((stream, index) => {
          return stream ? (
            <div
              className="relative"
              key={`ls-${index}`}
              ref={targetElementRef}
            >
              <div className="absolute top-0 left-0 w-full z-20 bg-black opacity-50 flex gap-2 text-xs text-white items-center p-1">
                <Image
                  src="/vectors/video-icon.svg"
                  width={20}
                  height={20}
                  alt="video icon"
                />
                {stream?.name}
              </div>
              {stream?.hasError && (
                <div className="w-full h-full absolute top-0 left-0 flex flex-col justify-center items-center z-20 text-red-600">
                  <div>Error!.. </div>
                  <div
                    className="bg-black opacity-50 p-1 text-xs text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => retryStream(stream)}
                  >
                    Retry
                  </div>
                </div>
              )}
              <Dialog
                open={importDialog || triggerEventDialog || replayDialog}
                onOpenChange={() =>
                  importDialog
                    ? setImportDialog(false)
                    : triggerEventDialog
                    ? setTriggerEventDialog(false)
                    : setReplayDialog(false)
                }
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <AspectRatio
                      ratio={isFullScreen ? 16 / 9 : 16 / 9}
                      className={`w-full bg-gray-900 ${
                        stream?.isLoading ? "" : ""
                      }`}
                    >
                      {stream?.isLoading ? (
                        <div className="text-white  w-full h-full flex flex-col items-center justify-center">
                          <div>
                            <div className="animate-spin ease-linear rounded-full border-4 border-t-4 border-t-primary border-gray-200 h-4 w-4"></div>
                          </div>
                          <div className="ml-2 animate-bounce mt-4 text-xs">
                            {" "}
                            {stream.loadingMessage
                              ? stream.loadingMessage
                              : "Loading"}{" "}
                            <span className="animate-bounce">...</span>{" "}
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-full w-full overflow-hidden">
                          <video
                            // url={`${process.env.NEXT_PUBLIC_URL}${stream.hlsurl}`}
                            muted={true}
                            playing="true"
                            width="100%"
                            height="90%"
                            gridFullScreen={isFullScreen}
                            style={{ objectFit: "cover" }} // Add this line to maintain aspect ratio
                            id={stream?.camId}
                          />
                          <div className="absolute top-0 left-0 w-full h-full flex items-end  gap-4 justify-end p-4">
                            <p
                              className={`z-30  text-white opacity-50 rounded-xl transition-all p-1 ${
                                isFullscreen ? "w-8 h-8" : "w-11 h-6 "
                              } `}
                            >
                              {displayText ? "Replay" : "Live"}
                            </p>
                            <button
                              onClick={() => setMute(false)}
                              className={`z-30  text-white opacity-50 rounded-xl transition-all p-1 ${
                                isFullscreen ? "w-8 h-8" : "w-5 h-5"
                              } `}
                              disabled={mute ? false : true}
                            >
                              <SpeakerLoudIcon />
                            </button>
                            <button
                              onClick={() => setMute(true)}
                              className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${
                                isFullscreen ? "w-8 h-8" : "w-5 h-5"
                              } `}
                              disabled={mute ? true : false}
                            >
                              <SpeakerQuietIcon />
                            </button>
                            {/* <button onClick={handleZoomIn} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen ? 'w-8 h-8' : 'w-5 h-5'} `}>
                      <ZoomInIcon />
                    </button>
                    <button onClick={handleZoomOut} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen ? 'w-8 h-8' : 'w-5 h-5'} `}>
                      <ZoomOutIcon />
                    </button> */}
                            <button
                              onClick={() =>
                                handleMaximizeMinimize(stream?.camId)
                              }
                              className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${
                                isFullscreen ? "w-8 h-8" : "w-5 h-5"
                              } `}
                            >
                              {isFullscreen ? (
                                <ExitFullScreenIcon className="w-full h-full" />
                              ) : (
                                <EnterFullScreenIcon className="w-full h-full" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </AspectRatio>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {menuOptions.map((item, index) => (
                      <ContextMenuItem
                        textValue={item.value}
                        key={index}
                        onSelect={() => handleMenuOptions(item.value, stream)}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Image
                            alt={item.alt}
                            src={item.src}
                            width={24}
                            height={24}
                          />
                          <span className="text-[#6F6F70]">
                            {item.menuOption}
                          </span>
                        </div>
                      </ContextMenuItem>
                    ))}
                  </ContextMenuContent>
                </ContextMenu>
                {importDialog ? (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enter Camera IP/ Id</DialogTitle>
                      <DialogDescription>
                        <div className="flex flex-col gap-4">
                          <input
                            type="text"
                            ref={inputRef}
                            value={val}
                            onChange={(event) => {
                              handleImportValue(event)
                            }}
                            className="h-10"
                          />
                          <Button
                            type="submit"
                            onClick={() => handleSubmit(stream)}
                          >
                            Submit
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                ) : triggerEventDialog ? (
                  <DialogContent
                    className={
                      "max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"
                    }
                  >
                    <DialogHeader>
                      <DialogTitle>Trigger Event</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="flex flex-col gap-4">
                      <div className="h-[320px] w-full border-2">
                        {imgData !== null && (
                          <Image
                            className="h-full w-full"
                            src={imgData}
                            width="100"
                            height="100"
                            alt="event snap"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-start justify-start gap-2">
                          <p>Analytic</p>
                          <Select
                            value={analyticVal}
                            onValueChange={(e) => setAnalyticVal(e)}
                          >
                            <SelectTrigger className="w-[100%]">
                              <SelectValue>
                                {analyticVal !== ""
                                  ? analyticVal
                                  : "Select Analytic"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {analytics?.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item.alertname}
                                  >
                                    {item.alertname}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {enableVehicleNumberInput && (
                          <div className="flex flex-col items-start justify-start gap-2">
                            <p>Vehicle Number</p>
                            <Input
                              type="text"
                              placeholder="Enter Vehicle Number"
                              onChange={(e) => setVehicleNo(e.target.value)}
                              className="h-10 w-full border"
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-start justify-start gap-2">
                          <p>Priority</p>
                          <Select
                            value={priorityVal}
                            onValueChange={(e) => setPriorityVal(e)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {priorityVal !== ""
                                  ? priorityVal
                                  : "Select Priority"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Priority</SelectLabel>
                                <SelectItem value="0">Critical</SelectItem>
                                <SelectItem value="1">Medium</SelectItem>
                                <SelectItem value="2">Low</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2">
                          <p>Message</p>
                          <Input
                            type="text"
                            placeholder="Enter Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2">
                          <p>Action</p>
                          <Input
                            type="text"
                            placeholder="Enter Action"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <Button
                          cursorPointer
                          onClick={saveTriggerEvent}
                          className="w-[50%]"
                        >
                          Save
                        </Button>
                      </div>
                    </DialogDescription>
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                ) : (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Replay From</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="flex flex-col items-center gap-[1em] py-[1em]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <TimeRangePicker onChange={onChange} value={value} />
                        <Button onClick={handleReplayFrom}>Submit</Button>
                      </div>
                    </DialogDescription>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          ) : (
            <Dialog
              open={importDialog}
              onOpenChange={() => setImportDialog(false)}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <AspectRatio
                    ratio={isFullScreen ? 16 / 9 : 16 / 9}
                    className="bg-gray-900"
                  >
                    <div
                      className="flex h-full w-full flex-col items-center justify-center"
                      onContextMenu={() => setCellId(index)}
                    >
                      <Image
                        src="/vectors/Videonetics_logo (1).svg"
                        alt="logo"
                        width={80}
                        height={80}
                      />
                    </div>
                  </AspectRatio>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {menuOptionsNoStream.map((item, index) => (
                    <ContextMenuItem
                      textValue={item.value}
                      key={index}
                      onSelect={() => handleMenuNoStreamOptions(item.value)}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          alt={item.alt}
                          src={item.src}
                          width={24}
                          height={24}
                        />
                        <span className="text-[#6F6F70]">
                          {item.menuOption}
                        </span>
                      </div>
                    </ContextMenuItem>
                  ))}
                </ContextMenuContent>
              </ContextMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Camera IP/ Id</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        ref={inputRef}
                        value={val}
                        onChange={(event) => {
                          handleImportValue(event)
                        }}
                        className="h-10"
                      />
                      <Button
                        type="submit"
                        onClick={() => handleSubmit(stream)}
                      >
                        Submit
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
      {/* <EventStomp /> */}
    </div>
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

var webrtc
var webrtcURL
var stunserveraddress
var stunserverport
var channelId
var streamsessionid

export const updateCamera = async (id, payload) => {
  const response = await startLive(payload, id)
  const liveRes = response.data.result[0]

  console.log(response)

  var returnValue = false

  if (response.status === 200) {
    var streamingserveraddress = response.data.result[0].streamingserveraddress
    var streamingserverport = response.data.result[0].streamingserverport
    stunserveraddress = response.data.result[0].stunserveraddress
    stunserverport = response.data.result[0].stunserverport
    channelId = response.data.result[0].vStreamingDetailsModel.channelId
    streamsessionid = response.data.result[0].streamsessionid

    webrtcURL = "http://" + streamingserveraddress + ":" + streamingserverport

    returnValue = liveRes
  } else {
    returnValue = null
  }
  return returnValue
}

export const setSelectedCameraList = async (id, isLoaded) => {
  // Iterate through the selectedcameraList to find the object with matching camId
  // alert("setSelectedCameraList")
  if (isLoaded) {
    for (let i = 0; i < selectedCameraListTemp.length; i++) {
      if (selectedCameraListTemp[i].camId === id) {
        selectedCameraListTemp[i].isLoading = false
        selectedCameraListTemp[i].loadingMessage = "Stream Loaded"
        selectedCameraListTemp[i].streamsessionid = streamsessionid
        break
      }
    }
    for (let i = 0; i < gridArrayCameraListTemp.length; i++) {
      if (gridArrayCameraListTemp[i].camId === id) {
        gridArrayCameraListTemp[i].isLoading = false
        gridArrayCameraListTemp[i].loadingMessage = "Stream Loaded"
        gridArrayCameraListTemp[i].streamsessionid = streamsessionid
        break
      }
    }
    selectedcameraList.find((x) => x.camId === id).streamsessionid =
      streamsessionid
    gridArrayCameraList.find((x) => x.camId === id).streamsessionid =
      streamsessionid
    setTimeout(function () {
      var element = document.getElementById(id)
      if (element) {
        console.log("Element with ID " + id + " is loaded:", element)
        webrtc = new WebRTC(
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
  }
}

export const stopLiveCamId = async (camId) => {
  const playingChannel = selectedcameraList.find(
    (x) => x.camId === camId
  ).streamsessionid
  const playingChannelInGrid = gridArrayCameraList.find(
    (x) => x.camId === camId
  ).streamsessionid
  if (playingChannel) {
    stopLive(playingChannel)
  }
  // if (playingChannelInGrid) {
  //   stopLive(playingChannelInGrid)
  // }
}

export default LiveGrid
