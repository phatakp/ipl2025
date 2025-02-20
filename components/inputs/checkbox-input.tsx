"use client";

import { InputHTMLAttributes } from "react";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Props<T> = InputHTMLAttributes<HTMLInputElement> & {
    name: keyof T & string;
    label: string;
    desc?: string;
};

export default function CheckboxInput<T>({
    label,
    name,
    desc,
    disabled,
    ...props
}: Props<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel
                            className={cn(
                                "uppercase",
                                disabled && "text-muted-foreground"
                            )}
                        >
                            {label}
                        </FormLabel>
                        {desc && <FormDescription>{desc}</FormDescription>}
                    </div>
                </FormItem>
            )}
        />
    );
}
