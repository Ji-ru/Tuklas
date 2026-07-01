interface Props {
  budgetBasis: 'per-day' | 'duration';
  selectedBudget: string;
  durationDays: number;
  onBudgetBasisChange: (basis: 'per-day' | 'duration') => void;
  onBudgetChange: (budget: string) => void;
}

const tiers = [
  { id: 'backpacker', label: 'Backpacker', min: 1500, max: 3000 },
  { id: 'mid-range', label: 'Mid-Range', min: 3500, max: 8000 },
  { id: 'luxury', label: 'Luxury', min: 10000, max: 25000 },
  { id: 'ultra-luxe', label: 'Ultra-Luxe', min: 30000, max: null },
];

export default function BudgetSelector({
  budgetBasis,
  selectedBudget,
  durationDays,
  onBudgetBasisChange,
  onBudgetChange,
}: Props) {
  const getFormattedRange = (tier: typeof tiers[0]) => {
    const multiplier = budgetBasis === 'duration' ? durationDays : 1;
    const suffix = budgetBasis === 'duration' ? ' / total' : ' / day';

    if (tier.max === null) {
      return `₱${(tier.min * multiplier).toLocaleString()}+${suffix}`;
    }
    return `₱${(tier.min * multiplier).toLocaleString()} – ₱${(tier.max * multiplier).toLocaleString()}${suffix}`;
  };
  return (
    <div className="space-y-sm">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">Budget</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          What is your preferred spending level?
        </p>
      </div>

      {/* Budget Basis Toggle */}
      <div className="mb-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Budget Basis</p>
        <div className="flex gap-2">
          <button
            onClick={() => onBudgetBasisChange('per-day')}
            className={`px-4 py-1.5 rounded-full border font-label-sm text-label-sm shadow-sm flex items-center gap-1 transition-colors ${
              budgetBasis === 'per-day'
                ? 'border-secondary bg-secondary-container text-on-secondary-container'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            {budgetBasis === 'per-day' && (
              <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>check</span>
            )}
            Per Day
          </button>
          <button
            onClick={() => onBudgetBasisChange('duration')}
            className={`px-4 py-1.5 rounded-full border font-label-sm text-label-sm shadow-sm flex items-center gap-1 transition-colors ${
              budgetBasis === 'duration'
                ? 'border-secondary bg-secondary-container text-on-secondary-container'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            {budgetBasis === 'duration' && (
              <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>check</span>
            )}
            Based on Duration
          </button>
        </div>
      </div>

      {/* Budget Tier Cards */}
      <div className="grid grid-cols-2 gap-3">
        {tiers.map((tier) => {
          const active = selectedBudget === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => onBudgetChange(tier.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                active
                  ? 'border-2 border-primary bg-primary-container text-on-primary-container shadow-md'
                  : 'border border-outline-variant bg-surface-dim text-on-surface hover:border-primary'
              }`}
            >
              <div className="flex justify-between items-start">
                {/* Fix #6: Use font-label-md (Plus Jakarta Sans) not font-headline-md (Noto Serif) for UI card labels */}
                <h3 className="font-label-md text-label-md font-bold">{tier.label}</h3>
                {active && (
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
              <p className="font-label-sm text-label-sm opacity-90 mt-1">{getFormattedRange(tier)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
