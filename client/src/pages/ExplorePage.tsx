import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import DestinationCard, { type Destination } from '../components/explore/DestinationCard';
import DestinationPanel from '../components/explore/DestinationPanel';

type FilterType = 'All' | 'Luzon' | 'Visayas' | 'Mindanao' | 'Hidden Gems';

export default function ExplorePage() {
  const { setFloatersHidden } = useOutletContext<{ setFloatersHidden: (hidden: boolean) => void }>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Side Panel State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [panelDestination, setPanelDestination] = useState<Destination | null>(null);

  useEffect(() => {
    if (selectedDestination) {
      document.body.style.overflow = 'hidden';
      setFloatersHidden(true);
    } else {
      document.body.style.overflow = '';
      setFloatersHidden(false);
    }
    return () => { 
      document.body.style.overflow = ''; 
      setFloatersHidden(false);
    };
  }, [selectedDestination, setFloatersHidden]);

  const handleOpenPanel = (dest: Destination) => {
    setPanelDestination(dest);
    setSelectedDestination(dest);
  };

  const handleClosePanel = () => {
    setSelectedDestination(null);
  };

  const fetchDestinations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/destinations');
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const filterByRegion = activeFilter === 'All' 
    ? destinations 
    : activeFilter === 'Hidden Gems'
      ? destinations.filter(d => d.is_hidden_gem)
      : destinations.filter(d => d.island_group === activeFilter);

  const filteredDestinations = searchQuery.trim()
    ? filterByRegion.filter(d =>
        d.hub_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filterByRegion;

  const filters: FilterType[] = ['All', 'Luzon', 'Visayas', 'Mindanao', 'Hidden Gems'];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } } // Faster stagger for the grid
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  return (
    <div className="min-h-screen bg-background pt-[88px] pb-24 md:pb-12 relative overflow-hidden">
      {/* Hero Header */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="bg-surface-container-low border-b border-surface-variant pt-12 pb-16 px-5 text-center"
      >
        <motion.h1 variants={item} className="font-display-lg text-display-lg text-primary mb-4">Discover the Philippines</motion.h1>
        <motion.p variants={item} className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Explore curated hubs across the archipelago. From bustling cityscapes to hidden island paradises, find your next unforgettable journey.
        </motion.p>
        {/* Search Bar */}
        <motion.div variants={item} className="relative max-w-2xl mx-auto mt-6">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[26px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search destinations, regions…"
            className="w-full pl-14 pr-12 py-4 rounded-[2rem] border-2 border-outline-variant bg-surface text-on-surface font-body-lg text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary placeholder:text-on-surface-variant/50 shadow-md hover:shadow-lg transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-variant rounded-full p-1 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          )}
        </motion.div>
      </motion.section>

      <div className="max-w-[1200px] mx-auto px-5 md:px-lg mt-8 relative">
        
        {/* Filter Bar + Result Count */}
        <div className="sticky top-[88px] z-10 bg-background/95 backdrop-blur-md py-5 mb-8 border-b border-surface-variant/50">
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => {
              const baseList = filter === 'All' 
                ? destinations 
                : filter === 'Hidden Gems'
                  ? destinations.filter(d => d.is_hidden_gem)
                  : destinations.filter(d => d.island_group === filter);
              
              const count = searchQuery.trim()
                ? baseList.filter(d => 
                    d.hub_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.region_name?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length
                : baseList.length;

              return (
                <button
                  key={filter}
                  onClick={() => { setActiveFilter(filter); }}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full font-label-md text-base transition-all border-2 flex items-center gap-2 ${
                    activeFilter === filter
                      ? 'bg-primary text-on-primary border-primary shadow-lg scale-[1.02]'
                      : 'bg-surface text-on-surface-variant border-outline-variant/60 hover:bg-surface-container hover:border-outline hover:text-primary'
                  }`}
                >
                  {filter}
                  {!isLoading && <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${activeFilter === filter ? 'bg-on-primary/10 text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{count}</span>}
                </button>
              );
            })}
          </div>
          {/* Result count line */}
          {!isLoading && !error && (
            <p className="font-body-md text-center text-on-surface-variant/70 mt-3">
              {searchQuery
                ? `${filteredDestinations.length} result${filteredDestinations.length !== 1 ? 's' : ''} for "${searchQuery}"${activeFilter !== 'All' ? ` in ${activeFilter}` : ''}`
                : `Showing ${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? 's' : ''}${activeFilter !== 'All' ? ` in ${activeFilter}` : ''}`
              }
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface-variant rounded-2xl h-[400px]" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl text-center">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <h3 className="font-body-lg text-body-lg mb-2">Failed to load destinations</h3>
            <p className="font-body-md mb-4">{error}</p>
            <button 
              onClick={fetchDestinations}
              className="bg-error text-on-error px-6 py-2 rounded-full font-label-md hover:bg-error/90 transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && (
          <>
            <motion.div 
              key={activeFilter + searchQuery} // Re-animate when filters change
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDestinations.map(dest => (
                <motion.div variants={item} key={dest.id}>
                  <DestinationCard 
                    destination={dest} 
                    onClick={() => handleOpenPanel(dest)}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredDestinations.length === 0 && (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-40 block">travel_explore</span>
                <p className="font-headline-sm text-on-surface mb-2">
                  {searchQuery ? `No results for "${searchQuery}"` : `No destinations in ${activeFilter}`}
                </p>
                <p className="font-body-md text-on-surface-variant/70 mb-6">
                  {searchQuery ? 'Try a different keyword or clear your search.' : 'Try a different region filter.'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Slide-out Panel */}
      <DestinationPanel 
        destination={panelDestination} 
        isOpen={!!selectedDestination}
        onClose={handleClosePanel}
      />
    </div>
  );
}
