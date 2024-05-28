"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import Image from 'next/image'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import JunctionTable from './components/junction-table'
import CentralTable from './components/central-table'
import CameraTable from './components/camera-table'
import useStore from "@/store/store"
import { getDate } from '@/lib/common'


export default function IndexPage() {
    const [view, setView] = useState(0)
    const [junctionDataArray, setJunctionDataArray] = useState([]);
    const [cameraDataArray, setcameraDataArray] = useState([]);
    const [centralviewListArray, setcentralviewListArray] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isErrorCamera, setIiErrorCamera] = useState(false);
    const [isErrorCentral, setIsErrorCentral] = useState(false);
    const setallChannelList = useStore(state=>state.setallChannelList)
    const allChannelList = useStore(state=>state.allChannelList)
    const setjunctionviewList = useStore(state=>state.setjunctionviewList)
    const junctionviewList = useStore(state=>state.junctionviewList)
    const setjunctionList = useStore(state=>state.setjunctionList)
    const junctionList = useStore(state=>state.junctionList)
    const setcameraviewList = useStore(state=>state.setcameraviewList)
    const cameraviewList = useStore(state=>state.cameraviewList);
    const setcentralviewList = useStore(state=>state.setcentralviewList)
    const centralviewList = useStore(state=>state.centralviewList);
    useEffect(()=>{
        setallChannelList();
        setjunctionviewList();
        setjunctionList();
        setcameraviewList();
        setcentralviewList();
        console.log("centralviewList",centralviewList);
    }, [])
    useEffect(()=>{
        const newJunctionViewList = [];
        junctionviewList.map((junction) => {
            let junctionId = junction.junctionId;
            let filteredData = junctionList.filter((item) => item.id === junctionId);
            let junctionObj = {
                junctionName : filteredData[0].name,
                junctionIp: filteredData[0].ip,
                junctionCpuUsedInPercentage: junction.junctionCpuUsedInPercentage,
                junctionCpuTotalInPercentage: junction.junctionCpuTotalInPercentage,
                junctionMemoryUsed: (junction.junctionMemoryUsed / (1024 * 1024 * 1024)).toFixed(2),
                junctionMemoryTotal: (junction.junctionMemoryTotal / (1024 * 1024 * 1024)).toFixed(2),
                junctionStorageUsedInGB: junction.junctionStorageUsedInGB.toFixed(2),
                junctionStorageTotalInGB: junction.junctionStorageTotalInGB.toFixed(2),
                allProcessStatus: junction.allProcessStatus,
                allProcessStatusLength: junction.allProcessStatus.length,
                totalAnprCameraCount: junction.totalAnprCameraCount,
                problamaticAnprCameraCount: junction.problamaticAnprCameraCount,
                analyticsFrameDroppedCount: junction.analyticsFrameDroppedCount,
                pendingEventCount: junction.pendingEventCount,
                pendingRecordedClipCount: junction.pendingRecordedClipCount,
                pendingEventClipCount: junction.pendingEventClipCount,
                totalEvidenceCameraCount: junction.totalEvidenceCameraCount,
                problamaticEvidenceCameraCount: junction.problamaticEvidenceCameraCount,
                totalOthersCameraCount: junction.totalOthersCameraCount,
                problamaticOthersCameraCount: junction.problamaticOthersCameraCount,
                errorStatus: junction.allProcessStatus === null || junction.analyticsFrameDroppedCount >= 300 || junction.pendingEventCount >=200
            }
            newJunctionViewList.push(junctionObj);
        })
        setJunctionDataArray(newJunctionViewList)
    },[junctionviewList])
    useEffect(()=>{
        const newCameraViewList = [];
        // console.log("cameraviewList",cameraviewList)
        cameraviewList.map((camera)=>{
            let cameraId = camera.chId;
            let filteredData = allChannelList.filter((item) => item.id === cameraId);
            let timeStatus = false;
            let cameraStatus = false;
            let lastEventTimeStatus= false;
            let lastEventClipTimeStatus = false;
            if(camera.recordedClipReceiverStatus !== null){
                let currentDate = new Date();
                let lastRecordedClipTime = camera.recordedClipReceiverStatus.lastGeneratedRecordedClipTime;
                lastRecordedClipTime = new Date(lastRecordedClipTime);
                const timeDifference = currentDate - lastRecordedClipTime;
                if(timeDifference > 10*60*1000){
                    timeStatus = true;
                }
            }
            if(camera.eventReceiverStatus !== null){
                let currentDate = new Date();
                let lastEventTime = camera.eventReceiverStatus.lastGeneratedEventTime;
                lastEventTime = new Date(lastEventTime);
                const timeDifference = currentDate - lastEventTime;
                if(timeDifference > 10*60*1000){
                    lastEventTimeStatus = true;
                }
            }
            if(camera.eventClipReceiverStatus !== null){
                let currentDate = new Date();
                let lastEventClipTime = camera.eventReceiverStatus.lastGeneratedEventTime;
                lastEventClipTime = new Date(lastEventClipTime);
                const timeDifference = currentDate - lastEventClipTime;
                if(timeDifference > 10*60*1000){
                    lastEventClipTimeStatus = true;
                }
            }
            if(filteredData[0].channelType == 0){
                cameraStatus = (camera.analyticsStatus !== null && camera.analyticsStatus.analyticsFrameDroppedCount >= 300) || 
                                (camera.analyticsStatus !== null && camera.analyticsStatus.analyticsProcessedFps >0 && camera.analyticsStatus.analyticsProcessedFps < 10) ||
                                (camera.eventReceiverStatus !== null && camera.eventReceiverStatus.pendingEventCount >= 200) ||
                                (camera.eventReceiverStatus !== null && camera.eventReceiverStatus.lastGeneratedEventTime > 0 && lastEventTimeStatus)
                                ||(camera.eventClipReceiverStatus !== null && camera.eventClipReceiverStatus.lastGeneratedEventClipTime >0 && lastEventClipTimeStatus)
            }
            let errorStatus = (camera.recordedClipReceiverStatus !== null && camera.recordedClipReceiverStatus.pendingRecordedClipCount >= 5) ||
                                (camera.recordedClipReceiverStatus !== null && timeStatus) || 
                                timeStatus || cameraStatus
            let cameraObj = {
                numberName : filteredData[0]?.numberName,
                analyticsStatus: camera.analyticsStatus,
                analyticsFrameDroppedCount: camera.analyticsStatus !== null ? camera.analyticsStatus.analyticsFrameDroppedCount : "Analytic is not set/configured",
                analyticsProcessedFps: camera.analyticsStatus !== null ? camera.analyticsStatus.analyticsProcessedFps : "",
                analyticsGrabbedFps: camera.analyticsStatus !== null ? camera.analyticsStatus.analyticsGrabbedFps : "",
                eventReceiverStatus: camera.eventReceiverStatus,
                pendingEventCount: camera.eventReceiverStatus !== null ? camera.eventReceiverStatus.pendingEventCount : "",
                lastReceivedEventGenTime: camera.eventReceiverStatus !== null ? camera.eventReceiverStatus.lastReceivedEventGenTime : "",
                lastReceivedEventRecTime: camera.eventReceiverStatus !== null ? camera.eventReceiverStatus.lastReceivedEventRecTime : "",
                downloadSize: camera.eventReceiverStatus !== null ? (camera.eventReceiverStatus.downloadSize)/(1024*1024) : "",
                downloadTime: camera.eventReceiverStatus !== null ? (camera.eventReceiverStatus.downloadTime)/(1000) : "",
                lastGeneratedEventTime: camera.eventReceiverStatus !== null ? camera.eventReceiverStatus.lastGeneratedEventTime : "",
                recordedClipReceiverStatus: camera.recordedClipReceiverStatus,
                pendingRecordedClipCount: camera.recordedClipReceiverStatus !== null ? camera.recordedClipReceiverStatus.pendingRecordedClipCount : "",
                lastReceivedRecordedClipGenTime: camera.recordedClipReceiverStatus !== null ? camera.recordedClipReceiverStatus.lastReceivedRecordedClipGenTime : "",
                lastReceivedRecordedClipRecTime: camera.recordedClipReceiverStatus !== null ? camera.recordedClipReceiverStatus.lastReceivedRecordedClipRecTime : "",
                recordeddownloadSize: camera.recordedClipReceiverStatus !== null ? (camera.recordedClipReceiverStatus.downloadSize)/(1024*1024) : "",
                recordeddownloadTime: camera.recordedClipReceiverStatus !== null ? (camera.recordedClipReceiverStatus.downloadTime)/(1000) : "",
                lastGeneratedRecordedClipTime: camera.recordedClipReceiverStatus !== null ? camera.recordedClipReceiverStatus.lastGeneratedRecordedClipTime : "",
                errorStatus:errorStatus
            }
            newCameraViewList.push(cameraObj);
        })
        // console.log("newCameraViewList",newCameraViewList);
        setcameraDataArray(newCameraViewList);
    },[cameraviewList])
    useEffect(()=>{
        const newcentralviewListArray = [];
        centralviewList.map((central)=>{
            let centralObj = {
                machineName: central.machineName,
                machineIp: central.machineIp,
                machineCpuUsedInPercentage: central.machineCpuUsedInPercentage,
                machineCpuTotalInPercentage: central.machineCpuTotalInPercentage,
                machineMemoryUsed: (central.machineMemoryUsed/ (1024 * 1024 * 1024)).toFixed(2),
                machineMemoryTotal: (central.machineMemoryTotal/(1024 * 1024 * 1024)).toFixed(2),
                machineStorageUsedInGB: central.machineStorageUsedInGB.toFixed(2),
                machineStorageTotalInGB: central.machineStorageTotalInGB.toFixed(2),
                allProcessStatus: central.allProcessStatus,
                allProcessStatusLength: central.allProcessStatus.length,
                totalJunctionServerCount: central.totalJunctionServerCount,
                problamaticJunctionServerCount: central.problamaticJunctionServerCount,
                totalAnprCameraCount: central.totalAnprCameraCount,
                problamaticAnprCameraCount: central.problamaticAnprCameraCount,
                totalEvidenceCameraCount: central.totalEvidenceCameraCount,
                problamaticEvidenceCameraCount: central.problamaticEvidenceCameraCount,
                totalOthersCameraCount: central.totalOthersCameraCount,
                problamaticOthersCameraCount: central.problamaticOthersCameraCount,
                analyticsFrameDroppedCount: central.analyticsFrameDroppedCount,
                pendingEventCount: central.pendingEventCount,
                pendingRecordedClipCount: central.pendingRecordedClipCount,
                pendingEventClipCount: central.pendingEventClipCount,
                errorStatus: central.allProcessStatus === null || central.analyticsFrameDroppedCount >= 300 || central.pendingEventCount >= 200
            }
            newcentralviewListArray.push(centralObj);
        })
        setcentralviewListArray(newcentralviewListArray);
    },[centralviewList])
    const handleErrorCheckbox = (value) => {
        setIsError(value);
    }; 
    const handleCameraErrorCheckbox = (value) => {
        setIiErrorCamera(value);
    }; 
    const handleCentralErrorCheckbox = (value) => {
        setIsErrorCentral(value);
    };    
    return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Filter Criteria</h1>
            <Button variant="ghost" className="flex gap-2 text-[#2A94E5]"><Image src="/vectors/status-refresh.svg" width="18" height="21"  alt="icon" />Refresh</Button>
        </div>
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <div className="flex flex-row items-center gap-2">
                <p className="text-base font-medium">View</p>
                <Select onValueChange={(value) => setView(value)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Junction" />
                    </SelectTrigger>
                    <SelectContent className="w-[200px]">                                                            
                        <SelectItem value="0">Junction</SelectItem>
                        <SelectItem value="1">Camera</SelectItem>
                        <SelectItem value="2">Central</SelectItem>
                    </SelectContent>
                </Select>
                {/* {view == 0 ? 
                <Select onValueChange={(value)=> setJunctionColumn(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel></SelectLabel>
                            <SelectItem value="0">All Status</SelectItem>
                            <SelectItem value="1">Resoruce Status</SelectItem>
                            <SelectItem value="2">All Process Status</SelectItem>
                            <SelectItem value="3">Camera Status</SelectItem>
                            <SelectItem value="4">Common Status</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                :
                view == 1 ?
                <></>
                :
                <></>
                }    */}
            </div>
            <div className="flex w-full flex-row items-center justify-end gap-1">
                {view == 0 ? 
                <>
                    <Checkbox  name="error" id="error" checked={isError} onCheckedChange={(value)=>handleErrorCheckbox(value)}/>
                    <label htmlFor="" className="mr-8 text-sm">Error Only</label>
                </>
                :
                view == 1 ?
                <>
                    <Checkbox  name="error-1" id="error-1" checked={isErrorCamera} onCheckedChange={(value)=>handleCameraErrorCheckbox(value)}/>
                    <label htmlFor="" className="mr-8 text-sm">Error Only</label>
                </>
                :
                <>
                    <Checkbox  name="error-2" id="error-2" checked={isErrorCentral} onCheckedChange={(value)=>handleCentralErrorCheckbox(value)}/>
                    <label htmlFor="" className="mr-8 text-sm">Error Only</label>
                </>
                }   
                
                {/* <Select>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="w-[200px]">                                                            
                        <SelectItem value="0">Frame Drop</SelectItem>
                        <SelectItem value="1">Pending Event</SelectItem>
                        <SelectItem value="2">Pending Recording</SelectItem>
                        <SelectItem value="3">Pending Event Clip</SelectItem>
                    </SelectContent>
                </Select> */}
            </div>
        </div>
        <div className="ml-8 w-[95%] overflow-x-auto">
            {view == 0 ? <JunctionTable  junctionDataArray={ junctionDataArray } isError={ isError }/> 
            : view == 1 ? <CameraTable cameraDataArray={cameraDataArray} isError={ isErrorCamera }/> 
            : <CentralTable centralviewListArray={centralviewListArray} isError={ isErrorCentral }/>}
        </div>
    </div>
  )
}
