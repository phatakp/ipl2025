import { ChevronRight } from "lucide-react";

import {
    getAllIPLPredictions,
    getAllPredictions,
} from "@/actions/prediction.actions";
import { getAllUsers } from "@/actions/user.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";
import { cn } from "@/lib/utils";

import UserProfile from "./user-profile";

export default async function PlayerStandings() {
    const [users] = await getAllUsers();
    const [preds] = await getAllPredictions();
    const [iplPreds] = await getAllIPLPredictions();

    const data = users?.map((u, i) => {
        let form = preds
            ?.filter(
                (p) =>
                    p.userId === u.userId &&
                    ["won", "lost", "no_result"].includes(p.status)
            )
            .sort((a, b) => b.matchNum - a.matchNum)
            .slice(0, 5);
        const ipl = iplPreds?.find((p) => p.userId === u.userId);
        if (!!ipl?.id && !!form) form = [ipl, ...form];

        return {
            pos: i + 1,
            id: u.userId,
            team: u.teamName ?? undefined,
            name1: u.firstName,
            name2: u.lastName ?? "",
            extra:
                form && form.length > 0 ? (
                    <div
                        key={u.userId}
                        className="flex items-center gap-1 font-karla text-sm text-muted-foreground"
                    >
                        <ChevronRight className="size-3" />
                        {form.map((f, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "uppercase",
                                    f.status === "won" && "text-success",
                                    f.status === "lost" && "text-destructive"
                                )}
                            >
                                {["won", "lost"].includes(f.status)
                                    ? f.status.charAt(0)
                                    : "X"}
                            </span>
                        ))}
                    </div>
                ) : undefined,
            value: u.balance,
            title: `${u.firstName} ${u.lastName ?? ""}`,
            desc: "",
            content: (
                <UserProfile key={u.userId} id={u.userId} userPreds={form} />
            ),
        };
    });

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Player Standings" />
        </StatsTableProvider>
    );
}
