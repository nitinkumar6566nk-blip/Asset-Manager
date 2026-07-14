import { PageHeader } from '@/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRegisterVolunteer } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const volunteerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  skills: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
  bio: z.string().optional()
});

export default function Volunteer() {
  const { toast } = useToast();
  const registerMutation = useRegisterVolunteer();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof volunteerSchema>>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { name: '', email: '', phone: '', location: '', availability: '', skills: [], bio: '' }
  });

  const onSubmit = (data: z.infer<typeof volunteerSchema>) => {
    registerMutation.mutate({ data }, {
      onSuccess: () => setIsSuccess(true),
      onError: (err) => toast({ title: "Error", description: err.error || "Registration failed", variant: "destructive" })
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] pt-32 pb-20 bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center px-6">
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Welcome to the Team!</h1>
          <p className="text-muted-foreground text-lg mb-8">Your application has been received. Our volunteer coordinator will contact you shortly.</p>
          <Button onClick={() => window.location.href = '/'} className="h-12 px-8 rounded-xl text-lg">Return to Home</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <PageHeader 
        title="Become a Volunteer" 
        description="Give the most valuable gift of all — your time. Join our community of changemakers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Volunteer" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div>
              <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-8">
                <HeartHandshake size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Why Volunteer With Us?</h2>
              <div className="space-y-8 text-lg text-muted-foreground">
                <p>Volunteering at Karuna Dham is more than just service; it's a journey of self-discovery and profound connection.</p>
                
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-foreground block">Direct Impact</strong>
                      Work directly with children, elderly, and those in need. See the smiles you create.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-foreground block">Skill Development</strong>
                      Gain experience in event management, teaching, healthcare assistance, and social work.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-foreground block">Community</strong>
                      Join a family of passionate, like-minded individuals dedicated to making a difference.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-8">Volunteer Application</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({field}) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({field}) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" className="bg-background" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({field}) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({field}) => (
                      <FormItem><FormLabel>City / Location</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="availability" render={({field}) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl><Input placeholder="e.g., Weekends, 2 hours/week" className="bg-background" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="skills" render={({field: { onChange, value, ...field }}) => (
                    <FormItem>
                      <FormLabel>Skills & Expertise</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Teaching, Medical, Photography, Social Media (comma separated)" 
                          className="bg-background" 
                          onChange={(e) => {
                            // Keep as string for the input, transform in zod
                            onChange(e.target.value);
                          }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="bio" render={({field}) => (
                    <FormItem>
                      <FormLabel>Tell us about yourself</FormLabel>
                      <FormControl><Textarea className="min-h-[100px] bg-background" placeholder="Why do you want to volunteer with us?" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={registerMutation.isPending} className="w-full h-14 text-lg font-bold">
                    {registerMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
