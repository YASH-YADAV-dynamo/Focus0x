"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const menuItems = [
    { id: 'forest', label: 'Forest', icon: '🌲' },
    { id: 'focus-challenge', label: 'Focus Challenge', icon: '🏆' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'tags', label: 'Tags', icon: '🏷️' },
    { id: 'achievements', label: 'Achievements', icon: '🏅' },
  ];

  const handleItemClick = (itemId: string) => {
    console.log(`Clicked on ${itemId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-forest-400 to-forest-600 z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Focus0x</h2>
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

        {/* Menu Items */}
        <div className="p-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full flex items-center space-x-4 p-4 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center text-white/70 text-sm">
            <p>Focus0x v1.0</p>
            <p>Stay focused, grow your forest</p>
          </div>
        </div>
      </div>
    </>
  );
}
