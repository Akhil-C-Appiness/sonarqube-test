"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import useStore from "@/store/store"

export default function StatusSideBar({siteName, junctionArray, eventAlertArray, recordedClipArray, storageStatusArray, eventClipArray, userArray}){
    const setSiteStatusList = useStore(state=>state.setSiteStatusList)
    const siteStatusList = useStore(state=>state.siteStatusList)
    useEffect(()=>{
        setSiteStatusList();
    }, [])
    const siteStatusobj = siteStatusList[0]
    const pathname = usePathname()
    let trimmedPathname = pathname.slice(7)
    let indexbtn = "h-[64px] w-full rounded-none border-none";
    let junctionbtn = "h-[64px] w-full rounded-none border-none";
    let receiverAlertbtn = "h-[64px] w-full rounded-none border-none"
    let mediaServerbtn = "h-[64px] w-full rounded-none border-none"
    let recordedClipReceiverAlertbtn ="h-[64px] w-full rounded-none border-none"
    let centralStorageStatusbtn = "h-[64px] w-full rounded-none border-none"
    let eventClipReceiverAlertbtn = "h-[64px] w-full rounded-none border-none"
    let loggedUserbtn = "h-[64px] w-full rounded-none border-none"
    if(trimmedPathname === ""){
        indexbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/junction-server-status"){
        junctionbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/event-receiver-alert"){
        receiverAlertbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/media-server"){
        mediaServerbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/recorded-clip-receiver-alert"){
        recordedClipReceiverAlertbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/central-storage-status"){
        centralStorageStatusbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/event-clip-receiver-alert"){
        eventClipReceiverAlertbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(trimmedPathname === "/logged-user"){
        loggedUserbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    else if(pathname.includes("junction-server-status")){
        junctionbtn = "h-[64px] w-full rounded-none bg-[#EEF8FF] border-e-[4px] border-[#2A94E5] border-y-0 border-l-0";
    }
    return(
        <div className="h-[650px] w-[400px] bg-white">
            <Link href="/status">
                <Button variant="outline" className={indexbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Site Name </p>
                        <p className="text-sm font-semibold	leading-6 text-[#0F0F10]">{siteName}</p>
                    </div>
                </Button>
            </Link>
            <Link href="/status/junction-server-status">
            <Button variant="outline" className={junctionbtn}>
                <div className="flex w-full flex-row items-center justify-start gap-1">
                    <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Junction Server Status</p>
                    <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({siteStatusobj? siteStatusobj.totalMediaServer - siteStatusobj.problemeticMediaServer : ""})</p>
                    <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">({siteStatusobj? siteStatusobj.problemeticMediaServer : ""})</p>
                </div>
                </Button>
            </Link>
            <Link href="/status/event-receiver-alert">
                <Button variant="outline" className={receiverAlertbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Event Receiver Alert</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({siteStatusobj? siteStatusobj.eventReceiverOverAllStatus.totalEventReceiver - siteStatusobj.eventReceiverOverAllStatus.problemeticEventReceiver : ""})</p>
                        <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">({siteStatusobj? siteStatusobj.eventReceiverOverAllStatus.problemeticEventReceiver : ""})</p>
                    </div>
                </Button>
            </Link>
            <Link href="/status/media-server">
                <Button variant="outline" className={mediaServerbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Camera Status</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({siteStatusobj? siteStatusobj.totalCamera - siteStatusobj.inactiveCamera : ""})</p>
                        <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">({siteStatusobj? siteStatusobj.inactiveCamera : ""})</p>
                    </div>
                </Button>
            </Link>
            <Link href="/status/recorded-clip-receiver-alert">
                <Button variant="outline" className={recordedClipReceiverAlertbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Recorded Clip Receiver Alert</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({siteStatusobj? siteStatusobj.recordedClipReceiverOverAllStatus.totalRecordedClipReceiver - siteStatusobj.recordedClipReceiverOverAllStatus.problemeticRecordedClipReceiver : ""})</p>
                        <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">({siteStatusobj? siteStatusobj.recordedClipReceiverOverAllStatus.problemeticRecordedClipReceiver : ""})</p>
                        {/* <p className="text-sm font-semibold	leading-6 text-[#2A94E5]">(0)</p> */}
                    </div>
                </Button>
            </Link>
            <Link href="/status/central-storage-status">
                <Button variant="outline" className={centralStorageStatusbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Central Storage Status</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({storageStatusArray})</p>
                        <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">(0)</p>
                    </div>
                </Button>
            </Link>
            <Link href="/status/event-clip-receiver-alert">
                <Button variant="outline" className={eventClipReceiverAlertbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Event Clip Receiver Alert</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({siteStatusobj? siteStatusobj.eventClipReceiverOverAllStatus.totalEventClipReceiver - siteStatusobj.eventClipReceiverOverAllStatus.problemeticEventClipReceiver : ""})</p>
                        <p className="text-sm font-semibold	leading-6 text-[#D73D2A]">({siteStatusobj? siteStatusobj.eventClipReceiverOverAllStatus.problemeticEventClipReceiver : ""})</p>
                    </div>
                </Button>
            </Link>
            <Link href="/status/logged-user">
                <Button variant="outline" className={loggedUserbtn}>
                    <div className="flex w-full flex-row items-center justify-start gap-1">
                        <p className="text-sm font-semibold	leading-6 text-[#6F6F70]">Logged User</p>
                        <p className="text-sm font-semibold	leading-6 text-[#27AA8C]">({userArray})</p>
                    </div>
                </Button>
            </Link>
        </div>
    )
}