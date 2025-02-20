import { type ClassValue, clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { HistTotalsReturn } from "@/app/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const timestamps: { createdAt: true; updatedAt: true } = {
    createdAt: true,
    updatedAt: true,
};

export const createEnumObject = <T extends readonly [string, ...string[]]>(
    values: T
): Record<T[number], T[number]> => {
    const obj: Record<string, T[number]> = {};
    for (const value of values) {
        obj[value] = value;
    }
    return obj;
};

// export const getWon = (match: HistTotalsReturn, team: TeamOption) =>
//     match.winner === team ? match.count : 0;

// export const getLost = (match: HistTotalsReturn, team: TeamOption) =>
//     match.winner !== team ? match.count : 0;

// export const getHomePlayed = (match: HistTotalsReturn, team: TeamOption) =>
//     match.team1 === team ? match.count : 0;

// export const getHomeWon = (match: HistTotalsReturn, team: TeamOption) =>
//     match.team1 === team && match.winner === team ? match.count : 0;

// export const getAwayPlayed = (match: HistTotalsReturn, team: TeamOption) =>
//     match.team2 === team ? match.count : 0;

// export const getAwayWon = (match: HistTotalsReturn, team: TeamOption) =>
//     match.team2 === team && match.winner === team ? match.count : 0;

// export const getBatFirstPlayed = (match: HistTotalsReturn, team: TeamOption) =>
//     (match.type === "runs" && match.winner === team) ||
//     (match.type === "wickets" && match.winner !== team)
//         ? match.count
//         : 0;

// export const getBatFirstWon = (match: HistTotalsReturn, team: TeamOption) =>
//     match.type === "runs" && match.winner === team ? match.count : 0;

// export const getBatSecondPlayed = (
//     match: HistTotalsReturn,
//     team: TeamOption
// ) =>
//     (match.type === "runs" && match.winner !== team) ||
//     (match.type === "wickets" && match.winner === team)
//         ? match.count
//         : 0;

// export const getBatSecondWon = (match: HistTotalsReturn, team: TeamOption) =>
//     match.type === "wickets" && match.winner === team ? match.count : 0;

export const objectToDb = (item: unknown): unknown => {
    if (Array.isArray(item)) {
        return item.map((el: unknown) => objectToDb(el));
    } else if (typeof item === "function" || item !== Object(item)) {
        return item;
    }
    return Object.fromEntries(
        Object.entries(item as Record<string, unknown>).map(
            ([key, value]: [string, unknown]) => [
                key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
                objectToDb(value),
            ]
        )
    );
};

export const dbToObject = (item: unknown): unknown => {
    if (Array.isArray(item)) {
        return item.map((el: unknown) => dbToObject(el));
    } else if (typeof item === "function" || item !== Object(item)) {
        return item;
    }
    return Object.fromEntries(
        Object.entries(item as Record<string, unknown>).map(
            ([key, value]: [string, unknown]) => [
                key.replace(/([-_][a-z])/gi, (c) =>
                    c.toUpperCase().replace(/[-_]/g, "")
                ),
                dbToObject(value),
            ]
        )
    );
};

export const getISTDate = (dt_str: string, offset: number = 0) =>
    new Date(
        new Date(dt_str).getTime() +
            (330 + offset + new Date(dt_str).getTimezoneOffset()) * 60000
    );

export const getCurrentISTDate = () =>
    new Date(
        new Date().getTime() + (330 + new Date().getTimezoneOffset()) * 60000
    );

export const errorToast = (title: string, message: string) => {
    toast.error(title, {
        description: message,
        style: {
            background: "hsl(var(--destructive))",
            color: "hsl(var(--destructive-foreground))",
        },
    });
};

export const successToast = (message: string) => {
    toast.success("Success", {
        description: message,
        style: {
            background: "hsl(var(--success))",
            color: "hsl(var(--success-foreground))",
        },
    });
};

