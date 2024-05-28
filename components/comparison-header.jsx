import React, { useState } from "react"
import Image from "next/image"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/event-accordion"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResetIcon } from "@radix-ui/react-icons"

const ComparisonHeader = ({compare, compareType, setCompareType, areas, selectedArea, setSelectedArea, fetchJunctionData, junctionList, setSelectedJunction, selectedJunction, fetchChannels, channelList, selectedChannel, setSelectedChannel, violationList, selectedViolationType, setSelectedViolationType, selectedRegType, setSelectedRegType, selectedVehicleType, setSelectedVehicleType, firstDate, setFirstDate, secondDate, setSecondDate, setDataList, setDataList2}) => {
  const [date, setDate] = useState({
    from: addDays(new Date(), -10),
    to: new Date(),
  })

  const compareTypeList = [
    "Traffic Flow by Registration Type",
    "Traffic Flow by Vehicle Type",
    "Violation by Registration Type",
    "Violation by Vehicle Type",
    "Violation by Violation Type",
  ]
  const regTypeData = [
    {
      code: -1,
      name: "All",
    },
    {
      code: 0,
      name: "Private",
    },
    {
      code: 1,
      name: "Commercial",
    },
    {
      code: 2,
      name: "Army",
    },
    {
      code: 3,
      name: "EV",
    },
    {
      code: 4,
      name: "Undetermined",
    },
  ]

  const vehicleTypes = [
    {
      "code": -1,
      "name": "All"
    },
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
  const handleViolationTypeChange = (value, code)=>{
    console.log(value, code)
    const tmpViolationType = [...selectedViolationType]
    if(tmpViolationType.includes(code)){
      tmpViolationType.splice(tmpViolationType.indexOf(code),1)
    } else {
      tmpViolationType.push(code)
    }
    setSelectedViolationType(tmpViolationType)
  

  }
  const handleReset = ()=>{
    let today = new Date()
    let yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    setSelectedArea(null)
    setSelectedJunction(null)
    setSelectedChannel(null)
    setSelectedViolationType([])
    setFirstDate(yesterday)
    setSecondDate(today)
    setCompareType("Traffic Flow by Registration Type")
    setDataList([])
    setDataList2([])
  }
  return (
    <div className="mt-4">
      <div className="flex gap-2 bg-white px-8 pb-2 pt-4 text-xl font-semibold text-black">
        <Image
          src="/images/Menu_icons.svg"
          width="24"
          height="40"
          alt="compare"
        />
        Compare
      </div>
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 bg-white px-8 py-4">
        <div className="flex flex-row flex-wrap items-center justify-start gap-2">
          <Popover>
            <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
              {compareType}{" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[310px] p-4">
              <RadioGroup defaultValue={compareType} onValueChange={(value)=>setCompareType(value)}>
                {compareTypeList.map((violation, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                  <RadioGroupItem value={violation} id={`violation${index}`} />
                  <Label htmlFor={`violation${index}`}>
                    {violation}
                  </Label>
                </div>))}
              </RadioGroup>
              <PopoverClose className="w-full"><Button variant="default" className="w-full">Apply</Button></PopoverClose>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
            {!selectedArea?'Area':areas.find(area=>area.id===selectedArea)?.name || 'Select Area'} {" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[245px] p-4">
              <div className="max-h-52 overflow-y-scroll">
              <p className="text-md mb-2 font-medium text-black">Area</p>
              
              <RadioGroup value={selectedArea} onValueChange={(value)=>setSelectedArea(value)}>
                {areas?.map((area, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                  <RadioGroupItem value={area.id} id={`area${index}`} />
                  <Label htmlFor={`area${index}`}>
                    {area.name}
                  </Label>
                </div>))}
                
              </RadioGroup>
              {!areas?.length&&<div className="text-sm text-center">Please Select the city from top Menu</div>}
              </div>
              <PopoverClose className="w-full">
                <Button disabled={!areas?.length || !selectedArea} variant="default" onClick={()=>fetchJunctionData()} className="mt-2 w-full">
                  Apply
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
              Junction & Camera{" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4">
              {selectedArea&&<Accordion collapsible>
                <AccordionItem value="filter-1">
                  <AccordionTrigger>Junction</AccordionTrigger>
                  <AccordionContent className="max-h-40 overflow-y-scroll">
                    <RadioGroup value={selectedJunction} defaultValue={selectedJunction} onValueChange={(value)=>setSelectedJunction(value)}>
                      {/* {JSON.stringify(junctionList)} */}
                      {junctionList?.map((junction, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                        <RadioGroupItem value={junction.id} id={`junction${index}`} />
                        <Label htmlFor={`junction${index}`}>
                          {junction.name}
                        </Label>
                      </div>))}
                      {/* <Button variant="default" onClick={()=>fetchChannels()}>Apply</Button> */}
                    </RadioGroup>
                   
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="filter-2">
                  <AccordionTrigger>Camera</AccordionTrigger>
                  <AccordionContent className="max-h-40 overflow-y-scroll">
                    <RadioGroup value={selectedChannel} defaultValue={selectedChannel}  onValueChange={(value)=>setSelectedChannel(value)}>
                        {/* {JSON.stringify(junctionList)} */}
                        {channelList?.map((channel, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                          <RadioGroupItem value={channel.id} id={`channel${index}`} />
                          <Label htmlFor={`channel${index}`}>
                            {channel.ipName}
                          </Label>
                        </div>))}
                        {/* <Button variant="default" onClick={()=>fetchChannels()}>Apply</Button> */}
                      </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>}
              {selectedArea&&selectedChannel&&selectedJunction&&
              <PopoverClose className="w-full">
                <Button variant="default" className="mt-4 w-full">
                  Apply Location
                </Button>
              </PopoverClose>
              }
              {!selectedArea && <div className="text-xs text-center">Please Select Area</div>}
            </PopoverContent>
          </Popover>
          {/* <Popover>
            <PopoverTrigger className="flex flex-row items-center gap-2 rounded-md border p-2">
              Filter Options{" "}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[245px] px-3 py-0">
            <Accordion collapsible>
                <AccordionItem value="filter-1">
                  <AccordionTrigger>Registration Type</AccordionTrigger>
                  <AccordionContent className="px-2">
                    <RadioGroup value={selectedRegType} defaultValue={selectedRegType} onValueChange={(value)=>setSelectedRegType(value)}>
                      {regTypeData?.map((regType, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                        <RadioGroupItem value={regType.code} id={`regType${index}`} />
                        <Label htmlFor={`regType${index}`}>
                          {regType.name}
                        </Label>
                        
                      </div>))}
                      
                    </RadioGroup>
                   
                    
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="filter-2">
                  <AccordionTrigger>Vehicle Type</AccordionTrigger>
                  <AccordionContent className="px-2">
                    <RadioGroup value={selectedVehicleType} defaultValue={selectedVehicleType}  onValueChange={(value)=>setSelectedVehicleType(value)}>
                      
                      {vehicleTypes?.map((vehicle, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                          <RadioGroupItem value={vehicle.code} id={`vehicle${index}`} />
                          <Label htmlFor={`vehicle${index}`}>
                            {vehicle.name}
                          </Label>
                        </div>))}
                      </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
                {!compareType.includes("Traffic Flow")&&<AccordionItem value="filter-3">
                  <AccordionTrigger>Type of Violation</AccordionTrigger>
                  <AccordionContent className="px-2">
                    
                      {violationList?.map((violationType, index) => (<div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                        <Label htmlFor={`violationType${index}`}>
                          {violationType.alertname}
                        </Label>
                        <div className="grow flex justify-end"><Checkbox value={violationType.alerttype} id={`violationType${index}`} checked={selectedViolationType?.includes(violationType.alerttype)} onCheckedChange={(value)=>handleViolationTypeChange(value, violationType.alerttype)} /></div>
                        
                        
                        
                      </div>))}
                  </AccordionContent>
                </AccordionItem>}
              </Accordion>
            </PopoverContent>
          </Popover> */}
          <ResetIcon onClick={handleReset} cursor={"pointer"}/>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal gap-4",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
             {firstDate&&secondDate&&`${firstDate.toLocaleDateString()}`} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
             <path d="M8 20L6.6 18.575L9.175 16H2V14H9.175L6.6 11.425L8 10L13 15L8 20ZM16 14L11 9L16 4L17.4 5.425L14.825 8H22V10H14.825L17.4 12.575L16 14Z" fill="#6F6F70"/>
             </svg> {secondDate&&`${secondDate?.toLocaleDateString()}`}
             {!firstDate&&!secondDate&&"Select Dates to Compare"}
             {!firstDate&&secondDate&&"Select First Date"}
             {firstDate&&!secondDate&&"Select Second Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-row gap-2">
              <div>
                <div className="p-2 text-center">Select First Date</div>
                <Calendar
                  initialFocus
                  mode="single"
                  selected={firstDate}
                  onSelect={setFirstDate}
                />
              </div>
              <div>
              <div className="p-2 text-center">Select Second Date</div>
                <Calendar
                  initialFocus
                  mode="single"
                  selected={secondDate}
                  onSelect={setSecondDate}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 bg-white px-8 py-4">
        <div className="flex flex-row flex-wrap items-start justify-start gap-2">
          <div  className="flex flex-row items-center gap-2 text-xs">
          
          {selectedJunction&&selectedArea&&selectedChannel&&<div className="px-2 py-1 bg-blue-50 border rounded-md border-primary">{areas.find(area=>area.id===selectedArea)?.name}, {junctionList.find(junction=>junction.id===selectedJunction)?.name}, {channelList.find(channel=>channel.id===selectedChannel)?.name}
          </div>}
          {selectedRegType!==-1&&<div className="px-2 py-1 bg-blue-50 border rounded-md border-primary">{regTypeData.find(regType=>regType.code===selectedRegType)?.name} <Image src="/images/close.svg" className="inline-block" onClick={()=>setSelectedRegType(-1)} width={15} height={15} /> </div>}
          {selectedVehicleType!==-1&&<div className="px-2 py-1 bg-blue-50 border rounded-md border-primary">{vehicleTypes.find(vehicle=>vehicle.code===selectedVehicleType)?.name} <Image src="/images/close.svg" className=" inline-block" onClick={()=>setSelectedVehicleType(-1)([])} width={15} height={15} /> </div>}
          {selectedViolationType.length>0&&<div className="px-2  bg-blue-50 border rounded-md border-primary flex">
                {selectedViolationType.map((value)=>{
                  return <span className="border-r border-blue-300 p-1 last:border-none">{violationList.find(violation=>violation.alerttype==value)?.alertname} </span>
                })}
                 <Image src="/images/close.svg" className="ml-2" onClick={()=>setSelectedViolationType([])} width={15} height={15} /> 
            </div>}
           
          
          </div>

        </div>
        <Button variant="default" onClick={()=>compare()}>Add to compare</Button>
      </div>
    </div>
  )
}

export default ComparisonHeader;
