import { useGetGallery } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

export default function Gallery() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Use category param if not 'all'
  const { data: items, isLoading } = useGetGallery(filter !== 'all' ? { category: filter } : undefined);

  const categories = ['all', 'programs', 'events', 'volunteers', 'facilities'];

  return (
    <div className="w-full bg-background min-h-screen">
      <PageHeader 
        title="Gallery" 
        description="Glimpses of hope, smiles, and compassion from our daily operations."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase transition-all ${
                  filter === c 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-card border border-border rounded-3xl animate-pulse" style={{ height: `${Math.floor(Math.random() * 200) + 200}px` }} />
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {items?.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 10) * 0.1 }}
                  className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer border border-border bg-card"
                  onClick={() => setSelectedImage(item.mediaUrl)}
                >
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-serif font-bold text-xl mb-1">{item.title}</h3>
                    {item.description && <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>}
                  </div>
                  {item.mediaType === 'video' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white pointer-events-none">
                      <Play size={24} className="ml-1" fill="currentColor" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-50"
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
