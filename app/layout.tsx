import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wain — Sommelier IA",
  description:
    "Asistente de IA especializado en maridaje de vinos y bebidas, con streaming, tool calling y memoria de conversación.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col">
        <header className="shrink-0 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg text-accent-foreground"
              aria-hidden
            >
              🍷
            </span>
            <div className="leading-tight">
              <p className="font-bold">Wain</p>
              <p className="text-xs text-muted">Sommelier de maridaje · IA</p>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
