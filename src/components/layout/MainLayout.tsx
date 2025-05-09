import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import { Shell } from "@/components/shell"
import { siteConfig } from "@/config/site"
import { Link } from "@nextui-org/react"
import { Icons } from "@/components/icons"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { setTheme } = useTheme()
  const isMobile = useIsMobile()
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background">
        <Shell className="h-14">
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <Icons.logo className="h-6 w-6" aria-hidden="true" />
              <span className="font-bold">{siteConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isMounted && !isMobile && <ModeToggle />}
            {!session ? (
              <Button variant="default" size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.user_metadata?.avatar_url as string} />
                      <AvatarFallback>{session.user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/achievements")}>Achievements</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/leaderboard")}>Leaderboard</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut()
                      navigate("/login")
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Shell>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <Shell className="flex flex-col items-center justify-between md:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <ModeToggle />
        </Shell>
      </footer>
      {isMobile && <MobileNav />}
    </div>
  )
}
