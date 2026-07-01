import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleItinerary } from '../../lib/sampleItinerary';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function getTransitIcon(mode: string) {
  const m = mode.toLowerCase();
  if (m.includes('flight')) return 'flight';
  if (m.includes('ferry') || m.includes('boat')) return 'sailing';
  if (m.includes('bus')) return 'directions_bus';
  if (m.includes('van') || m.includes('shuttle')) return 'airport_shuttle';
  if (m.includes('tricycle') || m.includes('trike') || m.includes('motorcycle')) return 'motorcycle';
  return 'directions_car';
}

function getTypeColors(type: string): string {
  const t = type?.toLowerCase() || '';
  if (t.includes('dining') || t.includes('food')) return 'bg-tertiary-container text-on-tertiary-container';
  if (t.includes('arrival') || t.includes('departure')) return 'bg-primary-container text-on-primary-container';
  if (t.includes('check')) return 'bg-secondary-container text-on-secondary-container';
  return 'bg-surface-container-high text-on-surface';
}

export default function SampleItineraryPreview({ isOpen, onClose }: Props) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const itineraryData = sampleItinerary;
  const currentDay = itineraryData.days[activeDayIndex] || itineraryData.days[0];
  const activitiesList = currentDay.activities || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-surface border border-outline-variant/30 rounded-2xl w-full max-w-[900px] h-[85vh] md:h-[80vh] flex flex-col shadow-[0_24px_64px_rgba(0,51,102,0.25)] relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-surface-variant flex items-center justify-between bg-surface-container-low sticky top-0 z-20">
              <div>
                <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  Flagship Sample Preview
                </span>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">
                  {itineraryData.title}
                </h2>
                <p className="font-body-sm text-sm text-on-surface-variant mt-0.5">
                  {itineraryData.duration} · High-End Philippines Island Route
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-on-surface-variant transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Content area */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-0">
              
              {/* Left Column: Day Navigation (25%) */}
              <aside className="w-full md:w-1/4 border-r border-surface-variant bg-surface-container-lowest p-4 sticky top-0 z-10 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-4">
                {itineraryData.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`py-3 px-4 rounded-xl font-label-md text-label-md whitespace-nowrap text-left transition-all border flex flex-col gap-0.5 w-full ${
                      activeDayIndex === idx
                        ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-bold scale-[1.02]'
                        : 'bg-surface text-on-surface-variant border-surface-variant/30 hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-85">Day {day.dayNumber}</span>
                    <span className="truncate max-w-[150px] md:max-w-none">{day.dayTitle}</span>
                  </button>
                ))}
              </aside>

              {/* Right Column: Day Details & Activities (75%) */}
              <main className="flex-grow p-6 overflow-y-auto">
                {/* Day Header Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low p-5 rounded-xl border border-surface-variant/40">
                    
                    {/* Transit Badge & Routing Rationale */}
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-label-md text-label-md">
                          {currentDay.dayNumber}
                        </div>
                        <h3 className="font-headline-md text-[18px] text-primary font-bold">
                          Day {currentDay.dayNumber}: {currentDay.dayTitle}
                        </h3>
                      </div>
                      
                      {currentDay.routingRationale && (
                        <p className="font-body-md text-sm text-on-surface-variant leading-relaxed pl-10 border-l-2 border-secondary/35">
                          <span className="font-bold text-primary">Routing Rationale:</span> {currentDay.routingRationale}
                        </p>
                      )}
                    </div>

                    {/* Transit Details & Cost Column */}
                    <div className="flex-shrink-0 flex flex-col items-end text-right pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0">
                      {currentDay.estimatedCost && (
                        <div>
                          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">Estimated Cost</span>
                          <span className="font-headline-md text-headline-sm text-secondary font-extrabold">{currentDay.estimatedCost}</span>
                        </div>
                      )}
                      {currentDay.transitDetails && (
                        <div className="flex items-center gap-1.5 mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[16px]">
                            {getTransitIcon(currentDay.transitDetails.mode)}
                          </span>
                          <span className="capitalize">{currentDay.transitDetails.mode}</span>
                          <span className="text-primary/60">·</span>
                          <span>{currentDay.transitDetails.duration}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Activities Timeline */}
                <div className="relative pl-8">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-2 bottom-8 w-[2px] bg-surface-variant" />

                  {activitiesList.map((activity, idx) => (
                    <div key={activity.id || idx} className="relative mb-6">
                      
                      {/* Pin number */}
                      <div className="absolute -left-[30px] top-3.5 w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm shadow-md border-2 border-surface bg-primary text-on-primary font-bold">
                        {idx + 1}
                      </div>

                      {/* Card layout */}
                      <div className="bg-surface rounded-xl border border-surface-variant/70 overflow-hidden flex flex-col sm:flex-row shadow-[0_4px_12px_rgba(0,51,102,0.04)]">
                        <div className="w-full sm:w-1/3 h-28 sm:h-36 relative flex-shrink-0">
                          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded text-primary font-label-sm text-label-sm">
                            {activity.time}
                          </div>
                        </div>
                        <div className="p-4 flex-1">
                          <span className={`inline-block font-label-sm text-label-sm tracking-wide uppercase mb-1 px-2 py-0.5 rounded-full text-[9px] ${getTypeColors(activity.type)}`}>
                            {activity.type}
                          </span>
                          <h4 className="font-headline-md text-base text-primary font-bold mb-1">
                            {activity.title}
                          </h4>
                          <p className="font-body-md text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </main>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-low flex items-center justify-between sticky bottom-0 z-20">
              <span className="font-body-sm text-xs text-on-surface-variant">
                *Tuklas AI generates real coordinates for your map display automatically.
              </span>
              <a
                href="/plan"
                className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/95 transition-colors shadow-sm active:scale-95 flex items-center gap-1"
              >
                <span>Plan Your Trip Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
