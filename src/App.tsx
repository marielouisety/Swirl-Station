import { useState } from "react";

const Navbar = () => (
  <div className="sticky top-0 z-50">
    <nav className="flex justify-between items-center px-12 py-4 bg-swirl-cream font-fredoka shadow-sm">
      <img src="src/assets/logo.png" alt="Swirl Station Logo" className="h-10 w-auto" />
      <div className="flex gap-15 items-center font-bold text-swirl-brown text-sm uppercase">
        <a href="#" className="hover:opacity-70">Home</a>
        <a href="#menu-section" className="hover:opacity-70">Menu</a>
        <a href="#" className="hover:opacity-70">Contact Us</a>
        <button className="bg-swirl-brown text-white px-6 py-2 rounded-full font-bold shadow-md active:scale-95 transition">
          Log In
        </button>
        <div className="flex gap-4 text-xl">
          <span>🛒</span>
          <span>👤</span>
        </div>
      </div>
    </nav>

    <div className="w-full h-20" 
         style={{ 
           backgroundImage: "url('src/assets/banner.png')",
           backgroundRepeat: "repeat-x",
           backgroundSize: "auto 100%" 
         }} 
    />
  </div>
);

const Header = () => {
  return (
    <header className="relative min-h-[600px] pt-10 pb-10 overflow-hidden font-fredoka font-bold">
      
      <div className="container mx-auto px-20 h-full flex flex-col md:flex-row items-start justify-between relative z-10 pt-8">
        
        <div className="flex-1 space-y-4 max-w-md mt-45"> 
          <h1 className="text-6xl font-black text-swirl-brown leading-tight">
            your stop for <br />
            cinnamon swirls
          </h1>
          <p className="text-swirl-brown font-medium text-lg">
            baked fresh daily, served warm at your stop.
          </p>
          <button className="bg-swirl-brown text-swirl-cream px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition">
            Order Now
          </button>
        </div>
        
        <div className="flex-1 relative flex justify-center md:justify-end">
          <img 
            src="src/assets/double-express.png" 
            alt="Half & Half Double Express" 
            className="w-full max-w-[650px] object-contain drop-shadow-2xl z-10" 
          />
          <div className="absolute -bottom-10 right-0 w-[110%] h-24 bg-[#E2C4A2] rounded-[100%] blur-2xl z-0 opacity-60" />
        </div>
      </div>
    </header>
  );
};

const Featured = () => (
  <section className="container mx-auto px-20 py-20 font-fredoka">
    <h2 className="text-4xl font-black text-swirl-brown mb-10">Featured</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <img 
        src="src/assets/giveaway-post.png" 
        alt="Giveaway" 
        className="w-full rounded-3xl shadow-xl hover:scale-[1.02] transition duration-300" 
      />
      <img 
        src="src/assets/how-to-join.png" 
        alt="How to join" 
        className="w-full rounded-3xl shadow-xl hover:scale-[1.02] transition duration-300" 
      />
    </div>
  </section>
);

const Menu = () => {
  const [selectedFlavor, setSelectedFlavor] = useState(null);

  const items = [
    { id: 1, name: "Chocolate", sub: "HEAVEN", img: "chocolate.png" },
    { id: 2, name: "Strawberries", sub: "& CREAM", img: "strawberry.png" },
    { id: 3, name: "Biscoff", sub: "BUTTER", img: "biscoff.png" },
  ];

  return (
    <section id="menu-section" className="container mx-auto px-20 py-20 font-fredoka scroll-mt-32">
      <h2 className="text-4xl font-black text-swirl-brown mb-10">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedFlavor(item)} // Open Modal on Click
            className="bg-swirl-cream rounded-[40px] p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="w-full aspect-square overflow-hidden mb-4">
              <img 
                src={`src/assets/${item.img}`} 
                alt={item.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition duration-500" 
              />
            </div>
            
          </div>
        ))}
      </div>

      {selectedFlavor && (
        <OrderModal 
          flavor={selectedFlavor} 
          onClose={() => setSelectedFlavor(null)} 
        />
      )}
    </section>
  );
};

const OrderModal = ({ flavor, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("1pc"); // Default selection

  const prices = {
    "1pc": 59,
    "box4": 229,
    "box6": 339
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} x ${size} of ${flavor.name} to cart.`);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-swirl-cream w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-swirl-brown text-2xl hover:rotate-90 transition">✕</button>

        <div className="p-8 flex flex-col items-center">
          <img src={`src/assets/${flavor.img}`} alt={flavor.name} className="w-48 h-48 object-contain mb-4" />

          <div className="w-full space-y-3 mb-8">
            {[
              { id: "1pc", label: "1 pc", price: 59 },
              { id: "box4", label: "Box of 4", price: 229 },
              { id: "box6", label: "Box of 6", price: 339 }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSize(option.id)}
                className={`w-full flex justify-between items-center px-6 py-4 rounded-2xl border-2 transition ${
                  size === option.id ? "border-swirl-brown bg-swirl-brown text-white" : "border-swirl-brown/10 hover:border-swirl-brown/30"
                }`}
              >
                <span className="font-bold">{option.label}</span>
                <span className="font-black">₱{option.price}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 w-full">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-inner border border-swirl-brown/10">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-bold text-swirl-brown px-2">-</button>
              <span className="text-xl font-bold text-swirl-brown w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-bold text-swirl-brown px-2">+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-swirl-brown text-white py-4 rounded-full font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition"
            >
              Add to Cart — ₱{prices[size] * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div 
      className="min-h-screen h-auto bg-swirl-bg bg-cover bg-no-repeat bg-top font-fredoka selection:bg-swirl-brown selection:text-white scroll-smooth"
      style={{ backgroundImage: "url('src/assets/bg2.png')" }}
    >
      <Navbar />
      <Header />
      <Featured />
      <Menu />
      
      <footer className="py-20 text-center text-swirl-brown font-bold opacity-50">
        © 2026 Swirl Station. All rights Reserved.
      </footer>
    </div>
  );
}