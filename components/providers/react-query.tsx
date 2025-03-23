"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function ReactQueryProvider({ children }: React.PropsWithChildren) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false, // default: true
                    refetchOnReconnect: false,
                    refetchOnMount: false,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default ReactQueryProvider;
