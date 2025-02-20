import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

import { getMatchPredictions } from "@/actions/prediction.actions";
import { MatchWithTeams } from "@/app/types";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, getCurrentISTDate, getISTDate } from "@/lib/utils";

import PredictionButton from "../prediction/prediction-add-btn";

type Props = {
    match: MatchWithTeams;
};

export default async function MatchPredictions({ match }: Props) {
    const [preds] = await getMatchPredictions({ num: match.num });
    const { userId } = await auth();
    const currentISTTime = getCurrentISTDate();
    const newPredCutoff = getISTDate(match.date, -30);
    const data = preds
        ?.filter(
            (pred) =>
                currentISTTime >= newPredCutoff ||
                (currentISTTime < newPredCutoff && pred.userId === userId)
        )
        .map((pred) => ({
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: pred.user.firstName,
            name2: pred.user.lastName,
            extra: (
                <div
                    className={cn(
                        "flex items-center gap-2 font-karla text-sm font-semibold text-muted-foreground",
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
                <PredictionButton match={match}>
                    <Button className="font-thin uppercase">Predict</Button>
                </PredictionButton>
            </div>
        );

    return (
        <div className="mt-8 flex w-full flex-col items-center">
            <StatsTableProvider data={data ?? []}>
                <StatsTable
                    title="Predictions"
                    action={
                        <PredictionButton match={match}>
                            <Button className="font-thin uppercase">
                                Predict
                            </Button>
                        </PredictionButton>
                    }
                />
            </StatsTableProvider>
        </div>
    );
}
