import { useState, useEffect } from "react";
import AuthPage from "./Login"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MenuPage from "./Menu";
import CheckoutModal from "./Checkout";
import OrderHistory from "./OrderHistory";

const Navbar = ({ onLoginClick, user, setView, cartCount, onCartClick, onOrdersClick }: { 
  onLoginClick: () => void; 
  user: any; 
  setView: (v: "home" | "menu") => void;
  cartCount: number; 
  onCartClick: () => void;
  onOrdersClick: () => void;
}) => {
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
        
        <div className="relative flex items-center">
          <button 
            onClick={onCartClick} 
            className="cursor-pointer hover:scale-110 transition text-2xl relative"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-swirl-brown animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

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
                    
                    <button onClick={onOrdersClick} className="w-full text-left px-4 py-3 text-swirl-brown hover:bg-swirl-cream/50 transition font-bold text-sm">
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

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }: any) => {
  const total = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Side Panel */}
      <div className="relative w-full max-w-md bg-swirl-cream h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-swirl-brown uppercase">Your Tray</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-swirl-brown/40 font-bold mt-20">Your tray is empty!</p>
          ) : (
            items.map((item: any) => (
              <div key={item.cartId} className="bg-white p-4 rounded-3xl flex gap-4 items-center border border-swirl-brown/5">
                <img src={`src/assets/${item.img}`} className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <h4 className="font-black text-swirl-brown leading-tight">{item.name}</h4>
                  <p className="text-xs font-bold text-swirl-brown/50 uppercase">{item.selectedSize}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => onUpdateQuantity(item.cartId, -1)} className="w-6 h-6 rounded-full bg-swirl-brown/10 text-swirl-brown font-black text-sm flex items-center justify-center hover:bg-swirl-brown hover:text-white transition">-</button>
                    <span className="text-sm font-black text-swirl-brown w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.cartId, 1)} className="w-6 h-6 rounded-full bg-swirl-brown/10 text-swirl-brown font-black text-sm flex items-center justify-center hover:bg-swirl-brown hover:text-white transition">+</button>
                  </div>
                </div>
                <p className="font-black text-swirl-brown">₱{item.totalPrice}</p>
                <button onClick={() => onRemove(item.cartId)} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-swirl-brown/10 pt-6 mt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-swirl-brown/60 uppercase text-sm">Total Amount</span>
            <span className="text-3xl font-black text-swirl-brown">₱{total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-swirl-brown text-white py-4 rounded-full font-black shadow-lg hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};  

const Header = () => (
  <header className="relative min-h-[800px] pt-10 pb-24 font-fredoka font-bold flex flex-col justify-center items-center bg-cover bg-center"
          style={{ backgroundImage: "url('src/assets/final-bg-1.png')" }}> 
    
    <div className="container mx-auto px-60 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
      
      <div className="flex-1 space-y-6 max-w-lg mb-10 md:mb-0"> 
        <h1 className="text-5xl font-fredoka text-swirl-brown leading-[1.1]">
          your stop for
          <span className="block text-6xl font-gloock text-swirl-brown leading-[1.1]">
            <span className="text-8xl">cinnamon swirls</span>
          </span>
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

// 1. Add 'onConfirm' to the props
const OrderModal = ({ flavor, onClose, onConfirm }: { 
  flavor: any; 
  onClose: () => void; 
  onConfirm: (item: any, size: string, quantity: number) => void 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("1pc"); // Note: removed space to match your keys
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
          {/* 2. UPDATE THIS BUTTON: call onConfirm */}
          <button 
            onClick={() => onConfirm(flavor, size, quantity)} 
            className="flex-1 bg-swirl-brown text-white py-4 rounded-full font-bold shadow-lg hover:brightness-110 transition"
          >
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
  const [cart, setCart] = useState<any[]>([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const addToCart = (item: any, size: string, quantity: number) => {
    const newItem = {
      ...item,
      selectedSize: size,
      quantity,
      // Calculate price based on size if it exists, otherwise use base price
      totalPrice: (item.prices ? item.prices[size] : item.price) * quantity,
      cartId: Date.now() // unique ID for the cart list
    };
    setCart([...cart, newItem]); // This is where setCart is used!
    setIsCartOpen(true); // Automatically open the cart drawer to show the item
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId !== cartId) return item;
      const newQty = Math.max(1, item.quantity + delta);
      const unitPrice = item.prices ? item.prices[item.selectedSize] : item.price;
      return { ...item, quantity: newQty, totalPrice: unitPrice * newQty };
    }));
  };

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
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrderHistoryOpen(true)}
      />

      {view === "home" ? (
        <>
          <Header />
        </>
      ) : (
        <MenuPage onAddToCart={addToCart} />
      )}

      <Featured />
      
      <Bestsellers onSelectFlavor={setSelectedFlavor} />
      
      <SweetMoments />
      
      <Footer />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => { setIsCartOpen(false); if (user) { setIsCheckoutOpen(true); } else { setShowAuth(true); } }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          items={cart}
          total={cart.reduce((sum, item) => sum + item.totalPrice, 0)}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => { setIsCheckoutOpen(false); setCart([]); }}
          userId={user?.uid ?? ""}
        />
      )}

      {selectedFlavor && (
        <OrderModal 
          flavor={selectedFlavor} 
          onClose={() => setSelectedFlavor(null)} 
          onConfirm={(item, size, qty) => {
            addToCart(item, size, qty);
            setSelectedFlavor(null); // Close modal after adding
          }}
        />
      )}
      {isOrderHistoryOpen && user && (
        <OrderHistory userId={user.uid} onClose={() => setIsOrderHistoryOpen(false)} />
      )}
      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </div>
  );
}