"use client"

import { useCallback, useEffect, useState } from "react"
import useStore from "@/store/store"

import { avgSpeedInJunc } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AverageSpeedTabs from "@/components/average-speed-tabs"
import MapZone from "@/components/map-zone"

const MapContent = ({
  todayStartTimestamp,
  todayEndTimestamp,
  handleSpeedDuration,
  speedDuration,
  showDateRange,
  date,
  weekStartTimestamp,
  weekEndTimestamp,
  monthStartTimestamp,
  monthEndTimestamp,
  convertToEpochFormat,
  convertToEpochFormatToTime,
  refresh,
  cameraSelection,
  isDateChanged,
  selectedTab,
  setSelectedTab,
  selectedJunctions,
}) => {
  const junctionTree = useStore((state) => state.junctionTree)
  const setJunctionTree = useStore((state) => state.setJunctionTree)
  const [markerLocation, setMarkerLocation] = useState([])
  const [junction, setJunction] = useState([])
  const [selectedJun, setSelectedJun] = useState("AllJunction")
  const [storedJun, setStoredJun] = useState()
  const [junctionDetails, setJunctionDetails] = useState()
  const [extractedDetails, setExtractedDetails] = useState(null)

  useEffect(() => {
    setJunctionTree()
  }, [])
  useEffect(() => {
    if (junctionTree.length) {
      const junctionData = junctionTree.flatMap((junc) => {
        return junc.vJunction ? [junc.vJunction.name] : []
      })

      setJunction(junctionData)
    }
  }, [junctionTree])

  const selectItems = junction?.map((item, index) => (
    <SelectItem key={index} value={item}>
      {item}
    </SelectItem>
  ))

  useEffect(() => {
    if (selectedJun && selectedJun !== "AllJunction") {
      const matchedJunc = junctionTree.find((item) => {
        return item.vJunction.name === selectedJun
      })
      setStoredJun(matchedJunc)
    }
  }, [selectedJun])
  const mapPoints = async () => {
    let payload = {}
    if (isDateChanged || selectedTab === "Custom") {
      payload = {
        starttimestamp: convertToEpochFormat(date?.from),
        endtimestamp: convertToEpochFormatToTime(date?.to),
      }
    } else if (selectedTab === "Today") {
      payload = {
        starttimestamp: todayStartTimestamp,
        endtimestamp: todayEndTimestamp,
      }
    } else if (selectedTab === "Week") {
      payload = {
        starttimestamp: weekStartTimestamp,
        endtimestamp: weekEndTimestamp,
      }
    } else if (selectedTab === "Month") {
      payload = {
        starttimestamp: monthStartTimestamp,
        endtimestamp: monthEndTimestamp,
      }
    }
    const junctionsWithAvgSpeed = await avgSpeedInJunc(payload)
    if (junctionsWithAvgSpeed?.data?.result) {
      setJunctionDetails(junctionsWithAvgSpeed?.data?.result)
    }
  }

  useEffect(() => {
    mapPoints()
  }, [selectedTab, isDateChanged])

  //   useEffect(()=>{
  //     setJunctionDetails([
  //      {
  //          "id": null,
  //          "name": "Biswa Bangla Sarani",
  //          "serverid": "SVMEDIAS000000000000000000000001",
  //          "violationnormallimit": null,
  //          "violationheavylimit": null,
  //          "flownormallimit": null,
  //          "flowheavylimit": null,
  //          "latitude": 40.7599826819872,
  //          "longitude": 60.7599826819872,
  //          "averageSpeed": 20
  //      },
  //      {
  //          "id": null,
  //          "name": "BoxBridge Junction",
  //          "serverid": "SVMEDIAS000000000000000000000002",
  //          "violationnormallimit": null,
  //          "violationheavylimit": null,
  //          "flownormallimit": null,
  //          "flowheavylimit": null,
  //          "latitude": 24.739255008526094,
  //          "longitude": 24.739255008526094,
  //          "averageSpeed": 20
  //      }
  //  ])
  //  },[junctionDetails])

  const storedJuncId = storedJun?.vJunction?.id

  useEffect(() => {
    const matchedJunDetails = junctionDetails?.find(
      (junction) => junction.serverid === storedJuncId
    )
    if (matchedJunDetails) {
      setExtractedDetails([
        {
          serverid: matchedJunDetails?.serverid,
          name: matchedJunDetails?.name,
          latitude: matchedJunDetails?.latitude,
          longitude: matchedJunDetails?.longitude,
          averageSpeed: matchedJunDetails?.averageSpeed,
        },
      ])
    }
  }, [storedJuncId, junctionDetails])

  return (
    <>
      <div className="flex gap-8 bg-[#fff] p-8">
        <div className="w-full ">
          <MapZone
            markerLocation={markerLocation}
            storedJun={storedJun}
            setMarkerLocation={setMarkerLocation}
            selectedJun={selectedJun}
            junctionTree={junctionTree}
            extractedDetails={extractedDetails}
            junctionDetails={junctionDetails}
            junction={junction}
            setSelectedJun={setSelectedJun}
            selectedJunctions={selectedJunctions}
          />
        </div>
      </div>
      <AverageSpeedTabs
        selectedJunction={
          selectedJun === "AllJunction" ? junction : [selectedJun]
        }
        handleSpeedDuration={handleSpeedDuration}
        speedDuration={speedDuration}
        showDateRange={showDateRange}
        junctionTree={junctionTree}
        todayStartTimestamp={todayStartTimestamp}
        todayEndTimestamp={todayEndTimestamp}
        weekStartTimestamp={weekStartTimestamp}
        weekEndTimestamp={weekEndTimestamp}
        monthStartTimestamp={monthStartTimestamp}
        monthEndTimestamp={monthEndTimestamp}
        checkDate={date}
        refresh={refresh}
        cameraSelection={cameraSelection}
        isDateChanged={isDateChanged}
        selectedTab={selectedTab}
      />
    </>
  )
}
export default MapContent
