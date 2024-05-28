"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
const StatusLayout = ({children}) =>{
    return(
        <>
          <div className="mx-auto flex max-w-[95%] flex-col gap-4 p-4">
            <div className="flex h-[72px] w-full flex-row items-center justify-between bg-white px-8 py-4">
                <h1 className="text-xl font-semibold text-[#0F0F10]">Status Display</h1>
                <div className="flex items-center">
                    <Link href="/status"><Button variant="outline" className="rounded-none">View Status</Button></Link>
                    <Link href="/status-dashboard"><Button variant="default" className="rounded-none">System Dashboard</Button></Link>
                </div>
            </div>
            <section className="flex w-full flex-row gap-4">
              <div className="w-full overflow-x-scroll bg-white pb-10">{children}</div>
            </section>
          </div>
        </>
    )
}
export default StatusLayout