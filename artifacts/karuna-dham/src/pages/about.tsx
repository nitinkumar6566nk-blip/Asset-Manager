import { PageHeader } from '@/components';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  Award, Target, Eye, Heart, Shield, Users, Leaf, BookOpen,
  CheckCircle2, Phone, Mail, ArrowRight, Star, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetSiteStats } from '@workspace/api-client-react';
import Counter from '@/components/ui/Counter';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

// ─── Data ──────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description:
      'We act with empathy and kindness, recognising the inherent dignity of every living being — from the youngest child to the oldest elder.',
    color: 'text-rose-500 bg-rose-50',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description:
      'We uphold the highest standards of transparency and accountability. Every rupee received is accounted for and reported publicly.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description:
      'We serve without discrimination across caste, religion, gender, or age — fostering a sense of belonging for all.',
    color: 'text-purple-500 bg-purple-50',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'Our programmes are designed for lasting impact, not short-term relief. We invest in livelihoods, education, and community ownership.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: BookOpen,
    title: 'Education',
    description:
      'Knowledge is the most powerful tool for change. We believe every child deserves quality education regardless of economic background.',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    icon: Globe,
    title: 'Community',
    description:
      'Real change happens at the community level. We empower local leaders, volunteers, and families to be drivers of their own transformation.',
    color: 'text-teal-500 bg-teal-50',
  },
];

const timeline = [
  {
    year: '2005',
    title: 'Foundation Laid',
    desc: 'Karuna Dham was established with a humble food distribution drive in New Delhi, serving 50 families every Sunday.',
    icon: '🌱',
  },
  {
    year: '2008',
    title: 'First Orphanage',
    desc: 'Opened our first children\'s shelter, providing 20 abandoned children with safe homes, education, and unconditional love.',
    icon: '🏠',
  },
  {
    year: '2012',
    title: 'Vridh Ashram Launched',
    desc: 'Started our elderly care centre "Vridh Ashram" to provide dignified shelter and medical care to abandoned senior citizens.',
    icon: '💛',
  },
  {
    year: '2015',
    title: '80G & FCRA Certification',
    desc: 'Received Income Tax 80G certification and FCRA registration, enabling tax-exempt donations and international funding.',
    icon: '📜',
  },
  {
    year: '2018',
    title: 'Presidential Recognition',
    desc: 'Honoured with the National Award for Outstanding Social Service by the President of India at Rashtrapati Bhavan.',
    icon: '🏆',
  },
  {
    year: '2021',
    title: 'COVID Relief Drive',
    desc: 'Mobilised 500+ volunteers to deliver 1,20,000 meals, oxygen cylinders, and medicine kits across 3 states during the pandemic.',
    icon: '🤝',
  },
  {
    year: '2025',
    title: 'Expanding Horizons',
    desc: 'Launched nationwide disaster relief, environmental protection, and digital literacy programmes reaching 12 states.',
    icon: '🚀',
  },
];

const team = [
  {
    name: 'Sri Ram Prasad',
    role: 'Founder & Chairman',
    bio: 'A retired IAS officer with 30 years of public service, Sri Ram Prasad founded Karuna Dham after witnessing extreme poverty firsthand in rural India.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    since: 'Since 2005',
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Executive Director',
    bio: 'With a PhD in Social Work from JNU and 15 years of NGO leadership, Dr. Priya oversees all programmes and strategic partnerships.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    since: 'Since 2010',
  },
  {
    name: 'Ankit Verma',
    role: 'Head of Operations',
    bio: 'A supply-chain expert who left a corporate career to manage Karuna Dham\'s logistics, ensuring efficient delivery across all 12 states we serve.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    since: 'Since 2016',
  },
  {
    name: 'Sunita Devi',
    role: 'Director of Women Empowerment',
    bio: 'A grassroots activist and Padma Shri awardee who leads our self-help groups, skill training, and women\'s health initiatives.',
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&auto=format&fit=crop',
    since: 'Since 2013',
  },
];

