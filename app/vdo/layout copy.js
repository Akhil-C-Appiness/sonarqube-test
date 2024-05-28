"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import useStore from "@/store/store"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

import {
  getFileContent,
  getViolationString,
  stopLive,
  getAllChannels
} from "@/lib/api"
import { CameraAreas } from "@/components/camera-areas"
import CameraLayout from "@/components/camera-layout"
import FullscreenGrid from "@/components/fullscreengrid"

import SearchEvents from "./search/page"

const VideoLayout = ({ children }) => {
  //events
  let [snapArray, setSnapArray] = useState([])
  let lastFiveElements = snapArray.slice(-5)
  const [dataTable, setDataTable] = useState([]);

  function addImage(imgsrc) {
    // console.log(imgsrc);
    setSnapArray((prevArray) => [...prevArray, imgsrc])
  }

  const updatedData = dataTable.length > 5 ? [snapArray, ...dataTable.slice(0, 5)] : [...dataTable, snapArray];
  // setDataTable(updatedData);
    // console.log("snapArray",snapArray);

  const emptyObjects = new Array(9).fill({})
  const [selectedChannel, setSelectedChannel] = useState(emptyObjects)
  const [grid, setGrid] = useState("3*3")
  const [gridSize, setGridSize] = useState(3)
  const [fullgrid, setFullGrid] = useState(false)
  const [liveStreamingIntervalId, setLiveStreamingIntervalId] = useState([])
  const [sessionId, setSessionId] = useState("")
  const [selectedItems, setSelectedItems] = useState([])
  const [newBookmarkCount, setNewBoomarkCount] = useState(0);

  const playerRefs = useRef([])
  const numberOfGrids = gridSize * gridSize
  const router = useRouter()
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(7)
  const fetchCities = useStore((state) => state.setCities)
  const setArchiveStreamingId = useStore((state) => state.setArchiveStreamingId)
  const archiveStreamingId = useStore((state) => state.archiveStreamingId);
  const bookMarkedList = useStore((state) => state.bookMarkedList);
  const setBookMarkedList = useStore((state) => state.setBookMarkedList);
  

  useEffect(() => {
    setBookMarkedList()
  }, [])

  useEffect(()=>{
    console.log(bookMarkedList, 'bookMarkedList')
  }, [bookMarkedList])
 


  useEffect(() => {
    const severity = ["Critical", "Medium", "Low"]
    const regType = ["Others", "Private", "Commercial", "Army", "Electrical"]
    const vehicleColor = [
      "",
      "Black",
      "White",
      "Gray",
      "Red",
      "Yellow",
      "Green",
      "Blue",
      "Orange",
      "Silver",
      "Brown",
    ]
    const vehicleClass = [
      "Motorbike",
      "Auto",
      "Car",
      "Carrier",
      "Bus",
      "Lorry",
      "Maxicab",
      "Jeep",
      "Electric Scooter",
      "Electric Car",
    ]
    let isloggedin = localStorage.getItem("isloggedin")
    let userName
    let JSESSIONID
    if (isloggedin) {
      let userInfoString = localStorage.getItem("user-info")
      let userInfo = JSON.parse(userInfoString)
      userName = userInfo.id
      JSESSIONID = localStorage.getItem("JSESSIONID")
    } else {
      router.push("/login")
    }
    const client = new Client({
      webSocketFactory: () => new SockJS("/v-notificationserver/notification"),
      connectHeaders: {
        login: userName,
        JSESSIONID: JSESSIONID,
      },
      debug: function (str) {
        // console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    client.heartbeatIncoming = 10000
    client.heartbeatOutgoing = 10000

    client.onConnect = function (frame) {
      console.log("Connected: " + frame)
      client.subscribe("/authentication/admin", (message) => {
        // console.log(JSON.parse(message.body))
      })

      client.subscribe("/event", async function (message) {
        let receivedData = JSON.parse(message.body)
        // console.log("test123", receivedData)
        if (receivedData.status == 401) {
          router.push("/login")
        }
        let eventId = receivedData.result[0].id
        let vehicleNo = receivedData.result[0].objectId
        let cameraName = receivedData.result[0].cameraName
        let junctionName = receivedData.result[0].junctionName
        let eventMessage = receivedData.result[0].message
        let severityval = severity[receivedData.result[0].priority]
        let violationType = await getViolationString(
          receivedData.result[0].eventType
        )
        let objectProperty6 = receivedData.result[0].objectProperty6
        let registrationType = regType[objectProperty6]
        let speed = receivedData.result[0].objectProperty4
        let color = vehicleColor[receivedData.result[0].objectProperty1]
        let vehicleclass = vehicleClass[receivedData.result[0].objectProperty2]
        let speedLimit = receivedData.result[0].objectProperty3
        let datetime = receivedData.result[0].startTime
        datetime = new Date(datetime).toLocaleString()
        let datetimeArray = datetime.split(",")
        let date = datetimeArray[0]
        let time = datetimeArray[1]
        let enddatetime = receivedData.result[0].endTime;
        enddatetime = new Date(enddatetime).toLocaleString();
        let enddatetimeArray = enddatetime.split(",");
        let enddate = enddatetimeArray[0];
        let endtime = enddatetimeArray[1];
        let eventData = receivedData.result[0].snapUrls[0]
        let channelId = receivedData.result[0].channelId
        const channelResponse = await getAllChannels();
        let lane = 1;
        const filteredchannel = channelResponse.filter(obj => obj.id === channelId);
        const channelValue = filteredchannel[0].mediaChannelParam;
        if(channelValue !== null){
            const laneValue = channelValue.laneNumber;
            if(laneValue !== null){
                lane = laneValue;
            }
        }
        let eventobj = {
          filepath: eventData,
        }
        const response = await getFileContent(eventobj)
        let eventDataArray = receivedData.result[0].snapUrls;
        let snapurlArry = [];
        eventDataArray.map(async (item) => {
            let eventobj2 = {
                "filepath" : item
            }
            let response2 = await getFileContent(eventobj2);
            let base64String2 = 'data:image/png;base64,'+response2;
            snapurlArry.push(base64String2);
        })
        if (response) {
          var base64String = "data:image/png;base64," + response
          var eventObj = {
            id: eventId,
            vehicleNo: vehicleNo,
            cameraName: cameraName,
            junctionName: junctionName,
            eventMessage: eventMessage,
            violationType: violationType,
            severity: severityval,
            registrationType: registrationType,
            speed: speed,
            speedLimit: speedLimit,
            color: color,
            vehicleclass: vehicleclass,
            date: date,
            time: time,
            enddate:enddate,
            endtime:endtime,
            eventsrc: base64String,
            channelId: channelId,
            lane:lane,
            snapurlArry:snapurlArry
          }
          addImage(eventObj)
        }
      })
    }

    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"])
      console.log("Additional details: " + frame.body)
    }

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [router])
  const handleGridSize = (val) => {
    // console.log("val", val)
    setGrid(val)
    // console.log("val", grid)

    setGridSize(val.slice(0, 1))
  }
  const handleFullGrid = (val) => {
    setFullGrid(val)
  }
  useEffect(() => {
    fetchCities()
  }, [fetchCities])
  const handleSessionId = (id) => {
    setSessionId(id)
  }
  const handleMenuOptions = (val) => {
    if (val === "clear") {
      clearView(sessionId)
    }
    if (val === "clear all") {
      clearAllView()
    }
  }
  const clearView = async (id) => {
    setSelectedItems((prevState) => {
      return prevState.filter((x) => x !== id)
    })
    const uncheckedChannel = selectedChannel?.filter((x) => x.id !== id)
    setSelectedChannel(uncheckedChannel)
    const removedChannel = selectedChannel?.find((x) => x.id === id)
    const newKeepAliveArr =
      liveStreamingIntervalId &&
      liveStreamingIntervalId.length > 0 &&
      liveStreamingIntervalId.filter(
        (x) => x !== removedChannel.streamsessionid
      )
    setLiveStreamingIntervalId(newKeepAliveArr)
    await stopLive(removedChannel.streamsessionid)
    // if (trimmedPathname === "live") {
    // }
    // if (trimmedPathname === "archive") {
    //   await stopArchive(archiveStreamingId[0].streamsessionid)
    // }
  }
  const clearAllView = async () => {
    selectedChannel?.map(async (x) => {
      if (x.streamsessionid) {
        await stopLive(x.streamsessionid)
      }
    })
    setSelectedChannel(emptyObjects)
    setSelectedItems([])
    setLiveStreamingIntervalId([])
  }
  const handleReplay = (id) => {
    const element = playerRefs.current[id]
    if (element) {
      console.log(element)
      // console.log(element.current.getDuration())
      element.seekTo(0) // Seek to the beginning of the media
      // playerRef.current.play(); // Start playing the media
    }
  }


  return (
    <>
      {trimmedPathname === "live" ? (
        <>
          {!fullgrid ? (
            <>
              <div className="flex gap-4 py-4 w-full grow">
                <CameraAreas
                  selectedChannel={selectedChannel}
                  setSelectedChannel={setSelectedChannel}
                  setLiveStreamingIntervalId={setLiveStreamingIntervalId}
                  liveStreamingIntervalId={liveStreamingIntervalId}
                  clearView={clearView}
                  clearAllView={clearAllView}
                  selectedItems={selectedItems}
                  handleFullGrid={handleFullGrid}
                  handleGridSize={handleGridSize}
                  setSelectedItems={setSelectedItems}
                  handleSessionId={handleSessionId}
                  playerRefs={playerRefs}
                  setNewBoomarkCount={setNewBoomarkCount}
                  newBookmarkCount={newBookmarkCount}
                  bookMarkedList={bookMarkedList}
                />
                <section className="grow grid w-full items-center gap-6 bg-white pb-8 pt-6 md:py-10 px-4">
                  <CameraLayout
                    selectedChannel={selectedChannel}
                    grid={grid}
                    gridSize={gridSize}
                    handleGridSize={handleGridSize}
                    numberOfGrids={numberOfGrids}
                    handleMenuOptions={handleMenuOptions}
                    playerRefs={playerRefs}
                    handleReplay={handleReplay}
                    handleFullGrid={handleFullGrid}
                    sessionId={sessionId}
                    handleSessionId={handleSessionId}
                    clearView={clearView}
                    lastFiveElements={lastFiveElements}
                    snapArray={snapArray} 
                    updatedData = {updatedData}
                    setNewBoomarkCount={setNewBoomarkCount}
                    newBookmarkCount={newBookmarkCount}
                    bookMarkedList={bookMarkedList}
                    setBookMarkedList={setBookMarkedList}

                  />
                </section>
              </div>
              <div>{children}</div>
            </>
          ) : (
            <>
              <FullscreenGrid
                gridSize={gridSize}
                numberOfGrids={numberOfGrids}
                selectedChannel={selectedChannel}
                handleMenuOptions={handleMenuOptions}
                playerRefs={playerRefs}
                handleFullGrid={handleFullGrid}
                handleSessionId={handleSessionId}
              />
            </>
          )}
        </>
      ) : trimmedPathname === "search" ? (
        <>
          <div className="flex gap-4 p-4 grow">
            <CameraAreas
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              setLiveStreamingIntervalId={setLiveStreamingIntervalId}
              liveStreamingIntervalId={liveStreamingIntervalId}
              clearView={clearView}
              handleGridSize={handleGridSize}
              handleFullGrid={handleFullGrid}
              handleSessionId={handleSessionId}
                playerRefs={playerRefs}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setNewBoomarkCount={setNewBoomarkCount}
              newBookmarkCount={newBookmarkCount}
              bookMarkedList={bookMarkedList}

            />
            <section className="grow grid w-full  gap-6 bg-white pb-8 pt-6 md:py-10 px-4">
              <SearchEvents
              // violationType={violationType}
                snapArray={snapArray} 
                selectedChannel={selectedChannel}
                handleSessionId={handleSessionId}
                playerRefs={playerRefs}
              />
            </section>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-4 py-4 w-full grow">
            <CameraAreas
              selectedChannel={selectedChannel}
              playerRefs={playerRefs}
              handleSessionId={handleSessionId}
              setSelectedChannel={setSelectedChannel}
              setLiveStreamingIntervalId={setLiveStreamingIntervalId}
              liveStreamingIntervalId={liveStreamingIntervalId}
              clearView={clearView}
              handleFullGrid={handleFullGrid}
              handleGridSize={handleGridSize}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setNewBoomarkCount={setNewBoomarkCount}
              newBookmarkCount={newBookmarkCount}
              bookMarkedList={bookMarkedList}

             
            />
            <section className="grid w-full grow items-start gap-6 bg-white p-4 pb-8 pt-6 md:py-10">
              <div>{children}</div>
            </section>
          </div>
        </>
      )}
    </>
  )
}
export default VideoLayout
