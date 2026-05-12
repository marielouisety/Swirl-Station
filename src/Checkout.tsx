import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", icon: "💙" },
  { id: "maya", label: "Maya", icon: "💚" },
  { id: "bank", label: "BPI / UnionBank", icon: "🏦" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function CheckoutModal({ items, total, onClose, onSuccess, userId }: {
  items: any[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}) {
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDetailsNext = () => {
    if (validate()) setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;
    await addDoc(collection(db, "orders"), {
      uid: userId,
      items,
      total,
      paymentMethod,
      delivery: form,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
    setStep("confirm");
  };

  if (step === "confirm") {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-swirl-cream w-full max-w-md rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-swirl-brown mb-2">Order Placed!</h2>
          <p className="text-swirl-brown/70 font-medium mb-1">Thank you, <span className="font-black text-swirl-brown">{form.name}</span>!</p>
          <p className="text-swirl-brown/60 font-medium text-sm mb-6">We'll contact you at <span className="font-bold">{form.phone}</span> to confirm your order.</p>
          <div className="w-full bg-white rounded-2xl p-4 mb-6 text-left space-y-1 border border-swirl-brown/10">
            {items.map((item: any) => (
              <div key={item.cartId} className="flex justify-between text-sm font-bold text-swirl-brown">
                <span>{item.name} <span className="font-medium text-swirl-brown/50">× {item.quantity}</span></span>
                <span>₱{item.totalPrice}</span>
              </div>
            ))}
            <div className="border-t border-swirl-brown/10 pt-2 mt-2 flex justify-between font-black text-swirl-brown">
              <span>Total</span>
              <span>₱{total}</span>
            </div>
          </div>
          <button
            onClick={onSuccess}
            className="w-full bg-swirl-brown text-white py-4 rounded-full font-black shadow-lg hover:brightness-110 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-swirl-cream w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-swirl-brown px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase">Checkout</h2>
            <p className="text-swirl-cream/60 text-xs font-bold uppercase tracking-widest mt-0.5">
              {step === "details" ? "Step 1 — Delivery Details" : "Step 2 — Payment"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl transition">✕</button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-4 mb-6 space-y-2 border border-swirl-brown/10">
            {items.map((item: any) => (
              <div key={item.cartId} className="flex justify-between text-sm font-bold text-swirl-brown">
                <span>{item.name} <span className="font-medium text-swirl-brown/50 uppercase text-xs">{item.selectedSize} × {item.quantity}</span></span>
                <span>₱{item.totalPrice}</span>
              </div>
            ))}
            <div className="border-t border-swirl-brown/10 pt-2 flex justify-between font-black text-swirl-brown">
              <span>Total</span>
              <span>₱{total}</span>
            </div>
          </div>

          {step === "details" && (
            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", placeholder: "e.g. Juan Dela Cruz", type: "text" },
                { key: "phone", label: "Phone Number", placeholder: "e.g. 09XX XXX XXXX", type: "tel" },
                { key: "address", label: "Delivery Address", placeholder: "Street, Barangay, City", type: "text" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-black text-swirl-brown/60 uppercase tracking-widest mb-1 block">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className={`w-full bg-white border-2 rounded-2xl px-5 py-3 font-bold text-swirl-brown outline-none transition placeholder:text-swirl-brown/20 ${errors[key] ? "border-red-400" : "border-swirl-brown/10 focus:border-swirl-brown"}`}
                  />
                  {errors[key] && <p className="text-red-400 text-xs font-bold mt-1">{errors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs font-black text-swirl-brown/60 uppercase tracking-widest mb-1 block">Order Note <span className="normal-case font-medium">(optional)</span></label>
                <textarea
                  placeholder="Any special requests?"
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full bg-white border-2 border-swirl-brown/10 focus:border-swirl-brown rounded-2xl px-5 py-3 font-bold text-swirl-brown outline-none transition placeholder:text-swirl-brown/20 resize-none"
                />
              </div>
              <button
                onClick={handleDetailsNext}
                className="w-full bg-swirl-brown text-white py-4 rounded-full font-black shadow-lg hover:brightness-110 transition mt-2"
              >
                Continue to Payment ➔
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-3">
              <p className="text-xs font-black text-swirl-brown/60 uppercase tracking-widest mb-4">Select Payment Method</p>
              {PAYMENT_METHODS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 font-bold text-swirl-brown transition ${paymentMethod === id ? "border-swirl-brown bg-swirl-brown text-white" : "border-swirl-brown/10 bg-white hover:border-swirl-brown/40"}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                  {paymentMethod === id && <span className="ml-auto">✓</span>}
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 border-2 border-swirl-brown/20 text-swirl-brown py-4 rounded-full font-black hover:border-swirl-brown transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod}
                  className="flex-1 bg-swirl-brown text-white py-4 rounded-full font-black shadow-lg hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
