"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useTransition } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { reverseMatch } from "@/actions/match.actions";
import { getCurrUser } from "@/actions/user.actions";
import { MatchWithTeams } from "@/app/types";
import {
    Modal,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from "@/components/features/shared/modal";
import MatchProvider, {
    useMatchContext,
} from "@/components/providers/match.context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryKeys } from "@/lib/constants";
import {
    cn,
    errorToast,
    getCurrentISTDate,
    getISTDate,
    successToast,
} from "@/lib/utils";

import Loader from "../shared/loader";
import TeamLogo from "../team/team-logo";
import MatchTabs from "./match-tabs";
import MatchUpdateButton from "./match-update-btn";

type Props = PropsWithChildren & {
    match: MatchWithTeams;
};

export default function MatchModal({ children, match }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: [QueryKeys.CURR_USER],
        queryFn: getCurrUser,
    });
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const istDate = getISTDate(match.date);
    const doubleCutoff = getISTDate(match.date, 60);
    const currISTTime = getCurrentISTDate();
    if (isLoading) return <Loader />;

    const user = data?.[0];

    async function handleReverse() {
        try {
            startTransition(async () => {
                const [data, err] = await reverseMatch({
                    ...match,
                    winnerName: match.winnerName ? match.winnerName : undefined,
                    resultType: match.resultType ? match.resultType : undefined,
                    resultMargin: match.resultMargin ? match.resultMargin : 0,
                });
                if (err) errorToast("Error", err.message);
                else {
                    await queryClient.invalidateQueries();
                    router.refresh();
                    successToast("Match reversed successfully");
                }
            });
        } catch (error) {
            errorToast("Error", JSON.stringify(error, null, 2));
        }
    }

    if (isPending) return <Loader />;

    return (
        <MatchProvider match={match}>
            <Modal id={`match-modal-${match.num}`}>
                <ModalTrigger asChild>{children}</ModalTrigger>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>
                            {match.type === "league"
                                ? `Match ${match.num}`
                                : match.type}{" "}
                            | {match.team1Name ?? "TBD"} vs{" "}
                            {match.team2Name ?? "TBD"}
                        </ModalTitle>
                        <ModalDescription className="font-sans text-xs font-extralight uppercase">
                            {format(istDate, "PPP")}
                        </ModalDescription>
                    </ModalHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-col items-center gap-2 py-2 sm:flex-row">
                            <Badge className="w-fit text-xs font-extralight uppercase">
                                {match.type}
                            </Badge>
                            <div className="max-w-xs overflow-hidden truncate text-[10px] font-extralight uppercase">
                                {match.venue}
                            </div>
                        </div>
                        <MatchTeamScore
                            team={1}
                            className="border-t px-4 pt-2"
                        />
                        <MatchTeamScore team={2} className="px-4" />
                        <MatchResult className="border-b px-4 pb-2" />

                        {user?.isAdmin &&
                            match.status === "scheduled" &&
                            currISTTime > doubleCutoff && (
                                <MatchUpdateButton match={match}>
                                    <Button className="uppercase">
                                        Update Match
                                    </Button>
                                </MatchUpdateButton>
                            )}

                        {user?.isAdmin && match.status !== "scheduled" && (
                            <Button
                                variant="destructive"
                                className="uppercase"
                                onClick={handleReverse}
                            >
                                Reverse Match
                            </Button>
                        )}

                        <MatchTabs match={match} />
                    </div>
                    <ModalFooter>
                        <ModalClose asChild>
                            <Button variant="outline" className="uppercase">
                                Close
                            </Button>
                        </ModalClose>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MatchProvider>
    );
}

export const MatchTitle = ({ className }: { className?: string }) => {
    const { match } = useMatchContext();
    const istDate = getISTDate(match.date);
    return (
        <div className={cn("text-[10px] font-extralight uppercase", className)}>
            {match.type === "league" ? `Match ${match.num}` : match.type} |{" "}
            {format(istDate, "PPP")}
        </div>
    );
};

export const MatchTeamScore = ({
    team,
    className,
}: {
    team: 1 | 2;
    className?: string;
}) => {
    const { match } = useMatchContext();
    return (
        <div
            className={cn(
                "flex items-center gap-1",
                team === 1 &&
                    match.winnerName === match.team2Name &&
                    "text-muted-foreground opacity-70",
                team === 2 &&
                    match.winnerName === match.team1Name &&
                    "text-muted-foreground opacity-70",
                className
            )}
        >
            <TeamLogo
                teamName={
                    team === 1
                        ? (match.team1Name ?? undefined)
                        : (match.team2Name ?? undefined)
                }
                className="size-8"
            />
            <span className="flex-1">
                {team === 1
                    ? (match.team1Name ?? "TBD")
                    : (match.team2Name ?? "TBD")}
            </span>
            <span className="text-xs">
                {team === 1 ? (match.team1Runs ?? 0) : (match.team2Runs ?? 0)}/
                {team === 1
                    ? (match.team1Wickets ?? 0)
                    : (match.team2Wickets ?? 0)}
            </span>
            <span className="-gap-2 text-xs text-muted-foreground">
                (
                {Math.floor(
                    (team === 1 ? match.team1Balls : match.team2Balls) / 6
                )}
                .
                {(team === 1 ? match.team1Balls : match.team2Balls) -
                    Math.floor(
                        (team === 1 ? match.team1Balls : match.team2Balls) / 6
                    ) *
                        6}
                )
            </span>
        </div>
    );
};

export const MatchResult = ({ className }: { className?: string }) => {
    const { match } = useMatchContext();
    const istDate = getISTDate(match.date);
    const currISTTime = getCurrentISTDate();
    return (
        <div
            className={cn(
                "w-full text-xs font-extralight uppercase text-muted-foreground",
                match.status !== "scheduled" && "text-primary",
                className
            )}
        >
            {match.status === "completed"
                ? `${match.winnerName} won by ${match.resultMargin === 0 ? "" : match.resultMargin} ${match.resultType}`
                : match.status === "abandoned"
                  ? "Match Abandoned"
                  : currISTTime > istDate
                    ? "Match Started"
                    : `Match to begin ${format(istDate, "p")}`}
        </div>
    );
};
