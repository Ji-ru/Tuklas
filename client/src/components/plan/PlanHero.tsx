const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwIh7BUeDM2cNS_tVDegKfBnnn3DRIoo5IlDrul6w1vaBbABj48o1IG6hRNsPcQVh5CWVdJCJiSdpwtfGH8GDl_kh0R7Nsycf_QdN4F7nnA-A3y9OkXaMOfiqJ6UxW-GPYU8qgSo-suChO1upz8ZOc8v-LFLa2z8cW24zZO_mJKULVEJpfHxIq1amiYS7Eh3W-Lwrj1mMSQfF_6e2GaYkMSnoTJUg5ROZGc2n83MefcRZg_3c08lVkETt2essdats70O5pcxqPkwIH";

export default function PlanHero() {
  return (
    <section
      // Fix B: pt-20 clears the ~64px fixed header so content is never hidden behind it.
      // min-h-[480px] ensures the section stays tall enough after the top padding.
      className="relative w-full min-h-[320px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center overflow-hidden rounded-b-3xl md:rounded-b-[48px] pt-20"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      />
      {/* Gradient overlay fading to background color */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,30,64,0.2) 0%, var(--color-background) 100%)' }}
      />

      {/* Text — max-w-[768px] uses explicit px to avoid Tailwind v4 spacing-token collision */}
      <div className="relative z-10 text-center px-5 md:px-lg max-w-[768px] mx-auto">
        <h1 className="font-display-lg text-[2rem] leading-tight md:text-display-lg text-primary mb-2 drop-shadow-md">
          Stress-Free<br />Philippine Travel
        </h1>
        {/* max-w-[576px] explicit px — avoids max-w-xl resolving to 64px in Tailwind v4 */}
        <p className="font-body-lg text-[0.9rem] leading-6 md:text-body-lg text-primary-container max-w-[576px] mx-auto opacity-90 drop-shadow-sm">
          Curated serenity in the archipelago. Use our intelligent planning tool to design your perfect escape in seconds.
        </p>
      </div>
    </section>
  );
}
