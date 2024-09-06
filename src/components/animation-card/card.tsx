'use client'
import { useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Image from "next/image";
import TurnPlay from "./turn-play";

export function AnimationCard() {
    const TurnPlayRef = useRef<{ handleStartAnimation: () => void }>(null);

  // Function to handle button click
  const handlePlayButton = () => {
    if (TurnPlayRef.current) {
      // Trigger the child's function
      TurnPlayRef.current.handleStartAnimation();
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Turn 1</CardTitle>
        <CardDescription>
          1 - 0
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TurnPlay ref={TurnPlayRef} />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handlePlayButton}
            >
                <Image
                    className="dark:invert"
                    src="https://nextjs.org/icons/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                />
                Play now
            </a>
        </div>
      </CardContent>
    </Card>
  )
}