"use server";

import { z } from "zod";

import { matchParams } from "@/db/schema/matches.schema";
import { teamLongNameSchema, teamNameSchema } from "@/db/schema/teams.schema";
import teamService from "@/services/team.services";

export const getAllTeams = async () => await teamService.getAllTeams();

export const getTeamByName = async (values: z.infer<typeof teamNameSchema>) =>
    await teamService.getTeamByName(values);

export const getTeamByLongName = async (
    values: z.infer<typeof teamLongNameSchema>
) => await teamService.getTeamByLongName(values);

export const updateTeamsForCompletedMatch = async (
    values: z.infer<typeof matchParams>
) => await teamService.updateTeamsForCompletedMatch(values);

export const reverseTeamsForCompletedMatch = async (
    values: z.infer<typeof matchParams>
) => await teamService.reverseTeamsForCompletedMatch(values);
