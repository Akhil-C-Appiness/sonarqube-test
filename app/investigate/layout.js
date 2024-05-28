"use client"

import { useState } from "react"
import dynamic from 'next/dynamic';
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

const Link = dynamic(() => import("next/link"));
const VideoSidebar = dynamic(()=>import("@/components/video/sidebar"))

const TabButtons = ({ name, link, activeLink }) => {
  const pathName = usePathname()
  return (
    <div>
      <Link href={link}>
        <Button
          variant={`${pathName.includes(activeLink) ? "default" : "outline"}`}
          className={`rounded-none`}
        >
          {name}
        </Button>
      </Link>
    </div>
  )
}

const VideoLayout = ({ children }) => {
  const [number, setNumber] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const pathName = usePathname()

  const handleInput = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "data.xlsx")
    setNumber(1)
    setOpenDialog(false)
  }
  return (
    <div className="mt-4  flex w-full gap-4">
      {pathName === "/investigate/archive" && (
        <div className="min-h-screen w-72  shrink-0 bg-white">
          <VideoSidebar />
        </div>
      )}
      <div className="min-h-screen grow bg-white p-4">
        <div className="flex">
          {/* <TabButtons
            name="Live Camera"
            link="/vdo/live"
            activeLink="/vdo/live"
          />
          <TabButtons
            name="Events"
            link="/vdo/events"
            activeLink="/vdo/events"
          /> */}
          <TabButtons
            name="Search"
            link="/investigate/search"
            activeLink="/investigate/search"
          />
          <TabButtons
            name="Archive"
            link="/investigate/archive"
            activeLink="/investigate/archive"
          />
          <TabButtons
            name="Log Search"
            link="/investigate/logsearch"
            activeLink="/investigate/logsearch"
          />
          <TabButtons
            name="Quick LP Search"
            link="/investigate/quicklpsearch"
            activeLink="/investigate/quicklpsearch"
          />
          <TabButtons
            name="Quick Vehicle Search"
            link="/investigate/quickvehiclesearch"
            activeLink="/investigate/quickvehiclesearch"
          />
          {/* <TabButtons
            name="MIS Report"
            link="/investigate/misreport"
            activeLink="/investigate/misreport"
          /> */}
        </div>
        {children}
      </div>
    </div>
  )
}

export default VideoLayout
