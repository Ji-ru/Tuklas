import { fetchActivityImage } from './services/images.js';

async function runQA() {
  console.log("Testing known landmark (Magellan's Cross)...");
  const img1 = await fetchActivityImage("Magellan's Cross", "Cebu City", "Sightseeing");
  console.log("Result:", img1);

  console.log("\\nTesting obscure place (Should return dining fallback)...");
  const img2 = await fetchActivityImage("Bob's Unknown Tapsihan", "Manila", "Dining");
  console.log("Result:", img2);

  console.log("\\nTesting general concept (Should return leisure fallback)...");
  const img3 = await fetchActivityImage("Relax at the beach", "Boracay", "Leisure");
  console.log("Result:", img3);
}

runQA();
