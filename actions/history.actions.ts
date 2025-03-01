"use server";

import { z } from "zod";

import { matchTeamsSchema } from "@/db/schema/history.schema";
import { matchParams } from "@/db/schema/matches.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import historyServices from "@/services/history.services";

export const getAllHistory = async () => await historyServices.getAllHistory();

export const getTotals = async () => await historyServices.getTotals();

export const getRecentMatchesForTeam = async (
    values: z.infer<typeof teamNameSchema>
) => await historyServices.getRecentMatchesForTeam(values);

export const getRecentHeadToHead = async (
    values: z.infer<typeof matchTeamsSchema>
) => await historyServices.getRecentHeadToHead(values);

export const createHistory = async (values: z.infer<typeof matchParams>) =>
    await historyServices.createHistory(values);

export const deleteHistory = async (values: z.infer<typeof matchParams>) =>
    await historyServices.deleteHistory(values);
