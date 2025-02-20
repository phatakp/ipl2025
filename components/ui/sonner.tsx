"use client";

import {
    AlertTriangle,
    CheckCircle,
    Info,
    Loader,
    XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group group-data-[type=error]:bg-destructive group-data-[type=info]:bg-blue-800 group-data-[type=success]:bg-success group-data-[type=warning]:bg-amber-800"
            toastOptions={{
                classNames: {
                    toast: "group toast border-2 group-[.toaster]:border-input group-[.toaster]:shadow-lg ",
                    description:
                        "text-base group-[.toast]:text-muted-foreground group-data-[type=error]:text-destructive group-data-[type=success]:text-success group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    error: "text-destructive border border-destructive/80",
                    success: "text-success border border-success/80",
                    warning: "text-amber-500 border border-amber-800",
                    info: "text-blue-500 border border-blue-800",
                    icon: "group-data-[type=error]:text-destructive group-data-[type=success]:text-success group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500",
                },
            }}
            icons={{
                error: <XCircle className="size-4 text-destructive" />,
                success: <CheckCircle className="size-4 text-success" />,
                warning: <AlertTriangle className="size-4 text-amber-500" />,
                info: <Info className="size-4 text-blue-500" />,
                loading: <Loader className="size-4 animate-spin text-muted" />,
            }}
            {...props}
        />
    );
};

export { Toaster };
