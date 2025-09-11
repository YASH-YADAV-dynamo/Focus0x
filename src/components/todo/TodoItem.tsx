"use client";

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onStartFocus: (id: string) => void;
  isFocusing: boolean;
}

export function TodoItem({ 
  todo, 
  onToggle, 
  onUpdate, 
  onDelete, 
  onStartFocus,
  isFocusing 
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg border-l-4 ${getPriorityColor(todo.priority)} p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
            todo.completed 
              ? 'bg-focus0x border-focus0x' 
              : 'border-gray-300 hover:border-focus0x'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              className="text-sm"
              autoFocus
            />
          ) : (
            <p 
              className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.text}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              todo.priority === 'high' ? 'bg-red-100 text-red-700' :
              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {todo.priority}
            </span>
            
            {todo.focusTime && todo.focusTime > 0 && (
              <span className="text-xs text-gray-500">
                ⏱️ {todo.focusTime}m
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {!todo.completed && !isFocusing && (
            <Button
              size="sm"
              variant="focus0x"
              onClick={() => onStartFocus(todo.id)}
              className="text-xs px-2 py-1"
            >
              Focus
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-xs px-2 py-1"
          >
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(todo.id)}
            className="text-xs px-2 py-1 text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
