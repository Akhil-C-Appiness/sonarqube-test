"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import useStore from "@/store/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const ValidateEventsView = ({ onRequestClose, props }) => {
    const violations = useStore((state) => state.violations)
    const [validBtnClicked, setValidBtnClicked] = useState(false)
    const [uncheckedBtnClicked, setUncheckedBtnClicked] = useState(false)
    const [spuriousBtnClicked, setSpuriousBtnClicked] = useState(false)

    const violationEventType = props?.details?.eventType
    ? [props.details.eventType]
    : props?.eventType
    ? [props.eventType]
    : []
  const [selectedViolations, setSelectedViolations] =
    useState(violationEventType)

    const handleValidBtn = () => {
        setValidBtnClicked(!validBtnClicked)
        setUncheckedBtnClicked(false)
        setSpuriousBtnClicked(false)
      }
return(
    <Tabs defaultValue="validateEvent" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="validateEvent">
            <Input type="radio" />
            Validate Event
            </TabsTrigger>
        <TabsTrigger value="spuriousEvent">
        <Input type="radio" />
            Spurious Event
            </TabsTrigger>
      </TabsList>
      <TabsContent value="validateEvent">
      
      </TabsContent>
      <TabsContent value="spuriousEvent">
      <div>
           hello
       </div>
      </TabsContent>
    </Tabs>
)
}