"use server";

import { z } from "zod";

import { matchNumSchema, matchParams } from "@/db/schema/matches.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import matchService from "@/services/match.services";

export const getAllFixtures = async (limit?: number) => {
    return await matchService.getAllFixtures({ limit });
};

export const getAllResults = async (limit?: number) => {
    return await matchService.getAllResults({ limit });
};

export const getAllMatches = async (limit?: number) => {
    return await matchService.getAllMatches({ limit });
};

export const getMatchByNum = async (values: z.infer<typeof matchNumSchema>) => {
    return await matchService.getMatchByNum(values);
};

export const getMatchesByTeam = async (
    values: z.infer<typeof teamNameSchema>
) => {
    return await matchService.getMatchesByTeam(values);
};

export const updateMatch = async (values: z.infer<typeof matchParams>) => {
    return await matchService.updateMatch(values);
};

export const reverseMatch = async (values: z.infer<typeof matchParams>) => {
    return await matchService.reverseMatch(values);
};

export const getTotalCompletedMatches = async () => {
    return await matchService.getTotalCompletedMatches();
};
