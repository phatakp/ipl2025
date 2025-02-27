import { add, format } from "date-fns";

import { MatchWithTeams } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import TeamLogo from "../team/team-logo";
import MatchModal from "./match-modal";

type Props = {
    date: string;
    matches: MatchWithTeams[];
};

const classes = [
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

export default function MatchListCard({ matches, date }: Props) {
    return (
        <div
            className={cn(
                "container relative mx-auto my-4 min-h-fit w-full overflow-hidden bg-card p-4",
                "transform-gpu bg-transparent backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_10px_50px_10px_#ffffff1f_inset]"
            )}
        >
            <Badge className="absolute left-1/2 top-0 h-6 -translate-x-1/2 rounded-t-none font-karla">
                {date}
            </Badge>
            <div className="mt-8 flex flex-col gap-4">
                {matches.map((match) => {
                    const istDate = add(match.date, { hours: 5, minutes: 30 });
                    return (
                        <MatchModal match={match} key={match.num}>
                            <div className="group flex w-full cursor-pointer items-center gap-4 py-1 transition-all duration-200 ease-in-out hover:scale-[103%] hover:bg-primary hover:text-primary-foreground">
                                <div className="flex w-full flex-grow items-center justify-end gap-2 md:gap-4">
                                    <span
                                        className={`hidden text-base uppercase md:flex`}
                                    >
                                        {match.team1?.longName ?? "TBD"}
                                    </span>
                                    <span className={`font-semibold md:hidden`}>
                                        {match.team1Name}
                                    </span>
                                    <TeamLogo
                                        teamName={match.team1Name ?? undefined}
                                        className="size-10"
                                    />
                                </div>
                                <Badge
                                    className="min-w-fit whitespace-nowrap font-karla group-hover:bg-primary group-hover:text-primary-foreground"
                                    variant={"outline"}
                                >
                                    {format(istDate, "p")} IST
                                </Badge>
                                <div className="flex w-full flex-grow items-center gap-2 md:gap-4">
                                    <TeamLogo
                                        teamName={match.team2Name ?? undefined}
                                        className="size-10"
                                    />
                                    <span
                                        className={`hidden text-base uppercase md:flex`}
                                    >
                                        {match.team2?.longName ?? "TBD"}
                                    </span>
                                    <span className={`font-semibold md:hidden`}>
                                        {match.team2Name}
                                    </span>
                                </div>
                            </div>
                        </MatchModal>
                    );
                    // return (
                    //     <Accordion
                    //         id={`id-${match.num}`}
                    //         key={match.num.toString()}
                    //         type="single"
                    //         collapsible
                    //     >
                    //         <AccordionItem
                    //             value={match.num.toString()}
                    //             className="group transition-all duration-200 ease-in-out hover:scale-[103%] [&[data-state=closed]]:hover:bg-primary [&[data-state=closed]]:hover:text-primary-foreground"
                    //         >
                    //             <AccordionTrigger className="py-1 hover:no-underline">
                    //                 <div className="flex w-full items-center gap-4">
                    //                     <div className="flex w-full flex-grow items-center justify-end gap-2 md:gap-4">
                    //                         <span
                    //                             className={`hidden text-base uppercase md:flex`}
                    //                         >
                    //                             {match.team1?.longName ?? "TBD"}
                    //                         </span>
                    //                         <span
                    //                             className={`font-semibold md:hidden`}
                    //                         >
                    //                             {match.team1Name}
                    //                         </span>
                    //                         <TeamLogo
                    //                             teamName={
                    //                                 match.team1Name ?? undefined
                    //                             }
                    //                             className="size-10"
                    //                         />
                    //                     </div>
                    //                     <Badge
                    //                         className="min-w-fit whitespace-nowrap font-karla group-hover:bg-primary group-hover:text-primary-foreground"
                    //                         variant={"outline"}
                    //                     >
                    //                         {format(istDate, "p")} IST
                    //                     </Badge>
                    //                     <div className="flex w-full flex-grow items-center gap-2 md:gap-4">
                    //                         <TeamLogo
                    //                             teamName={
                    //                                 match.team2Name ?? undefined
                    //                             }
                    //                             className="size-10"
                    //                         />
                    //                         <span
                    //                             className={`hidden text-base uppercase md:flex`}
                    //                         >
                    //                             {match.team2?.longName ?? "TBD"}
                    //                         </span>
                    //                         <span
                    //                             className={`font-semibold md:hidden`}
                    //                         >
                    //                             {match.team2Name}
                    //                         </span>
                    //                     </div>
                    //                 </div>
                    //             </AccordionTrigger>
                    //             <AccordionContent>
                    //                 <div className="flex w-full flex-col items-center gap-2 py-4">
                    //                     <div className="uppercase">
                    //                         {match.type === "league"
                    //                             ? `Match No ${match.num}`
                    //                             : match.type}
                    //                     </div>
                    //                     <div className="mb-4 w-fit justify-center truncate font-karla">
                    //                         {match.venue}
                    //                     </div>
                    //                     <MatchTabs match={match} />
                    //                 </div>
                    //             </AccordionContent>
                    //         </AccordionItem>
                    //     </Accordion>
                    // );
                })}
            </div>
        </div>
    );
}
