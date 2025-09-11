"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Complete splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      <div className="text-center text-white">
        {/* Logo/Icon */}
        <div className="mb-8 animate-pulse">
          <div className="w-32 h-32 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/20 p-4">
            <Image
              src="/focus0x_logo.png"
              alt="Focus0x Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">
          Focus0x
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-white/80 mb-8 animate-fade-in-delay">
          Plant your focus, grow your forest
        </p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-focus0x h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-white/60 mt-2">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
