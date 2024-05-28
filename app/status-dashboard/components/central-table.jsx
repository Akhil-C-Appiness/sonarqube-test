
import { toPercentage, getDate } from '@/lib/common'
const CentralTable = ({centralviewListArray, isError}) => {
    let trodd = "h-[45px] bg-[#F6F6F6] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    let treven = "h-[45px] bg-[#FFFFFF] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    let trevenh = "h-[45px] bg-[#FFFFFF] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40] border-t-2";
    let trerror = "h-[45px] bg-red-100 px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    const status = ["OK","WARNING","DEAD","DISCONNECTED","UNKNOWN"];
    return (
        <table className="w-full" cellPadding="6px">
            <tr>
                <th className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]"></th>
                <th colSpan="2" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Machine</th>
                <th colSpan="3" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Resource</th>
                <th colSpan="5" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">All Process Status</th>
                <th className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Junction</th>
                <th colSpan="3" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Camera</th>
                <th colSpan="4" className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Common Status</th>
            </tr>
            <tr className={trevenh}>
                <th className="border-e-2">SL No</th>
                <th className='min-w-[80px]'>Name</th>
                <th className="min-w-[60px] border-e-2">IP</th>
                <th>CPU Uses (%)</th>
                <th>Memory Uses (GB)</th>
                <th className="border-e-2">Storage Uses (GB)</th>
                <th>Name</th>
                <th>Status</th>
                <th>Last Shutdown</th>
                <th>Last Restart</th>
                <th className="border-e-2">Details</th>
                <th className="border-e-2">Junction</th>
                <th className='min-w-[95px]'>ANPR</th>
                <th className='min-w-[95px]'>RLVD</th>
                <th className="min-w-[95px] border-e-2">Others</th>
                <th>Frame Drop<br />(Last 5min)</th>
                <th>Pending Event</th>
                <th>Pending Recording</th>
                <th>Pending Event Clip</th>
            </tr>
            {centralviewListArray.map((item, index) => (
                (!isError || item.errorStatus ? 
                <>
                <tr className={item.errorStatus ? trerror:trevenh}>
                    <td rowSpan={item.allProcessStatusLength} className="border-e-2 align-baseline">{index+1}</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{item.machineName}</td>
                    <td rowSpan={item.allProcessStatusLength} className="border-e-2 align-baseline">{item.machineIp}</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{toPercentage(item.machineCpuUsedInPercentage,item.machineCpuTotalInPercentage)}%</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{item.machineMemoryUsed} of {item.machineMemoryTotal}</td>
                    <td rowSpan={item.allProcessStatusLength} className="border-e-2 align-baseline">{item.machineStorageUsedInGB} of {item.machineStorageTotalInGB}</td>
                    <td>{item.allProcessStatusLength > 0 ? item.allProcessStatus[0].processName : ""}</td>
                    <td className={item.allProcessStatus[0].status === 0? "text-green-600": "text-red-400"}>{item.allProcessStatusLength > 0 ? status[item.allProcessStatus[0].status] : ""}</td>
                    <td>{getDate(item.allProcessStatus[0].stoppedAt)}</td>
                    <td>{getDate(item.allProcessStatus[0].startedAt)}</td>
                    <td className="border-e-2">{item.allProcessStatusLength > 0 && item.allProcessStatus[0].details !== null ? JSON.stringify(item.allProcessStatus[0].details) : ""}</td>
                    <td rowSpan={item.allProcessStatusLength} className="border-e-2 align-baseline">[Faulty - {item.problamaticJunctionServerCount}]<br />[Working - { item.totalJunctionServerCount - item.problamaticJunctionServerCount}]<br />[Total - {item.totalJunctionServerCount}]</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">[Faulty - {item.problamaticAnprCameraCount}]<br />[Working - {item.totalAnprCameraCount - item.problamaticAnprCameraCount}]<br />[Total - {item.totalAnprCameraCount}]</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">[Faulty - {item.problamaticEvidenceCameraCount}]<br />[Working - {item.totalEvidenceCameraCount - item.problamaticEvidenceCameraCount}]<br />[Total - {item.totalEvidenceCameraCount}]</td>
                    <td rowSpan={item.allProcessStatusLength} className="border-e-2 align-baseline">[Faulty - {item.problamaticOthersCameraCount}]<br />[Working - {item.totalOthersCameraCount - item.problamaticOthersCameraCount}]<br />[Total - {item.totalOthersCameraCount}]</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{item.analyticsFrameDroppedCount}</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{item.pendingEventCount}</td>
                    <td rowSpan={item.allProcessStatusLength} className="align-baseline">{item.pendingRecordedClipCount}</td>
                    <td rowSpan={item.allProcessStatusLength}className="align-baseline">{item.pendingRecordedClipCount}</td>
                </tr>
                {item.allProcessStatusLength > 1 ? 
                item.allProcessStatus.map((allProcessitem, index) => (
                    index !== 0 ? 
                    <tr className={index % 2 == 0 ? treven : trodd}>
                        <td>{allProcessitem.processName}</td>
                        <td className={allProcessitem.status === 0? "text-green-600": "text-red-400"}>{status[allProcessitem.status]}</td>
                        <td>{getDate(allProcessitem.stoppedAt)}</td>
                        <td>{getDate(allProcessitem.startedAt)}</td>
                        <td className="border-e-2">{allProcessitem.details !== null ? JSON.stringify(allProcessitem.details) : ""}</td>
                    </tr>
                    : ""
                ))
                : ""}
                </>
                :<></>)
            ))}
        </table>      
    )
}
export default CentralTable