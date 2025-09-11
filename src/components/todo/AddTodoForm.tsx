"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTodoFormProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs your focus today?"
          className="text-sm"
        />
        
        <div className="flex gap-2">
          <span className="text-sm text-gray-600">Priority:</span>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                priority === p
                  ? p === 'high' ? 'bg-red-100 text-red-700' :
                    p === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        <Button 
          type="submit" 
          variant="focus0x" 
          size="sm" 
          className="w-full"
          disabled={!text.trim()}
        >
          Add Focus Task
        </Button>
      </div>
    </form>
  );
}
