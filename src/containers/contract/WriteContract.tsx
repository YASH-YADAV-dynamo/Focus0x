"use client";
import * as React from "react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toast } from "sonner";

import { counterAbi } from "@/constants/abi";
import { counterAddress } from "@/constants";

export function WriteContract() {
  const { data: hash, isPending, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("value") as string;
    console.log(tokenId);
    writeContract({
      address: counterAddress,
      abi: counterAbi,
      functionName: "setNumber",
      args: [BigInt(tokenId)],
    });
  }

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction Successful");
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirmed, error]);

  return (
    <form onSubmit={submit}>
      <p className="text-sm text-gray-500 mb-3">
        Set your achievement number based on completed tasks
      </p>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          name="value"
          placeholder="0"
          type="number"
          required
          className="bg-black text-white rounded-full "
        />
        <Button
          disabled={isPending || isConfirming}
          type="submit"
          variant={"focus0x"}
          size={"one-third"}
        >
          {isPending ? "Confirming..." : "Set Achievement"}
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        💡 Tip: Use your completed task count as your achievement number
      </p>
    </form>
  );
}
