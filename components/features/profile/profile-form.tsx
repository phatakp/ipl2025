"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getTotalCompletedMatches } from "@/actions/match.actions";
import { createProfile, updateProfile } from "@/actions/user.actions";
import { TeamOption } from "@/app/types";
import InputWithLabel from "@/components/inputs/input-with-label";
import SelectWithLabel from "@/components/inputs/select-with-label";
import { useTeamContext } from "@/components/providers/teams.context";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QueryKeys, TEAMS } from "@/lib/constants";
import { errorToast, successToast } from "@/lib/utils";

import Loader from "../shared/loader";

const formSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    teamName: z.enum(TEAMS),
    imageUrl: z.string().optional(),
});

type Props = {
    action: "add" | "update";
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    teamName?: TeamOption;
};

export default function ProfileForm({
    email,
    firstName,
    lastName,
    image,
    teamName,
    action = "add",
}: Props) {
    const router = useRouter();
    const { teams } = useTeamContext();
    const { setTheme } = useTheme();
    const { data, isLoading } = useQuery({
        queryKey: [QueryKeys.COMPLETED_MATCHES],
        queryFn: getTotalCompletedMatches,
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            teamName,
            email,
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            imageUrl: image ?? undefined,
        },
    });

    if (isLoading) return <Loader />;
    const completed = data?.[0];
    const disabled = completed && completed >= 50;

    const options = teams.map((t) => ({
        value: t.shortName,
        label: t.longName,
    }));

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            let data, err;
            if (action === "add") [data, err] = await createProfile(values);
            else [data, err] = await updateProfile(values);
            if (err) errorToast("Error", err.message);
            if (data) {
                let theme = teams.find((t) => t.shortName === data.teamName)
                    ?.shortName as string;
                theme = theme ? `dark-${theme}` : "dark";
                setTheme(theme);
                successToast("Profile Updated Successfully");
                router.replace("/dashboard");
            }
        } catch (err) {
            errorToast("Error", JSON.stringify(err, null, 2));
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid w-full max-w-md space-y-6"
            >
                <InputWithLabel<z.infer<typeof formSchema>>
                    name={"email"}
                    label="Email"
                    readOnly
                    disabled
                />
                <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:gap-4">
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="firstName"
                        label="First Name"
                    />
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="lastName"
                        label="Last Name"
                    />
                </div>

                <SelectWithLabel<z.infer<typeof formSchema>>
                    name="teamName"
                    label="IPL Winner Team"
                    options={options}
                    placeholder="Select IPL Winner"
                    disabled={!!disabled}
                />
                <Button type="submit" className="uppercase">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
