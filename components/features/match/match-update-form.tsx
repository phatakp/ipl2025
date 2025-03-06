"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateMatch } from "@/actions/match.actions";
import { MatchWithTeams } from "@/app/types";
import InputWithLabel from "@/components/inputs/input-with-label";
import SelectWithLabel from "@/components/inputs/select-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MATCH_RESULT_TYPE, MATCH_STATUS, TEAMS } from "@/lib/constants";
import { errorToast, successToast } from "@/lib/utils";

import { useModal } from "../shared/modal";

type Props = {
    match: MatchWithTeams;
};

const formSchema = z
    .object({
        resultType: z.enum(MATCH_RESULT_TYPE).nullable().optional(),
        winnerName: z.enum(TEAMS).nullable().optional(),
        status: z.enum(MATCH_STATUS).optional(),
        team1Runs: z.coerce.number().optional(),
        team1Wickets: z.coerce.number().optional(),
        team1Balls: z.coerce.number().optional(),
        team2Runs: z.coerce.number().optional(),
        team2Wickets: z.coerce.number().optional(),
        team2Balls: z.coerce.number().optional(),
    })
    .superRefine((data, context) => {
        if (data.status === "completed" && !data.winnerName)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["winnerName"],
            });
        if (data.status !== "completed" && data.winnerName)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid Status",
                path: ["status"],
            });

        if (data.status === "completed" && data.team1Runs === 0)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["team1Runs"],
            });
        if (data.status === "completed" && data.team1Balls === 0)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["team1Balls"],
            });
        if (data.status === "completed" && data.team2Runs === 0)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["team2Runs"],
            });
        if (data.status === "completed" && data.team2Balls === 0)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["team2Balls"],
            });
        if (data.status === "completed" && !data.resultType)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["resultType"],
            });
    });

const statusOptions = MATCH_STATUS.map((s) => ({
    value: s,
    label: s.toUpperCase(),
}));
const resultOptions = MATCH_RESULT_TYPE.map((s) => ({
    value: s,
    label: s.toUpperCase(),
}));

export default function MatchUpdateForm({ match }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { modalId, closeModal } = useModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            team1Runs: match.team1Runs ?? 0,
            team1Wickets: match.team1Wickets ?? 0,
            team1Balls: match.team1Balls ?? 120,
            team2Runs: match.team2Runs ?? 0,
            team2Wickets: match.team2Wickets ?? 0,
            team2Balls: match.team2Balls ?? 120,
        },
    });

    const teamsOptions = [
        { value: match.team1Name ?? "", label: match.team1Name ?? "TBD" },
        { value: match.team2Name ?? "", label: match.team2Name ?? "TBD" },
    ];

    async function onSuccess() {
        await queryClient.invalidateQueries();
        closeModal(modalId);
        router.refresh();
        successToast(`Match updated successfully`);
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);

        let resultMargin = 0;
        if (values.winnerName && values.resultType !== "superover") {
            if (values.winnerName === match.team1Name)
                if (values.resultType === "runs")
                    resultMargin =
                        (values.team1Runs ?? 0) - (values.team2Runs ?? 0);
                else resultMargin = 10 - (values.team1Wickets ?? 0);
            else if (values.winnerName === match.team2Name)
                if (values.resultType === "runs")
                    resultMargin =
                        (values.team2Runs ?? 0) - (values.team1Runs ?? 0);
                else resultMargin = 10 - (values.team2Wickets ?? 0);
        }
        const [data, err] = await updateMatch({
            ...match,
            ...values,
            winnerName: values.winnerName ? values.winnerName : undefined,
            status: values.status ? values.status : undefined,
            resultType: values.resultType ? values.resultType : undefined,
            resultMargin,
        });

        if (err) errorToast("Error", err.message);
        else if (data) onSuccess();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto max-w-3xl space-y-4"
            >
                <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:gap-4">
                    <SelectWithLabel<z.infer<typeof formSchema>>
                        name="status"
                        label="Status"
                        options={statusOptions}
                        placeholder="Select Match Status"
                    />
                    <SelectWithLabel<z.infer<typeof formSchema>>
                        name="winnerName"
                        label="Winner"
                        options={teamsOptions}
                        placeholder="Select Winner"
                    />
                </div>

                <div className="flex w-full items-center gap-1">
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team1Runs"
                        label={`${match.team1Name}`}
                        type="number"
                        min={0}
                    />
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team1Wickets"
                        label="wickets"
                        type="number"
                        min={0}
                        max={10}
                    />
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team1Balls"
                        label="Balls"
                        type="number"
                        min={0}
                        max={120}
                    />
                </div>

                <div className="flex w-full items-center gap-1">
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team2Runs"
                        label={`${match.team2Name}`}
                        type="number"
                        min={0}
                    />
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team2Wickets"
                        label="wickets"
                        type="number"
                        min={0}
                        max={10}
                    />
                    <InputWithLabel<z.infer<typeof formSchema>>
                        name="team2Balls"
                        label="Balls"
                        type="number"
                        min={0}
                        max={120}
                    />
                </div>

                <SelectWithLabel<z.infer<typeof formSchema>>
                    name="resultType"
                    label="Result Type"
                    options={resultOptions}
                    placeholder="Select Result Type"
                />

                <Button type="submit" className="uppercase">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
