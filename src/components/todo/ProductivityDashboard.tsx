"use client";

import { useTodos } from "@/hooks/useTodos";

export function ProductivityDashboard() {
  const { todos, focusSessions, getCompletedTodos } = useTodos();
  const completedTodos = getCompletedTodos();
  
  const totalFocusTime = completedTodos.reduce((acc, todo) => acc + (todo.focusTime || 0), 0);
  const averageFocusTime = completedTodos.length > 0 ? totalFocusTime / completedTodos.length : 0;
  const completionRate = todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0;
  
  const today = new Date();
  const todayTodos = todos.filter(todo => {
    const todoDate = new Date(todo.createdAt);
    return todoDate.toDateString() === today.toDateString();
  });
  const todayCompleted = todayTodos.filter(todo => todo.completed);
  
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weekTodos = todos.filter(todo => new Date(todo.createdAt) >= thisWeek);
  const weekCompleted = weekTodos.filter(todo => todo.completed);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Productivity Insights</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-focus0x">{completionRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-600">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{averageFocusTime.toFixed(1)}m</div>
          <div className="text-xs text-gray-600">Avg Focus Time</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Today's Progress</span>
            <span className="font-medium">{todayCompleted.length}/{todayTodos.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-focus0x h-2 rounded-full transition-all duration-300"
              style={{ width: `${todayTodos.length > 0 ? (todayCompleted.length / todayTodos.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">This Week</span>
            <span className="font-medium">{weekCompleted.length}/{weekTodos.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${weekTodos.length > 0 ? (weekCompleted.length / weekTodos.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {totalFocusTime > 0 && (
        <div className="mt-4 p-3 bg-forest-100 rounded-lg">
          <p className="text-sm text-gray-700">
            🎯 You&apos;ve spent <span className="font-semibold">{totalFocusTime} minutes</span> in focused work!
          </p>
        </div>
      )}
    </div>
  );
}
