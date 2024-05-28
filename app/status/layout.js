"use client"
import StatusSideBar from "@/components/status-sidebar"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getSiteStatus, getAllJunctionStatus, getAllEventReceiverStatus, getAllRecordedClipReceiverStatus, getCentralStorageStatus, getAllEventClipReceiverStatus, getAllLoggedUsersStatus } from "@/lib/api"
import Link from "next/link"

const StatusLayout = ({children}) =>{
  let [siteStatusobj, setsiteStatusobj] = useState()
  let [junctionArray, setjunctionArray] = useState([])
  let [eventAlertArray, seteventAlertArray] = useState([])
  let [recordedClipArray, setrecordedClipArray] = useState([])
  let [storageStatusArray, setstorageStatusArray] = useState([])
  let [eventClipArray, seteventClipArray] = useState([])
  let [userArray, setuserArray] = useState([])
  useEffect(()=>{
    async function siteStatus(){
        const response = await getSiteStatus();
        setsiteStatusobj(response.data.result[0]);
    }
    siteStatus();
    async function allJunctionStatus(){
      const response = await getAllJunctionStatus();
      setjunctionArray(response.data.result);
    }
    allJunctionStatus();
    async function eventStatus(){
      const response = await getAllEventReceiverStatus();
      seteventAlertArray(response.data.result);
    }
    eventStatus();
      async function recordedClipArray(){
      const response = await getAllRecordedClipReceiverStatus();
      setrecordedClipArray(response.data.result);
    }
    recordedClipArray();
      async function centralStorage(){
      const response = await getCentralStorageStatus();
      setstorageStatusArray(response.data.result);
    }
    centralStorage();
    async function eventClipReceiver(){
      const response = await getAllEventClipReceiverStatus();
      seteventClipArray(response.data.result);
    }
    eventClipReceiver();
    async function loggedUsersStatus(){
      const response = await getAllLoggedUsersStatus();
      setuserArray(response.data.result);
    }
    loggedUsersStatus();
  },[])
    // useEffect(()=>{
    //     console.log("junctionArray",junctionArray)
    // },[siteStatusobj, junctionArray])
    return(
        <>
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="flex h-[72px] w-full flex-row items-center justify-between bg-white px-8 py-4">
                <h1 className="text-xl font-semibold text-[#0F0F10]">Status Display</h1>
                <div className="flex items-center">
                  <Link href="/status"><Button variant="default" className="rounded-none">View Status</Button></Link>
                  <Link href="/status-dashboard"><Button variant="outline" className="rounded-none">System Dashboard</Button></Link> 
                </div>
            </div>
            <section className="flex w-full flex-row gap-4">
              <StatusSideBar siteName = {siteStatusobj? siteStatusobj.componnetName : "" } junctionArray={junctionArray.length} eventAlertArray={eventAlertArray.length} recordedClipArray={recordedClipArray.length} storageStatusArray={storageStatusArray.length} eventClipArray={eventClipArray.length} userArray={userArray.length}/>
              <div className="h-[650px] w-full max-w-[75%] overflow-x-scroll bg-white">{children}</div>
            </section>
          </div>
        </>
    )
}
export default StatusLayout