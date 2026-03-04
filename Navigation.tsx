import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Video, Zap, Lightbulb, Mail, LogIn, LogOut, Settings, MessageCircle, PlusCircle, Play } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Feed", icon: Play },
    { href: "/templates", label: "Templates", icon: Video },
    { href: "/tips", label: "Tips & Tutorials", icon: Zap },
    { href: "/generator", label: "Idea Generator", icon: Lightbulb },
    { href: "/submit", label: "Submit", icon: PlusCircle },
    { href: "/chat", label: "Community Chat", icon: MessageCircle },
    { href: "/services", label: "Services", icon: Zap },
    { href: "/innovation", label: "Innovation", icon: Lightbulb },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform duration-200">
              EH
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
              Edit Hive
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location === link.href
                    ? "text-white bg-white/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" data-testid="button-admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <a href="/api/logout">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </a>
              </div>
            ) : (
              <a href="/api/login">
                <Button variant="default" size="sm" data-testid="button-login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                    location === link.href
                      ? "text-white bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/5 mt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" className="block" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full" data-testid="button-mobile-admin">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <a href="/api/logout" className="block">
                      <Button variant="outline" className="w-full" data-testid="button-mobile-logout">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </a>
                  </div>
                ) : (
                  <a href="/api/login" className="block">
                    <Button variant="default" className="w-full" data-testid="button-mobile-login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
