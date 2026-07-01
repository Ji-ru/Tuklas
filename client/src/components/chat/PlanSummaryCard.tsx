export interface PlanState {
  destination?: string;
  duration?: string;
  travelGroup?: string;
  budget?: string;
  vibes?: string[];
  accommodation?: string;
  dietary?: string;
  notes?: string;
}

interface Props {
  planState: PlanState;
  onConfirm: () => void;
  onEdit: () => void;
  isGenerating: boolean;
}

const fieldDefs: { key: keyof PlanState; label: string; icon: string }[] = [
  { key: 'destination', label: 'Destination', icon: 'location_on' },
  { key: 'duration', label: 'Duration', icon: 'calendar_month' },
  { key: 'travelGroup', label: 'Travel Group', icon: 'groups' },
  { key: 'budget', label: 'Budget', icon: 'payments' },
  { key: 'vibes', label: 'Vibes', icon: 'auto_awesome' },
  { key: 'accommodation', label: 'Accommodation', icon: 'hotel' },
  { key: 'dietary', label: 'Dietary', icon: 'restaurant' },
  { key: 'notes', label: 'Notes', icon: 'edit_note' },
];

export default function PlanSummaryCard({ planState, onConfirm, onEdit, isGenerating }: Props) {
  const filledFields = fieldDefs.filter(({ key }) => {
    const val = planState[key];
    return val && (Array.isArray(val) ? val.length > 0 : String(val).trim().length > 0);
  });

  return (
    <div className="mx-3 my-2 rounded-2xl border border-secondary/30 bg-secondary-container/20 overflow-hidden shadow-lg w-full min-w-[300px] sm:w-[400px] max-w-[calc(100vw-32px)] shrink-0 self-center">
      {/* Header */}
      <div className="bg-secondary px-4 py-3 flex items-center gap-2">
        <span
          className="material-symbols-outlined text-on-secondary"
          style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
        >
          checklist
        </span>
        <h3 className="font-label-md text-label-md text-on-secondary font-bold">Your Trip Plan — Review</h3>
      </div>

      {/* Plan Fields */}
      <div className="px-4 py-3 space-y-2">
        {filledFields.length === 0 ? (
          <p className="font-body-md text-sm text-on-surface-variant">No details collected yet.</p>
        ) : (
          filledFields.map(({ key, label, icon }) => {
            const val = planState[key];
            const displayVal = Array.isArray(val) ? val.join(', ') : String(val);
            return (
              <div key={key} className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary mt-0.5 flex-shrink-0"
                  style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
                  <p className="font-body-md text-sm text-on-surface capitalize">{displayVal}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2 mt-1">
        <button
          onClick={onEdit}
          disabled={isGenerating}
          className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
          Edit Plan
        </button>
        <button
          onClick={onConfirm}
          disabled={isGenerating || filledFields.length < 2}
          className="flex-1 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-md cta-glow"
        >
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>sync</span>
              Generating…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Generate Itinerary
            </>
          )}
        </button>
      </div>
    </div>
  );
}
