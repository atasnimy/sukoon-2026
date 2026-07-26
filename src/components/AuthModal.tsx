import { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser,
  CustomAuthUser 
} from "../lib/firebase";
import { FamilyProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomAuthUser | null;
  userProfile: FamilyProfile;
  setUserProfile: (profile: FamilyProfile) => void;
  noticeReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userProfile,
  setUserProfile,
  noticeReason
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentName, setParentName] = useState(userProfile.parentName || "");
  const [mosque, setMosque] = useState(userProfile.nearbyMosque || "Masjid Al-Noor");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      setSuccessMsg("Successfully signed in! Welcome back to Sukoon.");
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Auth error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setErrorMsg("Incorrect email or password. Please try again or sign up.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("Invalid email address format.");
      } else {
        setErrorMsg(err.message || "Failed to sign in. Please try again.");
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const newProfileData: Omit<FamilyProfile, "id"> = {
        ...userProfile,
        parentName: parentName.trim() || "Family Caregiver",
        nearbyMosque: mosque.trim() || "Local Masjid"
      };

      const user = await registerWithEmail(email, password, newProfileData);
      
      setUserProfile({
        ...newProfileData,
        id: user.uid
      });

      setSuccessMsg("Account created successfully! Your family profile is saved to the database.");
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("An account with this email already exists. Try signing in instead.");
      } else {
        setErrorMsg(err.message || "Failed to create account.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setSuccessMsg("Signed out successfully.");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg("Failed to sign out.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#3A5D54] to-[#5A8B7D] text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sukoon Account & Firestore</span>
            </div>
            <h2 className="text-xl font-bold mt-1">
              {currentUser ? "Your Account" : mode === "signin" ? "Sign In to Sukoon" : "Create Family Account"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!currentUser && noticeReason && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span className="font-medium">{noticeReason}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Logged In View */}
          {currentUser ? (
            <div className="space-y-5 text-stone-800">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5A8B7D] text-white flex items-center justify-center font-bold text-lg">
                    {userProfile.parentName.charAt(0) || "F"}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{userProfile.parentName || "Family Member"}</div>
                    <div className="text-xs text-stone-500">{currentUser.email || "Guest User (Anonymous)"}</div>
                  </div>
                </div>

                <div className="text-xs text-stone-600 pt-2 border-t border-stone-200/80 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-400">Local Mosque:</span>{" "}
                    <span className="font-medium text-stone-800">{userProfile.nearbyMosque}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Child Age:</span>{" "}
                    <span className="font-medium text-stone-800">{userProfile.childAge}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#5A8B7D]/10 text-[#3A5D54] text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5A8B7D]" />
                  <span>Real-time Sync Active</span>
                </p>
                <p className="text-stone-600 text-[11px]">
                  Your family match chats and community circle activity are synced in real-time to the database.
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Account</span>
              </button>
            </div>
          ) : (
            /* Sign In or Sign Up Form */
            <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Parent / Family Name(s)
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Mariam & Yusuf"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Primary Local Mosque
                    </label>
                    <input
                      type="text"
                      value={mosque}
                      onChange={(e) => setMosque(e.target.value)}
                      placeholder="e.g. Masjid Al-Noor"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mode Toggle */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-[#5A8B7D] hover:underline font-semibold cursor-pointer"
                >
                  {mode === "signin"
                    ? "Don't have an account yet? Create one here"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
