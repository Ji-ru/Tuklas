
const SOUVENIRS = [
  {
    id: 1,
    region: 'Luzon',
    name: 'Woven Inabel Fabrics',
    description: 'Traditional handwoven textiles from the Ilocos region, perfect for blankets, table runners, and clothing.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop', // placeholder fabric
    tag: 'Textiles'
  },
  {
    id: 2,
    region: 'Luzon',
    name: 'Kapeng Barako',
    description: 'A distinct, strong coffee varietal grown in Batangas. Ideal for coffee enthusiasts.',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop', // placeholder coffee
    tag: 'Food & Drink'
  },
  {
    id: 3,
    region: 'Visayas',
    name: 'Dried Mangoes',
    description: 'Cebu is world-famous for its sweet and tangy dried mangoes. The ultimate pasalubong.',
    image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?q=80&w=1000&auto=format&fit=crop', // placeholder mangoes
    tag: 'Food & Drink'
  },
  {
    id: 4,
    region: 'Visayas',
    name: 'Capiz Shell Crafts',
    description: 'Delicate, translucent windowpane oyster shells crafted into lamps, wind chimes, and jewelry.',
    image: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=1000&auto=format&fit=crop', // placeholder crafts
    tag: 'Decor'
  },
  {
    id: 5,
    region: 'Mindanao',
    name: 'T\'nalak Weaves',
    description: 'Sacred cloth woven by the T\'boli people of South Cotabato, made from abaca fibers and natural dyes.',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1000&auto=format&fit=crop', // placeholder weave
    tag: 'Textiles'
  },
  {
    id: 6,
    region: 'Mindanao',
    name: 'Brassware & Gong',
    description: 'Intricate brass items including kulintang (gongs) and betel nut boxes crafted by Maranao artisans.',
    image: 'https://images.unsplash.com/photo-1601614949514-c1042aa3a7bf?q=80&w=1000&auto=format&fit=crop', // placeholder brass
    tag: 'Crafts'
  }
];

export default function SouvenirsPage() {
  return (
    <div className="pt-[120px] pb-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full">
      <div className="text-center mb-12">
        <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
          Pasalubong Guide
        </span>
        <h1 className="font-display-md md:font-display-lg text-primary mb-4">Philippine Souvenirs</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          "Pasalubong" is the Filipino tradition of bringing gifts from your travels. Discover the best local crafts, textiles, and treats to bring a piece of the islands home.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOUVENIRS.map((item) => (
          <div key={item.id} className="bg-surface-container-low rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,51,102,0.05)] hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="h-48 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                <span className="font-label-sm text-label-sm text-primary font-bold">{item.region}</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{item.name}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-primary-container text-on-primary-container rounded-2xl p-8 md:p-12 text-center">
        <h2 className="font-headline-md text-headline-md mb-4">Support Local Artisans</h2>
        <p className="font-body-md text-body-md max-w-2xl mx-auto opacity-90">
          When buying souvenirs, try to purchase directly from weavers, carvers, and local markets rather than large tourist shops. Your purchase directly supports their livelihood and preserves centuries-old traditions.
        </p>
      </div>
    </div>
  );
}
