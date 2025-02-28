import { format } from "date-fns";

import { getUserPredictions } from "@/actions/prediction.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { Badge } from "@/components/ui/badge";
import { cn, getISTDate } from "@/lib/utils";

import MatchTabs from "../match/match-tabs";

export default async function UserPredictions() {
    const [preds] = await getUserPredictions();
    const top = preds
        ?.filter((p) => p.matchNum === 0)
        .map((pred) => ({
            pos: 0,
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: `${pred.match?.team1Name ?? "IPL"} ${pred.match?.team1Name ? "v" : ""}`,
            name2: `${pred.match?.team2Name ?? "Winner"}`,
            extra: (
                <div className={cn("font-karla")}>
                    {pred.teamName ?? "Default"}:{pred.amount}
                </div>
            ),
            value: pred.resultAmt,
            title: `${
                pred.match.type === "league"
                    ? `Match ${pred.matchNum}`
                    : pred.match.type
            }
                        | ${pred.match.team1Name ?? "TBD"} vs ${pred.match.team2Name ?? "TBD"}`,
            desc: "",
            content: <MatchTabs match={pred.match} />,
        }))[0];

    const data = preds
        ?.filter((p) => p.matchNum > 0)
        .map((pred) => ({
            pos: pred.matchNum,
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: `${pred.match?.team1Name ?? "IPL"} ${pred.match?.team1Name ? "v" : ""}`,
            name2: `${pred.match?.team2Name ?? "Winner"}`,
            extra: (
                <div className="flex items-center gap-1">
                    <span className="font-karla text-sm text-muted-foreground">
                        {pred.teamName ?? "Default"}:{pred.amount}
                    </span>
                    {pred.isDouble && (
                        <Badge
                            variant="success"
                            className="size-4 items-center justify-center rounded-full font-karla text-xs"
                        >
                            D
                        </Badge>
                    )}
                </div>
            ),
            value: pred.resultAmt,
            title: `${
                pred.match.type === "league"
                    ? `Match ${pred.matchNum}`
                    : pred.match.type
            }
                        | ${pred.match.team1Name} vs ${pred.match.team2Name}`,
            desc: format(getISTDate(pred.match.date), "PPpp"),
            content: <MatchTabs match={pred.match} />,
        }))
        .toSpliced(0, 0, top!);

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Your Predictions" />
        </StatsTableProvider>
    );
}
