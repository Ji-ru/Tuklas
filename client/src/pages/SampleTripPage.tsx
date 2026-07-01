import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { sampleItinerary as fallbackItinerary } from '../lib/sampleItinerary';
import PrintableItinerary from '../components/trip/PrintableItinerary';

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

// Fix #11: Schema validation helper
function isValidItinerary(data: any): boolean {
  return (
    data &&
    typeof data.title === 'string' &&
    Array.isArray(data.days) &&
    data.days.length > 0 &&
    Array.isArray(data.days[0].activities)
  );
}

// Activity type color mapping for Fix #14
function getTypeColors(type: string): string {
  const t = type?.toLowerCase() || '';
  if (t.includes('dining') || t.includes('food')) return 'bg-tertiary-container text-on-tertiary-container';
  if (t.includes('arrival') || t.includes('departure')) return 'bg-primary-container text-on-primary-container';
  if (t.includes('check')) return 'bg-secondary-container text-on-secondary-container';
  return 'bg-surface-container-high text-on-surface';
}

export default function SampleTripPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [pinnedItem, setPinnedItem] = useState<number | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [shareToast, setShareToast] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const dayTabsRef = useRef<HTMLDivElement>(null);

  // Fix #11: Load + validate itinerary from localStorage
  const [itinerary, setItinerary] = useState<any>(() => {
    const saved = localStorage.getItem('tuklas_latest_itinerary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (isValidItinerary(parsed)) return parsed;
        console.warn('localStorage itinerary failed schema validation — using fallback.');
      } catch (e) {
        console.error('Failed to parse itinerary from localStorage:', e);
      }
    }
    return null;
  });

  const itineraryData = itinerary || fallbackItinerary;
  const currentDay = itineraryData.days?.[activeDayIndex] || itineraryData.days?.[0] || fallbackItinerary.days[0];
  const activitiesList = currentDay.activities || [];

  // Computed trip stats
  const totalDays = itineraryData.days?.length || 0;
  const totalActivities = itineraryData.days?.reduce((sum: number, d: any) => sum + (d.activities?.length || 0), 0) || 0;

  // 2. Map Invalidation when switching viewMode (mobile fix)
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // 3. Highlight marker on focus
  const focusedItem = pinnedItem ?? activeItem;

  // Auto-scroll active day tab into view
  useEffect(() => {
    if (dayTabsRef.current) {
      const activeTab = dayTabsRef.current.querySelector('[data-active="true"]') as HTMLElement;
      activeTab?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeDayIndex]);

  // Share handler
  const handleShare = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard sharing is not available in this browser.');
      return;
    }
    const lines: string[] = [`📍 ${itineraryData.title}`, `📅 ${itineraryData.duration}`, ''];
    itineraryData.days?.forEach((day: any) => {
      lines.push(`Day ${day.dayNumber}: ${day.dayTitle || 'Activities'}`);
      day.activities?.forEach((a: any) => lines.push(`  • ${a.time} — ${a.title}`));
      lines.push('');
    });
    lines.push('Planned with Tuklas — tuklas.travel');
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch {
      alert('Could not copy to clipboard.');
    }
  };

  // Print handler
  const handlePrint = () => window.print();

  // Toggle read-more for an activity card
  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 1. Initialize and Update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
    }

    const defaultCenter: [number, number] = [12.8797, 121.7740];

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(defaultCenter, 6);

    L.control.attribution({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    const markersMap: Record<number, L.Marker> = {};
    const coords: [number, number][] = [];

    activitiesList.forEach((activity: any, idx: number) => {
      const itemKey = activity.id || idx + 1;
      let lat = activity.lat;
      let lng = activity.lng;

      if (!lat || !lng) {
        const topVal = parseFloat(activity.mapTop || '50') / 100;
        const leftVal = parseFloat(activity.mapLeft || '50') / 100;
        lat = 10.3 + (0.5 - topVal) * 0.1;
        lng = 123.9 + (leftVal - 0.5) * 0.1;
      }

      if (lat && lng) {
        const marker = L.marker([lat, lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: inherit; padding: 2px;">
              <strong style="color: var(--color-primary, #003366); font-size: 14px;">${activity.title}</strong>
              <div style="font-size: 11px; color: #666; margin-top: 2px;">${activity.time} · ${activity.type}</div>
            </div>
          `);

        markersMap[itemKey] = marker;
        coords.push([lat, lng]);
      }
    });

    markersRef.current = markersMap;

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, [activitiesList]);

  // 2. Focus/Pan and Open Popup when focused item changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (focusedItem !== null) {
      const activeActivity = activitiesList.find((a: any, idx: number) => (a.id || idx + 1) === focusedItem);
      const marker = markersRef.current[focusedItem];

      let lat = activeActivity?.lat;
      let lng = activeActivity?.lng;

      if (activeActivity && (!lat || !lng)) {
        const topVal = parseFloat(activeActivity.mapTop || '50') / 100;
        const leftVal = parseFloat(activeActivity.mapLeft || '50') / 100;
        lat = 10.3 + (0.5 - topVal) * 0.1;
        lng = 123.9 + (leftVal - 0.5) * 0.1;
      }

      if (lat && lng) {
        map.setView([lat, lng], 14, { animate: true, duration: 0.6 });
      }
      if (marker) {
        marker.openPopup();
      }
    }
  }, [focusedItem, activitiesList]);

  // Map Navigation Functions
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const locateCenter = () => {
    const coords: [number, number][] = [];
    activitiesList.forEach((a: any) => {
      let lat = a.lat;
      let lng = a.lng;
      if (lat == null || lng == null) {
        const topVal = parseFloat(a.mapTop || '50') / 100;
        const leftVal = parseFloat(a.mapLeft || '50') / 100;
        lat = 10.3 + (0.5 - topVal) * 0.1;
        lng = 123.9 + (leftVal - 0.5) * 0.1;
      }
      coords.push([lat, lng]);
    });

    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [50, 50] });
    }
  };

  // Fix #13: Two-step reset handler
  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    localStorage.removeItem('tuklas_latest_itinerary');
    setItinerary(null);
    setActiveDayIndex(0);
    setActiveItem(null);
    setPinnedItem(null);
    setConfirmReset(false);
  };



  return (
    <>
      <PrintableItinerary itineraryData={itineraryData} />
      
      <div className="print:hidden flex flex-col md:flex-row pt-[88px] h-screen bg-background text-on-surface overflow-hidden">
        {/* Sidebar — hidden on mobile when map is active */}
        <div className={`
          w-full md:w-2/5 lg:w-[40%] bg-surface flex flex-col h-full
          border-r border-surface-variant overflow-y-auto relative z-10
          shadow-[0_8px_20px_rgba(0,51,102,0.08)]
          ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}
        `}>

          {/* Itinerary Header */}
          <div className="px-5 md:px-md py-4 border-b border-surface-variant sticky top-0 bg-surface/95 backdrop-blur-sm z-20 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="font-headline-md text-headline-md text-primary mb-0.5">
                  {itineraryData.title}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  {itineraryData.duration}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Share */}
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  title="Copy itinerary to clipboard"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
                {/* Print */}
                <button
                  onClick={handlePrint}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  title="Print itinerary"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </button>
                {itinerary && (
                  <button
                    onClick={handleResetClick}
                    className={`font-label-md text-label-md flex items-center gap-1 px-2 py-1 rounded transition-all border ${
                      confirmReset
                        ? 'bg-error text-on-error border-error shadow-md animate-pulse'
                        : 'text-on-surface-variant hover:text-error hover:border-error bg-surface-container-low border-outline-variant/30'
                    }`}
                    title={confirmReset ? 'Click again to confirm reset' : 'Clear saved itinerary'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {confirmReset ? 'warning' : 'refresh'}
                    </span>
                    {confirmReset ? 'Confirm?' : 'Reset'}
                  </button>
                )}
              </div>
            </div>

            {/* Trip Stats Bar */}
            <div className="flex gap-4 text-on-surface-variant">
              <span className="font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">today</span>
                {totalDays} Day{totalDays !== 1 ? 's' : ''}
              </span>
              <span className="font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                {totalActivities} Activit{totalActivities !== 1 ? 'ies' : 'y'}
              </span>
              {itinerary && (
                <span className="font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">star</span>
                  Your Trip
                </span>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-surface-container-low rounded-lg p-1 w-full max-w-[240px]">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-1.5 px-3 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_list</span>
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 py-1.5 px-3 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${
                  viewMode === 'map'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                Map
              </button>
            </div>

            {/* Day Selector Tabs */}
            {itineraryData.days && itineraryData.days.length > 1 && (
              <div ref={dayTabsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {itineraryData.days.map((day: any, idx: number) => (
                  <button
                    key={day.dayNumber}
                    data-active={activeDayIndex === idx ? 'true' : 'false'}
                    onClick={() => {
                      setActiveDayIndex(idx);
                      setActiveItem(null);
                      setPinnedItem(null);
                    }}
                    className={`py-1 px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all border ${
                      activeDayIndex === idx
                        ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-bold'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Day Activities List */}
          <div className="p-5 md:p-md flex-1">
            <div className="mb-6 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40 space-y-3">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-label-md text-label-md">
                    {currentDay.dayNumber}
                  </div>
                  <h2 className="font-headline-md text-headline-md text-primary leading-tight font-bold">
                    Day {currentDay.dayNumber}: {currentDay.dayTitle || 'Activities'}
                  </h2>
                </div>
                
                {/* Cost & Transit Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  {currentDay.estimatedCost && (
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                      Cost: {currentDay.estimatedCost}
                    </span>
                  )}
                  {currentDay.transitDetails && (
                    <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        {getTransitIcon(currentDay.transitDetails.mode)}
                      </span>
                      <span className="capitalize">{currentDay.transitDetails.mode} ({currentDay.transitDetails.duration})</span>
                    </span>
                  )}
                </div>
              </div>

              {currentDay.routingRationale && (
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed pl-11 border-l-2 border-secondary/35">
                  <span className="font-bold text-primary">Routing Rationale:</span> {currentDay.routingRationale}
                </p>
              )}
            </div>

            <div className="relative pl-10">
              <div className="absolute left-[19px] top-2 bottom-8 w-[2px] bg-surface-variant" />

              {activitiesList.length > 0 ? (
                activitiesList.map((activity: any, idx: number) => {
                  const itemKey = activity.id || idx + 1;
                  const isHovered = activeItem === itemKey;
                  const isPinned = pinnedItem === itemKey;

                  return (
                    <div
                      key={itemKey}
                      className="relative mb-8 cursor-pointer"
                      onMouseEnter={() => !pinnedItem && setActiveItem(itemKey)}
                      onMouseLeave={() => !pinnedItem && setActiveItem(null)}
                      onClick={() => setPinnedItem(prev => prev === itemKey ? null : itemKey)}
                    >
                      {/* Timeline Pin */}
                      <div className={`absolute -left-[34px] top-4 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm shadow-md border-2 border-surface z-10 transition-all duration-300 ${
                        isPinned ? 'bg-secondary text-on-secondary scale-110' : 'bg-primary text-on-primary'
                      }`}>
                        {isPinned
                          ? <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                          : idx + 1
                        }
                      </div>

                      {/* Activity Card */}
                      <div className={`bg-surface-bright rounded-xl border overflow-hidden flex flex-col sm:flex-row transition-all duration-300 ${
                        isPinned
                          ? 'border-secondary/40 shadow-[0_12px_40px_rgba(0,109,61,0.15)] -translate-y-1'
                          : isHovered
                            ? 'border-primary/30 shadow-[0_12px_40px_rgba(0,51,102,0.12)] -translate-y-0.5'
                            : 'border-surface-variant shadow-[0_4px_12px_rgba(0,51,102,0.06)]'
                      }`}>
                        {/* Image */}
                        <div className="w-full sm:w-1/3 h-32 sm:h-auto relative min-h-[100px]">
                          {activity.image ? (
                            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-surface-container flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline text-3xl">photo</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-label-sm text-label-sm">
                            {activity.time}
                          </div>
                          {isPinned && (
                            <div className="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                              <span className="material-symbols-outlined" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                              Pinned
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="p-4 flex-1">
                          <span className={`inline-block font-label-sm text-label-sm tracking-wide uppercase mb-1 px-2 py-0.5 rounded-full text-[10px] ${getTypeColors(activity.type)}`}>
                            {activity.type}
                          </span>
                          <h3 className="font-headline-md text-[18px] leading-[26px] text-primary mb-2">{activity.title}</h3>
                          <p className={`font-body-md text-sm text-on-surface-variant ${expandedItems.has(itemKey) ? '' : 'line-clamp-2'}`}>
                            {activity.description}
                          </p>
                          {activity.description && activity.description.length > 100 && (
                            <button
                              onClick={e => { e.stopPropagation(); toggleExpand(itemKey); }}
                              className="font-label-sm text-label-sm text-primary mt-1 hover:underline flex items-center gap-0.5"
                            >
                              {expandedItems.has(itemKey) ? 'Show less' : 'Read more'}
                              <span className="material-symbols-outlined text-[14px]">{expandedItems.has(itemKey) ? 'expand_less' : 'expand_more'}</span>
                            </button>
                          )}
                          {!isPinned && (
                            <p className="font-label-sm text-label-sm text-on-surface-variant/50 mt-2 flex items-center gap-1">
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>touch_app</span>
                              Click to pin on map
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="font-body-md text-on-surface-variant">No activities scheduled for this day.</p>
              )}
            </div>
            <div className="h-24 md:h-8" />
          </div>

          {/* Empty State CTA (Shown when no user itinerary exists) */}
          {!itinerary && (
            <div className="mx-5 md:mx-md mb-8 p-6 bg-surface-container-high border border-outline-variant/30 rounded-2xl text-center shadow-sm">
              <h3 className="font-headline-sm text-primary mb-2">You're viewing a sample trip</h3>
              <p className="font-body-sm text-on-surface-variant mb-4">
                You haven't generated your own itinerary yet. Start planning to see your customized trip here.
              </p>
              <a 
                href="/plan" 
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:bg-primary/90 transition-colors inline-block"
              >
                Start Planning
              </a>
            </div>
          )}
        </div>

        {/* Share Toast */}
        <div className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
          shareToast ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-on-surface text-surface px-5 py-3 rounded-full shadow-xl font-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
            Itinerary copied to clipboard!
          </div>
        </div>

        {/* Map Panel — always in DOM so ref stays stable; hidden on mobile when list is active */}
        <section className={`
          w-full md:w-3/5 lg:w-[60%] h-full relative bg-surface-container-low overflow-hidden flex-shrink-0
          ${viewMode === 'list' ? 'hidden md:block' : 'block'}
        `}>
          <div ref={mapContainerRef} className="relative w-full h-full z-0" />

          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none z-10" />

          {/* Custom Map Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
            <button onClick={zoomIn} className="w-10 h-10 bg-surface rounded-lg shadow-md flex items-center justify-center text-primary hover:bg-surface-container hover:scale-105 active:scale-95 transition-all" title="Zoom In">
              <span className="material-symbols-outlined font-bold">add</span>
            </button>
            <button onClick={zoomOut} className="w-10 h-10 bg-surface rounded-lg shadow-md flex items-center justify-center text-primary hover:bg-surface-container hover:scale-105 active:scale-95 transition-all" title="Zoom Out">
              <span className="material-symbols-outlined font-bold">remove</span>
            </button>
            <button onClick={locateCenter} className="w-10 h-10 bg-surface rounded-lg shadow-md flex items-center justify-center text-primary mt-2 hover:bg-surface-container hover:scale-105 active:scale-95 transition-all" title="Recenter Map">
              <span className="material-symbols-outlined font-bold">my_location</span>
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-xl p-4 z-10 w-52 shadow-lg">
            <h4 className="font-label-md text-label-md text-primary mb-3 font-bold">Activity Types</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-container border-2 border-primary/40 flex-shrink-0" />
                <span className="font-label-sm text-label-sm text-on-surface">Arrival / Departure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-container border-2 border-secondary/40 flex-shrink-0" />
                <span className="font-label-sm text-label-sm text-on-surface">Check-in / Leisure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary-container border-2 border-tertiary/40 flex-shrink-0" />
                <span className="font-label-sm text-label-sm text-on-surface">Dining</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-surface-container-high border-2 border-outline-variant flex-shrink-0" />
                <span className="font-label-sm text-label-sm text-on-surface">Other Activities</span>
              </div>
            </div>
          </div>

          {/* Mobile: back to list button */}
          <button
            onClick={() => setViewMode('list')}
            className="md:hidden absolute top-6 left-6 z-10 bg-surface text-primary rounded-lg shadow-md px-4 py-2 flex items-center gap-2 font-label-md text-label-md hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to List
          </button>
        </section>
      </div>
    </>
  );
}
