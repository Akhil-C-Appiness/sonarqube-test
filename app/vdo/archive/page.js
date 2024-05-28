"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import useStore from "@/store/store"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
import { format, parse, set } from "date-fns"

import { getBarClips } from "@/lib/api"
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
import ArchiveControl from "@/components/archiveControl"
import TimePicker from "@/components/timePicker"
import VideoPlayer from "@/components/videoPlayer"

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
  const handlePlay = () => {
    setPlayerState("playing")
  }

  const handlePause = () => {
    setPlayerState("paused")
  }

  const handleEnded = () => {
    setPlayerState("ended")
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
    console.log(selectedCameras)
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
    let parsedStartTime = parse(startTime, "h:mm aa", new Date())
    let combinedStartTime = set(parsedDate, {
      hours: parsedStartTime.getHours(),
      minutes: parsedStartTime.getMinutes(),
      seconds: parsedStartTime.getSeconds(),
    })

    let startingTime = Math.floor(combinedStartTime.getTime())

    let parsedEndTime = parse(endTime, "h:mm aa", new Date())
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
    console.log(payload)
    const barclipRes = await getBarClips(payload)
    console.log(barclipRes.data.result)
    setBarClips(barclipRes.data.result)
    setShowArchiveControl(true)
  }

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
          {selectedCameras.length && !selectedCameras[0].initial ? (
            <>
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
                <VideoPlayer
                  url={`${process.env.NEXT_PUBLIC_URL}${selectedCameras[0]?.hlsurl}`}
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
              )}
            </>
          ) : (
            <div
              className={`absolute top-0 z-0 flex h-full w-full flex-row items-center justify-center`}
            >
              <Image
                alt="videonetics-logo"
                src="/vectors/Videonetics_logo (1).svg"
                width={80}
                height={80}
              />
            </div>
          )}
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
            />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default ArchivePage
