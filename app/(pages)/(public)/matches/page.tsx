import MatchList from "@/components/features/match/match-list";
import {
    PageHeader,
    PageHeaderGrid,
    PageHeaderHeading,
} from "@/components/features/shared/page-header";
import MatchListProvider from "@/components/providers/match-list.context";

export default async function MatchesPage() {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader>
                <PageHeaderGrid>
                    <PageHeaderHeading />
                </PageHeaderGrid>
            </PageHeader>
            <MatchListProvider>
                <MatchList />
            </MatchListProvider>
        </div>
    );
}
