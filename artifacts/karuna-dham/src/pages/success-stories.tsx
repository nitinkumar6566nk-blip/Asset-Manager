import { useGetTestimonials } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useCallback } from 'react';

export default function SuccessStories() {
  const { data: testimonials, isLoading } = useGetTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const approvedTestimonials = testimonials?.filter(t => t.isApproved) || [];

  return (
    <div className="w-full bg-background min-h-[100dvh]">
      <PageHeader 
        title="Success Stories" 
        description="Real voices, real impact. Hear from those whose lives have been touched by our collective efforts."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Success Stories" }]}
      />

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Quote className="mx-auto text-primary/20 mb-6" size={64} />
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground">Voices of Hope</h2>
            <p className="text-muted-foreground text-lg">Every story is a testament to the power of compassion and community support.</p>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : approvedTestimonials.length > 0 ? (
            <div className="relative max-w-5xl mx-auto">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {approvedTestimonials.map((t) => (
                    <div key={t.id} className="flex-[0_0_100%] md:flex-[0_0_80%] min-w-0 px-4">
                      <div className="bg-card border border-border p-8 md:p-12 rounded-[3rem] shadow-xl text-center relative mt-12">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted shadow-lg">
                          {t.imageUrl ? (
                            <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-serif font-bold text-muted-foreground">
                              {t.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center gap-1 mb-6 mt-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} className={i < t.rating ? "fill-secondary text-secondary" : "text-muted"} />
                          ))}
                        </div>
                        
                        <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/80 italic mb-8">
                          "{t.content}"
                        </p>
                        
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{t.name}</h4>
                          <p className="text-sm text-primary font-bold uppercase tracking-wider">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-10">
                <button onClick={scrollPrev} className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                  &larr;
                </button>
                <button onClick={scrollNext} className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                  &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              No stories available yet.
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
