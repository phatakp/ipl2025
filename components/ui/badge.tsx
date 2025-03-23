import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                success:
                    "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
                outline: "text-foreground",
                CSK: "text-CSK-foreground  bg-CSK hover:opacity-80 ",
                GT: "text-GT-foreground  bg-GT hover:opacity-80 ",
                MI: "text-MI-foreground  bg-MI hover:opacity-80 ",
                RR: "text-RR-foreground  bg-RR hover:opacity-80 ",
                RCB: "text-RCB-foreground  bg-RCB hover:opacity-80 ",
                KKR: "text-KKR-foreground  bg-KKR  hover:opacity-80",
                LSG: "text-LSG-foreground  bg-LSG hover:opacity-80 ",
                PBKS: "text-PBKS-foreground  bg-PBKS  hover:opacity-80",
                DC: "text-DC-foreground  bg-DC hover:opacity-80 ",
                SRH: "text-SRH-foreground  bg-SRH hover:opacity-80 ",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
