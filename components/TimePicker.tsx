
import React, { useRef, useEffect, useState, useMemo } from 'react';

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
  
  // Create 3 sets of data for infinite scroll illusion
  const range = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => i + min), [min, max]);
  const loopedRange = useMemo(() => [...range, ...range, ...range], [range]);
  
  const [isHovered, setIsHovered] = useState(false);
  const rangeLength = range.length;
  
  // Padding to center the item
  const paddingY = (height / 2) - (itemHeight / 2);

  // Initialize scroll position to the middle set
  useEffect(() => {
    if (scrollRef.current) {
        // We set the initial scroll to the corresponding item in the MIDDLE set (index + rangeLength)
        scrollRef.current.scrollTop = (value + rangeLength) * itemHeight;
    }
  }, []); // Only run on mount to set initial position

  // Sync when value changes externally (e.g. reset)
  // We only sync if we are NOT currently scrolling to avoid fighting the user
  useEffect(() => {
      if (scrollRef.current && !isScrollingRef.current) {
          const currentScroll = scrollRef.current.scrollTop;
          // Find the nearest multiple of this value in the current scroll area to avoid big jumps
          // But for simplicity, let's just jump to the middle set if deviation is large
          const currentSetIndex = Math.floor(currentScroll / (rangeLength * itemHeight));
          // Target index in the current set
          const targetIndex = (currentSetIndex * rangeLength) + value;
          
          // If we are way off, just reset to middle set
          if (Math.abs(scrollRef.current.scrollTop - targetIndex * itemHeight) > itemHeight * 2) {
             scrollRef.current.scrollTop = (rangeLength + value) * itemHeight; 
          } else {
             // Smooth scroll to near value
             scrollRef.current.scrollTo({
                 top: targetIndex * itemHeight,
                 behavior: 'smooth'
             });
          }
      }
  }, [value, rangeLength, itemHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    
    // 1. Infinite Scroll Loop Logic
    const totalHeightOneSet = rangeLength * itemHeight;
    
    // If we scroll near the top of the first set, jump to the middle set
    if (scrollTop < totalHeightOneSet / 2) {
        target.scrollTop = scrollTop + totalHeightOneSet;
    } 
    // If we scroll near the bottom of the third set, jump to the middle set
    else if (scrollTop > totalHeightOneSet * 2.5) {
        target.scrollTop = scrollTop - totalHeightOneSet;
    }

    // 2. Selection Logic
    // Adjust scrollTop for index calculation after potential jump
    const adjustedScrollTop = target.scrollTop;
    const rawIndex = Math.round(adjustedScrollTop / itemHeight);
    // Modulo to get actual value
    const normalizedIndex = rawIndex % rangeLength;
    const newValue = range[normalizedIndex];

    if (newValue !== undefined && newValue !== value) {
        onChange(newValue);
    }

    // Debounce scroll end
    if ((window as any).scrollTimeout) clearTimeout((window as any).scrollTimeout);
    (window as any).scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
        // Optional: Snap visual correction if needed, but CSS snap usually handles it
    }, 100);
  };

  const handleClickItem = (index: number) => {
      if (scrollRef.current) {
          scrollRef.current.scrollTo({
              top: index * itemHeight,
              behavior: 'smooth'
          });
      }
  };

  return (
    <div 
        className="relative flex flex-col items-center group" 
        style={{ height, width: '100px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label */}
      <div className="absolute -top-8 text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase z-20">
          {label}
      </div>

      {/* Selection Highlight (Lens) */}
      <div 
        className="absolute w-full border-y border-indigo-500/30 dark:border-indigo-400/30 bg-indigo-500/5 dark:bg-white/5 pointer-events-none transition-opacity duration-300 z-0"
        style={{ 
            height: itemHeight, 
            top: paddingY,
            borderRadius: '12px'
        }}
      />

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory relative z-10 py-0 scroll-smooth"
        style={{ 
            scrollPaddingTop: paddingY,
            // CSS Mask for fading edges (Modern & Background agnostic)
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)'
        }}
      >
        {/* Top Spacer for alignment */}
        <div style={{ height: paddingY }} className="w-full flex-shrink-0" />

        {loopedRange.map((num, i) => {
           // We render 3 sets. 
           // Calculate visual distance from center to scale items
           // This is a bit tricky in pure render without state for scroll position, 
           // so we rely on the `value` prop to highlight the active number.
           // However, since we have duplicate numbers, we need to know WHICH 60 is active.
           // Simplified: We highlight ALL instances of the current value.
           const isSelected = num === value;
           
           return (
              <div
                key={i}
                onClick={() => handleClickItem(i)}
                className={`
                    w-full flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none
                    ${isSelected
                        ? 'text-4xl font-black text-indigo-600 dark:text-white scale-110 opacity-100' 
                        : 'text-2xl font-medium text-slate-400 dark:text-slate-600 scale-90 opacity-40 hover:opacity-70'}
                `}
                style={{ height: itemHeight }}
              >
                {num.toString().padStart(2, '0')}
              </div>
           );
        })}

        {/* Bottom Spacer for alignment */}
        <div style={{ height: paddingY }} className="w-full flex-shrink-0" />
      </div>
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
    labels: { hours: string, minutes: string, seconds: string };
}

const TimePicker: React.FC<TimePickerProps> = ({
    hours, minutes, seconds, onHourChange, onMinuteChange, onSecondChange, labels
}) => {
    return (
        <div className="flex gap-2 sm:gap-6 items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <PickerColumn 
                label={labels.hours}
                min={0} max={99} 
                value={hours} 
                onChange={onHourChange} 
            />
            <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 pb-2">:</div>
            <PickerColumn 
                label={labels.minutes}
                min={0} max={59} 
                value={minutes} 
                onChange={onMinuteChange} 
            />
            <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 pb-2">:</div>
            <PickerColumn 
                label={labels.seconds}
                min={0} max={59} 
                value={seconds} 
                onChange={onSecondChange} 
            />
        </div>
    );
};

export default TimePicker;
