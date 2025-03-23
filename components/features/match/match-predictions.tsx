"use client";

import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import {
    getCompletedPredictionStats,
    getMatchPredictions,
    getScheduledPredictionStats,
} from "@/actions/prediction.actions";
import { MatchWithTeams } from "@/app/types";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { QueryKeys } from "@/lib/constants";
import { cn, getCurrentISTDate, getISTDate } from "@/lib/utils";

import PredictionButton from "../prediction/prediction-add-btn";
import UserProfile from "../profile/user-profile";
import Loader from "../shared/loader";

type Props = {
    match: MatchWithTeams;
};

export default function MatchPredictions({ match }: Props) {
    const { data: matchPreds, isLoading } = useQuery({
        queryKey: [QueryKeys.MATCH_PREDS, match.num],
        queryFn: async () => getMatchPredictions({ num: match.num }),
    });
    const { data: matchPredStats, isLoading: isStatsLoading } = useQuery({
        queryKey: [QueryKeys.MATCH_PREDS_STATSS, match.num],
        queryFn: async () => getScheduledPredictionStats({ num: match.num }),
        enabled: match.status === "scheduled",
    });
    const { data: matchPredStatsC, isLoading: isStatsCLoading } = useQuery({
        queryKey: [QueryKeys.MATCH_PREDS_STATSC, match.num],
        queryFn: async () => getCompletedPredictionStats({ num: match.num }),
        enabled: match.status !== "scheduled",
    });

    const { userId } = useAuth();
    if (isLoading || isStatsLoading || isStatsCLoading) return <Loader />;
    const preds = matchPreds?.[0];
    const stats = matchPredStats?.[0];
    const statsC = matchPredStatsC?.[0];
    const currentISTTime = getCurrentISTDate();
    const newPredCutoff = getISTDate(match.date, -30);
    const doubleCutoff = getISTDate(match.date, 60);

    const data = preds
        ?.filter(
            (pred) =>
                currentISTTime >= newPredCutoff ||
                (currentISTTime < newPredCutoff && pred.userId === userId)
        )
        .map((pred, i) => {
            return {
                pos: i + 1,
                id: pred.id,
                team: pred.teamName ?? undefined,
                name1: pred.user.firstName,
                name2: pred.user.lastName,
                extra: (
                    <div
                        key={pred.id}
                        className={cn(
                            "flex items-center gap-2 font-karla text-sm font-semibold"
                        )}
                    >
                        <span className="opacity-70">Stake: {pred.amount}</span>
                        {pred.isDouble && (
                            <span className="flex items-center justify-center rounded-lg bg-success px-2 text-xs text-success-foreground">
                                Double
                            </span>
                        )}
                    </div>
                ),
                value: pred.resultAmt,
                title: `${pred.user.firstName} ${pred.user.lastName ?? ""}`,
                desc: "",
                content: <UserProfile key={pred.id} id={pred.userId} />,
            };
        });

    if (!userId)
        return (
            <div className="flex w-full justify-center">
                <Link
                    href={"/sign-in"}
                    className={cn(buttonVariants(), "uppercase")}
                >
                    Login
                </Link>
            </div>
        );

    if (!data || data?.length === 0)
        return (
            <div className="flex w-full flex-col items-center gap-8 uppercase">
                <Badge className="font-extralight">
                    {!preds || preds?.length === 0
                        ? "No Predictions made yet!"
                        : "No Predictions for you to view"}
                </Badge>
                {match.status === "scheduled" && (
                    <PredictionButton match={match}>
                        <Button className="font-thin uppercase">Predict</Button>
                    </PredictionButton>
                )}
            </div>
        );

    console.log(stats);
    const t1Count = stats?.find((s) => s.team === match.team1Name)?.count ?? 0;
    const t2Count = stats?.find((s) => s.team === match.team2Name)?.count ?? 0;
    const t1Amount =
        stats?.find((s) => s.team === match.team1Name)?.amount ?? 0;
    const t2Amount =
        stats?.find((s) => s.team === match.team2Name)?.amount ?? 0;
    const t1Result = statsC?.find((s) => s.status === "won")?.resultAmt ?? 0;
    const t2Result = statsC?.find((s) => s.status === "lost")?.resultAmt ?? 0;

    return (
        <div className="flex w-full flex-col items-center">
            <StatsTableProvider data={data ?? []}>
                <StatsTable
                    title=""
                    action={
                        match.status === "scheduled" ? (
                            <PredictionButton match={match}>
                                <Button className="font-thin uppercase">
                                    Predict
                                </Button>
                            </PredictionButton>
                        ) : undefined
                    }
                />
                {currentISTTime >= newPredCutoff && (
                    <div className="flex items-center justify-between gap-8">
                        <Badge
                            variant={
                                match.status === "scheduled"
                                    ? match.team1Name
                                    : "success"
                            }
                            className="text-xs font-extralight uppercase"
                        >
                            <span>
                                {match.status === "scheduled"
                                    ? `${match.team1Name}: `
                                    : "Won: "}
                            </span>
                            <span>
                                Rs.
                                {match.status === "scheduled"
                                    ? t1Amount
                                    : t1Result}
                                /-
                            </span>
                            {match.status === "scheduled" && (
                                <span>({t1Count})</span>
                            )}
                        </Badge>
                        <Badge
                            variant={
                                match.status === "scheduled"
                                    ? match.team2Name
                                    : "destructive"
                            }
                            className="text-xs font-extralight uppercase"
                        >
                            <span>
                                {match.status === "scheduled"
                                    ? `${match.team2Name}: `
                                    : "Lost: "}
                            </span>
                            <span>
                                Rs.
                                {match.status === "scheduled"
                                    ? t2Amount
                                    : t2Result}
                                /-
                            </span>
                            {match.status === "scheduled" && (
                                <span>({t2Count})</span>
                            )}
                        </Badge>
                    </div>
                )}
            </StatsTableProvider>
        </div>
    );
}
