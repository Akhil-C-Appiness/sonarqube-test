import { Button } from '@/components/ui/button';
import React, { useRef, useEffect, useState } from 'react';


function ViewAnalyticsImage({ zoneList,image, arrowDirection, setImageWidth, setImageHeight, setPoints, imageWidth, imageHeight,setZoneArray }) {
  const canvasRef = useRef(null);
  const [markZone, setMarkZone] = useState(true)
  const [pointsArray, setPointsArray] = useState([])
  const points = useRef([]);
  const isFinished = useRef(false);
  const img = useRef(new Image());
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [zoneListArray, setZoneListArray] = useState(zoneList);
  useEffect(()=>{
    let tempArray = [];
  console.log("Current zoneListArray: ", zoneListArray);  // Debugging line
  zoneListArray.map((obj,index)=>{
      if(index !== 0){
        tempArray.push(obj.pointList);
      }
  });
  setPointsArray(tempArray);
    
  },[zoneListArray])
  useEffect(()=>{
    console.log("pointsArray",pointsArray)
    setTimeout(()=>{
      draw();
    }, 100)
  },[pointsArray])
  useEffect(() => {
    img.current.onload = function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.current.width;
      canvas.height = img.current.height;
      ctx.drawImage(img.current, 0, 0, img.current.width, img.current.height);
      const rect = canvas.getBoundingClientRect();
      setScale({ x: img.current.width / rect.width, y: img.current.height / rect.height });
      setImageWidth(Math.round(rect.width))
      setImageHeight(Math.round(rect.height))
      // draw();
    };
    img.current.src = image;
  }, [image]);


  const draw = () => {
    const canvas = canvasRef.current;
   const ctx = canvas.getContext('2d');
   console.log(pointsArray)
   pointsArray.forEach(points => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';  // semi-transparent blue
    ctx.fill();
    ctx.stroke();
  });
  };



  return (
    <>
    <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
        {!markZone&&<div className='absolute top-0 left-0 bg-black opacity-50 h-12 w-full z-40 '>
            
        </div>}
        <div className={`absolute bottom-4 left-4 z-50  shadow-md ${arrowDirection==='Away from the Camera'?'rotate-180':''}`}>
            <img src='/images/analytic-arrow.svg' />
        </div>
      <canvas ref={canvasRef} style={{ position: 'relative', maxWidth: '100%', left: 0, top: 0 }}  />
    </div><div className='py-4 flex justify-start'>
     
  </div>
  </>
  );
}

export default ViewAnalyticsImage;
