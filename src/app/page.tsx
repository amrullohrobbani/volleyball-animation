import { AnimationCard } from "@/components/animation-card/card"

export default function Home() {
  return (
    <div className="flex w-full items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-2 gap-8 w-full items-center sm:items-start">
        <AnimationCard />
        <AnimationCard />
      </main>
    </div>
  );
}
