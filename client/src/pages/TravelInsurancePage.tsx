export default function TravelInsurancePage() {
  return (
    <div className="pt-[100px] md:pt-[120px] pb-24 md:pb-xl px-5 md:px-lg max-w-[800px] mx-auto w-full">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
        </div>
        <h1 className="font-display-md text-primary mb-4">Travel Insurance Tips</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          While the Philippines is a welcoming paradise, being prepared ensures your trip remains stress-free. Here's what you need to know about travel insurance.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-surface-variant">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-secondary">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-primary mb-2">Medical Coverage</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Ensure your policy covers medical evacuation. The Philippines has thousands of islands, and getting from a remote island to a major hospital in Manila or Cebu can be expensive in an emergency.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-surface-variant">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-secondary">
              <span className="material-symbols-outlined">flight_off</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-primary mb-2">Trip Cancellation & Delays</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Domestic flights and ferries are occasionally delayed or cancelled due to logistical issues. Trip interruption coverage is highly recommended.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-surface-variant">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-secondary">
              <span className="material-symbols-outlined">scuba_diving</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-primary mb-2">Adventure Sports</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                If you plan to scuba dive in Tubbataha, surf in Siargao, or hike Mt. Pulag, check that your policy explicitly covers these activities. Standard policies often exclude "extreme sports."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-primary text-on-primary rounded-2xl p-8">
        <h2 className="font-headline-md mb-4 text-on-primary font-bold">Local Emergency Numbers</h2>
        <ul className="space-y-3 font-body-md">
          <li className="flex justify-between border-b border-on-primary/20 pb-2">
            <span className="opacity-90">National Emergency Hotline</span>
            <span className="font-bold font-mono">911</span>
          </li>
          <li className="flex justify-between border-b border-on-primary/20 pb-2">
            <span className="opacity-90">Philippine National Police (PNP)</span>
            <span className="font-bold font-mono">117</span>
          </li>
          <li className="flex justify-between pt-1">
            <span className="opacity-90">Tourist Police</span>
            <span className="font-bold font-mono">+63 2 8524 1660</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
