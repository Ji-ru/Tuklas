// Fallback images strictly related to Philippine travel concepts
const FALLBACK_IMAGES = {
  dining: 'https://images.unsplash.com/photo-1544030386-4e503b41d08e?auto=format&fit=crop&q=80&w=800',
  sightseeing: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=800', // Palawan/Beach
  activity: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80&w=800', // Adventure/Nature
  checkin: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800', // Hotel/Resort
  leisure: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', // Beach relaxation
  default: 'https://images.unsplash.com/photo-1522204657746-fccce0824cfd?auto=format&fit=crop&q=80&w=800' // Generic beautiful PH scene
};

/**
 * Fetches an image from Wikipedia based on a search query.
 * Falls back to curated Unsplash images if no Wikipedia image is found.
 */
export async function fetchActivityImage(title, hub, type) {
  try {
    // Make the query more specific to find better images
    const searchQuery = encodeURIComponent(`${title} ${hub || 'Philippines'}`);
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchQuery}&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json&origin=*`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Wikipedia API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Wikipedia returns data.query.pages as an object keyed by page ID
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages);
      if (pages.length > 0 && pages[0].thumbnail && pages[0].thumbnail.source) {
        return pages[0].thumbnail.source;
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch Wikipedia image for "${title}":`, error.message);
  }

  // Fallback if Wikipedia fails or has no image
  const normalizedType = (type || '').toLowerCase();
  
  if (normalizedType.includes('din') || normalizedType.includes('food') || normalizedType.includes('eat')) return FALLBACK_IMAGES.dining;
  if (normalizedType.includes('sight') || normalizedType.includes('tour')) return FALLBACK_IMAGES.sightseeing;
  if (normalizedType.includes('activ') || normalizedType.includes('advent')) return FALLBACK_IMAGES.activity;
  if (normalizedType.includes('check') || normalizedType.includes('hotel') || normalizedType.includes('stay')) return FALLBACK_IMAGES.checkin;
  if (normalizedType.includes('leisure') || normalizedType.includes('relax') || normalizedType.includes('beach')) return FALLBACK_IMAGES.leisure;

  return FALLBACK_IMAGES.default;
}
