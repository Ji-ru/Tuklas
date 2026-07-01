export default function PrivacyPage() {
  return (
    <div className="pt-[100px] md:pt-[120px] pb-24 md:pb-xl px-5 md:px-lg max-w-[800px] mx-auto w-full">
      <h1 className="font-display-sm md:font-display-md text-primary mb-6">Privacy Policy</h1>
      
      <div className="bg-surface-container-low rounded-2xl p-md md:p-lg shadow-sm space-y-8">
        <section>
          <h2 className="font-headline-sm text-secondary mb-3">1. Information We Collect</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            We collect information you provide directly to us when using Tuklas, including your travel preferences, budget constraints, and any specific notes you add when generating an itinerary. We do not require account creation, so we do not collect personal identifiers like your name or email unless you explicitly contact us.
          </p>
        </section>

        <section>
          <h2 className="font-headline-sm text-secondary mb-3">2. How We Use Information</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            The information we collect is used solely to generate customized travel itineraries for the Philippines. Your preferences are processed by our AI services to curate destinations, activities, and accommodations that match your travel style.
          </p>
        </section>

        <section>
          <h2 className="font-headline-sm text-secondary mb-3">3. Data Storage and Security</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Your generated itineraries are saved locally on your device using your browser's local storage. We also temporarily cache generated itineraries on our servers to improve performance, but this data is anonymized and automatically deleted after 7 days.
          </p>
        </section>

        <section>
          <h2 className="font-headline-sm text-secondary mb-3">4. Third-Party Services</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            We use Google's Gemini AI to generate itineraries. Your travel parameters are sent to this service, but we do not share any personally identifiable information. Please refer to Google's privacy policy for details on how they handle data.
          </p>
        </section>
        
        <section>
          <h2 className="font-headline-sm text-secondary mb-3">5. Contact Us</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@tuklas.ph.
          </p>
        </section>

        <div className="pt-4 border-t border-outline-variant/30 text-label-md text-on-surface-variant">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
