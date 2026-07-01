import { Link } from 'react-router-dom';
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

  return (
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
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/95 backdrop-blur-sm border-b border-surface-variant shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md py-1 px-2 rounded-lg hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </button>
        <span className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[200px] text-center">{destination.hub_name}</span>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Header Image */}
      <div className="relative h-[220px] w-full shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={destination.hub_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-outline/50">landscape</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
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
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
          {destination.island_group} • {destination.region_name}
        </p>
        <h2 className="font-display-sm text-display-sm text-primary mb-6">
          {destination.hub_name}
        </h2>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-label-lg text-label-lg text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            About
          </h3>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Vibes */}
        {vibes.length > 0 && (
          <div className="mb-8">
            <h3 className="font-label-lg text-label-lg text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              The Vibe
            </h3>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <span key={vibe} className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low">
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Things to Do */}
        {activities.length > 0 && (
          <div className="mb-8">
            <h3 className="font-label-lg text-label-lg text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              Things to Do
            </h3>
            <ul className="space-y-3">
              {activities.map((activity, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-on-surface-variant">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-surface-variant bg-surface shrink-0 flex gap-3">
        <Link 
          to={`/plan?hub=${encodeURIComponent(destination.hub_name)}`}
          className="flex-1 bg-primary text-on-primary font-label-lg text-label-lg py-3.5 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-opacity cta-glow"
        >
          <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
          Plan Trip Here
        </Link>
        <Link 
          to={`/chat?hub=${encodeURIComponent(destination.hub_name)}`}
          className="bg-secondary-container text-on-secondary-container font-label-lg py-3.5 px-4 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity w-14 shrink-0"
          title="Ask AI about this place"
        >
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
        </Link>
      </div>
        </>
        )}
      </div>
    </>
  );
}
