"use client";

import { ReactNode } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import TeamLogo from "@/components/features/team/team-logo";
import { useStatsTableContext } from "@/components/providers/stats-table.context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PAGE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { AnimatedList } from "./animated-list";

type Props = {
    title: string;
    action?: ReactNode;
};

const classes = [
    "bg-CSK",
    "bg-GT",
    "bg-MI",
    "bg-RR",
    "bg-RCB",
    "bg-LSG",
    "bg-KKR",
    "bg-SRH",
    "bg-PBKS",
    "bg-DC",
    "text-CSK",
    "text-GT",
    "text-MI",
    "text-RR",
    "text-RCB",
    "text-LSG",
    "text-KKR",
    "text-SRH",
    "text-PBKS",
    "text-DC",
    "bg-CSK-foreground",
    "bg-GT-foreground",
    "bg-MI-foreground",
    "bg-RR-foreground",
    "bg-RCB-foreground",
    "bg-LSG-foreground",
    "bg-KKR-foreground",
    "bg-SRH-foreground",
    "bg-PBKS-foreground",
    "bg-DC-foreground",
    "text-CSK-foreground",
    "text-GT-foreground",
    "text-MI-foreground",
    "text-RR-foreground",
    "text-RCB-foreground",
    "text-LSG-foreground",
    "text-KKR-foreground",
    "text-SRH-foreground",
    "text-PBKS-foreground",
    "text-DC-foreground",
];

export default function StatsTable({ title, action }: Props) {
    const {
        data,
        page,
        totalPages,
        pageData,
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        start,
    } = useStatsTableContext();
    if (data.length === 0) return;
    const top = data[0];
    const rest = page === 1 ? pageData.slice(1) : pageData;
    const nums = PAGE_SIZE - rest.length - 1;

    return (
        <div className="flex w-[320px] flex-col gap-8 sm:w-[400px]">
            <div className="flex flex-col items-center gap-2">
                <span className="title whitespace-break-spaces text-2xl font-semibold uppercase">
                    {title}
                </span>
                {action}
            </div>
            <Card className="w-full rounded-none rounded-t-lg">
                <CardHeader
                    className={`relative h-full rounded-none rounded-t-lg bg-${String(top.team)}`}
                >
                    <TeamLogo
                        teamName={top.team}
                        className="absolute right-4 top-1/2 size-32 -translate-y-1/2"
                        simple
                    />
                    <div
                        className={`flex flex-col font-semibold uppercase text-${String(top.team)}-foreground`}
                    >
                        <span className="text-sm font-bold">1</span>
                        <CardDescription
                            className={`uppercase text-${String(top.team)}-foreground`}
                        >
                            {top.name1}
                        </CardDescription>
                        <CardTitle className="w-full flex-nowrap truncate text-xl font-extrabold uppercase">
                            {top.name2}
                        </CardTitle>
                        {top.extra}
                        <span className="mt-4 text-4xl">{top.value}</span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid w-full divide-y">
                        <AnimatedList>
                            {rest.map((item, i) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 items-center gap-x-2 border-b px-4 py-2"
                                >
                                    <span className="col-span-1">
                                        {page === 1
                                            ? start + i + 2
                                            : start + i + 1}
                                    </span>
                                    <TeamLogo
                                        teamName={item.team}
                                        className="col-span-2 size-8"
                                        simple
                                    />
                                    <div
                                        className={cn(
                                            "col-span-6 flex flex-col"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex",
                                                item.extra
                                                    ? "flex-row items-center gap-2"
                                                    : "flex-col"
                                            )}
                                        >
                                            <span className="text-sm font-thin uppercase">
                                                {item.name1}
                                            </span>
                                            <span
                                                className={cn(
                                                    "w-full flex-nowrap truncate text-sm uppercase",
                                                    !item.extra &&
                                                        "text-xs text-muted-foreground"
                                                )}
                                            >
                                                {item.name2}
                                            </span>
                                        </div>

                                        {item.extra}
                                    </div>
                                    <span className="col-span-3 text-right">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                            {nums > 0 &&
                                Array.from(Array(nums).keys()).map((i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-12 items-center gap-x-2 border-b px-4 py-2"
                                    >
                                        <span className="col-span-1">
                                            {start + rest.length + i + 2}
                                        </span>
                                        <TeamLogo
                                            teamName={undefined}
                                            className="col-span-2 size-8"
                                            simple
                                        />
                                        <div className="col-span-6 flex flex-col">
                                            <span className="text-sm font-thin uppercase">
                                                {"X-X-X"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {"O-O-O-O"}
                                            </span>
                                        </div>
                                        <span className="col-span-3 text-right">
                                            0
                                        </span>
                                    </div>
                                ))}
                        </AnimatedList>
                    </div>
                </CardContent>
                <CardFooter className="p-0">
                    <div className="flex h-10 w-full items-center justify-between bg-secondary">
                        {totalPages > 1 && (
                            <>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    disabled={!hasPrev}
                                    onClick={prevPage}
                                    className="rounded-none"
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <span className="font-karla text-sm">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    disabled={!hasNext}
                                    onClick={nextPage}
                                    className="rounded-none"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
