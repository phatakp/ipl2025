export const PAGE_SIZE = 5;

export const QueryKeys = {
    ALL_TEAMS: "all_teams",
    ALL_FIXTURES: "all_fixtures",
    ALL_RESULTS: "all_results",
    CURR_USER: "curr_user",
    USER_PRED: "user_pred",
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
