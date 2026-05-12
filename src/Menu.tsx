import { useState } from "react";

const menuData = [
  { id: 1, name: "Classic Cream", category: "Swirls", price: 49, img: "classic-cream.png", prices: { "1pc": 49, "box4": 189, "box6": 279 } },
  { id: 2, name: "Chocolate Heaven", category: "Swirls", price: 59, img: "choc-heaven.png", prices: { "1pc": 59, "box4": 229, "box6": 339 }, bestseller: true },
  { id: 3, name: "Strawberries & Cream", category: "Swirls", price: 59, img: "strawberry-.png", prices: { "1pc": 59, "box4": 229, "box6": 339 } },
  { id: 4, name: "Biscoff Butter", category: "Swirls", price: 65, img: "biscoff-butter.png", prices: { "1pc": 65, "box4": 255, "box6": 375 }, bestseller: true },
  { id: 5, name: "Classic Cream Bites", category: "Bites", price: 199, img: "classic-bites.png" },
  { id: 6, name: "Assorted Swirls", category: "Assorted", price: 249, img: "assorted4.png", prices: { "box4": 249, "box6": 369 } },
  { id: 7, name: "Assorted Bites", category: "Bites", price: 269, img: "classic-bites.png" }, 
];

export default function MenuPage({ onAddToCart }: { onAddToCart: (item: any, size: string, quantity: number) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<any>(null);


  const filteredItems = menuData.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-swirl-cream min-h-screen font-fredoka pt-12 pb-24">
      <div className="container mx-auto px-12">
        <h1 className="text-8xl font-gloock text-swirl-brown mb-10 lowercase opacity-90">menu</h1>
        
        {/* Nav & Search Bar */}
        <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 shadow-sm mb-16 border border-swirl-brown/5">
          <div className="flex gap-2">
            {["All", "Swirls", "Bites", "Assorted", "Bundles"].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} 
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? "bg-swirl-brown text-white shadow-md" : "text-swirl-brown/60 hover:text-swirl-brown"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative flex items-center pr-4 border-l border-swirl-brown/10 ml-4 pl-6">
            <span className="text-swirl-brown/30 mr-2">🔍</span>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              className="bg-transparent outline-none text-swirl-brown font-bold placeholder:text-swirl-brown/20 w-40" />
          </div>
        </div>

        {/* Sections */}
        {["Swirls", "Bites", "Assorted"].map((section) => {
          const sectionItems = filteredItems.filter(i => i.category === section);
          if (sectionItems.length === 0) return null;
          return (
            <div key={section} className="mb-20">
              <h2 className="text-4xl font-black text-swirl-brown mb-10">{section}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {sectionItems.map((item) => (
                  <div key={item.id} className="group" onClick={() => setSelectedFlavor(item)}>
                    <div className="bg-[#fdf3e1] rounded-[45px] p-10 mb-6 aspect-square flex items-center justify-center relative shadow-sm border border-swirl-brown/5 transition-transform duration-500 group-hover:-translate-y-2">
                      {item.bestseller && <div className="absolute top-6 left-6 bg-swirl-brown text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Best Seller</div>}
                      <img src={`src/assets/${item.img}`} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="px-4 text-center md:text-left">
                      <h3 className="text-2xl font-black text-swirl-brown mb-1">{item.name}</h3>
                      <div className="flex justify-between items-center text-swirl-brown/50 font-bold mb-4">
                        <span>⭐ 5.0</span>
                        <span className="text-2xl font-black text-swirl-brown">₱{item.price}</span>
                      </div>
                      <button className="w-full bg-swirl-brown text-white py-4 rounded-3xl font-black shadow-md">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedFlavor && (
        <OrderModal 
          flavor={selectedFlavor} 
          onClose={() => setSelectedFlavor(null)} 
          onConfirm={(flavor, size, quantity) => {
            onAddToCart(flavor, size, quantity);
            setSelectedFlavor(null);
          }}
        />
      )}
    </div>
  )}

/* --- INTERNAL MODAL COMPONENT --- */
function OrderModal({ flavor, onClose, onConfirm }: { flavor: any; onClose: () => void; onConfirm: (f: any, s: string, q: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(flavor.prices?.["1pc"] ? "1pc" : "box4");
  const currentPrice = flavor.prices ? flavor.prices[size] : flavor.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-swirl-cream w-full max-w-md rounded-[40px] p-8 relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-swirl-brown text-2xl hover:rotate-90 transition">✕</button>
        
        <div className="flex flex-col items-center mb-6">
          <img src={`src/assets/${flavor.img}`} className="w-40 h-40 object-contain mb-4" alt={flavor.name} />
          <h2 className="text-3xl font-black text-swirl-brown text-center uppercase leading-tight">{flavor.name}</h2>
        </div>

        {/* Size Selection */}
        {flavor.prices && (
          <div className="space-y-2 mb-8">
            {Object.entries(flavor.prices).map(([id, p]: [string, any]) => (
              <button 
                key={id} 
                onClick={() => setSize(id)} 
                className={`w-full flex justify-between px-6 py-3 rounded-2xl border-2 transition ${
                  size === id ? "border-swirl-brown bg-swirl-brown text-white" : "border-swirl-brown/10 bg-white text-swirl-brown"
                }`}
              >
                <span className="font-bold">
                  {id === "1pc" ? "Single Piece" : id === "box4" ? "Box of 4" : "Box of 6"}
                </span>
                <span className="font-black">₱{p}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 w-full">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white rounded-full px-4 py-2 border border-swirl-brown/10">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl px-2 font-black text-swirl-brown">-</button>
            <span className="text-lg font-bold w-8 text-center text-swirl-brown">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-xl px-2 font-black text-swirl-brown">+</button>
          </div>

          {/* THE CART BUTTON */}
          <button 
            onClick={() => onConfirm(flavor, size, quantity)} // This calls the function in App.tsx
            className="flex-1 bg-swirl-brown text-white py-4 rounded-full font-bold shadow-lg hover:brightness-110 transition"
          >
            Add — ₱{currentPrice * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}