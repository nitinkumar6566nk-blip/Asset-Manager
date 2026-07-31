import { useGetAuthUser, useGetAdminDashboard } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { IndianRupee, Users, Mail, Heart, LayoutDashboard, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'wouter';

export default function Admin() {
  const { data: user, isLoading: isUserLoading } = useGetAuthUser();
  const { data: dashboard, isLoading: isDashLoading } = useGetAdminDashboard({
    query: { enabled: !!user?.roles?.includes('admin') }
  });

  if (isUserLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !user.roles?.includes('admin')) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-destructive mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-8">You do not have administrative privileges.</p>
        <Button onClick={() => window.location.href = '/'} variant="outline">Return Home</Button>
      </div>
    );
  }

  if (isDashLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const chartData = (dashboard as any)?.monthlyDonations ?? [];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col pt-24 shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Navigation</p>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary font-bold">
            <LayoutDashboard size={18} className="mr-3" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
            <Link href="/donate"><Heart size={18} className="mr-3" /> Donations</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
            <Link href="/volunteer"><Users size={18} className="mr-3" /> Volunteers</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
            <Link href="/contact"><Mail size={18} className="mr-3" /> Contact</Link>
          </Button>
          <div className="my-4 border-t border-border" />
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
            <Link href="/events"><Calendar size={18} className="mr-3" /> Events</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
            <Link href="/blog"><TrendingUp size={18} className="mr-3" /> Blog</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 pt-24 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}. Here's what's happening.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<IndianRupee size={20} />}
            iconBg="bg-primary/10 text-primary"
            label="Total Donations"
            value={`₹${(dashboard?.totalDonations ?? 0).toLocaleString('en-IN')}`}
          />
          <StatCard
            icon={<Heart size={20} />}
            iconBg="bg-rose-500/10 text-rose-500"
            label="Total Donors"
            value={(dashboard?.totalDonors ?? 0).toLocaleString()}
          />
          <StatCard
            icon={<Users size={20} />}
            iconBg="bg-blue-500/10 text-blue-500"
            label="Volunteers"
            value={(dashboard?.totalVolunteers ?? 0).toLocaleString()}
          />
          <StatCard
            icon={<Mail size={20} />}
            iconBg="bg-amber-500/10 text-amber-500"
            label="Messages Received"
            value={(dashboard?.pendingMessages ?? 0).toLocaleString()}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Donation trend chart — real data from DB */}
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-1">Donation Trends</h3>
            <p className="text-xs text-muted-foreground mb-6">Last 6 months (completed donations)</p>
            {chartData.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Donations']}
                    />
                    <Bar dataKey="donations" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                No donation data for the last 6 months yet.
              </div>
            )}
          </div>

          {/* Recent donations */}
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-6">Recent Donations</h3>
            {(dashboard?.recentDonations?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-sm">No donations yet.</p>
            ) : (
              <div className="space-y-4">
                {dashboard?.recentDonations.slice(0, 5).map(d => (
                  <div key={d.id} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {d.isAnonymous ? 'A' : (d.donorName?.charAt(0)?.toUpperCase() || 'D')}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary shrink-0">₹{Number(d.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming events */}
        {((dashboard as any)?.upcomingEvents?.length ?? 0) > 0 && (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-6">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(dashboard as any).upcomingEvents.map((e: any) => (
                <div key={e.id} className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">{new Date(e.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="font-medium text-sm leading-tight mb-1">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.location}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <Users size={12} className="text-primary" />
                    <span>{e.registeredCount ?? 0} / {e.maxSeats ?? '∞'} registered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>{icon}</div>
      <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold font-mono text-foreground">{value}</h3>
    </div>
  );
}
