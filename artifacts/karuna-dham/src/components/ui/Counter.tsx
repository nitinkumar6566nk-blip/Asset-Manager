import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Counter({ 
  value, 
  duration = 2,
  label,
  suffix = ""
}: { 
  value: number; 
  duration?: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2"
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
