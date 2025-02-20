import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="grid h-full w-full items-center justify-items-center">
            <div className="relative flex items-center gap-4">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="absolute left-2 size-3.5 rounded-full bg-current"
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 24 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="absolute left-2 size-3.5 rounded-full bg-current"
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 24 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="absolute left-8 size-3.5 rounded-full bg-current"
                ></motion.span>
                <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: 0 }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="absolute left-14 size-3.5 rounded-full bg-current"
                ></motion.span>
            </div>
        </div>
    );
}
