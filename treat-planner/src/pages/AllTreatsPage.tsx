import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import type { Event } from '@/types';

export function AllTreatsPage() {
  const { currentUser } = useAuth();
  const [treats, setTreats] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTreats = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          where('ownerEmail', 'in', ['abdullahyaqub555@gmail.com', '2020cs72@gmail.com']),
          orderBy('dateTime', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const treatsList: Event[] = [];
        querySnapshot.forEach((doc) => {
          treatsList.push({ id: doc.id, ...doc.data() } as Event);
        });
        
        setTreats(treatsList);
      } catch (error) {
        console.error('Error fetching treats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTreats();
  }, []);

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
          <p className="text-slate-600 font-medium">Loading all treats...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
          All Events Added For You{currentUser?.displayName ? `, ${currentUser.displayName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-slate-600">Complete history of all treats and hangouts</p>
        <div className="mt-4 flex items-center gap-4">
          <Badge className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold">
            {treats.length} Total Treats
          </Badge>
        </div>
      </div>

      {treats.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No treats yet</h3>
          <p className="text-slate-600">Start creating treats to see them here!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treats.map((treat) => {
            const treatDate = treat.dateTime.toDate();
            const isPast = treatDate < new Date();

            return (
              <Card
                key={treat.id}
                className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 ${
                  isPast ? 'opacity-75' : 'border-violet-200'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`bg-gradient-to-r ${EventTypeGradient(treat.type)} text-white border-0`}>
                      {treat.type}
                    </Badge>
                    {isPast && (
                      <Badge variant="outline" className="text-xs">
                        Past
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-violet-600 transition-colors">
                    {treat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    {format(treatDate, 'MMM dd, yyyy • h:mm a')}
                  </div>
                  
                  {treat.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-rose-600" />
                      {treat.locationUrl ? (
                        <a
                          href={treat.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          {treat.location}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-700">{treat.location}</span>
                      )}
                    </div>
                  )}

                  {treat.notes && (
                    <p className="text-sm text-slate-600 line-clamp-2 italic">
                      {treat.notes}
                    </p>
                  )}

                  {treat.totalBill && treat.totalBill > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        PKR {treat.totalBill}
                      </span>
                    </div>
                  )}

                  {treat.attendees && treat.attendees.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Users className="h-3 w-3" />
                      {treat.attendees.length} attendees
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

