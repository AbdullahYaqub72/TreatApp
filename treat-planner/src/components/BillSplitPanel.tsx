import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Save } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/context/AuthContext';
import type { Member, RSVPStatus } from '@/types';

interface BillSplitPanelProps {
  eventId: string;
  totalBill: number;
  members: Member[];
  rsvps: Record<string, RSVPStatus>;
  dayPlanId: string;
}

export function BillSplitPanel({ eventId, totalBill, members, rsvps, dayPlanId }: BillSplitPanelProps) {
  const { updateBill } = useEvents(dayPlanId);
  const { isAuthorized } = useAuth();
  const [editMode, setEditMode] = useState(!totalBill);
  const [billAmount, setBillAmount] = useState(totalBill.toString());
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(
    members.filter((m) => rsvps[m.name] === 'yes').map((m) => m.name)
  );

  const handleSaveBill = async () => {
    await updateBill(eventId, Number(billAmount));
    setEditMode(false);
  };

  const toggleAttendee = (memberName: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(memberName) ? prev.filter((m) => m !== memberName) : [...prev, memberName]
    );
  };

  const perPersonShare = selectedAttendees.length > 0 ? Number(billAmount) / selectedAttendees.length : 0;

  if (!totalBill && !editMode) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Bill Split</h3>
        <p className="text-sm text-slate-600 mb-3">No bill amount set yet.</p>
        {isAuthorized && (
          <Button size="sm" onClick={() => setEditMode(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <DollarSign className="h-4 w-4 mr-1" />
            Set Bill Amount
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Bill Split</h3>
        {isAuthorized && !editMode && (
          <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </div>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Total Bill (PKR)</label>
            <Input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Who Attended?</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {members.map((member) => (
                <Badge
                  key={member.name}
                  variant={selectedAttendees.includes(member.name) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAttendee(member.name)}
                >
                  {member.name}
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={handleSaveBill} className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Save Bill
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Each person pays:</p>
            <p className="text-3xl font-bold text-emerald-700">PKR {perPersonShare.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1">
              Total: PKR {Number(billAmount).toFixed(2)} ÷ {selectedAttendees.length} people
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Breakdown:</p>
            {selectedAttendees.map((name) => (
              <div key={name} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                <span>{name}</span>
                <span className="font-medium text-emerald-700">PKR {perPersonShare.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {selectedAttendees.length === 0 && (
            <p className="text-sm text-slate-500 text-center">No attendees selected for bill split</p>
          )}
        </div>
      )}
    </Card>
  );
}

