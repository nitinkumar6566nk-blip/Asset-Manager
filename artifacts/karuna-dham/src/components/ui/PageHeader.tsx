import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({ title, description, image, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-primary/5">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      
      {image && (
        <div className="absolute inset-0 z-[-1] opacity-20">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
        {breadcrumbs && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-6"
          >
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-primary">{crumb.label}</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight mb-6"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
