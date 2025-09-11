"use client";

import { useState, useEffect } from "react";
import {
  useUtils,
  usePopup,
  useMainButton,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useAccount, useWriteContract, useSendTransaction } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
  const { sendTransaction, isPending: isSendingTransaction } = useSendTransaction();
  
  const { addTodo, getCompletedTodos } = useTodos();
  const [selectedTime, setSelectedTime] = useState(15);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState('study');
  const [points, setPoints] = useState(0);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

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
            // Add points equal to minutes
            setPoints(prevPoints => prevPoints + selectedTime);
            return selectedTime;
          }
          return prev - 1;
        });
      }, 1000); // 1 second interval for smooth updates
    }
    return () => clearInterval(interval);
  }, [isFocusing, timeRemaining, selectedTime, addTodo, mainBtn]);

  const handleStartFocus = async () => {
    // Start timer immediately - no transaction required
    setIsFocusing(true);
    setTimeRemaining(selectedTime * 60); // Convert to seconds
    
    mainBtn.enable();
    mainBtn.setText("Quit Focus");
    mainBtn.setBgColor("#ef4444"); // Red color for quit
    mainBtn.show();
  };

  const handleStopFocus = async () => {
    // Ask for penalty payment when quitting
    if (isConnected) {
      try {
        setIsTransactionPending(true);
        
        // Request penalty payment (0.001 ETH as penalty)
        const penaltyAmount = "0.001"; // 0.001 ETH penalty
        const penaltyAddress = "0x742d35Cc6634C0532925a3b8D0C0E1C4C5f745A6"; // Replace with your penalty address
        
        await sendTransaction({
          to: penaltyAddress as `0x${string}`,
          value: BigInt(parseFloat(penaltyAmount) * 1e18), // Convert to wei
        });
        
        console.log("Penalty payment successful");
        setIsTransactionPending(false);
      } catch (error) {
        console.error("Penalty payment failed:", error);
        setIsTransactionPending(false);
        // Still allow quitting even if penalty payment fails
      }
    }
    
    // Stop focus session
    setIsFocusing(false);
    setTimeRemaining(selectedTime * 60); // Convert to seconds
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
          <div className="text-6xl mb-6 animate-bounce">🔗</div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-lg mb-8 text-white/80">
            Please connect your wallet to start your focus journey
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/20 shadow-2xl">
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
            <span className="text-white text-sm font-bold">{points}</span>
            <span className="text-white text-sm">+</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Start planting today!
      </h1>

        {/* Plant Container with Circular Dialer Around It */}
        <div className="relative mb-8">
          {!isFocusing ? (
            <div className="relative">
              <CircularTimeDialer
                onTimeChange={setSelectedTime}
                initialTime={selectedTime}
              />
              {/* Plant circle in center of dialer */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <div className="w-24 h-24 relative rounded-full overflow-hidden">
                  <video
                    src="/plant.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg relative mx-auto overflow-hidden">
                {/* Plant Video */}
                <div className="w-40 h-40 relative rounded-full overflow-hidden">
                  <video
                    src="/plant.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-full"
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
                  const isActive = i < Math.floor((timeRemaining / (selectedTime * 60)) * 12);
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
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
                      : `${timeRemaining}s`
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
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - timeRemaining / (selectedTime * 60))}`}
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
          <div className="flex gap-1.5 flex-wrap justify-center">
            {[
              { id: 'study', label: 'Study', icon: '📚', color: 'bg-purple-200 text-purple-800' },
              { id: 'social', label: 'Social', icon: '👥', color: 'bg-blue-200 text-blue-800' },
              { id: 'work', label: 'Work', icon: '💼', color: 'bg-green-200 text-green-800' },
              { id: 'rest', label: 'Rest', icon: '😴', color: 'bg-yellow-200 text-yellow-800' },
              { id: 'other', label: 'Other', icon: '⭐', color: 'bg-gray-200 text-gray-800' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2.5 py-1.5 rounded-full flex items-center space-x-1.5 transition-all duration-200 text-sm ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Plant/Quit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={isFocusing ? handleStopFocus : handleStartFocus}
            disabled={isTransactionPending || isSendingTransaction}
            className={`px-8 py-4 rounded-xl text-lg font-semibold shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
              isFocusing 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-focus0x hover:bg-focus0x/90 text-white shadow-focus0x/50'
            }`}
          >
            {(isTransactionPending || isSendingTransaction) && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {isTransactionPending || isSendingTransaction ? "Processing Payment..." : isFocusing ? "Quit Focus" : "Plant"}
            </span>
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
