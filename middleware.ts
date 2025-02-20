import { redirect } from "next/navigation";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/profile(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const resp = await auth.protect();
        if (!resp.userId) redirect("/sign-in");
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
