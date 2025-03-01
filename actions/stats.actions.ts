"use server";

import { z } from "zod";

import { MatchStatus } from "@/app/types";
import { matchTeamsSchema } from "@/db/schema/history.schema";
import { matchParams } from "@/db/schema/matches.schema";
import statsService from "@/services/stats.services";

export const getMatchStats = async (values: z.infer<typeof matchTeamsSchema>) =>
    await statsService.getStatsForTeams(values);

export const updateStatsForTeam1 = async (
    values: z.infer<typeof matchParams>
) =>
    await statsService.updateStatsForTeam1({
        ...values,
        winnerName: values.winnerName ?? null,
        status: values.status as MatchStatus,
        resultType: values.resultType ?? null,
        resultMargin: values.resultMargin ?? 0,
        minStake: values.minStake ?? 0,
        team1Runs: values.team1Runs ?? 0,
        team1Balls: values.team1Balls ?? 0,
        team1Wickets: values.team1Wickets ?? 0,
        team2Runs: values.team2Runs ?? 0,
        team2Balls: values.team2Balls ?? 0,
        team2Wickets: values.team2Wickets ?? 0,
        isDoublePlayed: !!values.isDoublePlayed,
    });

export const updateStatsForTeam2 = async (
    values: z.infer<typeof matchParams>
) =>
    await statsService.updateStatsForTeam2({
        ...values,
        winnerName: values.winnerName ?? null,
        status: values.status as MatchStatus,
        resultType: values.resultType ?? null,
        resultMargin: values.resultMargin ?? 0,
        minStake: values.minStake ?? 0,
        team1Runs: values.team1Runs ?? 0,
        team1Balls: values.team1Balls ?? 0,
        team1Wickets: values.team1Wickets ?? 0,
        team2Runs: values.team2Runs ?? 0,
        team2Balls: values.team2Balls ?? 0,
        team2Wickets: values.team2Wickets ?? 0,
        isDoublePlayed: !!values.isDoublePlayed,
    });

export const reverseStatsForTeam1 = async (
    values: z.infer<typeof matchParams>
) => await statsService.reverseStatsForTeam1(values);

export const reverseStatsForTeam2 = async (
    values: z.infer<typeof matchParams>
) => await statsService.reverseStatsForTeam2(values);
