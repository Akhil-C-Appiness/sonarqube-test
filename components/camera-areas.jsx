"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import useStore from "@/store/store"

import { Terminal, Waves } from "lucide-react"
import {
  deleteBookMarked,
  editBookMarkedApi,
  fetchBookMarkedApi,
  getBarClips,
  keepAlive,
  keepAliveArchive,
  startArchive,
  startLive,
  stopArchive,
  stopLive,
} from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { BookMarkPopUp } from "./bookmark"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

export function CameraAreas({
  selectedChannel,
  setSelectedChannel,
  liveStreamingIntervalId,
  setLiveStreamingIntervalId,
  clearView,
  clearAllView,
  selectedItems,
  setSelectedItems,
  playerRefs,
  handleSessionId,
  handleFullGrid,
  handleGridSize,
  setNewBoomarkCount,
  newBookmarkCount,
  bookMarkedList
}) {
  // console.log("selectedItems", selectedItems)
  // const [bookMarkedList, setBookMarkedList] = React.useState([])
  const [stopLiveStatus, setStopLiveStatus] = React.useState(false)
  // const [selectedBookmark, setSelectedBookmark] = React.useState([]);
  const [storeBookMark, setstoreBookMark] = React.useState({})
  const [deletePopup, setDeletePopup] = React.useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = React.useState('');
  const [isModalPopUp, setModalPopUp] = React.useState(false)
  const junctions = useStore((state) => state.junctions)
  const areas = useStore((state) => state.areas)
  const channels = useStore((state) => state.channels)
  const selectedCity = useStore((state) => state.selectedCity)
  const setVideoStitching = useStore((state) => state.setVideoStitching)
  const fetchAreas = useStore((state) => state.setAreas)
  const selectedArea = useStore((state) => state.selectedArea)
  const setSelectedArea = useStore((state) => state.setSelectedArea)
  const setSelectedAreaId = useStore((state) => state.setSelectedAreaId)
  const selectedAreaId = useStore((state) => state.selectedAreaId)
  const setJunctionId = useStore((state) => state.setJunctionId)
  const junctionId = useStore((state) => state.junctionId)
  const fetchJunctions = useStore((state) => state.setJunctions)
  const fetchChannels = useStore((state) => state.setChannels)
  const startTimeStamp = useStore((state) => state.startTimeStamp)
  const endTimeStamp = useStore((state) => state.endTimeStamp)
  const archiveStreamingId = useStore((state) => state.archiveStreamingId)
  const setArchiveStreamingId = useStore((state) => state.setArchiveStreamingId)
  const [barClipsResponse, setBarClipsResponse] = React.useState([])
  const startTimes = useStore((state) => state.startTimes)
  const setStartTimes = useStore((state) => state.setStartTimes)
  const setStartingTimes = useStore((state) => state.setStartingTimes)
  const setChannelId = useStore((state) => state.setChannelId)
  const setIsDisabled = useStore((state) => state.setIsDisabled)
  const fetchBookMarkedApi = useStore((state) => state.fetchBookMarkedApi)
  const error = useStore((state) => state.error)
  const pathname = usePathname()
  const router = useRouter()
  let trimmedPathname = pathname.slice(7)
  const setBookMarkedList = useStore((state) => state.setBookMarkedList);
  // console.log("hls", selectedChannel)
  // React.useEffect(() => {
  //   if (error) {
  //     console.log(error)
  //     router.push("/login")
  //   }
  // }, [error, router])

  // console.log("bookMarkedList", bookMarkedList);
  const toggleModalStop = () => {
    setStopLiveStatus(!stopLiveStatus)
  }
  const toggleModal = () => {
    setModalPopUp(!isModalPopUp)
  }
  const openModal = (ele) => {
    setstoreBookMark(ele)
    setModalPopUp(!isModalPopUp)
    // setSelectedItems([])
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // const getbookmark = () => {
  //   const profileId = JSON.parse(localStorage.getItem("user-info")).profileId
  //   const fetchBookMarked = async (id) => {
  //     const bookmarkedApi = await fetchBookMarkedApi(id)
  //     setBookMarkedList(bookmarkedApi)
  //   }
  //   fetchBookMarked(profileId)
  // }

  // const editedBookmark = () => {
  //   const profileId = JSON.parse(localStorage.getItem("user-info")).profileId

  //   const fetchBookMarked = async (id) => {
  //     const editBookmarked = await editBookMarkedApi(id)
  //     // console.log("res", editBookmarked)
  //     setBookMarkedList(editBookmarked)
  //   }

  //   editedBookmark(profileId)
  // }

  const deleteBookmark = async (ele) => {
    const profileId = JSON.parse(localStorage.getItem("user-info")).profileId

    const deleteBookMarkData = async (id, bookmarkname) => {
      const deletedBookmoark = await deleteBookMarked(id, bookmarkname)
      setBookmarkToDelete(bookmarkname)
      setDeletePopup(!deletePopup)
      setBookMarkedList()
    }
    deleteBookMarkData(profileId, ele.name)
  }

  const fetchLiveResponse = async (payload, id) => {
    const response = await startLive(payload, id)
    setLiveStreamingIntervalId((prevState) => [
      ...prevState,
      response.data.result[0].streamsessionid,
    ])
    const checkedChannel = channels.find((x) => id === x.id)
    delay(5000)
    const newObj = Object.assign({}, checkedChannel, response.data.result[0])
    setSelectedChannel((prevState) => [...prevState, newObj])
  }
  const fetchArchiveResponse = async (payload, id) => {
    console.log(payload)
    const response = await startArchive(payload, id)
    await delay(10000)
    setArchiveStreamingId(response.data.result)
  }
  const fetchBarClipsResponse = async (id) => {
    const payload = {
      channelId: id,
      startingTime: startTimeStamp,
      endingTime: endTimeStamp,
    }
    console.log(payload, "payload")
    const response = await getBarClips(payload)
    setBarClipsResponse(response.data.result)
    setIsDisabled(false)
    const startingTimes = response.data.result.map((x) => x.startTimeStamp)
    setStartingTimes(startingTimes)
    const startTimesInLocaleFormat = startingTimes.map((x) =>
      new Date(x).toLocaleTimeString()
    )
    setStartTimes(startTimesInLocaleFormat)
    const firstTimeStamp = startingTimes[0]
    const archiveVideoPayload = {
      channelid: id,
      starttimestamp: firstTimeStamp,
      resolutionwidth: 898,
      resolutionheight: 505,
      withaudio: true,
    }
    console.log(archiveVideoPayload, "archiveVideoPayload")
    if (response.data.result.length > 0) {
      await fetchArchiveResponse(archiveVideoPayload, id)
    }
  }
  React.useEffect(() => {
    const intervals =
      liveStreamingIntervalId &&
      liveStreamingIntervalId.length > 0 &&
      liveStreamingIntervalId.map((x) => {
        return setInterval(() => {
          keepAlive(x)
        }, 30000)
      })
    return () => {
      intervals &&
        intervals.length > 0 &&
        intervals.forEach((interval) => clearInterval(interval))
    }
  }, [liveStreamingIntervalId])
  React.useEffect(() => {
    let intervalId = null
    if (archiveStreamingId.length > 0) {
      intervalId = setInterval(() => {
        keepAliveArchive(archiveStreamingId[0].streamsessionid)
      }, 30000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [archiveStreamingId])

  // Handle bookmark

  const handlerBookmark = (ele) => {
   clearAllView()
    if (ele.channelBookmarks.length > 0) {
      ele.channelBookmarks.forEach((video) => {
        const liveVideopayload = {
          channelid: video.channelId,
          resolutionwidth: 892,
          resolutionheight: 481,
          withaudio: false,
        }
        console.log("videoId", liveVideopayload)

        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, video.channelId]);
        console.log("selectedItems", selectedItems)

        let testGrid = ele.grid + "*" + ele.grid

        handleGridSize(testGrid)
        setTimeout(fetchLiveResponse(liveVideopayload, video.channelId),1000);
      })
      openModal(ele)
    }
  }

  const handleChannels = async (e, id) => {
    if (trimmedPathname === "live") {
      if (e) {
        setSelectedItems([...selectedItems, id])
        const liveVideopayload = {
          channelid: id,
          resolutionwidth: 892,
          resolutionheight: 481,
          withaudio: false,
        }

        await fetchLiveResponse(liveVideopayload, id)
        // if (trimmedPathname === "live") {
        // }
        // if (trimmedPathname === "archive") {
        //   await fetchBarClipsResponse(id)
        // }
      } else {
        clearView(id)
      }
    }
    if (trimmedPathname === "archive") {
      console.log(selectedItems)
      if (e) {
        setChannelId(id)
        setSelectedItems([id])
        await fetchBarClipsResponse(id)
      } else {
        setChannelId(null)
        setSelectedItems([])
        setArchiveStreamingId([])
        console.log(archiveStreamingId[0].streamsessionid)
        if(archiveStreamingId[0].streamsessionid){
          await stopArchive(archiveStreamingId[0].streamsessionid)
        }
        
      }
    }
  }
  const handleAreas = (e) => {
    const selectedAreaId = areas.find((area) => e === area.name)
    setSelectedArea(e)
    setSelectedAreaId(selectedAreaId.id)
  }

  React.useEffect(() => {
    fetchAreas(selectedCity)
    if (selectedArea) {
      fetchJunctions(selectedCity, selectedAreaId)
    }
    if (junctionId) {
      fetchChannels(selectedCity, selectedAreaId, junctionId)
    }
  }, [
    fetchAreas,
    fetchChannels,
    fetchJunctions,
    junctionId,
    selectedArea,
    selectedAreaId,
    selectedChannel,
    selectedCity,
  ])

  // React.useEffect(() => {
  //   getbookmark()
  // }, [])
  // React.useEffect(() => {
  // }, [bookMarkedList])

  React.useEffect(()=>{
    console.log("newBookmarkCount test",newBookmarkCount);
  },[newBookmarkCount])

 
  

   const handleStopLive = (ele) => {
     console.log("ele", ele?.channelBookmarks);
     var result = ele?.channelBookmarks.map(videoId =>  videoId.startTimestamp);
     console.log(result);
     

      for(let i =0 ; i <result.length;i++){
        console.log(result[i]);
        if(result[i] !== 0){
          stopLive(result[i])
        }

      }
    // props.onRequestClose()
  }

  return (
    <div className="w-72 bg-white p-4">
      <Select
        value={selectedArea}
        onValueChange={(e) => {
          handleAreas(e)
        }}
      >
        <SelectTrigger>
          <SelectValue>
            {selectedArea ? selectedArea : "Select Area"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {areas?.map((area) => {
              return (
                <SelectItem value={area.name} key={area.id}>
                  {area.name}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex flex-row items-center gap-2">
              <Image
                alt="junctions icon"
                src="/vectors/Junction.svg"
                width={24}
                height={24}
              />
              <span className="text-sm">Junctions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                {junctions &&
                  junctions.length > 0 &&
                  junctions.map((junction) => {
                    return (
                      <AccordionTrigger
                        onClick={() => setJunctionId(junction.id)}
                        key={junction.id}
                      >
                        <div className="flex flex-row items-center">
                          <Image
                            alt="cctv icon"
                            src="/vectors/cctv_icon.svg"
                            width={24}
                            height={24}
                          />
                          <span className="px-2 text-sm">{junction.name}</span>
                        </div>
                      </AccordionTrigger>
                    )
                  })}
                <AccordionContent>
                  {channels.length > 0 &&
                    channels.map((cam) => {
                      return (
                        <div
                          className="flex flex-row items-center justify-between p-2"
                          key={cam.id}
                          // onClick={updateBookmarkVideo(cam.id)}
                        >
                          <div className="flex items-center justify-start gap-2">
                            <Image
                              alt="video-icon"
                              src="/vectors/video-icon.svg"
                              width={24}
                              height={20}
                            />
                            <span className="text-sm">{cam.name}</span>
                          </div>
                          <Checkbox
                            checked={selectedItems?.includes(cam.id)}
                            onCheckedChange={(e) => {
                              handleChannels(e, cam.id)
                            }}
                          />
                        </div>
                      )
                    })}
                </AccordionContent>
              </AccordionItem>

              {/* <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      alt="cctv icon"
                      src="/vectors/cctv_icon.svg"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm">5th Phase (7 Cameras)</span>
                  </div>
                </AccordionTrigger>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      alt="cctv icon"
                      src="/vectors/cctv_icon.svg"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm">6th Phase (12 Cameras)</span>
                  </div>
                </AccordionTrigger>
              </AccordionItem> */}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <hr className="bg-[#D9D9D9]" />
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex flex-row">
              <Image
                alt="bookmark-icon"
                src="/vectors/bookmark.svg"
                width={16}
                height={20}
              />
              <span className="px-4 text-sm">Bookmark</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {bookMarkedList?.length > 0 &&
                bookMarkedList?.map((ele) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between gap-4 p-2"
                      key={ele.name}
                      // onClick={() => handlerBookmark(ele)}
                    >
                      <Button
                        className="border-none text-sm flex"
                        onClick={() => handlerBookmark(ele)}
                        variant="outline"
                      >
                        {ele.name}
                      </Button>
                      <Button
                        className="border-none text-sm"
                        onClick={() => deleteBookmark(ele)}
                        variant="outline"

                      >
                        <Image
                          alt="delete-icon"
                          src="/images/delete-icon-red.svg"
                          width={16}
                          height={20}
                        />
                        
                      </Button>
                      
                       {/* {!stopLiveStatus && (
                      <Button
                        className="border-none text-sm"
                        onClick={()=>handleStopLive(ele)}
                        variant="outline"

                      >
                        <Image
                          alt="delete-icon"
                          src="/images/close-icon.svg"
                          width={30}
                          height={30}
                        />
                        
                      </Button>
                    )} */}
                      
                    </div>
                    
                  )
                })}
                
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
    </div>
  )
}
