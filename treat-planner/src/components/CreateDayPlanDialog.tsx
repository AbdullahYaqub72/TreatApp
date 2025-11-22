import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDayPlans } from '@/hooks/useDayPlans';
import type { DayPlanFormData } from '@/types';

export function CreateDayPlanDialog() {
  const { currentUser } = useAuth();
  const { createDayPlan } = useDayPlans(currentUser?.uid);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<DayPlanFormData>({
    title: '',
    date: new Date(),
    description: '',
    membersList: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;

    setLoading(true);
    try {
      await createDayPlan(formData, currentUser.uid, currentUser.email);
      setOpen(false);
      setFormData({
        title: '',
        date: new Date(),
        description: '',
        membersList: '',
      });
    } catch (error) {
      console.error('Error creating day plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="group fixed bottom-8 right-8 rounded-full shadow-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 h-16 w-16 md:h-auto md:w-auto md:px-8 md:py-4 z-50 border-2 border-white hover:scale-110 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <Plus className="relative h-7 w-7 md:mr-2" />
          <span className="relative hidden md:inline font-bold">New Day Plan</span>
          <Sparkles className="relative hidden md:inline h-5 w-5 ml-2 animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-gradient-to-br from-white to-violet-50 border-2 border-violet-200">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Create Amazing Day Plan
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-600">Plan your next hangout with friends!</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold mb-2 block text-slate-700">Title *</label>
            <Input
              placeholder="Saturday Hangout 🎉"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border-2 border-violet-200 focus:border-violet-400 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block text-slate-700">Date *</label>
            <Input
              type="date"
              value={formData.date.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              required
              className="border-2 border-violet-200 focus:border-violet-400 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block text-slate-700">Description</label>
            <Textarea
              placeholder="Epic day with the crew! 🚀"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="border-2 border-violet-200 focus:border-violet-400 bg-white resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block text-slate-700">Members</label>
            <Input
              placeholder="Ali, Ahmed, sara@email.com"
              value={formData.membersList}
              onChange={(e) => setFormData({ ...formData, membersList: e.target.value })}
              className="border-2 border-violet-200 focus:border-violet-400 bg-white"
            />
            <p className="text-xs text-slate-500 mt-2">💡 Separate names or emails with commas</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1 border-2 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Creating Magic...' : '✨ Create Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
