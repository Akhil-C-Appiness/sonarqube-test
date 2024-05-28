"use client"
import dynamic from 'next/dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import  SiteConfig  from "./components/site-config"
// import CentralStorageConfig from "./components/central-storage-config"
// import JunctionServerConfig from "./components/junction-server-config"
// import ScheduleConfig from "./components/schedule-config.js"
import { useSearchParams,useRouter } from "next/navigation"

const SiteConfig = dynamic(() => import("./components/site-config"));
const CentralStorageConfig = dynamic(() => import("./components/central-storage-config"));
const JunctionServerConfig = dynamic(() => import("./components/junction-server-config"));
const ScheduleConfig = dynamic(() => import("./components/schedule-config.js"));


const SSConfig = ()=>{
    const router = useRouter()
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    console.log(search)
    return <>
            <div className="p-4">
            <div className="py-4 font-medium">Server & Storage Configuration</div>
                
        <Tabs defaultValue={search == "junction-server" ? "junction-server" : "site"} className="w-full">
        <TabsList>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200 px-4 py-1 text-sm " value="site">Site Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200 px-4 py-1 text-sm " value="central-storage">Central Storage Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200  p-4 py-1 text-sm " value="junction-server">Junction Server Configuration</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200  p-4 py-1 text-sm " value="schedule">Schedule Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="site"> <SiteConfig /></TabsContent>
        <TabsContent value="central-storage"><CentralStorageConfig /></TabsContent>
        <TabsContent value="junction-server"><JunctionServerConfig /></TabsContent>
        <TabsContent value="schedule"><ScheduleConfig /></TabsContent>
        </Tabs>
        </div>
    </> 
}

export default SSConfig