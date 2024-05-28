"use client"
import dynamic from 'next/dynamic';

// import ConfigSidebar from '@/components/configaration/sidebar'

const ConfigSidebar = dynamic(()=>import("@/components/configaration/sidebar"))

const ConfigLayout = ({children}) => {
    return <div className="flex min-h-screen py-4 gap-4 w-full max-w-[94%]">
         <div className="bg-white w-1/4 relative">
            <ConfigSidebar />
        </div>
        <div className="bg-white w-3/4 relative">{children}</div>
        
        </div>
}

export default ConfigLayout;