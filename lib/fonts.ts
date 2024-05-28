// import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
import localFont from 'next/font/local'


// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })

// export const fontMono = FontMono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// })

export const fontSans = localFont({
  variable: "--font-sans",
  src: '../public/fonts/Inter/Inter-VariableFont_slnt,wght.ttf',
  display: 'swap',
})

export const fontMono = localFont({
  variable: "--font-mono",
  src: '../public/fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf',
  display: 'swap',
})

export const HelveticaNeue = localFont({
  src: '../public/fonts/HelveticaNeue.ttf',
  display: 'swap',
})
export const HLBHelvetica = localFont({
  src: '../public/fonts/HLBHelvetica.ttf',
  display: 'swap',
})