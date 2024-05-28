"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getCentralStorageStatus, getSiteStatus } from "@/lib/api"

export default function IndexPage() {
    let trodd = "bg-[#F6F6F6]";
    let treven = "bg-[#FFFFFF]";
    let tdstyle= "h-[56px] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    let statusArray = ["Available", "Inaccessible", "Full", "Low", "No Write Permission", "Unknown"];
    let [storageStatusArray, setstorageStatusArray] = useState([])
    let [siteStatusobj, setsiteStatusobj] = useState()
    useEffect(()=>{
        async function siteStatus(){
            const response = await getSiteStatus();
            setsiteStatusobj(response.data.result[0]);
        }
        
        siteStatus();
    },[])
    useEffect(()=>{
        async function centralStorage(){
            const response = await getCentralStorageStatus();
            setstorageStatusArray(response.data.result);
        }
        
        centralStorage();
    },[])
    useEffect(()=>{
        // console.log("Array",storageStatusArray )
    },[storageStatusArray])
  return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Site Name ({siteStatusobj? siteStatusobj.componnetName : ""})</h1>
            <Button variant="ghost" className="text-[#2A94E5]">Refresh</Button>
        </div>
        <div className="w-full px-8">
            <table className="w-full">
                <tr>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Storage Path</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Storage Type</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Status</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Total Space (GB)</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Used Space (GB)</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Free Space (GB)</th>
                    {/* <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Usable Space (GB)</th> */}
                </tr>
                {storageStatusArray?.map((item,index) => (
                    <tr className={index%2 == 0 ? trodd : treven}>
                        <td className={tdstyle}>{item.driveInfo.path}</td>
                        <td className={tdstyle}>{item.driveInfo.driveType}</td>
                        <td className={tdstyle}>{item.driveInfo.status >= 0 ? statusArray[item.driveInfo.status] : "NA"}</td>
                        <td className={tdstyle}>{item.driveInfo.totalStorageInGb}</td>
                        <td className={tdstyle}>{item.driveInfo.totalStorageInGb - item.driveInfo.freeStorageInGb}</td>
                        <td className={tdstyle}>{item.driveInfo.freeStorageInGb}</td>
                        {/* <td className={tdstyle}>{item.driveInfo.freeStorageInGb}</td> */}
                    </tr>
                ))}
            </table>
        </div>
    </div>
  )
}
