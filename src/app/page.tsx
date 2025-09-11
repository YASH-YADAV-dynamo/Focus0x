"use client";

import { useState, useEffect } from "react";
import {
  useUtils,
  usePopup,
  useMainButton,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/useTodos";
import { CircularTimeDialer } from "@/components/todo/CircularTimeDialer";
import { HamburgerMenu } from "@/components/shared/HamburgerMenu";
import { counterAbi } from "@/constants/abi";
import { counterAddress } from "@/constants";

export default function Home() {
  const utils = useUtils();
  const popUp = usePopup();
  const mainBtn = useMainButton();
  const viewport = useViewport();
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const { addTodo, getCompletedTodos } = useTodos();
  const [selectedTime, setSelectedTime] = useState(15);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15);

  const completedTodos = getCompletedTodos();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusing && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsFocusing(false);
            mainBtn.hide();
            // Add completed todo
            addTodo(`Focus session completed (${selectedTime} min)`, 'medium');
            return selectedTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusing, timeRemaining, selectedTime, addTodo, mainBtn]);

  const handleStartFocus = async () => {
    try {
      // Trigger transaction when starting focus
      await writeContract({
        address: counterAddress,
        abi: counterAbi,
        functionName: "increment",
      });
      
      setIsFocusing(true);
      setTimeRemaining(selectedTime);
    mainBtn.enable();
      mainBtn.setText("Stop Focus");
      mainBtn.setBgColor("#22C55E");
      mainBtn.show();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleStopFocus = () => {
    setIsFocusing(false);
    setTimeRemaining(selectedTime);
    mainBtn.hide();
  };

  mainBtn.on("click", () => {
    if (isFocusing) {
      handleStopFocus();
    } else {
      handleStartFocus();
    }
  });

  const handleViewport = async () => {
    if (!viewport?.isExpanded) {
      viewport?.expand();
    }
  };

  // Show wallet connection screen if not connected
  if (!isConnected) {
  return (
      <main className="min-h-screen bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <div className="text-6xl mb-6">🔗</div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-lg mb-8 text-white/80">
            Please connect your wallet to start your focus journey
          </p>
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <p className="text-sm text-white/70 mb-4">
              Connect your wallet using the button below to access Focus0x
            </p>
            <div className="flex justify-center">
              <ConnectButton 
                accountStatus="avatar" 
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-forest-600 to-forest-800">
      {/* Header - Only hamburger menu */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
            <span className="text-white text-sm">💰</span>
            <span className="text-white text-sm font-bold">{completedTodos.length * 10}</span>
            <span className="text-white text-sm">+</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Start planting today!
        </h1>

        {/* Plant Container with Circular Dialer Around It */}
        <div className="relative mb-8">
          {!isFocusing ? (
            <CircularTimeDialer
              onTimeChange={setSelectedTime}
              initialTime={selectedTime}
            />
          ) : (
            <div className="relative">
              <div className="w-48 h-48 bg-yellow-200 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-lg relative mx-auto">
                {/* Plant Image */}
                <div className="w-32 h-32 relative">
                  <Image
                    src="/plant.svg"
                    alt="Growing plant"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Time Display Around Circumference */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Circular timer dots around the circumference */}
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30) - 90; // 30 degrees apart, starting from top
                  const radius = 90; // Distance from center (adjusted for smaller circle)
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  const isActive = i < Math.floor((timeRemaining / selectedTime) * 12);
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        backgroundColor: isActive ? '#22C55E' : '#E5E7EB',
                        boxShadow: isActive ? '0 0 6px rgba(34, 197, 94, 0.5)' : 'none'
                      }}
                    />
                  );
                })}
                
                {/* Main time display in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold text-forest-800 bg-white/90 rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-2 border-forest-300">
                    {Math.floor(timeRemaining / 60) > 0 
                      ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
                      : `${timeRemaining}:00`
                    }
                  </div>
                </div>
                
                {/* Progress arc */}
                <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="90"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    className="opacity-30"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="90"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - timeRemaining / selectedTime)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>
              
              {/* Small progress indicator */}
              <div className="absolute -top-2 -right-2 w-8 h-4 bg-forest-300 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <div className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full flex items-center space-x-2">
            <span className="text-lg">📚</span>
            <span className="font-medium">Study</span>
          </div>
        </div>


        {/* Plant Button */}
        <div className="mt-8">
          <Button
            onClick={isFocusing ? handleStopFocus : handleStartFocus}
            disabled={isPending}
            className="bg-forest-400 hover:bg-forest-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {isPending ? "Processing..." : isFocusing ? "Stop Planting" : "Plant"}
          </Button>
        </div>
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </main>
  );
}
