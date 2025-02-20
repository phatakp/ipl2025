import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getCurrUser } from "@/actions/user.actions";
import ProfileForm from "@/components/features/profile/profile-form";
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

export default async function ProfilePage() {
    const [user] = await getCurrUser();
    if (user?.teamName) redirect("/dashboard");

    const { sessionClaims } = await auth();
    return (
        <Modal id="create-profile" open>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Update Profile</ModalTitle>
                    <ModalDescription>
                        Enter details to complete your account creation.
                    </ModalDescription>
                </ModalHeader>
                <div className="p-4">
                    <TeamProvider>
                        <ProfileForm
                            email={sessionClaims?.email as string}
                            firstName={sessionClaims?.firstName as string}
                            lastName={sessionClaims?.lastName as string}
                            image={sessionClaims?.image as string}
                            action="add"
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
