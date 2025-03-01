"use server";

import { z } from "zod";

import { matchNumSchema, matchParams } from "@/db/schema/matches.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import matchService from "@/services/match.services";

export const getAllFixtures = async (limit?: number) =>
    await matchService.getAllFixtures({ limit });

export const getAllResults = async (limit?: number) =>
    await matchService.getAllResults({ limit });

export const getAllMatches = async (limit?: number) =>
    await matchService.getAllMatches({ limit });

export const getMatchByNum = async (values: z.infer<typeof matchNumSchema>) =>
    await matchService.getMatchByNum(values);

export const getMatchesByTeam = async (
    values: z.infer<typeof teamNameSchema>
) => await matchService.getMatchesByTeam(values);

export const updateMatch = async (values: z.infer<typeof matchParams>) =>
    await matchService.updateMatch(values);

export const reverseMatch = async (values: z.infer<typeof matchParams>) =>
    await matchService.reverseMatch(values);

export const getTotalCompletedMatches = async () =>
    await matchService.getTotalCompletedMatches();
