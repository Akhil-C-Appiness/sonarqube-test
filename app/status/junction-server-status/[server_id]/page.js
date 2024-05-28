"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getJunctionStatus, getSiteStatus, getAllChannels } from "@/lib/api"

export default function IndexPage({ params }) {
    const server_id = params.server_id
    let trodd = "bg-[#F6F6F6]";
    let treven = "bg-[#FFFFFF]";
    let tdstyle= "h-[56px] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    let thformat = "h-[56px] min-w-[150px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]";
    let thformatsmall = "h-[56px] min-w-[100px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]";
    let statusArray = ["OK","WARNING","DEAD","DISCONNECTED","UNKNOWN"];
    let storageStatusArray = ["Available", "Inaccessible", "Full", "Low", "No Write Permission", "Unknown"]
    let streamArray = ["OK", "Inaccessible",  "Pause", "Not In Use"];
    let recordingStreamArray = ["Major Stream", "Minor Stream", "MJPG Stream", "Jpeg Snap"];
    let [junctionArray, setjunctionArray] = useState()
    let [siteStatusobj, setsiteStatusobj] = useState()
    let [allChannelsArray, setallChannelsArray] = useState()
    let multiCoreUsage = junctionArray?.systemStatus.idleCpuPercentages;
    let storageAvailability = junctionArray?.systemStatus.storages;
    let memoryUsePercentage = junctionArray?.systemStatus.memoryUsePercentage;
    let freeMemory = junctionArray?.systemStatus.freeMemory;
    let totalMemory = junctionArray?.systemStatus.totalMemory;
    let msstorageStatus = junctionArray?.msstorageStatus;
    let channelStatus = junctionArray?.channelStatus;

    useEffect(()=>{
        async function siteStatus(){
            const response = await getSiteStatus();
            setsiteStatusobj(response.data.result[0]);
        }
        
        siteStatus();
    },[])
    useEffect(()=>{
        async function junctionStatus(){
            const response = await getJunctionStatus(server_id);
            setjunctionArray(response.data.result[0]);
        }
        
        junctionStatus();
    },[])
    useEffect(()=>{
        async function allChannels(){
            const response = await getAllChannels();
            setallChannelsArray(response);
        }
        allChannels();
    },[])
    useEffect(()=>{
        // console.log("junctionArray",junctionArray);
        // console.log("allChannelsArray",allChannelsArray);
    },[allChannelsArray,junctionArray]);
    return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-6">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Site Name ({siteStatusobj? siteStatusobj.componnetName : ""}) / Media Server / {server_id} </h1>
            <Button variant="ghost" className="text-[#2A94E5]">Refresh {}</Button>
        </div>
        <Tabs defaultValue="System" className="w-full px-8">
            <TabsList className="w-full">
                <TabsTrigger value="System" className='h-[62px] w-[35%] items-center justify-center bg-[#F6F6F6] text-[20px] font-semibold'>System Health</TabsTrigger>
                <TabsTrigger value="Local" className='h-[62px] w-[35%] items-center justify-center bg-[#F6F6F6] text-[20px] font-semibold'>Local Storage</TabsTrigger>
                <TabsTrigger value="Channel" className='h-[62px] w-[35%] items-center justify-center bg-[#F6F6F6] text-[20px] font-semibold'>Channel Status</TabsTrigger>
            </TabsList>
            <TabsContent value="System">
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="border-1 h-auto w-full p-4 shadow-lg">
                        <h2 className="text-sm font-semibold leading-6 text-[#0F0F10]">Multi-Core Usage:</h2>
                        {multiCoreUsage?.map((item) => (
                            <div className="mt-4 flex flex-row items-center justify-between gap-1">
                                <Progress value={item} className="w-[65%]"/><p classname="text-[14px]">Idle {item}%</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid-row-2 grid gap-4">
                        <div className="border-1 h-[165px] w-full p-4 shadow-lg">
                            <h2 className="text-sm font-semibold leading-6 text-[#0F0F10]">Storage Availability</h2>
                            {storageAvailability?.map((item) => (
                                <div className="mt-4 flex flex-row items-center justify-between gap-1">
                                    <p className="text-[14px]">{item.driveInfo.path}</p><Progress value={(item.driveInfo.freeStorageInGb*100)/item.driveInfo.totalStorageInGb} className="w-[50%]"/><p classname="text-[14px]">Idle {Math.round((item.driveInfo.freeStorageInGb*100)/item.driveInfo.totalStorageInGb)}%</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-1 h-[165px] w-full p-4 shadow-lg">
                            <h2 className="text-sm font-semibold leading-6 text-[#0F0F10]">Memory Status (RAM Usage)</h2>
                            {memoryUsePercentage ? (
                                <div className="mt-4 flex flex-row items-center justify-between gap-1">
                                    <Progress value={memoryUsePercentage} className="w-[65%]"/><p classname="text-[14px]">{`${freeMemory}/${totalMemory}`}</p>
                                </div>
                            ) : (
                                <div></div>
                            ) }
                            
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="Local">
                <div className="border-1 mt-4 w-full p-4 shadow-lg">
                    <h2 className="text-sm font-semibold leading-6 text-[#0F0F10]">Storage Availability</h2>
                    {msstorageStatus?.map((item)=>(
                        <div className="mt-4 flex flex-row items-center justify-between gap-1">
                            <p className="text-[14px]">{item.driveInfo.path}</p>
                            <Progress value={(item.driveInfo.freeStorageInGb * 100) / item.driveInfo.totalStorageInGb} className="w-[50%]"/>
                            <p classname="text-[14px]">Idle {Math.round((item.driveInfo.freeStorageInGb * 100) / item.driveInfo.totalStorageInGb)}%</p>
                            <div className="flex h-6 w-40 items-center justify-start rounded bg-slate-200 px-2 text-[14px]">Status: {storageStatusArray[item.driveInfo.status]}</div>
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="Channel">
            {/* {allChannelsArray?.filter(obj => obj.id === 1).numberName} */}
            {/* {allChannelsArray[0]?.numberName} */}
                <table className="mt-4 w-full overflow-x-scroll">
                    <tr>
                        <th className={thformatsmall}>Sl No.</th>
                        <th className={thformatsmall}>Name</th>
                        <th className={thformat}>IP-Address</th>
                        <th className={thformat}>REC Stream</th>
                        <th className={thformatsmall}>Recording</th>
                        <th className={thformat}>Minor Stream</th>
                        <th className={thformat}>Major Stream</th>
                        <th className={thformatsmall}>REC FPS</th>
                        <th className={thformat}>REC Bitrate</th>
                        <th className={thformat}>Analytic FPS (Grab)</th>
                        <th className={thformat}>Analytic FPS (Processed)</th>
                        <th className={thformat}>Analytic Drop(In last 5 minutes)</th>
                    </tr>
                    {channelStatus?.map((item,index) => (
                        // {let channel = allChannelsArray?.filter(obj => obj.id === item.chId)}
                        <tr className={index%2 == 0 ? trodd : treven}>
                            <td className={tdstyle}>{index + 1}</td>
                            <td className={tdstyle}>{allChannelsArray?.map(obj =>( obj.id === item.chId ? obj.numberName : ""))}</td>
                            <td className={tdstyle}>{allChannelsArray?.map(obj =>( obj.id === item.chId ? obj.ip : ""))}</td>
                            <td className={tdstyle}>{allChannelsArray?.map(obj =>( obj.id === item.chId ? recordingStreamArray[obj.recordingId]: ""))}</td>
                            <td className={tdstyle}>{item.primaryRecording === true ? "REC" : "NOT REC"}</td>
                            <td className={tdstyle}>{streamArray[item.minorStream]}</td>
                            <td className={tdstyle}>{streamArray[item.majorStream]}</td>
                            <td className={tdstyle}>{allChannelsArray?.map(obj =>( obj.id === item.chId && obj.recordingId === 0 ? item.majorFps :obj.id === item.chId && obj.recordingId === 0 ? item.minorFps :  ""))}</td>
                            <td className={tdstyle}>{allChannelsArray?.map(obj =>( obj.id === item.chId && obj.recordingId === 0 ? item.majorBitrate : obj.id === item.chId && obj.minorBitrate === 0 ? item.minorBitrate :  ""))}</td>
                            <td className={tdstyle}>{item.analyticsStatus !== null ? item.analyticsStatus.analyticsGrabbedFps : "NA"}</td>
                            <td className={tdstyle}>{item.analyticsStatus !== null ? item.analyticsStatus.analyticsProcessedFps : "NA"}</td>
                            <td className={tdstyle}>{item.analyticsStatus !== null ? item.analyticsStatus.analyticsFrameDroppedCount : "NA"}</td>
                        </tr>
                    ))}
                </table>
            </TabsContent>
        </Tabs>
    </div>
  )
}
