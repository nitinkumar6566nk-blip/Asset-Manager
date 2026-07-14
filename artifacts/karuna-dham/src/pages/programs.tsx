import { useGetPrograms } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Heart, Users, Home, GraduationCap, Stethoscope, Leaf, Activity, Droplets, BookOpen, Shield, Bird } from 'lucide-react';

const iconMap: Record<string, any> = {
  'Orphan Children': Users,
  'Old Age Home': Home,
  'Education': GraduationCap,
  'Healthcare': Stethoscope,
  'Environment Protection': Leaf,
  'Food Distribution': Activity,
  'Blood Donation': Droplets,
  'Rural Development': BookOpen,
  'Women Empowerment': Shield,
  'Animal Welfare': Bird,
  'Disaster Relief': Heart
};

export default function Programs() {
  const { data: programs, isLoading } = useGetPrograms();

  return (
    <div className="w-full">
      <PageHeader 
        title="Our Programs" 
        description="Discover the different ways we serve the community and how you can be a part of it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Programs" }]}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-3xl border border-border bg-card h-[500px] animate-pulse">
                  <div className="h-64 bg-muted rounded-t-3xl" />
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs?.map((program, i) => {
                const Icon = iconMap[program.title] || Heart;
                
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col"
                  >
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <img 
                        src={program.imageUrl || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop`} 
                        alt={program.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-background/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-lg">
                        <Icon size={24} />
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors text-foreground">{program.title}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">{program.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border mb-6">
                        <div className="text-sm">
                          <span className="block text-muted-foreground font-medium">Raised</span>
                          <span className="font-bold text-foreground">₹{program.raisedAmount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="text-sm text-right">
                          <span className="block text-muted-foreground font-medium">Donors</span>
                          <span className="font-bold text-foreground">{program.donorsCount || 0}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/programs/${program.id}`} className="flex-1">
                          <Button variant="outline" className="w-full rounded-xl">
                            Details
                          </Button>
                        </Link>
                        <Link href={`/donate?programId=${program.id}`} className="flex-1">
                          <Button className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Donate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
