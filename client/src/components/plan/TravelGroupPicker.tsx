interface Props {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
  selectedAccommodation: string;
  onAccommodationSelect: (type: string) => void;
  selectedDietary: string[];
  onDietaryToggle: (pref: string) => void;
}

const groups = [
  { id: 'solo', label: 'Solo', icon: 'person' },
  { id: 'couple', label: 'Couple', icon: 'favorite' },
  { id: 'family', label: 'Family', icon: 'family_restroom' },
  { id: 'group', label: 'Group', icon: 'groups' },
];

const accommodations = [
  { id: 'hotel', label: 'Hotel', icon: 'hotel' },
  { id: 'resort', label: 'Resort', icon: 'beach_access' },
  { id: 'hostel', label: 'Hostel', icon: 'bunk_bed' },
  { id: 'airbnb', label: 'Airbnb', icon: 'cottage' },
];

const dietaryOptions = ['Halal', 'Vegan', 'Vegetarian', 'Pescatarian', 'No Restrictions'];

export default function TravelGroupPicker({
  selectedGroup,
  onGroupSelect,
  groupSize,
  onGroupSizeChange,
  selectedAccommodation,
  onAccommodationSelect,
  selectedDietary,
  onDietaryToggle,
}: Props) {
  return (
    <div className="space-y-sm">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">Your Group</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          Who's joining you on this trip?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md md:gap-lg mt-3">
        {/* Left: Travel Companions + Group Size */}
        <div className="space-y-3">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Travel Companions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {groups.map((g) => {
              const active = selectedGroup === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => onGroupSelect(g.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    active
                      ? 'border-secondary bg-secondary-container text-on-secondary-container shadow-md scale-[0.97]'
                      : 'border-outline-variant bg-surface-container-low text-on-surface hover:border-secondary hover:bg-surface-container'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {g.icon}
                  </span>
                  <span className="font-label-sm text-label-sm">{g.label}</span>
                </button>
              );
            })}
          </div>

          {/* Group size — only shown when 'group' or 'family' is selected */}
          {(selectedGroup === 'group' || selectedGroup === 'family') && (
            <div className="flex items-center gap-3 mt-1 animate-in fade-in duration-200">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Group Size
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onGroupSizeChange(Math.max(2, groupSize - 1))}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:border-secondary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                </button>
                <span className="font-label-md text-label-md text-on-surface w-8 text-center">{groupSize}</span>
                <button
                  onClick={() => onGroupSizeChange(Math.min(30, groupSize + 1))}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:border-secondary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Accommodation + Dietary */}
        <div className="space-y-4">
          {/* Accommodation */}
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
              Accommodation
            </p>
            <div className="grid grid-cols-2 gap-2">
              {accommodations.map((a) => {
                const active = selectedAccommodation === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => onAccommodationSelect(a.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary text-on-primary shadow-sm'
                        : 'border-outline-variant bg-surface-container-low text-on-surface hover:border-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '18px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {a.icon}
                    </span>
                    <span className="font-label-sm text-label-sm">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
              Dietary Preferences
            </p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((d) => {
                const active = selectedDietary.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => onDietaryToggle(d)}
                    className={`px-3 py-1.5 rounded-full border font-label-sm text-label-sm shadow-sm flex items-center gap-1 transition-all ${
                      active
                        ? 'border-secondary bg-secondary-container text-on-secondary-container'
                        : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {active && (
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                    )}
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
