import { PageHeader } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
});

export default function Contact() {
  const { toast } = useToast();
  const sendMsg = useSendContactMessage();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    sendMsg.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "We'll get back to you shortly.",
          });
          form.reset();
        },
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to send message",
            variant: "destructive",
          }),
      },
    );
  };

  const faqs = [
    {
      q: "How can I donate to Karuna Dham?",
      a: "You can donate securely online via our Donate page using credit cards, UPI, or bank transfer. All donations are 80G tax-exempt.",
    },
    {
      q: "Can I visit the Old Age Home or Orphanage?",
      a: "Yes, we welcome visitors! Please contact us at least 48 hours in advance to schedule a visit so we can ensure staff availability to guide you.",
    },
    {
      q: "How do I become a volunteer?",
      a: "Fill out the application on our Volunteer page. Our coordinator will reach out to discuss current opportunities that match your skills and availability.",
    },
    {
      q: "Do you accept in-kind donations?",
      a: "Yes, we accept clothes, blankets, books, and non-perishable food items. Please ensure items are in good condition. Contact our office for drop-off details.",
    },
  ];

  return (
    <div className="w-full bg-background">
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you. Reach out with questions, suggestions, or just to say hello."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info & Map */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                  <MapPin className="text-primary mb-4" size={32} />
                  <h3 className="font-serif font-bold text-xl mb-2">
                    Visit Us
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    123 Compassion Street
                    <br />
                    Hope District
                    <br />
                    New Delhi 110027, India
                  </p>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                  <Phone className="text-primary mb-4" size={32} />
                  <h3 className="font-serif font-bold text-xl mb-2">Call Us</h3>
                  <p className="text-muted-foreground text-sm">
                    +91 78277 72775
                    <br />
                    +91 98 1091 9118
                  </p>
                  <Button
                    variant="link"
                    className="px-0 mt-2 text-primary"
                    onClick={() => window.open("https://wa.me/917827772775")}
                  >
                    <MessageSquare size={16} className="mr-2" /> WhatsApp Us
                  </Button>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm md:col-span-2">
                  <Mail className="text-primary mb-4" size={32} />
                  <h3 className="font-serif font-bold text-xl mb-2">
                    Email Us
                  </h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    General Inquiries:{" "}
                    <a
                      href="mailto:karunadhamfoundation@gmail.com"
                      className="text-primary underline"
                    >
                      karunadhamfoundation@gmail.com
                    </a>
                  </p>

                  <p className="text-muted-foreground text-sm">
                    Donation Support:{" "}
                    <a
                      href="mailto:karunadhamfoundation@gmail.com?subject=Donation%20Support"
                      className="text-primary underline"
                    >
                      karunadhamfoundation@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-[300px] bg-muted rounded-3xl overflow-hidden border border-border relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="text-center z-10">
                  <MapPin size={48} className="mx-auto text-primary/40 mb-2" />
                  <p className="text-muted-foreground font-medium">
                    Google Maps Embed Placeholder
                  </p>
                </div>
              </div>
            </div>

            {/* Form & FAQ */}
            <div className="space-y-12">
              <div className="bg-card p-8 rounded-3xl border border-border shadow-xl">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Send a Message
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Your Name"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Email Address"
                                type="email"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Phone (Optional)"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Subject"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Your message..."
                              className="min-h-[120px] bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={sendMsg.isPending}
                      className="w-full"
                    >
                      {sendMsg.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left font-serif font-bold text-lg hover:text-primary">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
