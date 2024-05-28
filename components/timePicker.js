import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';

let hours = Array.from({length: 12}, (_, i) => (i+1).toString().padStart(2, '0')); // Start from 1 not 0 for hours
let minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
let seconds = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
const TimePicker = ({ value, onChange }) => {
    const date = parse(value, 'hh:mm:ss aa', new Date());
    const [selectedHour, setSelectedHour] = useState(format(date, 'hh'));
    const [selectedMinute, setSelectedMinute] = useState(format(date, 'mm'));
    const [selectedSecond, setSelectedSecond] = useState(format(date, 'ss'));
    const [selectedPeriod, setSelectedPeriod] = useState(format(date, 'aa'));
    const [prevValue, setPrevValue] = useState(value);

    useEffect(() => {
        if (value !== prevValue) {
            const date = parse(value, 'hh:mm:ss aa', new Date());
            setSelectedHour(format(date, 'hh'));
            setSelectedMinute(format(date, 'mm'));
            setSelectedSecond(format(date, 'ss'));
            setSelectedPeriod(format(date, 'aa').toUpperCase());
            setPrevValue(value);
        }
    }, [value, prevValue]);

    useEffect(() => {
        const timeString = `${selectedHour}:${selectedMinute}:${selectedSecond} ${selectedPeriod}`;
        // if (timeString !== value) {
            onChange(timeString);
        // }
    }, [selectedHour, selectedMinute,selectedSecond, selectedPeriod]);
   
    return (
        <div className="">
            <div className="inline-flex text-lg border p-[5px] rounded-md">
                <select
                    value={selectedHour}
                    onChange={e => setSelectedHour(e.target.value)}
                    className="px-2 outline-none appearance-none bg-transparent"
                >
                    {hours.map(hr => (
                        <option key={hr} value={hr}>{hr}</option>
                    ))}
                </select>
                <span className="px-2">:</span>
                <select
                    value={selectedMinute}
                    onChange={e => setSelectedMinute(e.target.value)}
                    className="px-2 outline-none appearance-none bg-transparent"
                >
                    {minutes.map(mi => (
                        <option key={mi} value={mi}>{mi}</option>
                    ))}
                </select>
                <span className="px-2">:</span>
                <select
                    value={selectedSecond}
                    onChange={e => setSelectedSecond(e.target.value)}
                    className="px-2 outline-none appearance-none bg-transparent"
                >
                    {seconds.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                    ))}
                </select>
                <select
                    value={selectedPeriod}
                    onChange={e => setSelectedPeriod(e.target.value)}
                    className="px-2 outline-none appearance-none bg-transparent"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
};

export default TimePicker;
