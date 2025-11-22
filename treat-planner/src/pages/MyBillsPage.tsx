import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, User, CreditCard, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Event, DayPlan } from '@/types';

interface BillDetail {
  dayPlanId: string;
  dayPlanTitle: string;
  dayPlanDate: Date;
  eventId: string;
  eventTitle: string;
  eventType: string;
  totalBill: number;
  amountOwed: number;
  payerName: string;
  payerEmail: string;
  payerAccountDetails: string;
  isUrgent: boolean; // Due today or tomorrow
}

export default function MyBillsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState<BillDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'paid'>('all');

  useEffect(() => {
    const fetchAllBills = async () => {
      if (!currentUser) return;

      try {
        // Fetch all day plans
        const dayPlansSnapshot = await getDocs(collection(db, 'dayPlans'));
        const dayPlansMap = new Map<string, DayPlan>();
        dayPlansSnapshot.forEach((doc) => {
          dayPlansMap.set(doc.id, { id: doc.id, ...doc.data() } as DayPlan);
        });

        // Fetch all events
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const billsList: BillDetail[] = [];

        eventsSnapshot.forEach((doc) => {
          const event = { id: doc.id, ...doc.data() } as Event;
          
          if (event.totalBill && event.totalBill > 0) {
            const attendees = event.attendees || [];
            const perPerson = attendees.length > 0 ? event.totalBill / attendees.length : 0;

            // Check if current user is in attendees
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

            // Only add if user owes money (not the payer)
            if (currentUserInAttendees && perPerson > 0 && !currentUserIsPayer) {
              const dayPlan = dayPlansMap.get(event.dayPlanId);
              if (dayPlan) {
                const planDate = dayPlan.date.toDate();
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                const isUrgent = 
                  planDate.toDateString() === today.toDateString() ||
                  planDate.toDateString() === tomorrow.toDateString();

                billsList.push({
                  dayPlanId: dayPlan.id,
                  dayPlanTitle: dayPlan.title,
                  dayPlanDate: planDate,
                  eventId: event.id,
                  eventTitle: event.title,
                  eventType: event.type,
                  totalBill: event.totalBill,
                  amountOwed: perPerson,
                  payerName: event.payer || 'Unknown',
                  payerEmail: event.payerEmail || '',
                  payerAccountDetails: event.payerAccountDetails || '',
                  isUrgent,
                });
              }
            }
          }
        });

        // Sort by date (urgent first, then by date)
        billsList.sort((a, b) => {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return a.dayPlanDate.getTime() - b.dayPlanDate.getTime();
        });

        setBills(billsList);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBills();
  }, [currentUser]);

  const filteredBills = bills.filter(bill => {
    if (filter === 'urgent') return bill.isUrgent;
    if (filter === 'paid') return false; // TODO: implement paid tracking
    return true;
  });

  const totalOwed = bills.reduce((sum, bill) => sum + bill.amountOwed, 0);
  const urgentBills = bills.filter(b => b.isUrgent);
  const urgentTotal = urgentBills.reduce((sum, bill) => sum + bill.amountOwed, 0);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Cricket': return '🏏';
      case 'Food': return '🍕';
      case 'Movie': return '🎬';
      default: return '✨';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DollarSign className="h-12 w-12 animate-pulse text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              My Bills & Payments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Track what you owe and who to pay</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Total Owed</p>
                <p className="text-3xl sm:text-4xl font-black text-white">PKR {totalOwed.toFixed(0)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-rose-600 border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Urgent Bills</p>
                <p className="text-3xl sm:text-4xl font-black text-white">PKR {urgentTotal.toFixed(0)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-xl sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Total Bills</p>
                <p className="text-3xl sm:text-4xl font-black text-white">{bills.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-sm' : 'text-sm'}
        >
          All Bills ({bills.length})
        </Button>
        <Button
          variant={filter === 'urgent' ? 'default' : 'outline'}
          onClick={() => setFilter('urgent')}
          className={filter === 'urgent' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-sm' : 'text-sm'}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Urgent ({urgentBills.length})
        </Button>
      </div>

      {/* Bills Table/Cards */}
      {filteredBills.length === 0 ? (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-8 sm:p-12 text-center">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">All Clear! 🎉</h3>
            <p className="text-sm sm:text-base text-slate-600">You don't have any pending bills to pay.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block shadow-xl border-2 border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Day Plan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Amount Owed
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pay To
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Payment Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill.eventId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bill.isUrgent ? (
                          <Badge className="bg-red-500 text-white flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" />
                            Urgent
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-300 text-slate-600 w-fit">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{bill.dayPlanTitle}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(bill.dayPlanDate)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getEventIcon(bill.eventType)}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{bill.eventTitle}</p>
                            <p className="text-xs text-slate-500">
                              Total: PKR {bill.totalBill.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-lg font-black text-amber-600">
                          PKR {bill.amountOwed.toFixed(0)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{bill.payerName}</p>
                            {bill.payerEmail && (
                              <p className="text-xs text-slate-500">{bill.payerEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {bill.payerAccountDetails ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                            <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              Payment Info
                            </p>
                            <p className="text-sm font-mono text-slate-800 break-all">
                              {bill.payerAccountDetails}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No details provided</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredBills.map((bill) => (
            <Card key={bill.eventId} className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  {bill.isUrgent ? (
                    <Badge className="bg-red-500 text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Urgent
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-300 text-slate-600">
                      Pending
                    </Badge>
                  )}
                  <span className="text-2xl">{getEventIcon(bill.eventType)}</span>
                </div>

                {/* Event & Day Plan */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{bill.eventTitle}</h3>
                  <p className="text-sm font-semibold text-violet-600">{bill.dayPlanTitle}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(bill.dayPlanDate)}
                  </p>
                </div>

                {/* Amount */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-amber-700 mb-1">You Owe:</p>
                  <p className="text-2xl font-black text-amber-600">
                    PKR {bill.amountOwed.toFixed(0)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Total Bill: PKR {bill.totalBill.toFixed(0)}
                  </p>
                </div>

                {/* Payer Info */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{bill.payerName}</p>
                      {bill.payerEmail && (
                        <p className="text-xs text-slate-500">{bill.payerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  {bill.payerAccountDetails && (
                    <div className="bg-white border border-amber-200 rounded-lg p-2 mt-2">
                      <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Payment Info
                      </p>
                      <p className="text-sm font-mono text-slate-800 break-all">
                        {bill.payerAccountDetails}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

