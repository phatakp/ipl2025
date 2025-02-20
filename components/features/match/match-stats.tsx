"use client";

import MatchStatsCard from "./match-stats-card";

type Props = {
    asModal?: boolean;
};
export default function MatchStats({ asModal }: Props) {
    return (
        <div className="mt-8 flex w-full flex-col">
            <div className="flex w-full flex-col items-center justify-center gap-4 space-y-8">
                <MatchStatsCard title="Overall Wins" asModal={asModal} />
                <MatchStatsCard
                    title="Head to Head Wins"
                    asModal={asModal}
                    versus
                />
            </div>
        </div>
    );
}
