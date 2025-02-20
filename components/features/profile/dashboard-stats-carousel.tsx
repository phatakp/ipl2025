import TeamStandings from "@/components/features/team/team-standings";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import PlayerStandings from "./player-standings";
import UserPredictions from "./user-predictions";

export default function DashboardStatsCarousel() {
    return (
        <div>
            <Carousel>
                <CarouselContent>
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
                <CarouselPrevious className="left-4 top-full translate-y-1" />
                <CarouselNext className="right-4 top-full translate-y-1" />
            </Carousel>
        </div>
    );
}
