"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useState, useEffect } from "react"
const EvidenceModal = ({setOpen, open, defaultEvUrlData, evUrlData, setEvUrlData, evMaxSignalTime, setEvMaxSignalTime}) => {
   const updateUrl = (field, value, index)=>{
    if(field == "stream"){
      const tmpevUrlData = [...evUrlData];
      tmpevUrlData[index][field] = value;
      tmpevUrlData[index]["url"] = defaultEvUrlData[0][value];
      setEvUrlData(tmpevUrlData);
    }else{
      console.log(field, value, index)
      const tmpevUrlData = [...evUrlData];
      tmpevUrlData[index][field] = value;
      setEvUrlData(tmpevUrlData);
    }
   };
   useEffect(()=>{
    console.log("defaultEvUrlData",defaultEvUrlData)
    console.log("evUrlData",evUrlData);
   },[evUrlData])
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      
      <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Evidence Configuration</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">
              Maximum Signal time (sec)
            </Label>
            <Input type="number"  value={evMaxSignalTime} onChange={e=>setEvMaxSignalTime(e.target.value)} id="signalTime"  className="py-2 w-52" />
          </div>
          {evUrlData?.map((ev, index)=>{
            return <div className="flex flex-col gap-4">
            <Label htmlFor="username" >
              Evidence URL-{index+1}
            </Label>
            <div className="flex gap-4">
                <div>
                    <Select value={ev.stream} onValueChange={value=>updateUrl('stream', value, index)} id="lanes" name="lanes" defaultValue={'MJPG_STREAM'} >
                      <SelectTrigger className=" font-medium w-40 ">
                          <SelectValue id="Select" />
                      </SelectTrigger>
                      <SelectContent >
                          <SelectItem value="MAJOR_STREAM">
                          Major Stream
                          </SelectItem>
                          <SelectItem value="MINOR_STREAM">
                          Minor Stream
                          </SelectItem>
                          <SelectItem value="MJPG_STREAM">
                          MJPG Stream
                          </SelectItem>
                          <SelectItem value="JPEG_SNAP">
                          Jpeg Snap
                          </SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="grow">
                    <Input id="username" disabled placeholder="Enter URL" onChange={e=>updateUrl('url', e.target.value, index)} value={ev.url} className="py-2" />
                </div><div>
                    <Select id="time" name="time" value={ev.time} onValueChange={value=>updateUrl('time', value, index)} >
                        <SelectTrigger className=" font-medium w-32">
                            <SelectValue id="Select" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="0">
                            0 sec
                            </SelectItem>
                            <SelectItem value="1">
                            1 sec
                            </SelectItem>
                            <SelectItem value="2">
                            2 sec
                            </SelectItem>
                            <SelectItem value="3">
                            3 sec
                            </SelectItem>
                        </SelectContent>
                        </Select>
                </div>

            </div>
          </div>
          })}
        </div>
        <DialogFooter>
          <Button onClick={()=>setOpen(false)}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default EvidenceModal