"use client";

import * as React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressWithValueProps
    extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    label?: string;
    dir?: "left" | "right";
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressWithValueProps
>(({ className, value, label, dir = "right", ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-primary/20",
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{
                transform:
                    dir === "right"
                        ? `translateX(-${100 - (value || 0)}%)`
                        : `translateX(${100 - (value || 0)}%)`,
            }}
        ></ProgressPrimitive.Indicator>
        <span
            className={cn(
                "absolute left-0 top-1/2 h-fit w-full -translate-y-1/2 items-center px-4",
                "flex font-karla text-xs text-primary-foreground",
                dir === "left" && "justify-end"
            )}
        >
            {`${value}%`}
        </span>
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
