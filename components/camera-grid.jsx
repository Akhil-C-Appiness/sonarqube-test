"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import ReactPlayer from "react-player"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateBookMark, fetchBookMarkedApi } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  
} from "@/components/ui/popover"

import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import useStore from "@/store/store"
export function CameraGrid({
  gridSize,
  numberOfGrids,
  selectedChannel,
  playerRefs,
  handleSessionId,
  bookMarkClickEvent,
  bookmarkName,
  setNewBoomarkCount,
  newBookmarkCount,
  bookMarkedList
}) {

  const [mergedArray, setMergedArray] = useState([])
  const [isBookmarkClicked, setBookmarkClicked] = useState(false)
  const [initialClick, setinitialClick] = useState(true);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const setBookMarkedList = useStore(state=>state.setBookMarkedList)
  // const [newBookmarkCount, setNewBoomarkCount] = useState(0);

  const toggleBookmark = () => {
    setBookmarkClicked(!isBookmarkClicked)
  }
  // const handleBookmarkNameChange = (event) => {
  //   setBookmarkName(event.target.value);
  // };
  useEffect(() => {
    if (selectedChannel) {
      setMergedArray(
        selectedChannel
          .slice(selectedChannel.length - numberOfGrids)
          .toReversed()
      )
    }
  }, [numberOfGrids, selectedChannel])

  // const updateBookmarkVideo = (body, name) => {
  const updateBookmarkVideo = () => {
   let emptyGridChannelId = -1; 
    let itemstore = [];
    selectedChannel.forEach((item, index) => {
      if (Object.keys(item).length > 0) {
        const { id:channelId, streamsessionid: startTimestamp } = item;
        itemstore.push({ channelId, startTimestamp });
      }
    });



    const items = new Array(gridSize * gridSize).fill(null).map((_, i) => {
      return itemstore[i] || { id: emptyGridChannelId, startTimestamp:0 };
    });
    setShowBookmarkModal(false)
    const payload = {
      channelBookmarks: items,
      grid: gridSize,
      name: bookmarkName,
    }
    const profileId = JSON.parse(localStorage.getItem("user-info")).profileId
    console.log("payload",payload);
    const updateBookMarked = async (id, payload) => {
    console.log("payload id",id,payload);

      const bookmarked = await updateBookMark(id, payload)
      setBookMarkedList()
    }

    updateBookMarked(profileId, payload)
    setNewBoomarkCount(newBookmarkCount + 1);
    setBookMarkedList()
  }
  useEffect(()=>{
    if(!initialClick){
    updateBookmarkVideo()
    } else{
      setinitialClick(false)
    }
  },[bookMarkClickEvent])

  useEffect(()=>{
    console.log("newBookmarkCount",newBookmarkCount);
  },[newBookmarkCount])

  return (
    <div
      className={`grid grid-cols-${gridSize} grid-rows-${gridSize} gap-1 pt-3`}
    >
      {mergedArray &&
        mergedArray.length > 0 &&
        mergedArray.map((x, i) => {
          return (
            <div
              key={i}
              className="border border-black bg-[#272728]"
              onClick={() => handleSessionId(x.id)}
            >
              <AspectRatio ratio={16 / 9} className="w-full">
                <div
                  className={`flex h-[8%] flex-row items-center justify-between px-1 opacity-80`}
                >
                  <div className="flex items-center justify-start gap-1">
                    <Image
                      src="/vectors/video-icon.svg"
                      alt="video-icon"
                      width={20}
                      height={2}
                    />
                    {/* <span>{x.id}</span> */}
                    <p className="whitespace-nowrap text-xs text-[#898787]">{x.name}</p>
                  </div>                  
                  <Image
                    src="/vectors/Kebab_menu.svg"
                    alt="kebab-menu-icon"
                    width={20}
                    height={3.5}
                  />
                </div>
                {x.hlsurl ? (
                  <ReactPlayer
                    url={`${process.env.NEXT_PUBLIC_URL}${x.hlsurl}`}
                    muted={true}
                    playing={true}
                    ref={(el) => (playerRefs.current[x.id] = el)}
                    // width={`${gridSize}===3 ? 293.33 :${gridSize}===2? 445: 894`}
                    width="100%"
                    // height={`${gridSize}===3? 141 :${gridSize}===2? 222: 480`}
                    // height={gridHeight}
                    height="92%"
                    // onClick={updateBookmarkVideo(x)}
                  />
                ) : (
                  <div
                    className={`absolute top-0 z-0 flex h-full w-full flex-row items-center justify-center `}
                  >
                    <Image
                      alt="videonetics-logo"
                      src="/vectors/Videonetics_logo (1).svg"
                      width={80}
                      height={80}
                    />
                  </div>
                )}
              </AspectRatio>
            </div>
          )
        })}
        {/* <div>
                    {showBookmarkModal && (
                      <Popover>
                        <PopoverTrigger asChild className="gap-2">
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
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Bookmark Name</Label>
                                <input type="text" value={bookmarkName} onChange={handleBookmarkNameChange} placeholder="Enter bookmark name" />
                              </div>
                              <Button onClick={updateBookmarkVideo}>Save</Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div> */}
    </div>
  )
}
