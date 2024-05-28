import { useEffect, useState } from "react";
import Image from "next/image";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Chart, Doughnut } from "react-chartjs-2";





ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = (props) => {
  const labels = props.props?.datalist?.map((label) => label.name)
  const totalRecords = props.props?.datalist?.map((data) => data.totalrecords)
  const totalCount = totalRecords?.reduce((a, b) => a + b, 0)
  const labelsOnCondition = () => {
    if (labels === undefined) {
      return ["No Data"]
    } else {
      return labels
    }
  }
  const randomHexColorCode = () => {
    let letters = "0123456789ABCDEF"
    let color = '#'
    for (let i = 0; i < 6; i++) 
    color += letters[(Math.floor(Math.random() * 16))]
    return color
  };
  function generateLightColor() {
    const minLightness = 150; // Adjust this value to control lightness
    const red = Math.floor(Math.random() * 256) + minLightness;
    const green = Math.floor(Math.random() * 256) + minLightness;
    const blue = Math.floor(Math.random() * 256) + minLightness;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  function generateLightColorHSL() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.random()
    const lightness = 0.7
    return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`
  }
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
  const colors = [
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
  ] // Add more colors if needed

  const data = {
    labels: labelsOnCondition(),
    datasets: [
      {
        label: props.props?.name,
        data: totalRecords,
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: labels?.map((label,index) => hexToRgbA(colors[index % colors.length], 0.4)),
      },
    ],
  }
  const options = {
    plugins: {
      title: {
        display: true,
        color: "blue",
        font: {
          size: 34,
        },

        responsive: true,
        animation: {
          animateScale: true,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  }
  return (
    <section className="flex h-1/3 w-1/3 flex-col bg-white p-[0.5em]">
      <>
        <div className=" flex flex-row items-center justify-start">
          <span className="text-[rgba(15, 15, 16, 1)] font-semibold">
            {props.props?.name === 'Area wise Distribution'?'Police Station Wise Distribution':props.props?.name}
          </span>
          <Image
            src="/vectors/Kebab_menu.svg"
            alt="kebab menu"
            width={24}
            height={24}
            className="ml-auto"
          />
        </div>
        <div className=" mt-[0.5em] flex  items-center justify-center bg-[#EEF8FF] text-[#2A94E5]">
          Total: {totalCount}
        </div>
        <div className=" flex  items-center justify-center ">
          {props.props?.datalist?.length > 0 ? (
            <Doughnut data={data} options={options} />
          ) : props.props?.datalist === null ? (
            <div>No Data</div>
          ) : (
            <div className="flex h-48 w-full flex-col items-center justify-center gap-4 bg-white p-14 text-sm text-slate-400">
              <div class="h-8 w-8 animate-spin rounded-full border-8 border-gray-200 border-t-primary ease-linear"></div>
              Loading...
            </div>
          )}
        </div>
      </>
    </section>
  )
}

export default DoughnutChart