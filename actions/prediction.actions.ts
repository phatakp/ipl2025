"use server";

import { z } from "zod";

import {
    matchDefaultSchema,
    matchNumSchema,
    matchParams,
} from "@/db/schema/matches.schema";
import {
    insertPredParams,
    predDoubleSchema,
    updatePredParams,
} from "@/db/schema/predictions.schema";
import { profileIdSchema } from "@/db/schema/profiles.schema";
import predictionService from "@/services/prediction.services";

export const getMatchPredictions = async (
    values: z.infer<typeof matchNumSchema>
) => await predictionService.getMatchPredictions(values);

export const getScheduledPredictionStats = async (
    values: z.infer<typeof matchNumSchema>
) => await predictionService.getScheduledPredictionStats(values);

export const getCompletedPredictionStats = async (
    values: z.infer<typeof matchNumSchema>
) => await predictionService.getCompletedPredictionStats(values);

export const getUserPredictions = async () =>
    await predictionService.getUserPredictions();

export const getCompletedPredictionsForUser = async (
    values: z.infer<typeof profileIdSchema>
) => await predictionService.getCompletedPredictionsForUser(values);

export const getAllIPLPredictions = async () =>
    await predictionService.getAllIPLPredictions();

export const getAllPredictions = async () =>
    await predictionService.getAllPredictions();

export const getUserPredictionForMatch = async (
    values: z.infer<typeof matchNumSchema>
) => await predictionService.getUserPredictionForMatch(values);

export const getMaxPredictionForMatch = async (
    values: z.infer<typeof matchNumSchema>
) => await predictionService.getMaxPredictionForMatch(values);

export const getMaxWonAmount = async (
    values: z.infer<typeof profileIdSchema>
) => await predictionService.getMaxWonAmount(values);

export const getMaxLostAmount = async (
    values: z.infer<typeof profileIdSchema>
) => await predictionService.getMaxLostAmount(values);

export const getPredictionAccuracy = async (
    values: z.infer<typeof profileIdSchema>
) => await predictionService.getPredictionAccuracy(values);

export const createPrediction = async (
    values: z.infer<typeof insertPredParams>
) => await predictionService.createPrediction(values);

export const updatePrediction = async (
    values: z.infer<typeof updatePredParams>
) => await predictionService.updatePrediction(values);

export const addDefaultPredictionsForMatch = async (
    values: z.infer<typeof matchDefaultSchema>
) => await predictionService.addDefaultPredictionsForMatch(values);

export const playDoublePrediction = async (
    values: z.infer<typeof predDoubleSchema>
) => await predictionService.playDoublePrediction(values);

export const settleCompletedPredictions = async (
    values: z.infer<typeof matchParams>
) => await predictionService.settleCompletedPredictions(values);

export const settleAbandonedPredictions = async (
    values: z.infer<typeof matchParams>
) => await predictionService.settleAbandonedPredictions(values);

export const settleFinalPredictions = async (
    values: z.infer<typeof matchParams>
) => await predictionService.settleFinalPredictions(values);

export const reversePredictions = async (values: z.infer<typeof matchParams>) =>
    await predictionService.reversePredictions(values);

export const reverseFinalPredictions = async (
    values: z.infer<typeof matchParams>
) => await predictionService.reverseFinalPredictions(values);
