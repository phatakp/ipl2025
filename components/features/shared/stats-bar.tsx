import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Props = {
    wins: number;
    pct: number;
    label: string;
    dir?: "left" | "right";
};
export default function StatsBar({ wins, pct, label, dir }: Props) {
    return (
        <div
            className={cn(
                "flex items-center gap-2",
                dir === "right" && "flex-row-reverse"
            )}
        >
            <span className="text-xs font-extralight uppercase text-muted-foreground">
                {label}
            </span>
            <Progress
                value={Math.floor(pct * 100)}
                dir={dir}
                className={cn("rounded-none")}
            />
        </div>
    );
}
