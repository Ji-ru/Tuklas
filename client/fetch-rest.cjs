const hubs = [
  { name: 'Palawan (El Nido/Coron)', query: 'El Nido, Palawan' },
  { name: 'Boracay Island', query: 'Boracay' },
  { name: 'Bohol (Panglao & Chocolate Hills)', query: 'Chocolate Hills' },
  { name: 'Camiguin Island', query: 'Camiguin' },
  { name: 'Mati (Dahican Beach)', query: 'Mati, Davao Oriental' },
  { name: 'General Santos City', query: 'General Santos' },
  { name: 'Tawi-Tawi (Bongao)', query: 'Tawi-Tawi' },
  { name: 'Samar Eco-Adventure Hub', query: 'Samar (island)' },
  { name: 'Zamboanga City', query: 'Zamboanga City' },
  { name: 'Dapitan & Dakak', query: 'Dapitan' },
  { name: 'Cagayan de Oro City', query: 'Cagayan de Oro' },
  { name: 'Bukidnon Highlands', query: 'Bukidnon' }
];

async function fetchImages() {
  for (const hub of hubs) {
    try {
      const title = encodeURIComponent(hub.query.replace(/ /g, '_'));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      if (res.ok) {
        const data = await res.json();
        if (data.thumbnail && data.thumbnail.source) {
          console.log(`Success: ${hub.name} -> ${data.thumbnail.source.replace(/\/\d+px-/, '/800px-')}`);
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1000));
  }
}
fetchImages();
