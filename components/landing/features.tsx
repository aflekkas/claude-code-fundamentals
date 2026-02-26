"use client";

import {
  BarChart3,
  PartyPopper,
  FileText,
  Cloud,
  Shield,
  Palette,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "See how many tasks you've completed at a glance with a visual progress bar.",
  },
  {
    icon: PartyPopper,
    title: "Celebrate Wins",
    description:
      "Confetti animations when you complete a task make productivity feel rewarding.",
  },
  {
    icon: FileText,
    title: "Add Descriptions",
    description:
      "Expand any task to add detailed notes, links, or context for later.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "Your tasks are stored in the cloud so you can access them from any device.",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    description:
      "Sign up with email and password. Your data is protected with row-level security.",
  },
  {
    icon: Palette,
    title: "Clean Design",
    description:
      "A minimal, distraction-free interface so you can focus on what matters.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay on track
            </h2>
            <p className="mt-3 text-muted-foreground">
              Simple features that make a big difference in your daily
              productivity.
            </p>
          </div>
        </BlurFade>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <BlurFade key={feature.title} delay={0.1 * index} inView>
              <Card className="h-full border-border/50">
                <CardContent className="pt-0">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
