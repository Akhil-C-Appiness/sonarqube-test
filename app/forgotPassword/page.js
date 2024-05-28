"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { getAllEvents, userLogin } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loginscreen } from "@/components/login-screen"
import { HLBHelvetica } from "@/lib/fonts"


export default function IndexPage() {
  let brandClass = `${HLBHelvetica.className} mx-auto w-80 text-center text-2xl font-semibold text-primary`
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [errormsg, seterrormsg] = useState("")
  const onSubmit = async (data) => {
    router.push("/forgot-password/" + data.username)
  }
  const handleChangeUser = (event) => {
    seterrormsg("")
    // setUserName(event.target.value)
  }
  return (
    <div className="flex min-h-screen w-full">
      <Loginscreen />
      <div className="w-full md:w-1/2 lg:py-16 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-32 bg-white">
        <div className="w-full flex justify-center">
          <Image src="/images/logo.svg" width="80" height="80" />
        </div>
        <p className={brandClass}>
           Traffic Management System
        </p>
        <p className="w-full text-center text-[12px] font-normal text-[#9F9F9F]">V2.3.4</p>
        <div className="pt-20">
          <p className="font-semibold text-2xl">Forgot Password.</p>
          <form
            className="flex flex-col gap-2 mt-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid w-full max-full items-center gap-1.5">
              <Label htmlFor="username" className="text-base">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                onChange={handleChangeUser}
              />
              <p className="text-sm text-red-600 h-5">
                {errors.username?.message}
              </p>
            </div>
            <div className="flex">
              <div className="w-full text-right text-primary mb-2">
                <Link href="/login">Login</Link>
              </div>
            </div>
            <div>
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
