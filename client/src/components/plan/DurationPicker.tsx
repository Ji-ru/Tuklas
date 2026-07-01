interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

function calcDaysNights(start: string, end: string): string {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return '';
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const days = nights + 1;
  return `${days} Day${days !== 1 ? 's' : ''}, ${nights} Night${nights !== 1 ? 's' : ''}`;
}

export default function DurationPicker({ startDate, endDate, onStartChange, onEndChange }: Props) {
  const summary = calcDaysNights(startDate, endDate);
  const today = new Date().toISOString().split('T')[0];

  const isEndBeforeStart = endDate && startDate && endDate <= startDate;

  return (
    <div className="space-y-sm">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">Duration</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          When are you traveling?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {/* Start Date */}
        <div className="space-y-1">
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="start-date">
            Start Date
          </label>
          <div className="relative">
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => onStartChange(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-2.5 appearance-none shadow-sm transition-colors"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </div>
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="end-date">
            End Date
          </label>
          <div className="relative">
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => onEndChange(e.target.value)}
              className={`w-full bg-surface-container-low border text-on-surface font-body-md rounded-lg focus:ring-1 focus:ring-primary block p-2.5 appearance-none shadow-sm transition-colors ${
                isEndBeforeStart
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-outline-variant focus:border-primary'
              }`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary">
              <span className="material-symbols-outlined text-xl">calendar_month</span>
            </div>
          </div>
          {isEndBeforeStart && (
            <p className="text-error font-label-sm text-label-sm flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
              End date must be after start date
            </p>
          )}
        </div>
      </div>

      {/* Dynamic day/night summary */}
      {summary && (
        <div className="mt-2 text-right">
          <p className="font-label-md text-label-md text-secondary">{summary}</p>
        </div>
      )}
    </div>
  );
}
