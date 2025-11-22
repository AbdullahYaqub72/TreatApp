import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Loader2, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '@/types';

export default function UnscheduledEventsPage() {
  const { currentUser } = useAuth();
  const [unscheduledEvents, setUnscheduledEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnscheduledEvents = async () => {
      if (!currentUser) return;

      try {
        // Fetch all events
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const events: Event[] = [];

        // Get all day plans to check their dates
        const dayPlansSnapshot = await getDocs(collection(db, 'dayPlans'));
        const dayPlansMap = new Map();
        dayPlansSnapshot.forEach((doc) => {
          const data = doc.data();
          dayPlansMap.set(doc.id, data.date);
        });

        eventsSnapshot.forEach((doc) => {
          const event = { id: doc.id, ...doc.data() } as Event;
          
          // Check if the event's day plan has no date or is very far in the future (placeholder)
          const dayPlanDate = dayPlansMap.get(event.dayPlanId);
          
          // Consider event unscheduled if:
          // 1. Day plan doesn't exist, OR
          // 2. Day plan date is in the year 2099 or later (placeholder date), OR
          // 3. Event has no dateTime or dateTime is placeholder
          const isUnscheduled = 
            !dayPlanDate || 
            dayPlanDate.toDate().getFullYear() >= 2099 ||
            !event.dateTime ||
            event.dateTime.toDate().getFullYear() >= 2099;

          if (isUnscheduled) {
            events.push(event);
          }
        });

        setUnscheduledEvents(events);
      } catch (error) {
        console.error('Error fetching unscheduled events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnscheduledEvents();
  }, [currentUser]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Cricket': return '🏏';
      case 'Food': return '🍕';
      case 'Movie': return '🎬';
      default: return '✨';
    }
  };

  const EventTypeGradient = (type: string) => {
    switch (type) {
      case 'Cricket':
        return 'from-blue-500 to-cyan-500';
      case 'Food':
        return 'from-orange-500 to-amber-500';
      case 'Movie':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-slate-500 to-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading unscheduled events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-slate-500 to-gray-500 p-2 rounded-xl">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
            Unscheduled Events
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Events that don't have a specific date yet</p>
        <div className="mt-4 flex items-center gap-4">
          <Badge className="px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-500 text-white text-sm font-semibold">
            {unscheduledEvents.length} Unscheduled
          </Badge>
        </div>
      </div>

      {unscheduledEvents.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center border-2 border-slate-200">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">All Events Scheduled! 🎉</h3>
          <p className="text-sm sm:text-base text-slate-600">Every event has a date and plan.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {unscheduledEvents.map((event) => {
            return (
              <Card
                key={event.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-slate-300 bg-gradient-to-br from-white to-slate-50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`bg-gradient-to-r ${EventTypeGradient(event.type)} text-white border-0`}>
                      {event.type}
                    </Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-600 bg-orange-50">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No Date
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-violet-600 transition-colors flex items-center gap-2">
                    <span className="text-2xl">{getEventIcon(event.type)}</span>
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="italic">Date to be determined</span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-rose-600 flex-shrink-0" />
                      {event.locationUrl ? (
                        <a
                          href={event.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 font-semibold hover:underline flex items-center gap-1 break-all"
                        >
                          {event.location}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-700 break-all">{event.location}</span>
                      )}
                    </div>
                  )}

                  {event.notes && (
                    <p className="text-sm text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded">
                      {event.notes}
                    </p>
                  )}

                  {event.totalBill && event.totalBill > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        PKR {event.totalBill}
                      </span>
                      {event.payer && (
                        <span className="text-xs text-slate-500">
                          (Paid by {event.payer})
                        </span>
                      )}
                    </div>
                  )}

                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-violet-50 px-2 py-1 rounded">
                      <Users className="h-3 w-3" />
                      {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-400">
                      Created {format(event.createdAt.toDate(), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

