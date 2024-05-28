"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
import useStore from "@/store/store"
import Timeline from "react-visjs-timeline"

const Image = dynamic(() => import("next/image"))

const ArchiveControl = ({
  startTime,
  endTime,
  barClips,
  setStartTime,
  setEndTime,
  currentTime,
  setCurrentTime,
  updateCameraArchive,
  handleFastForward,
  handleFastRewind,
  playerState,
  handlePlay,
  handlePause,
  handleEnded,
}) => {
  const timelineRef = useRef(null)
  // const updateCameraArchive = useStore((state) => state.updateCameraArchive)
  const [barClipsList, setBarClipsList] = useState([])
  const [playerTime, setPlayerTime] = useState(null)

  useEffect(() => {
    let tmpBarClips = []
    barClips.map((bc) => {
      tmpBarClips.push({
        start: bc.startTimeStamp,
        end: bc.endTimeStamp,
      })
    })
    setBarClipsList(tmpBarClips)
  }, [barClips])
  const options = {
    width: "100%",
    height: "80px",
    stack: false,
    start: startTime,
    end: endTime,
    // min: new Date(),
    // max: new Date(),

    zoomMax: 24 * 60 * 60 * 1000,
    zoomMin: 60 * 1000,
    showMajorLabels: true,
    showCurrentTime: true,
    type: "background",
    format: {
      minorLabels: {
        minute: "h:mma",
        hour: "ha",
      },
    },
  }

  const findNearestTimestamp = (barcliparray, selectedDatetime) => {
    // Convert selectedDatetime to timestamp in milliseconds
    let selectedTimestamp = new Date(selectedDatetime).getTime()

    // Initialize nearest object and difference
    let nearestObject = null
    let nearestDifference = Infinity

    // Iterate over the array
    for (let i = 0; i < barcliparray.length; i++) {
      // Calculate the absolute difference between the selectedTimestamp and the current object's startTimeStamp
      let difference = Math.abs(
        barcliparray[i].startTimeStamp - selectedTimestamp
      )

      // If this difference is less than the current nearestDifference, update nearestObject and nearestDifference
      if (difference < nearestDifference) {
        nearestObject = barcliparray[i]
        nearestDifference = difference
      }
    }

    // Return the nearest object
    return nearestObject
  }

  const triggerArchive = async (firstTimeStamp, id) => {
    const archiveVideoPayload = {
      channelid: id,
      starttimestamp: firstTimeStamp,
      resolutionwidth: 898,
      resolutionheight: 505,
      withaudio: true,
    }
    //   await startArchive(archiveVideoPayload, id)
    //   const response = await updateCameraArchive(archiveVideoPayload, id)
    await updateCameraArchive(id, archiveVideoPayload)
    //    console.log(response.data.result, 'archiveRes')
    //    setArchiveStreamingId(response.data.result)
  }

  useEffect(() => {
    // findNearestTimestamp
    if (currentTime) {
      const nearestClip = findNearestTimestamp(barClips, currentTime)
      if (nearestClip) {
        console.log(nearestClip.startTimeStamp, nearestClip.channelID, "asdf")
        triggerArchive(nearestClip.startTimeStamp, nearestClip.channelID)
        setCurrentTime(nearestClip.startTimeStamp)
      }
    }
  }, [playerTime])
  useEffect(() => {
    if (barClips.length) {
      console.log(barClips[0], "asdf")
      triggerArchive(barClips[0].startTimeStamp, barClips[0].channelID)
      setCurrentTime(barClips[0].startTimeStamp)
    }
  }, [barClips])
  const clickHandler = (props) => {
    // ...
    console.log(props)
    console.log(barClipsList)
    timelineRef.current.$el.moveTo(props.time, { animation: true }, (props) => {
      console.log("movedTo", props)
    })
    setCurrentTime(props.time)
    setPlayerTime(props.time)
    // ...
  } // Specify barClips as a dependency

  const rangeChangeHandler = (items) => {
    // console.log(items)
    setStartTime(items.start)
    setEndTime(items.end)
  }

  return (
    <div>
      <section className="container flex w-full flex-row items-center pb-8 ">
        <div className="flex flex-row items-center gap-[2em]">
          <div onClick={handleFastRewind} className="cursor-pointer">
            <Image
              src="/vectors/Fast Rewind.svg"
              alt="rewind"
              width={24}
              height={24}
            />
          </div>
          {playerState === "paused" ? (
            <div onClick={handlePlay} className="cursor-pointer">
              <Image
                src="/vectors/Play.svg"
                alt="play"
                width={24}
                height={24}
              />
            </div>
          ) : (
            <div onClick={handlePause} className="cursor-pointer">
              <Image
                src="/vectors/pause.svg"
                alt="pause"
                width={24}
                height={24}
              />
            </div>
          )}
          <div onClick={handleFastForward} className="cursor-pointer">
            <Image
              src="/vectors/Fast Forward.svg"
              alt="forward"
              width={24}
              height={24}
            />
          </div>
          {/* <Image
            src="/vectors/Flag.svg"
            alt="flag"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <Image
            src="/vectors/Refresh.svg"
            alt="refresh"
            width={24}
            height={24}
            className="cursor-pointer"
          /> */}
        </div>
        <div className="ml-auto flex flex-row items-center gap-[2em]">
          {/* <span
            // onClick={handlePlaybackRateChange}
            className="cursor-pointer text-[#6F6F70]"
          > */}
          {/* {playbackRate}x */}
          {/* </span> */}
          {/* <Image
            src="/vectors/Crop.svg"
            alt="crop"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <Image
            src="/vectors/Volume.svg"
            alt="volume"
            width={24}
            height={24}
            className="cursor-pointer"
            // onClick={handleMute}
          />
          <Image
            src="/vectors/Download.svg"
            alt="download"
            width={24}
            height={24}
            className="cursor-pointer"
            // onClick={handleCapture}
          /> */}
        </div>
      </section>
      <Timeline
        options={options}
        items={barClipsList}
        ref={timelineRef}
        clickHandler={clickHandler}
        rangechangeHandler={rangeChangeHandler}
        // groups={groups}
        currentTime={currentTime}
      />
    </div>
  )
}

export default ArchiveControl
