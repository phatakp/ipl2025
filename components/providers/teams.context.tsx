"use client";

import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getAllTeams } from "@/actions/team.actions";
import { Team } from "@/app/types";

type TeamContextProps = {
    teams: Team[];
};

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export default function TeamProvider({ children }: PropsWithChildren) {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        async function getData() {
            const [data, err] = await getAllTeams();
            if (data) setTeams(data);
        }
        getData();
    }, []);

    return (
        <TeamContext.Provider value={{ teams }}>
            {children}
        </TeamContext.Provider>
    );
}

export const useTeamContext = () => {
    const context = useContext(TeamContext);
    if (!context) throw new Error("Team Context not used!");
    return context;
};
