"use client";

import { PropsWithChildren } from "react";

import { format } from "date-fns";

import { MatchWithTeams } from "@/app/types";
import {
    Modal,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from "@/components/features/shared/modal";
import { Button } from "@/components/ui/button";

import MatchUpdateForm from "./match-update-form";

type Props = PropsWithChildren & {
    match: MatchWithTeams;
};

export default function MatchUpdateButton({ children, match }: Props) {
    return (
        <Modal id={`match-${match.num}`}>
            <ModalTrigger asChild>{children}</ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        {match.team1Name} vs {match.team2Name}
                    </ModalTitle>
                    <ModalDescription>
                        {format(match.date, "PPP")}
                    </ModalDescription>
                </ModalHeader>
                <div className="p-4">
                    <MatchUpdateForm match={match} />
                </div>
                <ModalFooter>
                    <ModalClose asChild>
                        <Button variant="outline">Close</Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
