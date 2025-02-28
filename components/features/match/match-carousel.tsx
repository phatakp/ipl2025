"use client";

import { MatchWithTeams } from "@/app/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselItem,
} from "@/components/ui/carousel";

import MatchModal, {
    MatchResult,
    MatchTeamScore,
    MatchTitle,
} from "./match-modal";

type Props = {
    type: "fixtures" | "results";
    matches: MatchWithTeams[];
};
export default function MatchCarousel({ type, matches }: Props) {
    if (matches.length === 0) return;

    return (
        <div className="relative flex w-full flex-col gap-4">
            <span className="title whitespace-break-spaces text-center text-2xl font-semibold uppercase">
                {type}
            </span>
            <Carousel>
                <CarouselContent className="mb-4">
                    {matches?.map((match) => {
                        return (
                            <CarouselItem
                                key={match.num}
                                className="basis-1/1 sm:basis-1/2 md:basis-1/3"
                            >
                                <MatchModal match={match}>
                                    <Card className="w-[320px] cursor-pointer transition-all duration-300 ease-in-out hover:border-4 sm:w-[400px]">
                                        <CardHeader>
                                            <CardTitle>
                                                <MatchTitle />
                                            </CardTitle>
                                            <CardDescription className="truncate text-[8px] uppercase">
                                                {match.venue}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <MatchTeamScore team={1} />
                                            <MatchTeamScore team={2} />
                                            <MatchResult className="mt-4" />
                                        </CardContent>
                                    </Card>
                                </MatchModal>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                {/* <CarouselNavigation /> */}
                {/* <CarouselNavigation
                    className="absolute -bottom-14 left-0 top-auto w-full justify-center gap-2"
                    alwaysShow
                /> */}
                <CarouselIndicator className="absolute left-auto w-full justify-center gap-2" />
            </Carousel>
        </div>
    );
}
