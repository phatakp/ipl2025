"use server";

import { z } from "zod";

import { matchTeamsSchema } from "@/db/schema/history.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import historyServices from "@/services/history.services";

export const getAllHistory = async () => {
    return await historyServices.getAllHistory();
};

export const getTotals = async () => {
    return await historyServices.getTotals();
};

export const getRecentMatchesForTeam = async (
    values: z.infer<typeof teamNameSchema>
) => {
    return await historyServices.getRecentMatchesForTeam(values);
};

export const getRecentHeadToHead = async (
    values: z.infer<typeof matchTeamsSchema>
) => {
    return await historyServices.getRecentHeadToHead(values);
};
