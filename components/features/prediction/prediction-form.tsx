"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    createPrediction,
    playDoublePrediction,
    updatePrediction,
} from "@/actions/prediction.actions";
import { TeamOption } from "@/app/types";
import AmountInput from "@/components/inputs/amount-input";
import CheckboxInput from "@/components/inputs/checkbox-input";
import { useCurrUser } from "@/components/providers/auth.context";
import { usePredictionContext } from "@/components/providers/prediction.context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QueryKeys, TEAMS } from "@/lib/constants";
import {
    cn,
    errorToast,
    getCurrentISTDate,
    getISTDate,
    successToast,
} from "@/lib/utils";

import { useModal } from "../shared/modal";

const formSchema = z.object({
    teamName: z.enum(TEAMS).nullable(),
    isDouble: z.coerce.boolean(),
    amount: z.coerce.number(),
});

export default function PredictionForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { match, pred } = usePredictionContext();
    const { currUser } = useCurrUser();
    const { modalId, closeModal } = useModal();
    const istMatchDate = getISTDate(match.date);
    const doubleCutoff = getISTDate(match.date, 60);
    const newPredCutoff = getISTDate(match.date, -30);

    const currentISTTime = getCurrentISTDate();
    const isDoubleAllowed =
        !match.isDoublePlayed &&
        currUser.doublesLeft > 0 &&
        currentISTTime >= istMatchDate &&
        currentISTTime < doubleCutoff;
    const isNewPredAllowed = currentISTTime < newPredCutoff;
    const isPredUpdAllowed = currentISTTime < istMatchDate;
    const isPredAllowed =
        (!pred && isNewPredAllowed) || (pred && isPredUpdAllowed);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            teamName: pred?.teamName,
            isDouble: pred?.isDouble ?? false,
            amount: pred?.amount ?? match.minStake,
        },
    });

    const { teamName, amount } = form.watch();

    async function onSuccess(action: "create" | "update") {
        successToast(`Prediction ${action}d successfully`);
        closeModal(modalId);
        await queryClient.invalidateQueries({
            queryKey: [QueryKeys.USER_PRED],
        });
        router.refresh();
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (pred) {
            // Update prediction
            if (
                values.amount === pred.amount &&
                values.teamName === pred.teamName &&
                values.isDouble === pred.isDouble
            ) {
                toast.warning("Warning", {
                    description: "You have made no changes",
                });
                return;
            }
            if (isNewPredAllowed) {
                const [data, err] = await updatePrediction({
                    ...values,
                    matchNum: match.num,
                    id: pred.id,
                });
                if (err) errorToast("Error", err.message);
                else if (data) onSuccess("update");
            } else if (isPredUpdAllowed) {
                if (
                    pred.teamName !== values.teamName &&
                    values.amount < pred.amount * 2
                ) {
                    errorToast(
                        "Amount",
                        `Minimum Required: ${pred.amount * 2}`
                    );
                } else if (
                    pred.teamName === values.teamName &&
                    values.amount <= pred.amount
                ) {
                    errorToast(
                        "Amount",
                        `Minimum Required: ${pred.amount + 10}`
                    );
                } else if (values.isDouble) {
                    errorToast("Double", `Operation not allowed`);
                } else {
                    const [data, err] = await updatePrediction({
                        ...values,
                        matchNum: match.num,
                        id: pred.id,
                    });
                    if (err) errorToast("Error", err.message);
                    else if (data) onSuccess("update");
                }
            } else {
                if (values.isDouble && !isDoubleAllowed) {
                    errorToast("Double", `Operation not allowed`);
                } else if (values.isDouble && match.isDoublePlayed) {
                    errorToast("Double", `Already exists for match`);
                } else if (!values.isDouble && pred.isDouble) {
                    errorToast("Error", `Cannot remove an applied double`);
                } else if (values.isDouble) {
                    const [data, err] = await playDoublePrediction({
                        matchNum: match.num,
                        id: pred.id,
                        amount: pred.amount,
                    });
                    if (err) errorToast("Error", err.message);
                    else if (data) onSuccess("update");
                }
            }
        } else {
            // New Prediction
            if (values.isDouble) {
                errorToast("Double", `Operation not allowed`);
            } else if (isNewPredAllowed) {
                const [data, err] = await createPrediction({
                    ...values,
                    matchNum: match.num,
                });
                if (err) errorToast("Error", err.message);
                else if (data) onSuccess("create");
            } else {
                errorToast("Prediction", `Operation cutoff passed`);
            }
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto max-w-3xl space-y-6"
            >
                {!!teamName && (
                    <Badge
                        className="w-full justify-center text-pretty text-base font-extralight uppercase"
                        variant={"outline"}
                    >{`Current: ${teamName} for Rs.${amount}/-`}</Badge>
                )}
                <Badge
                    variant={
                        isPredAllowed && !!teamName ? "default" : "destructive"
                    }
                    className="w-full justify-center text-pretty font-extralight uppercase"
                >
                    {!!pred && !isPredUpdAllowed && isDoubleAllowed
                        ? "Can only play double now"
                        : pred && !isPredUpdAllowed
                          ? "No changes allowed now"
                          : pred
                            ? "Changes allowed"
                            : !pred && !isNewPredAllowed
                              ? "Prediction cutoff passed"
                              : "No Predictions yet"}
                </Badge>
                <div className="flex flex-nowrap items-center justify-center gap-4">
                    <PredTeamButton
                        matchTeam={match.team1Name}
                        disabled={!isPredAllowed}
                    />
                    <PredTeamButton
                        matchTeam={match.team2Name}
                        disabled={!isPredAllowed}
                    />
                </div>

                <AmountInput<z.infer<typeof formSchema>>
                    label="Amount"
                    name="amount"
                    min={match.minStake}
                    step={10}
                    onIncrement={() => form.setValue("amount", amount + 10)}
                    onDecrement={() => form.setValue("amount", amount - 10)}
                    disabled={!isPredAllowed}
                />

                {!!pred && (
                    <CheckboxInput
                        name="isDouble"
                        label="Play double"
                        desc="You win or lose double the amount!"
                        disabled={!isDoubleAllowed || match.isDoublePlayed}
                    />
                )}

                <div className="flex w-full">
                    <Button
                        className="w-full uppercase"
                        disabled={!isPredAllowed && !isDoubleAllowed}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

const PredTeamButton = ({
    matchTeam,
    disabled,
}: {
    matchTeam: TeamOption | null;
    disabled?: boolean;
}) => {
    const { getValues, setValue } =
        useFormContext<z.infer<typeof formSchema>>();
    const { teamName } = getValues();
    return (
        <Button
            type="button"
            variant={matchTeam}
            className={cn(
                "relative size-24",
                matchTeam === teamName && "border-4 border-foreground"
            )}
            onClick={() => setValue("teamName", matchTeam)}
            disabled={disabled}
        >
            <Image
                src={`/logos/simple/${matchTeam ?? undefined}.png`}
                alt="team1"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                height={60}
                width={60}
            />
        </Button>
    );
};
