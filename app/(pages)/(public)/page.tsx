import Image from "next/image";

import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
    return (
        <div className="relative flex h-[60rem] w-full overflow-hidden rounded-md bg-background antialiased bg-grid-white/[0.02] md:items-center md:justify-center">
            <Spotlight />
            <div className="relative z-10 mx-auto w-full p-4 pt-20 md:pt-0">
                <h1 className="bg-opacity-50 bg-gradient-to-b from-muted-foreground to-secondary bg-clip-text text-center text-5xl font-bold text-transparent md:text-7xl">
                    FANTASY <br /> PREMIER LEAGUE <br />{" "}
                    <span className="text-7xl font-extralight md:text-9xl">
                        2025
                    </span>
                </h1>

                <div className="mx-auto mt-4 max-w-lg backdrop-blur-sm">
                    <Image src="/trophy.png" width={495} height={504} alt="" />
                </div>
            </div>
        </div>
    );
}
