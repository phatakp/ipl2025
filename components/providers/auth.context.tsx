"use client";

import { PropsWithChildren, createContext, useContext, useEffect } from "react";

import { useTheme } from "next-themes";

import { ProfileWithTeam } from "@/app/types";

type AuthContextProps = {
    currUser: ProfileWithTeam;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({
    children,
    currUser,
}: PropsWithChildren & AuthContextProps) {
    const { setTheme } = useTheme();

    useEffect(() => {
        const theme = currUser?.teamName ? `dark-${currUser.teamName}` : "dark";
        setTheme(theme);
    }, [currUser.teamName, setTheme]);

    return (
        <AuthContext.Provider value={{ currUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useCurrUser = () => useContext(AuthContext);
