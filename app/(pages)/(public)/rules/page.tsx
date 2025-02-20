import {
    PageHeader,
    PageHeaderGrid,
    PageHeaderHeading,
} from "@/components/features/shared/page-header";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function RulesPage() {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader>
                <PageHeaderGrid>
                    <PageHeaderHeading title="Game Rules" />
                </PageHeaderGrid>
            </PageHeader>
            <Accordion
                type="single"
                collapsible
                className="w-full bg-background"
            >
                <AccordionItem value="item-1" className="border-none py-4">
                    <AccordionTrigger className="rounded-sm bg-muted px-4 py-2 text-lg text-muted-foreground md:text-2xl">
                        REGISTRATION
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty py-4 font-karla">
                        <ol className="list-inside list-disc space-y-4 text-base">
                            <li>
                                Every player will need to predict the overall
                                IPL winner.
                            </li>
                            <li>
                                An automatic stake of Rs.500/- will be
                                applicable for the IPL Winner, to be settled
                                after final match.
                            </li>
                            <li>
                                Each player also to receive 5 double plays{" "}
                                <span className="underline underline-offset-2">
                                    (only for league phase)
                                </span>
                                .
                            </li>
                            <li>
                                Once a player registers, they need to complete
                                the whole tournament and settle dues (if any).
                            </li>

                            <li>
                                <span>
                                    A caution deposit of Rs.500/ has to be made
                                    to{" "}
                                    <span className="mr-2 underline underline-offset-2">
                                        9130469142 (PhonePe / GPay)
                                    </span>
                                    compulsorily before start of Match 1.
                                </span>
                            </li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-none py-4">
                    <AccordionTrigger className="rounded-sm bg-muted px-4 py-2 text-lg text-muted-foreground md:text-2xl">
                        PREDICTION
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty py-4 font-karla">
                        <ol className="list-inside list-disc space-y-4 text-base">
                            <li>
                                Prediction should be made atleast 30 mins before
                                start of each match.
                            </li>
                            <span className="my-2 italic text-muted-foreground underline">
                                Start of match will be as per schedule (and will
                                not change in case of any delays).
                            </span>
                            <li>
                                If you miss the cutoff for prediction, default
                                stake equivalent to min stake for the match will
                                be deducted from your account.
                            </li>
                            <li>
                                Minimum Stake is applicable for each match as
                                below.
                                <Table className="my-4">
                                    <TableCaption>
                                        Stakes can be increased in multiple of
                                        10
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="text-lg">
                                            <TableHead>Match type</TableHead>
                                            <TableHead className="text-right">
                                                Stake
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                League (First 35 matches)
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rs.30/-
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                League (Last 35 matches)
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rs.50/-
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Qualifiers/Eliminator
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rs.100/-
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Final
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rs.200/-
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </li>
                            <li>
                                Double can be played only after start of match
                                and up until 60 mins post start of match.
                            </li>

                            <li>
                                Only the first double request for a match will
                                be accepted. No override allowed.
                            </li>
                            <li>
                                If your double request is placed, the stake
                                amount will either be doubled or 10 more than
                                current highest stake for the match (whichever
                                is higher). This is auto-applied so you dont
                                have to change amount manually.
                            </li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-none py-4">
                    <AccordionTrigger className="rounded-sm bg-muted px-4 py-2 text-lg text-muted-foreground md:text-2xl">
                        CHANGES
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty py-4 font-karla">
                        <ol className="list-inside list-disc space-y-4 text-base">
                            <li>
                                Prediction can be changed as per below rule -
                                <Table className="mt-4">
                                    <TableCaption>
                                        Stakes can be increased / decreased in
                                        multiple of 10
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="text-lg">
                                            <TableHead>Change type</TableHead>
                                            <TableHead>Rule</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Increase of stake amount
                                            </TableCell>
                                            <TableCell>
                                                Allowed until start of match
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Reduction of stake amount
                                            </TableCell>
                                            <TableCell>
                                                Allowed until 30 mins prior to
                                                start of match
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Team Change
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    <li>
                                                        Until 30 mins prior to
                                                        start of match. -{" "}
                                                        <span className="font-semibold">
                                                            Free
                                                        </span>
                                                    </li>
                                                    <li>
                                                        From 30 mins prior to
                                                        until start of match -{" "}
                                                        <span className="font-semibold">
                                                            Stake amount to be
                                                            double.
                                                        </span>
                                                    </li>
                                                    <li>
                                                        After start of match -
                                                        <span className="font-semibold">
                                                            Not allowed.
                                                        </span>
                                                    </li>
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                IPL Winner Change
                                            </TableCell>
                                            <TableCell>
                                                Allowed until completion of
                                                Match 50.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-none py-4">
                    <AccordionTrigger className="rounded-sm bg-muted px-4 py-2 text-lg text-muted-foreground md:text-2xl">
                        SETTLEMENT
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty py-4 font-karla">
                        <ol className="list-inside list-disc space-y-4 text-base">
                            <li>
                                Settlement to be done as per below rules -
                                <Table className="my-4">
                                    <TableHeader>
                                        <TableRow className="text-lg">
                                            <TableHead>Stake</TableHead>
                                            <TableHead>Rule</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If lost (no double played)
                                            </TableCell>
                                            <TableCell>
                                                Stake amount to be debited from
                                                balance.
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If defaulted (no double played)
                                            </TableCell>
                                            <TableCell>
                                                Min Stake amount for match to be
                                                debited from balance
                                                (irrespective of match result).
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If won (no double played)
                                            </TableCell>
                                            <TableCell>
                                                Credit Amount = (Your Stake /
                                                Total Winning stake amount) x
                                                Total Losing stake amount
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If lost (double played)
                                            </TableCell>
                                            <TableCell>
                                                2 x Stake amount to be debited
                                                from balance.
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If defaulted (double played)
                                            </TableCell>
                                            <TableCell>
                                                2 x Min Stake amount for match
                                                to be debited from balance
                                                (irrespective of match result).
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                If won (double played)
                                            </TableCell>
                                            <TableCell>
                                                Credit Amount = Total Losing
                                                stake amount + ((Your Stake /
                                                Total Winning stake amount) x
                                                Total Losing stake amount)
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </li>

                            <li>
                                Below table shows sample calculations for CSK vs
                                SRH match -
                                <Table className="my-4">
                                    <TableCaption>
                                        In case no double is played
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="text-lg">
                                            <TableHead>Player</TableHead>
                                            <TableHead>Stake</TableHead>
                                            <TableHead className="text-right">
                                                If CSK Wins
                                            </TableHead>
                                            <TableHead className="text-right">
                                                If SRH Wins
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P1
                                            </TableCell>
                                            <TableCell>CSK 30</TableCell>
                                            <TableCell className="text-right text-success">
                                                +49.1
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -30
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P2
                                            </TableCell>
                                            <TableCell>CSK 50</TableCell>
                                            <TableCell className="text-right text-success">
                                                +81.8
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -50
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P3
                                            </TableCell>
                                            <TableCell>SRH 40</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -40
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +24.4
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P4
                                            </TableCell>
                                            <TableCell>CSK 30</TableCell>
                                            <TableCell className="text-right text-success">
                                                +49.1
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -30
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P5
                                            </TableCell>
                                            <TableCell>SRH 80</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -80
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +48.9
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P6
                                            </TableCell>
                                            <TableCell>SRH 60</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -60
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +36.7
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Table className="my-4">
                                    <TableCaption>
                                        When double is played
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="text-lg">
                                            <TableHead>Player</TableHead>
                                            <TableHead>Stake</TableHead>
                                            <TableHead className="text-right">
                                                If CSK Wins
                                            </TableHead>
                                            <TableHead className="text-right">
                                                If SRH Wins
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P1
                                            </TableCell>
                                            <TableCell>CSK 30</TableCell>
                                            <TableCell className="text-right text-success">
                                                +49.1
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -30
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="relative font-medium">
                                                P2
                                                <Badge
                                                    variant="success"
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 px-2 md:right-4"
                                                >
                                                    D
                                                </Badge>
                                            </TableCell>
                                            <TableCell>CSK 50</TableCell>
                                            <TableCell className="text-right text-success">
                                                +261.8
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -100
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P3
                                            </TableCell>
                                            <TableCell>SRH 40</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -80
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +35.6
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P4
                                            </TableCell>
                                            <TableCell>CSK 30</TableCell>
                                            <TableCell className="text-right text-success">
                                                +49.1
                                            </TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -30
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P5
                                            </TableCell>
                                            <TableCell>SRH 80</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -160
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +71.1
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-medium">
                                                P6
                                            </TableCell>
                                            <TableCell>SRH 60</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                -120
                                            </TableCell>
                                            <TableCell className="text-right text-success">
                                                +53.3
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <h1 className="mt-16 text-4xl font-extrabold">Play Bold !!</h1>
        </div>
    );
}
