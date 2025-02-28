"use server";

import { z } from "zod";

import { matchParams } from "@/db/schema/matches.schema";
import { teamLongNameSchema, teamNameSchema } from "@/db/schema/teams.schema";
import teamService from "@/services/team.services";

export const getAllTeams = async () => {
    return await teamService.getAllTeams();
};

export const getTeamByName = async (values: z.infer<typeof teamNameSchema>) => {
    return await teamService.getTeamByName(values);
};

export const getTeamByLongName = async (
    values: z.infer<typeof teamLongNameSchema>
) => {
    return await teamService.getTeamByLongName(values);
};

export const updateTeamsForCompletedMatch = async (
    values: z.infer<typeof matchParams>
) => {
    return await teamService.updateTeamsForCompletedMatch(values);
};

export const reverseTeamsForCompletedMatch = async (
    values: z.infer<typeof matchParams>
) => {
    return await teamService.reverseTeamsForCompletedMatch(values);
};
