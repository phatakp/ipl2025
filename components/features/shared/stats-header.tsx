"use client";

import { useStatsContext } from "@/components/providers/stats.context";
import { CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import TeamLogo from "../team/team-logo";

type Props = {
    title: string;
    asModal?: boolean;
};

export default function StatsHeader({ title, asModal }: Props) {
    const { match } = useStatsContext();
    return (
        <CardHeader className="grid w-full grid-cols-5 border-b py-4">
            <div className="col-span-5 mx-auto border-spacing-2 border-b text-lg uppercase">
                {title}
            </div>
            <div
                className={cn(
                    "col-span-2 flex w-full items-center justify-end gap-4"
                )}
            >
                <span
                    className={cn(
                        "text-secondary-foreround text-lg md:hidden",
                        asModal && "md:flex"
                    )}
                >
                    {match.team1Name ?? undefined}
                </span>
                <span
                    className={cn(
                        "text-secondary-foreround hidden uppercase md:flex",
                        asModal && "md:hidden"
                    )}
                >
                    {match.team1?.longName ?? "TBD"}
                </span>
                <TeamLogo
                    teamName={match.team1Name ?? undefined}
                    className="size-10"
                />
            </div>
            <div />
            <div className={cn("col-span-2 flex w-full items-center gap-4")}>
                <TeamLogo
                    teamName={match.team2Name ?? undefined}
                    className="size-10"
                />
                <span
                    className={cn(
                        "text-secondary-foreround text-lg md:hidden",
                        asModal && "md:flex"
                    )}
                >
                    {match.team2Name}
                </span>
                <span
                    className={cn(
                        "text-secondary-foreround hidden uppercase md:flex",
                        asModal && "md:hidden"
                    )}
                >
                    {match.team2?.longName ?? "TBD"}
                </span>
            </div>
        </CardHeader>
    );
}
