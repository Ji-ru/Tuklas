import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { sampleItinerary } from '../../lib/sampleItinerary';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Define default Leaflet marker icon configuration to load correctly from CDN
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

  // Map Invalidation when switching viewMode
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // Initialize and Update Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultCenter: [number, number] = [12.8797, 121.7740];

    const map = L.map(mapContainerRef.current, {
      zoomControl: true, // Allow zoom control in modal map
      attributionControl: false
    }).setView(defaultCenter, 6);

    L.control.attribution({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mapRef.current = map;

    const coords: [number, number][] = [];

    activitiesList.forEach((activity: any) => {
      let lat = activity.lat;
      let lng = activity.lng;

      if (!lat || !lng) {
        const topVal = parseFloat(activity.mapTop || '50') / 100;
        const leftVal = parseFloat(activity.mapLeft || '50') / 100;
        lat = 10.3 + (0.5 - topVal) * 0.1;
        lng = 123.9 + (leftVal - 0.5) * 0.1;
      }

      if (lat && lng) {
        L.marker([lat, lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: inherit; padding: 2px; min-width: 150px;">
              <strong style="color: var(--color-primary, #003366); font-size: 14px; line-height: 1.3; display: block; margin-bottom: 4px;">${activity.title}</strong>
              <div style="font-size: 11px; color: #666; margin-top: 2px;">${activity.time} · ${activity.type}</div>
            </div>
          `, { minWidth: 160, maxWidth: 280, closeButton: false });

        coords.push([lat, lng]);
      }
    });

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activitiesList, viewMode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
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
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-surface border border-outline-variant/30 rounded-t-2xl rounded-b-none md:rounded-2xl w-full max-w-[900px] h-[92vh] md:h-[85vh] lg:h-[80vh] flex flex-col shadow-[0_24px_64px_rgba(0,51,102,0.25)] relative overflow-hidden mt-auto md:mt-0"
          >
            {/* Modal Header */}
            <div className="px-4 py-3 md:px-6 md:py-5 border-b border-surface-variant flex items-start justify-between bg-surface-container-low sticky top-0 z-20">
              <div className="pr-4">
                <span className="bg-secondary/15 text-secondary text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  Flagship Sample Preview
                </span>
                <h2 className="text-[22px] md:text-headline-md font-headline-md text-primary font-bold leading-tight">
                  {itineraryData.title}
                </h2>
                <p className="font-body-sm text-[11px] md:text-sm text-on-surface-variant mt-0.5 md:mt-1">
                  {itineraryData.duration} · High-End Philippines Island Route
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-on-surface-variant transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content area */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-0 relative">
              
              {/* Left Column: Day Navigation (25%) */}
              <aside className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-surface-variant bg-surface-container-lowest p-3 md:p-4 flex flex-row md:flex-col md:sticky md:top-0 gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-4 scrollbar-hide z-10 flex-shrink-0">
                {itineraryData.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`py-2 px-3 md:py-3 md:px-4 rounded-xl font-label-md text-xs md:text-label-md whitespace-nowrap text-left transition-all border flex flex-col gap-0.5 w-full ${
                      activeDayIndex === idx
                        ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-bold md:scale-[1.02]'
                        : 'bg-surface text-on-surface-variant border-surface-variant/30 hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-85">Day {day.dayNumber}</span>
                    <span className="truncate max-w-[120px] md:max-w-none">{day.dayTitle}</span>
                  </button>
                ))}
              </aside>

              {/* Right Column: Day Details & Activities (75%) */}
              <main className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col">
                {/* Day Header Info */}
                <div className="space-y-3 md:space-y-4 mb-5 md:mb-6 flex-shrink-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 bg-surface-container-low p-3 md:p-5 rounded-xl border border-surface-variant/40">
                    
                    {/* Transit Badge & Routing Rationale */}
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-label-md text-sm md:text-label-md">
                          {currentDay.dayNumber}
                        </div>
                        <h3 className="font-headline-md text-[16px] md:text-[18px] text-primary font-bold">
                          Day {currentDay.dayNumber}: {currentDay.dayTitle}
                        </h3>
                      </div>
                      
                      {currentDay.routingRationale && (
                        <p className="font-body-md text-[11px] md:text-sm text-on-surface-variant leading-relaxed pl-9 md:pl-10 border-l-2 border-secondary/35">
                          <span className="font-bold text-primary">Routing Rationale:</span> {currentDay.routingRationale}
                        </p>
                      )}
                    </div>

                    {/* Transit Details & Cost Column */}
                    <div className="flex-shrink-0 flex flex-col items-start md:items-end md:text-right pl-9 md:pl-4 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-3 md:pt-0">
                      {currentDay.estimatedCost && (
                        <div>
                          <span className="font-label-sm text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-wider block">Estimated Cost</span>
                          <span className="font-headline-md text-[16px] md:text-headline-sm text-secondary font-extrabold">{currentDay.estimatedCost}</span>
                        </div>
                      )}
                      {currentDay.transitDetails && (
                        <div className="flex items-center gap-1.5 mt-2 bg-primary/10 text-primary px-2.5 md:px-3 py-1 rounded-full font-label-sm text-[10px] md:text-label-sm">
                          <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                            {getTransitIcon(currentDay.transitDetails.mode)}
                          </span>
                          <span className="capitalize">{currentDay.transitDetails.mode}</span>
                          <span className="text-primary/60">·</span>
                          <span>{currentDay.transitDetails.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="flex bg-surface-container-low rounded-lg p-1 w-full max-w-[240px] border border-outline-variant/30 mx-auto md:mx-0">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 py-1 px-3 md:py-1.5 rounded-md font-label-md text-[11px] md:text-label-md flex items-center justify-center gap-1 md:gap-2 transition-all ${
                        viewMode === 'list'
                          ? 'bg-surface text-primary shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">view_list</span>
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`flex-1 py-1 px-3 md:py-1.5 rounded-md font-label-md text-[11px] md:text-label-md flex items-center justify-center gap-1 md:gap-2 transition-all ${
                        viewMode === 'map'
                          ? 'bg-surface text-primary shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">map</span>
                      Map
                    </button>
                  </div>
                </div>

                {/* Conditional View Area */}
                <div className="flex-1 relative min-h-[300px] md:min-h-[350px]">
                  {viewMode === 'list' ? (
                    <div className="relative pl-6 md:pl-8">
                      {/* Timeline line */}
                      <div className="absolute left-[11px] md:left-[15px] top-2 bottom-6 md:bottom-8 w-[2px] bg-surface-variant" />

                      {activitiesList.map((activity: any, idx: number) => (
                        <div key={activity.id || idx} className="relative mb-5 md:mb-6">
                          
                          {/* Pin number */}
                          <div className="absolute -left-[25px] md:-left-[30px] top-3.5 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-label-sm text-[10px] md:text-label-sm shadow-md border-2 border-surface bg-primary text-on-primary font-bold">
                            {idx + 1}
                          </div>

                          {/* Card layout */}
                          <div className="bg-surface rounded-xl border border-surface-variant/70 overflow-hidden flex flex-col sm:flex-row shadow-[0_4px_12px_rgba(0,51,102,0.04)]">
                            <div className="w-full sm:w-1/3 h-24 md:h-28 sm:h-36 relative flex-shrink-0">
                              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded text-primary font-label-sm text-[9px] md:text-label-sm">
                                {activity.time}
                              </div>
                            </div>
                            <div className="p-3 md:p-4 flex-1">
                              <span className={`inline-block font-label-sm tracking-wide uppercase mb-1 px-2 py-0.5 rounded-full text-[8px] md:text-[9px] ${getTypeColors(activity.type)}`}>
                                {activity.type}
                              </span>
                              <h4 className="font-headline-md text-sm md:text-base text-primary font-bold mb-1 leading-tight">
                                {activity.title}
                              </h4>
                              <p className="font-body-md text-[11px] md:text-xs text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3">
                                {activity.description}
                              </p>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[300px] md:min-h-[350px] rounded-xl overflow-hidden border border-surface-variant/70 shadow-sm relative z-0">
                      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
                    </div>
                  )}
                </div>
              </main>

            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 md:px-6 md:py-4 border-t border-surface-variant bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
              <span className="font-body-sm text-[9px] md:text-[10px] text-on-surface-variant text-center md:text-left order-2 md:order-1 leading-tight">
                *Tuklas AI generates real coordinates for your map display automatically.
              </span>
              <a
                href="/plan"
                className="bg-primary text-on-primary font-label-md text-[13px] md:text-label-md px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-primary/95 transition-colors shadow-sm active:scale-95 flex items-center gap-1 order-1 md:order-2 w-full md:w-auto justify-center"
              >
                <span>Plan Your Trip Now</span>
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">arrow_forward</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
