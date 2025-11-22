import { useAuth } from '@/context/AuthContext';
import { useDayPlans } from '@/hooks/useDayPlans';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateDayPlanDialog } from '@/components/CreateDayPlanDialog';
import { Calendar, ArrowRight, Loader2, Sparkles, TrendingUp, DollarSign, CheckCircle, HelpCircle, XCircle, Trophy, Utensils, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Event } from '@/types';

interface DayPlanStats {
  planId: string;
  eventCount: number;
  eventTypes: string[];
  rsvpSummary: {
    coming: number;
    maybe: number;
    notComing: number;
    comingNames: string[];
  };
  moneyStats: {
    totalPending: number;
    currentUserOwes: number;
    owesTo: string;
    payerEmail?: string;
    payerAccountDetails?: string;
  };
}

export function DashboardPage() {
  const { currentUser, isAuthorized } = useAuth();
  const { dayPlans, loading } = useDayPlans(currentUser?.uid);
  const [planStats, setPlanStats] = useState<Record<string, DayPlanStats>>({});
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events and calculate stats for each plan
  useEffect(() => {
    const fetchPlanStats = async () => {
      if (!dayPlans.length) {
        setStatsLoading(false);
        return;
      }

      const statsMap: Record<string, DayPlanStats> = {};

      for (const plan of dayPlans) {
        try {
          // Fetch events for this plan
          const eventsQuery = query(
            collection(db, 'events'),
            where('dayPlanId', '==', plan.id)
          );
          const eventsSnapshot = await getDocs(eventsQuery);
          const events: Event[] = [];
          eventsSnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as Event);
          });

          // Calculate event types
          const eventTypes = [...new Set(events.map(e => e.type))];

          // Calculate RSVP summary
          const rsvpMap: Record<string, 'yes' | 'maybe' | 'no'> = {};
          events.forEach(event => {
            Object.entries(event.rsvps || {}).forEach(([member, status]) => {
              // Keep the strongest positive response
              if (!rsvpMap[member] || 
                  (status === 'yes') ||
                  (status === 'maybe' && rsvpMap[member] !== 'yes')) {
                rsvpMap[member] = status;
              }
            });
          });

          const coming = Object.entries(rsvpMap).filter(([_, status]) => status === 'yes');
          const maybe = Object.entries(rsvpMap).filter(([_, status]) => status === 'maybe').length;
          const notComing = Object.entries(rsvpMap).filter(([_, status]) => status === 'no').length;
          const comingNames = coming.map(([name]) => name).slice(0, 3);

          // Calculate money stats
          let totalPending = 0;
          let currentUserOwes = 0;
          let owesTo = '';
          let payerEmail = '';
          let payerAccountDetails = '';

          events.forEach(event => {
            if (event.totalBill && event.totalBill > 0) {
              const attendees = event.attendees || [];
              const perPerson = attendees.length > 0 ? event.totalBill / attendees.length : 0;
              
              // Check if current user is in attendees (exact match)
              const currentUserInAttendees = attendees.some(name => {
                const nameLower = name.toLowerCase().trim();
                const userNameLower = currentUser?.displayName?.toLowerCase().trim() || '';
                const userEmailPrefix = currentUser?.email?.split('@')[0].toLowerCase().trim() || '';
                return nameLower === userNameLower || nameLower === userEmailPrefix;
              });

              // Check if current user is the payer
              const currentUserIsPayer = 
                event.payer?.toLowerCase().trim() === currentUser?.displayName?.toLowerCase().trim() ||
                event.payerEmail?.toLowerCase().trim() === currentUser?.email?.toLowerCase().trim();

              if (currentUserInAttendees && perPerson > 0 && !currentUserIsPayer) {
                currentUserOwes += perPerson;
                owesTo = event.payer || 'organizer';
                payerEmail = event.payerEmail || '';
                payerAccountDetails = event.payerAccountDetails || '';
              }

              totalPending += event.totalBill;
            }
          });

          statsMap[plan.id] = {
            planId: plan.id,
            eventCount: events.length,
            eventTypes,
            rsvpSummary: {
              coming: coming.length,
              maybe,
              notComing,
              comingNames,
            },
            moneyStats: {
              totalPending,
              currentUserOwes,
              owesTo,
              payerEmail,
              payerAccountDetails,
            },
          };
        } catch (error) {
          console.error('Error fetching stats for plan:', plan.id, error);
        }
      }

      setPlanStats(statsMap);
      setStatsLoading(false);
    };

    fetchPlanStats();
  }, [dayPlans, currentUser]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Cricket': return <Trophy className="h-3 w-3" />;
      case 'Food': return <Utensils className="h-3 w-3" />;
      case 'Movie': return <Film className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your amazing plans...</p>
        </div>
      </div>
    );
  }

  if (dayPlans.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="max-w-2xl w-full bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-2xl opacity-30"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Your Journey Begins! 🚀
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Create your first day plan and start organizing epic hangouts with your crew. 
                Track treats, split bills, and never miss out on the fun!
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <Badge className="px-4 py-2 bg-violet-100 text-violet-700 text-sm">✨ Easy Setup</Badge>
                <Badge className="px-4 py-2 bg-purple-100 text-purple-700 text-sm">⚡ Super Fast</Badge>
                <Badge className="px-4 py-2 bg-pink-100 text-pink-700 text-sm">🎉 Super Fun</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        {isAuthorized && <CreateDayPlanDialog />}
      </>
    );
  }

  const upcomingPlans = dayPlans.filter(p => p.date.toDate() >= new Date());
  const pastPlans = dayPlans.filter(p => p.date.toDate() < new Date());

  return (
    <>
      {/* Stats Section */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Total Plans</p>
                <p className="text-3xl sm:text-4xl font-black text-white">{dayPlans.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Upcoming</p>
                <p className="text-3xl sm:text-4xl font-black text-white">{upcomingPlans.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-shadow sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Total Events</p>
                <p className="text-3xl sm:text-4xl font-black text-white">
                  {Object.values(planStats).reduce((sum, stat) => sum + stat.eventCount, 0)}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Section */}
      {upcomingPlans.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Upcoming Plans</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcomingPlans.map((plan, index) => {
              const planDate = plan.date.toDate();
              const stats = planStats[plan.id];
              
              return (
                <Card
                  key={plan.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-violet-400 bg-gradient-to-br from-white to-violet-50 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/plan/${plan.id}`)}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-3 py-1">
                        Upcoming
                      </Badge>
                      <div className="bg-violet-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <Calendar className="h-4 w-4 text-violet-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-violet-600 transition-colors">
                      {plan.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                      <Calendar className="h-4 w-4" />
                      {format(planDate, 'EEEE, MMM dd, yyyy')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Event Summary */}
                    {stats && stats.eventCount > 0 && (
                      <div className="flex items-center gap-2 text-sm bg-white/50 rounded-lg p-2">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        <span className="font-semibold">{stats.eventCount} Events:</span>
                        <div className="flex gap-1">
                          {stats.eventTypes.map(type => (
                            <span key={type} className="flex items-center gap-1">
                              {getEventIcon(type)}
                              <span className="text-xs">{type}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RSVP Summary */}
                    {stats && stats.rsvpSummary.coming > 0 && (
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">
                            Coming: {stats.rsvpSummary.coming}
                          </span>
                          {stats.rsvpSummary.maybe > 0 && (
                            <>
                              <HelpCircle className="h-3 w-3 text-amber-600" />
                              <span className="text-xs text-amber-700">Maybe: {stats.rsvpSummary.maybe}</span>
                            </>
                          )}
                          {stats.rsvpSummary.notComing > 0 && (
                            <>
                              <XCircle className="h-3 w-3 text-red-600" />
                              <span className="text-xs text-red-700">Not: {stats.rsvpSummary.notComing}</span>
                            </>
                          )}
                        </div>
                        {stats.rsvpSummary.comingNames.length > 0 && (
                          <p className="text-xs text-slate-600">
                            👥 {stats.rsvpSummary.comingNames.join(', ')}
                            {stats.rsvpSummary.coming > 3 && '...'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Money Stats */}
                    {stats && stats.moneyStats.totalPending > 0 && (
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Total Pending:</span>
                          <span className="font-bold text-amber-600">
                            PKR {stats.moneyStats.totalPending.toFixed(0)}
                          </span>
                        </div>
                        {stats.moneyStats.currentUserOwes > 0 && (
                          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-amber-600" />
                              <span className="text-base font-bold text-amber-800">
                                You owe: PKR {stats.moneyStats.currentUserOwes.toFixed(0)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-amber-700 flex items-center gap-1">
                                👤 Pay to: {stats.moneyStats.owesTo}
                              </p>
                              {stats.moneyStats.payerEmail && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                  ✉️ {stats.moneyStats.payerEmail}
                                </p>
                              )}
                              {stats.moneyStats.payerAccountDetails && (
                                <div className="mt-2 bg-white border border-amber-300 rounded p-2">
                                  <p className="text-xs font-semibold text-amber-700 mb-1">💳 Payment Details:</p>
                                  <p className="text-sm font-mono text-slate-800 break-all">
                                    {stats.moneyStats.payerAccountDetails}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:bg-violet-100 group-hover:text-violet-700 mt-2"
                    >
                      View Plan
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {pastPlans.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Past Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pastPlans.map((plan) => {
              const planDate = plan.date.toDate();
              const stats = planStats[plan.id];
              
              return (
                <Card
                  key={plan.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer opacity-75 hover:opacity-100"
                  onClick={() => navigate(`/plan/${plan.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Completed
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-slate-700 transition-colors">
                      {plan.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <Calendar className="h-4 w-4" />
                      {format(planDate, 'MMM dd, yyyy')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {stats && stats.eventCount > 0 && (
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        {stats.eventCount} events
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {isAuthorized && <CreateDayPlanDialog />}
    </>
  );
}
