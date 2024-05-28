import * as React from "react"
import { useMemo, useState } from "react"
import { useEffect } from "react"
import Image from "next/image"
import useStore from "@/store/store"
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl"

import { getViolationStringData, updateDashboardMapEvents } from "@/lib/api"
import DTable from "@/components/datatable/dynamic"
import { Pin } from "@/components/pin"

const TOKEN =
  "pk.eyJ1Ijoib3NjYXIyMCIsImEiOiJjbGswc3R2dHAwMDN1M2VwdXlsbTIwbTFuIn0.UFb2dZxcfx53b6W0lID5YQ"

export default function AppNew(props) {
  const allChannels = useStore((state) => state.allChannels)
  const setAllChannels = useStore((state) => state.setAllChannels)
  const [popupInfo, setPopupInfo] = useState(null)
  const [storeData, setStoreData] = useState([])
  const [violationList, setViolationList] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [markerLocation, setMarkerLocation] = useState([])
  const [showMapDataTable, setShowMapDataTable] = useState(false)
  const [zoomData, setZoomData] = useState(4)
  const [updateCenter, setUpdateCenter] = useState()
  const [selectedCams, setSelectedCams] = useState()
  const [isPopupDataAvailable, setIsPopupDataAvailable] = useState(false)
  useEffect(() => {
    setAllChannels()
  }, [])

  useEffect(() => {
    if (props?.markers.length) {
      const coordinates = props?.markers.map((junction) => {
        // console.log("all",junction )

        if (junction.channel.length) {
          const { latitude, longitude } = junction?.channel[0]
          return { latitude, longitude }
        } else {
          console.log("Lat lng not available")
          return { latitude: 0, longitude: 0 }
        }
      })
      props?.markers.forEach((junction, index) => {
        junction.vJunction.latitude = coordinates[index].latitude
        junction.vJunction.longitude = coordinates[index].longitude
      })

      if (
        props?.selectedJunctions === null ||
        props?.selectedJunctions === undefined
      ) {
        // console.log("all cameras", props?.markers);

        const marker = props?.markers.flatMap((jnc) => ({
          lat: jnc.vJunction.latitude,
          lng: jnc.vJunction.longitude,
          name: jnc.vJunction.name,
          type: jnc.vJunction.id,
        }))
        setMarkerLocation(marker)
      } else if (props?.selectedJunctions !== null) {
        const matchedVJunction = props?.markers.find(
          (vJunction) => vJunction.vJunction.id === props?.selectedJunctions
        )
        // console.log("matchedVJunction", matchedVJunction);
        const marker = [
          {
            lat: matchedVJunction.vJunction.latitude,
            lng: matchedVJunction.vJunction.longitude,
            name: matchedVJunction.vJunction.name,
            type: matchedVJunction.vJunction.id,
          },
        ]
        // console.log("marker", marker);

        // console.log("selected cameras", matchedVJunction?.vJunction?.latitude);

        setMarkerLocation(marker)
      }
    }
  }, [props?.markers, props?.selectedJunctions])

  useEffect(() => {
    // Check for online status on component mount
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  useEffect(() => {
    const fetchViolationData = async () => {
      const violationData = await getViolationStringData()
      console.log(violationData)
      setViolationList(violationData)
    }

    fetchViolationData()
  }, [])

  const updateMapVioData = (violationArr) => {
    let payload = {}
    if (
      props?.date?.from !== "" ||
      (props?.date.from !== undefined && props?.date.to !== "") ||
      (props?.date.to !== undefined && props?.selectedTab === "Custom")
    ) {
      payload = {
        starttimestamp: props?.convertToEpochFormat(props?.date?.from),
        endtimestamp: props?.convertToEpochFormatToTime(props?.date?.to),
        applicationList: violationArr,
        charttype: 2,
        msId: props?.selectedJunctions || null,
      }
    } else if (props?.selectedTab === "Today") {
      payload = {
        starttimestamp: props?.todayStartTimestamp,
        endtimestamp: props?.todayEndTimestamp,
        applicationList: violationArr,
        charttype: 2,
        msId: props?.selectedJunctions || null,
      }
    } else if (props?.selectedTab === "Week") {
      payload = {
        starttimestamp: props?.weekStartTimestamp,
        endtimestamp: props?.weekEndTimestamp,
        applicationList: violationArr,
        charttype: 2,
        msId: props?.selectedJunctions || null,
      }
    } else if (props?.selectedTab === "Month") {
      payload = {
        starttimestamp: props?.monthStartTimestamp,
        endtimestamp: props?.monthEndTimeStamp,
        applicationList: violationArr,
        charttype: 2,
        msId: props?.selectedJunctions || null,
      }
    }

    let vioData = []
    const updatedMapDetail = async (payload) => {
      try {
        const updateMapVioTable = await updateDashboardMapEvents(payload)
        setStoreData(updateMapVioTable)
        setIsPopupDataAvailable(true)
      } catch (error) {
        setStoreData([])
      }
    }
    updatedMapDetail(payload)
  }
  useEffect(() => {
    if (isOnline && violationList && violationList.length > 0) {
      const violationArr = violationList?.map((alert) => alert.alerttype)
      updateMapVioData(violationArr)
    }
  }, [
    violationList,
    isOnline,
    props?.selectedJunctions,
    props?.selectedTab,
    props?.date,
  ])

  const convertToViolationType = (type) => {
    const violation = violationList.find(
      (violation) => violation.alerttype === type
    )
    if (violation) {
      return violation.alertname
    } else {
      return "Others"
    }
  }
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
              onClick={(e) => {
                const selectedChannels = allChannels?.filter(
                  (item) => item.mediaServerId === mark.type
                )
                let matchedDataLists = []
                selectedChannels.forEach((channel) => {
                  // Iterate through storeData[0]?.patterndatalist
                  storeData[0]?.patterndatalist.forEach((data) => {
                    // Check if id and name match
                    if (
                      channel.id === data.type &&
                      channel.name === data.name
                    ) {
                      // Store the matching datalist
                      matchedDataLists.push(data.datalist)
                    }
                  })
                })
                // console.log("matchedDataLists", matchedDataLists, mark);

                const showData =
                  storeData &&
                  storeData[0]?.patterndatalist.map((item) => {
                    // console.log("item", item);
                    return {
                      type: item.type,
                      name: item.name,
                      datalist: item.datalist.map((data) => {
                        return {
                          name: data.name,
                          typeid: data.typeid,
                          totalrecords: data.totalrecords,
                        }
                      }),
                    }
                  })
                // find(
                //   (p) => p.name === mark.name && p.type == mark.type
                // )?.datalist
                // console.log("showData", showData);
                const filteredList = showData?.find(
                  (p) => p.name === mark.name && p.type == mark.type
                )?.datalist
                // console.log("filteredList", filteredList);

                const filteredName = showData?.find(
                  (p) => p.name === mark.name && p.type == mark.type
                )?.name

                const transformedTotals = {}
                matchedDataLists.forEach((dataList) => {
                  dataList.forEach(({ typeid, name, totalrecords }) => {
                    if (!transformedTotals[typeid]) {
                      transformedTotals[typeid] = {
                        typeid,
                        name,
                        totalrecords: 0,
                      }
                    }
                    transformedTotals[typeid].totalrecords += totalrecords
                  })
                })

                const finalTotal = Object.values(transformedTotals)

                // console.log("total",finalTotal);
                const totalSum = finalTotal?.reduce(
                  (sum, record) => sum + record.totalrecords,
                  0
                )
                // console.log("totalSum", totalSum);
                const popUpData = {
                  lat: mark.lat,
                  lng: mark.lng,
                  datalist: finalTotal,
                  camName: mark.name,
                  totalSum: totalSum,
                  // camName: filteredName,
                  // showData?.find(
                  //     (p) => p.name === mark.name && p.type == mark.type
                  //   )?.datalist,
                }

                // console.log("popUpData", popUpData);
                if (matchedDataLists) {
                  e.originalEvent.stopPropagation()
                  setPopupInfo(popUpData)
                } else {
                  const popUpDataEmpty = {
                    lat: mark.lat,
                    lng: mark.lng,
                    datalist: [],
                    camName: "",
                    totalSum: "",
                  }
                  e.originalEvent.stopPropagation()
                  setPopupInfo(popUpDataEmpty)
                }
              }}
            >
              <Pin />
            </Marker>
          </div>
        )
      }),
    [markerLocation, storeData, popupInfo, props?.selectedTab, props?.date]
  )

  useEffect(() => {
    const latMapView = markerLocation?.map((markValue) => markValue?.lat)
    const lngMapView = markerLocation?.map((markValue) => markValue?.lng)
    // Calculate center
    function calculateCenter(latMapView, lngMapView) {
      const latSum = latMapView?.reduce((acc, point) => acc + point, 0)
      const lngSum = lngMapView?.reduce((acc, point) => acc + point, 0)

      return {
        lat: latSum / latMapView.length,
        lng: lngSum / lngMapView.length,
      }
    }
    const center = calculateCenter(latMapView, lngMapView)
    setUpdateCenter({
      lat: center?.lat,
      lng: center?.lng,
    })
  }, [markerLocation])

  const columns = [
    {
      accessorKey: "cameraName",
      header: "Camera",
    },
    {
      accessorKey: "eventType",
      header: "Event Type",
      cell: ({ row }) => (
        <div> {convertToViolationType(row.original.eventType)} </div>
      ),
    },
    {
      accessorKey: "vehicleType",
      header: "Vehicle Type",
    },
    {
      accessorKey: "color",
      header: "Color",
    },
    {
      accessorKey: "cameraName",
      header: "Camera Name",
      cell: ({ row }) => <div> {row.getValue("cameraName")} </div>,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "vehicleNo",
      header: "Vehicle No.",
    },
    {
      accessorKey: "date",
      header: "Time Stamp",
      cell: ({ row }) => (
        <div>
          {row.original.date}, {row.original.time}{" "}
        </div>
      ),
    },
  ]

  const handleShowMapTable = () => {
    setShowMapDataTable(!showMapDataTable)
  }

  useEffect(() => {
    if (
      props?.selectedJunctions === null ||
      props?.selectedJunctions !== undefined
    ) {
      setZoomData(2)
    } else if (props?.selectedJunctions !== null) {
      setZoomData(12)
    }
  }, [props?.selectedJunctions])

  return (
    <div>
      {updateCenter?.lat !== undefined &&
      updateCenter?.lng !== undefined &&
      !isNaN(updateCenter?.lat) &&
      !isNaN(updateCenter?.lng) ? (
        <Map
          initialViewState={{
            latitude: updateCenter?.lat,
            longitude: updateCenter?.lng,
            zoom: 8,
            bearing: 0,
            pitch: 0,
          }}
          style={{
            position: "relative",
            height: "80vh",
            // width: "76vw",
            borderRadius: "6px",
          }}
          mapStyle="mapbox://styles/mapbox/outdoors-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />

          {isPopupDataAvailable ? (
            pins
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
              <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
              Loading popup data. Please wait...
            </div>
          )}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                <a target="_new">
                  {popupInfo?.datalist.length > 0 ? (
                    <div className="text-md grid p-2 text-sky-500">
                      <span className="text-orange-500 font-medium">
                        {" "}
                        {popupInfo?.camName}{" "}
                      </span>
                      <span className="text-[#000] font-medium">
                        {" "}
                        Total Traffic Violation: {popupInfo?.totalSum}{" "}
                      </span>

                      {popupInfo?.datalist.map((data, index) => {
                        return (
                          <div>
                            <span>
                              {" "}
                              {data.name}: {data.totalrecords}{" "}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-md grid text-sky-500">
                      <span className="text-orange-500 font-medium">
                        {" "}
                        {popupInfo?.camName}{" "}
                      </span>
                      No Data Available
                    </div>
                  )}
                </a>
              </div>
            </Popup>
          )}
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
          Loading map. Please wait...
        </div>
      )}
    </div>
  )
  // return (
  //   <div>
  //     {isOnline ? (
  //       <div>
  //         {updateCenter?.lat !== undefined &&
  //         updateCenter?.lng !== undefined &&
  //         !isNaN(updateCenter?.lat) &&
  //         !isNaN(updateCenter?.lng) ? (
  //           <Map
  //             initialViewState={{
  //               latitude: updateCenter?.lat,
  //               longitude: updateCenter?.lng,
  //               zoom: 8,
  //               bearing: 0,
  //               pitch: 0,
  //             }}
  //             style={{
  //               position: "relative",
  //               height: "80vh",
  //               // width: "76vw",
  //               borderRadius: "6px",
  //             }}
  //             mapStyle="mapbox://styles/mapbox/outdoors-v9"
  //             mapboxAccessToken={TOKEN}
  //           >
  //             <GeolocateControl position="top-left" />
  //             <FullscreenControl position="top-left" />
  //             <NavigationControl position="top-left" />
  //             <ScaleControl />

  //             {isPopupDataAvailable ? (
  //               pins
  //             ) : (
  //               <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
  //                 <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
  //                 Loading popup data. Please wait...
  //               </div>
  //             )}

  //             {popupInfo && (
  //               <Popup
  //                 anchor="top"
  //                 longitude={popupInfo.lng}
  //                 latitude={popupInfo.lat}
  //                 onClose={() => setPopupInfo(null)}
  //               >
  //                 <div>
  //                   <a target="_new">
  //                     {popupInfo?.datalist.length > 0 ? (
  //                       <div className="text-md grid p-2 text-sky-500">
  //                         <span className="text-orange-500 font-medium">
  //                           {" "}
  //                           {popupInfo?.camName}{" "}
  //                         </span>
  //                         <span className="text-[#000] font-medium">
  //                           {" "}
  //                           Total Traffic Violation: {popupInfo?.totalSum}{" "}
  //                         </span>

  //                         {popupInfo?.datalist.map((data, index) => {
  //                           return (
  //                             <div>
  //                               <span>
  //                                 {" "}
  //                                 {data.name}: {data.totalrecords}{" "}
  //                               </span>
  //                             </div>
  //                           )
  //                         })}
  //                       </div>
  //                     ) : (
  //                       <div className="text-md grid text-sky-500">
  //                         <span className="text-orange-500 font-medium">
  //                           {" "}
  //                           {popupInfo?.camName}{" "}
  //                         </span>
  //                         No Data Available
  //                       </div>
  //                     )}
  //                   </a>
  //                 </div>
  //               </Popup>
  //             )}
  //           </Map>
  //         ) : (
  //           <div className="flex h-96 w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
  //             <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
  //             Loading map. Please wait...
  //           </div>
  //         )}
  //         {/* <div className=" mt-[1em] flex items-center gap-[1em]">
  //             <input type="checkbox" onChange={handleShowMapTable} />
  //             <label className="text-sm">Show Data Table</label>
  //           </div> */}
  //         {showMapDataTable && (
  //           <div className="mt-4">
  //             {props?.tableData && (
  //               <DTable data={props?.tableData} columns={columns} />
  //             )}
  //           </div>
  //         )}
  //       </div>
  //     ) : (
  //       <div>
  //         <div className="flex items-center ">
  //           <Image
  //             src="/images/Bangkok_Violation.png"
  //             alt="map"
  //             width={1100}
  //             height={700}
  //             className=" h-auto w-[100%] "
  //           />
  //         </div>
  //         <div className="mt-4">
  //           {props?.tableData && (
  //             <DTable data={props?.tableData} columns={columns} />
  //           )}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )
}
