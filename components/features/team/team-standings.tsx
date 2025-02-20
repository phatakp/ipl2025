import { getAllTeams } from "@/actions/team.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";

export default async function TeamStandings() {
    const [teams] = await getAllTeams();
    const data = teams?.map((t) => ({
        id: t.shortName,
        team: t.shortName,
        name1: t.longName.split(" ")[0],
        name2: t.longName.split(" ").slice(1).join(" "),
        value: t.points,
    }));

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Team Standings" />
        </StatsTableProvider>
    );
}