export const generateStats = (totals: HistTotalsReturn[]) => {
    let grouped: Record<string, any> = {};
    for (let item of totals) {
        let { team1, team2, winner, type, count } = item;
        if (team1 in grouped) {
            grouped[team1] = {
                ...grouped[team1],
                homePlayed: (grouped[team1].homePlayed ?? 0) + count,
                homeWon:
                    team1 === winner
                        ? (grouped[team1].homeWon ?? 0) + count
                        : (grouped[team1].homeWon ?? 0),
                batFirstPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? (grouped[team1].batFirstPlayed ?? 0) + count
                        : (grouped[team1].batFirstPlayed ?? 0),
                batFirstWon:
                    type === "runs" && winner === team1
                        ? (grouped[team1].batFirstWon ?? 0) + count
                        : (grouped[team1].batFirstWon ?? 0),
                batSecondPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? (grouped[team1].batSecondPlayed ?? 0) + count
                        : (grouped[team1].batSecondPlayed ?? 0),
                batSecondWon:
                    type === "wickets" && winner === team1
                        ? (grouped[team1].batSecondWon ?? 0) + count
                        : (grouped[team1].batSecondWon ?? 0),
            };
        } else
            grouped[team1] = {
                homePlayed: count,
                homeWon: team1 === winner ? count : 0,
                batFirstPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? count
                        : 0,
                batFirstWon: type === "runs" && winner === team1 ? count : 0,
                batSecondPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? count
                        : 0,
                batSecondWon:
                    type === "wickets" && winner === team1 ? count : 0,
            };
        if (team2 in grouped) {
            grouped[team2] = {
                ...grouped[team2],
                awayPlayed: (grouped[team2].awayPlayed ?? 0) + count,
                awayWon:
                    team2 === winner
                        ? (grouped[team2].awayWon ?? 0) + count
                        : (grouped[team2].awayWon ?? 0),
                batFirstPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? (grouped[team2].batFirstPlayed ?? 0) + count
                        : (grouped[team2].batFirstPlayed ?? 0),
                batFirstWon:
                    type === "runs" && winner === team2
                        ? (grouped[team2].batFirstWon ?? 0) + count
                        : (grouped[team2].batFirstWon ?? 0),
                batSecondPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? (grouped[team2].batSecondPlayed ?? 0) + count
                        : (grouped[team2].batSecondPlayed ?? 0),
                batSecondWon:
                    type === "wickets" && winner === team2
                        ? (grouped[team2].batSecondWon ?? 0) + count
                        : (grouped[team2].batSecondWon ?? 0),
            };
        } else
            grouped[team2] = {
                awayPlayed: item.count,
                awayWon: team2 === winner ? item.count : 0,
                batFirstPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? count
                        : 0,
                batFirstWon: type === "runs" && winner === team2 ? count : 0,
                batSecondPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? count
                        : 0,
                batSecondWon:
                    type === "wickets" && winner === team2 ? count : 0,
            };

        if (`${team1}_${team2}` in grouped) {
            grouped[`${team1}_${team2}`] = {
                ...grouped[`${team1}_${team2}`],
                homePlayed:
                    (grouped[`${team1}_${team2}`].homePlayed ?? 0) + count,
                homeWon:
                    team1 === winner
                        ? (grouped[`${team1}_${team2}`].homeWon ?? 0) + count
                        : (grouped[`${team1}_${team2}`].homeWon ?? 0),
                batFirstPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? (grouped[`${team1}_${team2}`].batFirstPlayed ?? 0) +
                          count
                        : (grouped[`${team1}_${team2}`].batFirstPlayed ?? 0),
                batFirstWon:
                    type === "runs" && winner === team1
                        ? (grouped[`${team1}_${team2}`].batFirstWon ?? 0) +
                          count
                        : (grouped[`${team1}_${team2}`].batFirstWon ?? 0),
                batSecondPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? (grouped[`${team1}_${team2}`].batSecondPlayed ?? 0) +
                          count
                        : (grouped[`${team1}_${team2}`].batSecondPlayed ?? 0),
                batSecondWon:
                    type === "wickets" && winner === team1
                        ? (grouped[`${team1}_${team2}`].batSecondWon ?? 0) +
                          count
                        : (grouped[`${team1}_${team2}`].batSecondWon ?? 0),
            };
        } else {
            grouped[`${team1}_${team2}`] = {
                homePlayed: count,
                homeWon: team1 === winner ? count : 0,
                batFirstPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? count
                        : 0,
                batFirstWon: type === "runs" && winner === team1 ? count : 0,
                batSecondPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? count
                        : 0,
                batSecondWon:
                    type === "wickets" && winner === team1 ? count : 0,
            };
        }

        if (`${team2}_${team1}` in grouped) {
            grouped[`${team2}_${team1}`] = {
                ...grouped[`${team2}_${team1}`],
                awayPlayed:
                    (grouped[`${team2}_${team1}`].awayPlayed ?? 0) + count,
                awayWon:
                    team2 === winner
                        ? (grouped[`${team2}_${team1}`].awayWon ?? 0) + count
                        : (grouped[`${team2}_${team1}`].awayWon ?? 0),
                batFirstPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? (grouped[`${team2}_${team1}`].batFirstPlayed ?? 0) +
                          count
                        : (grouped[`${team2}_${team1}`].batFirstPlayed ?? 0),
                batFirstWon:
                    type === "runs" && winner === team2
                        ? (grouped[`${team2}_${team1}`].batFirstWon ?? 0) +
                          count
                        : (grouped[`${team2}_${team1}`].batFirstWon ?? 0),
                batSecondPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? (grouped[`${team2}_${team1}`].batSecondPlayed ?? 0) +
                          count
                        : (grouped[`${team2}_${team1}`].batSecondPlayed ?? 0),
                batSecondWon:
                    type === "wickets" && winner === team2
                        ? (grouped[`${team2}_${team1}`].batSecondWon ?? 0) +
                          count
                        : (grouped[`${team2}_${team1}`].batSecondWon ?? 0),
            };
        } else {
            grouped[`${team2}_${team1}`] = {
                awayPlayed: count,
                awayWon: team2 === winner ? count : 0,
                batFirstPlayed:
                    (type === "runs" && winner === team2) ||
                    (type === "wickets" && winner === team1)
                        ? count
                        : 0,
                batFirstWon: type === "runs" && winner === team2 ? count : 0,
                batSecondPlayed:
                    (type === "runs" && winner === team1) ||
                    (type === "wickets" && winner === team2)
                        ? count
                        : 0,
                batSecondWon:
                    type === "wickets" && winner === team2 ? count : 0,
            };
        }
    }
    return grouped;
};
