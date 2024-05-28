"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {useEffect, useState} from "react"
const vehicleTypes = [
  {
    "code": 0,
    "name": "Two Wheeler"
  },
  {
    "code": 1,
    "name": "Three Wheeler"
  },
  {
    "code": 2,
    "name": "Four Wheeler"
  },
  {
    "code": 3,
    "name": "Heavy Vehicle"
  }
]
const SetSpeedModal = ({setOpen, open, speedLimitObj, setSpeedLimitObj}) => {
  const [sameSpeed, setSameSpeed] = useState(false)
  const [vehicleTypes, setVehicleTypes] = useState([
    {
      "code": 0,
      "name": "Two Wheeler"
    },
    {
      "code": 1,
      "name": "Three Wheeler"
    },
    {
      "code": 2,
      "name": "Four Wheeler"
    },
    {
      "code": 3,
      "name": "Heavy Vehicle"
    }
  ]);

  const updateSpeedLimit = (speedLimit, code)=>{
    const tmpSpeedLimitObj = {...speedLimitObj}
    tmpSpeedLimitObj[code] = parseInt(speedLimit);
    
    if(sameSpeed){
      tmpSpeedLimitObj[1] = parseInt(speedLimit);
      tmpSpeedLimitObj[2] = parseInt(speedLimit);
      tmpSpeedLimitObj[3] = parseInt(speedLimit);
    }
    console.log(tmpSpeedLimitObj)
    setSpeedLimitObj(tmpSpeedLimitObj)
  };
  useEffect(()=>{
    if(sameSpeed){
      const tmpSLObj =  {...speedLimitObj};
      tmpSLObj[1]= speedLimitObj[0]
      tmpSLObj[2]= speedLimitObj[0]
      tmpSLObj[3]= speedLimitObj[0]
      setSpeedLimitObj(tmpSLObj)
    }
  }, [sameSpeed])
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Speed Limit</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 items-center"><Checkbox checked={sameSpeed}  onCheckedChange={(value)=>setSameSpeed(value)} name="sameSpeedLimit" id="sameSpeedLimit" /> <Label for="sameSpeedLimit"> Set same speed limit for all vehicles</Label></div>
        <div className="grid grid-cols-2 gap-4 py-4">
          {
            vehicleTypes.map((vehicle, index)=>{
                return <div className="flex flex-col gap-4">
                <Label htmlFor="name" >
                  {vehicle.name} (Kmph)
                </Label>
                <Input type="number" disabled={index?sameSpeed:false} id="name" onChange={e=>updateSpeedLimit(e.target.value, vehicle.code)} value={speedLimitObj[vehicle?.code]} className="py-2" />
              </div>
            })
          }
          {/* <div className="flex flex-col gap-4">
            <Label htmlFor="name" >
              Heavy Vehicle (Kmph)
            </Label>
            <Input type="number" id="name" value="" className="py-2" />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="username">
              Four Wheeler (Kmph)
            </Label>
            <Input type="number" id="name" value="" className="py-2" />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" >
              Heavy Vehicle (Kmph)
            </Label>
            <Input type="number" id="name" value="" className="py-2" />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="username">
              Four Wheeler (Kmph)
            </Label>
            <Input type="number" id="name" value="" className="py-2" />
          </div> */}
        </div>
        <DialogFooter>
          <Button  onClick={()=>setOpen(false)}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default SetSpeedModal