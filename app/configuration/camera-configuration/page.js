"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
import useStore from "@/store/store"

import {
  deleteCamera,
  deleteCameraAnalytics,
  fetchStreamParams,
  getChannelByJunction,
  getJunctionsList,
  getScheduleList,
  saveGroup,
  saveLaneNum,
  updateImgParam,
  updateRecStream,
  updateSchedule,
} from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// import { ViewSchedule } from "./components/view-schedule"

const Image = dynamic(() => import("next/image"))
const ViewSchedule = dynamic(() =>
  import(
    "../../configuration/server-storage/junction/[junctionId]/components/viewScheduleModal"
  )
)

const CameraConfig = () => {
  const channelList = useStore((state) => state.channelList)
  const setChannelList = useStore((state) => state.setChannelList)
  const allChannelList = useStore((state) => state.allChannelList)
  const setAllChannelList = useStore((state) => state.setAllChannelList)
  const siteGroup = useStore((state) => state.siteGroup)
  const setSiteGroup = useStore((state) => state.setSiteGroup)
  const laneNum = useStore((state) => state.laneNum)
  const setLaneNum = useStore((state) => state.setLaneNum)
  const imgParams = useStore((state) => state.imgParams)
  const setImgParams = useStore((state) => state.setImgParams)
  const [ip, setIp] = useState()
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [groupName, setGroupName] = useState("")
  const [storeStreamData, setStoreStreamData] = useState()
  const [isModalOpen, setModalIsOpen] = useState(false)
  const [showViewSchdule, setShowViewSchedule] = useState(false)
  const [hue, setHue] = useState(128)
  const [saturation, setSaturation] = useState(128)
  const [brightness, setBrightness] = useState(128)
  const [contrast, setContrast] = useState(128)
  const [selectedLane, setSelectedLane] = useState()
  const [storeLane, setStoreLane] = useState()
  const [junctions, setJunctions] = useState([])
  const [selectedJunctionId, setSelectedJunctionId] = useState(null)
  const [channels, setChannels] = useState([])

  const [selectedRecordingId, setSelectedRecordingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [commentDialog, setCommentDialog] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [comments, setComments] = useState("")
  const [analyticsResponse, setAnalyticsResponse] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [scheduleList, setScheduleList] = useState([])

  const { toast } = useToast()

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
  useEffect(() => {
    setChannelList()
    setAllChannelList()
    setSiteGroup()
    fetchJunctions()
  }, [])
  const maxLaneNumber = 8
  useEffect(() => {
    if (selectedJunctionId !== null) {
      getChannelList(selectedJunctionId)
    }
  }, [selectedJunctionId])

  useEffect(() => {
    if (selectedChannelId !== null) {
      const payload = {
        channelId: selectedChannelId,
        optional_1: selectedRecordingId,
        secondaryId: {
          bitrateMode: 55,
          bitrate: 55,
          ipRate: 55,
          fps: 55,
          width: 55,
          height: 55,
        },
      }
      const fetchStreamParam = async (payload) => {
        try {
          const streamParam = await fetchStreamParams(payload)
          setStoreStreamData(streamParam?.data?.result[0])
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message
            if (errorMessage.includes("Camera Driver not available")) {
              toast({
                variant: "destructive",
                description:
                  "Camera Driver not available. Contact Administrator.",
                duration: 3000,
              })
            } else {
              console.error("Bad Request:", errorMessage)
            }
          } else {
            console.error("Error:", error)
          }
        }
      }

      fetchStreamParam(payload)
    }
  }, [selectedChannelId])

  useEffect(() => {
    if (selectedChannelId !== null) {
      const channel = allChannelList.find(
        (item) => item.channelID === selectedChannelId
      )
      if (channel) {
        const matchingGroup = allChannelList.find(
          (item) => item.groupId === channel.groupId
        )
        if (matchingGroup) {
          const matchingName = siteGroup.find(
            (item) => item.id === matchingGroup.groupId
          )
          if (matchingName) {
            setGroupName(matchingName)
          }
        }
      }
    }
  }, [selectedChannelId])
  console.log(groupName.name, "data")

  useEffect(() => {
    setLaneNum(selectedChannelId)
    setImgParams(selectedChannelId)
  }, [selectedChannelId])

  const saveHandler = async () => {
    try {
      // save lane
      let lanePayload = [
        {
          channelID: selectedChannelId,
          laneNumber: selectedLane,
        },
      ]
      const savedLanNum = await saveLaneNum(lanePayload)
      // Save Schedule
      let schedulePayload = {
        channelID: selectedChannelId,
        grouping: 0,
        secondaryId: selectedSchedule.id,
      }

      const savedSchedule = await updateSchedule(schedulePayload)

      // save Recording Stream
      let recStreamPayload = {
        channelID: selectedChannelId,
        grouping: 0,
        secondaryId: selectedRecordingId,
      }

      const savedRecStream = await updateRecStream(recStreamPayload)

      // save group

      let groupPayload = {
        channelID: selectedChannelId,
        grouping: 0,
        secondaryId: groupName,
      }
      const savedGroup = await saveGroup(groupPayload)

      // save image Stream
      let imgPayload = {
        channelID: selectedChannelId,
        grouping: 0,
        secondaryId: {
          hue: hue,
          saturation: saturation,
          brightness: brightness,
          contrast: contrast,
        },
      }
      const savedImgParams = await updateImgParam(imgPayload)


      // Check if all API calls were successful
      if (
        savedLanNum &&
        savedSchedule &&
        savedRecStream &&
        savedGroup &&
        savedImgParams
      ) {
        toast({
          variant: "success",
          description: "Successfully Added!",
          duration: 2000,
        })
      } else {
        // If any API call failed, show error toast
        toast({
          variant: "destructive",
          description: "Failed to save data",
          duration: 2000,
        })
      }
    } catch (error) {
      // If any error occurred during API calls, show error toast
      toast({
        variant: "destructive",
        description: error.message || "An error occurred",
        duration: 2000,
      })
    }
  }

  const handleJunctionSelect = (val) => {
    if (val !== undefined || val !== null || val !== "") {
      setSelectedJunctionId(val)
    }
  }

  const handleSelectChange = (event) => {
    const selectedCam = channels.find((cam) => cam.name === event)

    if (selectedCam) {
      setSelectedChannelId(selectedCam?.id)
      setIp(selectedCam?.ip)
      setSelectedRecordingId(selectedCam?.recordingId)
    }
  }
  const toggleSchedule = () => {
    setShowViewSchedule(!showViewSchdule)
  }
  const toggleModal = () => {
    setModalIsOpen(!isModalOpen)
  }
  const handleHueChange = (event) => {
    setHue(event.target.value)
  }

  const handleSaturationChange = (event) => {
    setSaturation(event.target.value)
  }

  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value)
  }

  const handleContrastChange = (event) => {
    setContrast(event.target.value)
  }

  const handleLaneChange = (value) => {
    setSelectedLane(value)
  }
  const handleRecIdChange = (value) => {
    setSelectedRecordingId(value)
  }
  const handleGrpIdChange = (value) => {
    setGroupName(value)
  }

  useEffect(() => {
    setStoreLane(laneNum?.map((item) => item.laneNumber))
  }, [laneNum])
  const getRecordingLabel = (recordingId) => {
    console.log("id", recordingId)
    switch (recordingId) {
      case 0:
        return "Major Stream"
      case 1:
        return "Minor Stream"
      case 2:
        return "MJPG Stream"
      case 3:
        return "Jpeg Snap"
      default:
        return "Profile" // Handle any other values as needed
    }
  }
  const getBitrateModeText = () => {
    switch (storeStreamData?.bitrateMode) {
      case 0:
        return "VBR"
      case 1:
        return "CBR"
      default:
        return "Bitrate Mode"
    }
  }

  const fetchJunctions = async () => {
    try {
      const response = await getJunctionsList()
      setJunctions(response)
    } catch (error) {
      console.log("Error :", error)
    }
  }

  const getChannelList = async (junctionId) => {
    try {
      const resp = await getChannelByJunction(junctionId)
      if (resp?.data?.result.length > 0) {
        setChannels(resp?.data?.result)
      } else {
        setChannels([])
        setSelectedChannelId(null)
      }
    } catch (error) {
      console.log("Error :", error)
    }
  }

  const handleCameraDelete = () => {
    if (selectedChannelId !== null) {
      try {
        const selectedData = channels.find(
          (data) => data.id === selectedChannelId
        )
        setSelectedCamera(selectedData)
        setOpen(!open)
      } catch (error) {
        console.log("Error : ", error)
      }
    }
  }

  const handleAnalyticsDelete = async () => {
    let result
    if (selectedCamera !== null) {
      let payload = {
        analyticUrl: selectedCamera.analyticUrl,
        analyticUrlMulticast: selectedCamera.analyticUrlMulticast,
        channelDeletedTimeStamp: selectedCamera.channelDeletedTimeStamp,
        channelProperty: selectedCamera.channelProperty,
        channelType: selectedCamera.channelType,
        commandPort: selectedCamera.commandPort,
        configurationType: selectedCamera.configurationType,
        currentTransmission: selectedCamera.currentTransmission,
        description: selectedCamera.description,
        id: selectedCamera.id,
        ip: selectedCamera.ip,
        isChannelDeleted: selectedCamera.isChannelDeleted,
        latitude: selectedCamera.latitude,
        longitude: selectedCamera.longitude,
        majorUrl: selectedCamera.majorUrl,
        majorUrlMulticast: selectedCamera.majorUrlMulticast,
        mediaChannelParam: selectedCamera.mediaChannelParam,
        mediaServerId: selectedCamera.mediaServerId,
        minorUrl: selectedCamera.minorUrl,
        minorUrlMulticast: selectedCamera.minorUrlMulticast,
        model: selectedCamera.model,
        motionRecording: selectedCamera.motionRecording,
        name: selectedCamera.name,
        noOfJobs: selectedCamera.noOfJobs,
        number: selectedCamera.number,
        oldestClipTime: selectedCamera.oldestClipTime,
        param1: selectedCamera.param1,
        param2: selectedCamera.param2,
        param3: selectedCamera.param3,
        param4: selectedCamera.param4,
        param5: selectedCamera.param5,
        password: selectedCamera.password,
        recordingId: selectedCamera.recordingId,
        recordingStream: selectedCamera.recordingStream,
        snapUrl: selectedCamera.snapUrl,
        username: selectedCamera.username,
        vocRecordingFlag: selectedCamera.vocRecordingFlag,
      }
      try {
        const response = await deleteCameraAnalytics(payload)
        result = response?.data?.result[0]
        setAnalyticsResponse(response?.data?.result[0])
      } catch (error) {
        console.log("Error : ", error)
      }
      if (result === true) {
        setOpen(false)
        setCommentDialog(false)
        setDeleteDialog(true)
      }
    } else {
      toast({
        variant: "destructive",
        description: "Camera not selected",
        duration: 2000,
      })
    }
  }

  const getCameraDetails = () => {
    if (analyticsResponse === true) {
      setOpen(false)
      setCommentDialog(true)
      setDeleteDialog(false)
    }
  }

  const getComments = async () => {
    let respResult
    if (selectedCamera != null || selectedCamera != undefined) {
      let payload = {
        channelId: selectedCamera.id,
        secondaryId: comments,
        optionalSecondaryId: selectedCamera.mediaServerId,
      }
      try {
        let comment = comments.replace(/\s+/g, "-")
        const response = await deleteCamera(
          selectedCamera.id,
          selectedCamera.mediaServerId,
          comment,
          payload
        )
        respResult = response?.data
        toast({
          variant: "success",
          description: respResult?.message,
          duration: 2000,
        })
        fetchJunctions()
        setSelectedChannelId(null)
        setTimeout(() => {
          window.location.reload()
        }, 1300)
      } catch (error) {
        console.log("Error : ", error)
      }

      setOpen(false)
      setCommentDialog(false)
      setDeleteDialog(false)
      setComments("")
    }
  }
  const handleClose = () => {
    setOpen(false)
    setDeleteDialog(false)
    setCommentDialog(false)
    setShowDialog(true)
    setComments("")
  }
  const closeMessage = () => {
    setOpen(false)
    setDeleteDialog(false)
    setCommentDialog(false)
    setShowDialog(!showDialog)
    setComments("")
  }
  const handleCommentsChange = (e) => {
    setComments(e.target.value)
  }

  const changeSelectedSchedule = (selectedName) => {
    const selectedSch = scheduleList.find((schedule) => {
      return schedule.name === selectedName
    })
    setSelectedSchedule(selectedSch)
  }
  selectedSchedule

  console.log()
  return (
    <div className="w-full">
      <div className="m-4 w-full">Camera Configuration</div>
      <div className="m-4 py-4">
        {/* <div className="flex">
          <div>Select Junction</div>
          <div>Select Channel</div>
          <div className="flex grow justify-evenly">
            <span className="text-slate-500 ">Schedule</span>
          </div>
        </div> */}
        <div className="flex flex-row items-end gap-4 pt-4">
          <div>
            <div className="mb-2">Select Junction</div>
            <Select onValueChange={handleJunctionSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Junction" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-scroll">
                <SelectGroup>
                  <SelectLabel>Junction</SelectLabel>
                  {junctions?.map((junction) => (
                    <SelectItem key={junction.id} value={junction.id}>
                      {junction.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-2">Select Channel</div>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-scroll">
                <SelectGroup>
                  <SelectLabel>Channel</SelectLabel>
                  {channels?.map((cam) => (
                    <SelectItem key={cam.id} value={cam.name}>
                      {cam.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-60 flex flex-col">
            <div className="mb-2">
              <span className="text-slate-500 ">Schedule</span>
            </div>
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

          <div className="flex grow justify-end">
            <Button
              variant="outline"
              className="rounded-sm border-sky-500"
              onClick={toggleModal}
            >
              View Schedule
            </Button>
            {isModalOpen && (
              <ViewSchedule
                // onRequestClose={toggleModal}
                setOpen={toggleModal}
                open={toggleSchedule}
                // toggleSchedule={toggleSchedule}
                schedule={selectedSchedule}
                hideVal={true}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex w-full grow p-2">
          <div className="pt-4">
            <Image
              src="/images/camera-search-image.png"
              width="500"
              height={100}
              className="h-[264px] w-[500px] rounded-lg"
            />
          </div>
          <div className="mx-2 pt-4">
            <div>
              <span className="text-[#0F0F10]">IP - {ip}</span>
            </div>

            <div className="my-4">
              <div>Lane Number</div>
              {laneNum.length > 0 ? (
                <Select onValueChange={handleLaneChange}>
                  <SelectTrigger className="w-[500px]">
                    <SelectValue
                      placeholder={laneNum ? `${storeLane}` : "Select Lane"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[...Array(maxLaneNumber)].map((_, index) => (
                        <SelectItem key={index + 1} value={index + 1}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select>
                  <SelectTrigger className="w-[500px]">
                    <SelectValue placeholder="Lane Number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="my-4">
              <div>Profile</div>
              <Select onValueChange={handleRecIdChange}>
                <SelectTrigger className="w-[500px]">
                  <SelectValue
                    placeholder={getRecordingLabel(selectedRecordingId)}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Profile</SelectLabel>
                    <SelectItem value="0">Major Stream</SelectItem>
                    <SelectItem value="1">Minor Stream</SelectItem>
                    <SelectItem value="2">MJPG Stream</SelectItem>
                    <SelectItem value="3">Jpeg Snap</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="my-4">
              <div>Group</div>
              {groupName ? (
                <Select onValueChange={handleGrpIdChange}>
                  <SelectTrigger className="w-[500px]">
                    <SelectValue
                      placeholder={groupName.name}
                      defaultValue={groupName.id}
                    >
                      {groupName.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Group</SelectLabel>
                      {[
                        {
                          id: 1,
                          name: "Default",
                        },
                        {
                          id: 2,
                          name: "Default2",
                        },
                      ]?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select>
                  <SelectTrigger className="w-[500px]">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup></SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="m-4 flex grow justify-evenly gap-8 pt-4">
        <div>
          Bitrate Mode
          <div className="my-4">
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={getBitrateModeText()} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bitrate Mode</SelectLabel>
                  <SelectItem key="0" value="VBR" defaultValue="VBR">
                    VBR
                  </SelectItem>
                  <SelectItem key="1" value="CBR" defaultValue="CBR">
                    CBR
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          Bitrate
          <div className="my-4">
            {storeStreamData ? (
              <Input
                type="number"
                placeholder="Bitrate"
                value={storeStreamData?.bitrate}
                className="h-10 w-40 rounded-sm"
                step="1"
                max="60"
                min="1"
                onChange={(e) => {
                  const newValue = e.target.value
                  setStoreStreamData((prevData) => ({
                    ...prevData,
                    bitrate: parseFloat(newValue),
                  }))
                }}
              />
            ) : (
              <Input
                type="number"
                placeholder="Bitrate"
                value={null}
                className="h-10 w-40 rounded-sm"
                step="1"
                max="60"
                min="1"
              />
            )}
          </div>
        </div>
        <div>
          FPS
          <div className="my-4">
            {storeStreamData ? (
              <Input
                placeholder="FPS"
                value={storeStreamData?.fps}
                className="w-22 h-10 rounded-sm"
                type="number"
                step="1"
                max="90"
                min="0"
                onChange={(e) => {
                  const newValue = e.target.value
                  setStoreStreamData((prevData) => ({
                    ...prevData,
                    fps: parseFloat(newValue),
                  }))
                }}
              />
            ) : (
              <Input
                placeholder="FPS"
                value={null}
                className="w-22 h-10 rounded-sm"
                type="number"
                step="1"
                max="90"
                min="0"
              />
            )}
          </div>
        </div>
        <div>
          IP Rate
          <div className="my-4">
            {storeStreamData ? (
              <Input
                placeholder="IP Rate"
                value={storeStreamData?.ipRate}
                className="w-22 h-10 rounded-sm"
                type="number"
                step="1"
                max="90"
                min="0"
                onChange={(e) => {
                  const newValue = e.target.value
                  setStoreStreamData((prevData) => ({
                    ...prevData,
                    ipRate: parseFloat(newValue),
                  }))
                }}
              />
            ) : (
              <Input
                placeholder="IP Rate"
                value={null}
                className="w-22 h-10 rounded-sm"
                type="number"
                step="1"
                max="90"
                min="0"
              />
            )}
          </div>
        </div>
        <div>
          Resolution
          <div className="my-4">
            {storeStreamData ? (
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue
                    placeholder={`${storeStreamData.width} * ${storeStreamData.height}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Resolution</SelectLabel>
                    <SelectItem
                      value={`${storeStreamData.width} * ${storeStreamData.height}`}
                    >{`${storeStreamData.width} * ${storeStreamData.height}`}</SelectItem>
                    <SelectItem value="1920*1081">1920*1081</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Resolution</SelectLabel>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="m-4 rounded-sm border p-2 relative">
        <div className="flex justify-between">
          <label className="p-4">Hue</label>
            <Input
              type="range"
              min="0"
              max="255"
              step="1"
              value={imgParams[0]?.hue}
              onChange={handleHueChange}
              className="w-[80%] mx-4"
            />
        </div>
        <div className="flex justify-between">
          <label className="p-4">Saturation</label>
          {/* <div className="-py-10 flex w-[90%] gap-8  px-4"> */}
            <Input
              type="range"
              min="0"
              max="255"
              step="1"
              value={imgParams[0]?.saturation}
              onChange={handleSaturationChange}
              className="w-[80%] mx-4"
            />
            {/* <div>
              <Input
                placeholder="Saruration"
                defaultValue="15"
                value={imgParams[0]?.saturation}
                className="w-21 rounded-sm"
                type="number"
              />
            </div> */}
          {/* </div> */}
        </div>
        <div className="flex justify-between">
          <label className="p-4">Contrast</label>
          {/* <div className="-py-10 flex w-[90%] gap-8  px-4"> */}
            <Input
              type="range"
              min="0"
              max="255"
              step="1"
              value={imgParams[0]?.contrast}
              onChange={handleContrastChange}
              className="w-[80%] mx-4"
            />
            {/* <div>
              <Input
                placeholder="Contrast"
                value={imgParams[0]?.contrast}
                defaultValue="15"
                className="w-21 rounded-sm"
                type="number"
              />
            </div> */}
          {/* </div> */}
        </div>
        <div className="flex justify-between">
          <label className="p-4">Brightness</label>
          {/* <div className="-py-10 flex w-[90%] gap-8  px-4"> */}
            <Input
              type="range"
              min="0"
              max="255"
              step="1"
              value={imgParams[0]?.brightness}
              onChange={handleBrightnessChange}
              className="w-[80%] mx-4"
            />
            {/* <div>
              <Input
                placeholder="Brightness"
                value={imgParams[0]?.brightness}
                defaultValue="15"
                className="w-21 rounded-sm"
                type="number"
              />
            </div> */}
          {/* </div> */}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3 mt-6">
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              {selectedChannelId !== null && (
                <Button
                  variant="outline"
                  onClick={() => handleCameraDelete(selectedChannelId)}
                >
                  {/* <Image
                alt="deleteIcon"
                src="/images/delete-icon-red.svg"
                width={20}
                height={20}
                /> */}
                  Delete
                </Button>
              )}
            </DialogTrigger>
            <DialogContent
              className={"w-[500px] overflow-y-scroll max-h-screen"}
            >
              <DialogHeader>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogDescription className="pt-2">
                  Analytics against this camera will get deleted. Sure?
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="default"
                  className="w-[100px]"
                  onClick={() => handleAnalyticsDelete()}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="w-[100px] rounded-sm"
                  onClick={handleClose}
                >
                  No
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <DialogContent
              className={"w-[500px] overflow-y-scroll max-h-screen"}
            >
              <DialogHeader>
                <DialogTitle>Warning</DialogTitle>
                <DialogDescription className="pt-2">
                  All records and events will be deleted automatically. Are you
                  sure you want to delete the channel -{" "}
                  <strong>{selectedCamera?.name}</strong>
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="default"
                  className="w-[100px]"
                  onClick={() => getCameraDetails()}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="w-[100px] rounded-sm"
                  onClick={handleClose}
                >
                  No
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={commentDialog} onOpenChange={setCommentDialog}>
            <DialogContent
              className={"w-[500px] overflow-y-scroll max-h-screen"}
            >
              <DialogHeader>
                <DialogTitle>Input</DialogTitle>
                <DialogDescription className="">
                  <div className="flex flex-col pt-3">
                    <span className="pb-1">
                      Why do you want to delete camera.
                    </span>
                    <span className="pb-1">Please enter your comment.</span>
                    <span>It will be logged.</span>
                  </div>
                  <div className="pt-3">
                    <Input
                      id="comments"
                      name="comments"
                      className="py-2"
                      value={comments}
                      onChange={handleCommentsChange}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="default"
                  className="w-[100px]"
                  onClick={() => getComments()}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="w-[100px] rounded-sm"
                  onClick={handleClose}
                >
                  No
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent
              className={"w-[500px] overflow-y-scroll max-h-screen"}
            >
              <DialogHeader>
                <DialogTitle>Message</DialogTitle>
                <DialogDescription className="">
                  <div className="flex flex-col">
                    <span>Thank you for not removing camera from system</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="default"
                  className="w-[100px]"
                  onClick={closeMessage}
                >
                  Ok
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button onClick={saveHandler}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default CameraConfig
