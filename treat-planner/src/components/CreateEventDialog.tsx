import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Link2, DollarSign, Users, Sparkles, Clock } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useRegisteredUsers } from '@/hooks/useRegisteredUsers';
import type { EventFormData, EventType, Member } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface CreateEventDialogProps {
  dayPlanId: string;
  members: Member[];
}

export function CreateEventDialog({ dayPlanId }: CreateEventDialogProps) {
  const { currentUser } = useAuth();
  const { createEvent } = useEvents(dayPlanId);
  const { users, loading: usersLoading } = useRegisteredUsers();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: 'Food' as EventType,
    dateTime: new Date(),
    location: '',
    locationUrl: '',
    notes: '',
    totalBill: 0,
    payer: '',
    payerEmail: '',
    payerAccountDetails: '',
    selectedMembers: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;
    
    setLoading(true);
    try {
      await createEvent(formData, dayPlanId, currentUser.uid, currentUser.email);
      setOpen(false);
      setFormData({
        title: '',
        type: 'Food' as EventType,
        dateTime: new Date(),
        location: '',
        locationUrl: '',
        notes: '',
        totalBill: 0,
        payer: '',
        payerEmail: '',
        payerAccountDetails: '',
        selectedMembers: [],
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(userName)
        ? prev.selectedMembers.filter((m) => m !== userName)
        : [...prev.selectedMembers, userName],
    }));
  };

  const selectAll = () => {
    setFormData((prev) => ({
      ...prev,
      selectedMembers: users.filter(u => u.displayName).map(u => u.displayName),
    }));
  };

  const deselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      selectedMembers: [],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border-2 border-emerald-200"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3 pb-4 border-b border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create New Treat
              </DialogTitle>
              <p className="text-sm text-slate-600 mt-1">Add an amazing event to your day plan! 🎉</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Event Title *
            </label>
            <Input
              placeholder="e.g., Lunch at Cafe, Movie Night, Cricket Match"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border-2 border-emerald-200 focus:border-emerald-400 bg-white text-lg h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Type *
              </label>
              <select
                className="w-full border-2 border-emerald-200 rounded-md px-4 py-3 text-base font-medium focus:border-emerald-400 focus:outline-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                required
              >
                <option value="Food">🍕 Food</option>
                <option value="Cricket">🏏 Cricket</option>
                <option value="Movie">🎬 Movie</option>
                <option value="Other">✨ Other</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.dateTime.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, dateTime: new Date(e.target.value) })}
                required
                className="border-2 border-emerald-200 focus:border-emerald-400 bg-white h-12"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-600" />
              Location
            </label>
            <Input
              placeholder="e.g., Central Park, Main Street Cafe"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border-2 border-emerald-200 focus:border-emerald-400 bg-white h-12"
            />
          </div>

          {/* Google Maps Link */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-blue-600" />
              Google Maps Link
            </label>
            <Input
              placeholder="https://maps.google.com/..."
              value={formData.locationUrl}
              onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
              className="border-2 border-emerald-200 focus:border-emerald-400 bg-white h-12"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              📍 Paste a Google Maps URL for easy navigation
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Notes</label>
            <Textarea
              placeholder="Any special details, dietary restrictions, dress code, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="border-2 border-emerald-200 focus:border-emerald-400 bg-white resize-none"
            />
          </div>

          {/* Total Bill */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-600" />
              Total Bill (PKR)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.totalBill || ''}
              onChange={(e) => setFormData({ ...formData, totalBill: Number(e.target.value) })}
              className="border-2 border-emerald-200 focus:border-emerald-400 bg-white h-12 text-lg"
            />
          </div>

          {/* Payer Selection */}
          {formData.totalBill && formData.totalBill > 0 && (
            <div className="space-y-4 bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-600" />
                Who Paid? *
              </label>
              
              {usersLoading ? (
                <p className="text-sm text-slate-500">Loading users...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {users.filter(u => u.displayName).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormData({
                          ...formData,
                          payer: user.displayName,
                          payerEmail: user.email,
                        });
                      }}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.payer === user.displayName
                          ? 'bg-amber-100 border-amber-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-amber-400">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-xs">
                          {user.displayName?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {user.displayName}
                        </p>
                      </div>
                      {formData.payer === user.displayName && (
                        <div className="bg-amber-500 rounded-full p-1 flex-shrink-0">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Account Details */}
              {formData.payer && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-bold text-slate-700">
                    💳 Payment Details (Bank Account, JazzCash, Easypaisa, etc.)
                  </label>
                  <Input
                    placeholder="e.g., JazzCash: 03XX-XXXXXXX or Bank: 1234-5678-9012"
                    value={formData.payerAccountDetails}
                    onChange={(e) => setFormData({ ...formData, payerAccountDetails: e.target.value })}
                    className="border-2 border-amber-300 focus:border-amber-500 bg-white h-12"
                  />
                  <p className="text-xs text-amber-700">
                    📱 Add payment details so others know where to send money
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Select Members */}
          <div className="space-y-3 bg-white rounded-xl p-4 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Select Members * ({formData.selectedMembers.length} selected)
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectAll();
                  }}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deselectAll();
                  }}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {usersLoading ? (
              <p className="text-sm text-slate-500">Loading members...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-500">No registered users found</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                {users.map((user) => {
                  if (!user.displayName) return null; // Skip users without display names
                  const isSelected = formData.selectedMembers.includes(user.displayName);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMember(user.displayName);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-emerald-400 ring-offset-2">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                          {user.displayName?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {user.displayName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      {isSelected && (
                        <div className="bg-emerald-500 rounded-full p-1">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            
            {formData.selectedMembers.length > 0 && formData.totalBill && formData.totalBill > 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-800">
                  💰 Per Person: PKR {(formData.totalBill / formData.selectedMembers.length).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-emerald-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1 h-12 border-2 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                loading || 
                formData.selectedMembers.length === 0 ||
                Boolean(formData.totalBill && formData.totalBill > 0 && !formData.payer)
              } 
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Treat
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
