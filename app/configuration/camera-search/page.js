"use client"

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from "react"
// import Image from "next/image"
import useStore from "@/store/store"
import { Dialog, DialogContent } from "@radix-ui/react-dialog"

import {
  addCamera,
  stopSearch,
  updateCameraSearch,
  updateCameraSnap,
  updateSearchDetails,
} from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useToast } from "@/components/ui/use-toast"

const Image = dynamic(() => import("next/image"));

const CameraSearch = () => {
  const shouldContinueRef = useRef(true)
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [storeModel, setStoreModel] = useState("")
  const [storeId, setStoreId] = useState("")
  const [lenCam, setLenCam] = useState(0)
  const [data, setData] = useState([])
  const [selectedDivs, setSelectedDivs] = useState([])
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState([])
  const [img, setImg] = useState()
  const [uuid, setUuid] = useState([])
  const [showDefaultImage, setShowDefaultImage] = useState(true)
  const mediaserver = useStore((state) => state.mediaserver)
  const setMediaserver = useStore((state) => state.setMediaserver)
  const searchModel = useStore((state) => state.searchModel)
  const setSearchModel = useStore((state) => state.setSearchModel)
  const [selectedCameraType, setSelectedCameraType] = useState("") // State for the selected camera type
  const [cameraTypeOptions, setCameraTypeOptions] = useState([])
  const [storedSnapUrl, setStoredSnapUrl] = useState()
  const [storeAnalyticUrl, setStoreAnalyticUrl] = useState()
  const [storeMajorUrl, setStoreMajorUrl] = useState()
  const [storeMinorUrl, setStoreMinorUrl] = useState()
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()
  const [param1, setParam1] = useState()
  const [param2, setParam2] = useState()
  const [param5, setParam5] = useState()
  const [vocRecordingFlag, setVocRecordingFlag] = useState()
  const [recStream, setRecStream] = useState()
  const [motionRecording, setMotionRecording] = useState()
  const [oldestClipTime, setOldestClipTime] = useState()
  const [currentTransmission, setCurrentTransmission] = useState()
  const [channelType, setChannelType] = useState()
  const [configurationType, setConfigurationType] = useState()
  const [numberName, setNumberName] = useState()
  const [ipName, setIpName] = useState()
  const [channelDeletedTimeStamp, setChannelDeletedTimeStamp] = useState()
  const [isChannelDeleted, setIsChannelDeleted] = useState()
  const [description, setDescription] = useState()
  const [majorUrlMulticast, setMajorUrlMulticast] = useState()
  const [analyticUrlMulticast, setAnalyticUrlMulticast] = useState()
  const [minorUrlMulticast, setMinorUrlMulticast] = useState()
  const [number, setNumber] = useState()
  const [commandPort, setCommandPort] = useState()
  const [noOfJobs, setNoOfJobs] = useState()
  const [ipInCam, setIpInCam] = useState()
  const [loading, setLoading] = useState(false)
  const [selectedCameraIP, setSelectedCameraIP] = useState(null)
  const [selectedCameraUrl, setSelectedCameraUrl] = useState(null)
  const [selectedCameraUuid, setSelectedCameraUuid] = useState(null)
  const [isAddCamSuccess, setIsAddCamSuccess] = useState(false)

  useEffect(() => {
    setMediaserver()
    setSearchModel()
  }, [])

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const toggleImage = () => {
    setShowDefaultImage(!showDefaultImage)
  }
  const selectedMSId = mediaserver?.find(
    (mediaServer) => mediaServer.mediaServer.name === storeId
  )
  const selectedIp = selectedMSId?.mediaServer.camIpRange
  const selectedIpNum = selectedMSId?.mediaServer.ip

  let ipParts = selectedIp?.split(/\.|-/)
  let ipPart1 = ipParts?.[0]
  let ipPart2 = ipParts?.[1]
  let ipPart3 = ipParts?.[2]
  let ipPart4 = ipParts?.[3]
  let ipPart5 = ipParts?.[4]

  const [part1, setPart1] = useState("")
  const [part2, setPart2] = useState("")
  const [part3, setPart3] = useState("")
  const [part4, setPart4] = useState("")
  const [part5, setPart5] = useState("")

  let storeBaseIp = [part1, part2, part3]
  const formattedIP = storeBaseIp.join(".") + "."

  useEffect(() => {
    if (ipPart1) {
      setPart1(ipPart1)
    }
    if (ipPart2) {
      setPart2(ipPart2)
    }
    if (ipPart3) {
      setPart3(ipPart3)
    }
    if (ipPart4) {
      setPart4(ipPart4)
    }
    if (ipPart5) {
      setPart5(ipPart5)
    }
  }, [ipPart1, ipPart2, ipPart3, ipPart4, ipPart5])

  const handleSearch = async () => {
    if (!username || !password) {
      toast({
        variant: "destructive",
        description: "Please enter username and password.",
        duration: 3000,
      })
      return
    }
    if (!storeModel || !selectedMSId?.mediaServerId) {
      toast({
        variant: "destructive",
        description: "Please enter Junction and media.",
        duration: 3000,
      })
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        cameraModel: storeModel,
        msId: selectedMSId?.mediaServerId,
        baseIp: formattedIP,
        startIp: part4,
        endIp: part5,
        username: username,
        password: password,
        searchSessionId: new Date().getTime(),
      }
      shouldContinueRef.current = true
      while (shouldContinueRef.current) {
        const response = await updateCameraSearch(payload)
        if (response.data.code === 103) {
          toast({
            variant: "success",
            description:
              "Search Successful! " +
              response.data.result[0].length +
              " cameras found",
            duration: 3000,
          })
          setLenCam(response.data.result[0].length)
          setData(response.data.result[0])
          setUrl(response.data.result[0].map((item) => item.url))
          setUuid(response.data.result[0].map((item) => item.channel.param5))
          shouldContinueRef.current = false
        }

        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for 1 second before making the next API call
      }
    } catch (error) {
    } finally {
      setIsLoading(false) // Set isLoading to false when the search is done (whether it succeeds or fails)
    }
  }
  const stopSearchHandler = async () => {
    setIsLoading(false)
    shouldContinueRef.current = false
    try {
      const payload = {
        cameraModel: storeModel,
        msId: selectedMSId?.mediaServerId,
        baseIp: formattedIP,
        startIp: part4,
        endIp: part5,
        username: username,
        password: password,
        searchSessionId: new Date().getTime(),
      }
      const response = await stopSearch(payload)
      if (response.data.message) {
        toast({
          variant: "success",
          description: "Stop Search Successfully Applied!",
          duration: 3000,
        })
      } else {
        toast({
          variant: "destructive",
          description: "Stop Search Failed",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error while stopping search:", error)
    }
  }

  const handleCheckboxChange = (index) => {
    setSelectedDivs((prevSelectedDivs) =>
      prevSelectedDivs.includes(index)
        ? prevSelectedDivs.filter((item) => item !== index)
        : [...prevSelectedDivs, index]
    )

    setSelectedCameraIndex(index)
    setStoredSnapUrl(null)
  }
  useEffect(() => {
    if (selectedCameraIndex !== null) {
      const selectedCamera = data[selectedCameraIndex]
      setSelectedCameraIP(selectedCamera?.channel.ip)
      setSelectedCameraUrl(selectedCamera.url)
      setSelectedCameraUuid(selectedCamera?.channel.param5)
    }
  }, [selectedCameraIndex, data])

  useEffect(() => {
    if (selectedCameraIP !== null) {
      setLoading(true)
      handleAddSnapClick()
    }
  }, [selectedCameraIP])
  useEffect(() => {}, [selectedCameraIP])
  const fetchCamSnap = async (selectedCameraIndex) => {
    try {
      let payload = {
        cameraModel: storeModel,
        msId: selectedMSId?.mediaServerId,
        username: username,
        password: password,
        url: url[selectedCameraIndex],
        uuid: uuid[selectedCameraIndex],
      }

      const camSnap = await updateCameraSnap(payload)
      var base64String =
        "data:image/png;base64," + camSnap?.data?.result[0]?.jpegImage
      if (
        base64String === "data:image/png;base64," ||
        base64String === "data:image/png;base64,null"
      ) {
        setImg("")
      } else {
        setImg(base64String)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Unauthorized: Unable to retrieve snap!",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSnapClick = () => {
    if (selectedCameraIndex !== null) {
      fetchCamSnap(selectedCameraIndex)
    }
  }
  useEffect(() => {}, [url, uuid])
  const fetchSearchDetails = async (selectedCameraIndex) => {
    try {
      let payload = {
        cameraModel: storeModel,
        msId: selectedMSId?.mediaServerId,
        username: username,
        password: password,
        url: url[selectedCameraIndex],
        uuid: uuid[selectedCameraIndex],
      }
      const searchDetails = await updateSearchDetails(payload)
      if (searchDetails.data.message) {
        toast({
          variant: "success",
          description: "Successfully Saved!",
          duration: 3000,
        })
      }
      setStoredSnapUrl(searchDetails?.data.result[0].channel?.snapUrl)
      setStoreAnalyticUrl(searchDetails?.data.result[0].channel?.analyticUrl)
      setStoreMajorUrl(searchDetails?.data.result[0].channel?.majorUrl)
      setStoreMinorUrl(searchDetails?.data.result[0].channel?.minorUrl)
      setLat(searchDetails?.data.result[0].channel?.latitude)
      setLng(searchDetails?.data.result[0].channel?.longitude)
      setParam1(searchDetails?.data.result[0].channel?.param1)
      setParam2(searchDetails?.data.result[0].channel?.param2)
      setParam5(searchDetails?.data.result[0].channel?.param5)
      setVocRecordingFlag(
        searchDetails?.data.result[0].channel?.vocRecordingFlag
      )
      setRecStream(searchDetails?.data.result[0].channel?.recordingStream)
      setMotionRecording(searchDetails?.data.result[0].channel?.motionRecording)
      setOldestClipTime(searchDetails?.data.result[0].channel?.oldestClipTime)
      setCurrentTransmission(
        searchDetails?.data.result[0].channel?.currentTransmission
      )
      setChannelType(searchDetails?.data.result[0].channel?.channelType)
      setConfigurationType(
        searchDetails?.data.result[0].channel?.configurationType
      )
      setNumberName(searchDetails?.data.result[0].channel?.numberName)
      setIpName(searchDetails?.data.result[0].channel?.ipName)
      setChannelDeletedTimeStamp(
        searchDetails?.data.result[0].channel?.channelDeletedTimeStamp
      )
      setIsChannelDeleted(
        searchDetails?.data.result[0].channel?.isChannelDeleted
      )
      setDescription(searchDetails?.data.result[0].channel?.description)
      setMajorUrlMulticast(
        searchDetails?.data.result[0].channel?.majorUrlMulticast
      )
      setMinorUrlMulticast(
        searchDetails?.data.result[0].channel?.minorUrlMulticast
      )
      setAnalyticUrlMulticast(
        searchDetails?.data.result[0].channel?.analyticUrlMulticast
      )
      setNumber(searchDetails?.data.result[0].channel?.number)
      setCommandPort(searchDetails?.data.result[0].channel?.commandPort)
      setNoOfJobs(searchDetails?.data.result[0].channel?.noOfJobs)
      setIpInCam(searchDetails?.data.result[0].channel?.ip)
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error occurred while save changes!",
        duration: 3000,
      })
    }
  }
  useEffect(() => {}, [
    storedSnapUrl,
    storeAnalyticUrl,
    storeMajorUrl,
    storeMinorUrl,
    lat,
    lng,
    param1,
    param2,
    param5,
    vocRecordingFlag,
    recStream,
    motionRecording,
    oldestClipTime,
    currentTransmission,
    channelType,
    configurationType,
    numberName,
    ipName,
    channelDeletedTimeStamp,
    isChannelDeleted,
    description,
    majorUrlMulticast,
    minorUrlMulticast,
    analyticUrlMulticast,
    number,
    commandPort,
    noOfJobs,
    ipInCam,
  ])
  const handleSaveChanges = () => {
    if (selectedCameraIndex !== null) {
      fetchSearchDetails(selectedCameraIndex)
    }
  }
  const isCredentialsPopulated = username && password

  function getStreamType(recordingId) {
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
        return "Major Stream"
    }
  }
  const recordingId = data[selectedCameraIndex]?.channel?.recordingStream
  const defaultStreamType = getStreamType(recordingId)

  const initialConfigurationType =
    data[selectedCameraIndex]?.channel?.configurationType // Replace with your data structure
  function getInitialCheckboxState(configurationType) {
    return configurationType === 1 // PTZ configurationType is 1
  }
  const [isPTZ, setIsPTZ] = useState(
    getInitialCheckboxState(initialConfigurationType)
  )
  const handleCheckbox = () => {
    setIsPTZ(!isPTZ) // Toggle the checkbox state
    const newConfigurationType = isPTZ ? 0 : 1 // Toggle configurationType between 0 (Fixed) and 1 (PTZ)
  }
  const fixedOptions = ["ANPR", "Evidence", "Others"]
  useEffect(() => {
    const cameraTypeMap = {
      0: "ANPR",
      1: "Evidence",
      2: "Others",
    }

    const selectedTypes = data?.map((item) => {
      const channelType = item.channel.channelType
      return cameraTypeMap[channelType] || ""
    })
    const uniqueOptions = [...new Set(selectedTypes)]

    const allOptions = [...fixedOptions, ...uniqueOptions]

    setSelectedCameraType(allOptions[0] || "")
    setCameraTypeOptions(
      allOptions.filter((option) => option !== selectedCameraType)
    )
  }, [data, selectedCameraType])

  const addCamHandler = async () => {
    if (!storedSnapUrl || storedSnapUrl === null) {
      toast({
        variant: "destructive",
        description: "Please save changes before adding a camera.",
        duration: 3000,
      })
      return
    } else {
      let payload = {
        mediaServerID: selectedMSId?.mediaServerId,
        secondaryId: [
          {
            ip: ipInCam,
            number: number,
            commandPort: commandPort,
            name: ipInCam,
            username: username,
            password: password,
            noOfJobs: noOfJobs,
            model: storeModel,
            snapUrl: storedSnapUrl,
            analyticUrl: storeAnalyticUrl,
            majorUrl: storeMajorUrl,
            minorUrl: storeMinorUrl,
            channelProperty: {
              channelID: 0,
              recordingID: 1,
              locationId: 1,
              groupId: 1,
              posX: -1,
              posY: -1,
              refMapID: 1,
            },
            mediaChannelParam: {
              channelID: 0,
              junctionId: selectedMSId?.mediaServerId,
              laneNumber: 1,
              latitude: lat,
              longitude: lng,
              param1: param1,
              param2: param2,
              param5: param5,
              vocRecordingFlag: vocRecordingFlag,
              recordingStream: recStream,
              motionRecording: motionRecording,
              oldestClipTime: oldestClipTime,
              currentTransmission: currentTransmission,
              analyticUrlMulticast: analyticUrlMulticast,
              minorUrlMulticast: minorUrlMulticast,
              majorUrlMulticast: majorUrlMulticast,
              description: description,
              numberName: numberName,
              ipName: ipName,
              isChannelDeleted: isChannelDeleted,
              channelDeletedTimeStamp: channelDeletedTimeStamp,
              channelType: channelType,
              configurationType: configurationType,
              recordingID: recordingId,
            },
          },
        ],
      }
      const camSelected = await addCamera(payload)
      if (camSelected.data.message) {
        toast({
          variant: "success",
          description: "Successfully Added!",
          duration: 3000,
        })
        setIsAddCamSuccess(true)
      } else {
        toast({
          variant: "destructive",
          description: "DBMS Unknown error! Please report the problem.",
          duration: 3000,
        })
        setIsAddCamSuccess(false)
      }
    }
  }
  useEffect(() => {
    if (isAddCamSuccess) {
      const updatedDataList = data?.filter(
        (item) => item.channel.ip !== selectedCameraIP
      )
      const updatedUrl = url?.filter((item) => item !== selectedCameraUrl)
      const updatedUuid = uuid?.filter((item) => item !== selectedCameraUuid)
      console.log("updatedUuid", updatedUuid)

      setData(updatedDataList)
      setUrl(updatedUrl)
      setUuid(updatedUuid)
      setLenCam(updatedDataList.length)
      setSelectedCameraIndex(null)
      setSelectedCameraIP(null)
      setSelectedCameraUrl(null)
      setStoredSnapUrl(null)
      setIsAddCamSuccess(false)
    }
  }, [
    isAddCamSuccess,
    data,
    url,
    uuid,
    selectedCameraIP,
    selectedCameraUrl,
    selectedCameraUuid,
  ])

  return (
    <div className="w-full p-4">
      <div className="w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>User Credentials</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row">
                <div className="p-4">
                  <Label for="username"> Username </Label>
                  <Input
                    id="username"
                    name="username"
                    className="py-2"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="p-4">
                  <Label for="username"> Password </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="py-2"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="py-4">
        <div className="flex">
          <div>Search By Camera</div>
        </div>
        <div className="flex flex-row gap-4 pt-4">
          <div>
            <Select onValueChange={(val) => setStoreId(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Junction" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-scroll">
                <SelectGroup>
                  <SelectLabel>Junction</SelectLabel>
                  {mediaserver?.map((mediaServer) => (
                    <SelectItem
                      key={mediaServer.mediaServerId}
                      value={mediaServer.mediaServer.name}
                    >
                      {mediaServer.mediaServer.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={(value) => setStoreModel(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72 w-48 rounded-md border">
                  <SelectGroup>
                    <SelectLabel>Model</SelectLabel>
                    {searchModel?.map((model, index) => (
                      <SelectItem key={index} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button
              variant="default"
              onClick={isLoading ? stopSearchHandler : handleSearch}
              // disabled={isLoading}
              className={`${isLoading && "bg-blue-300"}`}
            >
              {isLoading ? "Stop Search" : "Search"}
            </Button>
          </div>
          <div className="flex grow justify-end">
            {/* <Button variant={"default"}>Import Camera</Button> */}
            {/* <Select>
              <SelectTrigger className="w-[180px] bg-[#2A94E5] text-[#F6F6F6]">
                <SelectValue placeholder="Import Camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="http">http</SelectItem>
                  <SelectItem value="rtsp">rtsp</SelectItem>
                  <SelectItem value="file">file</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}
          </div>
        </div>
        <div className="flex h-10 gap-2 py-6 ">
          <p>IP Range</p>
          <div className="flex gap-2">
            <Input
              value={part1}
              className="w-20"
              onChange={(e) => setPart1(e.target.value)}
            />
            <Input
              value={part2}
              className="w-20"
              onChange={(e) => setPart2(e.target.value)}
            />
            <Input
              value={part3}
              className="w-20"
              onChange={(e) => setPart3(e.target.value)}
            />
            <Input
              value={part4}
              className="w-20"
              onChange={(e) => setPart4(e.target.value)}
            />

            <p className="pt-1"> - </p>
            <Input
              value={part5}
              className="w-20"
              onChange={(e) => setPart5(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-72 h-[360px] bg-blue-100 py-4">
          {/* <ScrollArea className="h-72 rounded-md scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"> */}
          <div class="h-72 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            <div className="px-4">{lenCam} Cameras Found</div>

            <div className="py-4">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className={`flex w-full gap-2 px-2 py-4 ${
                    selectedCameraIndex === index
                      ? "bg-white border-r-4 border-[#2A94E5]"
                      : ""
                  }`}
                  onClick={() => handleCheckboxChange(index)}
                >
                  <div className="flex h-auto items-center">
                    <Checkbox checked={selectedCameraIndex === index} />
                  </div>
                  <div className="flex h-auto items-center">
                    Camera {index + 1}
                  </div>
                  <div className="flex grow flex-col justify-end text-xs text-slate-400">
                    <div className="text-right">
                      Model- {item.channel.model}{" "}
                    </div>
                    <div className="text-right">IP - {item.channel.ip}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* </ScrollArea> */}
          </div>

          <div className="flex justify-center">
            {lenCam > 0 ? (
              <Button
                className="rounded-sm border-[#2A94E5] text-[#2A94E5]"
                variant="outline"
                onClick={addCamHandler}
              >
                Add selected camera
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-[#D9D9D9] text-[#F6F6F6] rounded-sm"
                disabled
              >
                Add selected camera
              </Button>
            )}
          </div>
        </div>
        {selectedCameraIndex !== null && (
          <div className="w-full grow border bg-slate-50 p-2">
            <div className="flex">
              <div className="text-semibold">
                Camera {selectedCameraIndex + 1}
              </div>
            </div>
            <div className="pt-4">
              {loading ||
                !img
                ? (
                <AspectRatio ratio={16 / 9} className="bg-gray-900">
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Image
                      src="/vectors/Videonetics_logo (1).svg"
                      alt="logo"
                      width={80}
                      height={80}
                    />
                    <p className="bg-[#fff] px-2">Image is not available</p>
                  </div>
                </AspectRatio>
              ) : (
                // <Image
                //   // src="/images/camera-search-image.png"
                //   src={img}
                //   width={500}
                //   height={300}
                //   className="w-full"
                //   alt="Snap"
                // />
                // <AspectRatio ratio={16 / 9} className="bg-gray-900">
                //               <div className="flex h-full w-full flex-col items-center justify-center">
                <Image
                  src={img}
                  width={500}
                  height={300}
                  className="w-full"
                  alt="Snap"
                />
                //   </div>
                // </AspectRatio>
              )}
            </div>
            <div className="pt-4">
              <div className="flex gap-4 text-slate-400">
                <div>IP - {data[selectedCameraIndex].channel.ip}</div>
                <div>Model - {data[selectedCameraIndex].channel.model}</div>
                <div>
                  <Checkbox onChange={handleCheckbox} />
                  <span className="pl-2">PTZ</span>
                </div>
                <div>
                  <Button className="h-[25px]" onClick={handleAddSnapClick}>
                    Add Snap
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mt-4 w-full ">
                  <div>Recording Stream</div>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={defaultStreamType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Recording Stream</SelectLabel>
                          <SelectItem value="MajorStream">
                            Major Stream
                          </SelectItem>
                          <SelectItem value="MinorStream">
                            Minor Stream
                          </SelectItem>
                          <SelectItem value="MJPGStream">
                            MJPG Stream
                          </SelectItem>
                          <SelectItem value="JpegSnap">Jpeg Snap</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 w-full ">
                  <div>Camera Type</div>
                  <div>
                    <Select
                      value={selectedCameraType}
                      onChange={(e) => setSelectedCameraType(e.target.value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Camera Type">
                          {selectedCameraType}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Camera Type</SelectLabel>
                          {cameraTypeOptions.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 w-full ">
                  <div>Lane Number</div>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="LaneNumber" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lane Number</SelectLabel>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 w-full ">
                  <Label for="username"> Username </Label>
                  <Input
                    id="username"
                    name="username"
                    className="py-2 h-[40px]"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="mt-4 w-full ">
                  <Label for="username"> Password </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="py-2 h-[40px]"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="mt-4 w-full text-right">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CameraSearch
