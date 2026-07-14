import { useGetBlog } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { PageHeader } from '@/components';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, isLoading } = useGetBlog(slug || "");

  if (isLoading) return <div className="h-[100dvh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!post) return <div className="h-[100dvh] flex items-center justify-center">Article not found</div>;

  return (
    <div className="w-full bg-background">
      <div className="relative pt-32 pb-20 overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-background text-primary border border-border text-xs font-bold tracking-wider uppercase shadow-sm">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border/50 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold overflow-hidden">
                {post.authorImage ? <img src={post.authorImage} alt="" className="w-full h-full object-cover" /> : post.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground">{post.authorName}</p>
                <p>Author</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-border hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        {post.imageUrl && (
          <div className="w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-border">
            <img src={post.imageUrl} alt={post.title} className="w-full h-[400px] md:h-[500px] object-cover" />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-12">
          {/* Share sidebar */}
          <div className="md:w-16 shrink-0 flex md:flex-col gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest md:rotate-180 md:[writing-mode:vertical-rl] mb-2 md:mb-6">Share</span>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-primary">
              <Facebook size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-primary">
              <Twitter size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-primary">
              <Linkedin size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-primary">
              <Share2 size={18} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {post.content}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                <span className="font-bold text-sm mr-2 py-2">Tags:</span>
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
