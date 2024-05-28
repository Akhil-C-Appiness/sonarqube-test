"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ReactPlayer from "react-player"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useEffect, useState , useRef} from "react"
import useStore from "@/store/store"
import { useParams } from "next/navigation"
import {getAllRadarById, getAssociatedCameras, keepAlive, startLive, stopLive, addNewCameraAssociation, getAllChannels} from "@/lib/api"
////
import RectangleOverlay from './rectangleOverlay';
/////
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import * as $ from "jquery"


const RadarConfig = ()=>{
  ////
  const [imageWidth, setImageWidth] = useState('') 
  const [imageHeight, setImageHeight] = useState('') 
  const [points, setPoints] = useState(null)
  const [videoHeight, setVideoHeight] = useState(null);
  const [videoWidth, setVideoWidth] = useState(null);
  const [tabledata, setTableData] = useState([]);
  const [open, setOpen] = useState(false)
  const [zone, setZone] = useState([]);
  // const [ANPRCamera, setANPRCamera] = useState([]);
  const [allChannelList, setallChannelList] = useState([])
  const [cameraName, SetCameraName]=useState("");
  const [cameraId, SetCameraId]=useState("");
  const [radarname, SetRadarName]=useState("");
  const [radarid, SetRadarId]=useState("");
  const [radarList, setRadarList] = useState([]);
  const [AssociatedCameras, setAssociatedCameras]= useState([]);
  const [storeRes, setStoreRes] = useState([])
  const [radarError, setRadarError] = useState("");
  const [childData, setChildData] = useState([]);
  const [initateData, setInitateData] = useState(true)
  const params = useParams();
  const { toast } = useToast()
  useEffect(()=>{
    const fetchAllChannelList = async ()=>{
      const response = await getAllChannels()
      setallChannelList(response)
    }
    fetchAllChannelList()
    const fetchRadarList = async ()=>{
      const radarData = await getAllRadarById(params.junctionId);
      setRadarList(radarData)
    }
    fetchRadarList()
    const fetchAssociatedCameras = async() =>{
      const resData = await getAssociatedCameras(params.junctionId);
      setAssociatedCameras(resData);
    }
    fetchAssociatedCameras();
  }, [])
  useEffect(()=>{
    console.log("allChannelList - ",allChannelList.length)
    console.log("initateData",initateData)
    if(allChannelList.length > 0 && initateData){
      let channelArray = [];
      allChannelList.map((channel)=>{
        if(channel.channelType == 0){
          channelArray.push(channel);
        }
      })
      let tempArray = [];
      channelArray.map((item)=>{
        let newObj = {
          chId : item.id,
          name : item.name,
          radarName : null,
          radarId : null,
          zones: []
        }
        tempArray.push(newObj);
      })
      setTableData(tempArray);
      setInitateData(false)
    }
  }, [allChannelList])
  useEffect(()=>{
    console.log("AssociatedCameras",AssociatedCameras, allChannelList)
    if(!initateData){
      AssociatedCameras.map((item)=>{
        let radarId = item.radarId;
        let radarchId = item.chId;
        let zonesArray = [];
        item.zones.map((zone)=>{
          let zoneObj = {
            "pointList" : zone.pointList,
            "referenceWidth":zone.referenceWidth,
            "referenceHeight":zone.referenceHeight,
            "settingsKeyWord":zone.settingsKeyWord
          }
          zonesArray.push(zoneObj);
        })
        let radarName = null
        if(radarList.length > 0){
          radarName = radarList.find(radar => radar.id === radarId);
        }
        // const index = tabledata.findIndex(obj => obj.chId === radarchId);
        // if (index !== -1){
        //   tabledata[index].radarName = radarName?.name;
        //   tabledata[index].radarId = radarId;
        //   tabledata[index].zones = zonesArray;
        // }
        const foundObject = tabledata.find((obj) => obj.chId === radarchId);
        if(foundObject){
          foundObject.radarName = radarName?.name;
          foundObject.radarId = radarId;
          foundObject.zones = zonesArray;
          setTableData(prevData => 
            prevData.map(obj => (obj.chId === radarchId ? { ...obj, ...foundObject } : obj))
          );
        }
      })
    }
  },[AssociatedCameras])
  useEffect(()=>{
    console.log("tabledata",tabledata)
  },[tabledata])
  useEffect(()=>{
    if(open == false){
      console.log("open",open)
      // handleStopLive();
      stopWebRTC();
    }
  },[open])
  useEffect(()=>{
    const updatedTableData = tabledata.map(item=>{
      if (item.chId === childData.chId) {
        return { ...item, zones: childData.zone };
      }
      return item;
    })
    setTableData(updatedTableData);
  },[childData])
  const OpenLiveStream = (id, name, radarId, radarName, zones) =>{
    SetCameraName(name);
    SetCameraId(id);
    setZone(zones);
    if(radarId === null){
      setRadarError("Please select contact.");
    }
    else{
      setRadarError("");
      SetRadarName(radarName);
      SetRadarId(radarId);
      setOpen(true);
      const payload = {
        channelid: id,
        resolutionwidth: 892,
        resolutionheight: 481,
        withaudio: false,
      }
      updateCameraRequest(id, payload)
      // const fetchLiveResponse = async (payload) => {
      //   const response = await startLive(payload)
      //   setStoreRes(response.data.result)
      // }
      // fetchLiveResponse(payload)
    }
  }
  const updateCameraRequest = async (id, payload) => {
    const response = await startLive(payload, id)
    const liveRes = response.data.result[0]
    console.log("liveRes :- ", liveRes)
    if (response.status === 200) {
      var streamingserveraddress =
        response.data.result[0].streamingserveraddress
      var streamingserverport = response.data.result[0].streamingserverport
      var stunserveraddress = response.data.result[0].stunserveraddress
      var stunserverport = response.data.result[0].stunserverport
      var channelId = response.data.result[0].vStreamingDetailsModel.channelId
      var streamsessionid = response.data.result[0].streamsessionid

      // setSelectedCameras([
      //   ...selectedCameras,
      //   {
      //     ...liveRes,
      //     camId: id,
      //     isLoading: false,
      //     loadingMessage: "Stream Loaded",
      //   },
      // ])

      // console.log(
      //   "Element with ID " + id + " is loaded:",
      //   document.getElementById("videoplayer")
      // )

      var webrtcURL =
        "http://" + streamingserveraddress + ":" + streamingserverport
      setTimeout(function () {
        var element = document.getElementById("videoplayer")
        if (element) {
          var webrtc = new WebRTC(
            webrtcURL,
            1,
            id,
            -1,
            1,
            1,
            1,
            element,
            stunserveraddress,
            stunserverport
          )
          element["webrtc"] = webrtc
          element["webrtc"].start()
          element["webrtcURL"] = webrtcURL
          element["isplaying"] = true
        } else {
          console.log("Element with ID " + id + " not found.")
        }
      }, 1000) // 1000 milliseconds = 1 second
    } else {
      // setSelectedCameras([
      //   ...selectedCameras,
      //   {
      //     hasError: true,
      //     camId: id,
      //     isLoading: false,
      //     loadingMessage: "Error",
      //   },
      // ])
    }
  }
  const stopWebRTC = () => {
    var element = document.getElementById("videoplayer");
    if (element && element["webrtc"]) {
      element["webrtc"].stop();
      console.log("WebRTC stream stopped.");
    } else {
      console.warn("No WebRTC instance found for element with ID 'videoplayer'.");
    }
  };
  const handleChildData = (data) => {
    setChildData(data);
    setOpen(false);
    setZone([]);
  };
  // useEffect(() => {
  //   if(storeRes.length > 0){
  //     const interval = setInterval(keepAlive(storeRes[0]?.streamsessionid), 30000)
  //     return () => {
  //       clearInterval(interval)
  //     }
  //   }
  // },[storeRes])
  // const handleStopLive = () => {
  //   stopLive(storeRes[0]?.streamsessionid)
  // }
  const updateContact = (value,id) =>{
    const updatedObject = { 
      radarName: radarList.find(model => model.id === value).name,
      radarId : value
    }; 
    // console.log("updateContact")
    setTableData(prevData => 
      prevData.map(obj => (obj.chId === id ? { ...obj, ...updatedObject } : obj))
    );
    setRadarError("");
  }
  

  const handlePlayerReady = ()=>{
    const videoElement = player.getInternalPlayer();
    if (videoElement && videoElement.videoWidth && videoElement.videoHeight) {
        console.log('Width:', videoElement.videoWidth, 'Height:', videoElement.videoHeight);
        setVideoWidth(videoElement.videoWidth)
        setVideoHeight(videoElement.videoHeight)
    }
  }
  const saveRadarConfig = async() => {
    let payloadData = [];
    tabledata.map((obj)=>{
      if(obj.radarId !== 0){
        let payloadObj = {
          "radarId" : obj.radarId,
          "chId" : obj.chId,
          "zones":obj.zones
        }
        payloadData.push(payloadObj);
      }
    })
    // console.log("payloadArray",payloadData)
    const response = await addNewCameraAssociation(payloadData, params.junctionId)
    if(response.status == 200){
      toast({
        variant: "success",
        description: "Saved successfully",
        duration:3000
      })
    }
  }
  return <div>
    <div className="mt-4">
    {tabledata.length > 0?
    <Table>
    <TableHeader className="bg-blue-100 font-semibold">
      <TableRow>
        <TableHead className="w-[100px]">Serial No.</TableHead>
        <TableHead>Camera</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead >Zone</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {tabledata.map((item,index)=>(
      <TableRow >
          <TableCell className="font-medium">{index+1}</TableCell>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="w-[300px]">
            <Select onValueChange={(value)=>updateContact(value,item.chId)}>
                <SelectTrigger>
                {item.radarName !== null && item.radarName ? item.radarName : "Select"}
                    {/* <SelectValue>{item.radarName}</SelectValue> */}
                </SelectTrigger>
                <SelectContent>
                    {radarList.map((radar) => {
                      return (<SelectItem  key={radar.id} value={radar.id} >
                        {radar.name}
                      </SelectItem>
                    )})}
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{cameraId === item.chId ? radarError : ""}</p>
          </TableCell>
          <TableCell><Button variant="link" 
          // onClick={setOpen}
          onClick={()=>{OpenLiveStream(item.chId,item.name,item.radarId, item.radarName, item.zones)}}
          >Zone</Button></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
    :
    <></>
    }
    </div>
    <div className="mt-5 flex w-full items-center justify-end">
      <Button variant="default" onClick={()=>saveRadarConfig()}>Save Changes</Button>
    </div>
    <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className={ "max-h-screen w-[900px] overflow-y-auto lg:max-w-[90%] pb-16" } >
            <DialogHeader>
              <DialogTitle>Camera Radar Association for Camera: {cameraName} , Radar : {radarname}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="relative h-auto min-h-[460px] w-full bg-slate-200">
              <div className=" top-0 h-[50px] w-full bg-black/75">
                <div className="flex h-full w-full items-center justify-between px-4">
                  <p className="text-gray-200	">{cameraName}</p>
                  {/* <Button variant="secondary" className="text-gray flex h-[38px] gap-1 text-sm">
                    <Image src="/images/edit_icon_grey.svg"  width={18} height={18} alt="icon"/> Mark Zone</Button> */}
                </div>
              </div>
              {/* {storeRes[0]?.hlsurl ? ( */}
              {/* {storeRes[0]?( */}
                <div className="relative">
                  {/* <ReactPlayer
                    url={`${process.env.NEXT_PUBLIC_URL}${storeRes[0].hlsurl}`}
                    muted={true}
                    playing={true}
                    width="100%"
                    height="auto"
                    onReady={handlePlayerReady}
                  /> */}
                  <video
                    muted={true}
                    playing={true}
                    width="100%"
                    height="100%"
                    className="max-h-full"
                    id="videoplayer"
                    style={{ objectFit: "contain" }}
                  />
                  <RectangleOverlay arrowDirection="up" 
                    videoHeight={videoHeight}
                    videoWidth={videoWidth}
                    cameraId={cameraId}
                    radarid={radarid}
                    cameraName={cameraName}
                    radarname={radarname}
                    onDataReceived={handleChildData} 
                    zone={zone}
                    setOpen={setOpen}
                    image='/images/analytic_image_placeholder.png' setImageWidth={setImageWidth} setImageHeight={setImageHeight} setPoints={setPoints}/>
                  {/* image='/images/analytic_image_placeholder.png' setImageWidth={setImageWidth} setImageHeight={setImageHeight} setPoints={setPoints} url={`${process.env.NEXT_PUBLIC_URL}${storeRes[0].hlsurl}`}/> */}
                </div>
                {/* ) : ( */}
                  {/* <div
                    className={`flex h-full w-full flex-row items-center justify-center `}
                  >
                    <Image
                      alt="videonetics-logo"
                      src="/vectors/Videonetics_logo.svg"
                      width={80}
                      height={80}
                    />
                  </div> */}
                {/*  )} */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
</div>
}


class WebRTC {
  constructor(
    base_url,
    site,
    channel,
    app,
    live,
    stream,
    timestamp,
    video_element,
    stunserverip,
    stunserverport
  ) {
    this.url =
      base_url +
      "/stream/site/" +
      site +
      "/channel/" +
      channel +
      "/app/" +
      app +
      "/live/" +
      live +
      "/stream/" +
      stream +
      "/timestamp/" +
      timestamp +
      "/webrtc"

    this.videoElement = video_element
    this.videoElement.addEventListener("loadeddata", (event) => {
      this.videoElement.play()
    })
    this.mediaStream
    this.rtcPeer
    this.stunserverip = stunserverip
    this.stunserverport = stunserverport
  }

  async start() {
    console.log("start streaming, url:", this.url)
    const peerConfig = {
      iceServers: [
        {
          urls: ["stun:" + this.stunserverip + ":" + this.stunserverport],
        },
      ],
      sdpSemantics: "unified-plan",
    }
    this.mediaStream = new MediaStream()
    this.videoElement.srcObject = this.mediaStream
    this.rtcPeer = new RTCPeerConnection(peerConfig)

    let offer = await this.rtcPeer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    console.log("offer:", offer)
    await this.rtcPeer.setLocalDescription(offer)

    this.rtcPeer.onsignalingstatechange = this.signalingStateChangeHandler(
      this.rtcPeer
    )
    this.rtcPeer.ontrack = (event) => this.onTrackHandler(event)
  }

  async signalingStateChangeHandler(rtcPeer) {
    console.log("signaling state changed, state: " + rtcPeer.signalingState)
    switch (rtcPeer.signalingState) {
      case "have-local-offer":
        $.post(
          this.url,
          {
            data: btoa(rtcPeer.localDescription.sdp),
          },
          function (arg_data) {
            try {
              console.log("answer:\n", atob(arg_data))
              rtcPeer.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: atob(arg_data),
                })
              )
            } catch (e) {
              console.warn(e)
            }
          }
        )
        break
      case "stable":
        break
      case "closed":
        break
    }
  }

  async onTrackHandler(event) {
    if (event.streams.length > 0) {
      console.log(event.streams.length + " track is received")
    } else {
      console.log("no track is received")
    }
    this.mediaStream.addTrack(event.track)
  }

  async stop() {
    console.log("stop live called")
    this.mediaStream.getTracks().forEach((track) => track.stop())
    this.rtcPeer.close()
    this.videoElement.srcObject = null
  }
}
export default RadarConfig;
