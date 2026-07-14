import { useGetAuthUser, useGetDonations, useGetMyVolunteerProfile } from '@workspace/api-client-react';
import { PageHeader } from '@/components';
import { motion } from 'framer-motion';
import { Heart, Calendar, LogOut, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: user, isLoading: isUserLoading } = useGetAuthUser();
  const { data: donations } = useGetDonations();
  const { data: volunteerProfile } = useGetMyVolunteerProfile();

  if (isUserLoading) return <div className="h-[100dvh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!user) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Please Sign In</h2>
        <p className="text-muted-foreground mb-8">You need to be logged in to view your dashboard.</p>
        <Button onClick={() => window.location.href = '/api/login'} size="lg" className="px-8 rounded-xl font-bold">
          Sign In
        </Button>
      </div>
    );
  }

  const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;

  return (
    <div className="w-full bg-background min-h-[100dvh]">
      <div className="pt-24 pb-8 bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-4 border-background shadow-lg overflow-hidden">
              {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/api/logout'} className="rounded-xl border-border text-muted-foreground hover:text-foreground">
            <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-4">
              <Heart size={24} />
            </div>
            <h3 className="text-muted-foreground font-medium mb-1">Total Impact</h3>
            <p className="text-3xl font-bold font-serif text-foreground">₹{totalDonated.toLocaleString()}</p>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-muted-foreground font-medium mb-1">Contributions</h3>
            <p className="text-3xl font-bold font-serif text-foreground">{donations?.length || 0}</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-muted-foreground font-medium mb-1">Volunteer Hours</h3>
            <p className="text-3xl font-bold font-serif text-foreground">{volunteerProfile?.hoursContributed || 0}</p>
            {volunteerProfile && <p className="text-xs text-muted-foreground mt-1 text-primary">Status: {volunteerProfile.status}</p>}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className="text-xl font-serif font-bold">Donation History</h2>
            <Link href="/donate">
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg">Donate Again</Button>
            </Link>
          </div>
          <div className="p-0">
            {(!donations || donations.length === 0) ? (
              <div className="p-12 text-center text-muted-foreground">
                <Heart className="mx-auto mb-4 opacity-50" size={48} />
                <p>You haven't made any donations yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Method</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {donations.map(donation => (
                      <tr key={donation.id} className="border-b border-border/50 hover:bg-muted/10">
                        <td className="p-4">{format(new Date(donation.createdAt), 'MMM d, yyyy')}</td>
                        <td className="p-4 font-bold font-mono text-secondary">₹{donation.amount.toLocaleString()}</td>
                        <td className="p-4 uppercase text-xs">{donation.paymentMethod.replace('_', ' ')}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                            {donation.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
