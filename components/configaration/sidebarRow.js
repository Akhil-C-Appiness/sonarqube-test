'use client'
import dynamic from 'next/dynamic';

// import Link from "next/link"
const Link = dynamic(() => import("next/link"));
import { usePathname } from "next/navigation"
const SidebarRow = ({title, href}) => {
    const pathname = usePathname()
    return <Link href={href}><div  className={`w-full flex items-center space-x-2 p-4 hover:bg-[#EEF8FF] font-medium cursor-pointer hover:border-r-primary hover:border-r-4 transition ease-in-out hover:translate-x-0.5 hover:text-primary ${pathname.includes(href)?'bg-[#EEF8FF] border-r-primary border-r-4 text-primary':''}`}>{title}</div></Link>
    
}

export default SidebarRow