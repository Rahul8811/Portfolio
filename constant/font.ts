import localFont from "next/font/local";

// Montserrat and Poppins are self-hosted via @fontsource (see globals.css).
// These stubs keep layout.tsx and Tailwind CSS variables working unchanged.
export const montserrat = { variable: "" };
export const poppins = { variable: "" };

export const suarte = localFont({
  src: "../assets/fonts/suarte/Suarte Free.ttf",
  display: "swap",
});
