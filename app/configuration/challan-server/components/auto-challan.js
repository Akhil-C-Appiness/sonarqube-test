"use client"

import React, { useEffect, useState } from "react"

import {
  getAllAnalytics,
  getChallanAutoPush,
  saveChallanAutoPush,
} from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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

const AutoChallan = ({ setShowAlert, showAlert }) => {
  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await getAllAnalytics()
      setAnalytics(res)
    }
    const fetchChallanAutoPushDetails = async () => {
      const res = await getChallanAutoPush()
      setChallanDetails(res.data?.result[0])
    }
    fetchAnalytics()
  }, [])
  const [analytics, setAnalytics] = useState([])
  const [challanDetails, setChallanDetails] = useState([])
  const [ocr, setOcr] = useState(challanDetails?.ocrConfidence)
  const [IpRange, setIpRange] = useState("")
  const [signature, setSignature] = useState(false)
  const [autopush, setAutopush] = useState(false)
  const [server, setServer] = useState("")
  const [port, setPort] = useState("")
  const [selectedEvents, setSelectedEvents] = useState([])
  const { toast } = useToast()
  const [isValidIp, setIsValidIp] = useState(false)
  const [isValidIpPort, setIsValidIpPort] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  async function handleSaveClick() {
    const payload = {
      eventTypes: selectedEvents,
      ocrConfidence: ocr,
      lpSignature: signature === true ? 0 || -1 : 1,
      serverType: server,
      serverIp: IpRange,
      serverPort: port,
      autoPushEnable: autopush === true ? 1 : 0,
    }
    await saveChallanAutoPush(payload)
    setSignature(false)
    setAutopush(false)
    setAnalytics([])
    setServer("")
    setIpRange("")
    setPort("")
    setOcr("")
    toast({
      variant: "success",
      description: "Changes saved succesfully!",
      duration: 3000,
    })
    // setIsOpen(false)
    // setShowAlert(true)
  }
  const handleEventTypes = (event, value) => {
    if (event) {
      setSelectedEvents([...selectedEvents, value])
    } else {
      const filteredEvents = selectedEvents.filter((item) => item !== value)
      setSelectedEvents(filteredEvents)
    }
  }
  const handleOcr = (val) => {
    if (/^\d*$/.test(val) && val <= 100) {
      setOcr(val)
    }
  }

  const handleIpRange = (val) => {
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    setIsValidIp(ipPattern.test(val))
    setIpRange(val)
  }

  const handleIpPort = (val) => {
    const ipPortPattern =
      /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi
    setIsValidIpPort(ipPortPattern.test(val))
    setPort(val)
  }

  console.log(isValidIp, isValidIpPort)
  console.log(IpRange, port)
  return (
    <div>
      <div className="my-10 flex gap-40 font-medium">
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-medium">Event </h3>
          <div className="relative">
            <Accordion type="single" collapsible>
              <AccordionItem value="item 1">
                <AccordionTrigger>Select Event</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-72">
                    {analytics?.map((item) => (
                      <div
                        className="flex items-center gap-6 pb-4"
                        id={item.alerttype}
                      >
                        <Checkbox
                          onCheckedChange={(e) => {
                            handleEventTypes(e, item.alerttype)
                          }}
                          checked={selectedEvents.includes(item.alerttype)}
                        />
                        <span key={item.alerttype} value={item.alertname}>
                          {item.alertname}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  <SelectGroup>
                    {analytics?.map((item) => (
                      <div className="flex items-center">
                        <Checkbox />
                        <SelectItem key={item.alerttype} value={item.alertname}>
                          {item.alertname}
                        </SelectItem>
                      </div>
                    ))}
                    {/* <SelectItem value="all">All</SelectItem>
                  <SelectItem value="license">
                    License Plate Recognition
                  </SelectItem>
                  <SelectItem value="speed">Over Speed</SelectItem>
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select> */}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-medium">Confidence (0 ~ 100) {`>=`}:</h3>
          <div className="relative">
            <Input
              name=""
              placeholder=""
              className="p-2"
              value={ocr}
              onChange={(e) => handleOcr(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row ">
          <div className="relative py-8">
            <Checkbox
              checked={signature}
              onCheckedChange={(e) => setSignature(e)}
            />{" "}
            Ip Signature
          </div>
        </div>
      </div>
      <div className="flex gap-40 font-medium">
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-medium ">Server</h3>
          <div className="relative">
            <Select value={server} onValueChange={(e) => setServer(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Server" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Server</SelectLabel>
                  <SelectItem value="0">ICMS Videonetics</SelectItem>
                  <SelectItem value="1">API Server Videonetics</SelectItem>
                  <SelectItem value="2">Web Service</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-medium">Server IP Range</h3>
          <input
            placeholder="Ip_Range"
            className="p-2"
            value={IpRange}
            onChange={(e) => {
              handleIpRange(e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-medium">Port</h3>
          <input
            placeholder="Port"
            className="p-2 "
            value={port}
            onChange={(e) => handleIpPort(e.target.value)}
          />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 flex gap-8 p-6">
        <div className="flex py-2">
          <Checkbox
            className="mt-1"
            onCheckedChange={(e) => setAutopush(e)}
            checked={autopush}
          />
          <span className="px-2 font-medium">Auto Push</span>
        </div>
        <Button
          className="px-12 font-semibold"
          onClick={handleSaveClick}
          disabled={!isValidIp || !isValidIpPort}
        >
          Save
        </Button>
        {/* <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogTrigger asChild>
            <Button className="px-12 font-semibold">Save</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Update Configuration</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to update the configuration?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-start gap-4">
              <AlertDialogCancel className="px-14" onClick={onClose}>
                No
              </AlertDialogCancel>
              <AlertDialogAction className="px-14" onClick={handleSaveClick}>
                Save
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
    </div>
  )
}

export default AutoChallan;