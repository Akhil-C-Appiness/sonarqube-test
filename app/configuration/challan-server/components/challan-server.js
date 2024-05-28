"use client"
import dynamic from 'next/dynamic';

import React, { useEffect, useState } from "react"
// import Image from "next/image"
import { is } from "date-fns/locale"

import {
  getChallanServerDevice,
  registerChallanServerDevice,
  sendOtp,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const ChallanServer = () => {
  useEffect(() => {
    const fetchChallanServerDetails = async () => {
      const res = await getChallanServerDevice()

      setChallanDetails(res.data?.result[0])
      setDeviceName(res.data?.result[0].challanDeviceName)
      setDeviceOwner(res.data?.result[0].challanDeviceOwner)
      setPhnNum(res.data?.result[0].challanDeviceOwnerPhoneno)
    }
    fetchChallanServerDetails()
  }, [])
  const { toast } = useToast()
  const [challanDetails, setChallanDetails] = useState({})
  const [deviceName, setDeviceName] = useState("")
  const [deviceOwner, setDeviceOwner] = useState("")
  const [phnNum, setPhnNum] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showTick, setShowTick] = useState(false)
  const [userMsg, setUserMsg] = useState("")
  const handlePhoneNumberChange = (val) => {
    console.log(val)
    const numericValue = val.replace(/\D/g, "")
    if (/^\d{10}$/.test(numericValue)) {
      setPhnNum(numericValue)
    }
  }
  const handleOtpChange = async (otp) => {
    // const newOtp = event.target.value
    if (/^\d{0,6}$/.test(otp)) {
      setOtp(otp)
      setShowProgress(true)
      setShowTick(false)

      setTimeout(() => {
        setShowProgress(false)
        setShowTick(true)
        setIsOtpSent(false)
      }, 5000)
    }
  }
  const handleResendOtp = () => {
    setIsOtpSent(false)
  }

  const handleSendOtp = () => {
    setIsOtpSent(true)
  }
  const handleDisabled = () => {
    setIsOtpSent(true)
    setShowTick(true)
  }
  const handleRegister = async () => {
    const payload = {
      challanDeviceName: deviceName,
      challanDeviceOwner: deviceOwner,
      challanDeviceOwnerPhoneno: phnNum,
    }
    const res = await registerChallanServerDevice(payload)
    setUserMsg(res)
    if (res === "Successfully Added") {
      toast({
        variant: "success",
        description: "Device Registered succesfully!",
        duration: 3000,
      })
    } else {
      toast({
        variant: "destructive",
        description: "Device is already Registered!",
        duration: 3000,
      })
    }
  }
  const handleValidateOtp = async () => {
    const res = await sendOtp(otp)
    console.log(res)
    setOtp("")
    setUserMsg("")
    setChallanDetails({})
    setDeviceName("")
    setDeviceOwner("")
    setPhnNum("")

    toast({
      variant: "success",
      description: "OTP Submitted succesfully!",
      duration: 3000,
    })
  }
  const validateOtpBtn = () => {
    if (
      userMsg === "This terminal ID/IMEI/MAC already registered in ICMS!" ||
      ("Successfully Added" && showTick)
    ) {
      return true
    }
  }

  return (
    <div>
      <div className="my-10 flex gap-20 font-medium">
        <div className='flex flex-col gap-2 items-start'>
          <span className="font-medium">Challan Server </span>
          <div className="relative ">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Challan Server" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Event</SelectLabel>
                  <SelectItem value="apple">All</SelectItem>
                  <SelectItem value="banana">Event 1</SelectItem>
                  <SelectItem value="banana">Event 2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium">Challan server IP</h3>
          <div className="relative">
            <Input
              className="font-extrabold h-10"
              value={challanDetails?.challanServerIp}
              disabled={challanDetails?.challanServerIp}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium">ITMS Device ID</h3>
          <div className="relative">
            <Input
              className="w-auto font-extrabold h-10"
              value={challanDetails?.challanItmsDeviceUniqueId}
              disabled={challanDetails?.challanItmsDeviceUniqueId}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-40 font-medium">
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium ">ITMS Device Name</h3>
          <Input
            className="p-2"
            placeholder="ITMS Device Name"
            value={deviceName}
            onChange={(e) => {
              setDeviceName(e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium">ITMS Device Owner</h3>
          <Input
            placeholder="ITMS Server"
            className="p-2 "
            value={deviceOwner}
            onChange={(e) => {
              setDeviceOwner(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex gap-24 py-8 font-medium">
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium">ITMS Device Owner Phone number</h3>
          <div className="flex flex-row gap-4">
            <Input
              placeholder="Enter a valid mobile number"
              className="p-2"
              value={phnNum}
              onChange={(e) => {
                setPhnNum(e.target.value)
              }}
            />
            {/* {isOtpSent ? (
              <Button
                className={`whitespace-nowrap rounded-sm ${
                  isOtpSent ? "bg-gray-400 text-white" : ""
                }`}
                onClick={handleSendOtp}
                disabled={isOtpSent}
              >
                Send OTP
              </Button>
            ) : (
              <Button
                variant="blueoutline"
                className={`whitespace-nowrap rounded-sm ${
                  isOtpSent ? "bg-gray-400 text-white" : ""
                }`}
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            )} */}
          </div>
          {/* {isOtpSent && (
            <div>
              <h6 className="py-2 font-medium text-[#27AA8C]">
                OTP sent successfully.
              </h6>
            </div>
          )} */}
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <h3 className="font-medium">OTP</h3>
          <Input
            placeholder="Enter OTP here"
            className="p-2"
            autocomplete="off"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              handleOtpChange(e.target.value)
            }}
            disabled={userMsg === ""}
          />
          {showProgress && otp.length === 6 && (
            <div className="relative -left-2 -top-8 flex items-center justify-end">
              <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-solid border-blue-500" />
            </div>
          )}
          {showTick && (
            <div className="relative -left-2 -top-8 flex items-center justify-end">
              <Image
                src="/images/Tick.svg"
                width={20}
                height={20}
                alt="verified"
              />
              <div className="absolute right-24 top-10 cursor-pointer py-2 font-medium text-[#27AA8C]">
                OTP verified.
              </div>
            </div>
          )}
          {/* {showTick ? (
            <div className="relative -left-2 -top-8 flex items-center justify-end">
              <Image src="/images/Tick.svg" width={20} height={20} />
              <div className="absolute right-24 top-10 cursor-pointer py-2 font-medium text-[#27AA8C]">
                OTP verified.
              </div>
            </div>
          ) : (
            isOtpSent && (
              <div
                onClick={handleResendOtp}
                className="relative left-[54%] cursor-pointer py-2 font-medium text-[#2A94E5]"
              >
                Resend OTP
              </div>
            )
          )} */}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 flex gap-4 p-6">
        <Button
          onClick={handleRegister}
          disabled={
            userMsg === "This terminal ID/IMEI/MAC already registered in ICMS!"
          }
        >
          Register
        </Button>
        <Button onClick={handleValidateOtp} disabled={!validateOtpBtn()}>
          Submit OTP
        </Button>
        {/* {showTick ? (
          <Button onClick={handleValidateOtp}>Submit OTP</Button>
        ) : (
          <Button
            disabled
            className={`${!showTick ? "bg-gray-400 text-white" : ""}`}
          >
            Submit OTP
          </Button>
        )} */}
      </div>
    </div>
  )
}

export default ChallanServer ;
