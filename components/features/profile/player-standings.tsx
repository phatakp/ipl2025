import { getUserPredictions } from "@/actions/prediction.actions";
import { getAllUsers } from "@/actions/user.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { cn } from "@/lib/utils";

export default async function PlayerStandings() {
    const [users] = await getAllUsers();
    const [preds] = await getUserPredictions();
    const form = preds
        ?.filter((p) => !p.isIPLWinner)
        .slice(0, 5)
        .map((p) => p.status);
    const data = users?.map((u, i) => ({
        pos: i + 1,
        id: u.userId,
        team: u.teamName ?? undefined,
        name1: u.firstName,
        name2: u.lastName ?? "",
        extra:
            form && form.length > 0 ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {form.map((f, i) => (
                        <span
                            key={i}
                            className={cn(
                                f === "won" && "text-success",
                                f === "lost" && "text-destructive"
                            )}
                        >
                            {f === "won" ? "W" : f === "lost" ? "L" : "."}
                        </span>
                    ))}
                </div>
            ) : undefined,
        value: u.balance,
        title: `${u.firstName} ${u.lastName ?? ""}`,
        desc: "",
        content: "Content",
    }));

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Player Standings" />
        </StatsTableProvider>
    );
}
