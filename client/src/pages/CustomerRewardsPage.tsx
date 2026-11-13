import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Wallet, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Gift, 
  AlertCircle, 
  Tag, 
  RefreshCw, 
  Calendar,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RewardCelebrationModal } from '../components/RewardCelebrationModal';

export const CustomerRewardsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [unacknowledgedReward, setUnacknowledgedReward] = useState<any | null>(null);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get('/loyalty/wallet'),
        api.get('/loyalty/transactions')
      ]);

      if (walletRes.data.success) {
        setWalletData(walletRes.data);
        if (walletRes.data.wallet?.unacknowledgedReward) {
          setUnacknowledgedReward(walletRes.data.wallet.unacknowledgedReward);
        }
      }

      if (txRes.data.success) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.error('Failed to load loyalty rewards data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const wallet = walletData?.wallet;
  const config = walletData?.config;
  const progression = walletData?.progression;

  const tiers = config?.tiers || {
    bronze: { minBookings: 5, rewardAmount: 100, name: 'Bronze Member', perks: ['₹100 Instant Bonus Credit', 'Priority Customer Support'] },
    silver: { minBookings: 10, rewardAmount: 250, name: 'Silver Member', perks: ['₹250 Instant Bonus Credit', '5% Off Spare Parts', 'Free Annual Equipment Inspection'] },
    gold: { minBookings: 20, rewardAmount: 500, name: 'Gold Member', perks: ['₹500 Instant Bonus Credit', '10% Off Spare Parts', 'Zero Visiting Charges on Emergency Bookings'] },
    platinum: { minBookings: 30, rewardAmount: 1000, name: 'Platinum Member', perks: ['₹1,000 Instant Bonus Credit', 'Dedicated VIP Technician Dispatch', 'Free RO Filter Renewal Kit'] }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Platinum Member':
        return {
          bg: 'bg-gradient-to-r from-slate-800 via-slate-900 to-teal-950',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
          accent: 'text-teal-300'
        };
      case 'Gold Member':
        return {
          bg: 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950',
          badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          accent: 'text-amber-300'
        };
      case 'Silver Member':
        return {
          bg: 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900',
          badge: 'bg-slate-300/20 text-slate-200 border-slate-300/40',
          accent: 'text-slate-200'
        };
      case 'Bronze Member':
        return {
          bg: 'bg-gradient-to-r from-amber-800 via-stone-800 to-amber-950',
          badge: 'bg-amber-600/20 text-amber-200 border-amber-500/40',
          accent: 'text-amber-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
          accent: 'text-teal-300'
        };
    }
  };

  const currentTierStyles = getTierColor(wallet?.currentTier || 'Member');

  const filteredTransactions = transactions.filter(t => {
    if (activeFilter === 'all') return true;
    return t.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Congratulatory Celebration Modal */}
      {unacknowledgedReward && (
        <RewardCelebrationModal
          unacknowledgedReward={unacknowledgedReward}
          onClose={() => {
            setUnacknowledgedReward(null);
            fetchLoyaltyData();
          }}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 relative overflow-hidden ${currentTierStyles.bg}`}>
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${currentTierStyles.badge} flex items-center gap-1.5`}>
                  <Award className="h-3.5 w-3.5" />
                  <span>{wallet?.currentTier || 'Member'}</span>
                </span>
                <span className="text-xs text-slate-300">
                  • Verified Smart Rewards Member
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Customer Loyalty & Rewards Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Earn automatic cash bonus credits for every successfully verified booking. Redeem your balance as instant checkout discounts on any service.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-500 px-5 py-3 text-xs sm:text-sm font-bold text-white transition shadow-lg shadow-teal-600/30"
              >
                <Sparkles className="h-4 w-4" />
                <span>Book Service & Redeem</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Core Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Usable Balance */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Available Balance</span>
              <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                ₹{wallet?.availableBalance || 0}
              </div>
              <span className="text-xs text-teal-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready to use at checkout
              </span>
            </div>
            <div className="rounded-2xl bg-teal-50 p-3.5 text-teal-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          {/* 2. Total Earned */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Bonuses Earned</span>
              <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                ₹{wallet?.totalRewardsEarned || 0}
              </div>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                From milestone unlocks
              </span>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3.5 text-amber-600">
              <Gift className="h-6 w-6" />
            </div>
          </div>

          {/* 3. Completed Bookings */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Completed Bookings</span>
              <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                {wallet?.completedBookingsCount || 0}
              </div>
              <span className="text-xs text-emerald-600 font-semibold block mt-1">
                Verified & sealed with OTP
              </span>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          {/* 4. Total Redeemed */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Savings Redeemed</span>
              <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                ₹{wallet?.totalRewardsRedeemed || 0}
              </div>
              <span className="text-xs text-purple-600 font-semibold block mt-1">
                Discounts applied to orders
              </span>
            </div>
            <div className="rounded-2xl bg-purple-50 p-3.5 text-purple-600">
              <Tag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Milestone Progression Tracker Bar */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="h-4 w-4" />
                <span>Loyalty Journey Progress</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 mt-0.5">
                {progression?.isTopTier ? (
                  <span>🏆 Highest Tier Reached: Platinum Elite!</span>
                ) : (
                  <span>Next Reward: {progression?.targetTier} (+₹{progression?.targetReward})</span>
                )}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-medium">Verified Services Completed</span>
              <div className="text-lg font-black text-navy-900">
                {progression?.completedCount || 0} / {progression?.targetBookings || 5} Bookings
              </div>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progression?.progressPercent || 0}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>{progression?.completedCount || 0} completed</span>
              {!progression?.isTopTier ? (
                <span className="text-teal-700 font-bold">
                  {progression?.remainingBookings} more booking{progression?.remainingBookings !== 1 ? 's' : ''} needed to unlock +₹{progression?.targetReward}
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">Maximum Tier Active</span>
              )}
            </div>
          </div>

          {/* 4 Interactive Milestone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Bronze Tier Card */}
            {(() => {
              const isUnlocked = (wallet?.completedBookingsCount || 0) >= tiers.bronze.minBookings;
              return (
                <div className={`rounded-2xl p-4 border transition-all ${
                  isUnlocked 
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs' 
                    : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-amber-800 flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      <span>{tiers.bronze.name}</span>
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <Lock className="h-3 w-3" />
                        {tiers.bronze.minBookings} Bookings
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-navy-900">
                    ₹{tiers.bronze.rewardAmount} Bonus
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    At 5 successfully verified service completions.
                  </p>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                    {tiers.bronze.perks?.map((perk: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Silver Tier Card */}
            {(() => {
              const isUnlocked = (wallet?.completedBookingsCount || 0) >= tiers.silver.minBookings;
              return (
                <div className={`rounded-2xl p-4 border transition-all ${
                  isUnlocked 
                    ? 'bg-slate-100/70 border-slate-400 shadow-xs' 
                    : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-slate-500" />
                      <span>{tiers.silver.name}</span>
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <Lock className="h-3 w-3" />
                        {tiers.silver.minBookings} Bookings
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-navy-900">
                    ₹{tiers.silver.rewardAmount} Bonus
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    At 10 successfully verified service completions.
                  </p>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                    {tiers.silver.perks?.map((perk: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Gold Tier Card */}
            {(() => {
              const isUnlocked = (wallet?.completedBookingsCount || 0) >= tiers.gold.minBookings;
              return (
                <div className={`rounded-2xl p-4 border transition-all ${
                  isUnlocked 
                    ? 'bg-amber-100/50 border-amber-400 shadow-xs' 
                    : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-amber-700 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>{tiers.gold.name}</span>
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <Lock className="h-3 w-3" />
                        {tiers.gold.minBookings} Bookings
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-navy-900">
                    ₹{tiers.gold.rewardAmount} Bonus
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    At 20 successfully verified service completions.
                  </p>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                    {tiers.gold.perks?.map((perk: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Platinum Tier Card */}
            {(() => {
              const isUnlocked = (wallet?.completedBookingsCount || 0) >= tiers.platinum.minBookings;
              return (
                <div className={`rounded-2xl p-4 border transition-all ${
                  isUnlocked 
                    ? 'bg-teal-50 border-teal-400 shadow-sm' 
                    : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-teal-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                      <span>{tiers.platinum.name}</span>
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <Lock className="h-3 w-3" />
                        {tiers.platinum.minBookings} Bookings
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-navy-900">
                    ₹{tiers.platinum.rewardAmount} Bonus
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    At 30 successfully verified service completions.
                  </p>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                    {tiers.platinum.perks?.map((perk: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                <span>Rewards Audit Ledger</span>
              </div>
              <h3 className="text-xl font-extrabold text-navy-900 mt-0.5">
                Wallet Transaction History
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeFilter === 'all' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                All Activity
              </button>
              <button
                onClick={() => setActiveFilter('credit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeFilter === 'credit' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Earned Credits (+)
              </button>
              <button
                onClick={() => setActiveFilter('debit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeFilter === 'debit' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Redeemed (-)
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
              <span className="text-xs font-semibold">Loading wallet transactions...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-10 text-center border border-slate-200">
              <Gift className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No transactions recorded yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Complete your first verified service bookings to unlock milestone bonus credits into your Rewards Wallet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Date & Time</th>
                    <th className="pb-3 px-2">Activity / Milestone</th>
                    <th className="pb-3 px-2">Booking #</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Amount</th>
                    <th className="pb-3 px-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-2 text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-2 font-semibold text-navy-900">
                        {tx.title}
                        {tx.description && (
                          <span className="block text-[11px] text-slate-500 font-normal">{tx.description}</span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-teal-700 font-bold">
                        {tx.bookingNumber ? (
                          <Link to="/bookings" className="hover:underline">
                            #{tx.bookingNumber}
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                          {tx.category?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tx.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                          tx.status === 'Redeemed' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3 px-2 text-right font-black text-sm whitespace-nowrap ${
                        tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-slate-600 whitespace-nowrap">
                        ₹{tx.balanceAfter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Explainers & Fairness Rules Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-navy-900 font-extrabold text-base">
            <Info className="h-5 w-5 text-teal-600" />
            <span>How the Smart Rewards Program Works</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-navy-900 block text-sm">1. Book & Verify</span>
              <p>
                Every service completed with ProofCare™ photo evidence and customer OTP verification counts toward your milestone counter.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-navy-900 block text-sm">2. Unlock Instant Cash Bonus</span>
              <p>
                Reach 5, 10, 20, or 30 bookings to automatically unlock ₹100, ₹250, ₹500, or ₹1,000 in your Rewards Wallet.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-navy-900 block text-sm">3. 1-Click Checkout Discount</span>
              <p>
                Apply your available rewards directly at booking checkout to deduct the final payable amount with zero fuss.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
