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
      <div className="text-4xl font-bold text-white mb-2">
        {formatTime(selectedTime)}
      </div>

      {/* Circular Dialer - Smaller and positioned around plant circle */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Background Circle - Larger to encompass plant circle */}
        <div className="absolute w-full h-full rounded-full border-2 border-white/10"></div>
        
        {/* Time Options - Positioned around the circumference */}
        {timeOptions.map((time, index) => {
          const angle = (index * angleStep - 90) * (Math.PI / 180);
          const radius = 140; // Larger radius to go around the plant circle
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
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
            >
              {time}
            </button>
          );
        })}
        
        {/* Center area for plant circle */}
        <div className="absolute w-48 h-48 bg-yellow-200 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-lg">
          <div className="w-32 h-32 relative">
            {/* This will be filled by the plant SVG from parent */}
            <div className="w-full h-full bg-forest-100 rounded-full flex items-center justify-center">
              <span className="text-forest-600 text-sm">Plant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Time Buttons - Smaller */}
      <div className="flex gap-2 flex-wrap justify-center">
        {[5, 15, 25, 45].map((time) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTime === time
                ? 'bg-focus0x text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {time}m
          </button>
        ))}
      </div>
    </div>
  );
}
