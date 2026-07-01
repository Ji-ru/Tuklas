-- Schema for Tuklas Database

-- Enable UUID generation extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  island_group VARCHAR(50) NOT NULL, -- 'Luzon', 'Visayas', 'Mindanao'
  region_name VARCHAR(100) NOT NULL,
  hub_name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  is_hidden_gem BOOLEAN DEFAULT FALSE,
  description TEXT,
  image_url TEXT
);

-- 2. Create saved_itineraries table
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_name VARCHAR(100) NOT NULL,
  duration_days INT NOT NULL,
  purpose VARCHAR(100) NOT NULL,
  pace VARCHAR(50) NOT NULL,
  itinerary_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed destinations data
INSERT INTO destinations (island_group, region_name, hub_name, category, is_hidden_gem, description) VALUES
('Luzon', 'National Capital Region', 'Metro Manila', 'Sightseeing', false, 'Historic Intramuros, dynamic BGC urban environments, and diverse culinary districts.'),
('Luzon', 'Cordillera Administrative Region', 'Baguio City', 'Sightseeing', false, 'Cool mountain climate, pine forests, artistic cafes, and local craft markets.'),
('Luzon', 'Cordillera Administrative Region', 'Cordillera Highlands (Sagada/Banaue)', 'Sightseeing', true, 'Ancient rice terraces, hanging coffins, and mystical mountain caves.'),
('Luzon', 'MIMAROPA', 'Palawan (El Nido/Coron)', 'Sightseeing', false, 'World-class limestone karst formations, lagoons, and crystal clear diving ecosystems.'),
('Luzon', 'Cagayan Valley', 'Batanes', 'Sightseeing', true, 'Rolling green hills, traditional stone houses, and deep Pacific ocean cliffs.'),
('Visayas', 'Western Visayas', 'Boracay Island', 'Sightseeing', false, 'Powder-white sand beaches, active water sports, and energetic island nightlife.'),
('Visayas', 'Western Visayas', 'Iloilo & Guimaras', 'Eating', false, 'Historic Spanish churches, iconic batchoy noodle soups, and exceptionally sweet mangoes.'),
('Visayas', 'Western Visayas', 'Bacolod City', 'Eating', false, 'The City of Smiles, sugarcane heritage mansions, and authentic chicken inasal.'),
('Visayas', 'Central Visayas', 'Cebu (City, Moalboal, Bantayan)', 'Sightseeing', false, 'Rich historical markers, massive sardine runs, and white sand northern beaches.'),
('Visayas', 'Central Visayas', 'Bohol (Panglao & Chocolate Hills)', 'Sightseeing', false, 'Unique conical geological structures, tarsier wildlife sanctuaries, and diving resorts.'),
('Visayas', 'Central Visayas', 'Dumaguete & Siquijor', 'Sightseeing', true, 'Relaxed university coastal town paired with a mystical island of multi-tiered falls.'),
('Visayas', 'Eastern Visayas', 'Leyte (Kalanggaman Island)', 'Sightseeing', true, 'Pristine, narrow sandbars isolated in highly transparent turquoise waters.'),
('Visayas', 'Eastern Visayas', 'Samar Eco-Adventure Hub', 'Sightseeing', true, 'Massive underground cave configurations and raw river trekking corridors.'),
('Mindanao', 'Zamboanga Peninsula', 'Zamboanga City', 'Sightseeing', true, 'Rich Hispanic-Chavacano historic fort settings and rare pink coralline sand shores.'),
('Mindanao', 'Zamboanga Peninsula', 'Dapitan & Dakak', 'Sightseeing', true, 'Historical exile grounds of Dr. Jose Rizal and secure coastal resort basins.'),
('Mindanao', 'Northern Mindanao', 'Cagayan de Oro City', 'Sightseeing', false, 'The white water rafting capital of the Philippines and major urban trading node.'),
('Mindanao', 'Northern Mindanao', 'Bukidnon Highlands', 'Sightseeing', true, 'Pine ridges, cool alpine atmosphere, rolling hills, and extreme zipline clusters.'),
('Mindanao', 'Northern Mindanao', 'Camiguin Island', 'Sightseeing', false, 'Volcanic island escape featuring natural hot/cold springs and sunken cemetery landmarks.'),
('Mindanao', 'Davao Region', 'Davao City & Samal Island', 'Sightseeing', false, 'Progressive eco-city housing Mt. Apo, rich fruit markets, and nearby beach getaways.'),
('Mindanao', 'Davao Region', 'Mati (Dahican Beach)', 'Sightseeing', true, 'Crescent white-sand shoreline famous for skimboarding and marine mammal tracking.'),
('Mindanao', 'SOCCSKSARGEN', 'Lake Sebu (South Cotabato)', 'Sightseeing', true, 'Cultural cradle of the Tboli tribe featuring serene lotus lakes and traditional weaving loops.'),
('Mindanao', 'SOCCSKSARGEN', 'General Santos City', 'Eating', false, 'The premier tuna terminal capital hosting vibrant fresh deep-sea seafood culinary tracking.'),
('Mindanao', 'Caraga', 'Siargao Island', 'Sightseeing', false, 'Globally recognized surfing epicenters with aesthetic palm-fringed lifestyle dynamics.'),
('Mindanao', 'Caraga', 'Surigao del Sur (Hinatuan/Bislig)', 'Sightseeing', true, 'The deep blue, crystal clear Enchanted River and multi-tiered wide waterfalls.'),
('Mindanao', 'BARMM', 'Tawi-Tawi (Bongao)', 'Sightseeing', true, 'Untouched stilt-village communities, ancient mountain peaks, and deep heritage mosques.')
ON CONFLICT (hub_name) DO UPDATE SET
  island_group = EXCLUDED.island_group,
  region_name = EXCLUDED.region_name,
  category = EXCLUDED.category,
  is_hidden_gem = EXCLUDED.is_hidden_gem,
  description = EXCLUDED.description;

-- 4. Updates for advanced caching
ALTER TABLE saved_itineraries 
  ADD COLUMN IF NOT EXISTS cache_key CHAR(64),
  ADD COLUMN IF NOT EXISTS budget VARCHAR(50),
  ADD COLUMN IF NOT EXISTS travel_group VARCHAR(100),
  ADD COLUMN IF NOT EXISTS accommodation VARCHAR(50),
  ADD COLUMN IF NOT EXISTS dietary VARCHAR(200),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_cache_key 
  ON saved_itineraries (cache_key);
CREATE INDEX IF NOT EXISTS idx_expires_at 
  ON saved_itineraries (expires_at);
CREATE INDEX IF NOT EXISTS idx_destinations_island 
  ON destinations (island_group);
