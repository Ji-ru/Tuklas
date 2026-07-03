import { useState } from 'react';

export interface DestinationEntry {
  id: string;
  region: string;
  hub: string;
}

interface Props {
  destinations: DestinationEntry[];
  onChange: (destinations: DestinationEntry[]) => void;
}

const MAX_DESTINATIONS = 5;

const regions = [
  {
    id: 'luzon',
    label: 'Luzon',
    bg: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEBjwl2mMUMuSEeZcZYr0sY4ovK1LM-mdAlCDzRPbPdipFLMPVbICt1FI0G_G14Bg6axcPnDanaTnDYmnuTfDNZKFrGS7CMsIByE7briRhpYRpTDFhw3eL8uUgvM2rNftas2CBJck_yUElPTkkoVAZQ_K-FqSaunDXNfSwqnFDHs5Q8jIlFUUSV3piS8jHjKHbOe287wkt1y6froFGoWlfR6A5WEKSNtF_kekeCgZzqKW0tYMwmLElqO-l-CZ9Z7gznLr0jKlY3CSP')",
  },
  {
    id: 'visayas',
    label: 'Visayas',
    bg: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBh4KKmPhWwyroJl0m8baf2HgOa99F-hjYNeqvFqWHOkv4dWnQj7aTr-HSxe1CIJEQP8Ix4CaFigQIPbvE7ref5t5GqXHZHoFMJ4KEA5HiWkDOd7dhsZuM5_qKajnKJrAfU0-ldCtXU16ke1_0fxs6Mgq8I6w54vzk4pO1_VlJD32YCdHnR3I2M4EmBbn_egvBKnHa_tJqucWG9tQdkravzmcow19-d37jQsVPbM2dSLcYhD1CBqOUT1Sqhj4UYKaFlNfPdHPydQ41y')",
  },
  {
    id: 'mindanao',
    label: 'Mindanao',
    bg: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjq2kXqEEZsKs9LqxdrpGHPYf-46amA78TUAliLuZpfvnGKsxW06K7VX8PqFInYa-CpiMdfMNTmr4y8LAWDTY2z6hzLHYMUpwKRjQyh4zjUiAplGGvZeM5smOIRVxaNggsqL9kVRnaKCCKAX4zeXNCE-v5fqR0hIT5j-Li4hpDH-aSXYKLBbjBQqkCu9OAs_XaHxfbWQ22nfo03G0cyJ1HBssTvbsWd2S2PnWa3LmUX_ubyAm2Um9Fw1DQBLde1BhMuojwEFH1FD5U')",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const hubOptions: Record<string, string[]> = {
  luzon: [
    'Metro Manila',
    'Baguio City',
    'Cordillera Highlands (Sagada/Banaue)',
    'Palawan (El Nido/Coron)',
    'Batanes'
  ],
  visayas: [
    'Boracay Island',
    'Iloilo & Guimaras',
    'Bacolod City',
    'Cebu (City, Moalboal, Bantayan)',
    'Bohol (Panglao & Chocolate Hills)',
    'Dumaguete & Siquijor',
    'Leyte (Kalanggaman Island)',
    'Samar Eco-Adventure Hub'
  ],
  mindanao: [
    'Zamboanga City',
    'Dapitan & Dakak',
    'Cagayan de Oro City',
    'Bukidnon Highlands',
    'Camiguin Island',
    'Davao City & Samal Island',
    'Mati (Dahican Beach)',
    'Lake Sebu (South Cotabato)',
    'General Santos City',
    'Siargao Island',
    'Surigao del Sur (Hinatuan/Bislig)',
    'Tawi-Tawi (Bongao)'
  ],
};

export default function RegionSelector({ destinations, onChange }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  // Safely bound the active tab in case of deletions
  const safeActiveTab = Math.min(Math.max(0, activeTab), Math.max(0, destinations.length - 1));
  const activeDest = destinations[safeActiveTab];

  // Collect all currently selected hubs to prevent duplicates
  const selectedHubs = new Set(destinations.map(d => d.hub));

  const handleRegionChange = (regionId: string) => {
    if (!activeDest || activeDest.region === regionId) return;
    const currentHubsExcludingThisRow = new Set(
      destinations.filter((_, i) => i !== safeActiveTab).map(d => d.hub)
    );
    let newHub = null;
    for (const hub of hubOptions[regionId]) {
      if (!currentHubsExcludingThisRow.has(hub)) {
        newHub = hub;
        break;
      }
    }
    if (!newHub) {
      alert("All destinations in this region are already selected in your itinerary.");
      return;
    }
    const updated = [...destinations];
    updated[safeActiveTab] = { ...updated[safeActiveTab], region: regionId, hub: newHub };
    onChange(updated);
  };

  const handleHubChange = (hub: string) => {
    if (!activeDest) return;
    const updated = [...destinations];
    updated[safeActiveTab] = { ...updated[safeActiveTab], hub };
    onChange(updated);
  };

  const handleAdd = () => {
    if (destinations.length >= MAX_DESTINATIONS) return;
    
    let newDest = null;
    for (const regionId of Object.keys(hubOptions)) {
      for (const hub of hubOptions[regionId]) {
        if (!selectedHubs.has(hub)) {
          newDest = { id: Math.random().toString(36).substring(2, 9), region: regionId, hub };
          break;
        }
      }
      if (newDest) break;
    }
    
    if (newDest) {
      onChange([...destinations, newDest]);
      setActiveTab(destinations.length);
    }
  };

  const handleRemove = (index: number) => {
    if (destinations.length <= 1) return;
    onChange(destinations.filter((_, i) => i !== index));
    if (activeTab === index) {
      setActiveTab(Math.max(0, index - 1));
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="space-y-sm">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">Where to?</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          Select up to {MAX_DESTINATIONS} destinations for your trip.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 mt-4">
        {destinations.map((dest, i) => {
          const isExpanded = safeActiveTab === i;

          if (!isExpanded) {
            // Collapsed Summary Row
            return (
              <div
                key={dest.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group shadow-sm hover:shadow"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(i);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <span className="block font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] leading-tight">Destination {i + 1}</span>
                    <span className="block font-body-md text-on-surface font-semibold leading-tight mt-0.5">{dest.hub}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: '20px' }}>edit</span>
                  {destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(i);
                      }}
                      className="p-1.5 text-on-surface-variant/50 hover:text-error hover:bg-error-container rounded-full transition-colors"
                      title="Remove destination"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // Expanded Configuration Box
          return (
            <div key={dest.id} className="relative rounded-2xl border border-primary/20 p-5 bg-surface-bright shadow-[0_4px_20px_rgba(0,51,102,0.06)] space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-widest flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary text-xs font-bold">
                    {i + 1}
                  </span>
                  Destination {i + 1}
                </span>
                {destinations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="text-on-surface-variant/60 hover:text-error transition-colors p-1 rounded-full hover:bg-error-container"
                    title="Remove destination"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                )}
              </div>

              {/* Region Cards */}
              <div className="grid grid-cols-3 gap-2">
                {regions.map((region) => {
                  const active = dest.region === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => handleRegionChange(region.id)}
                      aria-pressed={active}
                      className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_20px_rgba(0,51,102,0.08)] hover:-translate-y-1 transition-all duration-300 border-2 h-20 ${
                        active ? 'border-secondary' : 'border-transparent hover:border-secondary-fixed'
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: region.bg }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/80 to-transparent" />
                      {active && (
                        <div className="absolute top-1 right-1 bg-secondary text-on-secondary rounded-full p-0.5 shadow-md">
                          <span className="material-symbols-outlined fill text-sm" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}>
                            check
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-1.5 w-full text-left">
                        <span className="font-label-sm text-label-sm text-white font-bold">{region.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hub Dropdown */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider" htmlFor={`hub-select-${i}`}>
                  Specific Hub
                </label>
                <div className="relative">
                  <select
                    id={`hub-select-${i}`}
                    value={dest.hub}
                    onChange={(e) => handleHubChange(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant text-on-surface font-body-md rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-3 appearance-none shadow-sm transition-colors"
                  >
                    {(hubOptions[dest.region] || hubOptions.visayas).map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        disabled={opt !== dest.hub && selectedHubs.has(opt)}
                      >
                        {opt}{opt !== dest.hub && selectedHubs.has(opt) ? ' (already selected)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Destination Button */}
      {destinations.length < MAX_DESTINATIONS && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full mt-2 py-3 rounded-xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-secondary-container/30 transition-all font-label-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_location_alt</span>
          Add Destination ({destinations.length}/{MAX_DESTINATIONS})
        </button>
      )}
    </div>
  );
}
