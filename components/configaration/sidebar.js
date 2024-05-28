import dynamic from 'next/dynamic';

// import SidebarRow from "./sidebarRow"
const SidebarRow = dynamic(() => import("./sidebarRow"));


const ConfigSidebar = () => {
  return (
    <div className="sidebar sticky">
      <SidebarRow
        href="/configuration/user-management"
        title="User Management"
      />
      <SidebarRow
        href="/configuration/server-storage"
        title="Server and Storage Configuration"
      />
      {/* <SidebarRow href="/configuration/camera-search" title="Camera Search" /> */}
      <SidebarRow
        href="/configuration/camera-configuration"
        title="Camera Configuration"
      />
      <SidebarRow
        href="/configuration/vehicle-registration"
        title="Vehicle Registration"
      />
      {/* <SidebarRow
        href="/configuration/site-map"
        title="Site Map Configuration"
      /> */}
      <SidebarRow
        href="/configuration/challan-server"
        title="Challan Server Configuration"
      />
      {/* <SidebarRow
        href="/configuration/broadcast-audio"
        title="Broadcast Audio"
      /> */}
      <SidebarRow
        href="/configuration/accident-management"
        title="Accident Management"
      />
      <SidebarRow
        href="/configuration/set-hotlisted-events"
        title="Configure Hotlisted Events"
      />
    </div>
  )
}

export default ConfigSidebar
