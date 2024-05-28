"use client"

import { useEffect, useState } from "react"

import {
  getAllAnalytics,
  getHotlistedEvent,
  updateHotlistedEvent,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const SetHotlistedEvents = () => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null)
  const [analytics, setAnalytics] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [hotlistedEvents, setHotlistedEvents] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await getAllAnalytics()
      const response2 = await getHotlistedEvent()
      setAnalytics(response)
      setHotlistedEvents(response2)
    }
    fetchAnalytics()
  }, [])
  useEffect(() => {
    const validateSelectedEvents = () => {
      const validate = analytics?.map((item) => {
        if (hotlistedEvents?.includes(item.alerttype)) {
          return [item.alerttype]
        }
      })
      setSelectedEvents(validate.filter((item) => item !== undefined).flat())
    }
    validateSelectedEvents()
  }, [hotlistedEvents, analytics])

  const handleEventSelection = (val, id) => {
    if (val) {
      setSelectedEvents((prev) => [...prev, id])
    } else {
      setSelectedEvents((prev) => prev.filter((item) => item !== id))
    }
  }
  const handleUpdateHotlistedEvent = async () => {
    const payload = selectedEvents
    await updateHotlistedEvent(payload)
    toast({
      variant: "success",
      description: " Successfully Updated Hotlisted Analytics",
      duration: 3000,
    })
  }
  return (
    <section className="ml-4 mt-4 flex flex-col gap-8">
      <h1 className=" text-xl font-bold">Configure Hotlisted Events</h1>
      <div className="flex flex-col gap-8">
        {/* <span>Input</span> */}
        <div className="flex flex-col gap-4">
          <span className="font-bold">Hotlisted Analytics :</span>
          {/* <ScrollArea className="h-[250px]"> */}
          <ul>
            {analytics?.map((item, index) => (
              <div className="flex items-center gap-4" id={item.alerttype}>
                <Checkbox
                  checked={selectedEvents.includes(item.alerttype)}
                  onCheckedChange={(e) => {
                    handleEventSelection(e, item.alerttype)
                  }}
                />
                <li key={index} value={item.alerttype}>
                  {item.alertname}
                </li>
              </div>
            ))}
          </ul>
          {/* </ScrollArea> */}
          {/* <Select
            value={selectedAnalytic}
            onValueChange={(e) => setSelectedAnalytic(e)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {analytics?.map((item, index) => (
                  <div className="flex items-center " id={item.alerttype}>
                    <Checkbox
                      checked={selectedEvents.includes(item.alerttype)}
                      onCheckedChange={(e) => {
                        handleEventSelection(e, item.alerttype)
                      }}
                    />
                    <SelectItem key={index} value={item.alerttype}>
                      {item.alertname}
                    </SelectItem>
                  </div>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select> */}
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button onClick={handleUpdateHotlistedEvent}>Okay</Button>
          <Button variant="outline" onClick={() => setSelectedEvents([])}>
            Reset
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SetHotlistedEvents
