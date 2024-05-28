import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HLBHelvetica } from "@/lib/fonts"
import isRTL from '@/lib/isRTL'

const EventsDetails = (props) => {
  let iconArray = [];
  let boldtext = `${HLBHelvetica.className} text-[15px] text-black font-semibold`
  let iconArraylenght = 5 - (props.eventDetailObj?.snapurlArry?.length);
  for(let i=0;i < iconArraylenght; i++){
      iconArray.push(0);
  }
  return (
    <div className="mt-4 flex w-[612px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#EEF8FF] px-4 text-secondary-foreground hover:bg-secondary/80">
        {props.eventDetailObj.snapurlArry? <p className="">Status: Unchecked</p> : <></> }
        </div>
        <div>
        <Popover>
				<PopoverTrigger className="flex flex-row items-center gap-2 border-none text-lg">
					<b>...</b>
                </PopoverTrigger>
				<PopoverContent className="w-[200px] p-1">
					<Button variant="ghost" className="flex w-full flex-row items-center justify-start gap-2">
						<Image
							alt="icon"
							src="/vectors/eventPrinter.svg"
							width={24}
							height={24}
						/>
						<span className="text-[#6F6F70]">Print</span>
					</Button>
					<Button variant="ghost" className="flex w-full flex-row items-center justify-start gap-2" onClick={() => {props.downloadSnap(props.eventDetailObj.id)}}>
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
			</Popover>
        </div>
      </div>
      {props.eventDetailObj.snapurlArry? 
      <>
        <div className="h-[315px] w-[612px]">
          <Image
            className="h-full w-full"
            src={props.eventDetailObj.eventsrc}
            width="100"
            height="100"
            alt="event snap"
          />
        </div>
        <div className="flex flex-row gap-2">
          {props.eventDetailObj.snapurlArry?.map((item) => (
            <div className="h-[48px] w-[48px]">
              <Image className='h-full w-full object-cover' src={item} width="100" height="100" alt='event snap'/>
            </div>
          ))}
          {iconArray.map((item) => (
              <div className="flex h-[48px] w-[48px] items-center justify-center bg-[#000]">
                  <Image src="/vectors/camera2.svg" width="25" height="25" alt='event snap'/>
              </div>
          ))}
          </div>
          <div className="mt-2 flex flex-row gap-2">
            <div className="flex h-5 flex-row items-center gap-1 border-r-2 px-4 font-medium text-[#000]">
              <p className={boldtext}>{props.eventDetailObj.violationType}</p>
            </div>
            <div className="flex h-5 flex-row items-center gap-1 border-r-2 px-4 font-medium text-[#000]">
            <p className={boldtext}>{props.eventDetailObj.vehicleclass}</p>
            </div>
            <div className="flex h-5 flex-row items-center gap-1 px-4 font-medium text-[#000]">
            <p className={boldtext}   dir={isRTL(props.eventDetailObj.vehicleNo) ? 'rtl' : 'ltr'}>{props.eventDetailObj.vehicleNo}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-row flex-wrap items-center justify-between">
            <Button className="flex items-center justify-between" variant="copy">
              Event ID: {props.eventDetailObj.id}
            </Button>
            <div className="flex items-end gap-2">
              <Button type="button" variant="outline" className="rounded-sm">
                Vehicle History
              </Button>
              <Button type="button" onClick={() => {props.viewEventDetails(props.eventDetailObj.id)}}>View Details</Button>
            </div>
          </div>
          <table className="border-collapse border-2 border-gray-200 p-4">
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Severity</p>
              <Badge variant="outline" className="bg-[#FDC4BD]">
                {props.eventDetailObj.severity}
              </Badge>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Junction</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.junctionName}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Camera</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.cameraName}
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Capture Time</p>
              <p className="mt-2 text-sm text-black">
                {/* Sun, June 21, 12:34 PM */}
                {props.eventDetailObj.date}
                {props.eventDetailObj.time}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Registration & Vehicle Type</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.registrationType}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">
                Speed Range( Limit:{props.eventDetailObj.speedLimit} kmph)
              </p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.speed} kmph{" "}
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Color</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.color}
              </p>
            </td>
            <td class="border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Lane</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.lane}
              </p>
            </td>
            <td class="w-[35%] border-collapse border-2 border-gray-200 p-4">
              <p className="text-xs">Message</p>
              <p className="mt-2 text-sm text-black">
                {props.eventDetailObj.eventMessage}
              </p>
            </td>
          </tr>
        </table>
      </>: <></>}
    </div>
  )
}

export default EventsDetails
