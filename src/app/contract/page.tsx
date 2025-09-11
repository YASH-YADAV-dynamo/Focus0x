"use client";

import { WriteContract } from "@/containers/contract/WriteContract";
import { ReadContract } from "@/containers/contract/ReadContract";
import { useAccount } from "wagmi";
import { useTodos } from "@/hooks/useTodos";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ContractExample() {
  const { isConnected } = useAccount();
  const { getCompletedTodos } = useTodos();
  const completedTodos = getCompletedTodos();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Rewards Contract 🏆
              </h1>
              <p className="text-sm text-gray-600">
                Complete tasks to earn rewards on-chain
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Tasks
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {isConnected ? (
          <div className="space-y-6">
            {/* Progress Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-focus0x">{completedTodos.length}</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {completedTodos.reduce((acc, todo) => acc + (todo.focusTime || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Focus Minutes</div>
                </div>
              </div>
              
              {completedTodos.length > 0 && (
                <div className="mt-4 p-4 bg-forest-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    🎉 Great job! You've completed {completedTodos.length} task{completedTodos.length !== 1 ? 's' : ''} and earned {completedTodos.reduce((acc, todo) => acc + (todo.focusTime || 0), 0)} focus minutes. 
                    Use the contract below to set your achievement number!
                  </p>
                </div>
              )}
            </div>

            {/* Contract Interaction */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Contract Interaction</h2>
              <ReadContract />
              <div className="mt-6">
                <WriteContract />
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">How Rewards Work</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-focus0x rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p>Complete focus tasks in the main app to build your productivity score</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-focus0x rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <p>Use the contract to set your achievement number (based on completed tasks)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-focus0x rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <p>Your progress is recorded on-chain and can be used for future rewards</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600 max-w-md">
              Connect your wallet to interact with the rewards contract and track your productivity achievements on-chain.
            </p>
            <div className="mt-4">
              <ReadContract />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractExample;
