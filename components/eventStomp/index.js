"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import useStore from "@/store/store"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

import {
  getAllAnalytics,
  getEventAudio,
  getEventColor,
  getFileContent,
  getLpSnap,
} from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DTable from "@/components/datatable/dynamic"

const getBadgeClass = (priority) => {
  if (priority === 0) {
    return "bg-red-100 text-red-600"
  } else if (priority === 1) {
    return "bg-yellow-100 text-yellow-600"
  } else {
    return "bg-green-100 text-green-600"
  }
}

const EventStomp = () => {
  const [pause, setPause] = useState(false)
  // const [eventList, setEventList] = useState([])
  const {
    eventList,
    setEventList,
    selectedEventDetails,
    updateEventDetails,
    showEventDetails,
    setShowEventDetails,
    setIsEventPopupLoading,
  } = useStore((state) => state)
  const [newEvent, setNewEvent] = useState(null)
  const severity = ["Critical", "Medium", "Low"]
  const [stompClient, setStompClient] = useState()
  const [violations, setViolations] = useState([])
  const [savedColors, setSavedColors] = useState([])
  const [savedAudios, setSavedAudios] = useState([])
  useEffect(() => {
    const fetchViolations = async () => {
      const res = await getAllAnalytics()
      setViolations(res)
    }
    fetchViolations()
  }, [])
  useEffect(() => {
    const fetchEventColors = async () => {
      const res = await getEventColor()
      setSavedColors(res.data.result)
    }
    fetchEventColors()
  }, [])
  useEffect(() => {
    const fetchEventAudios = async () => {
      const res = await getEventAudio()
      setSavedAudios(res.data.result)
    }
    fetchEventAudios()
  }, [])
  const convertToViolationType = (type) => {
    const violation = violations.find(
      (violation) => violation.alerttype === type
    )
    if (violation) {
      return violation.alertname
    } else {
      return "Others"
    }
  }
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

  const viewDetails = async (eventDetails) => {
    // console.log(eventDetails)
    setShowEventDetails(true)

    updateEventDetails(eventDetails)
  }

  const fetchLpImage = async (img) => {
    const payload = {
      filepath: img,
      height: 50,
      width: 150,
    }
    const response = await getLpSnap(payload)
    const base64String = "data:image/png;base64," + response.data.result[0]
    return base64String
  }
  const columns = [
    {
      accessorKey: "id",
      header: "Event Id",
    },
    // {
    //   accessorKey: "id",
    //   header: "Severity",
    //   cell: ({ row }) => (
    //     <div>
    //       <Badge
    //         variant="outline"
    //         className={getBadgeClass(row.original.priority)}
    //       >
    //         {severity[row.original.priority]}{" "}
    //       </Badge>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "startTime",
      header: "Date and Time",
      cell: ({ row }) => (
        <div> {new Date(row.original.startTime).toLocaleString()} </div>
      ),
    },
    // {
    //   accessorKey: "cameraName",
    //   header: "Camera",
    // },
    {
      accessorKey: "objectId",
      header: "Vehicle Number",
    },
    {
      accessorKey: "id",
      header: "License Plate",
      cell: ({ row }) => (
        <div>
          {/* {fetchLpImage(row.original.snapUrls[0])} */}
          {/* <Image
            src={fetchLpImage(row.original.snapUrls[0])}
            height={50}
            width={150}
            alt="lpsnap"
          /> */}
        </div>
      ),
    },
    {
      accessorKey: "eventType",
      header: "Violation Type",
      id: "eventType",
      cell: ({ row }) => (
        <div> {convertToViolationType(row.original.eventType)}</div>
      ),
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }) => (
        <div>
          {/* row.original */}

          <Button
            size={"sm"}
            className="text-xs"
            onClick={() => {
              viewDetails(row.original)
            }}
          >
            View Details
          </Button>
        </div>
      ),
    },
    // {
    //   accessorKey: "eventType",
    //   header: "Violation Type",
    //   cell: ({ row }) => (
    //     <div> {convertToViolationType(row.original.eventType)} </div>
    //   ),
    // },
    // {
    //   accessorKey: "id",
    //   header: "Severity",
    // },
    // {
    //   accessorKey: "id",
    //   header: "Date and time",
    // },
    // {
    //   accessorKey: "cameraName",
    //   header: "Camera",
    //   cell: ({ row }) => <div> {row.getValue("cameraName")} </div>,
    // },
    // {
    //   accessorKey: "id",
    //   header: "Vehicle Number",
    // },
    // {
    //   accessorKey: "id",
    //   header: "Violation Type",
    // },
    // {
    //   accessorKey: "",
    //   header: "Action",
    // //   cell: ({ row }) => (
    // //     <div>
    // //       {row.original.date}, {row.original.time}{" "}
    // //     </div>
    // //   ),
    // },
  ]

  useEffect(() => {
    // console.log(eventList)
    // console.log(eventList, 'eventListasdf')
    if (newEvent) {
      setEventList([newEvent, ...eventList])
    }
  }, [newEvent])
  useEffect(() => {
    let isloggedin = localStorage.getItem("isloggedin")
    let userName
    let JSESSIONID
    if (isloggedin) {
      let userInfo = JSON.parse(localStorage.getItem("user-info"))
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
        // passcode: password,
      },
      debug: function (str) {
        // console.info(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    client.heartbeatIncoming = 10000
    client.heartbeatOutgoing = 10000

    client.onConnect = function (frame) {
      //   console.log("Connected: " + frame)
      client.subscribe("/authentication/admin", (message) => {
        // console.log(JSON.parse(message.body))
      })

      client.subscribe("/event", async function (message) {
        // console.log(JSON.parse(message.body), 'message.body')
        let receivedData = JSON.parse(message.body)
        // console.log("test123", receivedData.result[0])
        // console.log("test123 eventList", eventList)
        if (receivedData.status == 401) {
          router.push("/login")
        }
        setNewEvent(receivedData.result[0])
      })
    }

    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"])
      console.log("Additional details: " + frame.body)
    }
    setStompClient(client)
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [])
  return (
    <div
      className="py-4"
      onMouseEnter={() => stompClient?.deactivate()}
      onMouseLeave={() => stompClient.activate()}
    >
      {/* {JSON.stringify(eventList)} */}
      <DTable
        data={eventList}
        columns={columns}
        savedColors={savedColors}
        savedAudios={savedAudios}
      />
    </div>
  )
}

export default EventStomp
