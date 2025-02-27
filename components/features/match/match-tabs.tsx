import { MatchWithTeams } from "@/app/types";
import StatsProvider from "@/components/providers/stats.context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MatchPredictions from "./match-predictions";
import MatchStats from "./match-stats";

type Props = {
    match: MatchWithTeams;
    asModal?: boolean;
};

export default function MatchTabs({ match, asModal = true }: Props) {
    return (
        <Tabs defaultValue="stats" className="mt-4 w-full">
            <TabsList>
                <TabsTrigger value="stats" className="uppercase">
                    Stats
                </TabsTrigger>
                <TabsTrigger value="predictions" className="uppercase">
                    Predictions
                </TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
                <StatsProvider match={match}>
                    <MatchStats asModal={asModal} />
                </StatsProvider>
            </TabsContent>
            <TabsContent value="predictions">
                <MatchPredictions match={match} />
            </TabsContent>
        </Tabs>
    );
}
