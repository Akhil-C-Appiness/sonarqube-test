import Image from "next/image"
import React, { useState, useEffect } from "react"
import ReactPlayer from "react-player"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { keepAlive, startLive, stopLive } from "@/lib/api"

export const BookMarkPopUp = (props)=>{

    const [storeRes, setStoreRes] = useState({})


    useEffect(() => {
        const interval = setInterval(keepAlive(props.ele.channelBookmarks[0].startTimestamp), 30000)
        return () => {
          clearInterval(interval)
        }
      })
      const handleStopLive = () => {
        stopLive(props.ele.channelBookmarks[0].startTimestamp)
        props.onRequestClose()
      }
      useEffect(() => {
        const payload = {
          channelid: props.ele.channelBookmarks[0].channelId,
          resolutionwidth: 892,
          resolutionheight: 481,
          withaudio: false,
        }
        const fetchLiveResponse = async (payload) => {
          const response = await startLive(payload)
          setStoreRes(response.data.result[0])
        }
        fetchLiveResponse(payload)
      }, [props.ele.channelBookmarks])

    useEffect(() => {
        function onKeyDown(event) {
          if (event.keyCode === 27) {
            onRequestClose()
          }
        }
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", onKeyDown)
        return () => {
          document.body.style.overflow = "visible"
          document.removeEventListener("keydown", onKeyDown)
        }
      })

    return(
        <div className="fixed  inset-0 flex items-center justify-center border-4 bg-[#0F0F10] bg-opacity-10 backdrop-blur-[1px]">
                  <div className="w-[900px]">
                    <div className=" mx-20 h-[500px] bg-black p-2 pl-6 ">
                      <div className="flex justify-end text-[#6F6F70]">
                        {/* <Image
                          src="/vectors/video-icon.svg"
                          alt="video-icon"
                          width={20}
                          height={2}
                        /> */}
                        {/* <span>{props.ele.name}</span> */}
                        <span className="font-medium text-[#6F6F70]">
                          ...
                          <Button
                            variant="outline"
                            className="border-none "
                            onClick={props.onRequestClose}
                          >
                            x
                          </Button>
                        </span>
                      </div>
                      <div
      className={`grid grid-cols-${props.gridSize} grid-rows-${props.gridSize} gap-1 pt-3`}
    >
      {props.ele.channelBookmarks &&
        props.ele.channelBookmarks.length > 0 &&
        props.ele.channelBookmarks.map((x, i) => {
          return (
            <div
              key={i}
              className="border border-black bg-[#272728]"
              onClick={() => handleSessionId(x.channelId)}
            >
              <AspectRatio ratio={16 / 9} className="w-full">
                <div
                  className={`flex h-[8%] flex-row items-center justify-around  opacity-75 `}
                >
                  {/* <Image
                    src="/vectors/video-icon.svg"
                    alt="video-icon"
                    width={20}
                    height={2}
                  /> */}
                  {/* <span>{x.channelId}</span> */}
                  {/* <span className="whitespace-nowrap text-xs">{x.channelId}</span> */}
                  {/* <Image
                    src="/vectors/Kebab_menu.svg"
                    alt="kebab-menu-icon"
                    width={20}
                    height={3.5}
                  /> */}
                </div>
                {storeRes.hlsurl ? (
                  <ReactPlayer
                    url={`${process.env.NEXT_PUBLIC_URL}${storeRes.hlsurl}`}
                    muted={true}
                    playing={true}
                    // ref={(el) => (playerRefs.current[x.id] = el)}
                    // width={`${gridSize}===3 ? 293.33 :${gridSize}===2? 445: 894`}
                    width="100%"
                    // height={`${gridSize}===3? 141 :${gridSize}===2? 222: 480`}
                    // height={gridHeight}
                    height="92%"
                    // onClick={updateBookmarkVideo(x)}
                  />
                ) : (
                  <div
                    className={`relative top-[20%] flex flex-row items-center justify-center `}
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
    </div>
                    </div>
                  </div>
                </div>
    )
}
 