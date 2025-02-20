"use client";

import { InputHTMLAttributes } from "react";

import { Minus, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

type Props<T> = InputHTMLAttributes<HTMLInputElement> & {
    name: keyof T & string;
    label: string;
    min: number;
    onIncrement: () => void;
    onDecrement: () => void;
    desc?: string;
};

export default function AmountInput<T>({
    label,
    name,
    desc,
    min,
    onIncrement,
    onDecrement,
    disabled,
    ...props
}: Props<T>) {
    const form = useFormContext();
    const isError = !!form.formState.errors[name];

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={cn(
                            "uppercase opacity-80",
                            disabled && "text-muted-foreground"
                        )}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                className={cn(
                                    "peer cursor-not-allowed pe-12 ps-6 text-center font-karla",
                                    isError &&
                                        "border-destructive/80 text-destructive ring-destructive",
                                    disabled && "text-muted-foreground"
                                )}
                                inputMode="numeric"
                                readOnly
                                {...props}
                                {...field}
                            />
                            <Button
                                type="button"
                                variant={"outline"}
                                size={"icon"}
                                onClick={onDecrement}
                                className="absolute inset-y-0 start-0 aspect-square size-9 rounded-r-none"
                                disabled={disabled || field.value <= min}
                            >
                                <Minus />
                            </Button>
                            <Button
                                type="button"
                                variant={"outline"}
                                size={"icon"}
                                onClick={onIncrement}
                                className="absolute inset-y-0 end-0 aspect-square size-9 rounded-l-none"
                                disabled={disabled}
                            >
                                <Plus />
                            </Button>
                        </div>
                    </FormControl>
                    {desc && <FormDescription>{desc}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
