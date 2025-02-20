import { useStatsContext } from "@/components/providers/stats.context";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import StatsBar from "../shared/stats-bar";
import StatsHeader from "../shared/stats-header";

type Props = {
    title: string;
    asModal?: boolean;
    versus?: boolean;
};

export default function MatchStatsCard({ title, asModal, versus }: Props) {
    const { overall, h2h } = useStatsContext();
    const data = versus ? h2h : overall;

    return (
        <Card className="w-full rounded-none md:rounded-xl">
            <StatsHeader title={title} asModal={asModal} />

            <CardContent className="grid w-full grid-cols-5 items-center gap-4 px-2 py-4">
                <div className="col-span-2 grid gap-4">
                    <StatsBar
                        label="All"
                        wins={data.t1Wins}
                        pct={data.t1WinPct}
                        dir="left"
                    />
                    <StatsBar
                        label="Home"
                        wins={data.t1HomeWins}
                        pct={data.t1HomePct}
                        dir="left"
                    />
                    <StatsBar
                        label="Bat1"
                        wins={data.t1BatFirstWins}
                        pct={data.t1BatFirstPct}
                        dir="left"
                    />
                    <StatsBar
                        label="Bat2"
                        wins={data.t1BatSecondWins}
                        pct={data.t1BatSecondPct}
                        dir="left"
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                    <span className="text-xs uppercase text-muted-foreground">
                        Played
                    </span>
                    <span
                        className={cn(
                            "text-4xl font-bold md:text-6xl",
                            asModal && "text-3xl md:text-3xl"
                        )}
                    >
                        {data.played}
                    </span>
                </div>

                <div className="col-span-2 grid gap-4">
                    <StatsBar
                        label="All"
                        wins={data.t2Wins}
                        pct={data.t2WinPct}
                        dir="right"
                    />
                    <StatsBar
                        label="Away"
                        wins={data.t2AwayWins}
                        pct={data.t2AwayPct}
                        dir="right"
                    />
                    <StatsBar
                        label="Bat1"
                        wins={data.t2BatFirstWins}
                        pct={data.t2BatFirstPct}
                        dir="right"
                    />
                    <StatsBar
                        label="Bat2"
                        wins={data.t2BatSecondWins}
                        pct={data.t2BatSecondPct}
                        dir="right"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
