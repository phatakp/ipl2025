"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { HomeIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SiteLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

import MobileNav from "./mobile-nav";

export default function Navbar() {
    return (
        <nav className="z-99 sticky top-0 flex w-full justify-center bg-background">
            <header className="w-full overflow-hidden rounded-xl rounded-t-none border-2 bg-primary px-4 text-primary-foreground md:w-fit">
                <div className="container flex w-full items-center gap-5 py-1 lg:gap-6">
                    <div className="hidden items-center gap-5 md:flex lg:gap-6">
                        <Link href={"/"}>
                            <HomeIcon className="size-5 text-primary-foreground" />
                        </Link>
                        <NavLinks />
                    </div>
                    <div className="flex w-full items-center justify-between md:hidden">
                        <Link href={"/"} className="bg-background px-4 py-2">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={50}
                                height={30}
                            />
                        </Link>
                        <MobileNav />
                    </div>
                    <div className="ml-auto flex items-center justify-end">
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    variables: { fontFamily: "Karla" },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className={cn(
                                    buttonVariants({
                                        variant: "linkHover2",
                                    }),
                                    "hidden uppercase text-primary-foreground after:bg-primary-foreground md:flex"
                                )}
                            >
                                Login
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </header>
        </nav>
    );
}
export function NavLinks() {
    const pathName = usePathname();
    const path = pathName.split("?")[0];
    const { isSignedIn, userId } = useAuth();
    return (
        <nav className="hidden font-medium md:flex md:flex-1 md:flex-row md:items-center md:gap-5 lg:gap-6">
            {SiteLinks.map((link) => {
                const isActive = path === `/${link}`;
                if (link === "dashboard" && (!isSignedIn || !userId)) return;
                return (
                    <Link
                        key={link}
                        href={`/${link}`}
                        className={cn(
                            buttonVariants({ variant: "linkHover2" }),
                            "uppercase text-primary-foreground after:bg-primary-foreground",
                            isActive &&
                                "after:absolute after:bottom-1 after:h-[3px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary-foreground"
                        )}
                    >
                        {link}
                    </Link>
                );
            })}
        </nav>
    );
}
