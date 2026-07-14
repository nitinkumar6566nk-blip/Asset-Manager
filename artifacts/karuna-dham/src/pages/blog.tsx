import { useGetBlogs } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Blog() {
  const { data: blogs, isLoading } = useGetBlogs();

  return (
    <div className="w-full bg-background">
      <PageHeader 
        title="Stories of Impact" 
        description="Read about our latest initiatives, volunteer experiences, and beneficiary stories."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[450px] bg-card border border-border rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs?.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-64 overflow-hidden shrink-0 relative">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground/30 font-serif text-4xl">KD</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary border border-border">
                      {post.category}
                    </div>
                  </Link>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {post.readTime} min read</span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors text-foreground line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold overflow-hidden shrink-0">
                          {post.authorImage ? <img src={post.authorImage} alt="" className="w-full h-full object-cover" /> : post.authorName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{post.authorName}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="text-primary hover:text-primary/80 transition-colors">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
