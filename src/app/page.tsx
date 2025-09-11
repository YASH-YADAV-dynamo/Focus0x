"use client";

import { useState } from "react";
import {
  useUtils,
  usePopup,
  useMainButton,
  useViewport,
} from "@telegram-apps/sdk-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "@/components/todo/AddTodoForm";
import { TodoItem } from "@/components/todo/TodoItem";
import { FocusTimer } from "@/components/todo/FocusTimer";
import { ProductivityDashboard } from "@/components/todo/ProductivityDashboard";

export default function Home() {
  const utils = useUtils();
  const popUp = usePopup();
  const mainBtn = useMainButton();
  const viewport = useViewport();
  
  const {
    todos,
    currentFocusSession,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    startFocusSession,
    endFocusSession,
    getCompletedTodos,
    getPendingTodos,
  } = useTodos();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const handlePopUp = async () => {
    const response = await popUp.open({
      title: "Focus0x",
      message: "Complete tasks to earn rewards!",
      buttons: [
        { id: "contract", type: "default", text: "View Contract" },
        { type: "cancel" },
      ],
    });
    if (response === "contract") {
      utils.openLink("/contract");
    }
  };

  const handleShare = async () => {
    const completedCount = getCompletedTodos().length;
    utils.shareURL(
      "https://t.me/+rFqLyk4_W-diZDZl",
      `I've completed ${completedCount} focus tasks! Join me in staying productive! 🎯`
    );
  };

  const handleMainBtn = async () => {
    if (currentFocusSession) {
      endFocusSession(true);
      mainBtn.hide();
    } else if (pendingTodos.length > 0) {
      mainBtn.enable();
      mainBtn.setText("Start Focus Session");
      mainBtn.setBgColor("#22C55E");
      mainBtn.show();
    }
  };

  mainBtn.on("click", () => {
    if (currentFocusSession) {
      endFocusSession(true);
      mainBtn.hide();
    } else if (pendingTodos.length > 0) {
      // Start focus session with first pending todo
      startFocusSession(pendingTodos[0].id);
      mainBtn.hide();
    }
  });

  const handleViewport = async () => {
    if (!viewport?.isExpanded) {
      viewport?.expand();
    }
  };

  const pendingTodos = getPendingTodos();
  const completedTodos = getCompletedTodos();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Focus0x 🎯
          </h1>
          <p className="text-sm text-gray-600">
            Stay focused, complete tasks, earn rewards
          </p>
        </div>
      </div>

        {/* Stats */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-focus0x">{pendingTodos.length}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-500">{completedTodos.length}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {completedTodos.reduce((acc, todo) => acc + (todo.focusTime || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Focus Min</div>
            </div>
          </div>

          {/* Productivity Dashboard */}
          <div className="mb-6">
            <ProductivityDashboard />
          </div>

        {/* Focus Timer */}
        {currentFocusSession && (
          <div className="mb-6">
            <FocusTimer
              session={currentFocusSession}
              onEnd={endFocusSession}
              todoText={todos.find(t => t.id === currentFocusSession.todoId)?.text}
            />
          </div>
        )}

        {/* Add Todo Form */}
        {!currentFocusSession && (
          <div className="mb-6">
            <AddTodoForm onAdd={addTodo} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-focus0x text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingTodos.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-focus0x text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({completedTodos.length})
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {(activeTab === 'pending' ? pendingTodos : completedTodos).map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onStartFocus={startFocusSession}
              isFocusing={currentFocusSession?.todoId === todo.id}
            />
          ))}
          
          {activeTab === 'pending' && pendingTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>No pending tasks. Add one to get started!</p>
            </div>
          )}
          
          {activeTab === 'completed' && completedTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏆</div>
              <p>Complete your first task to see it here!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="focus0x" size="half" onClick={handlePopUp}>
              View Contract
            </Button>
            <Button variant="tertiary" size="half" onClick={handleShare}>
              Share Progress
            </Button>
          </div>
          <Button variant="outline" size="half" onClick={handleViewport} className="w-full">
            Expand View
          </Button>
        </div>
      </div>
    </main>
  );
}
