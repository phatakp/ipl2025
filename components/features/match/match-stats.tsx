"use client";

import { useStatsContext } from "@/components/providers/stats.context";

import Loader from "../shared/loader";
import MatchStatsCard from "./match-stats-card";

type Props = {
    asModal?: boolean;
};
export default function MatchStats({ asModal }: Props) {
    const { overall, h2h, isLoading } = useStatsContext();
    if (isLoading) return <Loader />;

    return (
        <div className="mt-8 flex w-full flex-col">
            <div className="flex w-full flex-col items-center justify-center gap-4 space-y-8">
                <MatchStatsCard
                    title="Overall Wins"
                    asModal={asModal}
                    data={overall}
                />
                <MatchStatsCard
                    title="Head to Head Wins"
                    asModal={asModal}
                    data={h2h}
                />
            </div>
        </div>
    );
}
