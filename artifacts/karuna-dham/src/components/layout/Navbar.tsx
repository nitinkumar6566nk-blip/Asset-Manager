import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGetAuthUser } from '@workspace/api-client-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: user } = useGetAuthUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Heart size={20} fill="currentColor" />
            </div>
            <span className="font-serif font-bold text-xl md:text-2xl text-foreground tracking-tight">
              Karuna Dham
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href={user.roles?.includes('admin') ? '/admin' : '/dashboard'}>
                <Button variant="outline" className="font-medium">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" className="font-medium" onClick={() => window.location.href = '/api/login'}>
                Sign in
              </Button>
            )}
            <Link href="/donate">
              <Button className="font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all shadow-md shadow-secondary/20">
                Donate Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 z-50 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-serif font-medium ${
                    location === link.href ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-border my-4" />
              
              {user ? (
                <Link href={user.roles?.includes('admin') ? '/admin' : '/dashboard'}>
                  <Button variant="outline" className="w-full justify-start text-lg h-12">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full justify-start text-lg h-12" onClick={() => window.location.href = '/api/login'}>
                  Sign in
                </Button>
              )}
              
              <Link href="/donate">
                <Button className="w-full justify-center text-lg h-14 bg-secondary text-secondary-foreground">
                  Donate Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
