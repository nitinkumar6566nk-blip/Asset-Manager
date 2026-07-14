import { useGetProgram, useGetActiveCampaigns } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Heart, Target, Users, ArrowRight } from 'lucide-react';

export default function ProgramDetail() {
  const { id } = useParams();
  const programId = parseInt(id || "0", 10);
  
  const { data: program, isLoading } = useGetProgram(programId);
  const { data: activeCampaigns } = useGetActiveCampaigns();
  
  const relatedCampaigns = activeCampaigns?.filter(c => c.programId === programId) || [];

  if (isLoading) {
    return <div className="h-[100dvh] flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  if (!program) {
    return <div className="h-[100dvh] flex items-center justify-center">Program not found</div>;
  }

  return (
    <div className="w-full bg-background">
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img 
          src={program.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000&auto=format&fit=crop"} 
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                <Link href="/" className="hover:text-foreground">Home</Link> / 
                <Link href="/programs" className="hover:text-foreground">Programs</Link> / 
                <span className="text-foreground">{program.title}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">{program.title}</h1>
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Supporters</p>
                    <p className="font-bold text-foreground">{program.donorsCount?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
                  <Heart className="text-secondary" size={20} />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Raised</p>
                    <p className="font-bold text-foreground">₹{program.raisedAmount?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">About The Program</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {program.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {relatedCampaigns.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Active Campaigns</h2>
                <div className="space-y-6">
                  {relatedCampaigns.map(campaign => {
                    const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
                    return (
                      <div key={campaign.id} className="bg-card border border-border p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-sm">
                        {campaign.imageUrl && (
                          <img src={campaign.imageUrl} alt={campaign.title} className="w-full md:w-48 h-32 object-cover rounded-xl shrink-0" />
                        )}
                        <div className="flex-1 w-full">
                          <h3 className="text-xl font-bold font-serif mb-2">{campaign.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{campaign.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-primary">₹{campaign.raisedAmount.toLocaleString()} raised</span>
                              <span className="text-muted-foreground">Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-primary/20" />
                          </div>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                          <Link href={`/donate?campaignId=${campaign.id}`}>
                            <Button className="w-full md:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
                              Support
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-3xl p-8 border border-border shadow-xl">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Make an Impact</h3>
              <p className="text-muted-foreground mb-8">Your contribution to {program.title} helps us sustain our efforts and reach more people in need.</p>
              
              <Link href={`/donate?programId=${program.id}`}>
                <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 mb-4">
                  Donate Now
                </Button>
              </Link>
              
              <Link href="/volunteer">
                <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-xl border-border hover:bg-muted">
                  Volunteer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
