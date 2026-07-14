import { useGetActiveCampaigns } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Target, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Campaigns() {
  const { data: campaigns, isLoading } = useGetActiveCampaigns();

  return (
    <div className="w-full bg-background">
      <PageHeader 
        title="Active Campaigns" 
        description="Urgent causes that need your immediate support. Join us in reaching these critical milestones."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Campaigns" }]}
      />

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-3xl border border-border bg-card h-[300px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {campaigns?.map((campaign, i) => {
                const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
                const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
                const daysLeft = endDate ? formatDistanceToNow(endDate) : 'Ongoing';
                
                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row group"
                  >
                    {campaign.imageUrl && (
                      <div className="w-full sm:w-2/5 h-48 sm:h-auto shrink-0 overflow-hidden relative">
                        <img 
                          src={campaign.imageUrl} 
                          alt={campaign.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {progress >= 100 && (
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            Goal Reached!
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6 md:p-8 flex flex-col flex-1 w-full">
                      <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">{campaign.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1">{campaign.description}</p>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-end text-sm">
                          <div>
                            <span className="text-muted-foreground block text-xs uppercase font-bold tracking-wider mb-1">Raised</span>
                            <span className="font-bold text-foreground text-lg">₹{campaign.raisedAmount.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-muted-foreground block text-xs uppercase font-bold tracking-wider mb-1">Goal</span>
                            <span className="font-bold text-foreground">₹{campaign.goalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        <Progress value={progress} className="h-2.5 bg-muted" />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 pb-6 border-b border-border">
                        {campaign.donorsCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-primary" />
                            {campaign.donorsCount} Supporters
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-secondary" />
                          {daysLeft}
                        </div>
                      </div>

                      <Link href={`/donate?campaignId=${campaign.id}`}>
                        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold">
                          Support Campaign
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
              {(!campaigns || campaigns.length === 0) && (
                <div className="col-span-full text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <Target className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
                  <h3 className="text-xl font-serif font-bold text-muted-foreground">No active campaigns</h3>
                  <p className="text-muted-foreground mt-2">Check back later or support our general programs.</p>
                  <Link href="/programs">
                    <Button className="mt-6" variant="outline">View Programs</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
