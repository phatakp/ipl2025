import TeamStandings from "@/components/features/team/team-standings";
import {
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselItem,
} from "@/components/ui/carousel";

import PlayerStandings from "./player-standings";
import UserPredictions from "./user-predictions";

export default function DashboardStatsCarousel() {
    return (
        <div>
            <Carousel>
                <CarouselContent className="mb-4">
                    <CarouselItem className="basis-1/1 sm:basis-1/2 md:basis-1/3">
                        <PlayerStandings />
                    </CarouselItem>
                    <CarouselItem className="basis-1/1 sm:basis-1/2 md:basis-1/3">
                        <TeamStandings />
                    </CarouselItem>
                    <CarouselItem className="basis-1/1 sm:basis-1/2 md:basis-1/3">
                        <UserPredictions />
                    </CarouselItem>
                </CarouselContent>
                {/* <CarouselNavigation /> */}
                <CarouselIndicator className="absolute left-auto w-full justify-center gap-2" />
            </Carousel>
        </div>
    );
}
