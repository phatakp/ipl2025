import { type ReactNode } from "react";

import { z } from "zod";

import {
    historyParams,
    insertMatchHistSchema,
    matchHistory,
} from "@/db/schema/history.schema";
import {
    matchParams,
    matchResultTypeSchema,
    matchStatusSchema,
    matchTypeSchema,
    matches,
} from "@/db/schema/matches.schema";
import {
    insertPredParams,
    predIdSchema,
    predStatusSchema,
    predictions,
    updatePredParams,
} from "@/db/schema/predictions.schema";
import {
    profileIdSchema,
    profileParams,
    profiles,
    shortProfileSchema,
} from "@/db/schema/profiles.schema";
import {
    insertStatsSchema,
    stats,
    updateStatsSchema,
} from "@/db/schema/stats.schema";
import {
    shortTeamSchema,
    teamNameSchema,
    teamParams,
    teams,
} from "@/db/schema/teams.schema";

//Stats Table
export type StatsTableData = {
    pos: number;
    id: string;
    team: TeamOption | undefined;
    name1: string;
    name2: string | null;
    value: number;
    extra?: ReactNode;
    title: string;
    desc: string;
    content: ReactNode;
};

//Teams
export type Team = typeof teams.$inferSelect;
export type ShortTeam = z.infer<typeof shortTeamSchema>;
export type TeamParams = z.infer<typeof teamParams>;
export type TeamOption = z.infer<typeof teamNameSchema>["shortName"];

//Profiles
export type Profile = typeof profiles.$inferSelect;
export type ShortProfile = z.infer<typeof shortProfileSchema>;
export type ProfileWithTeam = Profile & { team: ShortTeam };
export type ProfileParams = z.infer<typeof profileParams>;
export type ProfileId = z.infer<typeof profileIdSchema>["userId"];

//Matches
export type Match = typeof matches.$inferSelect;
export type MatchWithTeams = Match & {
    team1: ShortTeam;
    team2: ShortTeam;
    winner?: ShortTeam;
    total: number;
};
export type MatchParams = z.infer<typeof matchParams>;
export type MatchResultType = z.infer<
    typeof matchResultTypeSchema
>["resultType"];
export type MatchType = z.infer<typeof matchTypeSchema>["type"];
export type MatchStatus = z.infer<typeof matchStatusSchema>["status"];
export type ShortMatch = {
    date: string;
    type: MatchType;
    minStake: number;
    team1Name?: TeamOption;
    team2Name?: TeamOption;
    team1: ShortTeam;
    team2: ShortTeam;
    winner: ShortTeam;
};
export type MatchListType = "fixtures" | "results";

//Predictions
export type Pred = typeof predictions.$inferSelect;
export type CompletePred = Pred & {
    team: ShortTeam;
    match: MatchWithTeams;
    user: ShortProfile;
};
export type NewPredParams = z.infer<typeof insertPredParams>;
export type UpdatePredParams = z.infer<typeof updatePredParams>;
export type PredId = z.infer<typeof predIdSchema>["id"];
export type PredStatus = z.infer<typeof predStatusSchema>["status"];

//Match History
export type MatchHist = typeof matchHistory.$inferSelect;
export type MatchHistWithTeams = MatchHist & {
    team1: ShortTeam;
    team2: ShortTeam;
    winner: ShortTeam;
};
export type NewMatchHist = z.infer<typeof insertMatchHistSchema>;
export type MatchHistParams = z.infer<typeof historyParams>;
export type ShortMatchHist = z.infer<typeof historyParams>["date"] & {
    team1: ShortTeam;
    team2: ShortTeam;
    winner: ShortTeam;
};
export type HistCSVData = {
    id: string;
    season: string;
    city: string;
    date: string;
    match_type: string;
    venue: string;
    team1: string;
    team2: string;
    winner: string;
    result: string;
    result_margin: string;
    target_runs: string;
    target_overs: string;
    super_over: string;
};

export type HistTotalsReturn = {
    team1: TeamOption;
    team2: TeamOption;
    winner: TeamOption;
    type: MatchResultType;
    count: number;
};

//Stats
export type Stats = typeof stats.$inferSelect;
export type StatsWithTeams = Stats & {
    team1: ShortTeam;
    team2?: ShortTeam;
};
export type NewStats = z.infer<typeof insertStatsSchema>;
export type UpdateStats = z.infer<typeof updateStatsSchema>;
export type MatchStats = {
    played: number;
    t1Wins: number;
    t1WinPct: number;
    t1HomeWins: number;
    t1HomePct: number;
    t1BatFirstWins: number;
    t1BatFirstPct: number;
    t1BatSecondWins: number;
    t1BatSecondPct: number;
    t2Wins: number;
    t2WinPct: number;
    t2AwayWins: number;
    t2AwayPct: number;
    t2BatFirstWins: number;
    t2BatFirstPct: number;
    t2BatSecondWins: number;
    t2BatSecondPct: number;
};
