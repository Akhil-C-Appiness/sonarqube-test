import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import  StorageConfig  from "./components/storage"
import  RadarConfig  from "./components/radar"
import  JunctionCamera  from "./components/junctionCamera"
import  AnalyticsConfig  from "./components/analytics-config"
import  SignalSettings  from "./components/signalSettings"
// import CentralStorageConfig from "./components/central-storage-config"
// import JunctionServerConfig from "./components/junction-server-config"
// import ScheduleConfig from "./components/schedule-config.js"
import Image from "next/image"
import CameraSearch from "@/app/configuration/camera-search/page"
const SSConfig = ()=>{
    return <>
            <div className="p-4">
            <div className="py-4 font-medium flex"><Link href="/configuration/server-storage?search=junction-server"><Image src="/images/left-arrow-grey.svg" width="26" height="26" alt="left arrow" /> </Link> Junction : Newtown</div>
                
        <Tabs defaultValue="junction-analytics" className="w-full">
        <TabsList>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200  p-4 py-1 text-sm " value="junction-analytics">Analytics Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200 px-4 py-1 text-sm " value="junction-storage">Storage Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200 px-4 py-1 text-sm " value="junction-radar">Radar Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200  p-4 py-1 text-sm " value="junction-camera">Camera Search</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200  p-4 py-1 text-sm " value="junction-signal">Signal Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="junction-analytics"><AnalyticsConfig /></TabsContent>
        <TabsContent value="junction-storage"> <StorageConfig /> </TabsContent>
        <TabsContent value="junction-radar"><RadarConfig /></TabsContent>
        <TabsContent value="junction-camera"><CameraSearch /></TabsContent>
        <TabsContent value="junction-signal"><SignalSettings /></TabsContent>
        </Tabs>
        </div>
    </> 
}

export default SSConfig