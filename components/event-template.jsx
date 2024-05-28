"use client"

import { useRef } from "react"
import Image from "next/image"
import saveAs from "file-saver"
import html2canvas from "html2canvas"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import isRTL from '@/lib/isRTL'
export default function EventTemplate({ event, viewDetails }) {
  const targetRef = useRef(null)
  const handleScreenshot = async () => {
    if (targetRef.current) {
      try {
        const canvas = await html2canvas(targetRef.current)
        canvas.toBlob((blob) => {
          saveAs(blob, "screenshot.png")
        })
      } catch (error) {
        console.error("Error capturing screenshot:", error)
      }
    }
  }
  return (
    <AspectRatio ratio={16 / 9} className="border p-0 relative bg-black w-full">        
        {/* <div className="relative w-full bg-black"> */}
        <div className="absolute top-0 z-20 flex h-[40px] w-full flex-row items-center justify-between bg-black/40 p-[14px]">
          <div className="flex flex-row gap-2">
            <Image
              alt="icon"
              src="/vectors/camera.svg"
              width={20}
              height={14}
            />
            <p className="text-[12px] text-[#ffffff]">{event.cameraName}</p>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="ghost"
              className="p-1 text-xs font-bold leading-none text-[#fff] hover:bg-transparent h-8"
              onClick={() => {
                viewDetails(event)
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
          {/* <AspectRatio ratio={16 / 9} className="border p-0"> */}
          <Image
            className="h-full w-full object-contain"
            src={event.eventsrc}
            width="400"
            height="220"
            alt="event snap"
            ref={targetRef}
          />
          <div className="absolute bottom-0 z-20 flex h-[40px] w-full flex-row items-center justify-between bg-black/40 p-[14px]">
          <div className="flex flex-row items-center gap-2">
            <p className="text-[12px] text-slate-200">
              {event.speed <= 0 ? "" : event.speed+" kmph |"}
            </p>
            <p className="text-[12px] text-slate-200" dir={isRTL(event.vehicleNo) ? 'rtl' : 'ltr'}>{event.vehicleNo}</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-[10px] text-slate-200">{event.endtime}</p>
            {event.severity === "Critical" 
            ?
              <Badge variant="critical">
                {event.severity}
              </Badge>
            :event.severity === "Medium"?
              <Badge variant="medium">
                {event.severity}
              </Badge>
            :
              <Badge variant="low">
                {event.severity}
              </Badge>
            }
          </div>
        </div>
          {/* </AspectRatio> */}
          {/* <Button
            variant="ghost"
            className="absolute bottom-2 left-2 hover:bg-transparent"
            onClick={() => {
              downloadSnap(event.id)
            }}
          >
            <Image
              alt="icon"
              src="/vectors/eventDownload.svg"
              width={24}
              height={24}
            />
          </Button> */}
        {/* </div> */}
        {/*  */}
      {/* </div> */}
    </AspectRatio>
  )
}
