"use client";

import { useState, useEffect } from 'react';
import { Todo, FocusSession } from '@/types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [currentFocusSession, setCurrentFocusSession] = useState<FocusSession | null>(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('focus-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('focus-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        return {
          ...todo,
          completed,
          completedAt: completed ? new Date() : undefined,
        };
      }
      return todo;
    }));
  };

  const startFocusSession = (todoId: string) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      todoId,
      startTime: new Date(),
      duration: 0,
      completed: false,
    };
    setCurrentFocusSession(newSession);
  };

  const endFocusSession = (completed: boolean = false) => {
    if (currentFocusSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentFocusSession.startTime.getTime()) / (1000 * 60));
      
      const updatedSession = {
        ...currentFocusSession,
        endTime,
        duration,
        completed,
      };
      
      setFocusSessions(prev => [...prev, updatedSession]);
      
      if (completed) {
        updateTodo(currentFocusSession.todoId, { 
          completed: true,
          completedAt: new Date(),
          focusTime: (todos.find(t => t.id === currentFocusSession.todoId)?.focusTime || 0) + duration
        });
      }
      
      setCurrentFocusSession(null);
    }
  };

  const getCompletedTodos = () => todos.filter(todo => todo.completed);
  const getPendingTodos = () => todos.filter(todo => !todo.completed);
  const getTodosByPriority = (priority: 'low' | 'medium' | 'high') => 
    todos.filter(todo => todo.priority === priority);

  return {
    todos,
    focusSessions,
    currentFocusSession,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    startFocusSession,
    endFocusSession,
    getCompletedTodos,
    getPendingTodos,
    getTodosByPriority,
  };
}
