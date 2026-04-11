"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Menu, X, LayoutGrid, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LoginModal } from "@/components/login-modal"
import { useAdminMode } from "@/components/providers/admin-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Examples", href: "#examples" },
  { name: "Pricing", href: "#pricing" },
]
export function Navbar() {
  const { data: session, status } = useSession()
  const { isAdminMode, setAdminMode } = useAdminMode()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Combine real session with admin mode
  const isLoggedIn = !!session || isAdminMode

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">MapToSite</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <span className="text-sm font-medium hidden sm:block">
                      {isAdminMode ? "Admin Mode" : session?.user?.name}
                    </span>
                    <Avatar className="w-9 h-9 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                      {isAdminMode ? (
                        <AvatarFallback className="bg-amber-100 text-amber-700">A</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={session?.user?.image || ""} />
                          <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{isAdminMode ? "Admin Mode" : session?.user?.name}</span>
                      {!isAdminMode && session?.user?.email && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {session.user.email}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-sites" className="flex items-center gap-2 cursor-pointer">
                      <LayoutGrid className="w-4 h-4" />
                      My Sites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      if (isAdminMode) {
                        setAdminMode(false)
                      } else {
                        signOut()
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setLoginModalOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Button>
                <Button 
                  onClick={() => window.dispatchEvent(new CustomEvent("focus-input"))}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-lg pt-20">
              <nav className="flex flex-col items-center gap-6 p-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="text-xl font-medium text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  className="flex flex-col gap-3 w-full max-w-xs mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isLoggedIn ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        asChild
                      >
                        <Link href="/my-sites" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutGrid className="w-4 h-4 mr-2" />
                          My Sites
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => {
                          if (isAdminMode) {
                            setAdminMode(false)
                          } else {
                            signOut()
                          }
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setLoginModalOpen(true)
                        }}
                      >
                        Log in
                      </Button>
                      <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          window.dispatchEvent(new CustomEvent("focus-input"))
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        onAdminLogin={() => setAdminMode(true)}
      />
    </>
  )
}
