import { NeonQueryFunction, neon } from "@neondatabase/serverless";
import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import {
    drizzle as PostgresDrizzle,
    PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import fs from "fs";
import Papa from "papaparse";
import path from "path";

import { getTotals } from "@/actions/history.actions";
import { getAllTeams } from "@/actions/team.actions";
import {
    HistCSVData,
    MatchHistParams,
    MatchParams,
    MatchResultType,
    MatchStatus,
    MatchType,
    NewStats,
    TeamOption,
    TeamParams,
} from "@/app/types";
import matches from "@/db/2025.json";
import * as matchHistSchema from "@/db/schema/history.schema";
import * as matchesSchema from "@/db/schema/matches.schema";
import * as predictionsSchema from "@/db/schema/predictions.schema";
import * as profilesSchema from "@/db/schema/profiles.schema";
import * as relations from "@/db/schema/relations";
import * as statsSchema from "@/db/schema/stats.schema";
import * as teamsSchema from "@/db/schema/teams.schema";
import { env } from "@/lib/env";
import { generateStats } from "@/lib/utils";

const schema = {
    ...teamsSchema,
    ...profilesSchema,
    ...matchesSchema,
    ...predictionsSchema,
    ...matchHistSchema,
    ...statsSchema,
    ...relations,
};

const readCSV = async (filePath: string) => {
    const csvFile = fs.readFileSync(path.join(__dirname, filePath));
    const csvData = csvFile.toString();
    return new Promise((resolve) => {
        Papa.parse(csvData, {
            header: true,
            complete: (results: any) => {
                resolve(results.data);
            },
        });
    });
};

const loadTeams = async (
    db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>
) => {
    const data: TeamParams[] = [
        { shortName: "CSK", longName: "Chennai Super Kings" },
        { shortName: "DC", longName: "Delhi Capitals" },
        { shortName: "MI", longName: "Mumbai Indians" },
        { shortName: "RR", longName: "Rajasthan Royals" },
        { shortName: "RCB", longName: "Royal Challengers Bengaluru" },
        { shortName: "PBKS", longName: "Punjab Kings" },
        { shortName: "SRH", longName: "Sunrisers Hyderabad" },
        { shortName: "LSG", longName: "Lucknow Super Giants" },
        { shortName: "GT", longName: "Gujarat Titans" },
        { shortName: "KKR", longName: "Kolkata Knight Riders" },
    ];
    await db.delete(teamsSchema.teams);
    await db.insert(teamsSchema.teams).values(data);

    console.log("Teams loaded");
};

const loadMatches = async (
    db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>
) => {
    const data: MatchParams[] = [];
    const [teams, err] = await getAllTeams();
    if (err) throw new Error(err.message);
    let num = 0;

    //Start to form Match Table Row data
    matches.Matchsummary.forEach((match) => {
        // Get team information

        const team1 = teams.find(
            (team) => team.longName === match.HomeTeamName
        )?.shortName;
        const team2 = teams.find(
            (team) => team.longName === match.AwayTeamName
        )?.shortName;

        if (match.MatchOrder.includes("T20I") && (!team1 || !team2))
            console.log(
                "Match not created for",
                match.HomeTeamName,
                match.AwayTeamName,
                match.MATCH_COMMENCE_START_DATE,
                match.MatchOrder
            );
        else {
            num += 1;
            //Format Match date
            const [yy, mm, dd] = match.GMTMatchDate.split("-");
            const [hr, min] = match.GMTMatchTime.split(" ")[0].split(":");
            const date = new Date(
                Date.UTC(
                    2025,
                    Number(mm) - 1,
                    Number(dd),
                    Number(hr),
                    Number(min),
                    0
                )
            ).toISOString();

            const matchCurr = {
                num: match.MatchRow,
                team1Name: team1 ?? null,
                team2Name: team2 ?? null,
                date,
                venue: `${match.GroundName}, ${match.city}`,
                type: match.MatchOrder.includes("T20I")
                    ? ("league" as MatchType)
                    : (match.MatchOrder.split(" ")
                          .join("")
                          .toLowerCase() as MatchType),
                status: "scheduled" as MatchStatus,
                winnerName: undefined,
                minStake:
                    match.MatchRow < 36
                        ? 30
                        : match.MatchOrder.includes("T20I")
                          ? 50
                          : match.MatchOrder === "Final"
                            ? 200
                            : 100,
            };
            data.push(matchCurr);
        }
    });
    // const mtches = data
    //     .sort((a, b) => (a.date > b.date ? 1 : -1))
    //     .map((m, i) => ({ ...m, num: i + 1 }));
    await db.delete(matchesSchema.matches);
    await db.insert(matchesSchema.matches).values({
        num: 0,
        date: new Date().toISOString(),
        venue: "IPL Final",
        type: "final" as MatchType,
        status: "completed" as MatchStatus,
    });
    await db.insert(matchesSchema.matches).values(data);
    console.log("Matches loaded");
};

const loadHistory = async (
    db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>
) => {
    let parsedData = (await readCSV("history.csv")) as HistCSVData[];
    const [teams, err] = await getAllTeams();
    if (err) throw new Error(err.message);
    const data: MatchHistParams[] = [];
    parsedData.forEach((match) => {
        // Get team information
        const team1 = teams.find(
            (team) => team.shortName === match.team1
        )?.shortName;
        const team2 = teams.find(
            (team) => team.shortName === match.team2
        )?.shortName;

        if (team1 && team2) {
            const venue = `${match.venue}, ${match.city}`;
            const winner = teams.find(
                (team) => team.shortName === match.winner
            )?.shortName;
            const date = new Date(
                match.date.split("-").reverse().join("-")
            ).toDateString();

            let resultMargin = 0;
            let resultType = null;
            let team1Runs = 0;
            let team2Runs = 0;
            let team1Balls = 120;
            let team2Balls = 120;

            if (winner) {
                if (match.super_over === "Y") {
                    team1Runs = Number(match.target_runs) - 1;
                    team2Runs = team1Runs;
                    resultType = "superover" as MatchResultType;
                } else {
                    if (match.result === "wickets") {
                        resultType = match.result as MatchResultType;
                        if (match.team1 === match.winner) {
                            resultMargin = Number(match.result_margin);
                            team2Runs = Number(match.target_runs) - 1;
                            team1Runs = team2Runs + 1;
                            if (match.target_overs.includes("."))
                                team1Balls =
                                    Number(match.target_overs.split(".")[0]) *
                                        6 +
                                    Number(match.target_overs.split(".")[1]);
                            else team1Balls = Number(match.target_overs) * 6;
                        } else if (match.team2 === match.winner) {
                            resultMargin = Number(match.result_margin);
                            team1Runs = Number(match.target_runs) - 1;
                            team2Runs = team1Runs + 1;
                            if (match.target_overs.includes("."))
                                team2Balls =
                                    Number(match.target_overs.split(".")[0]) *
                                        6 +
                                    Number(match.target_overs.split(".")[1]);
                            else team2Balls = Number(match.target_overs) * 6;
                        }
                    } else if (match.result === "runs") {
                        resultType = match.result as MatchResultType;
                        if (match.team1 === match.winner) {
                            resultMargin = Number(match.result_margin);
                            team1Runs = Number(match.target_runs) - 1;
                            team2Runs = team1Runs - resultMargin;
                        } else if (match.team2 === match.winner) {
                            resultMargin = Number(match.result_margin);
                            team2Runs = Number(match.target_runs) - 1;
                            team1Runs = team2Runs - resultMargin;
                        }
                    }
                }
            }
            data.push({
                team1Name: team1,
                team2Name: team2,
                winnerName: winner ?? null,
                venue,
                date,
                team1Runs,
                team1Balls,
                team2Runs,
                team2Balls,
                resultMargin,
                resultType,
                isLeagueMatch: match.match_type === "League",
            });
        }
    });

    await db.delete(matchHistSchema.matchHistory);
    await db.insert(matchHistSchema.matchHistory).values(data);
    console.log("Match History loaded");
};

const loadStats = async (
    db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>
) => {
    const [totals, err] = await getTotals();
    if (err) throw new Error(err?.message);
    const data: NewStats[] = [];
    const dataDict: Record<string, any> = generateStats(totals);

    Object.keys(dataDict).forEach((key) => {
        let team1 = null;
        let team2 = null;
        if (key.includes("_")) [team1, team2] = key.split("_");
        else team1 = key;
        data.push({
            team1Name: team1 as TeamOption,
            team2Name: team2 as TeamOption,
            played:
                (dataDict[key].homePlayed ?? 0) +
                (dataDict[key].awayPlayed ?? 0),
            won: (dataDict[key].homeWon ?? 0) + (dataDict[key].awayWon ?? 0),
            lost:
                (dataDict[key].homePlayed ?? 0) +
                (dataDict[key].awayPlayed ?? 0) -
                (dataDict[key].homeWon ?? 0) -
                (dataDict[key].awayWon ?? 0),
            homePlayed: dataDict[key].homePlayed,
            awayPlayed: dataDict[key].awayPlayed,
            homeWon: dataDict[key].homeWon,
            awayWon: dataDict[key].awayWon,
            batFirstPlayed: dataDict[key].batFirstPlayed,
            batSecondPlayed: dataDict[key].batSecondPlayed,
            batFirstWon: dataDict[key].batFirstWon,
            batSecondWon: dataDict[key].batSecondWon,
        });
    });
    await db.delete(statsSchema.stats);
    await db.insert(statsSchema.stats).values(data);
    console.log("Stats Loaded");
};

const seedDB = async () => {
    if (!env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    let db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
    if (env.NODE_ENV === "production") {
        const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);
        db = drizzle(sql, { schema });
    } else {
        db = PostgresDrizzle(env.DATABASE_URL, { schema });
    }

    await loadTeams(db);
    await loadMatches(db);
    await loadHistory(db);
    await loadStats(db);
    console.log("✅ Seeding completed");

    process.exit(0);
};

seedDB().catch((err) => {
    console.error("❌ Seeding failed");
    console.error(err);
    process.exit(1);
});
