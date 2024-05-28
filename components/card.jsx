"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

const Card = (props) => {
  const [arrowContext, setArrowContext] = useState(true)
  useEffect(() => {
    if (props.todayRecords && props.yesterdayRecords) {
      setArrowContext(props.todayRecords > props.yesterdayRecords)
    }
  }, [props.todayRecords, props.yesterdayRecords])
  const displayNumber =
    isNaN(props.percentage) || !isFinite(props.percentage)
      ? 0
      : props.percentage
 
  const isEqual = props.todayRecords === props.yesterdayRecords
  return (
    <div className="flex  w-1/2 flex-col items-center gap-[1.5em] border border-[rgba(223,223,233,1)] p-[1em]">
      <span className="text-[rgba(111, 111, 112, 1)] ">
        {props.title}
      </span>
      <div className="flex flex-row items-center justify-between gap-[1em]">
        <span className=" text-3xl font-semibold">{props.content}</span>
        {(props.content!==0 && !isNaN(props.content) && arrowContext &&!isEqual) ? (
          <Image
            src="/vectors/Increase.svg"
            alt="increase"
            width={24}
            height={24} 
          />
        ) : props.content!==0 && !isNaN(props.content) && !arrowContext &&!isEqual? (
          <Image
            src="/vectors/Decrease.svg"
            alt="decrease"
            width={24}
            height={24}
          />  
        ) : null}
        {props.content!==0 && displayNumber && displayNumber !== null && displayNumber !== undefined ?
        <span>{displayNumber}%</span>
          :
          ""
        }
      </div>
      <span className="text-[rgba(111, 111, 112, 1)]  text-sm text-center">
        {props.footer}
      </span>
    </div>
  )
}

export default Card
