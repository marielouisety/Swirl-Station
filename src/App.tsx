import { useState, useEffect } from "react";
import AuthPage from "./Login"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MenuPage from "./Menu";

const Navbar = ({ onLoginClick, user, setView }: { onLoginClick: () => void; user: any; setView: (v: "home" | "menu") => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // dropdown for logout
  const displayName = user?.email ? user.email.split('@')[0] : "";

  return(
  <div className="sticky top-0 z-50">
    <nav className="flex justify-between items-center px-12 py-4 bg-swirl-brown font-fredoka shadow-md text-swirl-cream">
      <img src="src/assets/swirl-station-cream-logo.png" alt="Swirl Station Logo" className="h-10 w-auto" />
      
      <div className="flex gap-10 items-center font-bold text-sm uppercase">
        <button 
          onClick={() => setView('home')} 
          className="hover:text-white transition cursor-pointer"
        >
          Home
        </button>
        
        <button 
          onClick={() => setView('menu')} 
          className="hover:text-white transition cursor-pointer"
        >
          Menu
        </button>
        
        <button className="hover:text-white transition cursor-pointer">About Us</button>
        <button className="hover:text-white transition cursor-pointer">Contact Us</button>
        
        <div className="flex gap-6 items-center ml-4">
            <span className="cursor-pointer hover:scale-110 transition text-2xl">🛒</span>
            
            {user ? (
              /* --- LOGGED IN: Profile Icon + Dropdown --- */
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 bg-swirl-cream text-swirl-brown px-4 py-2 rounded-full font-black shadow-md hover:bg-white transition"
                >
                  <span className="text-xl">👤</span>
                  <span className="normal-case text-xs">Hey, {displayName}</span>
                </button>

                {/* The Actual Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl py-2 z-[60] border border-swirl-brown/10 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-swirl-brown/5">
                      <p className="text-[10px] text-swirl-brown/50 font-bold uppercase">Logged in as</p>
                      <p className="text-swirl-brown text-sm truncate font-bold lowercase">{user.email}</p>
                    </div>
                    
                    <button className="w-full text-left px-4 py-3 text-swirl-brown hover:bg-swirl-cream/50 transition font-bold text-sm">
                      My Orders
                    </button>
                    
                    <button 
                      onClick={() => auth.signOut()}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition font-bold text-sm flex justify-between items-center"
                    >
                      Log Out
                      <span>➔</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- LOGGED OUT: Simple Login Button --- */
              <button 
                onClick={onLoginClick}
                className="bg-swirl-cream text-swirl-brown px-8 py-2 rounded-full font-black shadow-md hover:scale-105 active:scale-95 transition"
              >
                Log In
              </button>
          )}
        </div>
      </div>
    </nav>

    {/* The Scalloped Border underneath the navbar */}
    <div className="w-full h-12" 
         style={{ 
           backgroundImage: "url('src/assets/banner.png')",
           backgroundRepeat: "repeat-x",
           backgroundSize: "auto 100%" 
         }} 
    />
  </div>
  )
};

const Header = () => (
  <header className="relative min-h-[800px] pt-10 pb-24 font-fredoka font-bold flex flex-col justify-center items-center bg-cover bg-center"
          style={{ backgroundImage: "url('src/assets/final-bg-1.png')" }}> 
    
    <div className="container mx-auto px-60 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
      
      <div className="flex-1 space-y-6 max-w-lg mb-10 md:mb-0"> 
        <h1 className="text-5xl font-fredoka text-swirl-brown leading-[1.1]">
          your stop for
          <h1 className="text-6xl font-gloock text-swirl-brown leading-[1.1]">
          <span className="text-8xl">cinnamon swirls</span>
          </h1>
        </h1>
        
        <p className="text-swirl-brown font-semibold text-xl uppercase tracking-wide opacity-80">
          baked fresh daily, <br/> served warm at your stop.
        </p>
        <button className="bg-swirl-brown text-swirl-cream px-8 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 transition flex items-center gap-3 uppercase">
          Board your order
          <span className="bg-white text-swirl-brown rounded-full w-6 h-6 flex items-center justify-center text-sm">➔</span>
        </button>
      </div>
      
      <div className="flex-1 relative flex justify-center md:justify-end">
        <img 
          src="src/assets/assorted-6.png" 
          alt="Box of Swirls" 
          className="w-full max-w-[1000px] object-contain drop-shadow-2xl z-10" 
        />
      </div>
    </div>

    {/* Floating Features Banner */}
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl bg-white/95 backdrop-blur-md rounded-full shadow-xl flex justify-between items-center px-10 py-5 text-swirl-brown font-bold text-lg divide-x-2 divide-swirl-brown/10 z-20">
      <div className="flex-1 flex items-center justify-center gap-3 px-4">❤️ made with love</div>
      <div className="flex-1 flex items-center justify-center gap-3 px-4">🌀 soft, warm, and gooey</div>
      <div className="flex-1 flex items-center justify-center gap-3 px-4">🎁 perfect for any occasion</div>
      <div className="flex-1 flex items-center justify-center gap-3 px-4">🛵 pickup or delivery within Cebu</div>
    </div>
  </header>
);

const Featured = () => (
  <section className="container mx-auto px-30 pt-32 pb-16 font-fredoka">
    <h2 className="text-4xl font-black text-swirl-brown mb-8 flex items-center gap-2">
      Featured ✨
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <img src="src/assets/ga-landscape-1.png" alt="Giveaway" className="w-full rounded-3xl shadow-lg hover:shadow-xl transition duration-300" />
      <img src="src/assets/ga-landscape-2.png" alt="How to join" className="w-full rounded-3xl shadow-lg hover:shadow-xl transition duration-300" />
    </div>
  </section>
);

const Bestsellers = ({ onSelectFlavor }: { onSelectFlavor: (flavor: any) => void }) => {
  const items = [
    { id: 1, name: "Assorted Box of Swirls", desc: "Choose your own flavors!", price: 249, rating: "5.0", img: "assorted4.png" },
    { id: 2, name: "Chocolate Heaven", desc: "Rich chocolate dough with chocolate chunks and creamy frosting", price: 59, rating: "5.0", img: "choc-heaven.png" },
    { id: 3, name: "Assorted Bites", desc: "Cinnamon swirl topped with strawberry cream and jam", price: 269, rating: "5.0", img: "classic-bites.png" },
    { id: 4, name: "Biscoff Butter", desc: "Soft cinnamon swirl layered with Biscoff frosting, drizzle, and crumble", price: 65, rating: "5.0", img: "biscoff-butter.png" },
  ];

  return (
    <section id="bestsellers-section" className="container mx-auto px-30 py-16 font-fredoka scroll-mt-32">
      <h2 className="text-4xl font-black text-swirl-brown mb-8 flex items-center gap-2">
        Bestsellers ✨
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-swirl-brown/10 flex flex-col group">
            <div className="bg-[#EBD5B3] w-full h-56 p-6 flex items-center justify-center">
              <img src={`src/assets/${item.img}`} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500 drop-shadow-lg" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl font-black text-swirl-brown mb-2 leading-tight">{item.name}</h3>
                <p className="text-sm text-swirl-brown/70 font-medium leading-snug mb-4">{item.desc}</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-swirl-brown/50">⭐ {item.rating}</span>
                  <span className="text-2xl font-black text-swirl-brown">₱{item.price}</span>
                </div>
                <button 
                  onClick={() => onSelectFlavor(item)}
                  className="w-full bg-swirl-brown text-white py-3 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-95 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SweetMoments = () => (
  <section className="container mx-auto px-30 py-16 font-fredoka overflow-hidden">
    <div className="mb-8">
      <h2 className="text-4xl font-black text-swirl-brown mb-2">Sweet Moments with Swirl Station</h2>
      <p className="text-swirl-brown/70 font-medium">Tag @swirlstation.cebu on ig!</p>
    </div>
    
    <div className="flex justify-center items-center gap-4 h-[400px]">
      <img src="src/assets/lou.jpg" alt="Customer 1" className="h-[250px] w-48 object-cover rounded-[30px] shadow-lg opacity-90" />
      <img src="src/assets/lami.jpg" alt="Customer 2" className="h-[320px] w-56 object-cover rounded-[30px] shadow-lg" />
      <img src="src/assets/sas.jpg" alt="Customer 3" className="h-full w-72 object-cover rounded-[40px] shadow-xl z-10 scale-105" />
      <img src="src/assets/meagan.jpg" alt="Customer 4" className="h-[320px] w-56 object-cover rounded-[30px] shadow-lg" />
      <img src="src/assets/dayn.jpg" alt="Customer 5" className="h-[250px] w-48 object-cover rounded-[30px] shadow-lg opacity-90" />
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-swirl-brown text-swirl-cream font-fredoka pt-16 pb-8 px-10 mt-20">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-swirl-cream/20 pb-10">
      
      {/* Brand & Socials */}
      <div className="space-y-4">
        <img src="src/assets/swirl-station-cream-logo.png" alt="Logo" className="w-48 mb-6" />
        <div className="flex gap-4 text-2xl">
          <a href="#" className="hover:text-white transition">📘</a> {/* Replace with actual SVG/icons */}
          <a href="#" className="hover:text-white transition">📸</a>
          <a href="#" className="hover:text-white transition">🎵</a>
        </div>
      </div>

      {/* Help Links */}
      <div className="flex flex-col space-y-3 font-medium">
        <h4 className="text-xl font-bold mb-2">Help</h4>
        <a href="#" className="opacity-80 hover:opacity-100 transition">FAQs</a>
        <a href="#" className="opacity-80 hover:opacity-100 transition">Ordering & Payment</a>
        <a href="#" className="opacity-80 hover:opacity-100 transition">Delivery & Pickup</a>
        <a href="#" className="opacity-80 hover:opacity-100 transition">Terms & Conditions</a>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col space-y-3 font-medium">
        <h4 className="text-xl font-bold mb-2">Contact Us</h4>
        <p className="opacity-80">+63 917 312 3663</p>
        <p className="opacity-80">swirlstation.cebu@gmail.com</p>
        <p className="opacity-80">Cebu City, Philippines</p>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-col space-y-3 font-medium">
        <h4 className="text-xl font-bold mb-2">We accept</h4>
        <p className="opacity-80">GCash</p>
        <p className="opacity-80">Maya</p>
        <p className="opacity-80">BPI/UnionBank</p>
        <p className="opacity-80">Cash on Delivery</p>
      </div>

    </div>
    <div className="text-center mt-8 opacity-50 font-medium text-sm">
      © 2026 Swirl Station. All rights Reserved.
    </div>
  </footer>
);

const OrderModal = ({ flavor, onClose }: { flavor: any; onClose: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("1 pc");
  const prices: { [key: string]: number } = { "1pc": flavor.price || 59, "box4": 229, "box6": 339 };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-swirl-cream w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative p-8 flex flex-col items-center animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-swirl-brown text-2xl hover:rotate-90 transition">✕</button>
        <img src={`src/assets/${flavor.img}`} alt={flavor.name} className="w-48 h-48 object-contain mb-4 drop-shadow-xl" />
        <h2 className="text-3xl font-black text-swirl-brown mb-6 uppercase text-center leading-tight">{flavor.name}</h2>
        
        <div className="w-full space-y-3 mb-8 text-swirl-brown">
          {Object.entries(prices).map(([id, price]) => (
            <button key={id} onClick={() => setSize(id)} className={`w-full flex justify-between px-6 py-4 rounded-2xl border-2 transition ${size === id ? "border-swirl-brown bg-swirl-brown text-white" : "border-swirl-brown/20 bg-white"}`}>
              <span className="font-bold">{id.replace('box', 'Box of ')}</span>
              <span className="font-black">₱{price}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 w-full text-swirl-brown">
          <div className="flex items-center bg-white rounded-full px-4 py-2 border border-swirl-brown/20">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl px-2 font-black">-</button>
            <span className="text-xl font-bold w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-2xl px-2 font-black">+</button>
          </div>
          <button onClick={onClose} className="flex-1 bg-swirl-brown text-white py-4 rounded-full font-bold shadow-lg">
            Add to Cart — ₱{prices[size] * quantity}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<"home" | "menu">("home");
  const [showAuth, setShowAuth] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<any>(null); // Lifted state up
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div 
      className="min-h-screen bg-swirl-cream font-fredoka selection:bg-swirl-brown selection:text-white scroll-smooth"
    >
      <Navbar 
        user={user}
        onLoginClick={() => setShowAuth(true)} 
        setView={setView}
      />

      {view === "home" ? (
        <>
          <Header />
        </>
      ) : (
        <MenuPage />
      )}

      <Featured />
      
      <Bestsellers onSelectFlavor={setSelectedFlavor} />
      
      <SweetMoments />
      
      <Footer />

      {/* Render Modals over everything */}
      {selectedFlavor && (
        <OrderModal flavor={selectedFlavor} onClose={() => setSelectedFlavor(null)} />
      )}
      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </div>
  );
}