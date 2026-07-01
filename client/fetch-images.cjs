const fs = require('fs');

const hubs = [
  { name: 'Metro Manila', query: 'Metro Manila' },
  { name: 'Baguio City', query: 'Baguio' },
  { name: 'Cordillera Highlands (Sagada/Banaue)', query: 'Banaue Rice Terraces' },
  { name: 'Batanes', query: 'Batanes' },
  { name: 'Iloilo & Guimaras', query: 'Iloilo City' },
  { name: 'Bacolod City', query: 'Bacolod' },
  { name: 'Cebu (City, Moalboal, Bantayan)', query: 'Cebu City' },
  { name: 'Dumaguete & Siquijor', query: 'Dumaguete' },
  { name: 'Leyte (Kalanggaman Island)', query: 'Kalanggaman Island' },
  { name: 'Lake Sebu (South Cotabato)', query: 'Lake Sebu' },
  { name: 'Siargao Island', query: 'Siargao' },
  { name: 'Surigao del Sur (Hinatuan/Bislig)', query: 'Hinatuan Enchanted River' },
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
  { name: 'Bukidnon Highlands', query: 'Bukidnon' },
  { name: 'Davao City & Samal Island', query: 'Davao City' },
];

async function fetchImages() {
  const result = {};
  for (const hub of hubs) {
    try {
      const title = encodeURIComponent(hub.query.replace(/ /g, '_'));
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed to fetch ${hub.name}: ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        let thumb = data.thumbnail.source;
        thumb = thumb.replace(/\/\d+px-/, '/800px-');
        result[hub.name] = thumb;
        console.log(`Success: ${hub.name} -> ${thumb}`);
      } else {
        console.log(`No thumbnail for ${hub.name}`);
      }
    } catch (e) {
      console.log(`Error on ${hub.name}: ${e.message}`);
    }
  }
  
  fs.writeFileSync('wiki-images.json', JSON.stringify(result, null, 2));
  console.log('Done!');
}

fetchImages();
