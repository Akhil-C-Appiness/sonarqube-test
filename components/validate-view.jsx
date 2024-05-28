"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import useStore from "@/store/store"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { set } from "date-fns/esm"

import {
  getAllEventRecords,
  getFileContent,
  getValidation,
  getViolationsToDisplay,
  isValidEventButton,
  updateValidation,
} from "@/lib/api"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import ImageWithMagnifier from "@/components/imageMag"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Popover, PopoverContent } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const ValidateView = ({ onRequestClose, props, uncheckedUpdated, setUncheckedUpdated, onStateChange }) => {
  const [currentPage, setCurrentPage] = useState(4)
  const [eventImg, setEventImg] = useState("")
  const acknowledge = props?.details?.acknowledge
    ? props?.details?.acknowledge
    : props?.acknowledge
    ? props?.acknowledge
    : 0
  const vehicleNo = props?.details?.vehicleNo
    ? props?.details?.vehicleNo
    : props?.objectId
    ? props?.objectId
    : ""
  const action = props?.eventObj?.action
    ? props?.eventObj?.action
    : props?.action
    ? props?.action
    : ""
  const [updateUnChecked, setUpdateUnChecked] = useState(acknowledge)
  const [updateSporious, setUpdateSporious] = useState(acknowledge)
  const [vehicleNumber, setVehicleNumber] = useState(vehicleNo)
  const [selectedCategories, setSelectedCategories] = useState([])

  const [validBtnClicked, setValidBtnClicked] = useState(false)
  const [updateValidEvent, setUpdatedValidEvent] = useState(
    props?.details ? props?.details : props
  )
  const [spuriousMessage, setSpuriousMessage] = useState(action)
  const [toggleUncheckedDialog, setToggleUncheckedDialog] = useState(false)
  const [toggleSpuriousDialog, setToggleSpuriousDialog] = useState(false)
  const [analytics1, setAnalytics1] = useState([])
  const [analytics2, setAnalytics2] = useState([])
  const [uncheckedBtnClicked, setUncheckedBtnClicked] = useState(false)
  const [spuriousBtnClicked, setSpuriousBtnClicked] = useState(false)
  const setViolations = useStore((state) => state.setViolations)
  const violations = useStore((state) => state.violations)
  const violationEventType = props?.details?.eventType
    ? [props.details.eventType]
    : props?.eventType
    ? [props.eventType]
    : []
  const [selectedViolations, setSelectedViolations] =
    useState(violationEventType)
  useEffect(() => {
    const fetchValidEventButtonState = async () => {
      const response = await isValidEventButton()
      setAnalytics1(response)
      const response1 = await getViolationsToDisplay()
      setAnalytics2(response1)
    }
    fetchValidEventButtonState()
  }, [])
  useEffect(() => {
    const getEventImg = async () => {
      let eventData = props.eventSrc
      let eventobj = {
        filepath: eventData,
      }
      const response = await getFileContent(eventobj)
      let base64String = "data:image/png;base64," + response
      props.eventSrc = base64String
      console.log("imgsrc - ", props)
    }
    getEventImg()
  }, [])
  const handleVehicleNumberChange = (event) => {
    setVehicleNumber(event.target.value)
  }
  const handleSpuriousMessage = (event) => {
    setSpuriousMessage(event.target.value)
  }
  const { toast } = useToast()
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value
    const isSelected = selectedCategories.includes(selectedCategory)

    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== selectedCategory)
      )
    } else {
      setSelectedCategories([...selectedCategories, selectedCategory])
    }
  }
  let maxPages = 4
  let items = []
  let leftSide = currentPage - 2
  if (leftSide <= 0) {
    leftSide = 1
  }
  let rightSide = currentPage + 2
  if (rightSide > maxPages) {
    rightSide = maxPages
  }
  for (let number = leftSide; number <= rightSide; number++) {
    items.push(
      <div
        key={number}
        className={
          number === currentPage ? "round-effect active" : "round-effect"
        }
        onClick={() => {
          setCurrentPage(number)
        }}
      >
        {number}
      </div>
    )
  }
  const nextPage = () => {
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  useEffect(() => {
    setViolations()
  }, [setViolations])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        onRequestClose()
      }
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = "visible"
      document.removeEventListener("keydown", onKeyDown)
    }
  })
  const id = props?.details?.id ? props?.details?.id : props.id
  const msId = props?.details?.msId ? props?.details?.msId : props.msId
  const vehicleclass = props?.details?.vehicleclass
    ? props?.details?.vehicleclass
    : props.vehicleclass
  const lpSignature = props?.details?.lpSignature
    ? props?.details?.lpSignature
    : props.lpSignature
  const acknowledgeUser = props?.details?.acknowledgeUser
    ? props?.details?.acknowledgeUser
    : props.acknowledgeUser
  const modifiedobjectId = props?.details?.modifiedobjectId
    ? props?.details?.modifiedobjectId
    : props.modifiedobjectId
  const eventType = props?.details?.eventType
    ? props?.details?.eventType
    : props.eventType
  const acknowledgedTime = props?.details?.acknowledgedTime
    ? props?.details?.acknowledgedTime
    : props.acknowledgedTime
  const newUncheckedValue = async () => {
    const payload = {
      id: id,
      msId: msId,
      acknowledge: 0,
      vehicleClass: vehicleclass,
      lpSignature: lpSignature,
      acknowledgeUser: acknowledgeUser,
      action: action,
      modifiedobjectId: modifiedobjectId,
      eventType: eventType,
      acknowledgedTime: acknowledgedTime,
    }
    const getDataValidation = async (payload) => {
      const validaion = await getValidation(payload)
    }
    await getDataValidation(payload)
    // console.log("check", payload)
    setUpdateUnChecked(0)
    onRequestClose()
  }
  const handleUncheckedDialog = () => {
    // setToggleUncheckedDialog(!toggleUncheckedDialog)
    setUncheckedBtnClicked(!uncheckedBtnClicked)
  }
  const handleSpuriousDialog = () => {
    // setToggleSpuriousDialog(!toggleSpuriousDialog)
    setSpuriousBtnClicked(!spuriousBtnClicked)
  }
  const handleSporiousValue = async () => {
    const eventObjPayload = props?.eventObj ? props?.eventObj : props
    const payload = {
      ...eventObjPayload,
      acknowledge: 2,
      acknowledgeUser: JSON.parse(localStorage.getItem("user-info")).id,
      action: spuriousMessage,
    }
    const getDataValidation = async (payload) => {
      const validaion = await getValidation(payload)
    }
    await getDataValidation(payload)
    // console.log("check", payload)
    setUpdateSporious(2)
    onRequestClose()
    toast({
      variant: "success",
      description: "Event Marked as Spurious Successfully",
      duration: 3000,
    })
    props.handleClose()
    props.handleDateFilter()
    setToggleSpuriousDialog(false)
  }

  const handleValidBtn = () => {
    setValidBtnClicked(!validBtnClicked)
    setUncheckedBtnClicked(false)
    setSpuriousBtnClicked(false)
  }
  const handleEventValidation = (e, alerttype) => {
    if (e.target.checked) {
      setSelectedViolations((prev) => [...prev, alerttype])
      setUncheckedUpdated(true);
    } else {
      setSelectedViolations((prev) => prev.filter((item) => item !== alerttype))
      setUncheckedUpdated(false);
    }
  }
  // console.log(props.eventObj)
  const validateEvent = async (e) => {
    e.preventDefault()
    if (!selectedViolations.length) {
      toast({
        variant: "destructive",
        description: "Please select atleast one violation",
        duration: 3000,
      })
      return
    }
    const getUserId = JSON.parse(localStorage.getItem("user-info")).id
    const eventObjPayload = props?.eventObj ? props?.eventObj : props
    const payload = {
      ...eventObjPayload,
      acknowledge: 1,
      acknowledgeUser: getUserId,
      modifiedobjectId: vehicleNumber,
    }
    const evidenceUrl =
      eventObjPayload.snapUrls.length > 1
        ? eventObjPayload.snapUrls[1]
        : eventObjPayload.snapUrls[0]
    const createEventTypes = selectedViolations
      .filter((item) => item !== 1)
      .map((item, index) => ({
        [`eventType${index + 1}`]: item,
      }))
    let updateValidationPayload = {
      channelID: eventObjPayload.channelId,
      objectID: eventObjPayload.objectId,
      modifiedObjectID: vehicleNumber,
      rlvdTime: eventObjPayload.startTime,
      location: eventObjPayload.junctionName,
      snapUrl: eventObjPayload.snapUrls[0],
      evidenceSnapUrl: evidenceUrl,
      eventId: eventObjPayload.id,
      msId: eventObjPayload.msId,
      vehicleColor: eventObjPayload.objectProperty1,
      vehicleClass: eventObjPayload.objectProperty2,
      speedLimit: eventObjPayload.objectProperty3,
      speedDetected: eventObjPayload.objectProperty4,
      acknowledgeUser: getUserId,
    }
    createEventTypes.forEach((obj) => {
      updateValidationPayload = { ...updateValidationPayload, ...obj }
    })

    const getDataValidation = async (payload) => {
      getValidation(payload)
      const eventType = props?.eventObj?.eventType
        ? props?.eventObj?.eventType
        : props.eventType
      const enableValidEventButton = analytics1.some(
        (obj) => obj.alerttype === eventType
      )
      if (enableValidEventButton) {
        updateValidation(updateValidationPayload)
      }
    }
    await getDataValidation(payload)
    setUpdatedValidEvent(1)
    toast({
      variant: "success",
      description: "Event Validated Successfully",
      duration: 3000,
    })
    // getAllEventRecords(props.eventObjPayload)
    props.handleClose()
    props.handleDateFilter()
    setValidBtnClicked(false)
  }
  const handleUncheckedClick = async () => {
    const eventObjPayload = props?.eventObj ? props?.eventObj : props
    const payload = {
      ...eventObjPayload,
      acknowledge: 0,
      acknowledgeUser: JSON.parse(localStorage.getItem("user-info")).id,
    }
    await getValidation(payload)
    setUpdateUnChecked(0)
    toast({
      variant: "success",
      description: "Event marked as Unchecked Successfully",
      duration: 3000,
    })
    onRequestClose()
    props.handleClose()
    props.handleDateFilter()
    // handleUncheckedDialog()
  }

  const enableValidEventButton = analytics1.some(
    (obj) => obj.alerttype === eventType
  )
  const convertToVehicleType = (vehicleType) => {
    switch (vehicleType) {
      case 0:
        return "Motorbike"
        break
      case 1:
        return "Auto"
        break
      case 2:
        return "Car"
        break
      case 3:
        return "Carrier"
        break
      case 4:
        return "Bus"
        break
      case 5:
        return "Lorry"
        break
      case 6:
        return "Maxicab"
        break
      case 7:
        return "Jeep"
        break
      case 8:
        return "Electric Scooter"
        break
      case 9:
        return "Electric Car"
      default:
        break
    }
  }
  // console.log(props)
  return (
    <div
    // className="fixed inset-0 flex items-center justify-center border-2 bg-[#0F0F10] bg-opacity-10 backdrop-blur-[1px]"
    >
      <Toaster />
      <div
      >
        <div
        >
          <form className="w-full" onSubmit={validateEvent}>
            <div className="flex  justify-between px-2 py-1">
              <div className="w-full">
                {validBtnClicked ? (
                  <div className="mt-4 flex items-center gap-2">
                  </div>
                ) : null}
              </div>
              <div className="blocked">
              <Tabs defaultValue="validateEvent" className="w-[500px] bg-[#EFF4FD] rounded-md">
    <TabsList className="grid grid-cols-2 bg-[#EFF4FD] w-[500px]">
      <TabsTrigger value="validateEvent" className="text-sm h-10" style={{ padding: '0' }}>
        <Input type="radio" className="w-10"/>
        Validate Event
      </TabsTrigger>
      <TabsTrigger value="spuriousEvent" className="text-sm h-10" style={{ padding: '0' }}>
        <Input type="radio" className="w-10"/>
        Spurious Event
      </TabsTrigger>
    </TabsList>
                      <TabsContent
                        value="validateEvent"
                        onClick={handleValidBtn}
                      >
                        <div className="flex flex-wrap w-[500px] bg-[#F2F8FF] h-[120px] overflow-y-scroll	">
                          {violations.map((violation) => (
                            <div
                              key={violation.alerttype}
                              className="w-[33.33%] px-1"
                            >
                              <label 
                              className="p-1 flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                              "
                              >
                                <input
                                  type="checkbox"
                                  value={violation.alerttype}
                                  checked={selectedViolations.includes(
                                    violation.alerttype
                                  )}
                                  onChange={(e) => {
                                    handleEventValidation(
                                      e,
                                      violation.alerttype
                                    )
                                  }}
                                />
                                <span className="ml-2 text-xs">
                                  {violation.alertname}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>

                      </TabsContent>
                      <TabsContent
                        value="spuriousEvent"
                        className={
                          acknowledge === 2
                            ? "rounded-full bg-[#2A94E5] text-xs text-white"
                            : "whitespace-nowrap  bg-[#F2F8FF] text-xs"
                        }
                        onClick={handleSpuriousDialog}
                      >
                        <div className="w-[500px] bg-[#F2F8FF]">
                          <label className="m-2 cursor-pointer">
                            <input
                              className="peer sr-only"
                              type="radio"
                              name="status"
                            />
                            {updateSporious === 2 ? (
                              <span className="flex items-center justify-center">
                                Already marked as Spurious
                                <Image
                                  src="/images/Group 1000002710.svg"
                                  alt="icon"
                                  width={24}
                                  height={24}
                                />
                              </span>
                            ) : (
                              <div className="flex flex-col items-center justify-between gap-2">
                                <Textarea
                                  placeholder="Enter your spurious reason"
                                  className="resize-none w-[200px]"
                                  value={spuriousMessage}
                                  onChange={(e) => handleSpuriousMessage(e)}
                                />
                                <Button
                                  onClick={handleSporiousValue}
                                  className="w-36"
                                  size="sm"
                                >
                                  Mark as Spurious
                                </Button>
                              </div>
                            )}
                          </label>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* <label className="m-2 cursor-pointer">
                        <input
                          className="peer sr-only"
                          type="radio"
                          name="status"
                        />
                        <Dialog
                          open={toggleUncheckedDialog}
                          onOpenChange={handleUncheckedDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className={
                                acknowledge === 0
                                  ? "rounded-full bg-[#2A94E5] text-white"
                                  : "whitespace-nowrap rounded-full bg-[#F2F8FF] text-xs"
                              }
                              onClick={() =>
                                setUncheckedBtnClicked(!uncheckedBtnClicked)
                              }
                            >
                              Unchecked
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              {updateUnChecked === 0 && (
                                <DialogTitle>Unchecked</DialogTitle>
                              )}
                              <DialogDescription>
                                {updateUnChecked === 0 ? (
                                  "Already marked as Unchecked"
                                ) : (
                                  <Button onClick={handleUncheckedClick}>
                                    Mark as Unchecked
                                  </Button>
                                )}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </label> */}
                  {/* </div> */}
                {/* </div> */}
                {/* {enableValidEventButton && validBtnClicked && (
                    <div>
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {violations.map((violation) => {
                          return (
                            <div className="px-1">
                              <label className="p-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <input
                                  type="checkbox"
                                  value={violation.alerttype}
                                  checked={selectedViolations.includes(
                                    violation.alerttype
                                  )}
                                  onChange={(e) => {
                                    handleEventValidation(
                                      e,
                                      violation.alerttype
                                    )
                                  }}
                                  // checked={
                                  //   selectedViolations.indexOf(
                                  //     violation.alerttype
                                  //   ) > -1
                                  // }
                                  // onChange={(e) => {
                                  //   const sViolations = [...selectedViolations]
                                  //   if (
                                  //     sViolations.includes(violation.alerttype)
                                  //   ) {
                                  //     const index = sViolations.indexOf(
                                  //       violation.alerttype
                                  //     )
                                  //     if (index > -1) {
                                  //       sViolations.splice(index, 1)
                                  //       setSelectedViolations(sViolations)
                                  //     }
                                  //   } else {
                                  //     sViolations.push(violation.alerttype)
                                  //     setSelectedViolations(sViolations)
                                  //   }
                                  // }}
                                />
                                <span className="ml-2 text-xs">
                                  {violation.alertname}
                                </span>
                              </label>
                            </div>
                          )
                        })}

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size={"sm"}
                            type="button"
                            onClick={() => setValidBtnClicked(false)}
                            className="border-[#2A94E5] px-4 text-[#2A94E5]"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size={"sm"} className="px-6">
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  )} */}
                <div className="flex pt-4 pb-0 items-between gap-4">
                  <Button
                    variant="outline"
                    size={"sm"}
                    type="button"
                    onClick={() => setValidBtnClicked(false)}
                    className="border-[#2A94E5] px-4 text-[#2A94E5]"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size={"sm"} className="px-6">
                    Save
                  </Button>
                </div>
                {acknowledge === 2 && (
                  <div className="mt-[1em] flex justify-center font-semibold text-[#0F0F10]">
                    Message:{" "}
                    {props?.eventObj?.action
                      ? props?.eventObj?.action
                      : props.action}
                  </div>
                )}
                {/* {acknowledge === 0 && (
                    <div className="mt-[1em] flex justify-center font-semibold text-[#0F0F10]">
                      This Event is Marked as Unchecked
                    </div>
                  )} */}
              </div>
            </div>
          </form>
          {/* <div className="flex gap-6 px-2 py-[10px]">
              <AspectRatio ratio={16 / 9} className="w-[100%] bg-muted">
                <div className="relative top-[40%] flex  items-center justify-center">
                  <Image
                    src="/images/CameraIcon.svg"
                    alt="Img"
                    height={40}
                    width={40}
                  />
                </div>
              </AspectRatio>
              <div className="relative right-2 flex w-[15%] flex-col justify-center gap-2">
                <AspectRatio ratio={1 / 1} className="bg-muted">
                  <div className="relative top-[40%] flex  items-center justify-center">
                    <Image
                      src="/images/CameraIcon.svg"
                      alt="Img"
                      height={24}
                      width={24}
                    />
                  </div>
                </AspectRatio>
                <AspectRatio ratio={1 / 1} className="bg-muted">
                  <div className="relative top-[40%] flex  items-center justify-center">
                    <Image
                      src="/images/CameraIcon.svg"
                      alt="Img"
                      height={24}
                      width={24}
                    />
                  </div>
                </AspectRatio>

                <AspectRatio ratio={1 / 1} className="bg-muted">
                  <div className="relative top-[40%] flex  items-center justify-center">
                    <Image
                      src="/images/CameraIcon.svg"
                      alt="Img"
                      height={24}
                      width={24}
                    />
                  </div>
                </AspectRatio>
                <AspectRatio ratio={1 / 1} className="bg-muted">
                  <div className="relative top-[40%] flex  items-center justify-center">
                    <Image
                      src="/images/CameraIcon.svg"
                      alt="Img"
                      height={24}
                      width={24}
                    />
                  </div>
                </AspectRatio>
                <AspectRatio ratio={1 / 1} className="bg-muted">
                  <div className="relative top-[40%] flex  items-center justify-center">
                    <Image
                      src="/images/CameraIcon.svg"
                      alt="Img"
                      height={24}
                      width={24}
                    />
                  </div>
                </AspectRatio>
              </div>
            </div> */}

          {/* <div className="paginate-ctn flex justify-center p-2">
              <Button onClick={prevPage}>
                <Image
                  src="/images/LeftArrow.svg"
                  alt="left"
                  width="10"
                  height="10"
                />
              </Button>
              <Button variant="outline" className="gap-4 border-none">
                {items}
              </Button>
              <Button onClick={nextPage}>
                <Image
                  src="/images/RightArrow.svg"
                  alt="right"
                  width="10"
                  height="10"
                />
              </Button>
            </div> */}
          {/* </ScrollArea> */}
        </div>{" "}
      </div>
    </div>
  )
}
