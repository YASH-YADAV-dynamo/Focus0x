"use client";
import { useReadContract } from "wagmi";
import { counterAbi } from "@/constants/abi";
import { counterAddress } from "@/constants";

export function ReadContract() {
  const {
    data: counter,
    status,
    isLoading,
    error,
  } = useReadContract({
    abi: counterAbi,
    address: counterAddress,
    functionName: "number",
  });

  console.log(counter, status, isLoading, error);

  return (
    <div className="text-left my-8">
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-focus0x mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading achievement data...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          <div className="text-2xl mb-2">⚠️</div>
          <p>Error loading contract data</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-focus0x mb-2">
            {counter?.toString() || "0"}
          </div>
          <p className="text-sm text-gray-600">Achievement Score</p>
          <p className="text-xs text-gray-400 mt-1">
            Your on-chain productivity achievement
          </p>
        </div>
      )}
    </div>
  );
}
