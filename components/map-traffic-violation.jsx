import React, { useEffect, useMemo, useState } from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import mapboxgl from "mapbox-gl"
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl"
import ReactMapboxGl, { Feature, Layer, Marker } from "react-mapbox-gl"

import AppNew from "@/components/app-new"

import "mapbox-gl/dist/mapbox-gl.css"
import { getJunctionTree, updateDashboardMapEvents } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pin } from "@/components/pin"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

mapboxgl.accessToken =
  "pk.eyJ1Ijoib3NjYXIyMCIsImEiOiJjbGswc3R2dHAwMDN1M2VwdXlsbTIwbTFuIn0.UFb2dZxcfx53b6W0lID5YQ"

const accessToken =
  "pk.eyJ1Ijoib3NjYXIyMCIsImEiOiJjbGswc3R2dHAwMDN1M2VwdXlsbTIwbTFuIn0.UFb2dZxcfx53b6W0lID5YQ"

export const MapTrafficContent = (props) => {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [markers, setMarkers] = useState([])
  const [tableData, setTableData] = useState(null)

  const fetchJunctionTree = async () => {
    const junctionTreeApi = await getJunctionTree()
    setMarkers(junctionTreeApi)
  }
  function records(allRec) {
    setTableData([...allRec])
  }
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


  const updateMapData = () => {
    const payload = {
      starttimestamp: props?.todayStartTimestamp,
      endtimestamp: props?.todayEndTimestamp,
      applicationList: [323, 320, 300, 322, 325, 326, 329, 333, 380, 311, 315],
      charttype: 2,
      msId: props?.selectedJunctions[0]?.serverid ||null
    }
    let dataTable = []
    const updatedMapDetails = async (payload) => {
      const updateMapTable = await updateDashboardMapEvents(payload)

      // if (updateMapTable) {
      //   updateMapTable[0]?.eventlist.map(async (eve) => {
      //     let newDateTimeStamp = new Date(eve.startTime)
      //     newDateTimeStamp = new Date(newDateTimeStamp).toLocaleString()
      //     let datetimeArray = newDateTimeStamp.split(",")
      //     let date = datetimeArray[0]
      //     let time = datetimeArray[1]
      //     //   let eventData = eve.snapUrls[0]
      //     var recordObj = {
      //       msEventId: eve.msEventId,
      //       endTime: eve.endTime,
      //       startTime: eve.startTime,
      //       vehicleType: vehicleClass[eve.vehicleClass],
      //       vehicleClass: eve.vehicleClass,
      //       vehicleClass: eve.vehicleClass,
      //       acknowledge: eve.acknowledge,
      //       cameraName: eve.cameraName,
      //       location: eve.junctionName,
      //       channelId: eve.channelId,
      //       color: vehicleColor[eve.objectProperty1],
      //       vehicleNo: eve.objectId,
      //       id: eve.id,
      //       msId: eve.msId,
      //       lpSignature: eve.lpSignature,
      //       acknowledgeUser: eve.acknowledgeUser,
      //       modifiedobjectId: eve.modifiedobjectId,
      //       eventType: eve.eventType,
      //       acknowledgedTime: eve.acknowledgedTime,
      //       date: date,
      //       time: time,
      //     }
      //     dataTable.push(recordObj)
      //     records(dataTable)
      //   })
      // }
    }
    updatedMapDetails(payload)
  }

  useEffect(() => {
    fetchJunctionTree()

    // updateMapData()
  }, [])
  useEffect(() => {}, [markers])
  useEffect(() => {
  }, [tableData])
  return (
    <div className="h-full w-full">
      <div className="my-4 rounded-lg bg-white">
        {/* <AppNew
          markers={markers}
          tableData={tableData}
          todayEndTimestamp={props.todayEndTimestamp}
          todayStartTimestamp={props.todayStartTimestamp}
          selectedJunctions={props?.selectedJunctions[0]?.serverid}
          weekStartTimestamp={props?.weekStartTimestamp}
          weekEndTimestamp={props?.weekEndTimestamp}
          monthStartTimestamp={props?.monthStartTimestamp}
          monthEndTimeStamp={props?.monthEndTimestamp}
          convertToEpochFormat={props?.convertToEpochFormat}
          convertToEpochFormatToTime={props?.convertToEpochFormatToTime}
          date={props?.date}
          selectedTab={props?.selectedTab}
          setSelectedTab={props?.setSelectedTab}
        /> */}
      </div>
    </div>
  )
}
