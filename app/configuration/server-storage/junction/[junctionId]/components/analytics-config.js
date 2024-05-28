"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

import {
  adamSetting,
  addEvidenceSettings,
  deleteAnalyticJob,
  deleteEvidenceSettings,
  evidenceSetting,
  getAnalyticJobListById,
  getAnalyticsCameras,
  getAnalyticsServers,
  getAnalyticsTypes,
  getCameraAssosiation,
  getConfigAnalyticsTypes,
  getJunctionsList,
  getScheduleList,
  getSnapByChannelId,
  retrieveAnalyticJobs,
  saveAnalytics,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

import AddAnalytics from "../components/addAnalytics"
import AnalyticsImage from "./analyticsImage"
import EvidanceDialog from "./evidanceModal"
import SetSpeedModal from "./setSpeedModal"
import ViewAnalyticsImage from "./viewAnalyticImage"
import ViewSchedule from "./viewScheduleModal"

const AnalyticsConfig = () => {
  const { toast } = useToast()
  const [showView, setShowView] = useState(false)
  const [viewObj, setViewObj] = useState({
    vehicleClassSpeedLimitTable: {},
    jobID: null,
    channelID: null,
    analyticId: null,
    jobType: null,
    schedule: null,
    vasId: null,
    videoSourceUrl: null,
    videoSourceUsername: null,
    videoSourcePassword: null,
    jobKey: null,
    eventPriority: null,
    mesage: null,
    action: null,
    zoneList: [],
    edgeJob: false,
    jobIDInLong: null,
  })
  const [junctionList, setJunctionList] = useState([])
  const [analyticsServers, setAnalyticsServers] = useState([])
  const [analyticsCameras, setAnalyticsCameras] = useState([])
  const [analyticsTypes, setAnalyticsTypes] = useState([])
  const [cameraAssociations, setCameraAssociations] = useState([])
  const [selectedCameraAssociations, setSelectedCameraAssociations] =
    useState("")
  const [adam, setAdam] = useState([])
  const [evidence, setEvidence] = useState([])
  const [selectedAnServer, setSelectedAnServer] = useState(null)
  const [selectedAnCamera, setSelectedAnCamera] = useState("")
  const [selectedAnType, setSelectedAnType] = useState(null)
  const [anImage, setAnImage] = useState(null)
  const [arrowDirection, setArrowDirection] = useState("up")
  const [showEvidenceConfig, setShowEvidenceConfig] = useState(false)
  const [showSeedLimitConfig, setShowSpeedLimitConfig] = useState(false)
  const [showViewSchdule, setShowViewSchedule] = useState(false)
  const params = useParams()
  const [showAddNew, setShowAddNew] = useState(false)
  const [enableAnalyticsForm, setEnableAnalyticsForm] = useState(false)
  const [eventPriority, setEventPriority] = useState("")
  const [message, setMessage] = useState("")
  const [action, setAction] = useState("")
  const [stream, setStream] = useState("")
  const [streamingServerIp, setStreamingServerIp] = useState("")
  const [lanes, setLanes] = useState("")
  const [jobList, setJobList] = useState([])
  const [evMaxSignalTime, setEvMaxSignalTime] = useState(600)
  const [imageWidth, setImageWidth] = useState("")
  const [imageHeight, setImageHeight] = useState("")
  const [points, setPoints] = useState(null)
  const [zoneArray, setZoneArray] = useState([])
  const [videoSourceUrl, setVideoSourceUrl] = useState("")
  const [defaultEvUrlData, setDefaultEvUrlData] = useState()
  const [evUrlData, setEvUrlData] = useState([
    { stream: "", url: "", time: "" },
    { stream: "", url: "", time: "" },
    { stream: "", url: "", time: "" },
    { stream: "", url: "", time: "" },
  ])
  const [speedLimitObj, setSpeedLimitObj] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  })
  const [selectedDates, setSelectedDates] = useState()
  const [scheduleList, setScheduleList] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const fetchScheduleList = async () => {
    const slist = await getScheduleList()
    console.log(slist)
    setScheduleList(slist)
    console.log(slist, "slist")
  }
  useEffect(() => {
    console.log(scheduleList)
    if (scheduleList?.length > 0) {
      setSelectedSchedule(scheduleList[0])
    }
  }, [scheduleList])
  useEffect(() => {
    fetchScheduleList()
  }, [])
  const fetchJunctionList = async () => {
    const junctions = await getJunctionsList()
    console.log(junctions)
    setJunctionList(junctions)
  }
  useEffect(() => {
    console.log(selectedAnCamera, "selectedAnCamera")
    const getSnap = async () => {
      if (selectedAnCamera) {
        try {
          const snap = await getSnapByChannelId(selectedAnCamera)
          console.log("setAnImage", snap[0].content)
          setAnImage(snap[0].content)
        } catch (err) {
          setAnImage(null)
          console.log(err)
        }
      }
    }
    getSnap()
    const fetchCameraAssosiation = async (mediaServerID) => {
      const response = await getCameraAssosiation(mediaServerID)
      console.log(response)
      const filteredObject = response.filter(
        (obj) => obj.primaryChId === selectedAnCamera
      )
      // console.log("filteredObject",filteredObject);
      setCameraAssociations(filteredObject)
      // console.log("filteredObject[0].associatedChIds[0]",filteredObject[0].associatedChIds[0])
      setSelectedCameraAssociations(filteredObject[0]?.associatedChIds[0])
      setAdam([])
      setEvidence([])
      setEvUrlData([
        { stream: "", url: "", time: "" },
        { stream: "", url: "", time: "" },
        { stream: "", url: "", time: "" },
        { stream: "", url: "", time: "" },
      ])
      setDefaultEvUrlData({
        MAJOR_STREAM: "",
        MINOR_STREAM: "",
        MJPG_STREAM: "",
        JPEG_SNAP: "",
      })
      setStream("")
    }
    fetchCameraAssosiation(params.junctionId)
  }, [selectedAnCamera])
  const fetchAnalyticsJobList = async () => {
    const jlist = await getAnalyticJobListById(params.junctionId)
    setJobList(jlist)
    // console.log(jlist, 'jobList')
  }
  useEffect(() => {
    fetchAnalyticsJobList()
  }, [])
  useEffect(() => {
    console.log("setJobList", jobList)
  }, jobList)
  const fetchNewAnalyticsData = async () => {
    let anServers = await getAnalyticsServers()
    console.log(anServers)
    anServers = anServers.filter((server) => {
      return server.id === params.junctionId
    })
    anServers?.length && setSelectedAnServer(anServers?.[0].id)
    setAnalyticsServers(anServers)
    const anCameras = await getAnalyticsCameras(params.junctionId)
    setAnalyticsCameras(anCameras)
    const anTypes = await getConfigAnalyticsTypes()
    // const anTypes = await getAnalyticsTypes();
    setAnalyticsTypes(anTypes)
    // console.log({
    //   anServers, anCameras, anTypes
    // })
  }

  useEffect(() => {
    fetchJunctionList()
    fetchNewAnalyticsData()
  }, [])
  // useEffect(() => {
  //   console.log(junctionList, 'junctionList')
  // }, [junctionList])
  const getServerIp = (serverId) => {
    if (!serverId) {
      return
    }
    return analyticsServers.find((server) => server.id === serverId)?.ip
  }
  const getAnalyticsTypeName = (id) => {
    if (id) {
      return analyticsTypes.find((type) => type.alerttype === id)?.alertname
    } else {
      return
    }
  }
  useEffect(() => {
    if (selectedAnServer && selectedAnCamera && selectedAnType) {
      setEnableAnalyticsForm(true)
    } else {
      setEnableAnalyticsForm(false)
    }
  }, [selectedAnServer, selectedAnCamera, selectedAnType])
  useEffect(() => {
    let serverIp = getServerIp(selectedAnServer)
    setStreamingServerIp(serverIp)
  }, [selectedAnServer])
  const changeSelectedSchedule = (selectedName) => {
    console.log(selectedName)
    const selectedSch = scheduleList.find((schedule) => {
      return schedule.name === selectedName
    })
    console.log(selectedSch)
    setSelectedSchedule(selectedSch)
  }
  const handleStream = (value) => {
    let stream = value
    setStream(stream)
    if (stream == "MJPG_STREAM") {
      setStreamingServerIp("127.0.0.1")
      setVideoSourceUrl(
        analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
          .analyticUrl
      )
    } else if (stream == "MAJOR_STREAM") {
      let urlstring =
        "vms://" +
        streamingServerIp +
        ":" +
        "3003/" +
        analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0].id +
        "/0/" +
        analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0].param5
      setVideoSourceUrl(urlstring)
    }
  }
  const changeStreamIp = (event) => {
    setStreamingServerIp(event.target.value)
  }
  const fetchAdamSetting = async () => {
    const payload = {
      junctionServerId: params.junctionId,
    }
    const response = await adamSetting(payload)
    console.log("setAdam response", response)
    const filteredObject = response.filter(
      (obj) => obj.channel?.id === selectedCameraAssociations
    )
    setAdam(filteredObject)
    const channelArray = analyticsCameras.filter(
      (obj) => obj.id == selectedAnCamera
    )
    const payload2 = {
      junctionServerId: params.junctionId,
      channel: channelArray[0],
    }
    // console.log(payload2);
    const response2 = await evidenceSetting(payload2)
    let tempevUrlData = []
    let channelObj = analyticsCameras.filter(
      (obj) => obj.id == selectedAnCamera
    )
    console.log("channelObj", channelObj)
    let tempobjArray = [
      { stream: "MAJOR_STREAM", url: channelObj[0].majorUrl, time: "0" },
      { stream: "MINOR_STREAM", url: channelObj[0].minorUrl, time: "0" },
      { stream: "MJPG_STREAM", url: channelObj[0].analyticUrl, time: "0" },
      { stream: "JPEG_SNAP", url: channelObj[0].snapUrl, time: "0" },
    ]
    let defaulttembObj = [
      {
        MAJOR_STREAM: channelObj[0].majorUrl,
        MINOR_STREAM: channelObj[0].minorUrl,
        MJPG_STREAM: channelObj[0].analyticUrl,
        JPEG_SNAP: channelObj[0].snapUrl,
      },
    ]
    setDefaultEvUrlData(defaulttembObj)
    if (response2.length !== 0) {
      response2.map((res) => {
        let tempObj = {
          stream: res.streamtype,
          url: res.url,
          time: res.timeOffsetInSec,
        }
        tempevUrlData.push(tempObj)
      })
      setEvUrlData(tempevUrlData)
    } else {
      setEvUrlData(tempobjArray)
    }
    setEvidence(response2)
    setShowEvidenceConfig(true)
  }
  const saveAnalytic = async () => {
    let zoneList = [
      {
        pointList: [
          { x: 0, y: 0 },
          { x: imageWidth, y: 0 },
          { x: imageWidth, y: imageHeight },
          { x: 0, y: imageHeight },
        ],
        referenceWidth: imageWidth,
        referenceHeight: imageHeight,
        parameters: [lanes, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ]
    zoneArray?.map((points) => {
      let obj = {
        pointList: points,
        referenceWidth: imageWidth,
        referenceHeight: imageHeight,
        parameters: [
          arrowDirection == "Away from the Camera" ? 1 : 0,
          1025,
          adam[0]?.bitPosition,
          evMaxSignalTime,
          0,
          parseInt(
            analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
              .mediaChannelParam
              ? analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
                  .mediaChannelParam?.fov_width_far * 10000
              : 0
          ),
          parseInt(
            analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
              .mediaChannelParam
              ? analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
                  .mediaChannelParam?.fov_width_near * 10000
              : 0
          ),
          parseInt(
            analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
              .mediaChannelParam
              ? analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
                  .mediaChannelParam?.fov_distance * 10000
              : 0
          ),
          parseInt(
            analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
              .mediaChannelParam
              ? analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
                  .mediaChannelParam?.heigth_from_ground * 10000
              : 0
          ),
          parseInt(
            analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
              .mediaChannelParam
              ? analyticsCameras.filter((obj) => obj.id == selectedAnCamera)[0]
                  .mediaChannelParam?.blind_zone * 10000
              : 0
          ),
          speedLimitObj[0],
          speedLimitObj[1],
          speedLimitObj[2],
          speedLimitObj[3],
          0,
        ],
      }
      zoneList.push(obj)
    })
    const analyticPayload = [
      {
        action: action, //string
        analyticId: selectedAnType, //numaric
        channelID: selectedAnCamera, //numeric
        eventPriority: eventPriority, //numeric
        jobID: "",
        jobKey: "message", //string
        jobType: 0, //numeric
        mesage: message, //string
        schedule: [
          ...selectedSchedule.recordingSchedule[0],
          ...selectedSchedule.recordingSchedule[1],
          ...selectedSchedule.recordingSchedule[2],
          ...selectedSchedule.recordingSchedule[3],
          ...selectedSchedule.recordingSchedule[4],
          ...selectedSchedule.recordingSchedule[5],
          ...selectedSchedule.recordingSchedule[6],
        ], //string
        vasId: selectedAnServer, //string
        vehicleClassSpeedLimitTable: {
          3: parseInt(speedLimitObj[3]),
          2: parseInt(speedLimitObj[2]),
          1: parseInt(speedLimitObj[1]),
          0: parseInt(speedLimitObj[0]),
        },
        videoSourcePassword: analyticsCameras.filter(
          (obj) => obj.id == selectedAnCamera
        )[0].password, //string
        videoSourceUrl: videoSourceUrl, //string
        videoSourceUsername: analyticsCameras.filter(
          (obj) => obj.id == selectedAnCamera
        )[0].username, //string
        zoneList: zoneList,
      },
    ]
    console.log("analyticPayload", analyticPayload)
    const response = await saveAnalytics(analyticPayload)
    if (response.status == 200) {
      toast({
        variant: "success",
        description: "Saved succesfully!",
        duration: 3000,
      })
      fetchAnalyticsJobList()
      setShowAddNew(false)
    } else {
      toast({
        variant: "destructive",
        description: error.message,
        duration: 3000,
      })
    }
  }
  const deleteAllAnalytics = () => {
    jobList.map(async (job) => {
      const adamspayload = {
        junctionServerId: params.junctionId,
        channel: {
          id: job.channelID,
        },
      }
      const adamsResponse = await adamSetting(adamspayload)
      // console.log("delete adamsResponse",adamsResponse)
      let analyticEvidanceCamSettings = null
      if (adamsResponse.length > 0) {
        analyticEvidanceCamSettings =
          adamsResponse[0].analyticEvidanceCamSettings
      }
      //Delete evidence setting/configuration
      let deleteEvidencePayload = {
        channel: {
          id: job.channelID,
        },
        junctionServerId: params.junctionId,
        analyticEvidanceCamSettings: analyticEvidanceCamSettings,
      }
      const deleteEvidenceResponse = await deleteEvidenceSettings(
        deleteEvidencePayload
      )
      console.log("deleteEvidenceResponse", deleteEvidenceResponse)
      const edgeJob = job.edgeJob
      let payload
      if (edgeJob == true) {
        payload = {
          vasId: -1,
          jobIds: [-1],
          chId: job.channelID,
          videoSourceUrl: -1,
          isEdgeJob: true,
          analyticId: job.analyticId,
        }
      } else {
        payload = {
          vasId: job.vasId,
          jobIds: [job.jobID],
          chId: job.channelID,
          videoSourceUrl: job.videoSourceUrl,
          isEdgeJob: false,
        }
      }
      const deleteResponse = await deleteAnalyticJob(payload)
      if (deleteResponse.status == 200) {
        fetchAnalyticsJobList()
      }
    })
  }
  const deleteJob = async (jobId) => {
    const jobObj = jobList.find((item) => item.jobID === jobId)
    // console.log("jobObj",jobObj)
    const adamspayload = {
      junctionServerId: params.junctionId,
      channel: {
        id: jobObj.channelID,
      },
    }
    const adamsResponse = await adamSetting(adamspayload)
    // console.log("delete adamsResponse",adamsResponse)
    let analyticEvidanceCamSettings = null
    if (adamsResponse.length > 0) {
      analyticEvidanceCamSettings = adamsResponse[0].analyticEvidanceCamSettings
    }
    //Delete evidence setting/configuration
    let deleteEvidencePayload = {
      channel: {
        id: jobObj.channelID,
      },
      junctionServerId: params.junctionId,
      analyticEvidanceCamSettings: analyticEvidanceCamSettings,
    }
    const deleteEvidenceResponse = await deleteEvidenceSettings(
      deleteEvidencePayload
    )
    console.log("deleteEvidenceResponse", deleteEvidenceResponse)
    const edgeJob = jobObj.edgeJob
    let payload
    if (edgeJob == true) {
      payload = {
        vasId: -1,
        jobIds: [-1],
        chId: jobObj.channelID,
        videoSourceUrl: -1,
        isEdgeJob: true,
        analyticId: jobObj.analyticId,
      }
    } else {
      payload = {
        vasId: jobObj.vasId,
        jobIds: [jobObj.jobID],
        chId: jobObj.channelID,
        videoSourceUrl: jobObj.videoSourceUrl,
        isEdgeJob: false,
      }
    }
    const deleteResponse = await deleteAnalyticJob(payload)
    if (deleteResponse.status == 200) {
      fetchAnalyticsJobList()
    }
    console.log("deleteResponse", deleteResponse)
  }
  const viewJob = (jobId) => {
    const jobObj = jobList.find((item) => item.jobID === jobId)
    console.log("jobObj", jobObj)
    setViewObj(jobObj)
    setShowView(true)
  }
  // useEffect(()=>{
  //   console.log("analyticsServers",analyticsServers)
  // },[analyticsServers])
  const applyAnalytic = async (jobId, ChannelId) => {
    console.log("jobId", jobId)
    console.log("ChannelId", ChannelId)
    const payload = {
      junctionServerId: params.junctionId,
      channel: {
        id: ChannelId,
      },
    }
    const adamsResponse = await adamSetting(payload)
    console.log("setAdam response", adamsResponse)
    let jobListChannelId = []
    jobList.map((item) => {
      jobListChannelId.push(item.channelID)
    })
    analyticsCameras.map(async (item) => {
      const indexOfItem = jobListChannelId.indexOf(item.id)
      if (indexOfItem == -1) {
        const jobPayload = {
          vasId: params.junctionId,
          applicationId: jobList.find((item) => item.jobID === jobId)
            .analyticId,
          channelId: item.id,
        }
        console.log(jobPayload)
        const jobResponse = await retrieveAnalyticJobs(jobPayload)
        console.log("jobResponse", jobResponse)
        const jobResArray = jobResponse.data.result
        console.log("jobResArray", jobResArray)
        if (jobResArray.length == 0 || jobResArray == null) {
          const addEvidencePayload = {
            Channel: item.id,
            junctionServerId: params.junctionId,
          }
          console.log("addEvidencePayload", addEvidencePayload)
          const addResponse = await addEvidenceSettings(addEvidencePayload)
          console.log(addResponse)
          //create zone list
          let zoneListArray = jobList.find(
            (item) => item.jobID === jobId
          ).zoneList
          console.log("zoneListArray", zoneListArray)
          let newZoneArray = []
          zoneListArray.map((zone) => {
            let parameters = [
              zone.parameters[0],
              1025,
              zone.parameters[2],
              zone.parameters[3],
              zone.parameters[4],
              parseInt(
                analyticsCameras.filter((obj) => obj.id == item.id)[0]
                  .mediaChannelParam
                  ? analyticsCameras.filter((obj) => obj.id == item.id)[0]
                      .mediaChannelParam?.fov_width_far * 10000
                  : 0
              ),
              parseInt(
                analyticsCameras.filter((obj) => obj.id == item.id)[0]
                  .mediaChannelParam
                  ? analyticsCameras.filter((obj) => obj.id == item.id)[0]
                      .mediaChannelParam?.fov_width_near * 10000
                  : 0
              ),
              parseInt(
                analyticsCameras.filter((obj) => obj.id == item.id)[0]
                  .mediaChannelParam
                  ? analyticsCameras.filter((obj) => obj.id == item.id)[0]
                      .mediaChannelParam?.fov_distance * 10000
                  : 0
              ),
              parseInt(
                analyticsCameras.filter((obj) => obj.id == item.id)[0]
                  .mediaChannelParam
                  ? analyticsCameras.filter((obj) => obj.id == item.id)[0]
                      .mediaChannelParam?.heigth_from_ground * 10000
                  : 0
              ),
              parseInt(
                analyticsCameras.filter((obj) => obj.id == item.id)[0]
                  .mediaChannelParam
                  ? analyticsCameras.filter((obj) => obj.id == item.id)[0]
                      .mediaChannelParam?.blind_zone * 10000
                  : 0
              ),
              zone.parameters[10],
              zone.parameters[11],
              zone.parameters[12],
              zone.parameters[13],
              zone.parameters[14],
            ]
            let newObj = {
              arrowPoints: zone.arrowPoints,
              parameters: parameters,
              pointList: zone.pointList,
              referenceHeight: zone.referenceHeight,
              referenceWidth: zone.referenceWidth,
              settingsKeyWord: zone.settingsKeyWord,
            }
            newZoneArray.push(newObj)
          })
          console.log("newZoneArray", newZoneArray)
          //save job
          const jobPayload = [
            {
              action: jobList.find((item) => item.jobID === jobId).action, //string
              analyticId: jobList.find((item) => item.jobID === jobId)
                .analyticId, //numaric
              channelID: item.id, //numeric
              eventPriority: jobList.find((item) => item.jobID === jobId)
                .eventPriority, //numeric
              jobID: "",
              jobKey: item.ip, //string
              jobType: 0, //numeric
              mesage: item.ip, //string
              schedule: jobList.find((item) => item.jobID === jobId).schedule, //string
              vasId: jobList.find((item) => item.jobID === jobId).vasId, //string
              vehicleClassSpeedLimitTable: jobList.find(
                (item) => item.jobID === jobId
              ).vehicleClassSpeedLimitTable,
              videoSourcePassword: item.password, //string
              videoSourceUrl: "vms://127.0.0.1:3003/" + item.id + "/0/null", //string
              videoSourceUsername: item.username, //string
              zoneList: newZoneArray,
            },
          ]
          console.log("jobPayload", jobPayload)
          const response = await saveAnalytics(jobPayload)
          if(response.status == 200){
            fetchAnalyticsJobList()
          }
          console.log("save response", response)
        }
      }
    })
    
    // console.log("jobListChannelId",jobListChannelId)
    // console.log("analyticsCameras",analyticsCameras)
  }
  return (
    <div className="mt-6">
      <div className="flex">
        <div>Configured Analytics</div>
        <div className="flex grow justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"blueoutline"}>
                Delete All Analytics
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to delete all analytics ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteAllAnalytics()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant={"blueoutline"} onClick={() => setShowAddNew(true)}>
            Add New Analytics
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Table className="overflow-none">
          <TableHeader>
            <TableRow className="w-full">
              <TableHead className="w-36">VAS IP</TableHead>
              <TableHead>Camera</TableHead>
              <TableHead>Analytic</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Event key</TableHead>
              <TableHead>Actions</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobList.map((job) => {
              return (
                <TableRow key={job.jobID}>
                  <TableCell className="w-36 truncate ">{job.vasId} </TableCell>
                  <TableCell className="w-36 truncate ">
                    {
                      analyticsCameras.find((cam) => cam.id === job.channelID)
                        ?.name
                    }
                  </TableCell>
                  <TableCell className="w-36 truncate ">
                    {" "}
                    {
                      analyticsTypes.find(
                        (type) => type.alerttype === job.analyticId
                      )?.alertname
                    }
                  </TableCell>
                  <TableCell className="w-36 truncate ">
                    {" "}
                    {["Critical", "Medium", "Low"]?.[job.eventPriority]}
                  </TableCell>
                  <TableCell className="w-36 truncate ">{job.jobKey}</TableCell>
                  {/* <TableCell className="w-30 flex flex-row gap-1 truncate">
                <p onClick={()=>viewJob(job.jobID)} className="cursor-pointer text-[14px] font-bold text-[#2A94E5]">View</p>
                <Image src="/images/delete-icon-red.svg" width="20" height="20"  alt="icon" onClick={()=>deleteJob(job.jobID)} className="cursor-pointer" />
              </TableCell> */}
                  <TableCell className="w-36 truncate ">
                    <Popover>
                      <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
                        <Image
                          alt="Down"
                          src="/vectors/Down.svg"
                          width={14}
                          height={14}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="mr-2 w-[220px] p-2">
                        <p
                          onClick={() => viewJob(job.jobID)}
                          className="cursor-pointer text-[14px]"
                        >
                          View
                        </p>
                        {/* <p
                          onClick={() => deleteJob(job.jobID)}
                          className="cursor-pointer text-[14px]"
                        >
                          Delete
                        </p> */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                          <p className="cursor-pointer text-[14px]">Delete</p>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you want to delete this analytics ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={()=>deleteJob(job.jobID)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <p
                          onClick={() =>
                            applyAnalytic(job.jobID, job.channelID)
                          }
                          className="cursor-pointer text-[14px]"
                        >
                          Apply analytic for all cameras
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
        <DialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-xl">
          <DialogHeader>
            <DialogTitle>Add New Analytics</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-row gap-4">
            <div className="w-1/3">
              <Label htmlFor="name" className="text-right">
                Analytic Server
              </Label>
              {/* <Select value={selectedSchedule?.name} onValueChange={(selectedName)=>{changeSelectedSchedule(selectedName)}}></Select> */}
              <Select
                onValueChange={setSelectedAnServer}
                value={selectedAnServer}
              >
                <SelectTrigger className=" font-medium ">
                  <SelectValue id="Select" />
                </SelectTrigger>
                <SelectContent>
                  {analyticsServers?.map((server) => {
                    return (
                      <SelectItem value={server.id}>{server.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              <Label htmlFor="camera" className="text-right">
                Camera
              </Label>
              {/* <Select value={selectedSchedule?.name} onValueChange={(selectedName)=>{changeSelectedSchedule(selectedName)}}></Select> */}

              <Select
                id="camera"
                name="camera"
                onValueChange={setSelectedAnCamera}
              >
                <SelectTrigger className=" font-medium ">
                  <SelectValue id="Select" />
                </SelectTrigger>
                <SelectContent>
                  {analyticsCameras?.map((camera) => {
                    return (
                      <SelectItem value={camera.id}>{camera.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              <Label htmlFor="analyticType" className="text-right">
                Analytic Type
              </Label>
              {/* <Select value={selectedSchedule?.name} onValueChange={(selectedName)=>{changeSelectedSchedule(selectedName)}}></Select> */}
              <Select
                id="analyticType"
                name="analyticType"
                onValueChange={(val) => setSelectedAnType(val)}
              >
                <SelectTrigger className=" font-medium ">
                  <SelectValue id="Select" />
                </SelectTrigger>
                <SelectContent>
                  {analyticsTypes?.map((type) => {
                    return (
                      <SelectItem value={type.alerttype}>
                        {type.alertname}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <hr />
          </div>
          {!enableAnalyticsForm && (
            <div className="flex min-h-[200px] items-center justify-center py-4">
              <Image
                src="/images/add-analytics-vector.svg"
                width={300}
                height={300}
              />
            </div>
          )}
          {!enableAnalyticsForm && (
            <div className="text-center">
              Select the above presets to set analytics
            </div>
          )}
          <hr />
          {enableAnalyticsForm && (
            <div className="min-h-[600px] text-center">
              <div className="flex">
                <div>{getAnalyticsTypeName(selectedAnType)}</div>
                <div className="flex grow items-center justify-end gap-2">
                  Streaming Server{" "}
                  <Input
                    type="text"
                    id="streamingServer"
                    value={streamingServerIp}
                    className="w-[240px] py-2"
                    disabled={stream == "MJPG_STREAM" ? true : false}
                    onChange={(event) => changeStreamIp(event)}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="w-2/5">
                  <AnalyticsImage
                    arrowDirection={arrowDirection}
                    image={
                      anImage
                        ? `data:image/png;base64,${anImage}`
                        : "/images/analytic_image_placeholder.png"
                    }
                    setImageWidth={setImageWidth}
                    setImageHeight={setImageHeight}
                    setPoints={setPoints}
                    imageHeight={imageHeight}
                    imageWidth={imageWidth}
                    setZoneArray={setZoneArray}
                  />
                </div>
                <div className="w-3/5  border p-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 text-left">
                      <Label>Event priority</Label>
                      <Select
                        id="eventPriority"
                        name="eventPriority"
                        value={eventPriority}
                        onValueChange={setEventPriority}
                      >
                        <SelectTrigger className=" font-medium ">
                          <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={0}>Critical</SelectItem>{" "}
                          <SelectItem value={1}>Medium</SelectItem>
                          <SelectItem value={2}>Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/3 text-left">
                      <Label>Event Message</Label>
                      <Input
                        id="eventMessage"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        name="eventMessage"
                        className="py-2"
                      />
                    </div>
                    <div className="w-1/3 text-left">
                      <Label>Event Action</Label>
                      <Input
                        id="eventAction"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        name="eventAction"
                        className="py-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {cameraAssociations.length > 0 ? (
                      <Button
                        variant={"blueoutline"}
                        onClick={() => fetchAdamSetting()}
                        size="sm"
                      >
                        Evidence Configuration
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr className="my-4" />
                  <div className="flex gap-4">
                    <div className="w-1/3 text-left">
                      <Label>Stream</Label>
                      <Select
                        id="stream"
                        name="stream"
                        onValueChange={(value) => handleStream(value)}
                      >
                        <SelectTrigger className=" font-medium ">
                          <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAJOR_STREAM">Major</SelectItem>
                          <SelectItem value="MJPG_STREAM">MJPG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/3 text-left">
                      <Label>Number of lane(s)</Label>
                      <Select
                        id="lanes"
                        name="lanes"
                        onValueChange={(value) => setLanes(value)}
                      >
                        <SelectTrigger className=" font-medium ">
                          <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-1/3 items-end pb-1 text-left">
                      <div>
                        <Button
                          variant="blueoutline"
                          onClick={() => setShowSpeedLimitConfig(true)}
                          size="sm"
                        >
                          Set Speed Limit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="flex gap-4">
                    <div className="w-1/3 text-left">
                      <Label>Arrow Direction</Label>
                      <Select
                        id="arrowDirection"
                        name="arrowDirection"
                        defaultValue="Away from the Camera"
                        value={arrowDirection}
                        onValueChange={setArrowDirection}
                      >
                        <SelectTrigger className=" font-medium ">
                          <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Away from the Camera">
                            Away from the camera
                          </SelectItem>
                          <SelectItem value="Towards the Camera">
                            Towards the Camera
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/3 text-left">
                      <Label>Load Schedule</Label>
                      <Select
                        id="loadSchedule"
                        name="loadSchedule"
                        value={selectedSchedule?.name}
                        onValueChange={(selectedName) => {
                          changeSelectedSchedule(selectedName)
                        }}
                      >
                        <SelectTrigger className=" font-medium ">
                          <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {scheduleList.map((schedule) => {
                            return (
                              <SelectItem value={schedule.name}>
                                {schedule.name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-1/3 items-end pb-1 text-left">
                      <div>
                        <Button
                          variant="blueoutline"
                          onClick={() => setShowViewSchedule(true)}
                          size="sm"
                        >
                          View Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-end gap-4">
                    <Button variant={"blueoutline"} size="sm">
                      Clear all
                    </Button>
                    <Button
                      variant={"default"}
                      onClick={saveAnalytic}
                      size="sm"
                    >
                      Save Analytics
                    </Button>
                  </div>
                </div>
              </div>
              <EvidanceDialog
                setOpen={setShowEvidenceConfig}
                open={showEvidenceConfig}
                defaultEvUrlData={defaultEvUrlData}
                evUrlData={evUrlData}
                setEvUrlData={setEvUrlData}
                evMaxSignalTime={evMaxSignalTime}
                setEvMaxSignalTime={setEvMaxSignalTime}
                setDefaultEvUrlData={setDefaultEvUrlData}
              />
              <SetSpeedModal
                setOpen={setShowSpeedLimitConfig}
                open={showSeedLimitConfig}
                setSpeedLimitObj={setSpeedLimitObj}
                speedLimitObj={speedLimitObj}
              />
              <ViewSchedule
                setOpen={setShowViewSchedule}
                open={showViewSchdule}
                schedule={selectedSchedule}
              />
            </div>
          )}

          {/* <DialogFooter>
          <Button type="submit">Save Analytic</Button>
        </DialogFooter> */}
        </DialogContent>
      </Dialog>
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-xl">
          <DialogHeader>
            <DialogTitle className="py-4">View Analytics</DialogTitle>
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex w-1/3 flex-col justify-between">
                <p className="text-left text-sm font-medium">
                  Analytic Server {viewObj.analyticId}
                </p>
                {viewObj.vasId !== null ? (
                  <Input
                    value={
                      analyticsServers.find(
                        (server) => server.id === viewObj.vasId
                      )?.name
                    }
                    disabled
                    className="text-black"
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="flex w-1/3 flex-col justify-between">
                <p className="text-left text-sm font-medium">Camera</p>
                {viewObj.channelID !== null ? (
                  <Input
                    value={
                      analyticsCameras.find(
                        (obj) => obj.id == viewObj.channelID
                      ).name
                    }
                    disabled
                    className="text-black"
                  />
                ) : (
                  // <></>
                  <></>
                )}
              </div>
              <div className="flex w-1/3 flex-col justify-between">
                <p className="text-left text-sm font-medium">Analytic Type</p>
                {viewObj.channelID !== null ? (
                  <Input
                    value={
                      analyticsTypes.find(
                        (type) => type.alerttype === viewObj.analyticId
                      )?.alertname
                    }
                    disabled
                    className="text-black"
                  />
                ) : (
                  // <></>
                  <></>
                )}
              </div>
            </div>
            {/* <div className="flex items-center justify-end gap-4 py-4">
            <p>Streaming Server - 172.16.1.156</p>
          </div> */}
            <div className="flex justify-between gap-4 py-4">
              <div className="w-2/5">
                <ViewAnalyticsImage
                  zoneList={viewObj.zoneList}
                  arrowDirection={arrowDirection}
                  image={
                    anImage
                      ? `data:image/png;base64,${anImage}`
                      : "/images/analytic_image_placeholder.png"
                  }
                  setImageWidth={setImageWidth}
                  setImageHeight={setImageHeight}
                  setPoints={setPoints}
                  imageHeight={imageHeight}
                  imageWidth={imageWidth}
                  setZoneArray={setZoneArray}
                />
              </div>
              <div className="flex w-3/5 flex-col gap-4 border p-4">
                <div className="flex items-center justify-start gap-2">
                  <div>
                    <p className="text-sm font-medium">Event priority</p>
                    {viewObj.eventPriority !== null ? (
                      <Input
                        value={
                          ["Critical", "Medium", "Low"]?.[viewObj.eventPriority]
                        }
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Event Message</p>
                    {viewObj.mesage !== null ? (
                      <Input
                        value={viewObj.mesage}
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Event Action</p>
                    {viewObj.action !== null ? (
                      <Input
                        value={viewObj.action}
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                </div>
                {/* <div className="flex items-center justify-start gap-2">
              <div>
                  <p className="text-sm font-medium">Stream</p>
                    {viewObj.channelID !== null ? 
                      <Input  value={analyticsTypes.find(type => type.alerttype === viewObj.analyticId)?.alertname}/>
                      // <></>
                      :
                      <></>
                    }
                </div>
              </div> */}
                <div className="flex items-center justify-start gap-2">
                  <div>
                    <p className="text-sm font-medium">Number of lane(s)</p>
                    {viewObj.zoneList.length > 0 ? (
                      <Input
                        value={viewObj.zoneList[0].parameters[0]}
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Arrow Direction</p>
                    {viewObj.zoneList.length > 1 ? (
                      <Input
                        value={
                          viewObj.zoneList[1].parameters[0] == 0
                            ? "Towards the Camera"
                            : "Away from the Camera"
                        }
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule</p>
                    {viewObj.channelID !== null ? (
                      <Input
                        value={
                          analyticsTypes.find(
                            (type) => type.alerttype === viewObj.analyticId
                          )?.alertname
                        }
                        disabled
                        className="text-black"
                      />
                    ) : (
                      // <></>
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AnalyticsConfig
