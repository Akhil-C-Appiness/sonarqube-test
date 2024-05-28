"use client"

import dynamic from 'next/dynamic';

import { relative } from "path"
import { useCallback, useEffect, useState } from "react"
// import Image from "next/image"
import useStore from "@/store/store"
import { useDrag, useDrop } from "react-dnd"
import { useDropzone } from "react-dropzone"

import { getJunctionMapById, junctionApi, saveJunctionMapById } from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Image = dynamic(() => import("next/image"));

/***
 *
 * Start of the junction component, draggable and drag & drop handlers
 */

const Junction = ({ id, name, fromMenu }) => {
  const [{ isDragging }, jDrag] = useDrag(() => ({
    type: "junction",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div ref={jDrag} className="flex">
      <Image
        alt="cctv icon"
        src="/vectors/cctv_icon.svg"
        width={24}
        height={24}
      />
      {name}
    </div>
  )
}

/**End of junction declaration */

const Camera = ({ id, left, top, onMove, fromMenu }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "camera",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className="z-50"
      style={{
        position: "absolute",
        width: "100%",
        left: fromMenu ? 15 : left,
        top: fromMenu ? 0 : top,
        opacity: fromMenu || !left || !top ? 0.01 : isDragging ? 0.5 : 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M11.9504 8.01081C12.1848 8.11994 12.4636 8.01869 12.5733 7.78394C12.6825 7.54957 12.5812 7.2707 12.3465 7.1612C12.1121 7.05189 11.8334 7.15315 11.7237 7.38789C11.6144 7.62226 11.7156 7.90113 11.9504 8.01081Z"
          fill="#2A94E5"
        />
        <path
          d="M22.7748 10.4529C22.7366 10.3478 22.658 10.2621 22.5566 10.2148L8.79443 3.79818C7.73843 3.30544 6.48451 3.7611 5.9921 4.81777C5.91629 4.98025 4.68528 7.6201 4.56596 7.87586C4.07339 8.9322 4.52905 10.1861 5.58621 10.6787L9.25652 12.3903V14.8091H3.73095V14.3874C3.73095 13.6897 3.16323 13.1219 2.46565 13.1219H1.62207C1.38905 13.1219 1.2002 13.3108 1.2002 13.5438V21.1361C1.2002 21.3689 1.38905 21.5578 1.62207 21.5578H2.46565C3.16323 21.5578 3.73095 20.9902 3.73095 20.2925V19.5494C3.73095 19.5494 10.7552 18.3064 10.7568 18.3061C11.3539 18.193 11.7873 17.6699 11.7873 17.0623V16.2702C12.3016 15.9727 12.6309 15.4182 12.6309 14.8091V13.9639L15.8392 15.4602C16.4577 15.7481 17.1952 15.492 17.5027 14.8831L18.9397 15.5533C19.15 15.6514 19.4015 15.5612 19.5002 15.3493L20.765 12.6374L21.9225 12.2573C22.0331 12.221 22.1239 12.1404 22.1731 12.035L22.7606 10.7754C22.8079 10.6741 22.813 10.5581 22.7748 10.4529ZM2.88736 20.2925C2.88736 20.525 2.69818 20.7142 2.46565 20.7142H2.04378V13.9655H2.46565C2.69818 13.9655 2.88736 14.1547 2.88736 14.3874V20.2925ZM10.9437 17.0623C10.9437 17.2642 10.8 17.4382 10.6019 17.4768L3.73095 18.6928V15.6527H9.48262C9.78007 16.1672 10.3346 16.4963 10.9437 16.4963V17.0623ZM11.7873 14.8091C11.7873 15.2699 11.414 15.6527 10.9437 15.6527C10.4829 15.6527 10.1001 15.2794 10.1001 14.8091V12.7836L11.7873 13.5705V14.8091ZM16.1957 14.6956L5.9425 9.91405C5.30853 9.61873 5.03464 8.86661 5.33061 8.23231L5.50876 7.85032L17.2913 13.3446L16.7563 14.4912C16.6579 14.702 16.4063 14.7936 16.1957 14.6956ZM18.914 14.6105L17.8606 14.1193L18.1515 13.4955L19.6658 12.9983L18.914 14.6105ZM21.4858 11.5129C21.469 11.5183 17.8992 12.6905 17.8908 12.6933L5.86521 7.08584L6.75675 5.17438C7.05189 4.54091 7.80385 4.26686 8.43798 4.56266L21.8178 10.8011L21.4858 11.5129Z"
          fill="#2A94E5"
          stroke="#2A94E5"
          stroke-width="0.5"
        />
        <path
          d="M7.47619 5.4074C7.3667 5.64196 7.46832 5.92083 7.70288 6.03032L10.2513 7.21886C10.4852 7.32781 10.7644 7.22747 10.8743 6.99218C10.9836 6.75762 10.8821 6.47875 10.6476 6.36925L8.09894 5.1809C7.86438 5.07122 7.58551 5.17284 7.47619 5.4074Z"
          fill="#2A94E5"
        />
      </svg>
    </div>
  )
}

const SiteMap = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isImageClicked, setIsImageClicked] = useState(false)
  const [clickedImage, setClickedImage] = useState(null)
  const siteMaps = useStore((state) => state.siteMaps)
  const setSiteMaps = useStore((state) => state.setSiteMaps)
  const junctionTree = useStore((state) => state.junctionTree)
  const setJunctionTree = useStore((state) => state.setJunctionTree)
  const getMapByMapId = useStore((state) => state.getMapByMapId)
  const setGetMapByMapId = useStore((state) => state.setGetMapByMapId)
  const getJunctionById = useStore((state) => state.getJunctionById)
  const setGetJunctionById = useStore((state) => state.setGetJunctionById)
  const getChannelById = useStore((state) => state.getChannelById)
  const setGetChannelById = useStore((state) => state.setGetChannelById)
  const [img, setImg] = useState()
  const [mapId, setMapId] = useState(1)
  // if displaymode is jucntion then junctions will be displayed
  // if the displaymode is channel then the channels will be rendered.
  // it can either be channel or junction, initial value junction
  const [displayMode, setDisplayMode] = useState("junction")
  // this will contain the clicked junction id
  const [selectedJunctionId, setSelectedJunctionId] = useState(null)


  // state to contain mapped junctions
  const [mappedJunctions, setMappedJunctions] = useState(null)
  // state to contain mapped channels
  const [mappedChannels, setMappedChannels] = useState(null)
  // this will load the already mapped junctions received from the api call
  // and keep them in local state
  const loadMappedJunctions = (junctions) => {
    console.log(getJunctionById);
    const _mappedJunctions = junctions?.map((junction) => {
      return {
        id: junction.junctionProperty.junctionId,
        left: junction.junctionProperty.posX,
        right: junction.junctionProperty.posX,
      }
    })
    setMappedJunctions(_mappedJunctions)
  }

  // this will load the already mapped channels received friom the api calls
  // and keeop them in the memory
  const loadMappedChannels = (channels) => {
    const _mappedChannels = channels?.map(channel => {
      return {
        "id" : channel.id,
        "left" : channel.channelProperty.posX,
        "top" : channel.channelProperty.posY
      }
    })
    setMappedChannels(_mappedChannels);
  }

  useEffect(() => {
    setJunctionTree()
    setSiteMaps(mapId)
    setGetMapByMapId(mapId)
    setGetJunctionById(mapId)
    setGetChannelById(9)
    // loadMappedJunctions()
    // loadMappedChannels()
  }, [])

  useEffect(() => {
  loadMappedChannels(getChannelById)
  loadMappedJunctions(getJunctionById)
  }, [getChannelById, getJunctionById])
  const cams = junctionTree?.map((junc) => junc.vJunction)
  const channels = junctionTree?.[0]?.channel
  const mapImage = siteMaps?.[0]?.jpegImage
  const childMapImg = getMapByMapId?.[0]?.jpegImage
  // loadMappedChannels()
  // loadMappedJunctions()
  // ForMainMap
  useEffect(() => {
    var base64String = "data:image/png;base64," + mapImage
    setImg(base64String)
  }, [mapImage])
  // forChildMap
  useEffect(() => {
    var base64StringChild = "data:image/png;base64," + childMapImg
    setImg(base64StringChild)
  }, [childMapImg])

  const handleImageClick = (imgId) => {
    setIsImageClicked(!isImageClicked)
    setShowDropdown(!showDropdown)
    setClickedImage(imgId)
  }

  // decides if the provided channel id belongs to the selected junction
  const checkIdChannelBelongstoSelectedJunction = (channelId) => {
    if(!selectedJunctionId){
      return false;
    }

    for(let i = 0; i< junctionTree.length; i++){
      if (junctionTree[i].vJunction.id === selectedJunctionId){
        for(let j = 0 ; j < junctionTree[i].channel.length; j++){
            if(junctionTree[i].channel[j].id === channelId){
              return true;
            }
        }
      }
    }
    return false;
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    const url = URL.createObjectURL(file)
    setImage(url)
  }, [])
  // const [cameras, setCameras] = useState([
  //   { id: 1, left: 0, top: 0 },
  //   { id: 2, left: 0, top: 0 },
  //   { id: 3, left: 0, top: 0 },
  //   { id: 4, left: 0, top: 0 },
  //   { id: 5, left: 0, top: 0 },
  //   { id: 6, left: 0, top: 0 },
  // ])
  const [cameras, setCameras] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  })
  const [image, setImage] = useState(null)
  const [fullScreen, setFullScreen] = useState(false)
  const [configuredFullScreen, setConfiguredFullScreen] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [videoEvents, setVideoEvents] = useState(false)

  // const handleDrop = (id, left, top) => {
  //     setCameras((cameras) =>
  //       cameras.map((camera) =>
  //         camera.id === id ? { ...camera, left, top } : camera
  //       )
  //     );
  //   };

  const handleShowEventsClick = () => {
    setShowEvents(!showEvents)
  }
  const handleVideoEventsClick = () => {
    setVideoEvents(!videoEvents)
  }
  const handleDrop = (id, left, top) => {
    const dropzone = document.getElementById("dropcam")
    const rect = dropzone.getBoundingClientRect()
    console.log(left)
    console.log(top)
    console.log(cams)
    console.log(id)
    // console.log(left - rect.left)
    setCameras((cameras) =>
      cameras.map((camera) =>
        camera.id === id
          ? { ...camera, left: left - rect.left, top: top - rect.top }
          : camera
      )
    )
  }
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "camera",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      console.log(offset, "offset")
      console.log(item.id, offset.x, offset.y)
      handleDrop(item.id, offset.x, offset.y)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const handleJunctionDrop = (id, left, top, jCams) => {
    const dropzone = document.getElementById("dropcam")
    const rect = dropzone.getBoundingClientRect()
    const cams = junctionTree?.map((junc) => junc.vJunction)
    console.log(junctionTree)
    console.log(left)
    console.log(top)
    console.log(cams)
    console.log(id)
    const storedId = [
      { id: id, left: left - rect.left - 24, top: top - rect.top - 24 },
    ]
    console.log("id", storedId)

    // setMappedJunctions(_mappedJunctions)
    setMappedJunctions((prevStoreId) => [...prevStoreId, ...storedId])
    console.log(mappedJunctions);
    const saveJunc = async () => {
      let payload = {
        junctionId: id,
        secondaryId: mapId,
        optional_1: storedId[0].left,
        optional_2: storedId[0].top,
      }
      const saveJuncOnDrag = await saveJunctionMapById(payload)
      console.log("res", saveJuncOnDrag)
    }
    saveJunc()
  }
  const [{ isJover }, jDrop] = useDrop(() => ({
    accept: "junction",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      console.log(offset, "offset")
      console.log(item.id, offset.x, offset.y)
      handleJunctionDrop(item.id, offset.x, offset.y, cams)
    },
    collect: (monitor) => ({
      isJOver: !!monitor.isOver(),
    }),
  }))

  // console.log("cams", junctionTree, cams);
  console.log(mappedJunctions)

  const handleChildMap = (event) => {
    console.log(event);
    console.log("clicked on junction", getChannelById)
  }
  return (
    <div className={`relative bg-white p-4`}>
      <div className="flex">
        <div className="text-xl font-semibold">Site Map Configuration</div>
        <div className="flex grow justify-end">
          <Button
            variant="outline"
            className="rounded-sm"
            onClick={() => setConfiguredFullScreen(!configuredFullScreen)}
          >
            View Configured Site Map
          </Button>
          {configuredFullScreen && (
            <div
              className={`mt-4 border bg-white p-6 ${
                configuredFullScreen
                  ? "fixed left-0 top-0 z-50 h-screen w-screen"
                  : ""
              }`}
            >
              <span className="text-[#000] font-semibold">
                {showEvents ? (
                  <div className="flex gap-2">
                    <Image
                      src="/images/Left_Arrow.svg"
                      width={24}
                      height={24}
                      alt="leftArrow"
                      onClick={handleShowEventsClick}
                    />
                    <h3 className="py-2">Junction</h3>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Junction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Junction</SelectLabel>
                          <SelectItem defaultValue value="apple">
                            Phase 1
                          </SelectItem>
                          <SelectItem value="banana">Phase 2</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  "Configured Site Map"
                )}
              </span>

              <div className="flex justify-end">
                {configuredFullScreen && (
                  <svg
                    onClick={() =>
                      setConfiguredFullScreen(!configuredFullScreen)
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.4141 6.00015L5.99991 19.4144L4.58569 18.0002L17.9999 4.58594L19.4141 6.00015Z"
                      fill="#6F6F70"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.99991 4.58594L19.4141 18.0002L17.9999 19.4144L4.58569 6.00015L5.99991 4.58594Z"
                      fill="#6F6F70"
                    />
                  </svg>
                )}
              </div>
              <div className="relative w-3/3" id="dropcam" ref={drop}>
                {cameras.map((camera) => (
                  <Camera key={camera.id} {...camera} />
                ))}
                {showEvents ? (
                  <div>
                    <Image
                      src={image}
                      width={1000}
                      height={100}
                      alt="Preview"
                      className="left-0 top-0 w-full rounded-sm"
                    />
                    <Image
                      src="/images/Video_icon.svg"
                      width={34}
                      height={34}
                      alt="video"
                      className={`absolute left-[996px] top-[420px] ${"border-[#2A94E5] "}`}
                      onClick={handleVideoEventsClick}
                    />
                    {videoEvents && (
                      <div
                        className={`border bg-black  m-40 p-6 fixed left-0 top-0 z-50 h-screen w-[100%]"
                          
                      }`}
                      >
                        <div className="flex justify-between">
                          <Image
                            src="/vectors/video-icon.svg"
                            width={24}
                            height={34}
                            alt="cctv"
                          />

                          <span onClick={handleVideoEventsClick}>X</span>
                        </div>

                        <Image
                          src="/images/florian-wehde-yeqidtd7k1A-unsplash 1.png"
                          width={1000}
                          height={100}
                          alt="img"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Image
                      src={image}
                      width={1000}
                      height={100}
                      alt="Preview"
                      className="left-0 top-0 w-full rounded-sm"
                    />
                    <Image
                      src="/images/cctv_icon.svg"
                      width={34}
                      height={34}
                      alt="cctv"
                      className={`absolute left-[120px] top-[56px] ${
                        clickedImage === "image1" && isImageClicked
                          ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                          : ""
                      }`}
                      onClick={() => handleImageClick("image1")}
                    />
                    <Image
                      src="/images/cctv_icon.svg"
                      width={34}
                      height={34}
                      alt="cctv"
                      className={`absolute left-[330px] top-[140px] ${
                        clickedImage === "image2" && isImageClicked
                          ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                          : ""
                      }`}
                      onClick={() => handleImageClick("image2")}
                    />
                    <Image
                      src="/images/cctv_icon.svg"
                      width={34}
                      height={34}
                      alt="cctv"
                      className={`absolute left-[96px] top-[240px] ${
                        clickedImage === "image3" && isImageClicked
                          ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                          : ""
                      }`}
                      onClick={() => handleImageClick("image3")}
                    />
                    <Image
                      src="/images/cctv_icon.svg"
                      width={34}
                      height={34}
                      alt="cctv"
                      className={`absolute left-[270px] top-[266px] ${
                        clickedImage === "image4" && isImageClicked
                          ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                          : ""
                      }`}
                      onClick={() => handleImageClick("image4")}
                    />
                    <Image
                      src="/images/cctv_icon.svg"
                      width={34}
                      height={34}
                      alt="cctv"
                      className={`absolute left-[270px] top-[428px] ${
                        clickedImage === "image5" && isImageClicked
                          ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                          : ""
                      }`}
                      onClick={() => handleImageClick("image5")}
                    />
                  </div>
                )}

                <div className="absolute right-6 top-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-sm bg-[#EEF8FF] text-[#2A94E5]"
                      >
                        Analytics Configuration
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 text-[#0F0F10]">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem onClick={handleShowEventsClick}>
                        Show Events
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Show Status
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-4 border bg-white p-4 ${
          fullScreen ? "fixed left-0 top-0 z-50 h-screen w-screen" : ""
        }`}
      >
        <div className="flex justify-end">
          {fullScreen ? (
            <svg
              onClick={() => setFullScreen(!fullScreen)}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.4141 6.00015L5.99991 19.4144L4.58569 18.0002L17.9999 4.58594L19.4141 6.00015Z"
                fill="#6F6F70"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.99991 4.58594L19.4141 18.0002L17.9999 19.4144L4.58569 6.00015L5.99991 4.58594Z"
                fill="#6F6F70"
              />
            </svg>
          ) : (
            <svg
              onClick={() => setFullScreen(!fullScreen)}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M22 2V8.66667H19.7778V5.78889L16.1222 9.45556L14.5444 7.87778L18.2111 4.22222H15.3333V2H22ZM2 2V8.66667H4.22222V5.78889L7.87778 9.45556L9.45556 7.87778L5.78889 4.22222H8.66667V2H2ZM22 22V15.3333H19.7778V18.2111L16.1222 14.5556L14.5556 16.1222L18.2111 19.7778H15.3333V22H22ZM8.66667 22V19.7778H5.78889L9.44444 16.1222L7.87778 14.5444L4.22222 18.2111V15.3333H2V22H8.66667Z"
                fill="#6F6F70"
              />
            </svg>
          )}
        </div>
        <div className="relative mt-2 flex gap-4">
          <div className="w-1/3 p-4">
            <div className="py-2 font-semibold">Junction Tree</div>
            {/* <Input className="py-2" placeholder="Search" /> */}
            <div className="flex flex-col">
              <Accordion type="single" collapsible>
                {cams.map((cam) => (
                  <AccordionItem key={cam.id} value={`item-${cam.id}`}>
                    <AccordionTrigger>
                      <div className="relative">
                        <Junction {...cam} fromMenu={true} />
                      </div>
                      {/* <Image
                        alt="cctv icon"
                        src="/vectors/cctv_icon.svg"
                        width={24}
                        height={24}
                      />
                      {cam.name} */}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex w-full flex-col gap-4">
                        {channels?.map((channel, index) => (
                          <div className="flex gap-4" key={channel.id}>
                            <div className="relative">
                              <Camera {...channel} fromMenu={true} />
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="14"
                              viewBox="0 0 20 14"
                              fill="none"
                            >
                              <path
                                d="M16 2C16 0.897 15.103 0 14 0H2C0.897 0 0 0.897 0 2V12C0 13.103 0.897 14 2 14H14C15.103 14 16 13.103 16 12V8.667L20 12V2L16 5.333V2ZM14.002 12H2V2H14L14.001 6.999L14 7L14.001 7.001L14.002 12Z"
                                fill="#9F9F9F"
                              />
                            </svg>
                            {channel.name}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          {image ? (
            <div className="relative w-2/3 grow" id="dropcam" ref={drop}>
              {cameras.map((camera) => (
                <Camera key={camera.id} {...camera} />
              ))}
              <Image
                src={image}
                width={1000}
                height={700}
                alt="Preview"
                className="left-0 top-0 w-full"
              />
              <Image
                src="/images/cctv_icon.svg"
                width={34}
                height={34}
                alt="cctv"
                className={`absolute left-[120px] top-[56px] ${
                  clickedImage === "image1" && isImageClicked
                    ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                    : ""
                }`}
                onClick={() => handleImageClick("image1")}
              />
              <Image
                src="/images/cctv_icon.svg"
                width={34}
                height={34}
                alt="cctv"
                className={`absolute left-[330px] top-[140px] ${
                  clickedImage === "image2" && isImageClicked
                    ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                    : ""
                }`}
                onClick={() => handleImageClick("image2")}
              />
              <Image
                src="/images/cctv_icon.svg"
                width={34}
                height={34}
                alt="cctv"
                className={`absolute left-[96px] top-[240px] ${
                  clickedImage === "image3" && isImageClicked
                    ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                    : ""
                }`}
                onClick={() => handleImageClick("image3")}
              />
              <Image
                src="/images/cctv_icon.svg"
                width={34}
                height={34}
                alt="cctv"
                className={`absolute left-[270px] top-[266px] ${
                  clickedImage === "image4" && isImageClicked
                    ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                    : ""
                }`}
                onClick={() => handleImageClick("image4")}
              />
              <Image
                src="/images/cctv_icon.svg"
                width={34}
                height={34}
                alt="cctv"
                className={`absolute left-[270px] top-[428px] ${
                  clickedImage === "image5" && isImageClicked
                    ? "bg-[#EEF8FF] border-[#2A94E5] p-1 border rounded-full"
                    : ""
                }`}
                onClick={() => handleImageClick("image5")}
              />
              {showDropdown ? (
                <div className="absolute right-6 top-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-sm bg-[#EEF8FF] text-[#2A94E5]"
                      >
                        More Options
                        <Image
                          src="/images/Hamburger_menu.svg"
                          width={24}
                          height={24}
                          alt="Hamburger"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 text-[#0F0F10]">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem>
                        Set map for junction
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                      // checked={showActivityBar}
                      // onCheckedChange={setShowActivityBar}
                      // disabled
                      >
                        Remove channel from map
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                      // checked={showPanel}
                      // onCheckedChange={setShowPanel}
                      >
                        Remove junction from map
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                      // checked={showActivityBar}
                      // onCheckedChange={setShowActivityBar}
                      // disabled
                      >
                        Remove map for junction
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                      // checked={showActivityBar}
                      // onCheckedChange={setShowActivityBar}
                      // disabled
                      >
                        Change map image
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="absolute right-6 top-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        disabled
                        className="rounded-sm bg-[#D9D9D9] text-[#F6F6F6]"
                      >
                        More Options
                        <Image
                          src="/images/Hamburger_menu2.svg"
                          width={24}
                          height={24}
                          alt="Hamburger"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              )}
              <div className="text-right">
                <span
                  className="cursor-pointer text-xs text-slate-400"
                  onClick={() => setImage(null)}
                >
                  Remove Image
                </span>
              </div>
            </div>
          ) : (
            // <div>
            //   {img && (
            //     <img
            //       src={img}
            //       alt="Site Map"
            //       width={1000}
            //       height={700}
            //       className="left-0 top-0 w-full"
            //     />
            //   )}
            // </div>

            <div
              {...getRootProps({ className: "dropzone border grow w-2/3" })}
              ref={jDrop}
              id="dropcam"
            >
              <div
                style={{ "--image-url": `url(${img})` }}
                className=" h-96 w-full  bg-[image:var(--image-url)]"
              >
                { displayMode === 'junction' ? 
                mappedJunctions?.map((e, index) => (
                  <Image
                    key={index}
                    alt="cctv icon"
                    src="/images/cctv_icon.svg"
                    width={24}
                    height={24}
                    className={` relative`}
                    style={{
                      left: e.left,
                      top: e.top,
                    }}
                    onClick={handleChildMap}
                  />
                )) : 
                mappedChannels?.map((e, index) => 
                checkIdChannelBelongstoSelectedJunction(e.id) ?
                (
                  <Image
                    key={index}
                    alt="cctv icon"
                    src="/vectors/camera-setting.svg"
                    width={24}
                    height={24}
                    className={` relative`}
                    style={{
                      left: e.left,
                      top: e.top,
                    }}
                  />
                ) : <div hidden></div>)}
                {/* {cams.map(e => {
                  <Image
                  src=""
                  alt="Placeholder"
                  className="z-10 left-100 right-100 relative"
                  style={{
                    left : e.left,
                    top: e.top
                  }}
                {/* />
                })} */}
                {/* <Image
                  src=""
                  alt="Placeholder"
                  className="z-10 left-100 right-100 relative"
                  style={{
                    left : "100px",
                    top: "100px"
                  }}
                /> */}

                {/* <input {...getInputProps()} />
                <div className="text-center">
                  Drag And Drop map image here or{" "}
                  <span className="text-[#2A94E5] underline">Browse </span>
                </div>
                <div className="text-center text-xs">
                  Images must be .jpg, .jpeg, .png, .gif or .bmp format maximum
                  Image Size Accepted: 5MB
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SiteMap
