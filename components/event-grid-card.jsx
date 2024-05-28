import Image from "next/image"
import Link from "next/link"

export default function EventGridCard() {
  return (
    <div className="flex h-[340px] w-full flex-col items-start border p-0">
      <div className="flex h-[40px] w-full flex-row items-center justify-between p-[14px]">
        <div className="flex flex-row gap-2">
          <Image alt="icon" src="/vectors/camera.svg" width={20} height={14} />
          <p className="text-[12px]">4th Phase_01</p>
        </div>
        <div className="flex flex-row gap-2">
          <Link href="#" className="text-[14px] font-bold text-[#2A94E5]">
            View Details
          </Link>
        </div>
      </div>
      <div className="h-[260px] w-full bg-black"></div>
      <div className="flex h-[40px] w-full flex-row items-center justify-between p-[14px]">
        <div className="flex flex-row items-center gap-2">
          <Image
            alt="icon"
            src="/vectors/over-speeding.svg"
            width={20}
            height={20}
          />
          <p className="text-[12px]">Over Speeding |</p>
          <p className="text-[12px]">Four Wheeler |</p>
          <p className="text-[12px]">KA-01-1234</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-[10px]">12:23 PM</p>
          <p className="h-fit w-fit rounded bg-[#FDC4BD] p-1 text-xs text-[red]">
            Critical
          </p>
        </div>
      </div>
    </div>
  )
}
