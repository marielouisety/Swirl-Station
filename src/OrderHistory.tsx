import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function OrderHistory({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "orders"),
        where("uid", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-fredoka">
      <div className="bg-swirl-cream w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        <div className="bg-swirl-brown px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase">My Orders</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl transition">✕</button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {loading ? (
            <p className="text-center text-swirl-brown/40 font-bold py-10">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🌀</div>
              <p className="font-black text-swirl-brown">No orders yet!</p>
              <p className="text-swirl-brown/50 font-medium text-sm mt-1">Your order history will appear here.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-swirl-brown/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-swirl-brown/40 uppercase tracking-widest">
                      {order.createdAt?.toDate().toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs font-bold text-swirl-brown/40 uppercase mt-0.5">
                      via {order.paymentMethod}
                    </p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm font-bold text-swirl-brown">
                      <span>{item.name} <span className="font-medium text-swirl-brown/40 uppercase text-xs">{item.selectedSize} × {item.quantity}</span></span>
                      <span>₱{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-swirl-brown/10 pt-2 flex justify-between font-black text-swirl-brown">
                  <span>Total</span>
                  <span>₱{order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
