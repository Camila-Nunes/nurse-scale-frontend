import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nurses Scale - Gerenciamento',
  description: 'Sistemas para gerenciar as escalas de enfermeiros e também gerenciar a parte financeira de sua empresa.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
