import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Users, DollarSign, Sparkles, ArrowRight, Zap, CheckCircle2, TrendingUp, Star } from 'lucide-react';

export function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-violet-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col py-6 sm:py-8 md:py-12 px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6 bg-white/5 backdrop-blur-xl px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-full border border-white/10 shadow-2xl w-fit mx-auto">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 lg:h-10 lg:w-10 text-yellow-400 animate-pulse flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white tracking-tight drop-shadow-2xl whitespace-nowrap">
                Treat Planner
              </h1>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 lg:h-10 lg:w-10 text-yellow-400 animate-pulse flex-shrink-0" />
            </div>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 font-bold mb-2 sm:mb-3 px-2 sm:px-4 animate-slide-up drop-shadow-lg">
              Plan hangs, track treats, split bills ✨
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/60 max-w-3xl mx-auto px-2 sm:px-4 animate-slide-up animation-delay-200 leading-relaxed">
              The ultimate app for organizing epic hangouts with your crew, managing events like a boss, and never arguing over bills again 🎉
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 mt-3 sm:mt-4 md:mt-6 lg:mt-8 px-2 sm:px-4 animate-fade-in animation-delay-400">
              <div className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 bg-emerald-500/20 backdrop-blur-lg rounded-full border border-emerald-400/30">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-100 text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">100% Free</span>
              </div>
              <div className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 bg-blue-500/20 backdrop-blur-lg rounded-full border border-blue-400/30">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-400 flex-shrink-0" />
                <span className="text-blue-100 text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">Super Fast</span>
              </div>
              <div className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 bg-purple-500/20 backdrop-blur-lg rounded-full border border-purple-400/30">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-purple-400 flex-shrink-0" />
                <span className="text-purple-100 text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">Secure & Private</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-2 sm:px-4">
            {/* Feature 1 */}
            <Card className="group relative p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border-white/10 hover:border-violet-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20 animate-slide-up animation-delay-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-xl mx-auto">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 group-hover:text-violet-300 transition-colors text-center">Plan Events</h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed group-hover:text-white/90 transition-colors text-center">
                Create day plans and add cricket matches, food spots, movie nights, and whatever else you're up to 🏏🍕🎬
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-xl border-white/10 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 animate-slide-up animation-delay-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 via-pink-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-xl mx-auto">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 group-hover:text-pink-300 transition-colors text-center">Invite Friends</h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed group-hover:text-white/90 transition-colors text-center">
                Add your squad, send invites, track RSVPs with polls, and see who's actually showing up 👥✨
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border-white/10 hover:border-amber-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 animate-slide-up animation-delay-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 via-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-xl mx-auto">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 group-hover:text-amber-300 transition-colors text-center">Split Bills</h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed group-hover:text-white/90 transition-colors text-center">
                Auto-calculate splits, fair shares, zero awkward math moments – just pure convenience 💰⚡
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-slide-up animation-delay-800 px-2 sm:px-4">
            <Card className="inline-block w-full max-w-2xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10"></div>
              
              <div className="relative">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                  <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-3 lg:px-4 py-0.5 sm:py-1 md:py-2 bg-yellow-500/20 rounded-full">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3 md:mb-4">Ready to Start Planning?</h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 max-w-xl mx-auto">
                  Join thousands organizing epic hangouts. Sign in with Google and get started in seconds! 🚀
                </p>
                
                <Button
                  size="lg"
                  className="group relative bg-white hover:bg-gray-50 text-gray-900 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto"
                  onClick={handleSignIn}
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="whitespace-nowrap">{loading ? 'Signing you in...' : 'Sign in with Google'}</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                  </div>
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-4 sm:mt-6 md:mt-8 text-[10px] sm:text-xs md:text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                    <span>2 min setup</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-emerald-400 flex-shrink-0" />
                    <span>No credit card</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-blue-400 flex-shrink-0" />
                    <span>Free forever</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <p className="text-center text-white/40 text-[10px] sm:text-xs md:text-sm mt-4 sm:mt-6 md:mt-8 lg:mt-12 px-2 sm:px-4 animate-fade-in animation-delay-1000">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
