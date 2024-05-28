"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useForm } from "react-hook-form"
import { resetLoginPassword } from "@/lib/api"
import { HLBHelvetica } from "@/lib/fonts"
import { Button } from "@/components/ui/button"
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
import { Loginscreen } from "@/components/login-screen"

export default function IndexPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState()
  const [successmsg, setsuccessmsg] = useState("")
  const [errormsg, seterrormsg] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [btnstring, setbtnstring] = useState("Copy to Clipboard")
  let brandClass = `${HLBHelvetica.className} mx-auto w-80 text-center text-2xl font-semibold text-primary`
  const onSubmit = async (data) => {
    let storedArray = localStorage.getItem("reset-password-user-info")
    storedArray = storedArray.split(",")
    if (storedArray) {
      const userid = storedArray[0]
      const sequrityAnswer1 = storedArray[1]
      const sequrityAnswer2 = storedArray[2]
      const email = data.email
      const phone = data.phone
      let formData = {
        id: userid,
        mailId: email,
        mobile: phone,
        sequrityAnswer1: sequrityAnswer1,
        sequrityAnswer2: sequrityAnswer2,
      }
      const response = await resetLoginPassword(formData)
      if (response.status == 200) {
        setOpen(true)
        setPassword(response.data.message)
        setbtnstring("Copy to Clipboard")
        let newMsg = "New password is : " + response.data.message
        setsuccessmsg(newMsg)
        setIsButtonDisabled(true)
        seterrormsg("")
      } else {
        seterrormsg(response.response.data.message)
        setPassword("")
        setsuccessmsg("")
      }
    }
  }
  // const unsecuredCopyToClipboard = (text) => {
  //   const textArea = document.createElement("textarea")
  //   textArea.value = text
  //   document.body.appendChild(textArea)
  //   textArea.focus()
  //   textArea.select()
  //   try {
  //     document.execCommand("copy")
  //   } catch (err) {
  //     console.error("Unable to copy to clipboard", err)
  //   }
  //   document.body.removeChild(textArea)
  // }

  // const copyToClipboard = async () => {
  //   // try {
  //   //   await navigator.clipboard.writeText(password)
  //   //   setbtnstring("Copied")
  //   // } catch (error) {
  //   //   console.error("Failed to copy text:", error)
  //   // }
  //   if (window.isSecureContext && navigator.clipboard) {
  //     await navigator.clipboard.writeText(password);
  //     setbtnstring("Copied")
  //   } else {
  //     unsecuredCopyToClipboard(password);
  //   }
  // }

  const handleCopyClipboard = () => {
    setbtnstring("Copied")
  }
  return (
    <div className="flex min-h-screen w-full">
      <Loginscreen />
      <div className="w-full md:w-1/2 lg:py-16 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-32 bg-white">
        <div className="w-full flex justify-center">
          <Image src="/images/logo.svg" width="80" height="80" />
        </div>
        <p className={brandClass}>Traffic Management System</p>
        <p className="w-full text-center text-[12px] font-normal text-[#9F9F9F]">
          V2.3.4
        </p>
        <div className="pt-20">
          <p className="font-semibold text-2xl">Reset your password</p>
          <div className="flex w-full items-center justify-start p-2 mt-4 rounded">
            <p className="text-md text-red-500">{errormsg}</p>
          </div>
          <form
            className="flex flex-col gap-2 mt-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid w-full max-full items-center gap-1.5">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", { required: "Enter your email" })}
              />
              <p className="text-sm text-red-600 h-5">
                {errors.email?.message}
              </p>
            </div>
            <div className="grid w-full max-full items-center gap-1.5">
              <Label htmlFor="phone" className="text-base">
                Phone
              </Label>
              <Input
                type="text"
                id="phone"
                placeholder="Enter your Phone number"
                {...register("phone", { required: "Enter Phone number" })}
                // onChange={handleChange}
              />
              <p className="text-sm text-red-600 h-5 inline">
                {errors.phone?.message}
                {/* {errormsg} */}
              </p>
              {/* <p className="errormsg text-sm text-red-600 h-5 inline"></p> */}
            </div>
            <div>
              <Button className="w-full" disabled={isButtonDisabled}>
                Reset Password
              </Button>
            </div>
            <div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
        <div className="mt-20 flex flex-row items-center justify-end gap-1">
          <Image
            src="/vectors/ic_outline-copyright.svg"
            width="24"
            height="24"
            alt="logo"
          />
          <p className="text-[12px] font-normal text-[#9F9F9F]">
            Copyrights 2022
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>{successmsg}</DialogTitle> */}
            <DialogDescription className="text-lg">
              {successmsg}
              <br />
              <div className="flex items-center justify-between">
                {/* <Button
                  variant={"outline"}
                  className="h-6 mt-2"
                  onClick={copyToClipboard}
                >
                  {btnstring}
                </Button> */}
                <CopyToClipboard text={password}>
                  <Button onClick={handleCopyClipboard}>{btnstring}</Button>
                </CopyToClipboard>
                <Link href="/login" className="text-[15px] text-primary">
                  Login
                </Link>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
