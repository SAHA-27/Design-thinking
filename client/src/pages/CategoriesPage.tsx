import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Droplets, 
  Wind, 
  Bike, 
  Car, 
  Disc, 
  Refrigerator, 
  Zap, 
  Wrench, 
  Sparkles, 
  Paintbrush, 
  Laptop, 
  Hammer,
  ShieldCheck,
  Clock,
  Star
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const iconMap: Record<string, any> = {
  Droplets,
  Wind,
  Bike,
  Car,
  Disc,
  Refrigerator,
  Zap,
  Wrench,
  Sparkles,
  Paintbrush,
  Laptop,
  Hammer
};

export const CategoriesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          api.get('/services/categories'),
          api.get('/services')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (srvRes.data.success) setServices(srvRes.data.services);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.categoryId?._id === selectedCategory || s.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !searchQuery ||
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      (s.titleTa && s.titleTa.includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Complete Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">
            {language === 'ta' ? 'அனைத்து சேவை பிரிவுகள்' : 'All Service Categories & Solutions'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Transparent pricing, OEM-grade spare parts, and certified background-verified professionals for home & vehicles.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-md focus:border-teal-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category Pills Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Categories ({services.length})
          </button>
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Wrench;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                  selectedCategory === cat._id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{language === 'ta' && cat.nameTa ? cat.nameTa : cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-amber-700 flex items-center gap-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{service.rating || 4.8}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-lg bg-navy-900/80 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-teal-400" />
                    <span>~{service.estimatedDurationMins || 60} mins</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-navy-900 group-hover:text-teal-700 transition">
                    {language === 'ta' && service.titleTa ? service.titleTa : service.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {language === 'ta' && service.descriptionTa ? service.descriptionTa : service.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5">
                    {(service.includedFeatures || []).slice(0, 3).map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-navy-900">₹{service.basePrice}</span>
                    <span className="text-[11px] text-slate-400">+ ₹{service.visitingCharge} visit</span>
                  </div>
                </div>
                <Link
                  to={`/services/${service._id}`}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow-xs flex items-center gap-1"
                >
                  <span>Select & Book</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">No services match your search</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for "AC", "RO Purifier", "Bike", or clear filters.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
