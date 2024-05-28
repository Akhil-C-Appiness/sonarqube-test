
"use client"
import dynamic from 'next/dynamic';

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
// import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import ReactPlayer from "react-player"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { searchAccident, getImage } from "@/lib/api"
const Image = dynamic(() => import("next/image"));

const AMConfig = ()=>{
    let today = new Date()
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
    const [date, setDate] = useState(yesterday)
    const [date2, setDate2] = useState(today)
    const [type, setType] = useState(-1)
    const [key, setKey] = useState("")
    const [resultArray, setResultArray] = useState([]);
    const [selectedItem,setSelectedItem] = useState({"id":"",
    "username": "",
    "firNumber": "",
    "date": "",
    "time": "",
    "nameOfPlace":"",
    "policeStation":"",
    "accidentType":"",
    "noOfPersonKilled":"",
    "noOfPersonGrievoulsyInjuord":"",
    "noOfPersonMinorInjuord":"",
    "noofmotorisedvehicleinvolved":"",
    "noofnonmotorisedvehicleinvolved":"",
    "noofpersoninvolved":"",
    "hitandrun":"",
    "snapUrls":null
});
    const setAccidentType = (val) =>{
        setType(val);
    }
    const setKeyValue = (val) =>{
        setKey(val);   
    }
    useEffect(()=>{
        // console.log("resultArray",resultArray)
        // console.log("selectedItem",selectedItem.firNumber)
    },[resultArray,selectedItem])
    const searchAccidents = async() =>{
        const payload = {
            "startTimestamp" : Math.floor(date.getTime()),
            "endTimestamp": Math.floor(date2.getTime()),
            "accidentType": type,
            "textFilter":key
        }
        const response = await searchAccident(payload);
        const responseArray = response.data.result;
        console.log("responseArray",responseArray);
        const tempArray = [];
        const accidentTypeObj = {
            "-1":"All",
            "0":"Fatal",
            "1":"Grievously injured (Hospitalised)",
            "2":"Minor injury (not hospitalised)",
            "3":"Non-injury"
        }
        if(responseArray.length > 0){
            responseArray?.map(async(item,index)=>{
                let timestamp = item.timestamp;
                let datetime = new Date(timestamp).toLocaleString()
                let datetimeArray = datetime.split(",")
                let date = datetimeArray[0]
                let time = datetimeArray[1]
                let base64String = null;
                if(item.snapUrls[0] !== null){
                    let payload = {
                        filepath: item.snapUrls[0]
                    }
                    const snapResponse = await getImage(payload)
                    if(snapResponse.status == 200){
                        base64String = "data:image/png;base64," + snapResponse.data.result[0]
                    }
                }
                const tempObj = {
                    "id":item.id,
                    "username": item.username,
                    "firNumber": item.firNumber,
                    "date": date,
                    "time": time,
                    "nameOfPlace":item.nameOfPlace,
                    "policeStation":item.policeStation,
                    "accidentType":accidentTypeObj[item.accidentType],
                    "noOfPersonKilled":item.noOfPersonKilled,
                    "noOfPersonGrievoulsyInjuord":item.noOfPersonGrievoulsyInjuord,
                    "noOfPersonMinorInjuord":item.noOfPersonMinorInjuord,
                    "noofmotorisedvehicleinvolved":item.noofmotorisedvehicleinvolved,
                    "noofnonmotorisedvehicleinvolved":item.noofnonmotorisedvehicleinvolved,
                    "noofpersoninvolved":item.noofpersoninvolved,
                    "hitandrun":item.hitandrun,
                    "snapUrls":base64String
                }
                setResultArray((prevArray) => [...prevArray, tempObj])
                if(index == 0){
                    setSelectedItem(tempObj)
                }
            })
        }
    }
    function handleEvent(data) {
        let lastElementitem = resultArray.find((element) => {
          return element.id == data
        })
        setSelectedItem(lastElementitem)
    }
    const copyToClipboard = async (text) => {
        try {
          await navigator.clipboard.writeText(text)
        } catch (error) {
          console.error("Failed to copy text:", error)
        }
    }
    return (
        <>
        <div className="p-8">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[20px] font-semibold">Accidental Management</h1>
                <Button variant="outline" className="w-[140px] gap-2 rounded-sm border-[#2A94E5] text-[#2A94E5]">
                <Image src="/vectors/Exportanti.svg" width="20" height="20"  alt="icon" />
                    Export
                </Button>
            </div>
            <div className="mt-8 flex flex-row flex-wrap items-end justify-between">
                <div className="flex flex-col items-center gap-2">
                    <p>Start Range <br /></p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[200px] justify-start rounded-sm text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p>End Range<br /></p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[200px] justify-start rounded-sm text-left font-normal",
                                !date2 && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date2 ? format(date2, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={date2}
                            onSelect={setDate2}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p>Accident Type</p>
                    <Select value={type} onValueChange={(value)=>setAccidentType(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent className="w-[200px]">                                                            
                            <SelectItem value={-1}>All</SelectItem>
                            <SelectItem value={0}>Fatal</SelectItem>
                            <SelectItem value={1}>Grievously injured (Hospitalised)</SelectItem>
                            <SelectItem value={2}>Minor Injury (Not Hospitalised)</SelectItem>
                            <SelectItem value={3}>Non-injury</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p>key</p>
                    <Input placeholder="Enter Vehicle Number*" className="py-2" autoComplete="off" onChange={(event)=>{setKeyValue(event.target.value)}}/>
                </div>                            
                <Button variant="default" className="mb-2 w-[86px]" onClick={()=>searchAccidents()}>Search</Button>
            </div>
            <hr className="mt-4 w-full"/>
            {resultArray.length > 0 ? 
            <div className='mt-8 flex w-full flex-row flex-wrap justify-between '>
                <div className="flex w-[62%] flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between gap-2 bg-[#EEF8FF] p-2 text-secondary-foreground hover:bg-secondary/80">
                            <p className="">FIR number: {selectedItem?.firNumber}</p><Image src="/vectors/Copy.svg" width="24" height="24"  alt="icon"  onClick={()=>copyToClipboard(selectedItem?.firNumber)}/>
                        </div>
                        <p>{selectedItem?.accidentType} | {selectedItem?.nameOfPlace}</p>
                    </div>
                    <div className="w-full">
                        {selectedItem.snapUrls !== null ? 
                            <Image src={selectedItem.snapUrls} alt="img" width="100" height="300" className="w-full h-auto"/>
                            :
                            <></>
                        }
                    </div>
                    <table className="w-full border-collapse border-2 border-gray-200 p-4">
                        <tbody>
                            <tr>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">User Name</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.username}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Date & Time</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.date} | {selectedItem?.time}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Police Station</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.policeStation}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Persons Killed</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.noOfPersonKilled}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Grievously Injured Persons</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.noOfPersonGrievoulsyInjuord}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Minority in Persons</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.noOfPersonMinorInjuord}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Non-motorized vehicle involved</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.noofmotorisedvehicleinvolved}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Pedestrian involved</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.noofpersoninvolved}</p>
                                </td>
                                <td className="border-collapse border-2 border-gray-200 p-4">
                                    <p className="text-xs">Hit and Run</p>
                                    <p className="mt-2 text-sm font-medium text-black">{selectedItem?.hitandrun == true ? "Yes" : "No"}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='max-h-screen w-[35%] overflow-y-scroll px-2 shadow-inner'>
                    <div className='flex flex-wrap items-center justify-between'>
                        {resultArray?.map((item)=>(
                            <div className="mx-auto mt-4 flex h-[110px] w-full flex-col gap-4 rounded bg-[#F7F7F7] p-4" onClick={()=>handleEvent(item.id)} key={item.id}>
                                <p className="text-[14px] text-[#6F6F70]">{item.date} | {item.time}</p>
                                <p className="text-[14px] font-bold text-[#6F6F70]">{item.accidentType} | {item.nameOfPlace}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :<></>}
        </div> 
        </>
    )
}

export default AMConfig