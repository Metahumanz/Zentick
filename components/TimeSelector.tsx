
import React, { useState, useRef, useEffect } from 'react';

interface TimeSelectorProps {
    hours: number;
    minutes: number;
    seconds: number;
    onHourChange: (v: number) => void;
    onMinuteChange: (v: number) => void;
    onSecondChange: (v: number) => void;
    labels: { hours: string, minutes: string, seconds: string };
}

type TimeUnit = 'hours' | 'minutes' | 'seconds' | null;

const TimeSelector: React.FC<TimeSelectorProps> = ({
    hours, minutes, seconds, onHourChange, onMinuteChange, onSecondChange, labels
}) => {
    const [activeUnit, setActiveUnit] = useState<TimeUnit>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setActiveUnit(null);
            }
        };

        if (activeUnit) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeUnit]);

    const handleSelect = (value: number) => {
        if (activeUnit === 'hours') onHourChange(value);
        if (activeUnit === 'minutes') onMinuteChange(value);
        if (activeUnit === 'seconds') onSecondChange(value);
        setActiveUnit(null); // Close after selection
    };

    const renderGrid = () => {
        if (!activeUnit) return null;

        const max = activeUnit === 'hours' ? 99 : 59;
        const currentVal = activeUnit === 'hours' ? hours : activeUnit === 'minutes' ? minutes : seconds;
        
        // Create array 0 to max
        const items = Array.from({ length: max + 1 }, (_, i) => i);

        return (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50">
                {/* Arrow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-t border-l border-white/20"></div>
                
                {/* Panel */}
                <div 
                    ref={panelRef}
                    className="w-[320px] sm:w-[400px] h-[300px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-scale-up"
                >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/50 dark:bg-black/20">
                         <span className="font-bold uppercase tracking-widest text-xs text-slate-500">Select {labels[activeUnit]}</span>
                         <button onClick={() => setActiveUnit(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 grid grid-cols-5 sm:grid-cols-6 gap-2 content-start scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent">
                        {items.map(val => (
                            <button
                                key={val}
                                onClick={() => handleSelect(val)}
                                className={`
                                    h-10 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center
                                    ${val === currentVal 
                                        ? 'bg-indigo-500 text-white shadow-lg scale-105' 
                                        : 'bg-white/50 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'}
                                `}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const UnitButton = ({ unit, value, label }: { unit: TimeUnit, value: number, label: string }) => (
        <div className="flex flex-col items-center gap-2 relative">
            <button
                onClick={() => setActiveUnit(activeUnit === unit ? null : unit)}
                className={`
                    w-20 h-24 sm:w-24 sm:h-32 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-300 border cursor-pointer
                    ${activeUnit === unit 
                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                        : 'bg-white/40 dark:bg-black/20 border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10'}
                `}
            >
                {value.toString().padStart(2, '0')}
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
            
            {/* Render the grid only under the active unit to ensure correct positioning logic visually */}
            {activeUnit === unit && renderGrid()}
        </div>
    );

    return (
        <div className="relative">
             <div className="flex gap-4 sm:gap-8 items-start justify-center p-6 sm:p-8 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/20">
                <UnitButton unit="hours" value={hours} label={labels.hours} />
                
                <div className="h-24 sm:h-32 flex items-center text-3xl sm:text-4xl font-black text-slate-400 dark:text-slate-600 pb-6">:</div>
                
                <UnitButton unit="minutes" value={minutes} label={labels.minutes} />
                
                <div className="h-24 sm:h-32 flex items-center text-3xl sm:text-4xl font-black text-slate-400 dark:text-slate-600 pb-6">:</div>
                
                <UnitButton unit="seconds" value={seconds} label={labels.seconds} />
            </div>
            
            {/* Backdrop for mobile to close when clicking outside (extra safety) */}
            {activeUnit && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveUnit(null)} />
            )}
        </div>
    );
};

export default TimeSelector;
