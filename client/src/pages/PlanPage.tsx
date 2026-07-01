import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import PlanHero from '../components/plan/PlanHero';
import RegionSelector, { hubOptions } from '../components/plan/RegionSelector';
import DurationPicker from '../components/plan/DurationPicker';
import BudgetSelector from '../components/plan/BudgetSelector';
import VibePicker from '../components/plan/VibePicker';
import TravelGroupPicker from '../components/plan/TravelGroupPicker';

const formVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const formItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

export default function PlanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledHub = searchParams.get('hub');

  // Region state
  const [region, setRegion] = useState(() => {
    if (prefilledHub) {
      for (const [reg, hubs] of Object.entries(hubOptions)) {
        if (hubs.includes(prefilledHub)) {
          return reg;
        }
      }
    }
    return 'visayas';
  });
  const [hub, setHub] = useState(prefilledHub || 'Cebu (City, Moalboal, Bantayan)');

  // Date state
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Budget state
  const [budgetBasis, setBudgetBasis] = useState<'per-day' | 'duration'>('per-day');
  const [selectedBudget, setSelectedBudget] = useState('mid-range');

  // Vibe state
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Relaxation']);
  const [selectedPace, setSelectedPace] = useState('Relaxed');

  // Travel group state
  const [selectedGroup, setSelectedGroup] = useState('solo');
  const [groupSize, setGroupSize] = useState(2);
  const [selectedAccommodation, setSelectedAccommodation] = useState('hotel');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['No Restrictions']);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVibeToggle = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleVibeEdit = (oldVibe: string, newVibe: string | null) => {
    setSelectedVibes((prev) => {
      const idx = prev.indexOf(oldVibe);
      if (idx === -1) return prev;
      const next = [...prev];
      if (newVibe === null) {
        next.splice(idx, 1);
      } else {
        next[idx] = newVibe;
      }
      return next;
    });
  };

  const handleDietaryToggle = (pref: string) => {
    setSelectedDietary((prev) =>
      prev.includes(pref) ? prev.filter((d) => d !== pref) : [...prev, pref]
    );
  };

  // Fix #3: Validate date range before submitting
  const isDateValid = endDate > startDate;

  // Calculate duration synchronously for UI logic
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const handleGenerate = async () => {
    setErrorMsg(null);

    if (endDate < startDate) {
      setErrorMsg('Please select a valid date range — your end date must be on or after your start date.');
      return;
    }

    if (selectedVibes.length === 0) {
      setErrorMsg('Please select at least one trip vibe before generating.');
      return;
    }

    setLoading(true);
    try {
      const travelGroup =
        selectedGroup === 'group' || selectedGroup === 'family'
          ? `${selectedGroup} of ${groupSize}`
          : selectedGroup;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          hub,
          duration: durationDays,
          purpose: selectedVibes.join(', '),
          pace: selectedPace,
          budget: selectedBudget,
          budgetBasis,
          travelGroup,
          accommodation: selectedAccommodation,
          dietary: selectedDietary.join(', '),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary. Please ensure the backend is running.');
      }

      const data = await response.json();
      localStorage.setItem('tuklas_latest_itinerary', JSON.stringify(data));
      navigate('/sample-trip');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred connecting to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-24 md:pb-0">
      {/* Hero Section */}
      <PlanHero />

      {/* Glass Form Panel overlapping hero */}
      <div className="relative -mt-8 md:-mt-20 z-20 px-5 md:px-auto max-w-[1200px] mx-auto w-full px-5 pb-lg md:pb-xl">
        <motion.div 
          variants={formVariants}
          initial="hidden"
          animate="show"
          className="relative glass-panel rounded-3xl p-md md:p-lg shadow-[0_12px_40px_rgba(0,51,102,0.12)] space-y-md md:space-y-lg"
        >

          {/* Fix #4: Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 rounded-3xl z-30 flex flex-col items-center justify-center gap-4 bg-surface/80 backdrop-blur-sm">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-secondary-container border-t-secondary animate-spin" />
                <span
                  className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-secondary"
                  style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
                >
                  travel_explore
                </span>
              </div>
              <div className="text-center">
                <p className="font-headline-md text-headline-md text-primary">Curating your perfect trip…</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Our AI is finding the best spots for you.
                </p>
              </div>
            </div>
          )}

          {/* Fix #5: In-page Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 animate-in fade-in duration-300">
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                error
              </span>
              <div className="flex-1">
                <p className="font-label-md text-label-md font-bold">Something went wrong</p>
                <p className="font-body-md text-sm mt-0.5">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-on-error-container/60 hover:text-on-error-container transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
          )}

          {/* Step 01 — Row 1: Region + Duration */}
          <motion.div variants={formItem}>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-md opacity-60">
              <span className="text-secondary font-bold">01</span> · Location & Duration
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg lg:gap-xl">
              <RegionSelector
                selected={region}
                onSelect={setRegion}
                hub={hub}
                onHubChange={setHub}
              />
              <DurationPicker
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
              />
            </div>
          </motion.div>

          <motion.hr variants={formItem} className="border-surface-variant" />

          {/* Step 02 — Row 2: Budget + Vibe */}
          <motion.div variants={formItem}>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-md opacity-60">
              <span className="text-secondary font-bold">02</span> · Budget & Vibe
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg lg:gap-xl">
              <BudgetSelector
                budgetBasis={budgetBasis}
                selectedBudget={selectedBudget}
                durationDays={durationDays}
                onBudgetBasisChange={setBudgetBasis}
                onBudgetChange={setSelectedBudget}
              />
              <VibePicker
                selectedVibes={selectedVibes}
                selectedPace={selectedPace}
                onVibeToggle={handleVibeToggle}
                onVibeEdit={handleVibeEdit}
                onPaceSelect={setSelectedPace}
              />
            </div>
          </motion.div>

          <motion.hr variants={formItem} className="border-surface-variant" />

          {/* Step 03 — Row 3: Travel Group + Preferences */}
          <motion.div variants={formItem}>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-md opacity-60">
              <span className="text-secondary font-bold">03</span> · Group & Preferences
            </p>
            <TravelGroupPicker
              selectedGroup={selectedGroup}
              onGroupSelect={setSelectedGroup}
              groupSize={groupSize}
              onGroupSizeChange={setGroupSize}
              selectedAccommodation={selectedAccommodation}
              onAccommodationSelect={setSelectedAccommodation}
              selectedDietary={selectedDietary}
              onDietaryToggle={handleDietaryToggle}
            />
          </motion.div>

          <motion.hr variants={formItem} className="border-surface-variant" />

          {/* Generate CTA */}
          <motion.div variants={formItem} className="pt-sm">
            <div className="text-center mb-4">
              <button
                onClick={handleGenerate}
                disabled={loading || !isDateValid}
                className="cta-glow bg-primary text-on-primary font-headline-md text-headline-md py-3 px-10 rounded-xl w-full md:w-auto inline-flex items-center justify-center gap-3 border-t border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                Generate My Itinerary
              </button>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                AI-curated based on your preferences.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-on-surface-variant/60">
              <div className="h-px bg-surface-variant flex-1 max-w-[100px]" />
              <span className="font-label-sm text-label-sm">or</span>
              <div className="h-px bg-surface-variant flex-1 max-w-[100px]" />
            </div>
            <p className="text-center mt-3 font-body-sm text-on-surface-variant">
              Prefer a conversational approach?{' '}
              <a href="/chat" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                Use Chat Instead
              </a>
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
