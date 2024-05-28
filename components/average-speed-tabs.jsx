import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AverageSpeedGraphSection from "@/components/average-speed-graph-section"
import { useState } from "react";
import Image from "next/image";

const AverageSpeedTabs = ({
  selectedJunction,
  handleSpeedDuration,
  speedDuration,
  datasets,
  xAxisData,
  showDateRange,
  junctionTree,
  todayStartTimestamp,
  todayEndTimestamp,
  weekStartTimestamp,
  weekEndTimestamp,
  monthStartTimestamp,
  monthEndTimestamp,
  checkDate,
  refresh,
  isDateChanged,
  cameraSelection,
  selectedTab,
  setSelectedTab,
  getSelectedTab,
}) => {
  
  const perPage = 9
  const totalPages = Math.ceil(selectedJunction.length / perPage)
  const [page, setPage] = useState(0)
  const mappedJunctions = selectedJunction?.slice(page * perPage, page * perPage + perPage)
  // console.log(mappedJunctions,'mappedJunctions')
  return (
    <div className="flex w-full items-center bg-[#fff] px-4">
      <Tabs defaultValue={0} className=" w-full">
        <TabsList className="flex  items-center justify-start gap-3 ">
        <Image src="/images/left-arrow-grey.svg" width="25" height="25" alt="left" onClick={() => setPage(Math.max(0, page - 1))} className="cursor-pointer"/>
          {Array.isArray(mappedJunctions) &&
            mappedJunctions?.map((item, index) => (
              <TabsTrigger value={index} className="bg-[#F2F2F2]">
                {item}
              </TabsTrigger>
            ))}
        <Image src="/images/left-arrow-grey.svg" width="25" height="25" alt="right" onClick={() => setPage(Math.min(totalPages - 1, page + 1))}  className="rotate-180 cursor-pointer"/>
        </TabsList>
        {mappedJunctions?.map((item, index) => (
          <TabsContent value={index}>
            <AverageSpeedGraphSection
              handleSpeedDuration={handleSpeedDuration}
              speedDuration={speedDuration}
              datasets={datasets}
              xAxisData={xAxisData}
              showDateRange={showDateRange}
              junctionDetails={
                junctionTree?.find((x) => x.vJunction.name === item)?.vJunction
              }
              todayEndTimestamp={todayEndTimestamp}
              todayStartTimestamp={todayStartTimestamp}
              weekStartTimestamp={weekStartTimestamp}
              weekEndTimestamp={weekEndTimestamp}
              monthStartTimestamp={monthStartTimestamp}
              monthEndTimestamp={monthEndTimestamp}
              checkDate={checkDate}
              refresh={refresh}
        cameraSelection={cameraSelection}
        isDateChanged={isDateChanged}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        getSelectedTab={getSelectedTab}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default AverageSpeedTabs
