import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import api from '../services/api';

interface RewardCelebrationModalProps {
  unacknowledgedReward: {
    milestoneKey: string;
    tierName: string;
    rewardAmount: number;
    unlockedAt?: string;
  } | null;
  onClose: () => void;
}

export const RewardCelebrationModal: React.FC<RewardCelebrationModalProps> = ({
  unacknowledgedReward,
  onClose
}) => {
  useEffect(() => {
    if (unacknowledgedReward) {
      // Trigger festive multi-burst confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#0d9488', '#f59e0b', '#3b82f6'] });
      fire(0.2, { spread: 60, colors: ['#14b8a6', '#fbbf24', '#60a5fa'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffffff', '#0f766e'] });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [unacknowledgedReward]);

  if (!unacknowledgedReward) return null;

  const handleDismiss = async () => {
    try {
      await api.post('/loyalty/celebrate/acknowledge');
    } catch (e) {
      // Ignore background acknowledge error
    }
    onClose();
  };

  const getTierGradient = (key: string) => {
    switch (key) {
      case 'platinum':
        return 'from-slate-700 via-slate-900 to-teal-900 text-teal-300 border-teal-400';
      case 'gold':
        return 'from-amber-600 via-amber-700 to-amber-900 text-amber-200 border-amber-400';
      case 'silver':
        return 'from-slate-400 via-slate-600 to-slate-800 text-slate-100 border-slate-300';
      default:
        return 'from-amber-700 via-amber-800 to-amber-950 text-amber-300 border-amber-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Celebration Header Graphic */}
        <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-xl shadow-teal-500/30">
          <Award className="h-10 w-10 animate-bounce" />
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-navy-950 shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700 border border-teal-200 uppercase tracking-wider mb-2">
          Milestone Unlocked!
        </span>

        <h3 className="text-2xl font-black text-navy-900">
          Congratulations!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          You've unlocked the prestigious{' '}
          <strong className="text-navy-900 font-bold">{unacknowledgedReward.tierName}</strong> status!
        </p>

        {/* Reward Value Showcase */}
        <div className={`mt-5 rounded-2xl bg-gradient-to-br p-4 border shadow-inner ${getTierGradient(unacknowledgedReward.milestoneKey)}`}>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90 block">
            Bonus Reward Credited
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
            +₹{unacknowledgedReward.rewardAmount}
          </div>
          <span className="text-[11px] opacity-80 block mt-1">
            Instant credit added to your Rewards Wallet
          </span>
        </div>

        {/* Features list */}
        <div className="mt-5 space-y-2 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Redeemable on all upcoming home & vehicle bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Stackable with eligible promotional discount coupons</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Continuous progress toward higher reward tiers</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleDismiss}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm py-3 px-5 transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
        >
          <span>Claim Bonus & Explore Rewards</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
