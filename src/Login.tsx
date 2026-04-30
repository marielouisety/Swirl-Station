import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup 
} from "firebase/auth";

const AuthPage = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent to your email!");
        setIsForgotPassword(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 font-fredoka">
      <div className="bg-swirl-cream w-full max-w-md p-10 rounded-[40px] shadow-2xl relative border-4 border-swirl-brown/5">
        <button onClick={onClose} className="absolute top-6 right-6 text-swirl-brown text-xl hover:rotate-90 transition">✕</button>
        
        <div className="text-center mb-8">
          <img src="src/assets/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-swirl-brown uppercase tracking-tight">
            {isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back!" : "Join the Swirl"}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full px-6 py-4 rounded-2xl border-2 border-swirl-brown/10 focus:border-swirl-brown outline-none bg-white/50"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {!isForgotPassword && (
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-swirl-brown/10 focus:border-swirl-brown outline-none bg-white/50"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {error && <p className="text-red-500 text-xs px-2 font-medium">{error}</p>}

          <button className="w-full bg-swirl-brown text-white py-4 rounded-full font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition">
            {isForgotPassword ? "Send Link" : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          {!isForgotPassword && (
            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 border-2 border-swirl-brown/10 py-4 rounded-full font-bold hover:bg-white transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
              Continue with Google
            </button>
          )}

          <div className="text-swirl-brown text-sm font-medium">
            {isForgotPassword ? (
              <button onClick={() => setIsForgotPassword(false)} className="underline decoration-2">Back to Login</button>
            ) : (
              <>
                {isLogin ? "New to Swirl Station? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-bold underline decoration-2"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </>
            )}
          </div>

          {isLogin && !isForgotPassword && (
            <button 
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-swirl-brown/60 text-xs uppercase tracking-widest font-bold hover:text-swirl-brown transition"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;