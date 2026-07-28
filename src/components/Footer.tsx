import Link from "next/link";
import { FBCLogo } from "./FBCLogo";
import { X, MessageCircle, Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/socials";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Hall of Fame", href: "/hall-of-fame" },
    ],
    campaigns: [
      { label: "Contest", href: "/ledger-contest" },
      { label: "Leaderboard", href: "/ledger-contest/leaderboard" },
      { label: "Sign Up", href: "/ledger-contest/signup" },
    ],
    connect: [
      { label: "X (Twitter)", href: SOCIAL_LINKS.fbcX, icon: X },
      { label: "Telegram", href: SOCIAL_LINKS.fbcTelegram, icon: MessageCircle },
      { label: "Email", href: "mailto:fbc@futo.edu.ng", icon: Mail },
      { label: "WhatsApp", href: SOCIAL_LINKS.fbcWhatsApp, icon: MessageCircle },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src="/logo.svg" alt="FBC Logo" className="w-8 h-6" />
              </div>
              <span className="font-bold text-lg">FBC</span>
            </div>
            <p className="text-gray-400 text-sm">
              Building the future of Web3 at FUTO
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campaigns Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Campaigns</h3>
            <ul className="space-y-2">
              {footerLinks.campaigns.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © {currentYear} FUTO Blockchain Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}