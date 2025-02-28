import { getAllTeams } from "@/actions/team.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { cn } from "@/lib/utils";

export default async function TeamStandings() {
    const [teams] = await getAllTeams();
    const data = teams?.map((t, i) => ({
        pos: i + 1,
        id: t.shortName,
        team: t.shortName,
        name1: t.longName.split(" ")[0],
        name2: t.longName.split(" ").slice(1).join(" "),
        extra: (
            <div
                className={cn(
                    "flex items-center font-karla",
                    i > 0 && "text-sm text-muted-foreground"
                )}
            >
                {t.nrr >= 0 && "+"}
                {t.nrr.toFixed(3)}
            </div>
        ),
        value: t.points,
        title: t.longName,
        desc: `Rank ${i + 1}`,
        content: "Content",
    }));

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Team Standings" />
        </StatsTableProvider>
    );
}
