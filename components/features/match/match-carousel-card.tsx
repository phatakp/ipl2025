import { format } from "date-fns";

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
import StatsProvider from "@/components/providers/stats.context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentISTDate, getISTDate } from "@/lib/utils";

import TeamLogo from "../team/team-logo";
import MatchPredictions from "./match-predictions";
import MatchStats from "./match-stats";

type Props = {
    match: MatchWithTeams;
};
export default function MatchCarouselCard({ match }: Props) {
    const istDate = getISTDate(match.date);
    const currISTTime = getCurrentISTDate();
    return (
        <Modal id={`id-${match.num}`}>
            <ModalTrigger asChild>
                <Card className="w-[320px] cursor-pointer transition-all duration-300 ease-in-out hover:border-4 sm:w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-extralight uppercase">
                            {match.type === "league"
                                ? `Match ${match.num}`
                                : match.type}{" "}
                            | {format(istDate, "PPP")}
                        </CardTitle>
                        <CardDescription className="truncate text-[8px] uppercase">
                            {match.venue}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TeamLogo
                                teamName={match.team1Name ?? undefined}
                                className="size-8"
                            />
                            <span className="flex-1">{match.team1Name}</span>
                            <span className="text-xs">
                                {match.team1Runs}/{match.team1Wickets}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TeamLogo
                                teamName={match.team2Name ?? undefined}
                                className="size-8"
                            />
                            <span className="flex-1">{match.team2Name}</span>
                            <span className="text-xs">
                                {match.team2Runs}/{match.team2Wickets}
                            </span>
                        </div>
                        <div className="mt-4 w-full text-xs font-extralight uppercase text-muted-foreground">
                            {currISTTime > istDate
                                ? "Match Started"
                                : `Match to begin ${format(istDate, "p")}`}
                        </div>
                    </CardContent>
                </Card>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        {match.type === "league"
                            ? `Match ${match.num}`
                            : match.type}{" "}
                        | {match.team1Name} vs {match.team2Name}
                    </ModalTitle>
                    <ModalDescription>
                        {format(istDate, "PPpp")}
                    </ModalDescription>
                </ModalHeader>
                <div className="py-4">
                    <Tabs defaultValue="stats" className="w-full">
                        <TabsList>
                            <TabsTrigger value="stats" className="uppercase">
                                Stats
                            </TabsTrigger>
                            <TabsTrigger
                                value="predictions"
                                className="uppercase"
                            >
                                Predictions
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="stats">
                            <StatsProvider match={match}>
                                <MatchStats asModal />
                            </StatsProvider>
                        </TabsContent>
                        <TabsContent value="predictions">
                            <MatchPredictions match={match} />
                        </TabsContent>
                    </Tabs>
                </div>
                <ModalFooter>
                    <ModalClose asChild>
                        <Button variant="outline">Close</Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
