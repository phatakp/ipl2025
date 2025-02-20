"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";

import { StatsTableData } from "@/app/types";
import { PAGE_SIZE } from "@/lib/constants";

type StatsTableContextProps = {
    data: StatsTableData[];
    pageData: StatsTableData[];
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: () => void;
    prevPage: () => void;
    totalPages: number;
    page: number;
    start: number;
    end: number;
};

const StatsTableContext = createContext({} as StatsTableContextProps);

export default function StatsTableProvider({
    children,
    data,
}: PropsWithChildren & {
    data: StatsTableData[];
}) {
    const [page, setPage] = useState(1);
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const pageData = data?.slice(start, end);
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => prev - 1);

    return (
        <StatsTableContext.Provider
            value={{
                data,
                pageData,
                hasNext,
                hasPrev,
                nextPage,
                prevPage,
                totalPages,
                page,
                start,
                end,
            }}
        >
            {children}
        </StatsTableContext.Provider>
    );
}

export const useStatsTableContext = () => {
    const context = useContext(StatsTableContext);
    if (!context)
        throw Error("Stats Table Context should be used inside Provider");
    return context;
};
