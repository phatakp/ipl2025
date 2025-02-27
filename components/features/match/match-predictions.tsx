"use client";

import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getMatchPredictions } from "@/actions/prediction.actions";
import { MatchWithTeams } from "@/app/types";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { QueryKeys } from "@/lib/constants";
import { cn, getCurrentISTDate, getISTDate } from "@/lib/utils";

import PredictionButton from "../prediction/prediction-add-btn";
import Loader from "../shared/loader";

type Props = {
    match: MatchWithTeams;
};

export default function MatchPredictions({ match }: Props) {
    const { data: matchPreds, isLoading } = useQuery({
        queryKey: [QueryKeys.MATCH_PREDS, match.num],
        queryFn: async () => getMatchPredictions({ num: match.num }),
    });
    const { userId } = useAuth();
    if (isLoading) return <Loader />;
    const preds = matchPreds?.[0];
    const currentISTTime = getCurrentISTDate();
    const newPredCutoff = getISTDate(match.date, -30);
    console.log(currentISTTime);
    console.log(newPredCutoff);
    console.log(preds);

    const data = preds
        ?.filter(
            (pred) =>
                currentISTTime >= newPredCutoff ||
                (currentISTTime < newPredCutoff && pred.userId === userId)
        )
        .map((pred, i) => ({
            pos: i + 1,
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: pred.user.firstName,
            name2: pred.user.lastName,
            extra: (
                <div
                    className={cn(
                        "flex items-center gap-2 font-karla text-sm font-semibold",
                        pred.status === "default" && "text-destructive"
                    )}
                >
                    Stake: {pred.amount}
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
            content: <></>,
        }));

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
            <div className="mt-8 flex w-full flex-col items-center gap-8 uppercase">
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

    return (
        <div className="mt-8 flex w-full flex-col items-center">
            <StatsTableProvider data={data ?? []}>
                <StatsTable
                    title="Predictions"
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
            </StatsTableProvider>
        </div>
    );
}
