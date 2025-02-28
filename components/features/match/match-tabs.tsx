"use client";

import { useState } from "react";

import { motion } from "motion/react";

import { MatchWithTeams } from "@/app/types";
import StatsProvider from "@/components/providers/stats.context";
import { buttonVariants } from "@/components/ui/button";
import { TransitionPanel } from "@/components/ui/transition-panel";
import { cn } from "@/lib/utils";

import MatchPredictions from "./match-predictions";
import MatchStats from "./match-stats";

type Props = {
    match: MatchWithTeams;
};

export default function MatchTabs({ match }: Props) {
    const [activeIndex, setActiveIndex] = useState(
        match.status === "scheduled" ? 0 : 1
    );

    const ITEMS = [
        {
            title: "STATS",
            content: (
                <StatsProvider match={match}>
                    <MatchStats asModal />
                </StatsProvider>
            ),
        },
        {
            title: "PREDICTIONS",
            content: <MatchPredictions match={match} />,
        },
    ];

    return (
        <>
            <div className="mt-4 flex w-fit space-x-2 rounded-lg bg-secondary p-2">
                {ITEMS.map((item, index) => (
                    <motion.button
                        key={index}
                        onClick={() => setActiveIndex(index)}
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

    // return (
    //     <Tabs defaultValue="stats" className="mt-4 w-full">
    //         <TabsList>
    //             <TabsTrigger value="stats" className="uppercase">
    //                 Stats
    //             </TabsTrigger>
    //             <TabsTrigger value="predictions" className="uppercase">
    //                 Predictions
    //             </TabsTrigger>
    //         </TabsList>
    //         <TabsContent value="stats">
    //             <StatsProvider match={match}>
    //                 <MatchStats asModal={asModal} />
    //             </StatsProvider>
    //         </TabsContent>
    //         <TabsContent value="predictions">
    //             <MatchPredictions match={match} />
    //         </TabsContent>
    //     </Tabs>
    // );
}
