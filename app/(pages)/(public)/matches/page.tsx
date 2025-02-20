import { format } from "date-fns";

import { getAllMatches } from "@/actions/match.actions";
import MatchListCard from "@/components/features/match/match-list-card";
import { AnimatedList } from "@/components/features/shared/animated-list";
import {
    PageHeader,
    PageHeaderGrid,
    PageHeaderHeading,
} from "@/components/features/shared/page-header";
import { cn } from "@/lib/utils";

export default async function MatchesPage() {
    const [matches] = await getAllMatches();
    const dMatches = Object.groupBy(matches ?? [], ({ date }) =>
        format(date, "PPP")
    );
    return (
        // <MatchProvider>
        <div className="flex flex-col gap-4">
            <PageHeader>
                <PageHeaderGrid>
                    <PageHeaderHeading />
                </PageHeaderGrid>
            </PageHeader>

            <div
                className={cn(
                    "relative mt-8 flex h-full w-full flex-col space-y-8 overflow-hidden md:shadow-xl"
                )}
            >
                <AnimatedList>
                    {matches?.length === 0 && <div>No Matches yet.</div>}
                    {Object.entries(dMatches).map(([date, dMatches]) => (
                        <MatchListCard
                            date={date}
                            matches={dMatches ?? []}
                            key={date}
                        />
                    ))}
                </AnimatedList>
                {/* {fixtures.length > 0 && limit < fixtures[0].total && (
                        <Button onClick={loadMore}>Load More</Button>
                    )} */}
            </div>
        </div>
        // </MatchProvider>
    );
}
