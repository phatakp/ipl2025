"use server";

import { z } from "zod";

import { matchTeamsSchema } from "@/db/schema/history.schema";
import statsService from "@/services/stats.services";

export const getMatchStats = async (
    values: z.infer<typeof matchTeamsSchema>
) => {
    return await statsService.getStatsForTeams(values);
};
