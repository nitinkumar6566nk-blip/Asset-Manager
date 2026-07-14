import { PageHeader } from '@/components';
import { motion } from 'framer-motion';
import { Award, Target, Eye, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      title: "Compassion",
      description: "We act with empathy and kindness, recognizing the inherent dignity of every living being.",
      icon: Heart
    },
    {
      title: "Integrity",
      description: "We uphold the highest standards of transparency, accountability, and ethical conduct.",
      icon: Shield
    },
    {
      title: "Inclusivity",
      description: "We serve without discrimination, embracing diversity and fostering a sense of belonging.",
      icon: Users
    }
  ];

  const timeline = [
    { year: "2005", title: "Foundation Laid", desc: "Karuna Dham was established with a small food distribution drive in New Delhi." },
    { year: "2008", title: "First Orphanage", desc: "Opened our doors to 20 children, providing them shelter, education, and love." },
    { year: "2012", title: "Elderly Care Center", desc: "Started our 'Vridh Ashram' to support abandoned elderly citizens." },
    { year: "2018", title: "National Recognition", desc: "Received the Presidential Award for outstanding social service." },
    { year: "2023", title: "Expanding Horizons", desc: "Launched nationwide disaster relief and environmental protection programs." }
  ];

  return (
    <div className="w-full">
      <PageHeader 
        title="Our Story" 
        description="A journey of compassion, resilience, and transforming lives since 2005."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden h-[600px] shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop" 
                alt="Karuna Dham Community" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-serif font-bold mb-2">Sri Ram Prasad</h3>
                <p className="text-white/80">Founder & Chairman</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <Target size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To alleviate suffering and empower the vulnerable by providing holistic care, education, and sustainable support systems. We strive to create a society where every individual has access to basic needs, dignity, and opportunities for growth.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/20 text-secondary mb-6">
                  <Eye size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A world driven by compassion where poverty, hunger, and abandonment are replaced by community, prosperity, and love. We envision a future where Karuna Dham is a beacon of hope across the nation.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Our Core Values</h2>
            <p className="text-primary-foreground/80 text-lg">The principles that guide our actions and shape our culture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-3xl p-8 backdrop-blur-sm"
              >
                <value.icon size={40} className="text-secondary mb-6" />
                <h3 className="text-2xl font-serif font-bold mb-4">{value.title}</h3>
                <p className="text-primary-foreground/80 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground">Our Journey</h2>
            <p className="text-muted-foreground text-lg">Milestones of hope we've crossed together.</p>
          </div>

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div 
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col md:flex-row gap-6 md:gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-auto`}>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center z-10 shadow-lg relative">
                  <span className="font-bold text-primary text-xl">{item.year}</span>
                  {i !== timeline.length - 1 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-24 bg-primary/20 -z-10 hidden md:block" />
                  )}
                </div>
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
