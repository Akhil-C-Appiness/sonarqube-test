import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { set } from "date-fns"
import html2canvas from "html2canvas"
import * as $ from "jquery"
import jsPDF from "jspdf"
import ReactPlayer from "react-player"
import useStore from "@/store/store"
import {
  getBarClips,
  keepAlive,
  startArchive,
  startLive,
  stopLive,
} from "@/lib/api"
import { HLBHelvetica } from "@/lib/fonts"
import isRTL from "@/lib/isRTL"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ImageWithMagnifier from "@/components/imageMag"

import { AspectRatio } from "./ui/aspect-ratio"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Table, TableCell, TableRow } from "./ui/table"
import { ValidateView } from "./validate-view"
let channelId
let streamsessionid
export function QuickView(props) {
  const contentRef = useRef()
  const [isValidateOpen, setValidateIsOpen] = useState(false)
  const [isLiveOpen, setIsLiveOpen] = useState(false)
  // const [storeRes, setStoreRes] = useState([])
  const [open2, setOpen2] = useState(false)
  const [open, setOpen] = useState(false)
  const [openVideoClip, setOpenVideoClip] = useState(false)
  const [openEvidenceSnap, setOpenEvidenceSnap] = useState(false)
  const [eventBarClip, setEventBarClip] = useState()
  const [currentTime, setCurrentTime] = useState("")
  const setSelectedCameras = useStore((state) => state.setSelectedCameras)
  const { selectedCameras, resetCamera } = useStore()
  let boldtext = `${HLBHelvetica.className} text-[15px] text-black font-semibold`
  const toggleValidate = () => {
    setValidateIsOpen(!isValidateOpen)
  }
  const toggleIsLive = async() => {
    if (selectedCameras.length > 0) {
      let element = document.getElementById("liveVideoplayer")
      if (element && element["webrtc"]){
        document.getElementById("liveVideoplayer")["webrtc"].stop()
        await stopLive(selectedCameras[0].streamsessionid)
        resetCamera()
      }
    }
    const liveVideopayload = {
      channelid: props.details.channelId,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: false,
    }
    updateCameraRequest(props.details.channelId, liveVideopayload)
    setOpen(true)
  }
  const updateCameraRequest = async (id, payload) => {
    const response = await startLive(payload, id)
    const liveRes = response.data.result[0]
    if (response.status === 200) {
      var streamingserveraddress = response.data.result[0].streamingserveraddress
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
      var webrtcURL = "http://" + streamingserveraddress + ":" + streamingserverport
      setTimeout(function () {
        var element = document.getElementById("liveVideoplayer")
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
  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        onRequestClose()
      }
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = "visible"
      document.removeEventListener("keydown", onKeyDown)
    }
  })
  const handlePrint = () => {
    window.print()
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
  const startVideoClip = async (data) => {
    console.log("data",data)
    const payload = {
      channelId: data.channelId,
      startingTime: data.endTime - 5000,
      endingTime: data.endTime + 5000,
    }
    console.log("payload :- ", payload)
    const barclipRes = await getBarClips(payload)
    console.log(barclipRes.data.result)
    setEventBarClip(barclipRes.data.result)
    setOpenVideoClip(true)
  }
  const triggerArchive = async (firstTimeStamp, id) => {
    const archiveVideoPayload = {
      channelid: id,
      starttimestamp: firstTimeStamp,
      resolutionwidth: 898,
      resolutionheight: 505,
      withaudio: true,
    }
    // await 
    updateCameraArchive(id, archiveVideoPayload)
  }
  const updateCameraArchive = async (id, payload) => {
    const response = await startArchive(payload)
    // const liveRes = response.data.result[0]
    if (response.status === 200) {
      var streamingserveraddress =
        response.data.result[0].streamingserveraddress
      var streamingserverport = response.data.result[0].streamingserverport
      var stunserveraddress = response.data.result[0].stunserveraddress
      var stunserverport = response.data.result[0].stunserverport
      channelId = response.data.result[0].vStreamingDetailsModel.channelId
      streamsessionid = response.data.result[0].streamsessionid

      var webrtcURL =  "http://" + streamingserveraddress + ":" + streamingserverport
      console.log("webrtcURL",webrtcURL)
      setTimeout(function () {
        var element = document.getElementById("videoplayer")
        if (element) {
          console.log("Element with ID " + id + " is loaded:", element)
          // var webrtc = new WebRTC(
          //   webrtcURL,
          //   1,
          //   id,
          //   -1,
          //   0,
          //   1,
          //   payload.starttimestamp,
          //   element,
          //   stunserveraddress,
          //   stunserverport
          // )
          var webrtc = new WebRTC(
            webrtcURL,
            1,
            id,
            -1,
            1,
            1,
            payload.starttimestamp,
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
  const stopWebRTC = () => {
    var element = document.getElementById("videoplayer")
    if (element && element["webrtc"]) {
      element["webrtc"].stop()
      console.log("WebRTC stream stopped.")
    } else {
      console.warn(
        "No WebRTC instance found for element with ID 'videoplayer'."
      )
    }
  }
  useEffect(() => {
    if (eventBarClip?.length) {
      console.log(eventBarClip[0], "eventBarClip")
      triggerArchive(eventBarClip[0].startTimeStamp, eventBarClip[0].channelID)
      setCurrentTime(eventBarClip[0].startTimeStamp)
    }
  }, [eventBarClip])
  useEffect(() => {
    console.log(openVideoClip)
    openVideoClip == false ? stopWebRTC() : ""
  }, [openVideoClip])
  const exportToPDF = () => {
    const content = contentRef.current
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save(props.details.msEventId + ".pdf")
    })
  }
  const downloadSnapImage = () => {
    let snapsrc = props.details.eventSrc
    let id = props.details.msEventId
    const link = document.createElement("a")
    link.href = snapsrc 
    link.download = `${id}.jpg` 
    link.click()
  }

  return (
    <div>
      <div ref={contentRef}>
      <ScrollArea className="max-h-[88vh] overflow-y-auto">

        <div className="m-1 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[#3F3F40]">
              <span className="flex px-2 text-sm font-semibold text-[#000]">
                {props.convertToViolationType(props.details?.eventType)}
              </span>
              <span className="pr-2 text-sm font-semibold text-[#000]">
                |
              </span>
              <span className="flex gap-2 text-sm font-semibold text-[#000]">
                {props.details.vehicleType}
              </span>
              <span className="px-2 text-sm font-semibold text-[#000]">
                |
              </span>
              <span
                className="flex gap-2 text-sm font-semibold text-[#000]"
                dir={isRTL(props.details.vehicleNo) ? "rtl" : "ltr"}
              >
                {props.details.vehicleNo}
              </span>
              <span className="px-2 text-sm font-semibold text-[#000]">
                |
              </span>
              <Image
                src={props.details?.lpImage}
                alt="lpImage"
                width={120}
                height={30}
                className="ml-2 h-auto w-[15%]"
              />
            </div>
            <div className="justify-right flex items-center">
              <Button
                variant="ghost"
                className="flex w-full flex-row items-center justify-start gap-2 p-1"
                onClick={() => {
                  downloadSnapImage()
                }}
              >
                <Image
                  alt="icon"
                  src="/vectors/recentEventDownload.svg"
                  width={26}
                  height={26}
                />
              </Button>
              <Button
                variant="ghost"
                className="flex w-full flex-row items-center justify-start gap-2 p-1"
                onClick={() => {
                  exportToPDF()
                }}
                // onClick={handlePrint}
              >
                <Image
                  alt="icon"
                  src="/vectors/eventPrinter.svg"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </div>
          <div className="flex max-h-fit items-start justify-between gap-6"
            >
            {/* <AspectRatio
              ratio={16 / 9}
              className="relative overflow-hidden bg-muted"
            > */}
              {props.details.eventSrc ? (
                <ImageWithMagnifier
                  src={props.details.eventSrc}
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
            {/* </AspectRatio> */}
            <div className="justify-top relative flex w-[28%] flex-col gap-2">
              {/* <AspectRatio ratio={1 / 1} className="bg-muted"> */}
                <div className="relative top-[40%] flex  items-center justify-center bg-muted w-10 h-9">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={20}
                    width={20}
                  />
                </div>
              {/* </AspectRatio> */}
              {/* <AspectRatio ratio={1 / 1} className="bg-muted"> */}
                <div className="relative top-[40%] flex  items-center justify-center bg-muted w-10 h-9">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={20}
                    width={20}
                  />
                </div>
              {/* </AspectRatio> */}
              {/* <AspectRatio ratio={1 / 1} className="bg-muted">
                <div className="relative top-[40%] flex  items-center justify-center">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={20}
                    width={20}
                  />
                </div>
              </AspectRatio> */}
              {/* <AspectRatio ratio={1 / 1} className="bg-muted"> */}
                <div className="relative top-[40%] flex items-center justify-center bg-muted w-10 h-9">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={20}
                    width={20}
                  />
                </div>
              {/* </AspectRatio> */}
              {/* <AspectRatio ratio={1 / 1} className="bg-muted"> */}
                <div className="relative top-[40%] flex  items-center justify-center bg-muted w-10 h-9">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={20}
                    width={20}
                  />
                </div>
              {/* </AspectRatio> */}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="rounded-md bg-[#EEF8FF] p-2 font-normal text-[#2A94E5]">
              Status: {convertToAcknowledge(props.details.acknowledge)}
            </span>
            <div className="flex flex-row items-center justify-end gap-2">
              <Button
                variant="outline"
                className="mr-100 relative flex gap-1 rounded-sm"
                onClick={toggleIsLive}
              >
                <Image
                  src="/images/Play_icons.svg"
                  alt="download"
                  width="20"
                  height="20"
                />
              </Button>

              <Button
                className="w-34 relative inline px-8 font-semibold"
                onClick={() => startVideoClip(props.details)}
              >
                Event Clip
              </Button>
            </div>
          </div>
          <div className="h-30 mt-2">
            <Table className=" border-collapse border-2 border-gray-200 p-2">
              <TableRow>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">
                    Severity
                  </span>
                  <p className="mt-2 h-fit w-fit rounded bg-[#FDC4BD] p-1 text-xs text-[red]">
                    {props.details.severityVal}
                  </p>
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Location</span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.junctionName}
                  </p>
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Junction</span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.junctionName}
                  </p>
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Camera</span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.cameraName}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  class="border-collapse border-2 border-gray-200"
                  colSpan="2"
                >
                  <span className="font-normal text-[#6F6F70]">
                    Capture Time
                  </span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.date}, {props.details.time}
                  </p>
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">
                    Vehicle Type
                  </span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.vehicleType}
                  </p>{" "}
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">
                    Speed ( Limit: 60 kmph)
                  </span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.speed}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Lane</span>
                  <p className="mt-2 text-sm text-black">_</p>
                </TableCell>
                <TableCell class="border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">
                    Color & Model
                  </span>
                  <p className="mt-2 text-sm text-black">
                    {props.details.color}
                  </p>
                </TableCell>
                <TableCell class="w-[35%] border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Message</span>
                  <p className="mt-2 text-sm text-black">
                    {/* {props.details.eventMessage} */}-
                  </p>
                </TableCell>
                <TableCell class="w-[35%] border-collapse border-2 border-gray-200">
                  <span className="font-normal text-[#6F6F70]">Action</span>
                  <p className="mt-2 text-sm text-black">
                    {/* {props.details.action} */}-
                  </p>
                </TableCell>
              </TableRow>
            </Table>
          </div>
          <div className="mt-2 flex gap-3">
            <Button
              variant="outline"
              className="rounded-sm border-[#2A94E5] font-semibold text-[#2A94E5]"
              // disabled={props.eventObj?.snapUrls?.length < 2}
              onClick={() => setOpenEvidenceSnap(true)}
            >
              Evidence
            </Button>
            <Button className="font-semibold " onClick={toggleValidate}>
              Validate Event
            </Button>
            
          </div>
          {isValidateOpen && (

              <ValidateView onRequestClose={toggleValidate} props={props} />
              
            )}
        </div>
        </ScrollArea>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={"max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"}
        >
          <DialogHeader>
            <DialogTitle>Event Viewer</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <div>
              <div className="h-[500px] bg-black p-2 pl-6">
                <div className="flex justify-between text-[#6F6F70]">
                  <Image
                    src="/vectors/video-icon.svg"
                    alt="video-icon"
                    width={20}
                    height={2}
                  />
                  <span>{props.details.cameraName}</span>
                  <span className="font-medium text-[#6F6F70]">
                    ...
                  </span>
                </div>
                <div>
                  <div className="align-center relative top-5 flex justify-center">
                    <AspectRatio ratio={16 / 9} className="">
                      <video
                        id="liveVideoplayer"
                        muted={true}
                        playing={true}
                        width="100%"
                        height="100%"
                        className="h-fit"
                        gridFullScreen={false}
                      />
                      {/* {storeRes[0]?.hlsurl ? (
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
                      )} */}
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/*  */}
      <Dialog open={openVideoClip} onOpenChange={setOpenVideoClip}>
        <DialogContent
          className={"max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"}
        >
          <DialogHeader>
            <DialogTitle>Event Clip</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="h-[500px] bg-black p-2 pl-6">
            <div className="flex justify-between text-[#6F6F70]">
              <Image
                src="/vectors/video-icon.svg"
                alt="video-icon"
                width={20}
                height={2}
              />
              <span>{props.details.cameraName}</span>
              <span className="font-medium text-[#6F6F70]">...</span>
            </div>
            <div>
              <div className="align-center relative top-5 flex justify-center">
                <AspectRatio ratio={16 / 9} className="">
                  <video
                    id="videoplayer"
                    muted={true}
                    playing={true}
                    width="100%"
                    height="100%"
                    className="h-fit"
                    gridFullScreen={false}
                  />
                  {/* {storeRes[0]? (
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
                      )} */}
                </AspectRatio>
              </div>
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
              <ImageWithMagnifier src={props.eventObj?.snapUrls[0]} />
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
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
              if (rtcPeer.signalingState !== "closed") {
                rtcPeer
                  .setRemoteDescription(
                    new RTCSessionDescription({
                      type: "answer",
                      sdp: atob(arg_data),
                    })
                  )
                  .catch((error) =>
                    console.error("Failed to set remote description:", error)
                  )
              } else {
                console.warn(
                  "RTCPeerConnection is closed. Cannot set remote description."
                )
              }
              // rtcPeer.setRemoteDescription(
              //   new RTCSessionDescription({
              //     type: "answer",
              //     sdp: atob(arg_data),
              //   })
              // )
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
