"use client";

import { ReactNode, useMemo, useState } from "react";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

type Tab = {
    id: number;
    label: string;
    content: ReactNode;
    onChange?: () => void;
};

interface TabsProps {
    tabs: Tab[];
    className?: string;
    rounded?: string;
}

export const Tabs = ({ tabs, className }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [ref, bounds] = useMeasure();

    const currentTab = useMemo(() => {
        return tabs.find((tab) => tab.id === activeTab);
    }, [activeTab, tabs]);

    const handleTabClick = (newTabId: number) => {
        if (newTabId !== activeTab && !isAnimating) {
            const newDirection = newTabId > activeTab ? 1 : -1;
            setDirection(newDirection);
            setActiveTab(newTabId);
            if (currentTab?.onChange) currentTab.onChange();
        }
    };

    const variants = {
        initial: (direction: number) => ({
            x: 300 * direction,
            opacity: 0,
            filter: "blur(4px)",
        }),
        active: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
        },
        exit: (direction: number) => ({
            x: -300 * direction,
            opacity: 0,
            filter: "blur(4px)",
        }),
    };

    return (
        <div className="relative flex w-full flex-col items-center">
            <div
                className={cn(
                    "shadow-inner-shadow sticky flex cursor-pointer space-x-1 rounded-t-lg border border-b-0 bg-card p-2",
                    className
                )}
            >
                {tabs.map((tab) => {
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                "relative flex w-full items-center justify-center px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-1 sm:text-base"
                            )}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                            {activeTab === tab.id && (
                                <motion.span
                                    layoutId="bubble"
                                    className="shadow-inner-shadow absolute inset-0 z-10 rounded-sm border bg-card mix-blend-difference"
                                    transition={{
                                        type: "spring",
                                        bounce: 0.19,
                                        duration: 0.4,
                                    }}
                                />
                            )}

                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <MotionConfig
                transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}
            >
                <motion.div
                    className="relative mx-auto h-full w-full overflow-hidden"
                    initial={false}
                    animate={{ height: bounds.height }}
                >
                    <div className="p-1" ref={ref}>
                        <AnimatePresence
                            custom={direction}
                            mode="popLayout"
                            onExitComplete={() => setIsAnimating(false)}
                        >
                            <motion.div
                                key={activeTab}
                                variants={variants}
                                initial="initial"
                                animate="active"
                                exit="exit"
                                custom={direction}
                                onAnimationStart={() => setIsAnimating(true)}
                                onAnimationComplete={() =>
                                    setIsAnimating(false)
                                }
                            >
                                {currentTab?.content}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </MotionConfig>
        </div>
    );
};
