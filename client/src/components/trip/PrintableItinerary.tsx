

interface PrintableItineraryProps {
  itineraryData: any;
}

export default function PrintableItinerary({ itineraryData }: PrintableItineraryProps) {
  if (!itineraryData || !itineraryData.days) return null;

  return (
    <div className="hidden print:block w-full max-w-[800px] mx-auto text-black bg-white p-8 font-serif" style={{ printColorAdjust: 'exact' }}>
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[32px]">travel_explore</span>
          <span className="text-2xl font-bold tracking-widest uppercase">Tuklas Travel</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{itineraryData.title}</h1>
        <p className="text-lg text-gray-600 font-medium">Duration: {itineraryData.duration}</p>
      </div>

      {/* Days Loop */}
      <div className="space-y-8">
        {itineraryData.days.map((day: any) => (
          <div key={day.dayNumber} className="break-inside-avoid-page mb-8">
            <div className="bg-gray-100 p-4 mb-6 border-l-4 border-black">
              <h2 className="text-2xl font-bold">
                Day {day.dayNumber}: {day.dayTitle || 'Activities'}
              </h2>
              {day.estimatedCost && (
                <p className="text-sm font-bold mt-1 text-gray-700">Cost: {day.estimatedCost}</p>
              )}
              {day.routingRationale && (
                <p className="text-sm mt-3 text-gray-800 leading-relaxed italic">
                  <span className="font-bold not-italic">Routing Rationale:</span> {day.routingRationale}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {day.activities && day.activities.length > 0 ? (
                day.activities.map((activity: any, idx: number) => (
                  <div key={activity.id || idx} className="pl-4 border-l-2 border-gray-300 ml-2 break-inside-avoid">
                    <div className="flex items-start gap-4 mb-1">
                      <span className="font-bold whitespace-nowrap min-w-[70px] mt-0.5 text-gray-900">{activity.time}</span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{activity.title}</h3>
                        <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2">
                          {activity.type}
                        </span>
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic pl-6">No activities scheduled for this day.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t-2 border-black text-center text-xs text-gray-500">
        <p className="font-bold mb-1 uppercase tracking-wider">Curated Serenity in the Archipelago</p>
        <p>This itinerary is an AI-generated guide. Please confirm all local schedules, ferry times, and bookings independently before travel.</p>
      </div>
    </div>
  );
}
