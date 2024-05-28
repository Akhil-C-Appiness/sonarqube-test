"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
import { usePathname } from "next/navigation"
import useStore from "@/store/store"

import {
  deleteBookMarked,
  getBarClips,
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "../ui/input"
import { setSelectedCameraList, stopLiveCamId, updateCamera } from "./livegrid"

const Image = dynamic(() => import("next/image"))

const VideoSidebar = () => {
  const allJunc = useStore((state) => state.allJunc)
  const setJunctionsTree = useStore((state) => state.setJunctionsTree)
  const allChannels = useStore((state) => state.allChannels)
  const setAllChannels = useStore((state) => state.setAllChannels)
  const selectedArea = useStore((state) => state.selectedArea)
  const setSelectedArea = useStore((state) => state.setSelectedArea)
  const areas = useStore((state) => state.areas)
  const fetchAreas = useStore((state) => state.setAreas)
  const setSelectedAreaId = useStore((state) => state.setSelectedAreaId)
  const selectedAreaId = useStore((state) => state.selectedAreaId)
  const junctions = useStore((state) => state.junctions)
  const fetchJunctions = useStore((state) => state.setJunctions)
  const fetchChannels = useStore((state) => state.setChannels)
  const channels = useStore((state) => state.channels)
  const bookMarkedList = useStore((state) => state.bookMarkedList)
  const setJunctionId = useStore((state) => state.setJunctionId)
  const setJunctionMsId = useStore((state) => state.setJunctionMsId)
  const junctionId = useStore((state) => state.junctionId)
  const selectedCity = useStore((state) => state.selectedCity)
  const setSelectedCameras = useStore((state) => state.setSelectedCameras)
  const setAreas = useStore((state) => state.setAreas)
  const setGridSize = useStore((state) => state.setGridSize)
  const setBookMarkedList = useStore((state) => state.setBookMarkedList)
  const archiveStreamingId = useStore((state) => state.archiveStreamingId)
  const setArchiveStreamingId = useStore((state) => state.setArchiveStreamingId)
  const { selectedCameras, addCamera, resetCamera } = useStore()
  const [selectedJunAcc, setSelectedJunAcc] = useState(null)
  const [selectedCamAcc, setSelectedCamAcc] = useState()
  const [barClipsResponse, setBarClipsResponse] = useState([])
  const startTimeStamp = useStore((state) => state.startTimeStamp)
  const endTimeStamp = useStore((state) => state.endTimeStamp)
  const setArchiveMode = useStore((state) => state.setArchiveMode)
  const updateSelectedCamera = useStore((state) => state.updateSelectedCamera)
  const [searchInput, setSearchInput] = useState("")
  const junctionsAndCameras = [...junctions, ...channels]
  const [filtered, setFiltered] = useState([])
  // const [displayText ,setDisplayText ] = useState(false)
  const { displayText, toggleDisplayText, gridArray, setGridArray } = useStore()
  const [showBookmarkAccordion, setShowBookmarkAccordion] = useState(false)
  const [showJunctionAccordion, setShowJunctionAccordion] = useState(false)

  // setAreas
  // setLiveStreamingIntervalId

  // setSelectedChannel
  // selectedItems

  useEffect(() => {
    console.log(selectedCameras, "selectedCameras")
  }, [selectedCameras])
  useEffect(() => {
    if (selectedArea) {
      fetchJunctions(selectedCity, selectedAreaId)
      setSelectedCameras([])
      // resetChannels()
    }
  }, [selectedArea])
  useEffect(() => {
    setJunctionsTree([])
  }, [])

  useEffect(() => {
    if (selectedCity) {
      setAreas(selectedCity)
    }
  }, [selectedCity])

  useEffect(() => {
    if (junctionId) {
      fetchChannels(selectedCity, selectedAreaId, junctionId)
    }
  }, [junctionId])

  useEffect(() => {
    if (channels?.length) {
      setSelectedJunAcc("junction-1")
      setSelectedCamAcc("camera-1")
    }
  }, [channels])
  useEffect(() => {
    setSelectedJunAcc("junction-1")
    setSelectedCamAcc("camera-1")
    if (junctions?.length) {
      setJunctionId(junctions[0].id)
      setJunctionMsId(junctions[0].serverid)
    }
  }, [junctions])
  useEffect(() => {
    setAllChannels()
  }, [])
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const handleAreas = (e) => {
    const selectedAreaId = areas.find((area) => e === area.name)
    setSelectedArea(e)
    setSelectedAreaId(selectedAreaId.id)
    setShowBookmarkAccordion(true)
  }

  const afterLiveStreamStart = () => {
    console.log(selectedCameras)
    debugger
  }
  const pathName = usePathname()
  let trimmedPathname = pathName.slice(5)
  let trimmedPathname2 = pathName.slice(13)

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
    if (!startTimeStamp) {
      return
    }
    const response = await getBarClips(payload)
    setBarClipsResponse(response.data.result)
    const startingTimes = response.data.result.map((x) => x.startTimeStamp)
    const firstTimeStamp = startingTimes[0]
    const archiveVideoPayload = {
      channelid: id,
      starttimestamp: firstTimeStamp,
      resolutionwidth: 898,
      resolutionheight: 505,
      withaudio: true,
    }
    // console.log(archiveVideoPayload, "archiveVideoPayload")
    if (response.data.result.length > 0) {
      await fetchArchiveResponse(archiveVideoPayload, id)
    }
  }
  const handleChannels = async (e, id, name) => {
    if (trimmedPathname === "live") {
      if (e) {
        // if (selectedCameras.findIndex((x) => x.camId === id) === -1) {
        addCamera({
          camId: id,
          isLoading: true,
          name: name,
          loadingMessage: "Starting Stream",
        })
        // }
        const liveVideopayload = {
          channelid: id,
          resolutionwidth: 892,
          resolutionheight: 481,
          withaudio: false,
        }
        var valueReturned = updateCamera(id, liveVideopayload)
        valueReturned
          .then((liveRes) => {
            console.log("Promise resolved with result:", liveRes)
            updateSelectedCamera(id, "Stream Loaded", liveRes)
            setSelectedCameraList(id, true)
          })
          .catch((error) => {
            console.error("Promise rejected with error:", error)
            // setSelectedCameras([
            //   ...selectedCameras,
            //   {hasError: true, camId:id, name:name, isLoading:false, loadingMessage:'Error'},
            // ])
            updateSelectedCamera(id, "Error")
            setSelectedCameraList(id, false)
          })
      } else {
        // clearView(id)
        setSelectedCameras(selectedCameras.filter((x) => x.camId !== id))
        setGridArray(id)
        // console.log(selectedCameras)
        const selCam = selectedCameras.find((x) => x.camId === id)
        // console.log(selCam, "selCam")
        if (selCam) {
          stopLiveCamId(id)
        }
        setArchiveStreamingId([])
        setArchiveMode(false)
        // streamsessionid
      }
    }
    if (trimmedPathname2 === "archive") {
      if (e) {
        if (selectedCameras.findIndex((x) => x.camId === id) === -1) {
          addCamera({
            camId: id,
            isLoading: true,
            initial: true,
            name: name,
            isSingle: true,
            loadingMessage: "Starting Stream",
          })
          await fetchBarClipsResponse(id)
        }
      } else {
        setSelectedCameras(selectedCameras.filter((x) => x.camId !== id))
        const selCam = selectedCameras.find((x) => x.camId === id)
        console.log(selCam)
        if (selCam) {
          if (archiveStreamingId[0]?.streamsessionid) {
            await stopArchive(archiveStreamingId[0]?.streamsessionid)
          }

          setArchiveStreamingId([])
          setArchiveMode(false)
        }
      }
    }
  }
  useEffect(() => {
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
  const fetchLiveResponse = async (payload, id) => {
    const response = await startLive(payload, id)
    return response.data.result[0]
  }
  useEffect(() => {
    // console.log(bookMarkedList, "bookMarkedList")
  }, [bookMarkedList])

  const deleteBookmark = async (ele) => {
    const profileId = JSON.parse(localStorage.getItem("user-info")).profileId

    const deleteBookMarkData = async (id, bookmarkname) => {
      await deleteBookMarked(id, bookmarkname)
      setBookMarkedList()
    }
    deleteBookMarkData(profileId, ele.name)
  }

  const handlerBookmark = (ele) => {
    // clearAllView()
    resetCamera()
    if (ele.channelBookmarks.length > 0) {
      console.log(ele.channelBookmarks)
      ele.channelBookmarks
        .filter((cb) => cb.channelId !== -1)
        .forEach((video) => {
          const liveVideopayload = {
            channelid: video.channelId,
            resolutionwidth: 892,
            resolutionheight: 481,
            withaudio: false,
          }
          console.log("videoId", liveVideopayload)

          setGridSize(ele.grid)
          const camName = allChannels.find(
            (camObj) => camObj.id === video.channelId
          ).name
          handleChannels(true, video.channelId, camName)
          // setTimeout(async () => {
          //   console.log("video.channelId:: " + video.channelId)
          //   var valueReturned = updateCamera(video.channelId, liveVideopayload)
          //   valueReturned
          //     .then((liveRes) => {
          //       const camName = allChannels.find(
          //         (camObj) => camObj.id === video.channelId
          //       ).name
          //       console.log("Promise resolved with result:", liveRes)
          //       addCamera(
          //         // ...selectedCameras,
          //         {
          //           ...liveRes,
          //           camId: video.channelId,
          //           isLoading: false,
          //           name: camName,
          //           loadingMessage: "Stream Loaded",
          //         },
          //     )
          //       // setSelectedCameraList(video.channelId, true)
          //       setDisplayText(false)
          //     })
          //     .catch((error) => {
          //       console.error("Promise rejected with error:", error)
          //       addCamera([
          //         // ...selectedCameras,
          //         {
          //           hasError: true,
          //           camId: video.channelId,
          //           isLoading: false,
          //           name: camName,
          //           loadingMessage: "Error",
          //         },
          //       ])
          //       // setSelectedCameraList(video.channelId, false)
          //     })
          // }, 1000)
        })

      //  openModal(ele)
    }
  }
  useEffect(() => {
    if (selectedArea) {
      setShowJunctionAccordion(true)
    } else {
      setShowJunctionAccordion(false)
    }
  }, [selectedArea])

  const handleJunctionSearch = (event) => {
    setSearchInput(event.target.value.toLowerCase())
  }
  const filteredItems = junctionsAndCameras.filter((item) => {
    if (searchInput === "") {
      return
    } else {
      return item.name.toLowerCase().includes(searchInput.toLowerCase())
    }
  })
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
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
          <SelectContent className="max-h-44 overflow-y-scroll">
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
      </div>
      <div>
        <Input
          type="text"
          placeholder="Search Junctions & Channels"
          value={searchInput}
          onChange={handleJunctionSearch}
        />
        {showJunctionAccordion && (
          <Accordion type="single" collapsible defaultValue={selectedJunAcc}>
            <AccordionItem
              value="junction-1"
              onValueChange={(val) => setSelectedJunAcc(val)}
            >
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
                {junctions &&
                  junctions.map((junction) => (
                    <Accordion
                      key={junction.id}
                      type="single"
                      collapsible
                      defaultValue={selectedCamAcc}
                    >
                      <AccordionItem
                        value={junction.id}
                        onValueChange={(val) => setSelectedCamAcc(val)}
                      >
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            <Image
                              alt="cctv icon"
                              src="/vectors/cctv_icon.svg"
                              width={24}
                              height={24}
                            />
                            <span className="px-2 text-sm">
                              {junction.name}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {allJunc
                            ?.find(
                              (junc) => junc.vJunction?.id === junction.serverid
                            )
                            ?.channel.map((cam) => (
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
                                  checked={
                                    selectedCameras?.findIndex(
                                      (x) => x.camId === cam.id
                                    ) !== -1
                                  }
                                  onCheckedChange={(e) => {
                                    handleChannels(e, cam.id, cam.name)
                                  }}
                                />
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <hr className="bg-[#D9D9D9]" />
        {showBookmarkAccordion && (
          <Accordion type="single" collapsible>
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
                            className="flex border-none text-sm"
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
                        </div>
                      )
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  )
}

// export const display = ()=>{
//   setDisplayText(!displayText)
// }

export default VideoSidebar
