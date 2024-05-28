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
import AppNewFlow from "@/components/app-new-traffic-flow"

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

export const MapTrafficFlow = (props) => {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [markers, setMarkers] = useState([])
  const [tableData, setTableData] = useState(null)
  const [balloonData, setBalloonData] = useState(null)
  const fetchJunctionTree = async () => {
    const junctionTreeApi = await getJunctionTree()
    setMarkers(junctionTreeApi)
  }
  function records(allRec) {
    setTableData([...allRec])
  }
  function balloonRecords(allRec) {
    setBalloonData([...allRec])
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
  let dataTable = []
  let balloonTable = []

  const updateMapData = () => {
    const payload = {
      starttimestamp: props?.todayStartTimestamp,
      endtimestamp: props?.todayEndTimestamp,
      applicationList: [207],
      charttype: 0,
      msId: props?.selectedJunctions[0]?.serverid || null,
      vehicleclassList: [-1],
    }
    const updatedMapDetails = async (payload) => {
      const updateMapTable = await updateDashboardMapEvents(payload)
      // console.log("updateMapTable", updateMapTable);
      if (updateMapTable[0]?.patterndatalist) {
        updateMapTable[0]?.patterndatalist.map((item) => {
          var balloonObj = {
            name: item.name,
            type: item.type,
            dataList: item.datalist,
          }
          console.log("balloonObj", balloonObj)
          balloonTable.push(balloonObj)
          balloonRecords(balloonTable)
        })
      }
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
      //   //   console.log("dataTable", recordObj);
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
    // console.log("ballon", balloonData);
  }, [balloonData])
  useEffect(() => {
    // console.log("table", tableData);
  }, [tableData])
  return (
    <div className="h-full w-full">
      <div className="my-4 rounded-lg bg-white">
        {props.activeTab === "TrafficFlow" ? (
          <AppNewFlow
            markers={markers}
            tableData={tableData}
            balloonData={balloonData}
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
          />
        ) : (
          <AppNew
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
          />
        )}
      </div>
    </div>
  )
}