const certifications = [
  { label: 'NITI Aayog Registered', sub: 'Reg. No. DL/2005/0098765' },
  { label: '80G Tax Exemption', sub: 'Income Tax Act, 50% deductible' },
  { label: 'FCRA Certified', sub: 'Foreign Contribution accepted' },
  { label: 'ISO 9001:2015', sub: 'Quality Management Certified' },
  { label: 'GuideStar Platinum', sub: 'Transparency certified NGO' },
  { label: 'Presidential Award', sub: 'Outstanding Social Service 2018' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function About() {
  const { data: stats } = useGetSiteStats({});

  const impactNumbers = [
    { value: stats?.mealsServed ?? 125000, label: 'Meals Served', suffix: '+' },
    { value: stats?.childrenHelped ?? 3800, label: 'Children Helped', suffix: '+' },
    { value: stats?.oldAgeResidents ?? 240, label: 'Elderly in Care', suffix: '+' },
    { value: stats?.volunteers ?? 0, label: 'Active Volunteers', suffix: '+' },
    { value: stats?.medicalCamps ?? 85, label: 'Medical Camps', suffix: '+' },
    { value: stats?.treesPlanted ?? 12000, label: 'Trees Planted', suffix: '+' },
  ];

  return (
    <div className="w-full bg-background">
      <PageHeader
        title="About Us"
        description="Two decades of compassion, service, and transforming lives across India."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* ── Our Story ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp()} className="relative">
              <div className="relative rounded-3xl overflow-hidden h-[520px] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop"
                  alt="Karuna Dham volunteers serving community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">Our Founder</p>
                  <h3 className="text-2xl font-serif font-bold">Sri Ram Prasad</h3>
                  <p className="text-white/70 text-sm mt-1">Retired IAS Officer · Chairman, Karuna Dham Foundation</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl">
                <p className="text-3xl font-bold font-mono">20+</p>
                <p className="text-xs text-primary-foreground/80 font-medium">Years of Service</p>
              </div>
            </motion.div>

            <div className="space-y-8">
              <motion.div {...fadeUp(0.1)}>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight mb-6">
                  Born from one man's grief,<br />
                  <span className="text-primary">grown into a nation's hope</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  In 2005, Sri Ram Prasad saw an elderly woman die on a Delhi footpath — alone, hungry, and forgotten. A retired IAS officer with 30 years of service behind him, he asked himself: <em>"What was all that service worth if this could still happen?"</em>
                </p>
              </motion.div>

              <motion.p {...fadeUp(0.2)} className="text-muted-foreground text-lg leading-relaxed">
                That Sunday, he cooked 50 meals with his wife and served them in the neighbourhood. The next Sunday, neighbours joined. Within a year, Karuna Dham Foundation was born — a registered NGO with a clear mission: no one in our reach should go hungry, uncared for, or unloved.
              </motion.p>

              <motion.p {...fadeUp(0.25)} className="text-muted-foreground text-lg leading-relaxed">
                Today, we operate across 12 states, running orphanages, elderly care centres, medical camps, women's skill centres, and environmental drives — all funded by the generosity of thousands of donors and powered by hundreds of volunteers.
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-muted/50 rounded-2xl p-5 border border-border">
                  <Target className="text-primary mb-3" size={28} />
                  <h4 className="font-serif font-bold text-lg mb-2">Our Mission</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To alleviate suffering and empower the vulnerable through holistic care, education, and sustainable support.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-5 border border-border">
                  <Eye className="text-secondary mb-3" size={28} />
                  <h4 className="font-serif font-bold text-lg mb-2">Our Vision</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A compassionate India where poverty, hunger, and abandonment are replaced by community and dignity.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact Numbers ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Our Impact in Numbers</h2>
            <p className="text-primary-foreground/70 text-lg">Every number here represents a real life touched.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {impactNumbers.map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp(i * 0.07)}
                className="text-center bg-primary-foreground/10 rounded-2xl p-6 border border-primary-foreground/20"
              >
                <div className="text-3xl md:text-4xl font-bold font-mono text-secondary mb-2">
                  <Counter end={item.value} suffix={item.suffix} />
                </div>
                <p className="text-primary-foreground/70 text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide every decision, every programme, and every act of service.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i * 0.08)}
                className="bg-card rounded-2xl p-7 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${v.color}`}>
                  <v.icon size={22} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">The People Behind the Mission</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Leadership Team</h2>
            <p className="text-muted-foreground text-lg">Dedicated professionals who left successful careers to serve those in need.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp(i * 0.1)}
                className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                    {member.since}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg leading-tight">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey / Timeline ───────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Milestones of Hope</h2>
            <p className="text-muted-foreground text-lg">Twenty years of relentless compassion, one milestone at a time.</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  {...fadeUp(i * 0.05)}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                    <div className={`bg-card rounded-2xl border border-border p-6 shadow-sm inline-block text-left max-w-sm ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                      <h3 className="font-serif font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Year bubble (center) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary text-primary-foreground flex-col items-center justify-center shadow-lg z-10 shrink-0">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-bold mt-0.5">{item.year}</span>
                  </div>

                  {/* Mobile: year pill */}
                  <div className="flex md:hidden items-center gap-3 ml-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-bold text-primary text-sm">{item.year} — {item.title}</span>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Trust & Transparency</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Registered, Certified & Recognised</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We are fully compliant, independently audited, and publicly accountable. Your trust is our most important asset.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.label}
                {...fadeUp(i * 0.07)}
                className="bg-muted/40 rounded-2xl p-5 border border-border text-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <CheckCircle2 className="mx-auto mb-3 text-primary" size={28} />
                <p className="font-semibold text-sm text-foreground mb-1">{cert.label}</p>
                <p className="text-xs text-muted-foreground">{cert.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial quote ────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div {...fadeUp()} className="text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-secondary fill-secondary" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-relaxed mb-8 italic">
              "Karuna Dham didn't just feed me — they gave me back my dignity, my purpose, and my family."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=100&auto=format&fit=crop"
                alt="Ramesh Kumar"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
              />
              <div className="text-left">
                <p className="font-bold text-foreground">Ramesh Kumar</p>
                <p className="text-sm text-muted-foreground">Resident, Vridh Ashram Delhi · Since 2016</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                Be part of the story.<br />
                <span className="text-secondary">Your chapter starts today.</span>
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                Whether you donate, volunteer, or simply spread the word — every act of kindness multiplies into something greater. Join 5,000+ changemakers who have chosen compassion over indifference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild className="text-foreground font-bold">
                  <Link href="/donate">
                    <Heart size={18} className="mr-2" /> Donate Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/volunteer">
                    <Users size={18} className="mr-2" /> Volunteer With Us
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="space-y-4">
              <div className="bg-primary-foreground/10 rounded-2xl border border-primary-foreground/20 p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary-foreground">Call Us</p>
                  <p className="text-primary-foreground/70 text-sm">+91 78277 72775 · +91 98109 19118</p>
                  <p className="text-primary-foreground/50 text-xs mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>
              <div className="bg-primary-foreground/10 rounded-2xl border border-primary-foreground/20 p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary-foreground">Email Us</p>
                  <a href="mailto:karunadhamfoundation@gmail.com" className="text-secondary hover:underline text-sm">
                    karunadhamfoundation@gmail.com
                  </a>
                  <p className="text-primary-foreground/50 text-xs mt-0.5">We reply within 24 hours</p>
                </div>
              </div>
              <div className="bg-primary-foreground/10 rounded-2xl border border-primary-foreground/20 p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary-foreground">Annual Report</p>
                  <p className="text-primary-foreground/70 text-sm">Download our audited financial report and impact assessment.</p>
                  <button className="text-secondary text-xs hover:underline flex items-center gap-1 mt-1">
                    Download 2024–25 Report <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
