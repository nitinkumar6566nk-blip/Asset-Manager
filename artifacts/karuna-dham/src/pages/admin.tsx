import { useGetAuthUser, useGetAdminDashboard } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { IndianRupee, Users, Mail, Heart, LayoutDashboard, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data for visual since the API doesn't provide time-series
const mockChartData = [
  { name: 'Jan', donations: 400000 },
  { name: 'Feb', donations: 300000 },
  { name: 'Mar', donations: 550000 },
  { name: 'Apr', donations: 450000 },
  { name: 'May', donations: 700000 },
  { name: 'Jun', donations: 650000 },
];

export default function Admin() {
  const { data: user, isLoading: isUserLoading } = useGetAuthUser();
  const { data: dashboard, isLoading: isDashLoading } = useGetAdminDashboard({
    query: { enabled: !!user?.roles?.includes('admin') }
  });

  if (isUserLoading) return <div className="h-[100dvh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!user || !user.roles?.includes('admin')) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-destructive mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-8">You do not have administrative privileges.</p>
        <Button onClick={() => window.location.href = '/'} variant="outline">Return Home</Button>
      </div>
    );
  }

  if (isDashLoading) return <div className="h-[100dvh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col pt-24 shrink-0">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary font-bold">
            <LayoutDashboard size={18} className="mr-3" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Heart size={18} className="mr-3" /> Donations
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Users size={18} className="mr-3" /> Volunteers
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Mail size={18} className="mr-3" /> Messages
          </Button>
          <div className="my-4 border-t border-border" />
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Settings size={18} className="mr-3" /> Settings
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 pt-24">
        <h1 className="text-3xl font-serif font-bold mb-8">Admin Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><IndianRupee size={20}/></div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Donations</p>
            <h3 className="text-2xl font-bold font-mono text-foreground">₹{dashboard?.totalDonations.toLocaleString() || 0}</h3>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center"><Heart size={20}/></div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Donors</p>
            <h3 className="text-2xl font-bold text-foreground">{dashboard?.totalDonors.toLocaleString() || 0}</h3>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center"><Users size={20}/></div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Volunteers</p>
            <h3 className="text-2xl font-bold text-foreground">{dashboard?.totalVolunteers.toLocaleString() || 0}</h3>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><Mail size={20}/></div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Pending Messages</p>
            <h3 className="text-2xl font-bold text-foreground">{dashboard?.pendingMessages.toLocaleString() || 0}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-6">Donation Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="donations" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {dashboard?.recentDonations.slice(0, 5).map(d => (
                <div key={d.id} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {d.isAnonymous ? 'A' : (d.donorName?.charAt(0) || 'U')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
                      <p className="text-xs text-muted-foreground">Donation</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-secondary">₹{d.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
