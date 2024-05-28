"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import ReactPlayer from "react-player"
import isRTL from '@/lib/isRTL'

import { keepAlive, startLive, stopLive } from "@/lib/api"
import { HLBHelvetica } from "@/lib/fonts"
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

import { AspectRatio } from "./ui/aspect-ratio"

const EventViewerPopup = ({ eventImgObj, downloadSnap }) => {
  let boldtext = `${HLBHelvetica.className} text-[15px] text-black font-semibold`
  let iconArray = []
  let iconArraylenght = 5 - eventImgObj.snapurlArry.length
  for (let i = 0; i < iconArraylenght; i++) {
    iconArray.push(0)
  }
  const [isLiveOpen, setIsLiveOpen] = useState(false)
  const [storeRes, setStoreRes] = useState([])
  useEffect(() => {
    const payload = {
      channelid: eventImgObj.channelId,
      resolutionwidth: 892,
      resolutionheight: 481,
      withaudio: false,
    }
    const fetchLiveResponse = async (payload) => {
      const response = await startLive(payload)
      console.log("story res", response)
      setStoreRes(response.data.result)
    }
    fetchLiveResponse(payload)
  }, [])
  //   useEffect(()=>{
  //     console.log("storeRes",storeRes);
  //   })
  //   useEffect(() => {
  //     const interval = setInterval(keepAlive(storeRes[0]?.streamsessionid), 30000)
  //     return () => {
  //       clearInterval(interval)
  //     }
  //   })
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="mt-4 flex flex-row items-center gap-2">
          <p className={boldtext}>{eventImgObj.violationType} |</p>
          {/* <p className="text-[12px]">Four Wheeler |</p> */}
          <p className={boldtext}  dir={isRTL(eventImgObj.vehicleNo) ? 'rtl' : 'ltr'}>{eventImgObj.vehicleNo}</p>
        </div>
        {/* <Popover>
                <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
                    Menu Options{" "}
                    <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                </PopoverTrigger>
                <PopoverContent className="p-1">
                    <Button variant="ghost" className="flex w-full flex-row items-center justify-start gap-2">
						<Image
							alt="icon"
							src="/vectors/eventPrinter.svg"
							width={24}
							height={24}
						/>
						<span className="text-[#6F6F70]">Print</span>
					</Button>
					<Button variant="ghost" className="flex w-full flex-row items-center justify-start gap-2" onClick={() => {downloadSnap(eventImgObj.id)}}>
						<Image
							alt="icon"
							src="/vectors/recentEventDownload.svg"
							width={24}
							height={24}
						/>
						<span className="text-[#6F6F70]">Download</span>
					</Button>
					<Button variant="ghost" className="w-full flex flex-row items-center justify-start gap-2">
						<Image
							alt="icon"
							src="/vectors/Event_video.svg"
							width={24}
							height={24}
						/>
						<span className="text-[#6F6F70]">Event Video</span>
					</Button>
					<Button variant="ghost" className="w-full flex flex-row items-center justify-start gap-2">
						<Image
							alt="icon"
							src="/vectors/Snapshot.svg"
							width={24}
							height={24}
						/>
						<span className="text-[#6F6F70]">Snapshot</span>
					</Button>
                </PopoverContent>
            </Popover> */}
      </div>
      <div className="mt-4 flex flex-row items-center justify-between">
        <div className="h-[300px] w-[85%] border-2">
          <Image
            className="h-full w-full"
            src={eventImgObj.eventsrc}
            width="100"
            height="100"
            alt="event snap"
          />
        </div>
        <div className="flex h-[300px] w-[10%] flex-col items-start justify-start gap-2">
          {eventImgObj.snapurlArry.map((item) => (
            <div className="h-[64px] w-[64px] border-2">
              <Image
                className="h-full w-full object-cover"
                src={item}
                width="100"
                height="100"
                alt="event snap"
              />
            </div>
          ))}
          {iconArray.map((item) => (
            <div className="flex h-[64px] w-[64px] items-center justify-center bg-[#000]">
              <Image
                src="/vectors/camera2.svg"
                width="30"
                height="30"
                alt="event snap"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <div className="mt-4 flex items-center bg-[#EEF8FF] px-4 text-secondary-foreground hover:bg-secondary/80">
          <p className="">Status: Unchecked</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="default" onClick={setIsLiveOpen}>
            Live Camera View
          </Button>
          <Button variant="outline" className="rounded-sm">
            Event Video
          </Button>
        </div>
      </div>
      <div className="mt-4 w-full">
        <table className="border-collapse border-2 border-gray-200 p-4">
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Severity</p>
              <Badge variant="outline" className="bg-[#FDC4BD]">
                {eventImgObj.severity}
              </Badge>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Location</p>
              <p className="mt-2 text-sm  text-black">
                {eventImgObj.junctionName}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Junction</p>
              <p className="mt-2 text-sm  text-black">
                {eventImgObj.junctionName}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Camera</p>
              <p className="mt-2 text-sm  text-black">
                {eventImgObj.cameraName}
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Capture Time(Start)</p>
              <p className="mt-2 text-sm  text-black">
                {/* Sun, June 21, 12:34 PM */}
                {eventImgObj.date}
                {eventImgObj.time}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Capture Time(End)</p>
              <p className="mt-2 text-sm  text-black">
                {/* Sun, June 21, 12:34 PM */}
                {eventImgObj.enddate}
                {eventImgObj.endtime}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Registration & Vehicle Type</p>
              <p className="mt-2 text-sm  text-black">
                {eventImgObj.registrationType}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">
                Speed Range( Limit:
                {eventImgObj.speedLimit}
                kmph)
              </p>
              <p className="mt-2 text-sm  text-black">
                {eventImgObj.speed}
                kmph{" "}
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Color</p>
              <p className="mt-2  text-black">{eventImgObj.color}</p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Lane</p>
              <p className="mt-2 w-[35%]  text-black">{eventImgObj.lane}</p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Message</p>
              <p className="mt-2  text-black">{eventImgObj.eventMessage}</p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Action</p>
            </td>
          </tr>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-start gap-2">
        <Button variant="outline">Evidence</Button>
      </div>
      <Dialog open={isLiveOpen} onOpenChange={setIsLiveOpen}>
        <DialogContent className="bg-[#000]">
          <DialogHeader>
            <DialogTitle className=" font-semibold"></DialogTitle>
          </DialogHeader>
          <AspectRatio ratio={16 / 9} className="w-full">
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
                  src="/vectors/Videonetics_logo (1).svg"
                  width={80}
                  height={80}
                />
              </div>
            )}
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default EventViewerPopup
