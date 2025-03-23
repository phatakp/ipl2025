"use client";

import { useQuery } from "@tanstack/react-query";
import { IndianRupee } from "lucide-react";

import {
    getCompletedPredictionsForUser,
    getMaxLostAmount,
    getMaxWonAmount,
    getPredictionAccuracy,
} from "@/actions/prediction.actions";
import { getProfileById } from "@/actions/user.actions";
import { CompletePred, ProfileId } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { QueryKeys } from "@/lib/constants";
import { cn } from "@/lib/utils";

import Loader from "../shared/loader";
import TeamLogo from "../team/team-logo";

type Props = {
    id: ProfileId;
    userPreds?: CompletePred[];
};
export default function UserProfile({ id, userPreds }: Props) {
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: [QueryKeys.USER, id],
        queryFn: async () => await getProfileById({ userId: id }),
    });

    const { data: preds, isLoading: isPredsLoading } = useQuery({
        queryKey: [QueryKeys.COMPLETED_MATCH_PREDS, id],
        queryFn: async () =>
            await getCompletedPredictionsForUser({ userId: id }),
        enabled: !userPreds,
    });

    const { data: mWA, isLoading: isMWALoading } = useQuery({
        queryKey: [QueryKeys.MAX_WON_AMT, id],
        queryFn: async () => await getMaxWonAmount({ userId: id }),
    });

    const { data: mLA, isLoading: isMLALoading } = useQuery({
        queryKey: [QueryKeys.MAX_LOST_AMT, id],
        queryFn: async () => await getMaxLostAmount({ userId: id }),
    });

    const { data: prA, isLoading: isPRALoading } = useQuery({
        queryKey: [QueryKeys.PRED_ACCURACY, id],
        queryFn: async () => await getPredictionAccuracy({ userId: id }),
    });

    if (
        isUserLoading ||
        isPredsLoading ||
        isMWALoading ||
        isMLALoading ||
        isPRALoading
    )
        return <Loader />;
    const profile = user?.[0];
    if (!profile) return;
    const form = userPreds ?? preds?.[0];
    const maxWonAmt = mWA?.[0];
    const maxLostAmt = mLA?.[0];
    const accuracy = prA?.[0];

    return (
        <div className="flex flex-col gap-4 pb-4">
            <Card>
                <CardHeader
                    className={cn(
                        `rounded-t-lg bg-${profile.teamName} text-${profile.teamName}-foreground`
                    )}
                >
                    <CardTitle className="flex items-center justify-between uppercase">
                        <div className="flex flex-col">
                            <span>{profile.team.longName.split(" ")[0]}</span>
                            <span className="text-2xl">
                                {profile.team.longName
                                    .split(" ")
                                    .slice(1)
                                    .join(" ")}
                            </span>
                        </div>

                        <TeamLogo teamName={profile.teamName ?? undefined} />
                    </CardTitle>
                    <div className="flex items-center justify-between">
                        <span className="uppercase">Balance</span>
                        <Badge
                            variant={
                                profile.balance < 0 ? "destructive" : "success"
                            }
                            className="w-fit text-2xl"
                        >
                            <IndianRupee className="size-4" />
                            {profile.balance.toFixed()}
                        </Badge>
                    </div>
                    <CardDescription className="text-[10px] uppercase text-foreground">
                        Doubles left: {profile.doublesLeft}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                Biggest Win
                            </span>
                            <span className="text-2xl text-success">
                                {maxWonAmt?.toFixed() ?? 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                Biggest Loss
                            </span>
                            <span className="text-2xl text-destructive">
                                {maxLostAmt?.toFixed() ?? 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                Prediction Accuracy
                            </span>
                            <span className="text-2xl">
                                {accuracy?.correct ?? 0}/{accuracy?.total ?? 0}
                            </span>
                        </div>
                        <span className="mb-2 mt-4 bg-muted px-1 uppercase text-muted-foreground">
                            Recent Predictions
                        </span>
                        {form &&
                            form.length > 0 &&
                            form.map((f) => (
                                <div
                                    className="flex items-center justify-between gap-4 border-b py-2 text-xs font-extralight uppercase"
                                    key={f.id}
                                >
                                    <span>
                                        {f.match?.team1Name ?? "IPL"}{" "}
                                        {f.match?.team1Name ? " v " : ""}
                                        {f.match?.team2Name ?? "Winner"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({f.teamName ?? "DEFAULT"})
                                    </span>
                                    {f.isDouble && (
                                        <Badge
                                            variant={"success"}
                                            className="px-2 py-0 text-[10px] font-extralight uppercase"
                                        >
                                            D
                                        </Badge>
                                    )}
                                    <span
                                        className={cn(
                                            "flex-1 text-right",
                                            f.resultAmt < 0
                                                ? "text-destructive"
                                                : "text-success"
                                        )}
                                    >
                                        {f.status} {f.resultAmt?.toFixed()}
                                    </span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
