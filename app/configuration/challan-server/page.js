"use client"
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ChallanServer } from "./components/challan-server"
// import { AutoChallan } from "./components/auto-challan"
import { useState } from "react"

const ChallanServer = dynamic(() => import("./components/challan-server"));
const AutoChallan = dynamic(() => import("./components/auto-challan"));

const CSConfig = () => {
  const [showAlert, setShowAlert] = useState(false)

  return (
    <>
      <div className="p-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-[20px] py-4 font-medium">Challan Configuration</h1>
        </div>
        <div>
          <Tabs defaultValue="ChallanServerConfiguration" className="w-full">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger
                className="border border-slate-200 px-4 py-1 text-sm hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white "
                value="ChallanServerConfiguration"
              >
                Challan Server Configuration
              </TabsTrigger>
              <TabsTrigger
                className="border border-slate-200 px-4 py-1 text-sm hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white "
                value="AutoChallan"
              >
                Auto Challan Push Configuration
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ChallanServerConfiguration">
             <ChallanServer />
            </TabsContent>
            <TabsContent value="AutoChallan">
              <AutoChallan setShowAlert={setShowAlert} showAlert={showAlert} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default CSConfig
