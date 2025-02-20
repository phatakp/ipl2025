import { relations } from "drizzle-orm";

import { matchHistory } from "./history.schema";
import { matches } from "./matches.schema";
import { predictions } from "./predictions.schema";
import { profiles } from "./profiles.schema";
import { teams } from "./teams.schema";

//relations for profile
export const profileRelations = relations(profiles, ({ one, many }) => ({
    team: one(teams, {
        fields: [profiles.teamName],
        references: [teams.shortName],
        relationName: "iplWinners",
    }),
    predictions: many(predictions, {
        relationName: "userPredictions",
    }),
}));

//relations for team
export const teamsRelations = relations(teams, ({ many }) => ({
    homeMatches: many(matches, {
        relationName: "homeMatches",
    }),
    awayMatches: many(matches, {
        relationName: "awayMatches",
    }),
    winnerMatches: many(matches, {
        relationName: "winnerMatches",
    }),
    profiles: many(profiles, {
        relationName: "iplWinners",
    }),
    predictions: many(predictions, {
        relationName: "teamPredictions",
    }),
    homeMatchHistory: many(matchHistory, {
        relationName: "homeMatchHistory",
    }),
    awayMatchHistory: many(matchHistory, {
        relationName: "awayMatchHistory",
    }),
    winnerMatchHistory: many(matchHistory, {
        relationName: "winnerMatchHistory",
    }),
}));

//relations for matches
export const matchesRelations = relations(matches, ({ one, many }) => ({
    team1: one(teams, {
        fields: [matches.team1Name],
        references: [teams.shortName],
        relationName: "homeMatches",
    }),
    team2: one(teams, {
        fields: [matches.team2Name],
        references: [teams.shortName],
        relationName: "awayMatches",
    }),
    winner: one(teams, {
        fields: [matches.winnerName],
        references: [teams.shortName],
        relationName: "winnerMatches",
    }),
    predictions: many(predictions, {
        relationName: "matchPredictions",
    }),
}));

//relations for predictions
export const predictionRelations = relations(predictions, ({ one }) => ({
    match: one(matches, {
        fields: [predictions.matchNum],
        references: [matches.num],
        relationName: "matchPredictions",
    }),
    team: one(teams, {
        fields: [predictions.teamName],
        references: [teams.shortName],
        relationName: "teamPredictions",
    }),
    user: one(profiles, {
        fields: [predictions.userId],
        references: [profiles.userId],
        relationName: "userPredictions",
    }),
}));

//relations for matchHistory
export const matchHistoryRelations = relations(
    matchHistory,
    ({ one, many }) => ({
        team1: one(teams, {
            fields: [matchHistory.team1Name],
            references: [teams.shortName],
            relationName: "homeMatchHistory",
        }),
        team2: one(teams, {
            fields: [matchHistory.team2Name],
            references: [teams.shortName],
            relationName: "awayMatchHistory",
        }),
        winner: one(teams, {
            fields: [matchHistory.winnerName],
            references: [teams.shortName],
            relationName: "winnerMatchHistory",
        }),
    })
);
