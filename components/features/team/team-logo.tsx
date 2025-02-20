import Image from "next/image";

import { TeamOption } from "@/app/types";
import { cn } from "@/lib/utils";

type Props = {
    teamName: TeamOption | undefined;
    className?: string;
    simple?: boolean;
};

export default function TeamLogo({ teamName, className, simple }: Props) {
    const src = simple
        ? `/logos/simple/${String(teamName)}.png`
        : `/logos/circle/${String(teamName)}.png`;

    return (
        <Image
            src={src}
            alt="team-logo"
            width={128}
            height={128}
            className={cn("rounded-full", className)}
        />
    );
}
