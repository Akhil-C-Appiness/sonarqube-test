import Image from "next/image"
import Link from "next/link"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/video-menu-select"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
const buttons = [
  {
    btn: "Live Camera",
    link: "live",
    id: 1,
  },
  { btn: "Events", link: "events", id: 2 },
  {
    btn: "Search",
    link: "search",
    id: 3,
  },
  {
    btn: "Archive",
    link: "archive",
    id: 5,
  },
]
export default function Videotabheader() {
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(7)

  return (
    <div className="flex items-center justify-between">
      {buttons?.map((btn) => (
          <Button
            variant="outline"
            key={btn.id}
            className={
              trimmedPathname === `${btn.link}` &&
              "rounded-none bg-[#2A94E5] text-white"
            }
          >
            {" "}
            <Link href={`/video/${btn.link}`}>{btn.btn}</Link>
          </Button>
        ))}
      <Image
        alt="msg-menu-icon"
        src="/vectors/message-menu.svg"
        width={20}
        height={20}
        className="ml-auto"
      />
    </div>
  )
}
