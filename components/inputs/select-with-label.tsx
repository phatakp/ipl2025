import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
    label: string;
    value: string;
    image?: string;
    extra?: any;
};

type Props<T> = ButtonHTMLAttributes<HTMLButtonElement> & {
    name: keyof T & string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    desc?: string;
    className?: string;
};

export default function SelectWithLabel<T>({
    label,
    name,
    desc,
    placeholder,
    options,
    className,
    ...props
}: Props<T>) {
    const form = useFormContext();
    const isError = !!form.formState.errors[name];

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "w-full duration-1000 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2",
                        className
                    )}
                >
                    <FormLabel className="font-thin uppercase">
                        {label}
                    </FormLabel>

                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={cn(
                                    "font-karla ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0",
                                    isError &&
                                        "border-destructive/80 text-destructive ring-destructive"
                                )}
                                {...props}
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                            <SelectGroup>
                                {options.map((opt) => (
                                    <SelectItem
                                        value={opt.value}
                                        key={opt.value}
                                    >
                                        {opt.image && (
                                            <Image
                                                className="size-6 rounded"
                                                src={opt.image}
                                                alt="Select Img"
                                                width={24}
                                                height={24}
                                            />
                                        )}
                                        <span className="font-karla truncate">
                                            {opt.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {desc && <FormDescription>{desc}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
