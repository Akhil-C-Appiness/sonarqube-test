import { useEffect, useState } from "react"

import { getFileContent } from "@/lib/api"
import { HLBHelvetica } from "@/lib/fonts"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
import ImageWithMagnifier from "@/components/imageMag"

const convertToRegType = (type) => {
  switch (type) {
    case 0:
      return "Others"
    case 1:
      return "Private"
    case 2:
      return "Commercial"
    case 3:
      return "Army"
    case 4:
      return "Electrical"
    default:
      return "Others"
  }
}

const convertToColour = (type) => {
  switch (type) {
    case 0:
      return "Black"
    case 1:
      return "White"
    case 2:
      return "Grey"
    case 3:
      return "Red"
    case 4:
      return "Yellow"
    case 5:
      return "Green"
    case 6:
      return "Blue"
    case 7:
      return "Orange"
    case 8:
      return "Silver"
    case 9:
      return "Brown"
    default:
      return "white"
  }
}
const convertToVehicleType = (type) => {
  switch (type) {
    case 0:
      return "Two Wheeler"
    case 1:
      return "Three Wheeler"
    case 2:
      return "Four Wheeler"
    case 3:
      return "Heavy Vehicle"
    default:
      return "Others"
  }
}
const convertToViolationType = (type) => {
  switch (type) {
    case 323:
      return "Stop Line Violation"
    case 320:
      return "Over Speed"
    case 300:
      return "Red Light Violation Detection"
    default:
      return "Others"
  }
}

const convertToDate = (epochTimestamp) => {
  // const date = new Date(epochTimestamp * 1000)
  // const formattedDateTime = date.toLocaleString()
  const formattedDateTime = new Date(epochTimestamp).toLocaleString()
  return formattedDateTime
}
const ViewFootageModal = (events) => {
  const [imgData, setImgData] = useState(null)
  const [openEvidenceSnap, setOpenEvidenceSnap] = useState(false)

  let boldtext = `${HLBHelvetica.className} text-[15px] text-black font-semibold`
  useEffect(() => {
    let eventData = events.events.snapUrls[0]
    let eventobj = {
      filepath: eventData,
    }
    console.log(eventobj)
    const imgRes = async () => {
      const res = await getFileContent(eventobj)
      let base64String = "data:image/png;base64," + res
      setImgData(base64String)
    }
    imgRes()
  }, [events.events.snapUrls])
  return (
    <>
      <>
        <div className="flex flex-row items-center justify-between">
          <div className="mt-4 flex flex-row items-center gap-2">
            <p className={boldtext}>
              {convertToViolationType(events.events.eventType)} |
            </p>
            <p className={boldtext}>
              {convertToVehicleType(events.events.objectProperty2)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-row items-center justify-between">
          <div className="h-[345px] w-[85%] border-2">
            {imgData !== null && (
              <ImageWithMagnifier
                className="h-full w-full"
                src={imgData}
                width="100"
                height="100"
                alt="event snap"
              />
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="rounded-sm border-[#2A94E5] font-semibold text-[#2A94E5]"
            // disabled={selectedEvent?.snapUrls?.length < 2}
            onClick={() => setOpenEvidenceSnap(true)}
          >
            Evidence
          </Button>
        </div>
        <div className="mt-6 w-full">
          <table className="border-collapse border-2 border-gray-200 p-4">
            <tr>
              <td class="border-collapse border-2 border-gray-200 p-4">
                <p className="text-xs">Junction</p>
                <p className="mt-2 text-sm  text-black">
                  {events.events.junctionName}
                </p>
              </td>
              <td class="border-collapse border-2 border-gray-200 p-4">
                <p className="text-xs">Camera</p>
                <p className="mt-2 text-sm  text-black">
                  {events.events.cameraName}
                </p>
              </td>
            </tr>
            <tr>
              <td class="border-collapse border-2 border-gray-200 p-4">
                <p className="text-xs">Capture Time</p>
                <p className="mt-2 text-sm  text-black">
                  {convertToDate(events.events.startTime)}
                </p>
              </td>
              <td class="border-collapse border-2 border-gray-200 p-4">
                <p className="text-xs">Registration & Vehicle Type</p>
                <p className="mt-2 text-sm  text-black">
                  {convertToRegType(events.events.objectProperty6)}
                </p>
              </td>
            </tr>
            <tr>
              <td class="border-collapse border-2 border-gray-200 p-4">
                <p className="text-xs">Color</p>
                <p className="mt-2  text-black">
                  {convertToColour(events.events.objectProperty1)}
                </p>
              </td>
            </tr>
          </table>
        </div>
        <Dialog open={openEvidenceSnap} onOpenChange={setOpenEvidenceSnap}>
          <DialogContent
            className={
              "max-h-screen w-full overflow-y-scroll lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Evidence Snap</DialogTitle>
            </DialogHeader>
            <div className="h-[500px]">
              <AspectRatio ratio={16 / 9}>
                <ImageWithMagnifier src={imgData} />
              </AspectRatio>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </>
  )
}

export default ViewFootageModal
