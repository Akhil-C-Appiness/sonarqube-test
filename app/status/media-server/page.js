"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getAllJunctionStatus, getSiteStatus, getJunctionStatus } from "@/lib/api"

export default function IndexPage() {
    let trodd = "bg-[#F6F6F6]";
    let treven = "bg-[#FFFFFF]";
    let tdstyle= "h-[56px] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    let statusArray = ["OK","WARNING","DEAD","DISCONNECTED","UNKNOWN"];
    let [junctionArray, setjunctionArray] = useState([]);
    let [siteStatusobj, setsiteStatusobj] = useState()
    useEffect(()=>{
        async function siteStatus(){
            const response = await getSiteStatus();
            setsiteStatusobj(response.data.result[0]);
        }
        
        siteStatus();
    },[])
    useEffect(()=>{
        async function allJunctionStatus(){
            const response = await getAllJunctionStatus();
            let responseArray = response.data.result;
            responseArray.map((user, index) => {
                if(user.channelStatus !== null){

                }
            });
            setjunctionArray(response.data.result);
        }
        
        allJunctionStatus();
    },[])
  return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Site Name ({siteStatusobj? siteStatusobj.componnetName : ""})</h1>
            <Button variant="ghost" className="text-[#2A94E5]">Refresh</Button>
        </div>
        <div className="w-full px-8">
            <table className="w-full">
                <tr>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Server Name</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">IP</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Server Time</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Cumulative Status</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Database Status</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Local Storage Alert</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Camera Alert</th>
                </tr>
                {junctionArray?.map((item,index) => (
                    <tr className={index%2 == 0 ? trodd : treven}>
                        <td className={tdstyle}>{item.componnetName}</td>
                        <td className={tdstyle}>{item.componnetIp}</td>
                        <td className={tdstyle}>{item.statusTimeCalander == null ? "NA" :new Date(item.statusTimeCalander).toLocaleString()}</td>
                        <td className={tdstyle}>{item.componentStatus >= 0 ? statusArray[item.componentStatus] : "NA"}</td>
                        <td className={tdstyle}>{item.dbStatus >= 0 ? statusArray[item.dbStatus] : "NA"}</td>
                        <td className={tdstyle}>{item.totalMSStorage >= 0 ? `${item.totalMSStorage} / ${item.totalMSStorage - item.inactiveMSStorage}`:"NA"}</td>
                        <td className={tdstyle}>{item.totalCamera >= 0 ? `${item.totalCamera}/${item.totalCamera - item.inactiveCamera}`:"NA"}</td>
                    </tr>
                ))}
            </table>
        </div>
    </div>
  )
}
