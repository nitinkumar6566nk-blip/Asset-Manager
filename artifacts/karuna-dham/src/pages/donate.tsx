import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGetPrograms, useCreateDonation } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Heart, IndianRupee, Lock, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const donationSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be at least ₹1'),
  donorName: z.string().optional(),
  donorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  donorPhone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  programId: z.coerce.number().optional(),
  message: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'upi', 'bank_transfer'])
});

type DonationFormValues = z.infer<typeof donationSchema>;

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function Donate() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialProgramId = searchParams.get('programId');
  const initialAmount = searchParams.get('amount');

  const { toast } = useToast();
  const { data: programs } = useGetPrograms();
  const createDonation = useCreateDonation();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: initialAmount ? parseInt(initialAmount) : 2500,
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      isAnonymous: false,
      programId: initialProgramId ? parseInt(initialProgramId) : undefined,
      message: '',
      paymentMethod: 'stripe'
    }
  });

  const isAnonymous = form.watch('isAnonymous');
  const watchAmount = form.watch('amount');

  const onSubmit = (data: DonationFormValues) => {
    createDonation.mutate({
      data: {
        ...data,
        currency: 'INR'
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.error || "Failed to process donation",
          variant: "destructive"
        });
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] pt-32 pb-20 bg-background flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center px-6"
        >
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your generous donation has been received. A receipt has been sent to your email address.
          </p>
          <Button onClick={() => window.location.href = '/'} className="h-12 px-8 rounded-xl text-lg">
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <PageHeader 
        title="Make a Donation" 
        description="Your support helps us provide care, dignity, and hope to those who need it most."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Donate" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
            
            <div className="p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                  
                  {/* Step 1: Amount */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                      <h3 className="text-2xl font-serif font-bold">Select Amount</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {PRESET_AMOUNTS.map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => form.setValue('amount', amt)}
                          className={`h-14 rounded-xl font-bold transition-all border-2 ${
                            watchAmount === amt 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border bg-card hover:border-primary/50 text-foreground'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Amount (₹)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                              <Input type="number" className="pl-12 h-14 text-lg font-bold bg-background" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 2: Allocation */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                      <h3 className="text-2xl font-serif font-bold">Direct Your Support</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="programId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select a Program (Optional)</FormLabel>
                          <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-14 text-base bg-background">
                                <SelectValue placeholder="Where needed most (General Fund)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Where needed most (General Fund)</SelectItem>
                              {programs?.map(p => (
                                <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 3: Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                      <h3 className="text-2xl font-serif font-bold">Your Details</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="isAnonymous"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Make this donation anonymous</FormLabel>
                            <p className="text-sm text-muted-foreground">Your name will not appear on public donor lists</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <AnimatePresence>
                      {!isAnonymous && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                        >
                          <FormField
                            control={form.control}
                            name="donorName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input className="h-12 bg-background" placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="donorEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input type="email" className="h-12 bg-background" placeholder="john@example.com" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="donorPhone"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input className="h-12 bg-background" placeholder="+91 9876543210" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl><Textarea className="min-h-[100px] bg-background" placeholder="Leave a message of support..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 4: Payment */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                      <h3 className="text-2xl font-serif font-bold">Payment Method</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'stripe', label: 'Credit / Debit Card' },
                                { id: 'upi', label: 'UPI / QR Code' },
                                { id: 'bank_transfer', label: 'Bank Transfer' }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => field.onChange(method.id)}
                                  className={`h-16 rounded-xl font-medium border-2 transition-all flex items-center justify-center px-4 ${
                                    field.value === method.id 
                                      ? 'border-primary bg-primary/5 text-primary' 
                                      : 'border-border bg-background hover:border-primary/30 text-foreground'
                                  }`}
                                >
                                  {method.label}
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      disabled={createDonation.isPending}
                      className="w-full h-16 text-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                    >
                      {createDonation.isPending ? (
                        <div className="w-6 h-6 rounded-full border-4 border-secondary-foreground border-t-transparent animate-spin"></div>
                      ) : (
                        <>
                          <Heart size={24} className="fill-current" />
                          Donate ₹{watchAmount?.toLocaleString() || 0}
                        </>
                      )}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                      <Lock size={14} /> Secure, encrypted transaction.
                    </p>
                  </div>

                </form>
              </Form>
            </div>
            
            <div className="bg-primary/5 p-8 border-t border-border flex items-start gap-4">
              <Info className="text-primary shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-bold text-foreground mb-1">Tax Exemption</p>
                All donations to Karuna Dham Foundation are eligible for 50% tax exemption under Section 80G of the Income Tax Act, 1961. Your tax receipt will be emailed to you immediately after the transaction is successful.
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
