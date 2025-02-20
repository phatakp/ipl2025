"use client";

import { redirect } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getCurrUser } from "@/actions/user.actions";
import { TeamOption } from "@/app/types";
import ProfileForm from "@/components/features/profile/profile-form";
import Loader from "@/components/features/shared/loader";
import {
    Modal,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/features/shared/modal";
import TeamProvider from "@/components/providers/teams.context";
import { Button } from "@/components/ui/button";
import { QueryKeys } from "@/lib/constants";

export default function ProfileUpdatePage() {
    // const [open, setOpen] = useState(true);

    const { data, isLoading } = useQuery({
        queryKey: [QueryKeys.CURR_USER],
        queryFn: getCurrUser,
    });
    const { isLoaded, isSignedIn, user } = useUser();
    if (isLoading) return <Loader />;
    if (!isLoaded || !isSignedIn) return;
    const dbUser = data?.[0];
    if (!dbUser?.teamName) redirect("/profile");

    return (
        <Modal id="update-profile" open>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Update Profile</ModalTitle>
                    <ModalDescription>
                        Enter details to update.
                    </ModalDescription>
                </ModalHeader>
                <div className="p-4">
                    <TeamProvider>
                        <ProfileForm
                            email={dbUser?.email as string}
                            firstName={user?.firstName as string}
                            lastName={user?.lastName as string}
                            image={user?.imageUrl as string}
                            teamName={dbUser?.teamName as TeamOption}
                            action="update"
                        />
                    </TeamProvider>
                </div>
                <ModalFooter>
                    <ModalClose asChild>
                        <Button variant="outline" className="uppercase">
                            Cancel
                        </Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
