"use client";

import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getAllFixtures, getAllResults } from "@/actions/match.actions";
import { MatchListType, MatchWithTeams } from "@/app/types";

type MatchListContextProps = {
    type: MatchListType;
    setType: Dispatch<SetStateAction<MatchListType>>;
    fixtures: MatchWithTeams[];
    results: MatchWithTeams[];
    limit: number;
    isLoading: boolean;
    loadMore: () => void;
    reset: () => void;
};

const MatchListContext = createContext<MatchListContextProps>(
    {} as MatchListContextProps
);
export default function MatchListProvider({ children }: PropsWithChildren) {
    const [fixtures, setFixtures] = useState<MatchWithTeams[]>([]);
    const [results, setResults] = useState<MatchWithTeams[]>([]);
    const [type, setType] = useState<MatchListType>("fixtures");
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const loadMore = () => setLimit((prev) => prev + 10);
    const reset = () => setLimit(10);

    useEffect(() => {
        setIsLoading(true);
        async function fetch() {
            if (type === "fixtures") {
                const [data] = await getAllFixtures(limit);
                setFixtures(data ?? []);
            } else {
                const [data] = await getAllResults(limit);
                setResults(data ?? []);
            }
        }
        fetch();
        setIsLoading(false);
    }, [limit, type]);

    return (
        <MatchListContext.Provider
            value={{
                fixtures,
                results,
                type,
                setType,
                limit,
                reset,
                loadMore,
                isLoading,
            }}
        >
            {children}
        </MatchListContext.Provider>
    );
}

export const useMatchListContext = () => useContext(MatchListContext);
