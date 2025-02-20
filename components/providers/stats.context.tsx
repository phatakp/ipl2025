"use client";

import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getMatchStats } from "@/actions/stats.actions";
import { MatchWithTeams, Stats } from "@/app/types";

type StatsContextProps = {
    stats: Stats[];
    match: MatchWithTeams;
};

const StatsContext = createContext<StatsContextProps | undefined>(undefined);

export default function StatsProvider({
    children,
    match,
}: PropsWithChildren & { match: MatchWithTeams }) {
    const [stats, setStats] = useState<Stats[]>([]);

    useEffect(() => {
        async function getData() {
            const [data, err] = await getMatchStats({
                team1Name: match.team1Name!,
                team2Name: match.team2Name!,
            });
            if (data) setStats(data);
        }
        getData();
    }, []);

    return (
        <StatsContext.Provider value={{ stats, match }}>
            {children}
        </StatsContext.Provider>
    );
}

export const useStatsContext = () => {
    const context = useContext(StatsContext);
    if (!context) throw new Error("Stat Context not used!");
    const { stats, match } = context;
    const t1Stats = stats.find(
        (s) => s.team1Name === match.team1Name && !s.team2Name
    );
    const t1t2Stats = stats.find(
        (s) =>
            s.team1Name === match.team1Name && s.team2Name === match.team2Name
    );
    const t2Stats = stats.find(
        (s) => s.team1Name === match.team2Name && !s.team2Name
    );
    const t2t1Stats = stats.find(
        (s) =>
            s.team1Name === match.team2Name && s.team2Name === match.team1Name
    );
    const result = {
        overall: {
            played: t1Stats?.played ?? 0,
            t1Wins: t1Stats?.won ?? 0,
            t1WinPct: t1Stats?.played ? (t1Stats.won ?? 0) / t1Stats.played : 0,
            t1HomeWins: t1Stats?.homeWon ?? 0,
            t1HomePct: t1Stats?.homePlayed
                ? (t1Stats.homeWon ?? 0) / t1Stats.homePlayed
                : 0,
            t1BatFirstWins: t1Stats?.batFirstWon ?? 0,
            t1BatFirstPct: t1Stats?.batFirstPlayed
                ? (t1Stats.batFirstWon ?? 0) / t1Stats.batFirstPlayed
                : 0,
            t1BatSecondWins: t1Stats?.batSecondWon ?? 0,
            t1BatSecondPct: t1Stats?.batSecondPlayed
                ? (t1Stats.batSecondWon ?? 0) / t1Stats.batSecondPlayed
                : 0,
            t2Wins: t2Stats?.won ?? 0,
            t2WinPct: t2Stats?.played ? (t2Stats.won ?? 0) / t2Stats.played : 0,
            t2AwayWins: t2Stats?.awayWon ?? 0,
            t2AwayPct: t2Stats?.awayPlayed
                ? (t2Stats.awayWon ?? 0) / t2Stats.awayPlayed
                : 0,
            t2BatFirstWins: t2Stats?.batFirstWon ?? 0,
            t2BatFirstPct: t2Stats?.batFirstPlayed
                ? (t2Stats.batFirstWon ?? 0) / t2Stats.batFirstPlayed
                : 0,
            t2BatSecondWins: t2Stats?.batSecondWon ?? 0,
            t2BatSecondPct: t2Stats?.batSecondPlayed
                ? (t2Stats.batSecondWon ?? 0) / t2Stats.batSecondPlayed
                : 0,
        },
        h2h: {
            played: t1t2Stats?.played ?? 0,
            t1Wins: t1t2Stats?.won ?? 0,
            t1WinPct: t1t2Stats?.played
                ? (t1t2Stats.won ?? 0) / t1t2Stats.played
                : 0,
            t1HomeWins: t1t2Stats?.homeWon ?? 0,
            t1HomePct: t1t2Stats?.homePlayed
                ? (t1t2Stats.homeWon ?? 0) / t1t2Stats.homePlayed
                : 0,
            t1BatFirstWins: t1t2Stats?.batFirstWon ?? 0,
            t1BatFirstPct: t1t2Stats?.batFirstPlayed
                ? (t1t2Stats.batFirstWon ?? 0) / t1t2Stats.batFirstPlayed
                : 0,
            t1BatSecondWins: t1t2Stats?.batSecondWon ?? 0,
            t1BatSecondPct: t1t2Stats?.batSecondPlayed
                ? (t1t2Stats.batSecondWon ?? 0) / t1t2Stats.batSecondPlayed
                : 0,
            t2Wins: t2t1Stats?.won ?? 0,
            t2WinPct: t2t1Stats?.played
                ? (t2t1Stats.won ?? 0) / t2t1Stats.played
                : 0,
            t2AwayWins: t2t1Stats?.awayWon ?? 0,
            t2AwayPct: t2t1Stats?.awayPlayed
                ? (t2t1Stats.awayWon ?? 0) / t2t1Stats.awayPlayed
                : 0,
            t2BatFirstWins: t2t1Stats?.batFirstWon ?? 0,
            t2BatFirstPct: t2t1Stats?.batFirstPlayed
                ? (t2t1Stats.batFirstWon ?? 0) / t2t1Stats.batFirstPlayed
                : 0,
            t2BatSecondWins: t2t1Stats?.batSecondWon ?? 0,
            t2BatSecondPct: t2t1Stats?.batSecondPlayed
                ? (t2t1Stats.batSecondWon ?? 0) / t2t1Stats.batSecondPlayed
                : 0,
        },
    };
    return { match, ...result };
};
