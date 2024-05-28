"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { usePathname } from "next/navigation"

import { getAllEvents, getHeartBeat, userLogin } from "@/lib/api"
import { HLBHelvetica } from "@/lib/fonts"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loginscreen } from "@/components/login-screen"

export default function IndexPage() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()
  // getAllEvents();
  const [errormsg, seterrormsg] = useState("")
  const [username, setUserName] = useState("")
  const [hasClassName, setHasClassName] = useState(false)

  const checkLoginStatus = async () => {
    try {
      await getHeartBeat()
      router.push("/dashboard")
    } catch (err) {
      console.log(err)
      if(pathname!=='/login'){
        router.push('/login')
      }
    }
  }
  useEffect(() => {
    checkLoginStatus()
  }, [])
  const onSubmit = async (data) => {
    setHasClassName(false)
    const userdata = await userLogin(data)
    if (userdata.status == 2002) {
      router.push("/dashboard/today")
    } else {
      seterrormsg(userdata.message)
    }
  }
  const handleChange = (event) => {
    setValue(event.target.name, event.target.value)
    seterrormsg("")
  }
  const handleChangeUser = (event) => {
    seterrormsg("")
    setUserName(event.target.value)
    setValue("username", event.target.value)
  }
  let brandClass = `${HLBHelvetica.className} mx-auto w-80 text-center text-3xl font-semibold text-primary`
  return (
    <div className="flex min-h-screen w-full">
      <Loginscreen />
      <div className="pr- w-full bg-white px-6 sm:px-10 md:w-1/2 md:px-14 lg:px-20 lg:py-8 xl:px-32">
        <div className="flex w-full justify-center">
          <Image src="/images/logo.svg" width="200" height="100" alt="logo" />
        </div>
        <p className={brandClass}> Traffic Management System</p>
        <p className="w-full text-center text-[12px] font-normal text-[#9F9F9F]">
          V2.3.4
        </p>
        <div className="pt-10">
          <p className="text-2xl font-semibold">Login to your account.</p>
          <form
            className="mt-6 flex w-full flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="max-full grid w-full items-center gap-1.5">
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
              <p className="h-5 text-sm text-red-600">
                {errors.username?.message}
              </p>
            </div>
            <div className="max-full grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <Input
                type="Password"
                id="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                onChange={handleChange}
              />
              <p
                className={
                  hasClassName
                    ? "errorpassword hidden h-5 text-sm text-red-600"
                    : "errorpassword h-5 text-sm text-red-600"
                }
              >
                {errors.password?.message}
                {errormsg}
              </p>
            </div>
            <div className="flex">
              <div className="w-1/2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="pl-2 text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <div className="w-1/2 text-right text-primary">
                <Link href="/forgotPassword">Forgot Password</Link>
                {/* <Button variant="link" onClick={forgotPassword}>Forgot Password</Button> */}
              </div>
            </div>
            <div>
              <Button className="w-full" type="submit">
                Login
              </Button>
            </div>
          </form>
        </div>
        <div className="relative  mt-32 flex flex-row items-center justify-end gap-1">
          <Image
            src="/vectors/ic_outline-copyright.svg"
            width="24"
            height="24"
            alt="logo"
          />
          <p className="text-[12px] font-normal text-[#9F9F9F]">
            Copyrights 2023
          </p>
        </div>
      </div>
    </div>
  )
}
