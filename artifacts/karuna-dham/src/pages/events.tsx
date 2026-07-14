import { useGetEvents } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const { data: events, isLoading } = useGetEvents();

  return (
    <div className="w-full bg-background">
      <PageHeader 
        title="Upcoming Events" 
        description="Join us in our upcoming drives, fundraisers, and community gatherings."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-[400px] bg-card border border-border rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map((event, i) => {
                const startDate = new Date(event.startDate);
                const isFull = event.registeredCount >= event.maxSeats;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="h-56 relative overflow-hidden shrink-0 bg-muted">
                      {event.imageUrl ? (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <Calendar size={64} />
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-lg border border-border">
                        <span className="block text-xs font-bold text-primary uppercase">{format(startDate, 'MMM')}</span>
                        <span className="block text-xl font-bold leading-none">{format(startDate, 'dd')}</span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      {event.category && (
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 block">
                          {event.category}
                        </span>
                      )}
                      <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1">
                        {event.description}
                      </p>
                      
                      <div className="space-y-3 mb-8 pt-6 border-t border-border">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Calendar className="text-primary shrink-0" size={16} />
                          <span>{format(startDate, 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <MapPin className="text-primary shrink-0" size={16} />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Users className="text-primary shrink-0" size={16} />
                          <span>
                            {event.registeredCount} / {event.maxSeats} Registered
                          </span>
                        </div>
                      </div>

                      <Link href={`/events/${event.id}`}>
                        <Button 
                          className="w-full rounded-xl group-hover:bg-primary" 
                          variant={isFull ? "secondary" : "default"}
                          disabled={isFull}
                        >
                          {isFull ? "Event Full" : "Register Now"}
                          {!isFull && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
              {(!events || events.length === 0) && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No upcoming events right now. Check back later!
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
