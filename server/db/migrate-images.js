import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const images = {
  'Metro Manila': 'https://images.unsplash.com/photo-1518439179728-c0b8b2046d7e?q=80&w=800&auto=format&fit=crop',
  'Baguio City': 'https://images.unsplash.com/photo-1582555306660-84ebf5d21a55?q=80&w=800&auto=format&fit=crop',
  'Cordillera Highlands (Sagada/Banaue)': 'https://images.unsplash.com/photo-1542491113-73d82a1dbab7?q=80&w=800&auto=format&fit=crop',
  'Palawan (El Nido/Coron)': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop',
  'Batanes': 'https://images.unsplash.com/photo-1620862529883-20a2e5720d18?q=80&w=800&auto=format&fit=crop',
  'Boracay Island': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
  'Iloilo & Guimaras': 'https://images.unsplash.com/photo-1616422285324-5d519d1e57c5?q=80&w=800&auto=format&fit=crop',
  'Bacolod City': 'https://images.unsplash.com/photo-1629858349279-373f1cb684c3?q=80&w=800&auto=format&fit=crop',
  'Cebu (City, Moalboal, Bantayan)': 'https://images.unsplash.com/photo-1518182170546-076616fdcbdd?q=80&w=800&auto=format&fit=crop',
  'Bohol (Panglao & Chocolate Hills)': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800&auto=format&fit=crop',
  'Dumaguete & Siquijor': 'https://images.unsplash.com/photo-1521747802874-ce44ce2f58e1?q=80&w=800&auto=format&fit=crop',
  'Leyte (Kalanggaman Island)': 'https://images.unsplash.com/photo-1548119102-28df52ea2b0c?q=80&w=800&auto=format&fit=crop',
  'Samar Eco-Adventure Hub': 'https://images.unsplash.com/photo-1596489370889-13e6d1c81da5?q=80&w=800&auto=format&fit=crop',
  'Zamboanga City': 'https://images.unsplash.com/photo-1598099307769-7c40d753f7f8?q=80&w=800&auto=format&fit=crop',
  'Dapitan & Dakak': 'https://images.unsplash.com/photo-1583400585250-bc60dc2d9ebf?q=80&w=800&auto=format&fit=crop',
  'Cagayan de Oro City': 'https://images.unsplash.com/photo-1559828854-d9bc70b68638?q=80&w=800&auto=format&fit=crop',
  'Bukidnon Highlands': 'https://images.unsplash.com/photo-1589419139886-c4d62c1619f7?q=80&w=800&auto=format&fit=crop',
  'Camiguin Island': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop',
  'Davao City & Samal Island': 'https://images.unsplash.com/photo-1563820420790-a541604a8b79?q=80&w=800&auto=format&fit=crop',
  'Mati (Dahican Beach)': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  'Lake Sebu (South Cotabato)': 'https://images.unsplash.com/photo-1605335165977-f27eb6f28780?q=80&w=800&auto=format&fit=crop',
  'General Santos City': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?q=80&w=800&auto=format&fit=crop',
  'Siargao Island': 'https://images.unsplash.com/photo-1554522432-843eeb1fc4fb?q=80&w=800&auto=format&fit=crop',
  'Surigao del Sur (Hinatuan/Bislig)': 'https://images.unsplash.com/photo-1614088628045-8123282bda16?q=80&w=800&auto=format&fit=crop',
  'Tawi-Tawi (Bongao)': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'
};

async function migrate() {
  try {
    console.log('Adding image_url column...');
    await pool.query('ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url TEXT');

    console.log('Seeding images...');
    for (const [hub, url] of Object.entries(images)) {
      await pool.query('UPDATE destinations SET image_url = $1 WHERE hub_name = $2', [url, hub]);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
