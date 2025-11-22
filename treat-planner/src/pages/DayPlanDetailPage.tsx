import { useParams, useNavigate } from 'react-router-dom';
import { useDayPlan } from '@/hooks/useEvents';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateEventDialog } from '@/components/CreateEventDialog';
import { EventCard } from '@/components/EventCard';
import { ArrowLeft, Calendar, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function DayPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dayPlan, loading: planLoading } = useDayPlan(id);
  const { events, loading: eventsLoading } = useEvents(id);

  if (planLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!dayPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Day Plan Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const planDate = dayPlan.date.toDate();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-3">{dayPlan.title}</CardTitle>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{format(planDate, 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{dayPlan.members.length} members</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        {(dayPlan.description || dayPlan.members.length > 0) && (
          <CardContent className="space-y-4">
            {dayPlan.description && (
              <div>
                <p className="text-slate-700">{dayPlan.description}</p>
              </div>
            )}
            {dayPlan.members.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Members:</p>
                <div className="flex flex-wrap gap-2">
                  {dayPlan.members.map((member) => (
                    <Badge key={member.name} variant="secondary" className="px-3 py-1">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                        {member.name[0].toUpperCase()}
                      </div>
                      {member.name}
                      {member.email && <span className="ml-1 text-xs text-slate-500">({member.email})</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Events {events.length > 0 && `(${events.length})`}
          </h2>
          {dayPlan.members.length > 0 && <CreateEventDialog dayPlanId={dayPlan.id} members={dayPlan.members} />}
        </div>

        {dayPlan.members.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-slate-600">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium mb-1">No members added yet</p>
              <p className="text-sm">Add members to this day plan before creating events</p>
            </div>
          </Card>
        ) : events.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-slate-600">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium mb-1">No events yet</p>
              <p className="text-sm mb-4">Create your first event to start planning!</p>
              <CreateEventDialog dayPlanId={dayPlan.id} members={dayPlan.members} />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} members={dayPlan.members} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

