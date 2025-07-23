import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { AppLayout } from "@/core/layouts/AppLayout"
import { SessionProvider } from "@/core/providers/SessionProvider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "TaskFast AI - Gerenciamento de Tarefas com IA",
  description: "Plataforma moderna de gerenciamento de tarefas com sugestões inteligentes de prioridade usando IA",
  keywords: "tarefas, produtividade, IA, inteligência artificial, gestão, organização",
  authors: [{ name: "Rafael Naves" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
