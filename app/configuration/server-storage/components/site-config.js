"use client"
import dynamic from 'next/dynamic';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Image from 'next/image'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
// import ProcessUnitAllocation  from "./processUnitAllocation";
import {Button} from "@/components/ui/button"
import { useState } from "react";
import { useEffect } from "react";
import { saveSiteName, getAnalyticsTypes, saveCleaningConfiguration, getCleaningConfiguration} from "@/lib/api"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const Image = dynamic(() => import("next/image"));
const ProcessUnitAllocation = dynamic(() => import("./processUnitAllocation"));

const SiteConfig = ()=>{
    const [disabled, setDisabled] = useState(true);
    const [showEdit, setShowEdit] = useState(true);
    const [siteName, setSiteName] = useState("");
    const [server, setServer] = useState("FIFO");
    const [selectedServer, setSelectedServe] = useState("Junction Server");
    const [selectedServerId, setSelectedServeId] = useState(2);
    const [analyticsTypes, setAnalyticsTypes] = useState([])
    const [analyticsType1, setAnalyticsType1] = useState([]);
    const [analyticsType2, setAnalyticsType2] = useState([]);
    const [akStatus, setAakStatus] = useState([]);
    const [akStatus2, setAakStatus2] = useState([]);
    const [selectAll1, setSelectAll1] = useState(false);
    const [selectAll2, setSelectAll2] = useState(false);
    const [selectAll3, setSelectAll3] = useState(false);
    const [selectAll4, setSelectAll4] = useState(false);
    const [analyticsTypeId, setAnalyticsTypeId] = useState([]);
    const [duration1, setDuration1] = useState(30);
    const [duration2, setDuration2] = useState(30);
    const [duration3, setDuration3] = useState(30);
    const handleCheckboxChange = (checkboxValue) => {
        setAnalyticsType1((prevSelected) => {
          if (prevSelected.includes(checkboxValue)) {
            return prevSelected.filter((item) => item !== checkboxValue);
          } else {
            return [...prevSelected, checkboxValue];
          }
        });
    }; 
    const handleCheckboxChange2 = (checkboxValue) => {
        setAnalyticsType2((prevSelected) => {
          if (prevSelected.includes(checkboxValue)) {
            return prevSelected.filter((item) => item !== checkboxValue);
          } else {
            return [...prevSelected, checkboxValue];
          }
        });
    }; 
    const handleCheckboxChange3 = (checkboxValue) => {
        setAakStatus((prevSelected) => {
          if (prevSelected.includes(checkboxValue)) {
            return prevSelected.filter((item) => item !== checkboxValue);
          } else {
            return [...prevSelected, checkboxValue];
          }
        });
    }; 
    const handleCheckboxChange4 = (checkboxValue) => {
        setAakStatus2((prevSelected) => {
          if (prevSelected.includes(checkboxValue)) {
            return prevSelected.filter((item) => item !== checkboxValue);
          } else {
            return [...prevSelected, checkboxValue];
          }
        });
    }; 
    const handleAll1 = () => {
        if(selectAll1 == false){
            setAnalyticsType1(analyticsTypeId);
        }
        else{
            setAnalyticsType1([]);
        }
        setSelectAll1(!selectAll1)
    } 
    const handleAll2 = () => {
        if(selectAll2 == false){
            setAnalyticsType2(analyticsTypeId);
        }
        else{
            setAnalyticsType2([]);
        }
        setSelectAll2(!selectAll2)
    } 
    const handleAll3 = () => {
        if(selectAll3 == false){
            setAakStatus(akStatusListid);
        }
        else{
            setAakStatus([]);
        }
        setSelectAll3(!selectAll3)
    }
    const handleAll4 = () => {
        if(selectAll4 == false){
            setAakStatus2(akStatusListid);
        }
        else{
            setAakStatus2([]);
        }
        setSelectAll4(!selectAll4)
    } 
    useEffect(() => {
        setSiteName(localStorage.getItem("siteName"));
        const getanalyticsTypes = async() => {
            const anTypes = await getAnalyticsTypes();
            setAnalyticsTypes(anTypes);
            anTypes.map((elm)=>{
                if (!analyticsTypeId.includes(elm.alerttype)) {
                    analyticsTypeId.push(elm.alerttype);
                }
            })
            // console.log("analyticsTypeId",analyticsTypeId)
        }
        getanalyticsTypes();
        const getcleaningResponse = async() => {
            const response = await getCleaningConfiguration();
            const dataArray = response.data.result;
            // console.log("getcleaningResponse",dataArray);
            const eventTypeArray1 = [];
            const ackTypeArray1 = [];
            const eventTypeArray2 = [];
            const ackTypeArray2 = [];
            dataArray.map((item)=>{
                // console.log("item",item);
                if(item.componentId == 1 && item.processId == 2){
                    setSelectedServe("Junction Server");
                    setServer("FIFO");
                }
                if(item.componentId == 1 && item.processId == 1){
                    setServer("Retention");
                    setSelectedServe("Central Server");
                    setDuration1(item.retentionValue)
                }
                else if(item.componentId == 2){
                    if(item.retention && duration2 !== item.retentionValue){
                        setDuration2(item.retentionValue)
                    }
                    if(!eventTypeArray1.includes(item.eventType)){
                        eventTypeArray1.push(item.eventType);
                    }
                    if(!ackTypeArray1.includes(item.eventAckStatus)){
                        ackTypeArray1.push(item.eventAckStatus);
                    }
                    
                }
                else if(item.componentId == 3){
                    if(item.retention && duration3 !== item.retentionValue){
                        setDuration3(item.retentionValue)
                    }
                    if(!eventTypeArray2.includes(item.eventType)){
                        eventTypeArray2.push(item.eventType);
                    }
                    if(!ackTypeArray2.includes(item.eventAckStatus)){
                        ackTypeArray2.push(item.eventAckStatus);
                    }
                }
            })
            setAnalyticsType1(eventTypeArray1);
            setAnalyticsType2(eventTypeArray2);
            setAakStatus(ackTypeArray1);
            setAakStatus2(ackTypeArray2);
        }
        getcleaningResponse();
    }, [])
    const handleButton = () => {
        setShowEdit(!showEdit);
        setDisabled(false);
    };
    const handleCancelButton = () => {
        setShowEdit(!showEdit);
        setDisabled(!disabled);
        setSiteName(localStorage.getItem("siteName"));
    };
    const handleTextChange = (event) => {
        setSiteName(event.target.value);
    };
    const updateSiteName = async () =>{
        const response = await saveSiteName(siteName);
        if(response.status == 200){
            setShowEdit(!showEdit);
            setDisabled(!disabled);
            localStorage.setItem("siteName",siteName)
        }
    } 
const serverList = [
    {
        id: 1,
        name: 'Central Server'
    },
    {
        id: 2,
        name: 'Junction Server'
    },
];
const akStatusList = [
    {
        id: 0,
        name: 'Unchecked'
    }, {
        id: 1,
        name: 'Valid Event'
    }, {
        id: 2,
        name: 'Spurious'
    }, {
        id: 3,
        name: 'Auto Valid'
    }, {
        id: 4,
        name: 'Auto Spurious'
    }
]
const akStatusListid = [0,1,2,3,4];
// const updateServer = (value)=>{
//     console.log(value)
// }
const updateServerType = (value) => {
    if(value == 1){
        setServer("Retention");
        setSelectedServe("Central Server");
        setSelectedServeId(1)
    }
    else if(value == 2){
        setServer("FIFO");
        setSelectedServe("Junction Server")
        setSelectedServeId(2)
    }
}
const setTextDuration1 = (event) => {
    if(event.target.value !== ""){
        setDuration1(parseInt(event.target.value));
    }
    else{
        setDuration1();
    }  
}
const setTextDuration2 = (event) => {
    if(event.target.value !== ""){
        setDuration2(parseInt(event.target.value));
    }
    else{
        setDuration2();
    }  
}
const setTextDuration3 = (event) => {
    if(event.target.value !== ""){
        setDuration3(parseInt(event.target.value));
    }
    else{
        setDuration3();
    }  
}
const saveCleaningConfig = async() =>{
    //Continuous recording cleaning
    const payload1 = [
        {
            "processId": selectedServerId,
            "componentId": 1,
            "eventAckStatus": -1,
            "eventType": -1,
            "fifo": selectedServerId == 1 ? false : true,
            "retention": selectedServerId == 1 ? true : false,
            "retentionValue": selectedServerId == 1 ? duration1 : 0,
        }
    ]
    //Clean application generated event clip
    const payload2 = [];
    analyticsType1.map((item)=>{
        akStatus.map((akItem)=>{
            let itemObj={
                "processId": selectedServerId,
                "componentId": 2,
                "eventAckStatus" : akItem,
                "eventType": item,
                "fifo": selectedServerId == 1 ? false : true,
                "retention": selectedServerId == 1 ? true : false,
                "retentionValue": selectedServerId == 1 ? duration2 : 0,
            }
            payload2.unshift(itemObj);
        })
    })
    //Clean ANPR/RLVD event metadata
    const payload3 = [];
    analyticsType2.map((item)=>{
        akStatus2.map((akItem)=>{
            let itemObj={
                "processId": selectedServerId,
                "componentId": 3,
                "eventAckStatus" : akItem,
                "eventType": item,
                "fifo": selectedServerId == 1 ? false : true,
                "retention": selectedServerId == 1 ? true : false,
                "retentionValue": selectedServerId == 1 ? duration2 : 0,
            }
            payload3.unshift(itemObj);
        })
    })
    const mergedPayload = [...payload1, ...payload2, ...payload3];
    // console.log("mergedPayload",mergedPayload)
    const response = await saveCleaningConfiguration(mergedPayload);
}
return <div>
    <div className="py-4">
        <Label htmlFor="sitename" className="text-sm text-slate-500">Site Name</Label>
        <div className="flex items-center justify-start gap-2">
            <Input name="sitename" placeholder="Enter Site Name" className="w-[400px] p-2" autocomplete="off" disabled = {disabled} value={siteName} onChange={handleTextChange}/>
            {showEdit ? 
                <Button variant="outline" className="rounded" onClick={handleButton}><Image src="/images/edit_icon_grey.svg" width={20} height={20} alt="edit" /></Button>
            :
            <>
                <Button variant="default" className="rounded" onClick={updateSiteName}>Save</Button>
                <Button variant="outline" className="rounded" onClick={handleCancelButton}>Cancel</Button>
            </>
            }
        </div>
    </div>
    <hr />
    <div className="py-4">
        <h3 className="font-semibold">Cleaning Configuration</h3>
    </div>
    <div className="rounded-sm border p-4">
            <div className="mb-4 flex flex-row">
                <div className="w-4/6">
                    <Label htmlFor="server" className="text-sm text-slate-500">Select Server</Label>
                    <Select  onValueChange={(value)=>updateServerType(value)} defaultValue={""}>
                        <SelectTrigger className=" w-96">
                            <SelectValue>{selectedServer}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Select Server</SelectLabel>
                            {serverList.map((item, index) => {
                                return (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                </SelectItem>
                                );
                            })}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                </div>
                <div className="w-2/6">
                    <Label htmlFor="server" className="text-slate-500 text-sm">Continuous recording cleaning</Label>
                    <br />
                    {server === "FIFO" ? 
                    <div className="inline-block bg-blue-50 p-2 font-semibold">{server}</div>
                    :
                    <>
                        <Popover>
                            <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                            <p>After {duration1} days</p>
                                <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                            </PopoverTrigger>
                            <PopoverContent className="w-[290px] p-3">
                            <Input name="custom-time-1" placeholder="Enter custom duration" className="mb-2 p-2" autocomplete="off" value={duration1} onChange={(value)=>setTextDuration1(value)} />
                                <RadioGroup defaultValue={duration1} onValueChange={(value)=>setDuration1(value)}>
                                    <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                        <Label htmlFor="duration-option-9">After 30 days</Label>
                                        <RadioGroupItem value={30} id="duration-option-9" />
                                    </div>
                                    <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                        <Label htmlFor="duration-option-10">After 60 days</Label>
                                        <RadioGroupItem value={60} id="duration-option-10" />
                                    </div>
                                    <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                        <Label htmlFor="duration-option-11">After 90 days</Label>
                                        <RadioGroupItem value={90} id="duration-option-11" />
                                    </div>
                                    <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                        <Label htmlFor="duration-option-12">After 180 days</Label>
                                        <RadioGroupItem value={180} id="duration-option-12" />
                                    </div>
                                </RadioGroup>
                            </PopoverContent>
                        </Popover>
                    </>
                    }
                </div>
            </div>
            <hr />
            <div className="py-4">
                <h3 className="font-semibold">Clean application generated event clip</h3>
                <div className="my-4 flex flex-row">
                    <div className="w-1/3">
                        <Label htmlFor="server" className="text-sm text-slate-500">Analytics Type</Label>
                        <Popover>
                            <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                            <p></p>
                                <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                            </PopoverTrigger>
                            <PopoverContent className="h-[300px] w-[290px] overflow-scroll p-3">
                                <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id="all" value="all"
                                            checked={selectAll1}
                                            onCheckedChange={handleAll1}
                                            className="border-slate-400"
                                        />
                                    <Label htmlFor="all" className="text-sm font-medium leading-none text-slate-500">
                                        All
                                    </Label>
                                </div>
                                {analyticsTypes?.map(type => {
                                    return <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id={type.alerttype} value={type.alerttype} key={type.alerttype}
                                        checked={analyticsType1.includes(type.alerttype)}
                                        onCheckedChange={()=>handleCheckboxChange(type.alerttype)}
                                        className="border-slate-400"
                                    />
                                    <Label htmlFor={type.alerttype} className="text-sm font-medium leading-none text-slate-500">
                                        {type.alertname}
                                    </Label>
                                </div>
                                })}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="ml-4 w-1/3">
                        <Label htmlFor="server" className="text-sm text-slate-500">Acknowledge Status</Label>
                        <Popover>
                            <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                                <p></p>
                                <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                            </PopoverTrigger>
                            <PopoverContent className="w-[290px] overflow-scroll p-3">
                                <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id="all" value="all"
                                            checked={selectAll3}
                                            onCheckedChange={handleAll3}
                                            className="border-slate-400"
                                        />
                                    <Label htmlFor="all" className="text-sm font-medium leading-none text-slate-500">
                                        All
                                    </Label>
                                </div>
                                {akStatusList?.map(item => {
                                    return <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id={item.id} value={item.id} key={item.id}
                                        checked={akStatus.includes(item.id)}
                                        onCheckedChange={()=>handleCheckboxChange3(item.id)}
                                        className="border-slate-400"
                                    />
                                    <Label htmlFor={item.id} className="text-sm font-medium leading-none text-slate-500">
                                        {item.name}
                                    </Label>
                                </div>
                                })}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-1/3">
                        {server === "FIFO" ? 
                            <>
                                {/* <p>Cleaning Period</p> */}
                                <div className="mt-6 inline-block bg-blue-50 p-2 font-semibold">{server}</div>
                            </>
                            :
                            <>
                                <Label htmlFor="server" className="text-sm text-slate-500">Cleaning Period</Label>
                                <Popover>
                                    <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                                    <p>After {duration2} days</p>
                                        <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[290px] p-3">
                                    <Input name="custom-time-2" placeholder="Enter custom duration" className="mb-2 p-2" autocomplete="off" value={duration2} onChange={(value)=>setTextDuration2(value)} />
                                        <RadioGroup defaultValue={duration2} onValueChange={(value)=>setDuration2(value)}>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-5">After 30 days</Label>
                                                <RadioGroupItem value={30} id="duration-option-5" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-6">After 60 days</Label>
                                                <RadioGroupItem value={60} id="duration-option-6" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-7">After 90 days</Label>
                                                <RadioGroupItem value={90} id="duration-option-7" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-8">After 180 days</Label>
                                                <RadioGroupItem value={180} id="duration-option-8" />
                                            </div>
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    </div>
                </div>
            </div>
            <hr />
            <div className="py-4">
                <h3 className="font-semibold">Clean ANPR/RLVD event metadata</h3>
                <div className="my-4 flex flex-row">
                    <div className="w-1/3">
                        <Label htmlFor="server" className="text-slate-500 text-sm">Analytics Type</Label>
                        <Popover>
                            <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                            <p></p>
                                <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                            </PopoverTrigger>
                            <PopoverContent className="h-[300px] w-[290px] overflow-scroll p-3">
                                <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id="all" value="all"
                                            checked={selectAll2}
                                            onCheckedChange={handleAll2}
                                            className="border-slate-400"
                                        />
                                    <Label htmlFor="all" className="text-sm font-medium leading-none text-slate-500">
                                        All
                                    </Label>
                                </div>
                                {analyticsTypes?.map(type => {
                                    return <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id={type.alerttype} value={type.alerttype} key={type.alerttype}
                                        checked={analyticsType2.includes(type.alerttype)}
                                        onCheckedChange={()=>handleCheckboxChange2(type.alerttype)}
                                        className="border-slate-400"
                                    />
                                    <Label htmlFor={type.alerttype} className="text-sm font-medium leading-none text-slate-500">
                                        {type.alertname}
                                    </Label>
                                </div>
                                })}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="ml-4 w-1/3">
                        <Label htmlFor="server" className="text-slate-500 text-sm">Acknowledge Status</Label>
                        <Popover>
                            <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                                <p></p>
                                <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                            </PopoverTrigger>
                            <PopoverContent className="w-[290px] overflow-scroll p-3">
                                <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id="all" value="all"
                                            checked={selectAll4}
                                            onCheckedChange={handleAll4}
                                            className="border-slate-400"
                                        />
                                    <Label htmlFor="all" className="text-sm font-medium leading-none text-slate-500">
                                        All
                                    </Label>
                                </div>
                                {akStatusList?.map(item => {
                                    return <div className="flex items-center space-x-2 p-2">
                                    <Checkbox id={item.id} value={item.id} key={item.id}
                                        checked={akStatus2.includes(item.id)}
                                        onCheckedChange={()=>handleCheckboxChange4(item.id)}
                                        className="border-slate-400"
                                    />
                                    <Label htmlFor={item.id} className="text-sm font-medium leading-none text-slate-500">
                                        {item.name}
                                    </Label>
                                </div>
                                })}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-1/3">
                        {server === "FIFO" ? 
                            <div className="mt-6 inline-block bg-blue-50 p-2 font-semibold">{server}</div>
                            :
                            <>
                                <Label htmlFor="server" className="text-sm text-slate-500">Cleaning Period</Label>
                                <Popover>
                                {/* Enter custom duration */}
                                    <PopoverTrigger className="flex w-[290px] flex-row items-center justify-between gap-2 rounded-md border p-2">
                                    <p>After {duration3} days</p>
                                        <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[290px] p-3">
                                        <Input name="custom-time-3" placeholder="Enter custom duration" className="mb-2 p-2" autocomplete="off" value={duration3} onChange={(value)=>setTextDuration3(value)} />
                                        <RadioGroup defaultValue={duration3} onValueChange={(value)=>setDuration3(value)}>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-1">After 30 days</Label>
                                                <RadioGroupItem value={30} id="duration-option-1" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-2">After 60 days</Label>
                                                <RadioGroupItem value={60} id="duration-option-2" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-3">After 90 days</Label>
                                                <RadioGroupItem value={90} id="duration-option-3" />
                                            </div>
                                            <div className="flex items-center justify-between py-2 text-sm text-slate-500">
                                                <Label htmlFor="duration-option-4">After 180 days</Label>
                                                <RadioGroupItem value={180} id="duration-option-4" />
                                            </div>
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="my-2 flex flex-row items-center justify-end">
                    <Button variant="default" onClick={saveCleaningConfig}>Save</Button>
                </div>
            </div>
    </div>
    
    <ProcessUnitAllocation />
</div>
}

export default SiteConfig;
