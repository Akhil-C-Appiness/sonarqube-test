import { Button } from '@/components/ui/button';
import React, { useRef, useEffect, useState } from 'react';

function AnalyticsImage({ image, arrowDirection, setImageWidth, setImageHeight, setPoints, imageWidth, imageHeight,setZoneArray }) {
  const canvasRef = useRef(null);
  const [markZone, setMarkZone] = useState(false)
  const [pointsArray, setPointsArray] = useState([])
  const points = useRef([]);
  const isFinished = useRef(false);
  const img = useRef(new Image());
  const [scale, setScale] = useState({ x: 1, y: 1 });
  useEffect(()=>{
    setZoneArray(pointsArray)
  },[pointsArray])
  useEffect(()=>{
    console.log("pointsArray",pointsArray)
  },[pointsArray])
  useEffect(() => {
    img.current.onload = function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.current.width;
      canvas.height = img.current.height;
      // setImageWidth(img.current.width)
      // setImageHeight(img.current.height)
      ctx.drawImage(img.current, 0, 0, img.current.width, img.current.height);
      const rect = canvas.getBoundingClientRect();
      setScale({ x: img.current.width / rect.width, y: img.current.height / rect.height });
      setImageWidth(Math.round(rect.width))
      setImageHeight(Math.round(rect.height))
      draw();
    };
    img.current.src = image;
  }, [image]);

  useEffect(() => {
    draw();
  }, [arrowDirection]);
  const handleClick = (e) => {
    if(!markZone){
        return
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * scale.x;
    const y = (e.clientY - rect.top) * scale.y;
    if (isFinished.current) {
      points.current = [];
      isFinished.current = false;
    } else {
      points.current.push({ x, y });
      if (points.current.length === 4) {
        isFinished.current = true;
        let newArray = [];
        points.current.map((obj)=>{
          let newObj = {
            x : Math.round(obj.x),
            y : Math.round(obj.y)
          }
          newArray.push(newObj)
        })
        setPointsArray((prev) => [...prev, newArray]);
      }
    }
    draw();
  };

  const draw = () => {
    if(!markZone){
        return
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img.current, 0, 0, canvas.width, canvas.height);
   

    if (points.current.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      points.current.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      if (isFinished.current) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.fill();
      }
      ctx.stroke();

      // Draw points
      setPoints(points.current)
      points.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI); // Draw a larger circle
        ctx.fillStyle = 'black';
        ctx.fill();
      });
      pointsArray.forEach(points=>{
          points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI); // Draw a larger circle
          ctx.fillStyle = 'black';
          ctx.fill();
          ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      // if (isFinished.current) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,0,0,0.2)';
        ctx.fill();
      // }
      ctx.stroke();
        });
      })
    }
  };

  const eraseZone = ()=>{
    points.current=[]
    draw()
    setMarkZone(false)
    setPointsArray([]);
  }

  return (
    <>
    <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
        {!markZone&&<div className='absolute top-0 left-0 bg-black opacity-50 h-12 w-full z-40 '>
            
        </div>}
        {/* text-white flex justify-end */}
        {!markZone&&<div onClick={()=>setMarkZone(true)} className='absolute cursor-pointer right-0 top-0  text-white flex justify-end items-center h-12 w-full z-50 p-4 gap-2 '>
           <img src="/images/mark-zone-edit.svg" /> Mark Zone
        </div>}
        <div className={`absolute bottom-4 left-4 z-50  shadow-md ${arrowDirection==='Away from the Camera'?'rotate-180':''}`}>
            <img src='/images/analytic-arrow.svg' />
        </div>
      <canvas ref={canvasRef} style={{ position: 'relative', maxWidth: '100%', left: 0, top: 0 }} onClick={handleClick} />
    </div><div className='py-4 flex justify-start'>
    {markZone&&<Button variant={'blueoutline'} onClick={eraseZone}>Erase zone</Button>}
  </div></>
  );
}

export default AnalyticsImage;
