import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { type Destination } from './DestinationCard';
import { HUB_IMAGES, HUB_VIBES, HUB_ACTIVITIES } from '../../lib/destination-data';

interface Props {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DestinationPanel({ destination, isOpen, onClose }: Props) {
  const imageUrl = destination ? (HUB_IMAGES[destination.hub_name] || destination.image_url) : '';
  const vibes = destination ? (HUB_VIBES[destination.hub_name] || []) : [];
  const activities = destination ? (HUB_ACTIVITIES[destination.hub_name] || []) : [];

  // Use a portal to render outside the main layout's stacking context,
  // so the panel correctly overlaps the z-50 global Header
  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[450px] max-w-[100vw] bg-surface shadow-2xl z-[60] flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {destination && (
          <>
      {/* Header Image with Back Button Overlay */}
      <div className="relative h-[220px] md:h-[260px] w-full shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface/80 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        {imageUrl ? (
          <img src={imageUrl} alt={destination.hub_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-outline/50">landscape</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
           {destination.is_hidden_gem && (
            <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-md w-fit">
              <span className="material-symbols-outlined text-[16px]">diamond</span>
              Hidden Gem
            </span>
          )}
          <span className="bg-surface/90 text-primary font-label-sm text-label-sm px-3 py-1.5 rounded-full shadow-md backdrop-blur-md w-fit">
            {destination.category}
          </span>
        </div>
      </div>

      {/* Content Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 scrollbar-hide flex flex-col">
        <div className="flex-1">
          <p className="font-label-md text-[11px] md:text-label-md text-secondary uppercase tracking-widest mb-1 md:mb-2">
            {destination.island_group} • {destination.region_name}
          </p>
          <h2 className="font-display-sm text-[22px] md:text-[28px] lg:text-display-sm leading-tight text-primary mb-4 md:mb-6">
            {destination.hub_name}
          </h2>

          {/* Description */}
          <div className="mb-5 md:mb-8">
            <h3 className="font-label-lg text-base md:text-label-lg text-on-surface mb-2 md:mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              About
            </h3>
            <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Vibes */}
          {vibes.length > 0 && (
            <div className="mb-5 md:mb-8">
              <h3 className="font-label-lg text-base md:text-label-lg text-on-surface mb-2 md:mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                The Vibe
              </h3>
              <div className="flex flex-wrap gap-2">
                {vibes.map((vibe) => (
                  <span key={vibe} className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-[11px] md:text-label-sm bg-surface-container-low">
                    {vibe}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Things to Do */}
          {activities.length > 0 && (
            <div className="mb-2 md:mb-4">
              <h3 className="font-label-lg text-base md:text-label-lg text-on-surface mb-2 md:mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                Things to Do
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {activities.map((activity, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px] mt-0.5 md:mt-0">check_circle</span>
                    <span className="font-body-md text-sm md:text-base text-on-surface-variant">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] border-t border-surface-variant bg-surface/95 backdrop-blur-md shrink-0 flex gap-3 z-10 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]">
        <Link 
          to={`/plan?hub=${encodeURIComponent(destination.hub_name)}`}
          className="flex-1 bg-primary text-on-primary font-label-lg text-sm md:text-label-lg py-3 md:py-3.5 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-opacity cta-glow shadow-md"
        >
          <span className="material-symbols-outlined text-[18px] md:text-[20px]">edit_calendar</span>
          Plan Trip Here
        </Link>
        <Link 
          to={`/chat?hub=${encodeURIComponent(destination.hub_name)}`}
          className="bg-secondary-container text-on-secondary-container font-label-lg py-3 md:py-3.5 px-3 md:px-4 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity w-12 md:w-14 shrink-0 shadow-md"
          title="Ask AI about this place"
        >
          <span className="material-symbols-outlined text-[20px] md:text-[24px]">chat_bubble</span>
        </Link>
      </div>
        </>
        )}
      </div>
    </>,
    document.body
  );
}
