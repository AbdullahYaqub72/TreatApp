import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Trophy, Utensils, Film, Calendar, MapPin, DollarSign, Sparkles, ExternalLink } from 'lucide-react';
import type { Event, Member } from '@/types';
import { format } from 'date-fns';
import { PollControls } from './PollControls';
import { BillSplitPanel } from './BillSplitPanel';

interface EventCardProps {
  event: Event;
  members: Member[];
}

const EventTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Cricket':
      return <Trophy className="h-5 w-5" />;
    case 'Food':
      return <Utensils className="h-5 w-5" />;
    case 'Movie':
      return <Film className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
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

const EventTypeBg = (type: string) => {
  switch (type) {
    case 'Cricket':
      return 'from-blue-50 to-cyan-50';
    case 'Food':
      return 'from-orange-50 to-amber-50';
    case 'Movie':
      return 'from-purple-50 to-pink-50';
    default:
      return 'from-slate-50 to-gray-50';
  }
};

export function EventCard({ event, members }: EventCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const eventDate = event.dateTime.toDate();

  // Get RSVP summary
  const rsvpSummary = Object.values(event.rsvps).reduce(
    (acc, status) => {
      if (status === 'yes') acc.coming++;
      return acc;
    },
    { coming: 0 }
  );

  return (
    <>
      <Card 
        className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-violet-400 bg-gradient-to-br ${EventTypeBg(event.type)} overflow-hidden`}
        onClick={() => setDetailsOpen(true)}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${EventTypeGradient(event.type)} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${EventTypeGradient(event.type)} rounded-xl blur-md opacity-50`}></div>
              <Badge className={`relative bg-gradient-to-r ${EventTypeGradient(event.type)} text-white border-0 px-3 py-1.5 font-semibold`}>
                <EventTypeIcon type={event.type} />
                <span className="ml-1.5">{event.type}</span>
              </Badge>
            </div>
            {event.totalBill && event.totalBill > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <DollarSign className="h-3 w-3 mr-1" />
                PKR {event.totalBill}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl group-hover:text-violet-600 transition-colors font-bold">
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4 text-violet-600" />
            {format(eventDate, 'MMM dd, yyyy • h:mm a')}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <MapPin className="h-4 w-4 text-rose-600" />
              {event.locationUrl ? (
                <a 
                  href={event.locationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-rose-600 font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.location} 📍
                </a>
              ) : (
                event.location
              )}
            </div>
          )}
          {event.notes && <p className="text-sm text-slate-600 line-clamp-2 italic">{event.notes}</p>}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                  >
                    {member.name[0].toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-600 font-semibold">
                {rsvpSummary.coming}/{members.length} attending
              </span>
            </div>
            <Button variant="ghost" size="sm" className="group-hover:bg-violet-100 group-hover:text-violet-700 font-semibold">
              Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-gradient-to-br from-white to-violet-50">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${EventTypeGradient(event.type)} rounded-2xl blur-lg opacity-50`}></div>
                <div className={`relative bg-gradient-to-r ${EventTypeGradient(event.type)} p-3 rounded-2xl`}>
                  <EventTypeIcon type={event.type} />
                </div>
              </div>
              <Badge className={`bg-gradient-to-r ${EventTypeGradient(event.type)} text-white border-0 px-4 py-1.5 text-sm font-semibold`}>
                {event.type}
              </Badge>
            </div>
            <SheetTitle className="text-3xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {event.title}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Event Details */}
            <Card className="bg-white/50 backdrop-blur-sm border-violet-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">When</p>
                    <p className="text-lg font-bold text-slate-800">{format(eventDate, 'EEEE, MMMM dd, yyyy')}</p>
                    <p className="text-sm text-slate-600">{format(eventDate, 'h:mm a')}</p>
                  </div>
                </div>
                
                {event.location && (
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Where</p>
                      {event.locationUrl ? (
                        <a 
                          href={event.locationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-rose-600 hover:underline flex items-center gap-2"
                        >
                          {event.location}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <p className="text-lg font-semibold text-slate-800">{event.location}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {event.notes && (
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Notes</p>
                      <p className="text-base text-slate-700">{event.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Poll Controls */}
            <PollControls eventId={event.id} members={members} rsvps={event.rsvps} dayPlanId={event.dayPlanId} />

            {/* Bill Split */}
            <BillSplitPanel
              eventId={event.id}
              totalBill={event.totalBill || 0}
              members={members}
              rsvps={event.rsvps}
              dayPlanId={event.dayPlanId}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
