
import React, { useRef, useEffect, useState } from 'react';

interface PickerColumnProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  label: string;
  height?: number; // Total height of the visible area
  itemHeight?: number; // Height of each number
}

const PickerColumn: React.FC<PickerColumnProps> = ({ 
  min, 
  max, 
  value, 
  onChange, 
  label,
  height = 256,
  itemHeight = 64 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate padding to ensure the first and last items can be centered
  // Example: Container 256px, Item 64px. Center is at 128px. 
  // We need top padding of (256/2) - (64/2) = 128 - 32 = 96px.
  const paddingY = (height / 2) - (itemHeight / 2);

  // Sync scroll position when external value changes (e.g. initial load or reset)
  // But DO NOT sync if we are currently scrolling (to avoid fighting user input)
  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      scrollRef.current.scrollTop = value * itemHeight;
    }
  }, [value, itemHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;
    const scrollTop = e.currentTarget.scrollTop;
    
    // Calculate nearest index
    const index = Math.round(scrollTop / itemHeight);
    
    // Clamp index
    const clampedIndex = Math.max(0, Math.min(index, range.length - 1));
    const newValue = range[clampedIndex];

    if (newValue !== value) {
        // Use a timeout to avoid excessive state updates, but here we want responsiveness
        // For standard React rendering, this is usually fine.
        onChange(newValue);
    }

    // Debounce scroll end detection
    if ((window as any).scrollTimeout) clearTimeout((window as any).scrollTimeout);
    (window as any).scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
        // Optional: Force snap visually if CSS didn't catch it perfectly (redundancy)
    }, 150);
  };

  const handleClickItem = (val: number) => {
      if (scrollRef.current) {
          scrollRef.current.scrollTo({
              top: val * itemHeight,
              behavior: 'smooth'
          });
      }
      onChange(val);
  };

  return (
    <div 
        className="relative flex flex-col items-center group" 
        style={{ height, width: '100px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Highlight (Lens) */}
      <div 
        className="absolute w-full border-y border-indigo-500/30 dark:border-indigo-400/30 bg-indigo-500/5 dark:bg-white/5 pointer-events-none transition-opacity duration-300 z-0"
        style={{ 
            height: itemHeight, 
            top: paddingY,
            borderRadius: '12px'
        }}
      />

      {/* Label */}
      <div className="absolute -top-6 text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase z-20">
          {label}
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory relative z-10 py-0 scroll-smooth"
        style={{ scrollPaddingTop: paddingY }}
      >
        {/* Top Spacer */}
        <div style={{ height: paddingY }} className="w-full flex-shrink-0" />

        {range.map((num) => (
          <div
            key={num}
            onClick={() => handleClickItem(num)}
            className={`
                w-full flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none
                ${num === value 
                    ? 'text-4xl font-black text-indigo-600 dark:text-white scale-110 opacity-100' 
                    : 'text-2xl font-medium text-slate-400 dark:text-slate-600 scale-90 opacity-40 hover:opacity-70'}
            `}
            style={{ height: itemHeight }}
          >
            {num.toString().padStart(2, '0')}
          </div>
        ))}

        {/* Bottom Spacer */}
        <div style={{ height: paddingY }} className="w-full flex-shrink-0" />
      </div>
      
      {/* Gradients to fade top/bottom */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-20" />
    </div>
  );
};

interface TimePickerProps {
    hours: number;
    minutes: number;
    seconds: number;
    onHourChange: (v: number) => void;
    onMinuteChange: (v: number) => void;
    onSecondChange: (v: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
    hours, minutes, seconds, onHourChange, onMinuteChange, onSecondChange
}) => {
    return (
        <div className="flex gap-2 sm:gap-6 items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <PickerColumn 
                label="Hours" 
                min={0} max={99} 
                value={hours} 
                onChange={onHourChange} 
            />
            <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 pb-2">:</div>
            <PickerColumn 
                label="Minutes" 
                min={0} max={59} 
                value={minutes} 
                onChange={onMinuteChange} 
            />
            <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 pb-2">:</div>
            <PickerColumn 
                label="Seconds" 
                min={0} max={59} 
                value={seconds} 
                onChange={onSecondChange} 
            />
        </div>
    );
};

export default TimePicker;
