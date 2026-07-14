import { Link } from 'wouter';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center text-primary">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">
                Karuna Dham
              </span>
            </Link>
            <p className="text-primary-foreground/80 font-light leading-relaxed">
              Serving the most vulnerable with compassion and dedication. Every act of kindness creates a ripple of hope.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="text-primary-foreground/80 hover:text-secondary transition-colors">Our Programs</Link></li>
              <li><Link href="/campaigns" className="text-primary-foreground/80 hover:text-secondary transition-colors">Active Campaigns</Link></li>
              <li><Link href="/events" className="text-primary-foreground/80 hover:text-secondary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/volunteer" className="text-primary-foreground/80 hover:text-secondary transition-colors">Become a Volunteer</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-xl mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin size={20} className="mt-1 text-secondary shrink-0" />
                <span>123 Compassion Street, Hope District, New Delhi 110001, India</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>hello@karunadham.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-semibold text-xl mb-6">Newsletter</h4>
            <p className="text-primary-foreground/80 mb-4 font-light">
              Subscribe to get updates on our programs and stories of impact.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Email address" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-secondary h-12"
              />
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Karuna Dham Foundation. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/60">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
