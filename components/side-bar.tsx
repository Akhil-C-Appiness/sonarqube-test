"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FC } from 'react';

import { userLogout } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
export function SideBar() {
  const [open, setOpen] = React.useState(false)
  const [errorMsg, seterrormsg] = React.useState("")
  const pathname = usePathname()
  
  const router = useRouter()
  const onLiveMonitoring = () => {
    router.push("/video/live")
  }

  // const onLogout = async () => {
  //   router.push("/login")
  //   const userdata = await userLogout()
  //   if (userdata.status == 2003) {
  //   } else {
  //     seterrormsg(userdata.message)
  //   }
  // }
  interface MenuItemProps {
    name: string;
    href: string;
    icon: string;
    activePath: string;
    transitionDuration: number;
  }
  const MenuItem: FC<MenuItemProps> = ({ name, href, icon, activePath, transitionDuration }) => {
    const pathname = usePathname(); 
  
    return (
      <div className={` ${pathname.includes(activePath) ? 'border-[#2A94E5] bg-blue-50 border-r-4  border-primary' : ''}   hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]`}>
        <Link href={href}>
          <div className="flex items-center hover:bg-blue-50 h-16  pl-3">
            <Image
              src={icon}
              width={25}
              height={25}
              alt="Dashboard"
              className="w-6"
            />
            <div className={`group-hover:opacity-100  whitespace-nowrap opacity-0  duration-${transitionDuration} overflow-hidden pl-4 transform group-hover:translate-x-0 -translate-x-20 trans transition `}>{name}</div>
          </div>
        </Link>
      </div>
    );
  };
    

  return <div className="bg-white w-16 group hover:w-60 duration-100 hover:shrink-0  flex flex-col gap-4 pt-4 h-full sticky" >
    
        <div className="flex flex-col gap-4 pl-2">
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('dashboard')&&<MenuItem href="/dashboard/today" activePath="/dashboard" icon="/images/Overview_icons.svg" name="Dashboard" transitionDuration={150}/>}
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('comparision')&&<MenuItem href="/comparison" activePath="/comparison" icon="/images/Menu_icons.svg" name="Compare Data" transitionDuration={200} />}
          {/* <MenuItem href="/video/live" activePath="/video/live" icon="/images/Play_icons.svg" name="Live Monitoring" transitionDuration={300} /> */}
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('events')&&<MenuItem href="/vdo/eventsnew" activePath="/vdo/eventsnew" icon="/images/Play_icons.svg" name="Live Monitoring" transitionDuration={300} />}
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('investigate')&&<MenuItem href="/investigate/search" activePath="/investigate/search" icon="/images/investigation.svg" name="Investigate" transitionDuration={300} />}
          {/* <MenuItem href="/investigate/search" activePath="/investigate/search" icon="/images/Play_icons.svg" name="Investigate" transitionDuration={300} /> */}
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('configuration')&&<MenuItem href="/configuration" activePath="/configuration" icon="/images/config_icon_grey.svg" name="Configuration" transitionDuration={300} />}
          {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('support')&&<MenuItem href="https://www.videonetics.com/support#ticket" activePath="/support" icon="/images/Contact_icons.svg" name="Support" transitionDuration={300} />}
        {process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes('contact')&&<MenuItem href="https://www.videonetics.com/contact-us" activePath="/Contact Us/" icon="/images/Profile_icons.svg" name="Contact Us" transitionDuration={300} />}
        </div>

        <div className="grow pt-24">
        
        </div>
        {/* /images/config_icon_grey.svg */}
        {/* <MenuItem href="/dashboard/today" includes="/dashboard" icon="/images/Overview_icons.svg" name="Dashboard" />
        <MenuItem href="/dashboard/today" includes="/dashboard" icon="/images/Overview_icons.svg" name="Dashboard" /> */}
       
  </div>
  // return (
  //   <ScrollArea
  //     className={`h-ful bg-white ${
  //       open ? "w-60" : " w-14"
  //     } relative duration-300`}
  //   >
  //     <div
  //       className="mx-0"
  //       onMouseEnter={() => setOpen(true)}
  //       onMouseLeave={() => setOpen(false)}
  //     >
  //       <div className={`group ${pathname.includes('/dashboard')?'border-[#2A94E5] bg-[#EEF8FF]':''} hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]`}>
  //       <Link href={`/dashboard/today`}>
  //         <Button
  //           variant="outline"
  //           className={`my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src="/images/Overview_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="Dashboard"
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             Dashboard
  //           </span>
  //         </Button>
  //         </Link>
  //       </div>
  //       <div className="group hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]">
  //         {/* <Button
  //           variant="outline"
  //           className={` my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src="/images/Menu_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="CompareData"
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             Compare Data
  //           </span>
  //         </Button> */}
  //         <Link href={`/comparison`}>
  //         <Button
  //           variant="outline"
  //           className={`my-5 gap-2 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src="/images/Menu_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="Dashboard"
  //             className=""
  //           />
  //           <span
  //             className={`font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } pl-1  group-hover:text-[#2A94E5]`}
  //           >
  //             Compare Data
  //           </span>
  //         </Button>
  //         </Link>
  //       </div>
  //       <div className="group hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]">
  //         <Button
  //           variant="outline"
  //           className={` my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //           onClick={onLiveMonitoring}
  //         >
  //           <Image
  //             src="/images/Play_icons.svg"
  //             width="24"
  //             height="40"
  //             className="top-20 "
  //             alt="play"
  //           />
  //           <span
  //             className={`font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } pl-3  group-hover:text-[#2A94E5]`}
  //           >
  //             Live Monitoring
  //           </span>
  //         </Button>
  //       </div>
  //       <div className={`group ${pathname.includes('/configuration')?'border-[#2A94E5] bg-[#EEF8FF]':''} hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]`}>
  //         <Link href={`/configuration`}><Button
  //           variant="outline"
  //           className={`my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src={`${pathname.includes('/configuration')?'/images/config_icon_blue.svg':'/images/config_icon_grey.svg'}`}
  //             width="24"
  //             height="40"
  //             alt="Configuration"
  //             className="ml-2"
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             Configuration
  //           </span>
  //         </Button></Link>
  //       </div>
  //       <div className="group mt-20 hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]">
  //         <Button
  //           variant="outline"
  //           className={`my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src="/images/Profile_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="user"
  //             className=""
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             User
  //           </span>
  //         </Button>
  //       </div>
  //       <div className="group hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]">
  //         <Button
  //           variant="outline"
  //           className={` my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //         >
  //           <Image
  //             src="/images/Contact_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="contact"
  //             className="group-hover:stroke-white"
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             Support
  //           </span>
  //         </Button>
  //       </div>
  //       <div className="group mb-40 hover:border-y-0 hover:border-l-0 hover:border-r-4 hover:border-[#2A94E5] hover:bg-[#EEF8FF]">
  //         {/* <Button
  //           variant="outline"
  //           className={` my-5 border-transparent hover:bg-[#EEF8FF]${
  //             !open && "ml-3"
  //           }`}
  //           onClick={onLogout}
  //         >
  //           <Image
  //             src="/images/Logout_icons.svg"
  //             width="24"
  //             height="40"
  //             alt="logout"
  //             className="group-hover:stroke-white"
  //           />
  //           <span
  //             className={`pl-3 font-medium text-[#878788] ${
  //               !open && "scale-0"
  //             } group-hover:text-[#2A94E5]`}
  //           >
  //             Logout
  //           </span>
  //         </Button> */}
  //       </div>
  //     </div>
  //   </ScrollArea>
  // )
}
