"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
// import Link from "next/link"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import * as FileSaver from "file-saver"
import * as XLSX from "xlsx"

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
import { CameraAreas } from "@/components/camera-areas"

// import VideoSidebar from "@/components/video/sidebar"

const TabButtons = ({ name, link, activeLink }) => {
  const pathName = usePathname()
  return (
    <div>
      <Link href={link}>
        <Button
          variant={`${pathName === activeLink ? "default" : "outline"}`}
          className={`rounded-none`}
        >
          {name}
        </Button>
      </Link>
    </div>
  )
}
const Link = dynamic(() => import("next/link"))
const VideoSidebar = dynamic(() => import("@/components/video/sidebar"))

const VideoLayout = ({ children }) => {
  const [number, setNumber] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const pathName = usePathname()
  const { resetCamera } = useStore()
  const handleInput = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "data.xlsx")
    setNumber(1)
    setOpenDialog(false)
  }

  return (
    <div className="mt-2  flex w-full gap-4">
      {pathName !== "/vdo/eventsnew" && (
        <div className="min-h-screen w-72  shrink-0 bg-white">
          <VideoSidebar />
        </div>
      )}
      <div className=" min-h-screen grow bg-white px-4">
        <div className="flex py-2">
          <TabButtons
            name="Events"
            link="/vdo/eventsnew"
            activeLink="/vdo/eventsnew"
          />
          <TabButtons
            name="Live Camera"
            link="/vdo/live"
            activeLink="/vdo/live"
          />
          {/* <TabButtons
            name="Events"
            link="/vdo/events"
            activeLink="/vdo/events"
          /> */}
          {/* <TabButtons
            name="Events"
            link="/vdo/eventsnew"
            activeLink="/vdo/eventsnew"
          />
          <TabButtons
            name="Live Camera"
            link="/vdo/live"
            activeLink="/vdo/live"
          /> */}
          {/* <TabButtons
            name="Search"
            link="/vdo/search"
            activeLink="/vdo/search"
          />
          <TabButtons
            name="Archive"
            link="/vdo/archive"
            activeLink="/vdo/archive"
          />
          <TabButtons
            name="Log Search"
            link="/vdo/logsearch"
            activeLink="/vdo/logsearch"
          /> */}
        </div>
        {children}
      </div>
    </div>
  )
}

export default VideoLayout
