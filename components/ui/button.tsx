import * as React from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center  justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:opacity-80",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground ",
                link: "opacity-80 underline-offset-4 hover:underline",
                expandIcon:
                    "group relative text-primary-foreground bg-primary hover:opacity-90",
                ringHover:
                    "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
                shine: "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-foreground to-secondary bg-[length:400%_100%] ",
                CSK: "text-CSK-foreground relative bg-CSK z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                GT: "text-GT-foreground relative bg-GT z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                MI: "text-MI-foreground relative bg-MI z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                RR: "text-RR-foreground relative bg-RR z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                RCB: "text-RCB-foreground relative bg-RCB z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                KKR: "text-KKR-foreground relative bg-KKR z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                LSG: "text-LSG-foreground relative bg-LSG z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                PBKS: "text-PBKS-foreground relative bg-PBKS z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                DC: "text-DC-foreground relative bg-DC z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                SRH: "text-SRH-foreground relative bg-SRH z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-500 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
                linkHover1:
                    "relative text-foreground after:absolute after:bg-primary after:bottom-1 after:h-[3px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
                linkHover2:
                    "relative text-foreground after:absolute after:bg-primary after:bottom-1 after:h-[3px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface IconProps {
    Icon: React.ElementType;
    iconPlacement: "left" | "right";
}

interface IconRefProps {
    Icon?: never;
    iconPlacement?: undefined;
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<
    HTMLButtonElement,
    ButtonProps & ButtonIconProps
>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            Icon,
            iconPlacement,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {Icon && iconPlacement === "left" && (
                    <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:mr-2 group-hover:w-4 group-hover:opacity-100">
                        <Icon />
                    </div>
                )}
                <Slottable>{props.children}</Slottable>
                {Icon && iconPlacement === "right" && (
                    <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100">
                        <Icon />
                    </div>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
