"use client"
import React, { useState, useEffect } from "react"
import EventsDetails from '@/components/event-details'
import Filteroptions from '@/components/filteroptions'
import NewEvents from '@/components/new-events'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EventViewerPopup from '@/components/event-viewer-popup'

export default function HotlistedEvents({hotlistedevent, lasthotlistedElement}) {
    let [hotlistedevents, sethotlistedevents] = useState(hotlistedevent);
    let [recenthotlistedevents, setRecenthotlistedevents] = useState(hotlistedevent);
    let [lastHotlistedElement, setlastHotlistedElement] = useState(lasthotlistedElement);
    let [colorfilterValues, setcolorfilterValues] = useState([]);
    let [regTypeValues, setregTypeValues] = useState([]);
    let [violationTypeValues, setviolationTypeValues] = useState([]);
    let [selectedElement, setselectedElement] = useState({});
    const [open2, setOpen2] = useState(false)
    let filteredHotlistedArray = [];
    let regfilteredHotlistedArray = [];
    let violationfilteredHotlistedArray = [];
    useEffect(()=>{
        let mergedHotlistedArray = [];
        if(colorfilterValues.length > 0){
            filteredHotlistedArray = hotlistedevents.filter(obj => colorfilterValues.includes(obj.color));
        }
        if(regTypeValues.length > 0){
            regfilteredHotlistedArray = hotlistedevents.filter(obj => regTypeValues.includes(obj.registrationType));
        }
        if(violationTypeValues.length > 0){
            violationfilteredHotlistedArray = hotlistedevents.filter(obj => violationTypeValues.includes(obj.violationType));
        }
        if(colorfilterValues.length > 0 || regTypeValues.length > 0 || violationTypeValues.length > 0)
        {
              mergedHotlistedArray = [
                ...filteredHotlistedArray,
                ...regfilteredHotlistedArray.filter(obj2 => !filteredHotlistedArray.some(obj1 => obj1.id === obj2.id))
              ];
              mergedHotlistedArray = [
                ...mergedHotlistedArray,
                ...violationfilteredHotlistedArray.filter(obj2 => !mergedHotlistedArray.some(obj1 => obj1.id === obj2.id))
              ];
              setRecenthotlistedevents([mergedHotlistedArray]);
              setlastHotlistedElement(mergedHotlistedArray.slice(-1));
        }
        else{
            setRecenthotlistedevents(hotlistedevents);
            setlastHotlistedElement(lasthotlistedElement);
        }
    },[colorfilterValues,regTypeValues,violationTypeValues,hotlistedevents])
    
    const submitHotlistedFilter = (event, option) => {
        if (event) {
            setcolorfilterValues([...colorfilterValues, option]);
        } else {
            setcolorfilterValues(colorfilterValues.filter((val) => val !== option));
        }
    }
    const submitHotlistedregFilter = (event, option) => {
        if (event) {
            setregTypeValues([...regTypeValues, option]);
        } else {
            setregTypeValues(regTypeValues.filter((val) => val !== option));
        }
      
    }
    const submitHotlistedViolationFilter = (event, option) => {
        if (event) {
            setviolationTypeValues([...violationTypeValues, option]);
          } else {
            setviolationTypeValues(violationTypeValues.filter((val) => val !== option));
          }
      
    }
    const clearAll = () =>{
        setcolorfilterValues([]);
        setregTypeValues([]);
        setviolationTypeValues([]);
    }
    function handleHotlistedEvent(data){
        let lastElementitem = hotlistedevents.find((element) => {
            return element.id == data;
          });
          setlastHotlistedElement(lastElementitem);
    }
    function downloadHotlistedSnap(data){
        let selectedSnapobj = hotlistedevents.find((element) => {
            return element.id == data;
        });
        let snapsrc = selectedSnapobj.eventsrc;
        const link = document.createElement('a');
        link.href = snapsrc; // Replace with the actual path to your image
        link.download = `${data}.jpg`; // Replace with the desired filename for the downloaded image
        link.click();
    }
    function viewEventDetails(data){
        let selectedElement = hotlistedevents.find((element) => {
            return element.id == data;
        });
        setselectedElement(selectedElement);
        setOpen2(true)
    }
    return (
        <>
            {recenthotlistedevents.length > 0 ? (
            <div className='flex w-full flex-row flex-wrap justify-between'>
                <EventsDetails eventDetailObj = {lastHotlistedElement} downloadSnap={downloadHotlistedSnap} viewEventDetails={viewEventDetails}/>
                <div className='w-[35%] p-2 shadow-inner'>
                    <div className='flex flex-wrap items-center justify-between'>
                        <Filteroptions onCheckboxChange={submitHotlistedFilter} colorfilterValues={colorfilterValues} regTypeValues={regTypeValues} onChangereg={submitHotlistedregFilter} onChangeviolation={submitHotlistedViolationFilter} violationTypeValues={violationTypeValues} clearAl={clearAll}/>
                    </div>
                    <Accordion type="single" collapsible className='mt-6'>
                        <AccordionItem value="filter-1">
                            <AccordionTrigger className='bg-[#EEF8FF] px-4'>View New Hotlisted Events</AccordionTrigger>
                            <AccordionContent>
                                {recenthotlistedevents.map((eventImgObj,index) => (
                                <NewEvents id={eventImgObj.id} eventImgObj={eventImgObj} onClick={handleHotlistedEvent}/>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Dialog open={open2} onOpenChange={setOpen2} >
                        <DialogContent className={"max-h-screen w-[800px] overflow-y-scroll lg:max-w-screen-md"}>
                        <DialogHeader>
                            <DialogTitle>Event Viewer</DialogTitle>
                            <DialogDescription>
                                <EventViewerPopup eventImgObj={selectedElement} downloadSnap={downloadHotlistedSnap}/>
                            </DialogDescription>
                        </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            
            </div>) : (<></>)
        }
        </>
    )
}
