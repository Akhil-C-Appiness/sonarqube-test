"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getSiteStatus } from "@/lib/api"
import Image from "next/image"

export default function IndexPage() {
    let trodd = "h-[56px] bg-[#F6F6F6] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    let treven = "h-[56px] bg-[#FFFFFF] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    let [siteStatusobj, setsiteStatusobj] = useState()
    useEffect(()=>{
        async function siteStatus(){
            const response = await getSiteStatus();
            setsiteStatusobj(response.data.result[0]);
        }
        
        siteStatus();
    },[])
    useEffect(()=>{
        // console.log("Array",siteStatusobj)
    },[siteStatusobj])
    return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Site Name ({siteStatusobj? siteStatusobj.componnetName : ""})</h1>
            {/* {siteStatusobj} */}
            {/* <Button variant="ghost" className="flex gap-2 text-[#2A94E5]"><Image src="/vectors/status-refresh.svg" width="18" height="21"  alt="icon" />Refresh</Button> */}
        </div>
        <div className="w-full px-8">
            <table className="w-full">
                <tr>
                    <th className="h-[56px] w-[40%] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Device Type</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Device</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Alert / Ok</th>
                </tr>
                <tr>
                    <td className={trodd}>Junction Server</td>
                    <td className={trodd}>{siteStatusobj? siteStatusobj.totalMediaServer : ""}</td>
                    <td className={trodd}>
                        {siteStatusobj? siteStatusobj.problemeticMediaServer : ""} / {siteStatusobj? siteStatusobj.totalMediaServer - siteStatusobj.problemeticMediaServer : ""}
                    </td>
                </tr>
                <tr>
                    <td className={treven}>Recorded Clip Receiver</td>
                    <td className={treven}>{siteStatusobj? siteStatusobj.recordedClipReceiverOverAllStatus.totalRecordedClipReceiver : ""}</td>
                    <td className={treven}>
                        {siteStatusobj? siteStatusobj.recordedClipReceiverOverAllStatus.problemeticRecordedClipReceiver : ""} / {siteStatusobj? siteStatusobj.recordedClipReceiverOverAllStatus.totalRecordedClipReceiver - siteStatusobj.recordedClipReceiverOverAllStatus.problemeticRecordedClipReceiver : ""}
                    </td>
                </tr>
                <tr>
                    <td className={trodd}>Event Clip Receiver</td>
                    <td className={trodd}>{siteStatusobj? siteStatusobj.eventClipReceiverOverAllStatus.totalEventClipReceiver : ""}</td>
                    <td className={trodd}>
                        {siteStatusobj? siteStatusobj.eventClipReceiverOverAllStatus.problemeticEventClipReceiver : ""} / {siteStatusobj? siteStatusobj.eventClipReceiverOverAllStatus.totalEventClipReceiver - siteStatusobj.eventClipReceiverOverAllStatus.problemeticEventClipReceiver : ""}
                    </td>
                </tr>
                <tr>
                    <td className={treven}>Event Receiver</td>
                    <td className={treven}>{siteStatusobj? siteStatusobj.eventReceiverOverAllStatus.totalEventReceiver : ""}</td>
                    <td className={treven}>
                        {siteStatusobj? siteStatusobj.eventReceiverOverAllStatus.problemeticEventReceiver : ""} / {siteStatusobj? siteStatusobj.eventReceiverOverAllStatus.totalEventReceiver - siteStatusobj.eventReceiverOverAllStatus.problemeticEventReceiver : ""}
                    </td>
                </tr>
                <tr>
                    <td className={trodd}>VMS Storage</td>
                    <td className={trodd}>{siteStatusobj? siteStatusobj.totalVmsStorage : ""}</td>
                    <td className={trodd}>
                        {siteStatusobj? siteStatusobj.inactiveVmsStorage : ""} / {siteStatusobj? siteStatusobj.totalVmsStorage - siteStatusobj.inactiveVmsStorage : ""}
                    </td>
                </tr>
                <tr>
                    <td className={treven}>Camera</td>
                    <td className={treven}>{siteStatusobj? siteStatusobj.totalCamera : ""}</td>
                    <td className={treven}>
                        {siteStatusobj? siteStatusobj.inactiveCamera : ""} / {siteStatusobj? siteStatusobj.totalCamera - siteStatusobj.inactiveCamera : ""}
                    </td>
                </tr>
            </table>
        </div>
    </div>
  )
}
