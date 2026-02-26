"use client";

import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
      <DotPattern
        className="opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
        cr={1}
        cx={1}
        cy={1}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
          Now with cloud sync
        </div>

        <div className="mb-4">
          <TextAnimate
            as="h1"
            animation="blurInUp"
            by="word"
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            once
          >
            Manage your tasks
          </TextAnimate>
        </div>

        <div className="flex items-center justify-center gap-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <WordRotate
            words={["effortlessly", "beautifully", "together"]}
            className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl"
          />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          A simple, beautiful to-do app that helps you stay organized. Track
          progress, celebrate wins, and keep everything in sync across your
          devices.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/signup">
            <ShimmerButton className="h-11 px-8 text-sm font-medium">
              Start for Free
            </ShimmerButton>
          </Link>
          <Button variant="outline" size="lg" asChild>
            <a href="#showcase">See it in action</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
