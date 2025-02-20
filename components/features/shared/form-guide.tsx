import { cn } from "@/lib/utils";

type CircleProps = {
    type?: string | undefined;
    className?: string;
};

type Props = {
    direction: "left" | "right";
    data: CircleProps["type"][];
    className?: string;
};

export default function FormGuide({ direction, data, className }: Props) {
    return (
        <div
            className={cn(
                "flex items-center gap-1 md:gap-2",
                direction === "right" && "justify-end"
            )}
        >
            {data?.map((d, i) => (
                <Circle type={d} key={i} className={className} />
            ))}
        </div>
    );
}

export function Circle({ type, className }: CircleProps) {
    const chr = type && ["won", "lost"].includes(type) ? type.charAt(0) : "-";
    return (
        <span
            className={cn(
                "flex size-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground md:size-10 md:text-lg",
                type === "won" && "bg-success text-success-foreground",
                type === "lost" && "bg-destructive text-destructive-foreground",
                className
            )}
        >
            {chr}
        </span>
    );
}
