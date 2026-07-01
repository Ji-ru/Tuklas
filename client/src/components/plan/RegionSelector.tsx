interface Props {
  selected: string;
  onSelect: (region: string) => void;
  hub: string;
  onHubChange: (hub: string) => void;
}

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

export default function RegionSelector({ selected, onSelect, hub, onHubChange }: Props) {
  return (
    <div className="space-y-sm">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">Where to?</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          Select a primary region to begin your journey.
        </p>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {regions.map((region) => {
          const active = selected === region.id;
          return (
            <div
              key={region.id}
              onClick={() => {
                onSelect(region.id);
                onHubChange(hubOptions[region.id][0]);
              }}
              className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_20px_rgba(0,51,102,0.08)] hover:-translate-y-1 transition-all duration-300 border-2 h-28 ${
                active ? 'border-secondary' : 'border-transparent hover:border-secondary-fixed'
              }`}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: region.bg }}
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/80 to-transparent" />

              {/* Active checkmark */}
              {active && (
                <div className="absolute top-1 right-1 bg-secondary text-on-secondary rounded-full p-0.5 shadow-md">
                  <span className="material-symbols-outlined fill text-sm" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                </div>
              )}

              {/* Label */}
              <div className="absolute bottom-0 left-0 p-2 w-full">
                <span className="font-label-md text-label-md text-white font-bold">{region.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hub Dropdown */}
      <div className="mt-3">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="hub-select">
          Specific Hub (Optional)
        </label>
        <div className="relative">
          <select
            id="hub-select"
            value={hub}
            onChange={(e) => onHubChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-2.5 appearance-none shadow-sm transition-colors"
          >
            {(hubOptions[selected] || hubOptions.visayas).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
