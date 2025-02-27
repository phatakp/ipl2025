import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function Loader({ className }: { className?: string }) {
    return (
        <div className="grid h-full w-full items-center justify-items-center">
            <div className="relative flex items-center gap-4">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className={cn(
                        "absolute left-2 size-3 rounded-full bg-current",
                        className
                    )}
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 24 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className={cn(
                        "absolute left-4 size-3 rounded-full bg-current",
                        className
                    )}
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 24 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className={cn(
                        "absolute left-8 size-3 rounded-full bg-current",
                        className
                    )}
                ></motion.span>
                <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: 0 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className={cn(
                        "absolute left-14 size-3 rounded-full bg-current",
                        className
                    )}
                ></motion.span>
            </div>
        </div>
    );
}
