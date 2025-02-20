import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrUser, getRank } from "@/actions/user.actions";
import MatchCarousel from "@/components/features/match/match-carousel";
import DashboardStatsCarousel from "@/components/features/profile/dashboard-stats-carousel";
import {
    PageActions,
    PageHeader,
    PageHeaderGrid,
    PageHeaderHeading,
} from "@/components/features/shared/page-header";
import AuthProvider from "@/components/providers/auth.context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const [user] = await getCurrUser();
    if (!user?.teamName) redirect("/profile");
    const [rank] = await getRank();
    return (
        <AuthProvider currUser={user}>
            <div className="flex flex-col gap-16">
                <PageHeader>
                    <PageHeaderGrid>
                        <PageHeaderHeading />
                        <PageActions>
                            <div className="flex items-center gap-2">
                                <Badge className="w-full justify-center gap-2">
                                    <span className="mr-2 hidden text-lg font-extralight md:flex">
                                        #{rank}
                                    </span>
                                    <span className="hidden font-karla text-muted-foreground md:flex">
                                        |
                                    </span>
                                    {/* <TeamLogo
                                        teamName={user?.teamName! as TeamOption}
                                        className="size-10"
                                        simple
                                        /> */}

                                    <span className="font-extralight uppercase">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                    <span className="font-karla text-muted-foreground">
                                        |
                                    </span>

                                    <span className="text-2xl">
                                        {user?.balance}
                                    </span>
                                </Badge>
                            </div>
                            <Link
                                href={"/profile/update"}
                                className={cn(
                                    "font-karla underline underline-offset-2 hover:opacity-90"
                                )}
                            >
                                Update Profile
                            </Link>
                        </PageActions>
                    </PageHeaderGrid>
                </PageHeader>
                <MatchCarousel />
                <DashboardStatsCarousel />
            </div>
        </AuthProvider>
    );
}
