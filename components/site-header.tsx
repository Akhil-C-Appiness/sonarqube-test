"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import useStore from "@/store/store"
import { AxiosError } from "axios"

import { siteConfig } from "@/config/site"
import { getAllJunctionStatus, getHeartBeat } from "@/lib/api"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import EventDetailsPopup from "@/components/eventDetailsPopup"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { SettingSwt } from "@/components/settings-switch"
import { ThemeToggle } from "@/components/theme-toggle"

import { SideBar } from "./side-bar"

export function SiteHeader() {
  const setSiteStatusList = useStore((state) => state.setSiteStatusList)
  const siteStatusList = useStore((state) => state.siteStatusList)
  const siteStatusobj = siteStatusList[0]
  const router = useRouter()
  // console.log("siteStatusList",siteStatusList)
  let junctionbg = ""
  let camerabg = ""
  let vmsbg = ""
  let dbbg = ""
  if (
    siteStatusobj &&
    siteStatusobj.totalVmsStorage === siteStatusobj.inactiveVmsStorage
  ) {
    vmsbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#D73D2A]"
  } else if (siteStatusobj && siteStatusobj.inactiveVmsStorage === 0) {
    vmsbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#27AA8C]"
  } else {
    vmsbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#F6BA37]"
  }
  if (
    siteStatusobj &&
    siteStatusobj.totalMediaServer === siteStatusobj.problemeticMediaServer
  ) {
    junctionbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#D73D2A]"
  } else if (siteStatusobj && siteStatusobj.problemeticMediaServer === 0) {
    junctionbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#27AA8C]"
  } else {
    junctionbg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#F6BA37]"
  }
  if (
    siteStatusobj &&
    siteStatusobj.totalCamera === siteStatusobj.inactiveCamera
  ) {
    camerabg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#D73D2A]"
  } else if (siteStatusobj && siteStatusobj.inactiveCamera === 0) {
    camerabg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#27AA8C]"
  } else {
    camerabg = "inline-block h-[10px] w-[10px] rounded-[50%] bg-[#F6BA37]"
  }
  const pathname = usePathname()
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const stayLoggedIn = async () => {
    try {
      await getHeartBeat()
      localStorage.setItem("heartrateErrors", "0")
    } catch (err) {
      console.log(err)
      const excludePaths = [
        "/login",
        "/forgotPassword",
        "/reset-password",
        "/forgot-password",
      ]
      const heartrateErrors = localStorage.getItem("heartrateErrors")
      localStorage.setItem(
        "heartrateErrors",
        String(Number(heartrateErrors) + 1)
      )
      if (
        heartrateErrors &&
        Number(heartrateErrors) > 3 &&
        !excludePaths.includes(pathname)
      ) {
        router.push("/login")
      }
      //   let password = !pathname.includes("forgot-password");
      //   if(pathname!=='/login' && pathname!=='/forgotPassword' && pathname !== "/reset-password" && !password)
      //   //  && !pathname.includes("forgot-password") "
      //   {
      //     router.push('/login')
      //   if (err instanceof AxiosError) {
      //     const statusCode = err.response?.status;
      //     console.log(statusCode, 'statusCode')
      //     const heartrateErrors = localStorage.getItem('heartrateErrors');
      //       if (heartrateErrors) {
      //         localStorage.setItem('heartrateErrors', String(Number(heartrateErrors) + 1));
      //       }
      //       else {
      //         localStorage.setItem('heartrateErrors', '1');
      //       }
      //     if (statusCode === 401 && pathname !== '/login' && Number(heartrateErrors)>3) {
      //       router.push('/login');
      //     }
      //   }

      // }
    }
  }
  useEffect(() => {
    stayLoggedIn()
    const interval = setInterval(() => {
      stayLoggedIn()
    }, 30000)
    setIntervalId(interval)
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])
  useEffect(() => {
    let isloggedin = localStorage.getItem("isloggedin")
    if (isloggedin !== null) {
      if (JSON.parse(isloggedin)) {
        setSiteStatusList()
      }
    } else {
      if (pathname === "/login" && intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {pathname !== "/login" &&
        !pathname.includes("forgot-password") &&
        pathname !== "/forgotPassword" &&
        pathname !== "/reset-password" && (
          <div className=" h-20 flex items-center space-x-4 sm:justify-between sm:space-x-0">
            <MainNav items={siteConfig.mainNav} />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Popover>
                <PopoverTrigger className="flex flex-row items-center gap-1 p-2 text-sm font-medium text-[#2A94E5]">
                  Status{" "}
                  <i className="mb-1 inline-block origin-center rotate-45 border border-b-[2px] border-l-0 border-r-[2px] border-t-0 border-[#2A94E5] p-[4px]"></i>
                </PopoverTrigger>
                <PopoverContent className="p-2">
                  <Button
                    variant="ghost"
                    className="flex w-full flex-row items-center justify-start gap-2"
                  >
                    <span className="inline-block h-[10px] w-[10px] rounded-[50%] bg-[#27AA8C]"></span>
                    <span className="text-[#6F6F70]">Database (1/ 1)</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex w-full flex-row items-center justify-start gap-2"
                  >
                    <span className={vmsbg}></span>
                    <span className="text-[#6F6F70]">
                      VMS Storage (
                      {siteStatusobj
                        ? siteStatusobj.totalVmsStorage -
                          siteStatusobj.inactiveVmsStorage
                        : ""}{" "}
                      / {siteStatusobj ? siteStatusobj.totalVmsStorage : ""})
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex w-full flex-row items-center justify-start gap-2"
                  >
                    <span className={camerabg}></span>
                    <span className="text-[#6F6F70]">
                      Camera (
                      {siteStatusobj
                        ? siteStatusobj.totalCamera -
                          siteStatusobj.inactiveCamera
                        : ""}{" "}
                      / {siteStatusobj ? siteStatusobj.totalCamera : ""})
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex w-full flex-row items-center justify-start gap-2"
                  >
                    <span className={junctionbg}></span>
                    <span className="text-[#6F6F70]">
                      Junction Server (
                      {siteStatusobj
                        ? siteStatusobj.totalMediaServer -
                          siteStatusobj.problemeticMediaServer
                        : ""}{" "}
                      / {siteStatusobj ? siteStatusobj.totalMediaServer : ""})
                    </span>
                  </Button>
                  <Link
                    className="mt-4 flex w-full flex-row items-center justify-end text-sm"
                    href="/status"
                  >
                    <span className="">View Status Display</span>
                  </Link>
                </PopoverContent>
              </Popover>
              {/* <button className="relative flex gap-1 text-sm font-medium text-[#2A94E5] underline underline-offset-4">
                  <Image
                    src="/images/Notification.svg"
                    alt="notification"
                    width="15"
                    height="10"
                    className="mt-1"
                  />
                  Alerts
                </button> */}
              <SettingSwt />
              {/* <nav className="ml-[10em] flex items-center space-x-1">
                
              </nav> */}
            </div>
          </div>
        )}
      <EventDetailsPopup />
    </header>
  )
}
