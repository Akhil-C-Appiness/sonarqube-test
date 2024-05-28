import { getDate } from '@/lib/common'
const CameraTable = ({cameraDataArray, isError}) => {
    let trodd = "h-[45px] bg-[#F6F6F6] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    let treven = "h-[45px] bg-[#FFFFFF] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    let trerror = "h-[45px] bg-red-100 px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40]";
    let trevenh = "h-[45px] bg-[#FFFFFF] px-4 py-1 text-left text-[12px] leading-4 text-[#3F3F40] border-b-2";
    return (
        <table className="w-full" cellPadding="6px">
            <tr>
                <th colSpan="2" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]"></th>
                <th colSpan="3" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Analytic Status</th>
                <th colSpan="6" className="h-[56px] border-e-2 bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Recorded Event Status</th>
                <th colSpan="6" className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Recorded Clip Status</th>
            </tr>
            <tr className={trevenh}>
                <th>SL No</th>
                <th className="border-e-2">Camera Name</th>
                <th>Frame Drop (Last 5min)</th>
                <th>Processed FPS</th>
                <th className="border-e-2">Grabbed FPS</th>
                <th>Pending Event</th>
                <th>Generate At</th>
                <th>Download At</th>
                <th>Download Size(MB)</th>
                <th>Download Time(sec)</th>
                <th className="border-e-2">Last Generated</th>
                <th>Pending Event</th>
                <th>Generate At</th>
                <th>Download At</th>
                <th>Download Size(mb)</th>
                <th>Download Time(sec)</th>
                <th>Last Generated</th>
            </tr>
            {cameraDataArray.map((item, index) => (
                (!isError || item.errorStatus ? 
                <tr className={item.errorStatus ? trerror :index % 2 == 0 ? trodd : treven}>
                    <td>{index+1}</td>
                    <td className="border-e-2">{item.numberName}</td>
                    {item.analyticsStatus !== null ? 
                        <>
                            <td>{item.analyticsStatus.analyticsFrameDroppedCount}</td>
                            <td>{item.analyticsStatus.analyticsProcessedFps}</td>
                            <td className="border-e-2">{item.analyticsStatus.analyticsGrabbedFps}</td>
                        </>
                        : <td colSpan="3" className="border-e-2">Analytic is not set/configured</td>
                    }
                    {item.eventReceiverStatus !== null ? 
                        <>
                            <td>{item.pendingEventCount !== -1 ? item.pendingEventCount : ""}</td>
                            <td>
                                {getDate(item.lastReceivedEventGenTime)}
                            </td>
                            <td>
                                {getDate(item.lastReceivedEventRecTime)}
                            </td>
                            <td>{item.downloadSize < 0 ? "NA" : item.downloadSize.toFixed(2)}</td>
                            <td>{item.downloadTime < 0 ? "NA" : item.downloadTime.toFixed(3)}</td>
                            <td className="border-e-2">
                                {getDate(item.lastGeneratedEventTime)}
                            </td>
                        </>
                        : <td colSpan="6" className="border-e-2"></td>
                    }
                    {item.recordedClipReceiverStatus !== null ? 
                        <>
                            <td>{item.pendingRecordedClipCount !== -1 ? item.pendingRecordedClipCount : ""}</td>
                            <td>
                                {getDate(item.lastReceivedRecordedClipGenTime)}
                            </td>
                            <td>
                                {getDate(item.lastReceivedRecordedClipRecTime)}
                            </td>
                            <td>{item.recordeddownloadSize < 0 ? "NA" : item.recordeddownloadSize.toFixed(2)}</td>
                            <td>{item.recordeddownloadTime < 0 ? "NA" : item.recordeddownloadTime.toFixed(3)}</td>
                            <td>
                                {getDate(item.lastGeneratedRecordedClipTime)}
                            </td>
                        </>
                        : <td colSpan="6"></td>
                    }
                </tr>
                :<></>)
            ))}
        </table>      
    )
}
export default CameraTable