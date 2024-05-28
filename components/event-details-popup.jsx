import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { HLBHelvetica } from "@/lib/fonts"

const EventDetailsPopup = ({eventImgObj}) => {
    let iconArray = [];
    let iconArraylenght = 5 - (eventImgObj.snapurlArry.length);
    let boldtext = `${HLBHelvetica.className} text-[15px] text-black font-semibold`
    for(let i=0;i < iconArraylenght; i++){
        iconArray.push(0);
    }
    return (
        <>
        <div className="flex flex-row items-center justify-between">
            <div className="mt-4 flex flex-row items-center gap-2">
                <p className={boldtext}>
                    {eventImgObj.violationType} |
                </p>
                {/* <p className="text-[12px]">Four Wheeler |</p> */}
                <p className={boldtext}>
                    {eventImgObj.vehicleNo}
                </p>
            </div> 
            <div className="mt-4 flex items-center bg-[#EEF8FF] px-4 text-secondary-foreground hover:bg-secondary/80">
                <p className="">Status: Unchecked</p>
            </div>
        </div>
        <div className="mt-4 flex flex-row items-center justify-between">
            <div className="h-[300px] w-[85%] border-2">
                <Image className='h-full w-full' src={eventImgObj.eventsrc} width="100" height="100" alt='event snap'/>
            </div>
            <div className="flex h-[300px] w-[10%] flex-col items-start justify-start gap-2">
                {eventImgObj.snapurlArry.map((item) => (
                    <div className="h-[64px] w-[64px] border-2">
                        <Image className='h-full w-full object-cover' src={item} width="100" height="100" alt='event snap'/>
                    </div>
                ))}
                {iconArray.map((item) => (
                    <div className="flex h-[64px] w-[64px] items-center justify-center bg-[#000]">
                        <Image src="/vectors/camera2.svg" width="30" height="30" alt='event snap'/>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-4 w-full">
            <table className="border-collapse border-2 border-gray-200 p-4">
                <tr>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Severity</p>
                        <Badge variant="outline" className="bg-[#FDC4BD]">
                        {eventImgObj.severity}
                        </Badge>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Location</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventImgObj.junctionName}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Junction</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventImgObj.junctionName}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Camera</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventImgObj.cameraName}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Capture Time(Start)</p>
                        <p className="mt-2 text-sm  text-black">
                        {/* Sun, June 21, 12:34 PM */}
                        {eventImgObj.date}
                        {eventImgObj.time}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Capture Time(End)</p>
                        <p className="mt-2 text-sm  text-black">
                        {/* Sun, June 21, 12:34 PM */}
                        {eventImgObj.enddate}
                        {eventImgObj.endtime}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Registration & Vehicle Type</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventImgObj.registrationType}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
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
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Color</p>
                        <p className="mt-2  text-black">
                        {eventImgObj.color}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Lane</p>
                        <p className="mt-2 w-[35%]  text-black">
                        {eventImgObj.lane}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Message</p>
                        <p className="text-black  mt-2">
                        {eventImgObj.eventMessage}
                        </p>
                    </td>
                    <td className="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Action</p>
                    </td>
                </tr>
            </table>
        </div>
        </>
    )
}
export default EventDetailsPopup
