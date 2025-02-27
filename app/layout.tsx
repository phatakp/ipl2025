import type { Metadata } from "next";
import { Karla } from "next/font/google";
import localFont from "next/font/local";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
    AlertTriangle,
    CheckCircle,
    Info,
    Loader,
    XCircle,
} from "lucide-react";
import { Toaster } from "sonner";

import Background from "@/components/features/shared/background";
import Navbar from "@/components/features/shared/navbar";
import ReactQueryProvider from "@/components/providers/react-query";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const quickSans = localFont({
    src: "./fonts/Quick Starter.otf",
    variable: "--font-quick-sans",
    weight: "100 400 600 900",
});

const karla = Karla({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-karla",
});

export const metadata: Metadata = {
    title: "IPL2025",
    description: "IPL Prediction App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: "hsl(0, 0%, 98%)",
                },
            }}
        >
            <ReactQueryProvider>
                <html lang="en" suppressHydrationWarning>
                    <body
                        className={`${geistSans.variable} ${quickSans.variable} ${karla.variable} relative font-sans antialiased`}
                    >
                        <ThemeProvider
                            disableTransitionOnChange
                            defaultTheme="dark"
                            enableColorScheme
                            themes={[
                                "dark",
                                "dark-CSK",
                                "dark-RR",
                                "dark-RCB",
                                "dark-LSG",
                                "dark-MI",
                                "dark-GT",
                                "dark-PBKS",
                                "dark-SRH",
                                "dark-DC",
                                "dark-KKR",
                            ]}
                        >
                            <Navbar />
                            <Background>
                                <div className="container min-h-screen py-8">
                                    {children}
                                </div>
                            </Background>
                            <Toaster
                                richColors
                                toastOptions={{
                                    style: {
                                        background: "hsl(var(--background))",
                                        color: "hsl(var(--foreground))",
                                        border: "1px solid hsl(var(--input))",
                                    },
                                }}
                                icons={{
                                    error: (
                                        <XCircle className="size-4 text-destructive-foreground" />
                                    ),
                                    success: (
                                        <CheckCircle className="size-4 text-success-foreground" />
                                    ),
                                    warning: (
                                        <AlertTriangle className="size-4 text-amber-500" />
                                    ),
                                    info: (
                                        <Info className="size-4 text-blue-500" />
                                    ),
                                    loading: (
                                        <Loader className="size-4 animate-spin text-muted" />
                                    ),
                                }}
                            />
                        </ThemeProvider>
                    </body>
                </html>
            </ReactQueryProvider>
        </ClerkProvider>
    );
}
