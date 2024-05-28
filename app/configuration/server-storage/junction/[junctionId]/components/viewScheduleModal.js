"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ScheduleConfig from "../../../components/schedule-config"

const ViewSchedule = ({setOpen, open, schedule, hideVal}) => {
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      
      <DialogContent className="lg:max-w-screen-xl overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>View Schedule</DialogTitle>
        </DialogHeader>
        <div className="w-full">
        <ScheduleConfig schedule={schedule} hideVal={hideVal} />
        </div>
        <DialogFooter>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default ViewSchedule