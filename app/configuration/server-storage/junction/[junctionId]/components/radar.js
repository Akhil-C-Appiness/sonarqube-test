import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraRadar from './cameraRadar'
import AllRadars from './allRadar'

const RadarConfig = ()=>{
  return <div className="w-full">
    <Tabs defaultValue="camera-radar" className="w-full">
  <TabsList>
    <TabsTrigger value="camera-radar">Camera Radar Association</TabsTrigger>
    <TabsTrigger value="all-radars">All Radars</TabsTrigger>
  </TabsList>
  <TabsContent value="camera-radar"><CameraRadar /></TabsContent>
  <TabsContent value="all-radars"><AllRadars /></TabsContent>
</Tabs>
  </div>
}
export default RadarConfig;