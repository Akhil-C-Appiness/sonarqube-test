"use client"
import "@/styles/globals.css"
import { Metadata } from "next"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { HelveticaNeue } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SideBar } from "@/components/side-bar"
import Image from "next/image"
import Head from 'next/head';
import Script from 'next/script'
import { useEffect } from 'react';

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const generateTitle = (pathname: string) => {
    const baseTitle = 'Traffic Management System';

    const routeTitleMap: Record<string, string> = {
      '/login': 'Login',
      '/forgotPassword' : 'Forgot Password',
      '/reset-password' : 'Reset Password',
      '/dashboard/today': 'Dashboard',
      '/dashboard/week': 'Dashboard',
      '/dashboard/month': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/comparison' : 'Comparison',
    };

    const routeTitle = routeTitleMap[pathname] || '';
    return `${routeTitle ? `${routeTitle} - ` : ''}${baseTitle}`;
  };

  useEffect(() => {
    const newTitle = generateTitle(pathname);
    document.title = newTitle;
    // console.log("newTitle", newTitle);
    
  }, [pathname]);

  return (
    <>
      <html lang="en" suppressHydrationWarning={true} 
        // className={HelveticaNeue.className}
        >
        <Head>
        <title>{generateTitle(pathname)}</title>
          <link rel="icon" href="/vectors/Videonetics_logo (1).svg" /> 
          <Script src='/hls.min.js' type='text/javascript' />
        </Head>
        <body
          className={cn(
            "min-h-screen bg-[#F2F8FF] font-sans antialiased",
            fontSans.variable
          )}
        >
          <Toaster />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
            {pathname !== "/login" &&
              !pathname.includes("forgot-password") &&
              pathname !== "/forgotPassword" &&
              pathname !== "/reset-password" && pathname !== "/investigate/quicklpsearch" && pathname !== "/investigate/quickvehiclesearch" && <SiteHeader />}
              <div className="flex flex-row gap-4 h-auto">
              {pathname !== "/login" &&
              !pathname.includes("forgot-password") &&
              pathname !== "/forgotPassword" &&
              pathname !== "/reset-password" && <SideBar />}
                {children}
                </div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
