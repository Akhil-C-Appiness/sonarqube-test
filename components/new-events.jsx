import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import isRTL from '@/lib/isRTL'

const NewEvents = (props) => {
  return (
    <div
      className="mx-auto mt-4 flex h-[110px] w-full flex-col gap-4 rounded bg-[#F7F7F7] p-4 hover:cursor-pointer"
      onClick={() => {
        props.onClick(props.id)
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <Badge variant="outline" className="bg-[#FDC4BD]">
          {props.eventImgObj.severity}
        </Badge>
        <p className="text-[14px] text-[#6F6F70]">
          {props.eventImgObj.date} | {props.eventImgObj.time}
        </p>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {/* <Image
            alt="replay-icon"
            src="/vectors/over-speeding.svg"
            width={24}
            height={24}
          /> */}
          <span className="text-[#6F6F70] text-[14px] font-bold">
            {props.eventImgObj.violationType}
          </span>
        </div>
        <p className="text-[14px] text-[#6F6F70] font-bold"   dir={isRTL(props.eventImgObj.vehicleNo) ? 'rtl' : 'ltr'}>
          {props.eventImgObj.vehicleNo}
        </p>
        {/* <p className="text-[14px] text-[#6F6F70] font-bold">KA-01-1234</p> */}
      </div>
    </div>
  )
}
export default NewEvents
