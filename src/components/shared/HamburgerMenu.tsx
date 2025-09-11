"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sliding Menu from Left */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-forest-800/90 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/focus0x_logo.png"
                alt="Focus0x Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <h2 className="text-xl font-bold text-white">Focus0x</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Coming Soon Content in Rectangular Layout */}
        <div className="p-6 flex flex-col items-center justify-center h-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl w-full text-center">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/focus0x_logo.png"
                alt="Focus0x Logo"
                width={64}
                height={64}
                className="object-contain mx-auto"
              />
            </div>
            
            {/* Coming Soon Content */}
            <h2 className="text-2xl font-bold text-white mb-4">
              Coming Soon! 🌱
            </h2>
            
            <p className="text-white/80 mb-6 text-lg">
              We're working hard to bring you amazing new features. Stay tuned for updates!
            </p>
            
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-focus0x hover:bg-focus0x/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
