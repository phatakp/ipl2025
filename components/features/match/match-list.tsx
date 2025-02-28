"use client";

import { useState } from "react";

import { format } from "date-fns";
import { motion } from "motion/react";

import { MatchListType } from "@/app/types";
import MatchListCard from "@/components/features/match/match-list-card";
import { AnimatedList } from "@/components/features/shared/animated-list";
import { useMatchListContext } from "@/components/providers/match-list.context";
import { Button, buttonVariants } from "@/components/ui/button";
import { TransitionPanel } from "@/components/ui/transition-panel";
import { cn } from "@/lib/utils";

export default function MatchList() {
    const { setType, fixtures, results, loadMore, limit, reset } =
        useMatchListContext();
    const fMatches = Object.groupBy(fixtures, ({ date }) =>
        format(date, "PPP")
    );
    const rMatches = Object.groupBy(results, ({ date }) => format(date, "PPP"));
    const [activeIndex, setActiveIndex] = useState(0);

    const ITEMS = [
        {
            title: "FIXTURES",
            content: (
                <div
                    className={cn(
                        "relative mt-8 flex h-full w-full flex-col space-y-8 overflow-hidden md:shadow-xl"
                    )}
                >
                    <AnimatedList>
                        {fixtures.length === 0 && <div>No Matches yet.</div>}
                        {Object.entries(fMatches).map(([date, dMatches]) => (
                            <MatchListCard
                                date={date}
                                matches={dMatches ?? []}
                                key={date}
                            />
                        ))}
                    </AnimatedList>
                    {fixtures.length > 0 && limit < fixtures[0].total && (
                        <Button className="uppercase" onClick={loadMore}>
                            Load More
                        </Button>
                    )}
                </div>
            ),
        },
        {
            title: "RESULTS",
            content: (
                <div
                    className={cn(
                        "relative mt-8 flex h-full w-full flex-col space-y-8 overflow-hidden md:shadow-xl"
                    )}
                >
                    <AnimatedList>
                        {results.length === 0 && (
                            <div>No Completed Matches yet.</div>
                        )}
                        {Object.entries(rMatches).map(([date, dMatches]) => (
                            <MatchListCard
                                date={date}
                                matches={dMatches ?? []}
                                key={date}
                            />
                        ))}
                    </AnimatedList>
                    {results.length > 0 && limit < results[0].total && (
                        <Button className="uppercase" onClick={loadMore}>
                            Load More
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="mx-auto mt-4 flex w-fit space-x-2 rounded-lg bg-secondary p-2">
                {ITEMS.map((item, index) => (
                    <motion.button
                        key={index}
                        onClick={() => {
                            setType(item.title.toLowerCase() as MatchListType);
                            reset();
                            setActiveIndex(index);
                        }}
                        className={cn(
                            buttonVariants({
                                variant:
                                    activeIndex === index ? "default" : "ghost",
                                size: "sm",
                            }),
                            "relative transition"
                        )}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {activeIndex === index && (
                            <motion.span
                                layoutId="bubble"
                                className="absolute inset-0 z-10 bg-primary text-primary-foreground"
                                style={{ borderRadius: 9999 }}
                                transition={{
                                    type: "spring",
                                    bounce: 0.2,
                                    duration: 0.6,
                                }}
                            />
                        )}
                        <span className="z-20">{item.title}</span>
                    </motion.button>
                ))}
            </div>
            <div className="mb-4 overflow-hidden">
                <TransitionPanel
                    activeIndex={activeIndex}
                    transition={{
                        ease: "easeInOut",
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.3,
                    }}
                    variants={{
                        enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                        center: { opacity: 1, y: 0, filter: "blur(0px)" },
                        exit: { opacity: 0, y: 50, filter: "blur(4px)" },
                    }}
                >
                    {ITEMS.map((item, index) => (
                        <div key={index}>{item.content}</div>
                    ))}
                </TransitionPanel>
            </div>
        </>
    );
}
