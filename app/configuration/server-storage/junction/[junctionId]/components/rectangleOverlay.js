import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';

const RectangleOverlay = ({videoWidth, videoHeight, cameraId, onDataReceived, radarid, cameraName, radarname, zone, setOpen}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [rectangleId, setRectangleId] = useState(0);

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint({ x, y });
    setIsDrawing(true);
};

const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentRect({ start: startPoint, end: { x, y } });
};

const handleMouseUp = (e) => {
    if (currentRect) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRectangles((prev) => [...prev, { ...currentRect, end: { x, y } ,id: rectangleId, keyValue : 0, cameraId:cameraId}]);
        setCurrentRect(null);
        console.log(rectangles)
        setRectangleId(rectangleId+1)
    }
    setIsDrawing(false);
};
const clearMark = () =>{
  setRectangles([]);
  setRectangleId(0);
} 
const updateInput = (event, id) => {
  let keyval;
  if(event.target.value == ""){
    keyval = ""
  }
  else{
    keyval = parseInt(event.target.value)
  }
  const updatedObject = { 
    keyValue: keyval
  }; 
  setRectangles(prevData =>  prevData.map(obj => (obj.id === id ? { ...obj, ...updatedObject } : obj)))
}
const createZone = () =>{
  let zoneArray = [];
  rectangles.map((item)=>{
    let x1 = item.start.x;
    let y1 = item.start.y;
    let x2 = item.end.x;
    let y2 = item.end.y;
    const minValueX = Math.min(x1, x2);
    const maxValueX = Math.max(x1, x2);
    const minValueY = Math.min(y1, y2);
    const maxValueY = Math.max(y1, y2);
    let zoneObj = {
      "pointList" : [
        {
          "x":x1 > x2 ? x2 : x1,
          "y":y1 > y2 ? y2 : y1,
        },
        {
          "x":x1 < x2 ? x2 : x1,
          "y":y1 > y2 ? y2 : y1,
        },
        {
          "x":x1 < x2 ? x2 : x1,
          "y":y1 < y2 ? y2 : y1,
        },
        {
          "x":x1 > x2 ? x2 : x1,
          "y":y1 < y2 ? y2 : y1,
        },
      ],
      "referenceWidth" : Math.abs(maxValueX - minValueX),
      "referenceHeight": Math.abs(maxValueY - minValueY),
      "settingsKeyWord":item.keyValue
    }
    zoneArray.push(zoneObj);
  })
  let payloadObj = {
    "chId" : cameraId,
    "name" : cameraName,
    "radarName" : radarname,
    "radarId" : radarid,
    "zone" :zoneArray
  }
  // console.log("payloadObj",payloadObj)
  onDataReceived(payloadObj);
}
useEffect(()=>{
  if(zone.length > 0){
    let tempArray = [];
    zone.map((item)=>{
      let pointList = item.pointList
      // let start = pointList[0]
      // let end = pointList[2]
      // let keyValue = item.settingsKeyWord
      // let id = -1
      // let cameraId = cameraId
      let tempObj = {
        id : -1,
        cameraId : cameraId,
        keyValue : item.settingsKeyWord,
        start : pointList[0],
        end : pointList[2]
      }
      tempArray.push(tempObj);
    })
    setRectangles(tempArray)
  }
},[])
useEffect(()=>{
  console.log("rectangles",rectangles);
},[rectangles])
  return (
    <>
    <div 
      className="absolute top-0 left-0 w-full h-full bg-opacity-0 bg-gray-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {rectangles.map((rect, index) => (
        <div
          key={index}
          className="absolute flex items-center justify-center border"
          style={{
            left: rect.start.x,
            top: rect.start.y,
            width: rect.end.x - rect.start.x,
            height: rect.end.y - rect.start.y,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Fill the rectangle

          }}
        >
          <Input className='align-center h-[30px] w-[60px] rounded-none bg-[#fff] p-0'  id={"rect-"+rect.id} onChange={(value)=>updateInput(value,rect.id)} value={rect.keyValue}/>
        </div>
      ))}
      {currentRect && (
        <div
          className="absolute border"
          style={{
            left: currentRect.start.x,
            top: currentRect.start.y,
            width: currentRect.end.x - currentRect.start.x,
            height: currentRect.end.y - currentRect.start.y,
            borderWidth: '3px' 
          }}
        ></div>
      )}
      <div onClick={()=>clearMark()} className='p-4 cursor-pointer text-white right-0'>clear Mark</div>
      <div className='absolute bottom-[-60px] w-full'>
      <div className="z-50 mb-2 flex w-full items-center justify-end gap-2 bg-white">
      <Button variant="blueoutline" onClick={()=>setOpen(false)}>Cancel</Button>
      <Button variant="default" onClick={()=>createZone()}>Ok</Button>
    </div>
      </div>
    </div>
    
  </>
  );
};

export default RectangleOverlay;
