import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles, LogOut, Home, List, Wallet, Clock, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [totalOwed, setTotalOwed] = useState(0);
  const [unscheduledCount, setUnscheduledCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTotalOwed = async () => {
      if (!currentUser) return;

      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        let total = 0;

        eventsSnapshot.forEach((doc) => {
          const event = { id: doc.id, ...doc.data() } as Event;
          
          if (event.totalBill && event.totalBill > 0) {
            const attendees = event.attendees || [];
            const perPerson = attendees.length > 0 ? event.totalBill / attendees.length : 0;

            const currentUserInAttendees = attendees.some(name => {
              const nameLower = name.toLowerCase().trim();
              const userNameLower = currentUser?.displayName?.toLowerCase().trim() || '';
              const userEmailPrefix = currentUser?.email?.split('@')[0].toLowerCase().trim() || '';
              return nameLower === userNameLower || nameLower === userEmailPrefix;
            });

            const currentUserIsPayer = 
              event.payer?.toLowerCase().trim() === currentUser?.displayName?.toLowerCase().trim() ||
              event.payerEmail?.toLowerCase().trim() === currentUser?.email?.toLowerCase().trim();

            if (currentUserInAttendees && perPerson > 0 && !currentUserIsPayer) {
              total += perPerson;
            }
          }
        });

        setTotalOwed(total);
      } catch (error) {
        console.error('Error fetching total owed:', error);
      }
    };

    fetchTotalOwed();
  }, [currentUser, location.pathname]); // Refetch when route changes

  useEffect(() => {
    const fetchUnscheduledCount = async () => {
      if (!currentUser) return;

      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const dayPlansSnapshot = await getDocs(collection(db, 'dayPlans'));
        
        const dayPlansMap = new Map();
        dayPlansSnapshot.forEach((doc) => {
          const data = doc.data();
          dayPlansMap.set(doc.id, data.date);
        });

        let count = 0;
        eventsSnapshot.forEach((doc) => {
          const event = { id: doc.id, ...doc.data() } as Event;
          const dayPlanDate = dayPlansMap.get(event.dayPlanId);
          
          const isUnscheduled = 
            !dayPlanDate || 
            dayPlanDate.toDate().getFullYear() >= 2099 ||
            !event.dateTime ||
            event.dateTime.toDate().getFullYear() >= 2099;

          if (isUnscheduled) count++;
        });

        setUnscheduledCount(count);
      } catch (error) {
        console.error('Error fetching unscheduled count:', error);
      }
    };

    fetchUnscheduledCount();
  }, [currentUser, location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-violet-100 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-1.5 sm:p-2 rounded-xl">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Treat Planner
                </h1>
                <p className="hidden sm:block text-xs text-slate-500 font-medium">Plan • Track • Split</p>
              </div>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-4">
              {location.pathname !== '/' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="hidden md:flex items-center gap-2 hover:bg-violet-100 hover:text-violet-700 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              
              {/* My Bills Button - Prominent with Badge */}
              <div className="relative hidden sm:block">
                <Button
                  onClick={() => navigate('/my-bills')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
                >
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Bills</span>
                  {totalOwed > 0 && (
                    <span className="ml-1 bg-white text-amber-600 text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full">
                      {totalOwed > 9999 ? `${(totalOwed / 1000).toFixed(0)}K` : totalOwed.toFixed(0)}
                    </span>
                  )}
                </Button>
                {totalOwed > 0 && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/all-treats')}
                className="hidden lg:flex items-center gap-2 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                <List className="h-4 w-4" />
                All Events
              </Button>

              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/unscheduled')}
                  className="flex items-center gap-2 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden md:inline">Unscheduled</span>
                  {unscheduledCount > 0 && (
                    <span className="ml-1 bg-orange-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">
                      {unscheduledCount}
                    </span>
                  )}
                </Button>
                {unscheduledCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-violet-400 ring-offset-2">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold text-sm">
                    {(currentUser.displayName || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-800">{userProfile?.displayName || 'User'}</p>
                  <p className="text-xs text-slate-500">{userProfile?.email}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut} 
                className="hidden sm:flex hover:bg-red-50 hover:text-red-600 transition-colors p-2 sm:px-3"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-700" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Slide-out Panel */}
      <div 
        className={`sm:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200">
            <Avatar className="h-12 w-12 ring-2 ring-violet-400 ring-offset-2">
              <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold">
                {(currentUser.displayName || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{userProfile?.displayName || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{userProfile?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {location.pathname !== '/' && (
              <button
                onClick={() => handleNavigation('/')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-violet-50 transition-colors text-left"
              >
                <Home className="h-5 w-5 text-violet-600" />
                <span className="font-semibold text-slate-800">Dashboard</span>
              </button>
            )}

            <button
              onClick={() => handleNavigation('/my-bills')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-300 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-amber-600" />
                <span className="font-bold text-slate-800">My Bills</span>
              </div>
              {totalOwed > 0 && (
                <span className="bg-amber-500 text-white text-xs font-black px-2 py-1 rounded-full">
                  PKR {totalOwed > 9999 ? `${(totalOwed / 1000).toFixed(0)}K` : totalOwed.toFixed(0)}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavigation('/all-treats')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-left"
            >
              <List className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">All Events</span>
            </button>

            <button
              onClick={() => handleNavigation('/unscheduled')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-600" />
                <span className="font-semibold text-slate-800">Unscheduled</span>
              </div>
              {unscheduledCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-full">
                  {unscheduledCount}
                </span>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors text-left"
            >
              <LogOut className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in">{children}</main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}
