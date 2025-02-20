"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { SiteLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathName = usePathname();
    const path = pathName.split("?")[0];
    const { isSignedIn, userId } = useAuth();

    return (
        <Drawer direction="top" open={open} onOpenChange={setOpen}>
            <DrawerTrigger className="md:hidden" asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MenuIcon />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-screen">
                <DrawerHeader>
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={200}
                        height={120}
                        className="mx-auto"
                    />
                    <DrawerTitle className="title text-6xl font-extrabold">
                        2025
                    </DrawerTitle>
                </DrawerHeader>

                <nav className="flex h-full flex-1 flex-col items-center justify-center gap-12 font-medium">
                    <Link
                        href={`/`}
                        onClick={() => setOpen(false)}
                        className={cn(
                            "w-full py-2 text-center text-3xl uppercase hover:bg-primary hover:text-primary-foreground",
                            path === "/" && "bg-primary text-primary-foreground"
                        )}
                    >
                        Home
                    </Link>
                    {SiteLinks.map((link) => {
                        const isActive = path === `/${link}`;
                        if (link === "dashboard" && (!isSignedIn || !userId))
                            return;
                        return (
                            <Link
                                key={link}
                                href={`/${link}`}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "w-full py-2 text-center text-3xl uppercase hover:bg-primary hover:text-primary-foreground",
                                    isActive &&
                                        "bg-primary text-primary-foreground"
                                )}
                            >
                                {link}
                            </Link>
                        );
                    })}

                    {(!isSignedIn || !userId) && (
                        <Link
                            href={`/sign-in`}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "w-full py-2 text-center text-3xl uppercase hover:bg-primary hover:text-primary-foreground"
                            )}
                        >
                            Login
                        </Link>
                    )}
                </nav>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="uppercase">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
