"use client";

import { InputHTMLAttributes } from "react";

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

type Props<T> = InputHTMLAttributes<HTMLInputElement> & {
    name: keyof T & string;
    label: string;
    desc?: string;
};

export default function InputWithLabel<T>({
    label,
    name,
    desc,
    ...props
}: Props<T>) {
    const form = useFormContext();
    const isError = !!form.formState.errors[name];

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className="font-thin uppercase">
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            className={cn(
                                "font-karla",
                                isError &&
                                    "border-destructive/80 text-destructive ring-destructive"
                            )}
                            {...props}
                            {...field}
                        />
                    </FormControl>
                    {desc && <FormDescription>{desc}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
