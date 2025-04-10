"use client";

import { useStatsContext } from "@/components/providers/stats.context";
import { Skeleton } from "@/components/ui/skeleton";

import MatchStatsCard from "./match-stats-card";

type Props = {
    asModal?: boolean;
};
export default function MatchStats({ asModal }: Props) {
    const { overall, h2h, isLoading } = useStatsContext();
    return (
        <div className="mt-8 flex w-full flex-col">
            <div className="flex w-full flex-col items-center justify-center gap-4 space-y-8">
                {isLoading ? (
                    <StatsLoading />
                ) : (
                    <MatchStatsCard
                        title="Overall Wins"
                        asModal={asModal}
                        data={overall}
                    />
                )}
                {isLoading ? (
                    <StatsLoading />
                ) : (
                    <MatchStatsCard
                        title="Head to Head Wins"
                        asModal={asModal}
                        data={h2h}
                    />
                )}
            </div>
        </div>
    );
}

function StatsLoading() {
    return (
        <div className="w-full rounded-none md:rounded-xl">
            <Skeleton className="grid w-full grid-cols-5 items-center gap-4 px-2 py-4">
                <div className="col-span-2 grid gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-full w-full" />
                <div className="col-span-2 grid gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </Skeleton>
        </div>
    );
}
