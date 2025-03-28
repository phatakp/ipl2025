import { redirect } from "next/navigation";

import { IndianRupeeIcon } from "lucide-react";

import { getAllFixtures, getAllResults } from "@/actions/match.actions";
import { getCurrUser, getRank } from "@/actions/user.actions";
import MatchCarousel from "@/components/features/match/match-carousel";
import DashboardStatsCarousel from "@/components/features/profile/dashboard-stats-carousel";
import StatsSlider from "@/components/features/profile/stats-slider";
import {
    PageActions,
    PageHeader,
    PageHeaderGrid,
    PageHeaderHeading,
} from "@/components/features/shared/page-header";
import AuthProvider from "@/components/providers/auth.context";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const [user] = await getCurrUser();
    if (!user?.teamName) redirect("/profile");
    const [rank] = await getRank();
    const [fixtures] = await getAllFixtures();
    const [results] = await getAllResults();

    return (
        <AuthProvider currUser={user}>
            <div className="flex flex-col gap-16">
                <PageHeader>
                    <PageHeaderGrid>
                        <PageHeaderHeading />
                        <PageActions>
                            <div className="flex items-center gap-2">
                                <Badge className="w-full justify-center gap-2">
                                    <span className="mr-2 text-lg font-extralight">
                                        #{rank}
                                    </span>
                                    <span className="font-karla text-muted-foreground">
                                        |
                                    </span>

                                    <span className="truncate font-extralight uppercase">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                </Badge>
                                <Badge
                                    variant={
                                        user?.balance < 0
                                            ? "destructive"
                                            : "success"
                                    }
                                    className="flex items-center text-2xl"
                                >
                                    <IndianRupeeIcon className="size-4" />
                                    {user?.balance.toFixed()}
                                </Badge>
                            </div>
                        </PageActions>
                    </PageHeaderGrid>
                </PageHeader>
                <StatsSlider />
                <MatchCarousel matches={fixtures ?? []} type="fixtures" />
                <MatchCarousel matches={results ?? []} type="results" />
                <DashboardStatsCarousel />
            </div>
        </AuthProvider>
    );
}
