"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Safari } from "@/components/ui/safari";

export function ProductShowcase() {
  return (
    <section id="showcase" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <BlurFade delay={0.2} inView>
          <Safari
            url="taskflow.app"
            imageSrc="/todo-list-final-desktop.png"
            className="w-full rounded-xl shadow-2xl"
          />
        </BlurFade>
      </div>
    </section>
  );
}
