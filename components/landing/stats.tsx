"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { value: 10000, label: "Tasks Completed", suffix: "+" },
  { value: 2500, label: "Happy Users", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%", decimals: 1 },
];

export function Stats() {
  return (
    <section className="border-y border-border/40 bg-muted/30 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <BlurFade key={stat.label} delay={0.1 * index} inView>
              <div className="text-center">
                <div className="font-[family-name:var(--font-geist-mono)] text-4xl font-bold tracking-tight sm:text-5xl">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals ?? 0}
                  />
                  {stat.suffix}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
