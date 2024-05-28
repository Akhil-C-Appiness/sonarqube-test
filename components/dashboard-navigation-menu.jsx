import { useEffect, useState } from "react"
import dynamic  from "next/dynamic";
// import Image from "next/image"
import useStore from "@/store/store"
import { add, format } from "date-fns"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataTable from "@/components/data-table"
import DoughnutChart from "@/components/doughnut-charts"
import { MapTrafficFlow } from "@/components/map-traffic-flow"
// import { MapTrafficContent } from "@/components/map-traffic-violation"
// import ViolationChart from "@/components/violation-chart"

const Image = dynamic(() => import("next/image"));
const MapContent = dynamic(() => import("@/components/map-content"));
const ViolationChart = dynamic(() => import("@/components/violation-chart"));

const NavigationMenu = ({
  handleShowTable,
  duration,
  setDuration,
  handleSpeedDuration,
  speedDuration,
  violationType,
  setViolationType,
  showDataTable,
  violationResponse,
  handleRegistrationTypeCheck,
  handleVehicleTypeCheck,
  handleViolationTypeCheck,
  selectedVehicleFilter,
  selectedViolationFilter,
  selectedRegFilter,
  handleClearAll,
  isVehicleCheckboxDisabled,
  isRegistrationCheckboxDisabled,
  todayStartTimestamp,
  todayEndTimestamp,
  checkDate,
  handleSelectAll,
  vehicleTypeData,
  regTypeData,
  flow,
  handleFlow,
  resetTimer,
  setResetTimer,
  selectedJunctions,
  selectedChannels,
  selectedAreas,
  showDateRange,
  date,
  weekStartTimestamp,
  weekEndTimestamp,
  monthStartTimestamp,
  monthEndTimestamp,
  convertToEpochFormat,
  convertToEpochFormatToTime,
  refresh,
  cameraSelection,
  isDateChanged,
  selectedTab,
  setSelectedTab,
  getSelectedTab,
  subTab,
  setSubTab,
}) => {
  const [showTotal, setShowTotal] = useState(false)
  const [activeTab, setActiveTab] = useState("TrafficFlow");
  const trafficViolationsPieChartsData = useStore(
    (state) => state.trafficViolationsPieChartsData
  )
  const trafficFlowViolationsPieChartsData = useStore(
    (state) => state.trafficFlowViolationsPieChartsData
  )
  const type0ViolationAreaBased =
    trafficViolationsPieChartsData[0]?.patterndatalist?.[0]
  const type1ViolationAreaBased =
    trafficViolationsPieChartsData[0]?.patterndatalist?.[1]
  const type2ViolationAreaBased =
    trafficViolationsPieChartsData[0]?.patterndatalist?.[2]
  const type0ViolationFlowBased =
    trafficFlowViolationsPieChartsData[0]?.patterndatalist?.[0]
  const type1ViolationFlowBased =
    trafficFlowViolationsPieChartsData[0]?.patterndatalist?.[1]
  const type2ViolationFlowBased =
    trafficFlowViolationsPieChartsData[0]?.patterndatalist?.[2]

  const violationChartsData = useStore((state) => state.violationChartsData)
  const violationChartsDataList =
    violationChartsData[0]?.patterndatalist[0]?.datalist
  const violationsXaxisData = selectedTab === "Custom" || selectedTab === "Week" ||selectedTab === "Month" ? (violationChartsData[0]?.patterndatalist?.map(
    (item) => item.starttimestamp)
  ):violationChartsData[0]?.patterndatalist?.map((item,index) => {
      const endtimestamp = add(
        item.starttimestamp,
        violationChartsData[0]?.patterndatalist?.length === index + 1
          ? { hours: 2 - 1, minutes: 59 }
          : { hours: 2 }
      )
      const hourFormat = violationChartsData[0]?.patterndatalist?.length === index + 1 ? "hh:mm a" : "ha"
      return (
        format(item.starttimestamp, 
  hourFormat) +
        "-" +
        format(endtimestamp, hourFormat)
      )
    }
  )
  const flowChartsData = useStore((state) => state.flowChartsData)

  const flowChartsDataList = flowChartsData[0]?.patterndatalist
  const flowXaxisData = selectedTab === "Custom" || selectedTab === "Week" ||selectedTab === "Month" ? (flowChartsData[0]?.patterndatalist?.map(
    (item) => item.starttimestamp
  )):flowChartsDataList?.map((item, index) => {
    const endtimestamp = add(
      item.starttimestamp,
      flowChartsDataList?.length === index + 1
        ? { hours: 2 - 1, minutes: 59 }
        : { hours: 2 }
    )
    const hourFormat = flowChartsDataList?.length === index + 1 ? "hh:mm a" : "ha"
    // return format(item.starttimestamp, "MMMM do, yyyy ha") + '-' + format(endtimestamp, hourFormat)
    return (
      format(item.starttimestamp, hourFormat) +
      "-" +
      format(endtimestamp, hourFormat)
    )
  })
  const arr = violationChartsData[0]?.patterndatalist?.map(
    (item) => item.datalist
  )
  const firstArray = arr?.find(
    (element) => Array.isArray(element) && element.length > 0
  )
  const unNullifiedArray = arr?.map((array) => {
    if (array === null && firstArray) {
      return [
        ...firstArray?.map(({ totalrecords, ...rest }) => ({
          ...rest,
          totalrecords: 0,
        })),
      ]
    } else {
      return array?.map(({ totalrecords, ...rest }) => ({
        ...rest,
        totalrecords: totalrecords || 0,
      }))
    }
  })
  const extractedOnes = []

  const arr1 = unNullifiedArray?.forEach((childArr) => {
    childArr?.forEach((obj) => {
      const { name, totalrecords } = obj
      extractedOnes.push({ name, totalrecords })
    })
  })

  const mergedData = extractedOnes?.reduce((acc, obj) => {
    const { name, totalrecords } = obj

    if (acc[name]) {
      acc[name].push(totalrecords)
    } else {
      acc[name] = [totalrecords]
    }

    return acc
  }, {})

  const arrFlow = flowChartsData[0]?.patterndatalist?.map(
    (item) => item.datalist
  )

  const firstArrayFlow = arrFlow?.find(
    (element) => Array.isArray(element) && element.length > 0
  )

  const unNullifiedArrayFlow = arrFlow?.map((array) => {
    if (array === null && firstArrayFlow) {
      return [
        ...firstArrayFlow?.map(({ totalrecords, ...rest }) => ({
          ...rest,
          totalrecords: 0,
        })),
      ]
    } else {
      return array?.map(({ totalrecords, ...rest }) => ({
        ...rest,
        totalrecords: totalrecords || 0,
      }))
    }
  })
  const extractedOnesFlow = []

  const arr2 = unNullifiedArrayFlow?.forEach((childArr) => {
    childArr?.forEach((obj) => {
      const { name, totalrecords } = obj
      extractedOnesFlow.push({ name, totalrecords })
    })
  })

  const mergedDataFlow = extractedOnesFlow?.reduce((acc, obj) => {
    const { name, totalrecords } = obj
    if (acc[name]) {
      acc[name].push(totalrecords)
    } else {
      acc[name] = [totalrecords]
    }
    return acc
  }, {})
  // const calculateTotalVolume = (data) => {
  //   const totalVolumeArray = []

  //   for (let i = 0; i < data[Object.keys(data)[0]]?.length; i++) {
  //     let sum = 0
  //     for (const key in data) {
  //       sum += data[key][i]
  //     }
  //     totalVolumeArray.push(sum)
  //   }

  //   return totalVolumeArray
  // }
  // if (extractedOnesFlow.length > 0) {
  //   mergedDataFlow["Total Vehicles Volume"] =
  //     calculateTotalVolume(mergedDataFlow)
  //   mergedData["Total Vehicles Volume"] = calculateTotalVolume(mergedData)
  // }
  const backgroundColors = [
    "#56fc03",
    "#ff0000",
    "#F87575",
    "#785EF0",
    "#78A9FF",
    "#B8C327",
    "#FF7093",
    "#808080",
    "#FFA07A",
    "#FFB6C1",
    "#FF7F50",
    "#FFFF00",
    "#E6E6FA",
    "black",
  ]
  const datasets = Object.entries(mergedData)?.map(([key, value], index) => ({
    label: key,
    data: value,
    backgroundColor: backgroundColors[index % backgroundColors.length],
    borderColor: backgroundColors[index % backgroundColors.length],
  }))
  const datasetsFlow = Object.entries(mergedDataFlow)?.map(
    ([key, value], index) => ({
      label: key,
      data: value,
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderColor: backgroundColors[index % backgroundColors.length],
    })
  )

  let summedOfData = []
  if (datasetsFlow && Array.isArray(datasetsFlow)) {
    summedOfData = datasetsFlow.reduce((acc, dataset) => {
      dataset.data.forEach((value, index) => {
        if (!acc[index]) {
          acc[index] = {
            label: `Sum at Index ${index}`,
            data: 0,
            backgroundColor: "rgba(0, 0, 0, 0)", // Set the background color as needed
            borderColor: "black", // Set the border color as needed
            // You can add other dataset options as required
          }
        }
        acc[index].data += value
      })
      return acc
    }, [])
  }
  const summedDataArrays = summedOfData.map((sumData) => sumData.data)

  const totalDataset = {
    label: "Total",
    data: summedDataArrays,
    backgroundColor: "black",
    borderColor: "black",
  }
  const updatedDatasets = [...datasetsFlow, totalDataset]
  const handleCheckboxChange = () => {
    setShowTotal(!showTotal)
  }
  const tabs = [
    {
      name:'Traffic Flow',
      id:1,
      src:'/vectors/Traffic Flow.svg'
    },
    {
      name:'Traffic Violation',
      id:2,
      src:'/vectors/Traffic Violation.svg'
    },
    {
      name:'Average Speed',
      id:3,
      src:'/vectors/AvgSpeedIcon.svg'
    },
    {
      name:'Map View',
      id:4,
      src:'/images/Map_view.svg'
    }
  ]
  return (
    <section className=" mt-[1em] h-[53px] w-full bg-[#FFFFFF]">
      <Tabs value={subTab} onValueChange={(e)=>setSubTab(e)} >
        <TabsList
          className="grid w-full grid-cols-4 gap-3 "
          onClick={handleFlow}
        >
          {tabs.map((tab) => (
            <TabsTrigger className="flex flex-row items-center justify-center gap-[1em]" value={tab.name} key={tab.id} >
              <Image
                alt={tab.name}
                src={tab.src}
                width={24}
                height={24}
              />
              <span>{tab.name}</span>
            </TabsTrigger>
          ))}
          {/* <TabsTrigger
            className="flex flex-row items-center justify-center gap-[1em]"
            value="Traffic Flow"
          >
            <Image
              alt="traffic flow"
              src="/vectors/Traffic Flow.svg"
              width={24}
              height={24}
            />
            <span>Traffic Flow</span>
          </TabsTrigger> */}
          {/* <TabsTrigger
            className="flex flex-row items-center justify-center gap-[1em]"
            value="Traffic Violation"
          >
            <Image
              alt="traffic violation"
              src="/vectors/Traffic Violation.svg"
              width={24}
              height={24}
            />
            <span>Traffic Violation</span>
          </TabsTrigger> */}
          {/* <TabsTrigger
            className="flex flex-row items-center justify-center gap-[1em]"
            value="Average Speed"
          >
            <Image
              alt="average speed"
              src="/vectors/AvgSpeedIcon.svg"
              width={24}
              height={24}
            />
            <span>Average Speed</span>
          </TabsTrigger> */}
          {/* <TabsTrigger
            className="flex flex-row items-center justify-center gap-[1em]"
            value="Map View"
          >
            <Image
              alt="map view"
              src="/images/Map_view.svg"
              width={24}
              height={24}
            />
            <span>Map View</span>
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="Traffic Violation">
          <div>
            <div className=" mt-[2em] flex flex-row items-center justify-start gap-[1em]">
              <DoughnutChart props={type0ViolationAreaBased} />
              <DoughnutChart props={type1ViolationAreaBased} />
              <DoughnutChart props={type2ViolationAreaBased} />
            </div>
            <ViolationChart
            showTotal={showTotal}
            handleCheckboxChange={handleCheckboxChange}
            totalDataset={totalDataset}
              handleShowTable={handleShowTable}
              duration={duration}
              setDuration={setDuration}
              violationType={violationType}
              setViolationType={setViolationType}
              violationResponse={violationResponse}
              handleVehicleTypeCheck={handleVehicleTypeCheck}
              handleRegistrationTypeCheck={handleRegistrationTypeCheck}
              handleViolationTypeCheck={handleViolationTypeCheck}
              title="Violation Charts"
              subTitle="Violations"
              dataList={violationChartsDataList}
              selectedVehicleFilter={selectedVehicleFilter}
              selectedViolationFilter={selectedViolationFilter}
              selectedRegFilter={selectedRegFilter}
              handleClearAll={handleClearAll}
              isVehicleCheckboxDisabled={isVehicleCheckboxDisabled}
              isRegistrationCheckboxDisabled={isRegistrationCheckboxDisabled}
              xAxisData={violationsXaxisData}
              datasets={updatedDatasets}
              datasetsFlow={datasetsFlow}
              checkDate={checkDate}
              handleSelectAll={handleSelectAll}
              vehicleTypeData={vehicleTypeData}
              regTypeData={regTypeData}
              flow={flow}
              type0Violations={type0ViolationAreaBased}
              setResetTimer={setResetTimer}
              resetTimer={resetTimer}
              showDateRange={showDateRange}
              date={date}
              selectedTab={selectedTab}
              convertToEpochFormat={convertToEpochFormat}
              convertToEpochFormatToTime={convertToEpochFormatToTime}
            />
            {showDataTable && (
              <DataTable events={violationChartsData[0]?.eventlist} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="Traffic Flow">
          <div className=" mt-[2em] flex flex-row items-center justify-start gap-[1em]">
            <DoughnutChart props={type1ViolationFlowBased} />
            <DoughnutChart props={type2ViolationFlowBased} />
            <DoughnutChart props={type0ViolationFlowBased} />
          </div>
          <ViolationChart
          totalDataset={totalDataset}
          showTotal={showTotal}
          handleCheckboxChange={handleCheckboxChange}
            handleShowTable={handleShowTable}
            duration={duration}
            setDuration={setDuration}
            violationType={violationType}
            setViolationType={setViolationType}
            violationResponse={violationResponse}
            handleVehicleTypeCheck={handleVehicleTypeCheck}
            handleRegistrationTypeCheck={handleRegistrationTypeCheck}
            handleViolationTypeCheck={handleViolationTypeCheck}
            title="Traffic Flow Charts"
            subTitle="Traffic Flow"
            dataList={flowChartsDataList}
            selectedVehicleFilter={selectedVehicleFilter}
            selectedViolationFilter={selectedViolationFilter}
            selectedRegFilter={selectedRegFilter}
            handleClearAll={handleClearAll}
            isVehicleCheckboxDisabled={isVehicleCheckboxDisabled}
            isRegistrationCheckboxDisabled={isRegistrationCheckboxDisabled}
            xAxisData={flowXaxisData}
            datasets={updatedDatasets}
            checkDate={checkDate}
            handleSelectAll={handleSelectAll}
            vehicleTypeData={vehicleTypeData}
            regTypeData={regTypeData}
            flow={flow}
            type0Violations={type0ViolationFlowBased}
            setResetTimer={setResetTimer}
            resetTimer={resetTimer}
            showDateRange={showDateRange}
            date={date}
            selectedTab={selectedTab}
            convertToEpochFormat={convertToEpochFormat}
              convertToEpochFormatToTime={convertToEpochFormatToTime}
          />
          {showDataTable && <DataTable events={flowChartsData[0]?.eventlist} />}
        </TabsContent>
        <TabsContent value="Average Speed">
          <div>
            <MapContent
              todayEndTimestamp={todayEndTimestamp}
              todayStartTimestamp={todayStartTimestamp}
              selectedJunctions={selectedJunctions}
              handleSpeedDuration={handleSpeedDuration}
              speedDuration={speedDuration}
              // datasets={datasetsAverageSpeed}
              // xAxisData={averageSpeedXaxisData}
              showDateRange={showDateRange}
              date={date}
              weekStartTimestamp={weekStartTimestamp}
              weekEndTimestamp={weekEndTimestamp}
              monthStartTimestamp={monthStartTimestamp}
              monthEndTimestamp={monthEndTimestamp}
              convertToEpochFormat={convertToEpochFormat}
              convertToEpochFormatToTime={convertToEpochFormatToTime}
              refresh={refresh}
        cameraSelection={cameraSelection}
        isDateChanged={isDateChanged}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        getSelectedTab={getSelectedTab}
            />
          </div>
        </TabsContent>
        <TabsContent value="Map View">
          <div className=" mt-[2em] flex flex-col items-center justify-start bg-white">
            <div className=" mt-[2em] flex w-full flex-row items-center justify-start bg-white px-4">
              <span className="font-semibold text-[#0F0F10]">Map View </span>
            </div>
            <div className="mt-[2em] flex w-full flex-row items-center justify-start bg-white px-4">
              <Tabs defaultValue="TrafficFlow" className="w-full">
                <TabsList className="grid h-full w-full grid-cols-2 gap-3">
                  <TabsTrigger
                    value="TrafficFlow"
                    className="flex flex-row items-center justify-center gap-[1em] border"
                  >
                    Traffic Flow
                  </TabsTrigger>
                  <TabsTrigger
                    value="TrafficViolation"
                    className="flex flex-row items-center justify-center gap-[1em] border"
                  >
                    Traffic Violation
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="TrafficViolation">
                  <div className="mt-[2em] gap-[1em]">
                    <MapTrafficFlow
                      todayEndTimestamp={todayEndTimestamp}
                      todayStartTimestamp={todayStartTimestamp}
                      weekStartTimestamp={weekStartTimestamp}
                      weekEndTimestamp={weekEndTimestamp}
                      monthStartTimestamp={monthStartTimestamp}
                      monthEndTimestamp={monthEndTimestamp}
                      selectedJunctions={selectedJunctions}
                      selectedChannels={selectedChannels}
                      selectedAreas={selectedAreas}
                      convertToEpochFormat={convertToEpochFormat}
                      convertToEpochFormatToTime={convertToEpochFormatToTime}
                      date={date}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      activeTab="TrafficViolation"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="TrafficFlow">
                  <div className="mt-[2em] gap-[1em]">
                    <MapTrafficFlow
                      todayEndTimestamp={todayEndTimestamp}
                      todayStartTimestamp={todayStartTimestamp}
                      selectedJunctions={selectedJunctions}
                      selectedChannels={selectedChannels}
                      selectedAreas={selectedAreas}
                      weekStartTimestamp={weekStartTimestamp}
                      weekEndTimestamp={weekEndTimestamp}
                      monthStartTimestamp={monthStartTimestamp}
                      monthEndTimestamp={monthEndTimestamp}
                      convertToEpochFormat={convertToEpochFormat}
                      convertToEpochFormatToTime={convertToEpochFormatToTime}
                      date={date}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      activeTab="TrafficFlow"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default NavigationMenu
