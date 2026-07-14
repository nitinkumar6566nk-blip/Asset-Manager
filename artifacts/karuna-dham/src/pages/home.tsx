import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Canvas } from '@react-three/fiber';
import { Heart, ArrowRight, Activity, Users, Leaf, Stethoscope, Droplets, BookOpen, GraduationCap, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetLiveStats, useGetPrograms, useGetRecentDonations } from '@workspace/api-client-react';
import Globe from '@/components/ui/Globe';
import Counter from '@/components/ui/Counter';
import { WebGLErrorBoundary } from '@/components/ui/WebGLErrorBoundary';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function GlobeFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-64 h-64 rounded-full border border-primary/30 opacity-20"
        style={{ boxShadow: '0 0 80px 20px rgba(11,143,98,0.15)' }}
      />
    </div>
  );
}

const programIcons: Record<string, any> = {
  'Orphan Children': Users,
  'Old Age Home': HomeIcon,
  'Education': GraduationCap,
  'Healthcare': Stethoscope,
  'Environment Protection': Leaf,
  'Food Distribution': Activity,
  'Blood Donation': Droplets,
  'Rural Development': BookOpen,
};

export default function Home() {
  const { data: stats } = useGetLiveStats();
  const { data: programs } = useGetPrograms();
  const { data: recentDonations } = useGetRecentDonations();

  return (
    <div className="flex flex-col w-full">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <WebGLErrorBoundary fallback={<GlobeFallback />}>
            {isWebGLAvailable() ? (
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <Globe />
                </Suspense>
              </Canvas>
            ) : (
              <GlobeFallback />
            )}
          </WebGLErrorBoundary>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-foreground/80 via-foreground/50 to-foreground/90 pointer-events-none" />
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-secondary border border-primary/30 text-sm font-medium mb-6 backdrop-blur-sm">
              <Heart size={14} className="fill-secondary text-secondary" />
              Serving Humanity Since 2005
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-background mb-6 tracking-tight leading-tight"
          >
            Compassion <br className="hidden md:block" />
            <span className="text-secondary italic">in Action</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-background/80 max-w-2xl mx-auto mb-10 font-light"
          >
            A sanctuary for the vulnerable. We provide care, dignity, and hope to orphaned children, elderly residents, and those in need.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/donate">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-semibold rounded-full shadow-[0_0_40px_rgba(255,209,102,0.3)] hover:shadow-[0_0_60px_rgba(255,209,102,0.5)] transition-all">
                Make a Donation
              </Button>
            </Link>
            <Link href="/programs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-medium rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                Explore Programs
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-10"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-24 bg-background relative z-20 -mt-8 rounded-t-[3rem] shadow-2xl border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Collective Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Every number represents a life touched, a meal shared, and hope restored.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Counter value={stats?.totalRaised || 15000000} label="Funds Raised" suffix="+" />
            <Counter value={stats?.donationsToday || 450} label="Donations Today" />
            <Counter value={stats?.activeVolunteers || 1200} label="Active Volunteers" suffix="+" />
            <Counter value={stats?.activeCampaigns || 24} label="Active Campaigns" />
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">Areas of Care</h2>
              <p className="text-muted-foreground text-lg">Our holistic approach to community service covers multiple dimensions of social welfare, ensuring no one is left behind.</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="group text-primary font-semibold text-lg">
                View all programs 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs?.slice(0, 6).map((program, i) => {
              const Icon = programIcons[program.title] || Heart;
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={program.imageUrl || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop`} 
                      alt={program.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-background/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-lg">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{program.title}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">{program.description}</p>
                    <Link href={`/programs/${program.id}`}>
                      <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                        Learn More & Donate
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Donations Feed & CTA */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-background leading-tight">
                Be the reason <br/>someone smiles today.
              </h2>
              <p className="text-background/70 text-lg mb-8 max-w-lg font-light leading-relaxed">
                Your contribution directly impacts lives. From providing a warm meal to an elderly resident, to funding a child's education — every rupee counts.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="text-secondary" size={20} />
                    Live Impact Stream
                  </h3>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                  </span>
                </div>
                
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {recentDonations?.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {donation.isAnonymous || !donation.donorName ? 'A' : donation.donorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                          </p>
                          <p className="text-xs text-white/50">Just now</p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-secondary">
                        {donation.currency} {donation.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {(!recentDonations || recentDonations.length === 0) && (
                    <div className="text-center py-4 text-white/50 text-sm">
                      Waiting for new donations...
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-card text-card-foreground p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-border">
                <h3 className="text-2xl font-bold font-serif mb-2">Give Hope</h3>
                <p className="text-muted-foreground mb-8 text-sm">Choose an amount to donate</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <Link key={amt} href={`/donate?amount=${amt}`}>
                      <Button variant="outline" className="w-full h-14 text-lg font-bold border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                        ₹{amt}
                      </Button>
                    </Link>
                  ))}
                </div>
                
                <Link href="/donate">
                  <Button className="w-full h-16 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Donate Custom Amount
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
                  <Heart size={12} className="text-destructive" /> All donations are tax-exempt under 80G.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
