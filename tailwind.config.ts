import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
    darkMode: ["selector", '[data-theme^="dark-"]'],
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: { DEFAULT: "1rem", lg: "2rem" },
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-quick-sans)", ...fontFamily.sans],
                karla: ["var(--font-karla)", ...fontFamily.sans],
            },
            backgroundImage: {
                nav: "url('/nav.png')",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                GT: {
                    DEFAULT: "hsl(var(--GT))",
                    foreground: "hsl(var(--GT-foreground))",
                },
                MI: {
                    DEFAULT: "hsl(var(--MI))",
                    foreground: "hsl(var(--MI-foreground))",
                },
                CSK: {
                    DEFAULT: "hsl(var(--CSK))",
                    foreground: "hsl(var(--CSK-foreground))",
                },
                LSG: {
                    DEFAULT: "hsl(var(--LSG))",
                    foreground: "hsl(var(--LSG-foreground))",
                },
                KKR: {
                    DEFAULT: "hsl(var(--KKR))",
                    foreground: "hsl(var(--KKR-foreground))",
                },
                RR: {
                    DEFAULT: "hsl(var(--RR))",
                    foreground: "hsl(var(--RR-foreground))",
                },
                RCB: {
                    DEFAULT: "hsl(var(--RCB))",
                    foreground: "hsl(var(--RCB-foreground))",
                },
                PBKS: {
                    DEFAULT: "hsl(var(--PBKS))",
                    foreground: "hsl(var(--PBKS-foreground))",
                },
                SRH: {
                    DEFAULT: "hsl(var(--SRH))",
                    foreground: "hsl(var(--SRH-foreground))",
                },
                DC: {
                    DEFAULT: "hsl(var(--DC))",
                    foreground: "hsl(var(--DC-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                shine: {
                    from: {
                        backgroundPosition: "200% 0",
                    },
                    to: {
                        backgroundPosition: "-200% 0",
                    },
                },
                "caret-blink": {
                    "0%,70%,100%": { opacity: "1" },
                    "20%,50%": { opacity: "0" },
                },
                bgColor: {
                    "10%": {
                        backgroundColor: "hsl(var(--CSK))",
                    },
                    "20%": {
                        backgroundColor: "hsl(var(--RCB))",
                    },
                    "30%": {
                        backgroundColor: "hsl(var(--PBKS))",
                    },
                    "40%": {
                        backgroundColor: "hsl(var(--SRH))",
                    },
                    "50%": {
                        backgroundColor: "hsl(var(--KKR))",
                    },
                    "60%": {
                        backgroundColor: "hsl(var(--DC))",
                    },
                    "70%": {
                        backgroundColor: "hsl(var(--GT))",
                    },
                    "80%": {
                        backgroundColor: "hsl(var(--MI))",
                    },
                    "90%": {
                        backgroundColor: "hsl(var(--RR))",
                    },
                    "100%": {
                        backgroundColor: "hsl(var(--LSG))",
                    },
                },
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                "infinite-scroll": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-100%)" },
                },
            },
            animation: {
                bgColor: "bgColor 3s infinite linear",
                shine: "shine 8s ease-in-out infinite",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "infinite-scroll": "infinite-scroll 15s linear infinite",
                "caret-blink": "caret-blink 1.25s ease-out infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        addVariablesForColors,
        function ({ matchUtilities, theme }: any) {
            matchUtilities(
                {
                    "bg-grid": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-grid-small": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-dot": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`,
                    }),
                },
                {
                    values: flattenColorPalette(theme("backgroundColor")),
                    type: "color",
                }
            );
        },
    ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}
