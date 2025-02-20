"use client";

import { usePathname } from "next/navigation";

import Balance from "react-wrap-balancer";

import { cn } from "@/lib/utils";

import Background from "./background";

function PageHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Background>
            <div
                className={cn(
                    "flex w-full flex-col justify-between gap-2 py-4",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </Background>
    );
}

function PageHeaderGrid({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("grid text-center", className)} {...props}>
            {children}
        </div>
    );
}

function PageHeaderHeading({
    title,
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { title?: string }) {
    const path = usePathname();
    return (
        <h1
            className={cn(
                "title bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-4xl font-extrabold uppercase leading-tight md:text-7xl lg:leading-[1.1]",
                className
            )}
            {...props}
        >
            {title ?? path.slice(1).split("?")[0]}
        </h1>
    );
}

function PageHeaderDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <Balance
            className={cn("text-foreground sm:text-lg", className)}
            {...props}
        />
    );
}

function PageActions({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col justify-center md:flex-row md:items-center md:gap-4",
                className
            )}
            {...props}
        />
    );
}

export {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderGrid,
    PageHeaderHeading,
};
