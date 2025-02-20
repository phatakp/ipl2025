import { getUserPredictions } from "@/actions/prediction.actions";
import { getAllUsers } from "@/actions/user.actions";
import FormGuide from "@/components/features/shared/form-guide";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";

export default async function PlayerStandings() {
    const [users] = await getAllUsers();
    const [preds] = await getUserPredictions();
    const form = preds?.filter((p) => !p.isIPLWinner).map((p) => p.status);
    const data = users?.map((u) => ({
        id: u.userId,
        team: u.teamName ?? undefined,
        name1: u.firstName,
        name2: u.lastName ?? "",
        extra:
            form && form.length > 0 ? (
                <FormGuide
                    direction="left"
                    data={form}
                    className="md:size-4 md:text-xs"
                />
            ) : undefined,
        value: u.balance,
    }));

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Player Standings" />
        </StatsTableProvider>
    );
}
