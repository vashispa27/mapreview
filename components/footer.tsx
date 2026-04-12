"use client"

import { motion } from "framer-motion"
import { MapPin, Twitter, Github, Mail } from "lucide-react"
import { MiniMascot } from "@/components/mascot"
import Link from "next/link"

const footerLinks = {
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/privacy#cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MapToSite</span>
            </motion.div>
            <p className="text-muted-foreground mb-6 max-w-xs text-pretty">
              Transform your Google Maps presence into a beautiful website in seconds.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@maptosite.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  support@maptosite.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MapToSite. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <MiniMascot className="w-8 h-10" />
            <span className="text-sm text-muted-foreground">Empowering small businesses worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
