import { Suspense } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { RootLayout } from '@/components';

// Pages
import Home from '@/pages/home';
import About from '@/pages/about';
import Programs from '@/pages/programs';
import ProgramDetail from '@/pages/program-detail';
import Donate from '@/pages/donate';
import Campaigns from '@/pages/campaigns';
import Blog from '@/pages/blog';
import BlogDetail from '@/pages/blog-detail';
import Events from '@/pages/events';
import EventDetail from '@/pages/event-detail';
import Gallery from '@/pages/gallery';
import Volunteer from '@/pages/volunteer';
import Contact from '@/pages/contact';
import SuccessStories from '@/pages/success-stories';
import Dashboard from '@/pages/dashboard';
import Admin from '@/pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <RootLayout>
      <Suspense fallback={<div className="h-[100dvh] w-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:id" component={ProgramDetail} />
          <Route path="/donate" component={Donate} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogDetail} />
          <Route path="/events" component={Events} />
          <Route path="/events/:id" component={EventDetail} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/contact" component={Contact} />
          <Route path="/success-stories" component={SuccessStories} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </RootLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
