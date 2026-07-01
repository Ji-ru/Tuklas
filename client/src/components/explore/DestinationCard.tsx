import { Link } from 'react-router-dom';
import { HUB_IMAGES, HUB_VIBES } from '../../lib/destination-data';

export interface Destination {
  id: number;
  island_group: string;
  region_name: string;
  hub_name: string;
  category: string;
  is_hidden_gem: boolean;
  description: string;
  image_url: string;
}

interface Props {
  destination: Destination;
  onClick?: () => void;
}

export default function DestinationCard({ destination, onClick }: Props) {
  // Prioritize the frontend static map because DB Unsplash links might be broken
  const imageUrl = HUB_IMAGES[destination.hub_name] || destination.image_url;
  const vibes = HUB_VIBES[destination.hub_name] || [];

  return (
    <div 
      onClick={onClick}
      className={`group bg-surface-bright rounded-2xl overflow-hidden border border-surface-variant shadow-[0_4px_12px_rgba(0,51,102,0.06)] hover:shadow-[0_12px_40px_rgba(0,51,102,0.12)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-variant">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={destination.hub_name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline/50">
            <span className="material-symbols-outlined text-4xl">landscape</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          {destination.is_hidden_gem && (
            <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px]">diamond</span>
              Hidden Gem
            </span>
          )}
          <span className="bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full shadow-sm">
            {destination.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="mb-3">
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1">
            {destination.island_group} • {destination.region_name}
          </p>
          <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">
            {destination.hub_name}
          </h3>
        </div>
        
        <p className="font-body-md text-on-surface-variant line-clamp-3 mb-4 flex-1">
          {destination.description}
        </p>

        {/* Vibe Tags */}
        {vibes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {vibes.slice(0, 3).map(vibe => (
              <span key={vibe} className="px-2 py-0.5 rounded-md bg-surface-variant text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wide">
                {vibe}
              </span>
            ))}
            {vibes.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-variant text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wide">
                +{vibes.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="pt-4 border-t border-surface-variant/50 flex gap-2">
          <Link 
            to={`/plan?hub=${encodeURIComponent(destination.hub_name)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2.5 px-4 rounded-xl flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
            Plan Trip
          </Link>
          <Link 
            to={`/chat?hub=${encodeURIComponent(destination.hub_name)}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-secondary-container text-on-secondary-container font-label-md py-2.5 px-4 rounded-xl flex items-center justify-center hover:bg-secondary-container/80 transition-colors"
            title="Ask AI about this place"
          >
            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
