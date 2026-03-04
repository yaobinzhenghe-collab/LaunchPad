import { Link } from "wouter";
import { Instagram, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                EH
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Edit Hive
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Edit Hive: Sweetening your creative workflow. Your ultimate resource for CapCut and After Effects inspiration.
            </p>
            <NewsletterSignup />
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="/tips" className="text-muted-foreground hover:text-primary transition-colors">Tips & Tutorials</Link></li>
              <li><Link href="/generator" className="text-muted-foreground hover:text-primary transition-colors">Idea Generator</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/sdg" className="text-muted-foreground hover:text-primary transition-colors">SDG 4.4</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://www.tiktok.com/@yaozh3?_r=1&_t=ZS-93bJyZKX9Mu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition-colors"
                data-testid="link-tiktok"
              >
                <SiTiktok className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/edithive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@edithive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <Link href="/contact" className="block text-sm text-primary hover:text-primary/80 transition-colors">
              Contact Me &rarr;
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Edit Hive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
