import { ChevronRight } from "lucide-react";

import { getAllPredictions } from "@/actions/prediction.actions";
import { getAllUsers } from "@/actions/user.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { cn } from "@/lib/utils";

export default async function PlayerStandings() {
    const [users] = await getAllUsers();
    const [preds] = await getAllPredictions();

    const data = users?.map((u, i) => {
        const form = preds
            ?.filter((p) => p.userId === u.userId)
            .sort((a, b) => b.matchNum - a.matchNum)
            .slice(0, 5)
            .map((p) => p.status.charAt(0));
        return {
            pos: i + 1,
            id: u.userId,
            team: u.teamName ?? undefined,
            name1: u.firstName,
            name2: u.lastName ?? "",
            extra:
                form && form.length > 0 ? (
                    <div className="flex items-center gap-1 font-karla text-sm text-muted-foreground">
                        <ChevronRight className="size-3" />
                        {form.map((f, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "uppercase",
                                    f === "w" && "text-success",
                                    f === "l" && "text-destructive"
                                )}
                            >
                                {["w", "l"].includes(f) ? f : "X"}
                            </span>
                        ))}
                    </div>
                ) : undefined,
            value: u.balance,
            title: `${u.firstName} ${u.lastName ?? ""}`,
            desc: "",
            content: "Content",
        };
    });

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Player Standings" />
        </StatsTableProvider>
    );
}
