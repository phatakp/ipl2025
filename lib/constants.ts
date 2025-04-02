export const PAGE_SIZE = 5;

export const QueryKeys = {
    ALL_USERS: "all_users",
    USER: "user",
    MATCH: "match",
    ALL_TEAMS: "all_teams",
    ALL_FIXTURES: "all_fixtures",
    ALL_RESULTS: "all_results",
    CURR_USER: "curr_user",
    USER_PRED: "user_pred",
    MATCH_PREDS: "match_preds",
    MATCH_PREDS_STATSS: "match_pred_statss",
    MATCH_PREDS_STATSC: "match_pred_statsc",
    COMPLETED_MATCHES: "completed_matches",
    COMPLETED_MATCH_PREDS: "completed_match_preds",
    MATCH_STATS: "match_stats",
    MAX_WON_AMT: "max_won_amt",
    MAX_LOST_AMT: "max_lost_amt",
    PRED_ACCURACY: "pred_accuracy",
};

export const SiteLinks = ["dashboard", "matches", "rules"];

export const TEAMS = [
    "CSK",
    "DC",
    "RR",
    "RCB",
    "MI",
    "SRH",
    "KKR",
    "LSG",
    "GT",
    "PBKS",
] as const;

export const PRED_STATUS = [
    "won",
    "lost",
    "no_result",
    "placed",
    "default",
] as const;

export const MATCH_STATUS = ["scheduled", "completed", "abandoned"] as const;
export const MATCH_RESULT_TYPE = ["runs", "wickets", "superover"] as const;

//Profile Routes
export const ProfileRoutes = {
    CURR_PROFILE: "/profiles/me",
    UPSERT_PROFILE: "/profiles",
    GET_PROFILES: "/profiles",
};

//Team Routes
export const TeamRoutes = {
    SHORT_TEAMS: "/teams/short",
    GET_TEAMS: "/teams",
};
