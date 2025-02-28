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
import predictionService from "@/services/prediction.services";

export const getMatchPredictions = async (
    values: z.infer<typeof matchNumSchema>
) => {
    return await predictionService.getMatchPredictions(values);
};

export const getUserPredictions = async () => {
    return await predictionService.getUserPredictions();
};

export const getAllPredictions = async () => {
    return await predictionService.getAllPredictions();
};

export const getUserPredictionForMatch = async (
    values: z.infer<typeof matchNumSchema>
) => {
    return await predictionService.getUserPredictionForMatch(values);
};
export const getMaxPredictionForMatch = async (
    values: z.infer<typeof matchNumSchema>
) => {
    return await predictionService.getMaxPredictionForMatch(values);
};

export const createPrediction = async (
    values: z.infer<typeof insertPredParams>
) => {
    return await predictionService.createPrediction(values);
};

export const updatePrediction = async (
    values: z.infer<typeof updatePredParams>
) => {
    return await predictionService.updatePrediction(values);
};

export const addDefaultPredictionsForMatch = async (
    values: z.infer<typeof matchDefaultSchema>
) => {
    return await predictionService.addDefaultPredictionsForMatch(values);
};

export const playDoublePrediction = async (
    values: z.infer<typeof predDoubleSchema>
) => {
    return await predictionService.playDoublePrediction(values);
};

export const settleCompletedPredictions = async (
    values: z.infer<typeof matchParams>
) => {
    return await predictionService.settleCompletedPredictions(values);
};

export const settleAbandonedPredictions = async (
    values: z.infer<typeof matchParams>
) => {
    return await predictionService.settleAbandonedPredictions(values);
};

export const settleFinalPredictions = async (
    values: z.infer<typeof matchParams>
) => {
    return await predictionService.settleFinalPredictions(values);
};

export const reversePredictions = async (
    values: z.infer<typeof matchParams>
) => {
    return await predictionService.reversePredictions(values);
};

export const reverseFinalPredictions = async (
    values: z.infer<typeof matchParams>
) => {
    return await predictionService.reverseFinalPredictions(values);
};
