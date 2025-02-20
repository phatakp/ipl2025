import { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Props = PropsWithChildren & {
    className?: string;
    type?: "dot" | "grid";
};

export default function Background({ className, children, type }: Props) {
    return (
        <div
            className={cn(
                "relative h-full w-full bg-background",
                type === "dot"
                    ? "bg-dot-white/[0.2]"
                    : "bg-grid-small-white/[0.2]",
                className
            )}
        >
            {/* Radial gradient for the container to give a faded look */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative z-20">{children}</div>
        </div>
    );
}
