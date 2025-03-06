"use client";

import Link from "next/link";
import { useState } from "react";

import { useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getCurrUser } from "@/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryKeys } from "@/lib/constants";

export default function UserDropdown() {
    const [open, setOpen] = useState(false);
    const { signOut } = useClerk();
    const { data, isLoading } = useQuery({
        queryKey: [QueryKeys.CURR_USER],
        queryFn: getCurrUser,
    });
    if (isLoading) return <Skeleton className="size-10 rounded-full" />;
    const user = data?.[0];
    if (!user) return;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage
                        src={user.imageUrl ?? "https://github.com/shadcn.png"}
                        alt="@"
                    />
                    <AvatarFallback>DP</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 font-karla">
                <DropdownMenuLabel className="p-0">
                    <div className="flex w-full flex-col bg-secondary px-2 py-4">
                        <span className="font-semibold uppercase">
                            {user.firstName} {user?.lastName}
                        </span>
                        <span className="text-muted-foreground">
                            {user.email}
                        </span>
                        <span className="">Doubles: {user.doublesLeft}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(false)}>
                    <Link href={"/profile/update"}>Update Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        signOut({ redirectUrl: "/sign-in" });
                        setOpen(false);
                    }}
                >
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
