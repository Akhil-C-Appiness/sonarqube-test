"use client"
import dynamic from 'next/dynamic';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Image from 'next/image'
// import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"
import {format} from 'date-fns'
import {getScheduleList, saveScheduleConfiguration, updateScheduleConfiguration, deleteSchedule, getSpecialDays, saveSpecialDays} from '@/lib/api'

//remove value from array based on index

const Image = dynamic(() => import("next/image"));

const ScheduleConfig = ({schedule,hideVal})=>{
    const [selectedDates, setSelectedDates] = useState();
    const [specialDates, setSpecialDates] = useState();
    const [unixspecialDates, setUnixSpecialDates] = useState();
    const [scheduleList, setScheduleList] = useState([])
    const [selectedSchedule, setSelectedSchedule] = useState()
    const [recordonlyonmotion, setRecordonlyonmotion] = useState(true);
    const [fifo, setFifo] = useState(0);
    const[retentionDays, setRetentionDays] = useState(0);
    const [newSchedule, setNewSchedule] = useState("");
    const [open, setOpen] = useState(false)
    const [hideSpecialDate, setHideSpecialDate] = useState(false)
    const { toast } = useToast()
    useEffect(()=>{
        console.log("selectedDates",selectedDates);
        console.log("unixspecialDates",unixspecialDates);
    },[selectedDates,unixspecialDates])
    useEffect(()=>{
        if(hideVal===true){
            setHideSpecialDate(true)
        }
    },[hideVal])
    const fetchScheduleList = async () => {
        const slist = await getScheduleList()
        setScheduleList(slist)
    }
    const fetchSpecialDays = async() =>{
        const response = await getSpecialDays();
        const responseArray = response.data.result;
        setUnixSpecialDates(responseArray);
        const dateArray = responseArray.map((timestamp)=>{
            console.log("timestamp",timestamp);
            const dateObject = new Date(timestamp);
            const formattedDate = format(dateObject, 'dd MMM yyyy')
        return formattedDate;

            // const formattedDate = formatUnixTimestamp(item);
            // return formattedDate;
            
        })
        console.log(dateArray);
        setSpecialDates(dateArray);
        // setSelectedDates(dateArray);
    }
    useEffect(()=>{
        if(scheduleList?.length > 0 && !schedule){
            setSelectedSchedule(scheduleList[0])
        } else if(schedule){
            setSelectedSchedule(schedule)
        }
    }, [scheduleList])
    useEffect(()=>{
        if(selectedSchedule?.motionRecording == 1){
            setRecordonlyonmotion(true);
        }else{
            setRecordonlyonmotion(false);
        }
        if(selectedSchedule?.retentionDays > 0){
            setFifo(1)
            setRetentionDays(selectedSchedule?.retentionDays)
        }
        else{
            setFifo(0)
            setRetentionDays(0);
        }
    },[selectedSchedule])
    useEffect(()=>{
        fetchScheduleList()
        fetchSpecialDays()
    },[])
    const removeSpecialDate = (index) => {
        // console.log(index)
        const tmpDates = [...selectedDates]
        const remainingDates = tmpDates.filter((_, i) => i !== index);
        // console.log(remainingDates)
        setSelectedDates(remainingDates)
    }
    const removeSavedSpecialDate = (index) => {
        // console.log(index)
        const tmpDates = [...specialDates]
        const remainingDates = tmpDates.filter((_, i) => i !== index);
        setSpecialDates(remainingDates)
        const tmpDates2 = [...unixspecialDates]
        const remainingDates2 = tmpDates2.filter((_, i) => i !== index);
        setUnixSpecialDates(remainingDates2)
    }
    const changeSelectedSchedule = (selectedName)=>{
        // console.log(selectedName)
        const selectedSch = scheduleList.find((schedule)=>{
            return schedule.name === selectedName
        }
        )
        // console.log("changeSelectedSchedule",selectedSch)
        setSelectedSchedule(selectedSch)
    }
    const WeekDay = ({index})=>{
        const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Special']
        // console.log(weeks)
        // console.log(index)
        return weeks[index]
    }

    const updateScheduleSwitch = (weekIndex, hourIndex)=>{
        // console.log(weekIndex, hourIndex)
        // console.log(selectedSchedule?.recordingSchedule[weekIndex][hourIndex])
        var tmpSelectedSchedule = {...selectedSchedule}
        if(!tmpSelectedSchedule?.recordingSchedule[weekIndex][hourIndex]){
            tmpSelectedSchedule.recordingSchedule[weekIndex][hourIndex] = 1;
        }else{
            tmpSelectedSchedule.recordingSchedule[weekIndex][hourIndex] = 0;
        }
        
        setSelectedSchedule(tmpSelectedSchedule)
    }
    const handlerecordonlyonmotion = () => {
        setRecordonlyonmotion(!recordonlyonmotion);
    } 
    const handlefifo = (value) => {
        setFifo(value);
        if(value === 0){
            setRetentionDays(0)
        }
        else{
            setRetentionDays(selectedSchedule?.retentionDays)
        }
    } 
    const handleRetentionDays = (event) => {
        setRetentionDays(event.target.value)
    }
    const handleNewSchedule = (event) =>{
        setNewSchedule(event.target.value);
    }
    const handleAddNewSchedule = () => {
        let tempObj = {
            id : 0,
            motionRecording : 0,
            name : newSchedule,
            recordingSchedule : [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ],
            retentionDays:0,
            schedule: null,
            scheduleDay1: null,
            scheduleDay2: null,
            scheduleDay3: null,
            scheduleDay4: null,
            scheduleDay5: null,
            scheduleDay6: null,
            scheduleDay7: null,
            scheduleDaySPL:null
        }
        setScheduleList([...scheduleList, tempObj]);
        setOpen(false);
        setNewSchedule("");
    }
    const saveSchedule = async() =>{
        saveSpecialDates();
        let motionRecording = 0
        if(recordonlyonmotion == true){
            motionRecording = 1
        }
        if(selectedSchedule.id === 0){
            let payloadObj = {
                "name":selectedSchedule.name,
                "retentionDays":retentionDays,
                "motionRecording": motionRecording,
                "schedule": selectedSchedule.recordingSchedule
            }
            console.log("payloadObj",payloadObj);
            const response = await saveScheduleConfiguration(payloadObj);
            console.log(response);
            fetchScheduleList();
        }
        else{
            let payloadObj = {
                "id":selectedSchedule.id,
                "name":selectedSchedule.name,
                "retentionDays":retentionDays,
                "motionRecording": motionRecording,
                "schedule": selectedSchedule.recordingSchedule
            }
            console.log("payloadObj",payloadObj);
            const response = await updateScheduleConfiguration(payloadObj);
            console.log(response);
        }
    }
    const deleteSelectedSchedule = async() => {
        const id = selectedSchedule.id;
        if(selectedSchedule.id != 1){
            const response = await deleteSchedule(id);
            console.log(response);
        }
        else{
            toast({
                variant: "destructive",
                description: "Not able to delete "+selectedSchedule.name,
                duration:3000
              })
        }
        
    }
    const saveSpecialDates = async() =>{
        const unixselectedDates = selectedDates?.map((currentDate)=>{
            return Math.floor(currentDate.getTime()); 
        })
        let payload = [];
        if(unixspecialDates?.length > 0 && unixselectedDates?.length > 0){
            payload = unixspecialDates?.concat(unixselectedDates); 
        }else if(unixspecialDates?.length > 0){
            payload = unixspecialDates;
        }
        else if(unixselectedDates?.length > 0){
            payload =unixselectedDates;
        }
        const res = await saveSpecialDays(payload);
    }
    return <div className="pt-4">
        <div className="flex flex-row space-x-4 pt-4">
            <Label for="schedule_name" className="leading-8">Recording Schedule Details </Label>
            <Select value={selectedSchedule?.name} onValueChange={(selectedName)=>{changeSelectedSchedule(selectedName)}}>
                    <SelectTrigger className="w-[180px] font-medium ">
                    <SelectValue id="roles"  />
                    </SelectTrigger>
                    <SelectContent >
                        {scheduleList.map((schedule)=>{
                            return <SelectItem  value={schedule.name}>
                            {schedule.name}
                        </SelectItem>
                        })}
                    </SelectContent>
                    </Select>
                    {!schedule&&<div className=" flex flex-row items-center space-x-2  py-2">
                        <Checkbox checked={recordonlyonmotion} name="recordonlyonmotion" id="recordonlyonmotion" onCheckedChange={handlerecordonlyonmotion}/>
                        <label
                        htmlFor="recordonlyonmotion"
                        className="text-sm font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Record only on motion
                    </label>
                    </div>}
                    {!schedule&&<div className="flex grow justify-end pr-4">
                        <Button variant="blueoutline" onClick={setOpen}>Add New Schedule</Button>
                    </div>}
        </div>
       <div className="w-full overflow-auto pt-4">
       <div className="flex w-fit flex-row flex-nowrap">
       <div className=" w-24 border-b border-r border-slate-300  bg-blue-100 p-2 py-3  text-center text-xs font-semibold">Hours/Day</div>
            {selectedSchedule?.recordingSchedule && selectedSchedule?.recordingSchedule[0].map((val, ind)=>{
                return <div className=" w-12 border-b border-r border-slate-300  bg-blue-100 p-2 py-3  text-center text-xs font-semibold">{ind+1}</div>
            })}
        </div>
       <div className="flex w-fit flex-col">
        {/* <div className=" w-full p-2 bg-blue-100 text-center  text-xs font-semibold py-3  border-b border-r border-slate-300">Hour/Day</div> */}
            {selectedSchedule?.recordingSchedule && selectedSchedule?.recordingSchedule.map((sch, weekIndex)=>{
                return <div className="flex flex-row flex-nowrap">
                    <div className="w-24 border-b border-r border-slate-300  bg-blue-100 p-2 py-3  text-center text-xs font-semibold"><WeekDay index={weekIndex} /></div>
                        {sch.map((schStatus, hourIndex)=>{
                            return <div onClick={()=>updateScheduleSwitch(weekIndex, hourIndex)} className={`w-12 cursor-pointer px-2 py-3 ${weekIndex%2==0?'bg-slate-100':'bg-white'} border-b border-r border-slate-300 text-center text-xs font-semibold ${schStatus?'text-green-500':'text-red-500'} `}>{schStatus?'ON':'OFF'}</div>
                        })}
                    
                </div>
            })}
        </div>
       </div>
       
        <div className="mt-2">
            {/* {selectedSchedule?.retentionDays > 0 ? 1 : 0} fifo - {fifo} -- {retentionDays} */}
       {!hideSpecialDate && 

            <RadioGroup value={fifo} className="flex items-center justify-start gap-8" onValueChange={(value)=>handlefifo(value)}>
                <div className="flex items-center justify-start gap-2 py-2 text-sm text-slate-500">
                    <RadioGroupItem value={0} id="fifo" />
                    <Label htmlFor="fifo">FIFO Delete</Label>
                </div>
                <div className="flex items-center justify-start gap-2 py-2 text-sm text-slate-500">
                    <RadioGroupItem value={1} id="retention" />
                    <Label htmlFor="retention">Retention Period</Label>
                    <Input type="text" className="h-[40px] w-[60px] p-2" value={retentionDays} disabled={fifo === 0 ? true : false} onChange={(value) => handleRetentionDays(value)}/>Days
                </div>
            </RadioGroup>
}
        </div>
        <div className="py-4 font-semibold">
        {!hideSpecialDate && "Special Date Selection" }</div>
        <div className="flex flex-row">
        {!hideSpecialDate && (
            <>
        <div >
            <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            
            />
        </div>

        <div className="items- flex grow flex-wrap content-start items-start gap-4 border p-4 ">
        
            { specialDates?.map((date, index)=>{
                return <div className="flex h-10 w-fit rounded-xl border border-violet-400 bg-violet-50 p-2">
                        {date}
                    <div className="flex flex-row justify-end">
                        <Image src="/images/close-icon.svg" width={40} height={20} className="ml-2" onClick={()=>removeSavedSpecialDate(index)} alt="close icon"/>
                    </div>
                </div>
            
            })}
            {!hideSpecialDate && selectedDates?.map((date, index)=>{
                return <div className="flex h-10 w-fit rounded-xl border border-violet-400 bg-violet-50 p-2">
                        {format(date, 'dd MMM yyyy')} 
                    <div className="flex flex-row justify-end">
                        <Image src="/images/close-icon.svg" width={40} height={20} className="ml-2" onClick={()=>removeSpecialDate(index)} alt="close icon"/>
                    </div>
                </div>
            
            })}
        
        </div>
        </>
        )
}
        </div>

        {!schedule&&<div className="mt-4 flex justify-end">
            <Button variant="destructivoutline" onClick={() => deleteSelectedSchedule()}>Delete Schedule</Button>
            <Button variant="default" className="ml-4" onClick={() => saveSchedule()}>Save Schedule</Button>
        </div>}
        <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={"max-h-screen w-[500px] overflow-y-auto lg:max-w-screen-md"}
          >
            <DialogHeader>
              <DialogTitle>Add Schedule</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
                <Label>Please enter schedule name</Label>
                <Input type="text" value={newSchedule} onChange={(value)=>handleNewSchedule(value)} />
                <div className="flex items-center justify-end gap-2">
                    <Button variant="default" className="w-[100px]" onClick={() => handleAddNewSchedule()}>Add</Button>
                    <Button variant="outline" className="w-[100px] rounded-sm">Cancel</Button>
                </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    }
    
    export default ScheduleConfig;
    