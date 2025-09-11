"use client";

import { useState, useEffect } from 'react';
import { FocusSession } from '@/types/todo';
import { Button } from '@/components/ui/button';

interface FocusTimerProps {
  session: FocusSession;
  onEnd: (completed: boolean) => void;
  todoText?: string;
}

export function FocusTimer({ session, onEnd, todoText }: FocusTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setIsRunning(false);
    onEnd(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    onEnd(false);
  };

  return (
    <div className="bg-gradient-to-br from-forest-100 to-forest-50 rounded-lg p-6 text-center">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus Session</h3>
        {todoText && (
          <p className="text-sm text-gray-700 mb-3 p-2 bg-white/50 rounded">
            🎯 <strong>Focusing on:</strong> {todoText}
          </p>
        )}
        <div className="text-4xl font-mono font-bold text-focus0x mb-2">
          {formatTime(timeElapsed)}
        </div>
        <p className="text-sm text-gray-600">Stay focused and productive!</p>
      </div>
      
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleComplete}
          variant="focus0x"
          size="sm"
          className="px-6"
        >
          ✓ Complete Task
        </Button>
        <Button
          onClick={handleStop}
          variant="outline"
          size="sm"
          className="px-6"
        >
          Stop Session
        </Button>
      </div>
    </div>
  );
}
