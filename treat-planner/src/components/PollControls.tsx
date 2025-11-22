import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import type { Member, RSVPStatus } from '@/types';
import { cn } from '@/lib/utils';

interface PollControlsProps {
  eventId: string;
  members: Member[];
  rsvps: Record<string, RSVPStatus>;
  dayPlanId: string;
}

export function PollControls({ eventId, members, rsvps, dayPlanId }: PollControlsProps) {
  const { updateRSVP } = useEvents(dayPlanId);

  const handleRSVP = async (memberName: string, status: RSVPStatus) => {
    await updateRSVP(eventId, memberName, status);
  };

  const summary = members.reduce(
    (acc, member) => {
      const status = rsvps[member.name];
      if (status === 'yes') acc.coming++;
      else if (status === 'no') acc.notComing++;
      else if (status === 'maybe') acc.maybe++;
      return acc;
    },
    { coming: 0, notComing: 0, maybe: 0 }
  );

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>Who's Coming?</span>
        <span className="text-sm text-slate-500 font-normal">
          ({summary.coming} yes, {summary.maybe} maybe, {summary.notComing} no)
        </span>
      </h3>
      <div className="space-y-3">
        {members.map((member) => {
          const currentStatus = rsvps[member.name];
          return (
            <div key={member.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  {member.email && <p className="text-xs text-slate-500">{member.email}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRSVP(member.name, 'yes')}
                  className={cn(
                    'h-8 w-8 p-0',
                    currentStatus === 'yes' && 'bg-green-100 text-green-700 hover:bg-green-100'
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRSVP(member.name, 'maybe')}
                  className={cn(
                    'h-8 w-8 p-0',
                    currentStatus === 'maybe' && 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                  )}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRSVP(member.name, 'no')}
                  className={cn(
                    'h-8 w-8 p-0',
                    currentStatus === 'no' && 'bg-red-100 text-red-700 hover:bg-red-100'
                  )}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

