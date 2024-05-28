// "use client"

// import ReactModal, { useState } from "react"
// import Image from "next/image"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import EventsTable from "./events-table"
// import { QuickView } from "./quick-view"
// import { Button } from "./ui/button"
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

// const details = [
//   {
//     Severity: "Critical",
//     TypeOfViolation: "Over speeding",
//     VehicleType: "Two wheeler",
//     Camera: "4th Phase_02",
//     TimeStamp: "10-12-2022 12:04 PM",
//     LicensePlate: "HR-LK-4522",
//     Status: "Unchecked",
//     Speed: "75",
//     View: "View Details",
//     id: 1,
//   },
//   {
//     Severity: "Critical",
//     TypeOfViolation: "Over speeding",
//     VehicleType: "Two wheeler",
//     Camera: "4th Phase_02",
//     TimeStamp: "10-12-2022 12:04 PM",
//     LicensePlate: "HR-LK-4522",
//     Status: "Unchecked",
//     Speed: "75",
//     View: "View Details",
//     id: 2,
//   },
//   {
//     Severity: "Critical",
//     TypeOfViolation: "Over speeding",
//     VehicleType: "Two wheeler",
//     Camera: "4th Phase_02",
//     TimeStamp: "10-12-2022 12:04 PM",
//     LicensePlate: "HR-LK-4522",
//     Status: "Unchecked",
//     Speed: "75",
//     View: "View Details",
//     id: 3,
//   },
//   {
//     Severity: "Low",
//     TypeOfViolation: "Over speeding",
//     VehicleType: "Two wheeler",
//     Camera: "4th Phase_02",
//     TimeStamp: "10-12-2022 12:04 PM",
//     LicensePlate: "HR-LK-4522",
//     Status: "Unchecked",
//     Speed: "75",
//     View: "View Details",
//     id: 4,
//   },
//   {
//     Severity: "Critical",
//     TypeOfViolation: "Over speeding",
//     VehicleType: "Two wheeler",
//     Camera: "4th Phase_02",
//     TimeStamp: "10-12-2022 12:04 PM",
//     LicensePlate: "HR-LK-4522",
//     Status: "Unchecked",
//     Speed: "75",
//     View: "View Details",
//     id: 5,
//   },
// ]

// export function SearchContained(props) {
//   const [isModalOpen, setModalIsOpen] = useState(false)
//   const [currentPage, setCurrentPage] = useState(2)
//   const [isHovering, setIsHovering] = useState(false)
//   const toggleModal = () => {
//     setModalIsOpen(!isModalOpen)
//   }

//   const handleMouseOver = () => {
//     setIsHovering(true)
//   }

//   const handleMouseOut = () => {
//     setIsHovering(false)
//   }

//   let maxPages = 4
//   let items = []
//   let leftSide = currentPage - 2
//   if (leftSide <= 0) {
//     leftSide = 1
//   }
//   let rightSide = currentPage + 2
//   if (rightSide > maxPages) {
//     rightSide = maxPages
//   }
//   for (let number = leftSide; number <= rightSide; number++) {
//     items.push(
//       <div
//         key={number}
//         className={
//           number === currentPage ? "round-effect active" : "round-effect"
//         }
//         onClick={() => {
//           setCurrentPage(number)
//         }}
//       >
//         {number}
//       </div>
//     )
//   }
//   console.log(props)
//   return (
//     <div className="mt-5">
//       <Table>
//         <TableHeader className="bg-[#fff]">
//           <TableRow>
//             <TableHead className="text-black">Severity</TableHead>
//             <TableHead className="text-black">Type of Violation</TableHead>
//             <TableHead className="text-black">Vehicle Type</TableHead>
//             <TableHead className="text-black">Camera</TableHead>
//             <TableHead className="text-black">Timestamp</TableHead>
//             <TableHead className="text-black">License Plate</TableHead>
//             <TableHead className="text-black">Status</TableHead>
//             <TableHead className="text-black">Speed</TableHead>

//             <TableHead className="text-black">View</TableHead>
//             <TableHead className="text-black"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="bg-white font-[500] not-italic text-[##3F3F40]">
//           {props.lastFiveElements?.map((detail) => (
//             <TableRow key={detail.id}>
//               <TableCell className="text-[#D73D2A]">
//                 {detail.severity}
//               </TableCell>
//               <TableCell className="flex justify-between">
//                 <Image
//                   src="/images/OverSpeeding.svg"
//                   width="24"
//                   height="24"
//                   alt="Overspeeding"
//                   className="pr-2"
//                 />
//                 {detail.violationType}
//               </TableCell>
//               <TableCell>{detail.vehicleclass}</TableCell>
//               <TableCell>{detail.cameraName}</TableCell>
//               <TableCell>{detail.time}</TableCell>
//               <TableCell>{detail.vehicleNo}</TableCell>
//               <TableCell>{detail.Status}</TableCell>

//               <TableCell>{detail.speed}</TableCell>
//               <TableCell>
//                 <div>
//                   <Button
//                     onClick={toggleModal}
//                     variant="outline"
//                     className="border-none"
//                   >
//                     View Detail
//                   </Button>
//                   {isModalOpen && (
//                     <QuickView onRequestClose={toggleModal} props={detail} />
//                   )}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Image
//                   src="/images/CameraIcon.svg"
//                   width="48"
//                   height="40"
//                   alt="camera"
//                   onMouseOver={handleMouseOver}
//                   onMouseOut={handleMouseOut}
//                 />
//                 {/* {isHovering && (
//                   <QuickView onRequestClose={toggleModal} props={detail} />
//                 )} */}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       {/* <div>
//         <Button>ghsdg</Button>
//       </div> */}
//     </div>
//   )
// }
