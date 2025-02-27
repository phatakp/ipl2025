"use client";

import { PropsWithChildren, createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { CompletePred, MatchWithTeams } from "@/app/types";
import { QueryKeys } from "@/lib/constants";

type MatchContextProps = {
    match: MatchWithTeams;
    pred?: CompletePred;
};

const MatchContext = createContext<MatchContextProps>({} as MatchContextProps);

export default function MatchProvider({
    children,
    match,
}: PropsWithChildren & { match: MatchWithTeams }) {
    const { data } = useQuery({
        queryKey: [QueryKeys.USER_PRED, match.num],
        queryFn: async () =>
            await getUserPredictionForMatch({ num: match.num }),
    });

    const pred = data?.[0]?.status === "placed" ? data[0] : undefined;

    return (
        <MatchContext.Provider value={{ pred, match }}>
            {children}
        </MatchContext.Provider>
    );
}

export const useMatchContext = () => {
    const context = useContext(MatchContext);
    if (!context) throw new Error("Match Context not used!");
    return context;
};
