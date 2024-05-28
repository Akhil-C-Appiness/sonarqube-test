"use-client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import useStore from "@/store/store"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CameraGrid } from "@/components/camera-grid"
import EventDetailsPopup from "@/components/event-details-popup"
import EventsTable from "@/components/events-table"
import MenuOptions from "@/components/menu-options"
import Videotabheader from "@/components/video-tab-header"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const gridSelection = ["3*3", "2*2", "1*1"]
export default function CameraLayout({
  selectedChannel,
  grid,
  gridSize,
  handleGridSize,
  numberOfGrids,
  handleMenuOptions,
  playerRefs,
  handleFullGrid,
  handleSessionId,
  lastFiveElements,
  snapArray,
  updatedData,
  setNewBoomarkCount,
  newBookmarkCount,
  bookMarkedList,
  setBookMarkedList,
}) {
  const [bookMarkClickEvent, setBookMarkClickEvent] = useState(1)
  let [selectedElement, setselectedElement] = useState({})
  const [bookmarkName, setBookmarkName] = useState("")
  const [openBookmarkModal, setOpenBookmarkModal] = useState(true)
  const [open, setOpen] = useState(false)
  function viewDetails(data) {
    let selectedElement = snapArray.find((element) => {
      return element.id == data
    })
    setselectedElement(selectedElement)
    setOpen(true)
  }
  const handleBookmarkNameChange = (event) => {
    setBookmarkName(event.target.value)
  }

  const filteredGridSelection = gridSelection.filter((x) => x !== grid)
  const videoStitching = useStore((state) => state.videoStitching)

  const addbookMark = () => {
    setBookMarkClickEvent(bookMarkClickEvent + 1)
    setOpenBookmarkModal(false)
    setTimeout(() => {
      setBookmarkName("")
    }, 2000)
  }
  return (
    <div>
      <Videotabheader />
      <div className="flex flex-row items-center pt-5">
        {/* <MenuOptions
          menuOptions={menuOptions}
          handleMenuOptions={handleMenuOptions}
        /> */}
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger
              onMouseEnter={() => setOpenBookmarkModal(true)}
              asChild
              className="gap-2"
            >
              <Button variant="outline">
                {" "}
                <Image
                  alt="bookmark-icon"
                  src="/vectors/bookmark.svg"
                  width={16}
                  height={20}
                />{" "}
                Add Bookmark
              </Button>
            </PopoverTrigger>
            {openBookmarkModal && (
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="grid w-full grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Bookmark Name</Label>
                      <Input
                        type="text"
                        value={bookmarkName}
                        onChange={handleBookmarkNameChange}
                        placeholder="Enter bookmark "
                        className="h-[18px] w-[180px]"
                      />
                    </div>
                    <Button onClick={addbookMark}>Save</Button>
                  </div>
                </div>
              </PopoverContent>
            )}
          </Popover>
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => handleFullGrid(true)}
          >
            <Image
              alt="fullscreen-icon"
              src="/vectors/fullscreen.svg"
              width={20}
              height={20}
              className="mr-2.5"
            />
            Full Screen View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <Image
                  alt="grid-icon"
                  src="/vectors/grid.svg"
                  width={20}
                  height={20}
                  className="mr-2.5"
                />
                {grid}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filteredGridSelection.map((gridVal, i) => {
                return (
                  <DropdownMenuItem
                    onSelect={(e) => handleGridSize(e.target.outerText)}
                    key={i}
                  >
                    {gridVal}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {videoStitching && (
        <p className="m-2 h-7 w-36 text-[#0F0F10]">Video Stitching</p>
      )}
      {!videoStitching && (
        <CameraGrid
          gridSize={gridSize}
          bookMarkClickEvent={bookMarkClickEvent}
          bookmarkName={bookmarkName}
          numberOfGrids={numberOfGrids}
          selectedChannel={selectedChannel}
          handleMenuOptions={handleMenuOptions}
          playerRefs={playerRefs}
          handleSessionId={handleSessionId}
          setNewBoomarkCount={setNewBoomarkCount}
          newBookmarkCount={newBookmarkCount}
          bookMarkedList={bookMarkedList}
          setBookMarkedList={setBookMarkedList}
        />
      )}
      {!videoStitching && (
        <EventsTable
          eventDetailObj={lastFiveElements}
          snapArray={snapArray}
          updatedData={updatedData}
          viewDetails={viewDetails}
        />
      )}
      <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-auto lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>Quick Event View</DialogTitle>
              <DialogDescription>
                <EventDetailsPopup eventImgObj={selectedElement} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
