import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Heart, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGetAuthUser } from '@workspace/api-client-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: user } = useGetAuthUser();

  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // On home page before scroll: use white text on dark hero
  // After scroll (or not on home): use normal foreground text
  const transparent = isHome && !isScrolled;

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
  ];

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location === href
        ? 'text-primary'
        : transparent
        ? 'text-white/90 hover:text-secondary'
        : 'text-foreground/80 hover:text-primary'
    }`;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : isHome
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Heart size={20} fill="currentColor" />
            </div>
            <span
              className={`font-serif font-bold text-xl tracking-tight transition-colors ${
                transparent ? 'text-white' : 'text-foreground'
              }`}
            >
              Karuna Dham
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right — Contact button + Auth + Donate */}
          <div className="hidden md:flex items-center gap-3">
            {/* Contact — styled as a ghost button so it's clearly clickable */}
            <Link href="/contact">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 font-medium transition-colors ${
                  transparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10 border border-white/20'
                    : location === '/contact'
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                <Phone size={14} />
                Contact Us
              </Button>
            </Link>

            {user ? (
              <Link href={user.roles?.includes('admin') ? '/admin' : '/dashboard'}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`font-medium ${transparent ? 'border-white/30 text-white hover:bg-white/10' : ''}`}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`font-medium ${transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => (window.location.href = '/api/login')}
              >
                Sign in
              </Button>
            )}

            <Link href="/donate">
              <Button className="font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all shadow-md shadow-secondary/20">
                Donate Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 z-50 transition-colors ${transparent ? 'text-white' : 'text-foreground'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {/* Home */}
              <Link
                href="/"
                className={`text-xl font-serif font-medium py-3 border-b border-border ${
                  location === '/' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Home
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xl font-serif font-medium py-3 border-b border-border ${
                    location === link.href ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Contact as a prominent row */}
              <Link
                href="/contact"
                className={`text-xl font-serif font-medium py-3 border-b border-border flex items-center gap-2 ${
                  location === '/contact' ? 'text-primary' : 'text-foreground'
                }`}
              >
                <Phone size={18} className="text-primary" />
                Contact Us
              </Link>

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <Link href={user.roles?.includes('admin') ? '/admin' : '/dashboard'}>
                    <Button variant="outline" className="w-full text-base h-12">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-base h-12"
                    onClick={() => (window.location.href = '/api/login')}
                  >
                    Sign in
                  </Button>
                )}

                <Link href="/donate">
                  <Button className="w-full text-base h-14 bg-secondary text-secondary-foreground font-bold">
                    💚 Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
