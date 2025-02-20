import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.plugins("check-file", "n"),
    {
        rules: {
            "prefer-arrow-callback": ["error"],
            "prefer-template": ["error"],
            "n/no-process-env": ["warning"],
            "check-file/filename-naming-convention": [
                "error",
                {
                    "**/*.{ts,tsx}": "KEBAB_CASE",
                },
                {
                    // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
                    ignoreMiddleExtensions: true,
                },
            ],
            "check-file/folder-naming-convention": [
                "error",
                {
                    // all folders within src (except __tests__)should be named in kebab-case
                    "src/**": "KEBAB_CASE",
                },
            ],
        },
    },
];

export default eslintConfig;
