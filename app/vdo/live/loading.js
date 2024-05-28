

const Loading = ()=>{
    return <div className="w-full">
            <div className="flex justify-end py-4 gap-2">

                
                <div className="w-36 bg-slate-300 animate-pulse h-8"></div>
                <div className="w-36 bg-slate-300 animate-pulse h-8"></div>
                <div className="w-24 bg-slate-300 animate-pulse h-8"></div>
            </div>
            <div className=" grid grid-cols-3 gap-4">
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
                <div className="h-48 bg-slate-300 animate-pulse w-full"></div>
            </div>
    </div>
}

export default Loading;