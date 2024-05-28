"use client"

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { add, format } from "date-fns"
import { useState } from "react"
import { Line } from "react-chartjs-2"

const CompareChart = ({
  dataList,
  dataList2,
  compareType,
  timeInterval,
  secondDate,
  firstDate,
  secondGraphDate,
  firstGraphDate,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
  const [showTotal, setShowTotal] = useState(false)

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: format(new Date(firstDate), "MMMM do, yyyy ha"),
        position: "left",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
      x: {
        position: "top",
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
    layout: {
      padding: {
        left: 140,
        right: 140,
      },
    },
    maintainAspectRatio: false,
  }

  const options2 = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: format(new Date(secondDate), "MMMM do, yyyy ha"),
        position: "left",
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        reverse: true,
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 140,
        right: 140,
      },
    },
  }
const showTotalOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Cars",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        // fill: {
        //     target: "origin", // 3. Set the fill options
        //     above: "rgba(255, 0, 255, 0.2)"
        // }
      },
      {
        label: "Dataset 2",
        data: [2, 3, 20, 5, 1, 4],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        backgroundColor: "rgba(255, 0, 0)",
        // fill: {
        //     target: "origin", // 3. Set the fill options
        //     above: "rgba(255, 0, 0, 0.2)"
        // }
      },
    ],
  }
  const vehicleClasses = Array.from(
    new Set(
      dataList
        ?.flatMap((item) => item.datalist?.map((data) => data.name))
        .filter((name) => name !== undefined)
    )
  )

  // const vehicleClasses2 = Array.from(new Set(dataList2?.flatMap(item => item.datalist?.map(data => data.name)).filter(name => name !== undefined)));

  const hexToRgbA = (hex, alpha) => {
    let c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("")
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = "0x" + c.join("")
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
        ","
      )},${alpha})`
    }
    throw new Error("Bad Hex")
  }
  const datasets = vehicleClasses.map((vehicleClass, index) => {
    const data = dataList.map((item) => {
      const record = item.datalist?.find((data) => data.name === vehicleClass)
      return record ? record.totalrecords : 0
    })

    const colors = ["#F87575", "#2A94E5", "#B8C327", "#78A9FF", "#FF7093"] // Add more colors if needed

    return {
      label: vehicleClass,
      data,
      fill: false,
      backgroundColor: hexToRgbA(colors[index % colors.length], 0.2),
      borderColor: colors[index % colors.length],
      tension: 0.4,
    }
  })
  // console.log("datasets",datasets);
  let summedOfData = []
  if (datasets && Array.isArray(datasets)) {
    summedOfData = datasets.reduce((acc, dataset) => {
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
  //  console.log("sum", summedDataArrays);
  const totalDataset = {
    label: "Total Vehicle Volume",
    data: summedDataArrays,
    tension: 0.4,
    backgroundColor: "black",
    borderColor: "black",
  }
  // console.log("totalDataset", totalDataset);
  const updatedDatasets = [...datasets, totalDataset]

  // console.log("updatedDatasets", updatedDatasets);

  const secondDataSet = vehicleClasses.map((vehicleClass, index) => {
    const data = dataList2?.map((item) => {
      const record = item.datalist?.find((data) => data.name === vehicleClass)
      return record ? record.totalrecords : 0
    })

    const colors = ["#F87575", "#2A94E5", "#B8C327", "#78A9FF", "#FF7093"] // Add more colors if needed

    return {
      label: vehicleClass,
      data,
      fill: false,
      backgroundColor: hexToRgbA(colors[index % colors.length], 0.2),
      borderColor: colors[index % colors.length],
      tension: 0.4,
    }
  })
  // console.log("secondDataSet", secondDataSet);
  let summedOfData2 = []
  if (secondDataSet && Array.isArray(secondDataSet)) {
    summedOfData2 = secondDataSet.reduce((acc, dataset) => {
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
    //  console.log("sec", summedOfData2);
  }
  const summedDataArrays2 = summedOfData2.map((sumData) => sumData.data)
  //  console.log("sum2", summedDataArrays2);
  const totalDataset2 = {
    label: "Total Vehicle Volume",
    data: summedDataArrays2,
    tension: 0.4,
    backgroundColor: "black",
    borderColor: "black",
  }
  // console.log("totalDataset", totalDataset);
  const updatedDatasets2 = [...secondDataSet, totalDataset2]
console.log(updatedDatasets2,'updatedDatasets2')
  const dat = {
    labels: dataList?.map((item, index) => {
      const hoursInterval = timeInterval / 60
      const endtimestamp = add(
        item.starttimestamp,
        dataList?.length === index + 1
          ? { hours: hoursInterval - 1, minutes: 59 }
          : { hours: hoursInterval }
      )
      const hourFormat = dataList?.length === index + 1 ? "hh:mm a" : "ha"
      // return format(item.starttimestamp, "MMMM do, yyyy ha") + '-' + format(endtimestamp, hourFormat)
      return (
        format(item.starttimestamp, hourFormat) +
        "-" +
        format(endtimestamp, hourFormat)
      )
    }),
    datasets: updatedDatasets.reverse(),
  }

  const dat2 = {
    labels: dataList2?.map((item, index) => {
      const hoursInterval = timeInterval / 60
      const endtimestamp = add(
        item.starttimestamp,
        dataList?.length === index + 1
          ? { hours: hoursInterval - 1, minutes: 59 }
          : { hours: hoursInterval }
      )
      const hourFormat = dataList2?.length === index + 1 ? "hh:mm a" : "ha"
      // return format(item.starttimestamp, "MMMM do, yyyy ha") + '-' + format(endtimestamp, hourFormat)
      return (
        format(item.starttimestamp, hourFormat) +
        "-" +
        format(endtimestamp, hourFormat)
      )
    }),
    datasets: updatedDatasets2.reverse(),
  }
  const showTotalData = {
    labels: dataList?.map((item, index) => {
      const hoursInterval = timeInterval / 60
      const endtimestamp = add(
        item.starttimestamp,
        dataList?.length === index + 1
          ? { hours: hoursInterval - 1, minutes: 59 }
          : { hours: hoursInterval }
      )
      const hourFormat = dataList?.length === index + 1 ? "hh:mm a" : "ha"
      return format(item.starttimestamp, hourFormat) + "-" + format(endtimestamp, hourFormat)
    }),
    datasets: [
      {
        label: `Total at ${format(firstGraphDate, "PPP")}`,
        data: summedDataArrays,
        backgroundColor: "black",
        borderColor: "black",
      },
      {
        label: `Total at ${format(secondGraphDate, "PPP")}`,
        data: summedDataArrays2,
        backgroundColor: "blue",
        borderColor: "blue",
      }
    ],
  }
  const handleCheckboxChange = () => {
    setShowTotal(!showTotal)
  }

  return (
    <div className="w-full">
      <div style={{ height: "400px", width: "100%" }}>
        <div className="relative flex justify-center text-xs text-primary">
          <span class="relative flex h-2 w-2 pt-1">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <span className="ml-1">
            Clicking on legends, at the top of the chart, will select/de-select
            the respective value
          </span>
        </div>
        
        <label className="flex items-center pl-8">
              <input
                type="checkbox"
                checked={showTotal}
                onChange={handleCheckboxChange}
              />
              <span className="pl-2">Show Total</span>
            </label>
        {!showTotal ?<Line data={
                    dat
                } options={options} />: <Line data={showTotalData} options={showTotalOptions}/>}
      </div>
      {!showTotal && <hr className="mt-6" />}
      {!showTotal && <div className="mt-2" style={{ height: "400px", width: "100%" }}>
        <Line data={
                    dat2
                } options={options2} />
      </div>}
    </div>
  )
}

export default CompareChart
