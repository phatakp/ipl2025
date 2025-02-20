import { getAllFixtures } from "@/actions/match.actions";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import MatchCarouselCard from "./match-carousel-card";

export default async function MatchCarousel() {
    const [fixtures] = await getAllFixtures();

    return (
        <div className="flex flex-col gap-4">
            <span className="title whitespace-break-spaces text-2xl font-semibold uppercase">
                Fixtures
            </span>
            <Carousel>
                <CarouselContent>
                    {fixtures?.map((match) => {
                        return (
                            <CarouselItem
                                key={match.num}
                                className="basis-1/1 sm:basis-1/2 md:basis-1/3"
                            >
                                <MatchCarouselCard match={match} />
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="left-4 top-full translate-y-1" />
                <CarouselNext className="right-4 top-full translate-y-1" />
            </Carousel>
        </div>
    );
}
