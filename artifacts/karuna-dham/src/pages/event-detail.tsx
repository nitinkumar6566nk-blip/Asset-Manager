import { useGetEvent, useRegisterForEvent } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

const regSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional()
});

export default function EventDetail() {
  const { id } = useParams();
  const eventId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { data: event, isLoading } = useGetEvent(eventId);
  const registerMutation = useRegisterForEvent();

  const form = useForm<z.infer<typeof regSchema>>({
    resolver: zodResolver(regSchema),
    defaultValues: { name: '', email: '', phone: '' }
  });

  const onSubmit = (data: z.infer<typeof regSchema>) => {
    registerMutation.mutate({
      eventId,
      data
    }, {
      onSuccess: () => {
        setIsRegistered(true);
      },
      onError: (err) => {
        toast({ title: "Error", description: err.error || "Failed to register", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="h-[100dvh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="h-[100dvh] flex items-center justify-center">Event not found</div>;

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isFull = event.registeredCount >= event.maxSeats;

  return (
    <div className="w-full bg-background">
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <Calendar size={100} className="text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                <Link href="/" className="hover:text-foreground">Home</Link> / 
                <Link href="/events" className="hover:text-foreground">Events</Link> / 
                <span className="text-foreground">{event.title}</span>
              </div>
              {event.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold tracking-wider uppercase mb-4">
                  {event.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{event.title}</h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6">About The Event</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-serif font-bold mb-6">Event Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{format(startDate, 'MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{format(startDate, 'EEEE')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}</p>
                      <p className="text-sm text-muted-foreground">IST (Indian Standard Time)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Users size={20} />
                    </div>
                    <div className="w-full">
                      <p className="font-bold text-foreground">Availability</p>
                      <p className="text-sm text-muted-foreground mb-2">{event.maxSeats - event.registeredCount} seats remaining</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(event.registeredCount / event.maxSeats) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isRegistered ? (
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center text-primary">
                  <CheckCircle2 size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Registration Confirmed!</h3>
                  <p className="text-sm opacity-80">We look forward to seeing you there.</p>
                </div>
              ) : isFull ? (
                <div className="bg-muted rounded-3xl p-6 text-center text-muted-foreground font-medium border border-border">
                  Registration Full
                </div>
              ) : (
                <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                  <h3 className="text-xl font-serif font-bold mb-6">Register Now</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem><FormControl><Input placeholder="Full Name" className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem><FormControl><Input placeholder="Email Address" type="email" className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({field}) => (
                        <FormItem><FormControl><Input placeholder="Phone (Optional)" className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" disabled={registerMutation.isPending} className="w-full font-bold">
                        {registerMutation.isPending ? "Registering..." : "Confirm Registration"}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
