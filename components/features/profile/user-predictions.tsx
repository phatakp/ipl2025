import { getUserPredictions } from "@/actions/prediction.actions";
import StatsTable from "@/components/features/shared/stats-table";
import StatsTableProvider from "@/components/providers/stats-table.context";

export default async function UserPredictions() {
    const [preds] = await getUserPredictions();
    const top = preds
        ?.filter((p) => p.matchNum === 0)
        .map((pred) => ({
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: `${pred.match?.team1Name ?? "IPL"} ${pred.match?.team1Name ? "v" : ""} ${pred.match?.team2Name ?? "Winner"}`,
            name2: `Stake: ${pred.amount}`,
            value: pred.resultAmt,
        }))[0];

    const data = preds
        ?.filter((p) => p.matchNum > 0)
        .map((pred) => ({
            id: pred.id,
            team: pred.teamName ?? undefined,
            name1: `${pred.match?.team1Name ?? "IPL"} ${pred.match?.team1Name ? "v" : ""} ${pred.match?.team2Name ?? "Winner"}`,
            name2: `Stake: ${pred.teamName ?? "Default"} ${pred.amount}`,
            value: pred.resultAmt,
        }))
        .toSpliced(0, 0, top!);

    return (
        <StatsTableProvider data={data ?? []}>
            <StatsTable title="Your Predictions" />
        </StatsTableProvider>
    );
}
