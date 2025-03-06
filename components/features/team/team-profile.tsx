import { Fragment } from "react";

import { getRecentMatchesForTeam } from "@/actions/history.actions";
import { Team } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import TeamLogo from "./team-logo";

type Props = {
    team: Team;
    rank: number;
};

export default async function TeamProfile({ team, rank }: Props) {
    const [matches] = await getRecentMatchesForTeam({
        shortName: team.shortName,
    });
    let isPast = !matches?.[0].date.startsWith("2025");

    return (
        <div className="flex flex-col gap-4 pb-4">
            <Card>
                <CardHeader
                    className={cn(
                        `rounded-t-lg bg-${team.shortName} text-${team.shortName}-foreground`
                    )}
                >
                    <CardDescription className="text-2xl uppercase text-foreground">
                        #{rank}
                    </CardDescription>
                    <CardTitle className="my-0 flex items-center justify-between py-0 uppercase">
                        <div className="flex flex-col">
                            <span>{team.longName.split(" ")[0]}</span>
                            <span className="text-2xl">
                                {team.longName.split(" ").slice(1).join(" ")}
                            </span>
                        </div>
                        <TeamLogo teamName={team.shortName} />
                    </CardTitle>
                    <div className="flex items-center justify-between">
                        <span className="uppercase">Points</span>
                        <div className="flex items-center justify-end gap-1">
                            <span className="text-2xl">{team.points}</span>

                            <Badge
                                variant={
                                    team.nrr < 0 ? "destructive" : "success"
                                }
                                className="w-fit"
                            >
                                {team.nrr.toFixed(3)}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                Win Accuracy 2025
                            </span>
                            <span className="text-2xl">
                                {team.won}/{team.played}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                For
                            </span>
                            <span className="text-2xl text-success">
                                {team.forRuns}/{team.forBalls}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extralight uppercase">
                                Against
                            </span>
                            <span className="text-2xl text-destructive">
                                {team.againstRuns}/{team.againstBalls}
                            </span>
                        </div>
                        <span className="mb-2 mt-4 bg-muted px-1 uppercase text-muted-foreground">
                            {!isPast ? "Recent" : "Past"} Matches
                        </span>
                        {matches &&
                            matches.length > 0 &&
                            matches.map((match, i) => {
                                return (
                                    <Fragment key={i}>
                                        {!isPast &&
                                            i > 0 &&
                                            matches?.[i - 1].date.startsWith(
                                                "2025"
                                            ) &&
                                            !match.date.startsWith("2025") && (
                                                <span className="mb-2 mt-4 bg-muted px-1 uppercase text-muted-foreground">
                                                    Past Matches
                                                </span>
                                            )}
                                        <div className="flex items-center justify-between gap-4 border-b py-2 text-xs font-extralight uppercase">
                                            <span>
                                                {match.team1Name ===
                                                team.shortName
                                                    ? "home"
                                                    : "away"}{" "}
                                                vs{" "}
                                                {match.team1Name ===
                                                team.shortName
                                                    ? match.team2Name
                                                    : match.team1Name}
                                            </span>
                                            <span
                                                className={cn(
                                                    match.winnerName &&
                                                        match.winnerName ===
                                                            team.shortName
                                                        ? "text-success"
                                                        : "text-destructive"
                                                )}
                                            >
                                                {match.winnerName ===
                                                team.shortName
                                                    ? "won by"
                                                    : "lost by"}{" "}
                                                {match.resultMargin}{" "}
                                                {match.resultType}
                                            </span>
                                        </div>
                                    </Fragment>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
