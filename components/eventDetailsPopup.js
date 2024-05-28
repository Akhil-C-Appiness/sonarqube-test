import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useStore from "@/store/store"
import {useState, useEffect} from 'react'
import EventDetailsPopup from "@/components/event-details-popup"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {format} from 'date-fns'
import {
    getFileContent,
  } from "@/lib/api"

  import ImageWithMagnifier from "@/components/imageMag"

const EventDetails = () => {
    // const [open, setOpen] = useState(true)
    
    const showEventDetails = useStore(state=>state.showEventDetails);
    const setShowEventDetails = useStore(state=>state.setShowEventDetails);
    const selectedEventDetails = useStore(state=>state.selectedEventDetails);
    const {isEventPopupLoading, setIsEventPopupLoading, getSeverityName, getVehicleType, getVehicleColor, setAlertTypes, alertTypes} = useStore();
    const [eventDetails, setEventDetails] = useState(null);
    const [selectedSnap, setSelectedSnap] = useState(null);

    const loadEventSnaps = async ()=>{
        setIsEventPopupLoading(true)
        let promises = selectedEventDetails.snapUrls.map(async (item) => {
            let eventobj = {
                "filepath" : item
            }
            let response = await getFileContent(eventobj);
                return 'data:image/png;base64,'+response;
            });
            
            let snapImages = await Promise.all(promises);
            setIsEventPopupLoading(false)
            // console.log(snapImages, 'snapImages')
            const evtDetails = {...selectedEventDetails}
            evtDetails.snapImages = snapImages
            setEventDetails(evtDetails)
            
            setSelectedSnap(snapImages[0])
            
    }

    useEffect(()=>{
        if(selectedEventDetails?.snapUrls){
            loadEventSnaps()
        }
    }, [selectedEventDetails])

    useEffect(()=>{
        setAlertTypes()
    }, [eventDetails])
    // useEffect(()=>{
    //     console.log(alertTypes, 'alertTypes')
    // }, [alertTypes])

    return <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
   
    <DialogContent className="max-h-screen w-full overflow-y-auto lg:max-w-screen-md">
      <DialogHeader>
        <DialogTitle>Quick Event View</DialogTitle>
       
      </DialogHeader>
      
      {!isEventPopupLoading&&eventDetails?<div>
        <div className="flex flex-row items-center justify-between">
            <div className="mt-4 flex flex-row items-center gap-2">
                <p className="font-semibold">
                    {`${alertTypes.find(alert=>alert.alerttype==eventDetails.eventType)?.alertname || '-'} | ${eventDetails.objectId}`}
                   
                    
                </p>
            </div> 
            <div className="mt-4 flex items-center bg-[#EEF8FF] px-4 text-secondary-foreground hover:bg-secondary/80">
                <p className="">Status: Unchecked</p>
            </div>
        </div>
        <div className="mt-4 flex gap-2">
            <div className="w-5/6">
            <AspectRatio ratio={16 / 9} className="bg-muted relative">
                {selectedSnap?
                <ImageWithMagnifier src={selectedSnap} alt='event snap' /> :
                 <div className="flex h-full w-full items-center justify-center bg-[#000] shrink-0">
                    <Image src="/vectors/camera2.svg" width="30" height="30" alt='event snap'/>
                </div>}
            </AspectRatio>
            </div>
            <div className="w-1/6 flex flex-col gap-2 h-80 overflow-auto">
                
                {eventDetails?.snapImages?.map((item) => (
                    <div className="w-full border-2">
                        <Image onClick={()=>setSelectedSnap(item)} className='h-24 w-full object-cover cursor-pointer' src={item} width="100" height="100" alt='event snap'/>
                    </div>
                ))}
                {eventDetails?.snapImages.length<=1&&[1,2,3,4]?.map((item) => (
                    <div onClick={()=>setSelectedSnap(null)} className="flex h-24 w-full items-center cursor-pointer justify-center bg-[#000] shrink-0">
                        <Image src="/vectors/camera2.svg" width="30" height="30" alt='event snap'/>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-4 w-full">
            <table className="border-collapse border-2 border-gray-200 p-4">
                <tr>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Severity</p>
                        <Badge variant="outline" className="bg-[#FDC4BD]">
                        {getSeverityName(eventDetails.priority)}
                        </Badge>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Location</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventDetails.junctionName}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Junction</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventDetails.junctionName}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Camera</p>
                        <p className="mt-2 text-sm  text-black">
                        {eventDetails.cameraName}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Capture Time(Start)</p>
                        <p className="mt-2 text-sm  text-black">
                        {/* Sun, June 21, 12:34 PM */}
                        {}
                        {format(eventDetails.startTime, 'dd MMM yy hh:mm a')}
                        {/* {eventDetails.time} */}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Capture Time(End)</p>
                        <p className="mt-2 text-sm  text-black">
                        {/* Sun, June 21, 12:34 PM */}
                        {/* {eventDetails.endTime} */}
                        {format(eventDetails.endTime, 'dd MMM yy hh:mm a')}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Registration & Vehicle Type</p>
                        <p className="mt-2 text-sm  text-black">
                        {getVehicleType(eventDetails.objectProperty6)}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">
                        Speed Range( Limit:
                            {eventDetails.objectProperty3}
                                kmph)
                        </p>
                        <p className="mt-2 text-sm  text-black">
                        {eventDetails.objectProperty4} 
                        kmph{" "}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Color</p>
                        <p className="mt-2  text-black">
                        {getVehicleColor(eventDetails.objectProperty1)}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Lane</p>
                        <p className="mt-2 w-[35%]  text-black">
                        {eventDetails.lane || 1}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Message</p>
                        <p className="text-black  mt-2">
                        {eventDetails.message}
                        </p>
                    </td>
                    <td class="border-collapse border-2 border-gray-200 p-4">
                        <p className="text-xs">Action</p>
                    </td>
                </tr>
            </table>
        </div>
      </div>:<div className="w-full">
            <div className="flex justify-between ">
                            <div className="bg-slate-300 animate-pulse h-5 w-28  "></div>
                            <div className="bg-slate-300 animate-pulse h-5 w-28  "></div>
                            <div className="bg-slate-300 animate-pulse h-5 w-52 "></div>
            </div>
            <div className="flex w-full gap-2 mt-4">   
                <div className="w-5/6">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                        <div className="flex h-full w-full bg-slate-300 animate-pulse shrink-0">
                        
                        </div>
                    </AspectRatio>
                    </div>
                    
                <div className="w-1/6 flex flex-col gap-2 h-80 overflow-auto">
                    <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                    <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                    <div className="bg-slate-300 animate-pulse h-24 w-full "></div>


                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
                        <div className="bg-slate-300 animate-pulse h-24 w-full "></div>
            </div>
        </div>}

        
      {/* {console.log(eventDetails, 'eventDetails')} */}
      <DialogFooter>
        {/* <Button type="submit">Save changes</Button> */}
      </DialogFooter>
    </DialogContent>
  </Dialog>
}

export default EventDetails