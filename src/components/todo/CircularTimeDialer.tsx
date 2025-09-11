"use client";

import { useState, useEffect } from 'react';

interface CircularTimeDialerProps {
  onTimeChange: (minutes: number) => void;
  initialTime?: number;
}

export function CircularTimeDialer({ onTimeChange, initialTime = 15 }: CircularTimeDialerProps) {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [isDragging, setIsDragging] = useState(false);

  const timeOptions = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];
  const angleStep = 360 / timeOptions.length;

  useEffect(() => {
    onTimeChange(selectedTime);
  }, [selectedTime, onTimeChange]);

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}:00`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Time Display */}
      <div className="text-4xl font-bold text-white my-4 pb-4">
        {formatTime(selectedTime)}
      </div>

      {/* Circular Dialer - Smaller and positioned around plant circle */}
      <div className=" w-64 h-64 ">
        {/* Background Circle - Larger to encompass plant circle */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/10"></div>
        
        {/* Time Options - Positioned around the circumference */}
        {timeOptions.map((time, index) => {
          const angle = (index * angleStep - 90) * (Math.PI / 180);
          const radius = 100; // Smaller radius for tighter circle
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isSelected = time === selectedTime;
          
          return (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-focus0x text-white scale-110 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {time}
            </button>
          );
        })}
        
        {/* Center area - empty space for plant circle from parent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full flex items-center justify-center">
          {/* Plant circle will be rendered by parent component */}
        </div>
      </div>

    </div>
  );
}
