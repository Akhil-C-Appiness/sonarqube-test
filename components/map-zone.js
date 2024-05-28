"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import useStore from "@/store/store"
import ReactMapGL from "react-map-gl"
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl"

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
import { Pin } from "@/components/pin"

const TOKEN =
  "pk.eyJ1Ijoib3NjYXIyMCIsImEiOiJjbGswc3R2dHAwMDN1M2VwdXlsbTIwbTFuIn0.UFb2dZxcfx53b6W0lID5YQ"

const MapZone = ({
  markerLocation,
  selectedJun,
  junctionTree,
  junctionDetails,
  storedJun,
  setMarkerLocation,
  extractedDetails,
  junction,
  setSelectedJun,
  selectedJunctions,
}) => {
  const allJunctions = useStore((state) => state.junctions)
  const [selectedJunctionId, setSelectedJunctionId] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])
  useEffect(() => {
    // console.log("allJunctions", allJunctions)
    console.log("selectedJunctions", selectedJunctions)
    const tempArray = []
    selectedJunctions?.map((junction) => {
      tempArray.push(junction.serverid)
    })
    setSelectedJunctionId(tempArray)
  }, [selectedJunctions])
  const [updateCenter, setUpdateCenter] = useState()
  const [updateZoom, setUpdateZoom] = useState()
  const [isJunctionSelected, setIsJunctionSelected] = useState(false)
  const [viewState, setViewState] = useState({
    latitude: 0, // Set initial latitude
    longitude: 0, // Set initial longitude
    zoom: 8,
    bearing: 0,
    pitch: 0,
  })
  const [viewPort, setViewPort] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  })
  useEffect(() => {
    if (selectedJun === "AllJunction") {
      const marker = junctionDetails?.map((jnc) => ({
        lat: jnc.latitude,
        lng: jnc.longitude,
        name: jnc.name,
        type: jnc.id,
        averageSpeed: jnc.averageSpeed,
      }))
      setMarkerLocation(marker)
      setIsJunctionSelected(false)
    } else if (extractedDetails) {
      const marker = extractedDetails?.map((jnc) => ({
        lat: jnc.latitude,
        lng: jnc.longitude,
        name: jnc.name,
        type: jnc.id,
        averageSpeed: jnc.averageSpeed,
      }))
      setMarkerLocation(marker)
      setIsJunctionSelected(true)
    }
  }, [junctionDetails, selectedJun, extractedDetails])

  useEffect(() => {
    if (selectedJunctionId.length > 0) {
      const marker = []
      junctionDetails?.map((jnc) => {
        if (selectedJunctionId.includes(jnc.serverid)) {
          let tempObj = {
            lat: jnc.latitude,
            lng: jnc.longitude,
            name: jnc.name,
            type: jnc.id,
            averageSpeed: jnc.averageSpeed,
          }
          marker.push(tempObj)
        }
      })
      setMarkerLocation(marker)
      // setIsJunctionSelected(false)
    }
  }, [selectedJunctionId])
  // console.log("junction", junction)

  const selectItems = junction?.map((item, index) => (
    <SelectItem key={index} value={item}>
      {item}
    </SelectItem>
  ))

  const pins = useMemo(
    () =>
      markerLocation?.map((mark, index) => {
        return (
          <div>
            <Marker
              key={`marker-${index}`}
              longitude={mark?.lng}
              latitude={mark?.lat}
              anchor="bottom"
            >
              {/* <Pin /> */}
              <div className="font-medium text-sm leading-4 flex flex-col bg-[#fff] p-[8px] rounded-xl">
                <div className="flex font-medium text-sm gap-2">
                  <Image
                    src="/images/Group 1000002779.svg"
                    alt="pin"
                    width={14}
                    height={14}
                    // className=" h-auto w-[100%] "
                  />
                  {mark?.name}
                </div>

                <span>
                  {/* {`Average Speed`}: */}
                  <span className="text-[#03A526] font-semibold text-sm">
                    {" "}
                    {mark?.averageSpeed} kmph{" "}
                  </span>
                </span>
              </div>
            </Marker>
          </div>
        )
      }),
    [markerLocation]
  )

  useEffect(() => {
    const latMapView = markerLocation?.map((markValue) => markValue?.lat)
    const lngMapView = markerLocation?.map((markValue) => markValue?.lng)
    // Calculate center
    function calculateCenter(latMapView, lngMapView) {
      const latSum = latMapView?.reduce((acc, point) => acc + point, 0)
      const lngSum = lngMapView?.reduce((acc, point) => acc + point, 0)

      return {
        lat: latSum / latMapView?.length,
        lng: lngSum / lngMapView?.length,
      }
    }
    const center = calculateCenter(latMapView, lngMapView)
    setUpdateCenter({
      lat: center?.lat,
      lng: center?.lng,
    })
  }, [markerLocation])

  useEffect(() => {
    const checkNameAndSetZoom = () => {
      const index = markerLocation?.findIndex(
        (location) => location.name === selectedJun
      )
      const zoomLevel = index !== -1 ? 4 : 1
      setViewState((prevViewState) => ({
        ...prevViewState,
        latitude: updateCenter?.lat,
        longitude: updateCenter?.lng,
        zoom: zoomLevel,
      }))
      if (index !== -1) {
        setViewPort((prevViewPort) => ({
          ...prevViewPort,
          latitude: updateCenter?.lat,
          longitude: updateCenter?.lng,
          zoom: zoomLevel,
        }))
      }
    }
    checkNameAndSetZoom()
  }, [selectedJun, markerLocation, updateCenter, isJunctionSelected])
  return (
    <div>
      {updateCenter?.lat !== undefined &&
      updateCenter?.lng !== undefined &&
      !isNaN(updateCenter?.lat) &&
      !isNaN(updateCenter?.lng) ? (
        <Map
          // initialViewState={{
          //   latitude: updateCenter?.lat,
          //   longitude: updateCenter?.lng,
          //   zoom: updateZoom,
          //   bearing: 0,
          //   pitch: 0,
          // }}
          {...(isJunctionSelected ? viewPort : viewState)}
          // {...viewState}
          // onViewStateChange={({ viewState }) => {
          //   console.log("test");
          //   setViewState({viewState})
          // }}
          onZoom={({ viewState }) => {
            if (isJunctionSelected) {
              setViewPort({ viewState })
            } else {
              setViewState({
                viewState,
              })
            }
          }}
          onDrag={({ viewState }) => {
            if (isJunctionSelected) {
              setViewPort({ viewState })
            } else {
              setViewState({
                viewState,
              })
            }
          }}
          style={{
            position: "relative",
            height: "80vh",
            width: "90vw",
            borderRadius: "6px",
          }}
          mapStyle="mapbox://styles/mapbox/outdoors-v9"
          mapboxAccessToken={TOKEN}
        >
          <div className="absolute bg-[#fff] m-3 rounded-md right-0">
            <Select
              onValueChange={(value) => setSelectedJun(value)}
              defaultValue="AllJunction"
            >
              <SelectTrigger className="w-[180px] text-[#0F0F10] font-medium text-sm">
                <SelectValue placeholder="Select Junction" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72 w-48 rounded-md">
                  <SelectGroup>
                    <SelectLabel>Junctions</SelectLabel>
                    <SelectItem value="AllJunction">All Junction</SelectItem>
                    {selectItems}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          {/* <NavigationControl position="top-left" /> */}
          <ScaleControl />

          {pins}
        </Map>
      ) : !isOnline ? (
        <div>
          <Image
            src="/images/map-view.png"
            alt="No Internet"
            width={1300}
            height={300}
            className={"blur-sm"}
          />
          <span className="font-bold relative top-[-20rem] right-[-40%] text-2xl">
            No Internet Connection...
          </span>
        </div>
      ) : (
        <div className="flex h-96 w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
          <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
          Loading Map. Please wait...
        </div>
      )}
    </div>
  )
}

export default MapZone
