"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import useStore from "@/store/store"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
import { format, parse, set } from "date-fns"
import * as $ from "jquery"

import { getBarClips, startArchive } from "@/lib/api"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
// import ArchiveControl from "@/components/archiveControl"
import TimePicker from "@/components/timePicker"
import VideoPlayer from "@/components/videoPlayer"

const ArchiveControl = dynamic(() => import("@/components/archiveControl"))

const ArchivePage = () => {
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState("12:00:00 AM")
  const [endTime, setEndTime] = useState("11:59:00 PM")
  const [startDateTime, setStartDateTime] = useState(null)
  const [endDateTime, setEndDateTime] = useState(null)
  const [showArchiveControl, setShowArchiveControl] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [barClips, setBarClips] = useState([])
  const selectedCameras = useStore((state) => state.selectedCameras)
  const [archiveProgress, setArchiveProgress] = useState(null)
  const [playerState, setPlayerState] = useState("paused")
  const setSelectedCameras = useStore((state) => state.setSelectedCameras)
  const { resetCamera } = useStore()
  console.log(startDateTime, endDateTime, "startDateTime, endDateTime")
  useEffect(() => {
    console.log("reset called")
    resetCamera()
  }, [])

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
  const playWebRTC = () => {
    var element = document.getElementById("videoplayer")
    if (element && element["webrtc"]) {
      element["webrtc"].play()
      console.log("WebRTC stream resumed.")
    } else {
      console.warn(
        "No WebRTC instance found for element with ID 'videoplayer'."
      )
    }
  }

  const pauseWebRTC = () => {
    var element = document.getElementById("videoplayer")
    if (element && element["webrtc"]) {
      element["webrtc"].pause()
      console.log("WebRTC stream paused.")
    } else {
      console.warn(
        "No WebRTC instance found for element with ID 'videoplayer'."
      )
    }
  }
  const updateCameraArchive = async (id, payload) => {
    const response = await startArchive(payload)
    const liveRes = response.data.result[0]
    if (response.status === 200) {
      var streamingserveraddress =
        response.data.result[0].streamingserveraddress
      var streamingserverport = response.data.result[0].streamingserverport
      var stunserveraddress = response.data.result[0].stunserveraddress
      var stunserverport = response.data.result[0].stunserverport
      var channelId = response.data.result[0].vStreamingDetailsModel.channelId
      var streamsessionid = response.data.result[0].streamsessionid

      // setSelectedCameras([
      //   ...selectedCameras,
      //   {
      //     ...liveRes,
      //     camId: id,
      //     isLoading: false,
      //     loadingMessage: "Stream Loaded",
      //     starttimestamp: payload.starttimestamp,
      //   },
      // ])

      // console.log(
      //   "Element with ID " + id + " is loaded:",
      //   document.getElementById("videoplayer")
      // )

      var webrtcURL =
        "http://" + streamingserveraddress + ":" + streamingserverport

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

  const handlePlay = () => {
    playWebRTC()
    setPlayerState("playing")
  }

  const handlePause = () => {
    pauseWebRTC()
    setPlayerState("paused")
  }

  const handleEnded = () => {
    stopWebRTC()
    setPlayerState("ended")
  }

  const handleFastForward = async () => {
    let archiveVideo = document.getElementById("videoplayer")
    let vid_currentTime = archiveVideo.currentTime
    stopWebRTC()
    let rewindedTime = currentTime + vid_currentTime * 1000
    setStartDateTime(rewindedTime)
    loadBarClips()
  }
  const handleFastRewind = async () => {
    let archiveVideo = document.getElementById("videoplayer")
    let vid_currentTime = archiveVideo.currentTime
    stopWebRTC()
    let rewindedTime = currentTime - vid_currentTime * 1000
    setStartDateTime(rewindedTime)
    setEndDateTime(new Date(endDateTime).getTime() * 1000)
    loadBarClips()
  }
  const { toast } = useToast()
  // const { selectedCameras } = useStore();

  useEffect(() => {
    console.log(startTime)
  }, [startTime])

  useEffect(() => {
    console.log(archiveProgress)
  }, [archiveProgress])

  useEffect(() => {
    // console.log(selectedCameras,'selectedCams')
    if (!selectedCameras.length) {
      stopWebRTC()
    }
  }, [selectedCameras])

  const loadBarClips = async () => {
    if (!selectedCameras.length) {
      toast({
        variant: "destructive",
        description: "Please select Camera",
        duration: 3000,
      })
      return
    }
    let parsedDate = new Date(date)
    let parsedStartTime = parse(startTime, "h:mm:ss aa", new Date())
    let combinedStartTime = set(parsedDate, {
      hours: parsedStartTime.getHours(),
      minutes: parsedStartTime.getMinutes(),
      seconds: parsedStartTime.getSeconds(),
    })

    let startingTime = Math.floor(combinedStartTime.getTime())

    let parsedEndTime = parse(endTime, "h:mm:ss aa", new Date())
    let combinedEndTime = set(parsedDate, {
      hours: parsedEndTime.getHours(),
      minutes: parsedEndTime.getMinutes(),
      seconds: parsedEndTime.getSeconds(),
    })

    let endingTime = Math.floor(combinedEndTime.getTime())
    setStartDateTime(startingTime)
    setEndDateTime(endingTime)

    const payload = {
      channelId: selectedCameras[0].camId,
      startingTime: startingTime,
      endingTime: endingTime,
    }
    // console.log(payload)
    if (startingTime) {
      const barclipRes = await getBarClips(payload)
      console.log(barclipRes.data.result)
      setBarClips(barclipRes.data.result)
      setShowArchiveControl(true)
    }
  }
  console.log(currentTime, "currentTime")
  useEffect(() => {
    if (selectedCameras.length) {
      loadBarClips()
    }
  }, [selectedCameras])
  return (
    <div>
      <div className="flex gap-4 py-4">
        <div className="flex flex-col">
          <Label htmlFor="date"> Date </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <Label>Start Time</Label>
          <TimePicker value={startTime} onChange={(val) => setStartTime(val)} />
        </div>
        <div className="flex flex-col">
          <Label>End Time</Label>
          <TimePicker value={endTime} onChange={(val) => setEndTime(val)} />
        </div>
        <div className="flex h-auto items-end">
          <Button variant={"blueoutline"} onClick={loadBarClips}>
            Submit
          </Button>
        </div>
        <div className="grow"></div>
        {/* <div>Menu Options</div> */}
      </div>
      <div className="xl:px-36">
        <AspectRatio ratio={16 / 9} className={`h-full bg-gray-900`}>
          {/* {selectedCameras.length && !selectedCameras[0].initial ? ( */}
          <>
            {/* {selectedCameras[0]?.isLoading ? (
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
              ) : ( */}
            <video
              // url={`${process.env.NEXT_PUBLIC_URL}${selectedCameras[0]?.hlsurl}`}
              id="videoplayer"
              muted={true}
              playing={true}
              width="100%"
              height="100%"
              className="h-fit"
              gridFullScreen={false}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onProgress={(progress) => {
                if (
                  playerState === "playing" &&
                  progress.playedSeconds &&
                  selectedCameras[0]?.starttimestamp
                ) {
                  setCurrentTime(
                    selectedCameras[0].starttimestamp +
                      Math.round(progress.playedSeconds) * 1000
                  )
                }

                // setPlayed(progress.playedSeconds);
              }}
            />
            {/* )} */}
          </>
          {/* ) : (
            <div
              className={`absolute top-0 z-0 flex h-full w-full flex-row items-center justify-center`}
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
      <div className="mt-4  flex gap-4">
        <div className="flex w-1/12 shrink-0 flex-col justify-between">
          <div className="w-full">
            <input className="w-full" type="range" />
          </div>
          <div> Recording </div>
        </div>
        <div className="w-11/12 grow">
          {showArchiveControl && (
            <ArchiveControl
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              startTime={startDateTime}
              setStartTime={setStartDateTime}
              endTime={endDateTime}
              setEndTime={setEndDateTime}
              barClips={barClips}
              updateCameraArchive={updateCameraArchive}
              handleFastForward={handleFastForward}
              handleFastRewind={handleFastRewind}
              playerState={playerState}
              handlePlay={handlePlay}
              handlePause={handlePause}
              handleEnded={handleEnded}
            />
          )}
        </div>
      </div>

      <Toaster />
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
    setPlayerState("playing")
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
    setPlayerState("ended")
  }
  async pause() {
    this.mediaStream.getTracks().forEach((track) => (track.enabled = false))
    setPlayerState("paused")
  }
  async play() {
    this.mediaStream.getTracks().forEach((track) => (track.enabled = true))
    setPlayerState("playing")
  }
}

export default ArchivePage
