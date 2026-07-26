import React, { useState } from "react";
import { 
  Users, 
  BookOpenCheck, 
  Bot, 
  Heart, 
  Sparkles, 
  Eye, 
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Home,
  User as UserIcon,
  LogIn,
  LogOut,
  Lock,
  MessageSquare,
  HeartHandshake
} from "lucide-react";
import { FamilyProfile } from "../types";
import { CustomAuthUser, logoutUser } from "../lib/firebase";

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  userProfile: FamilyProfile;
  sensoryMode: boolean;
  setSensoryMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenProfileModal: () => void;
  currentUser: CustomAuthUser | null;
  onOpenAuthModal: () => void;
  unreadCount?: number;
  onRequireAuthForTab?: (tabLabel: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  sensoryMode,
  setSensoryMode,
  onOpenProfileModal,
  currentUser,
  onOpenAuthModal,
  unreadCount = 0,
  onRequireAuthForTab
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 0, label: "Home", icon: Home, desc: "Overview & Sanctuary" },
    { id: 1, label: "Find Caregivers", icon: HeartHandshake, desc: "Trusted special needs families" },
    { id: 2, label: "Family Match", icon: Users, desc: "Connect with nearby families" },
    { id: 3, label: "Community Circles", icon: UserCheck, desc: "Support topics & discussions" },
    { id: 4, label: "Masjid & Rulings", icon: BookOpenCheck, desc: "Fiqh guidance & accommodations" },
    { id: 5, label: "AI Companion", icon: Bot, desc: "Scholar-backed answers & comfort" },
  ];

  const handleSelectTab = (tabId: number) => {
    if (tabId > 0 && !currentUser) {
      setIsMenuOpen(false);
      if (onRequireAuthForTab) {
        const item = navItems.find((n) => n.id === tabId);
        onRequireAuthForTab(item ? item.label : "this feature");
      } else {
        onOpenAuthModal();
      }
      return;
    }

    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      if (onRequireAuthForTab) {
        onRequireAuthForTab("your family profile");
      } else {
        onOpenAuthModal();
      }
      return;
    }
    onOpenProfileModal();
  };

  const handleSignOutClick = async () => {
    await logoutUser();
    setIsMenuOpen(false);
  };

  return (
    <header className="glass-header sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs transition-colors duration-300">
      {/* Top Banner Accent */}
      <div className="bg-[#E8F3F1] text-[#3A5D54] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-stone-200/80">
        <Sparkles className="w-3.5 h-3.5 text-[#937217] shrink-0" />
        <span>
          A compassionate, sensory-friendly sanctuary for special needs Muslim families
        </span>
        <span className="hidden md:inline-block text-[#5A8B7D]/40">•</span>
        <span className="hidden md:inline-flex items-center gap-1 text-[#3A5D54]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B7D]" />
          Firestore Database Sync Enabled
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title - clickable to go Home */}
          <button 
            onClick={() => handleSelectTab(0)}
            className="flex items-center gap-3 text-left hover:opacity-95 transition-opacity cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#5A8B7D] flex items-center justify-center shadow-sm shadow-[#5A8B7D]/20 shrink-0">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#3A5D54] tracking-tight">
                  Sukoon
                </h1>
                <span className="bg-[#E9C46A]/25 text-[#937217] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#E9C46A]/40">
                  سُكُون
                </span>
              </div>
            </div>
          </button>

          {/* Right Section Controls: Auth Sign-In / Sign Out Button, Sensory Toggle, Profile, Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Sign In / Sign Out Button */}
            {currentUser ? (
              <button
                onClick={handleSignOutClick}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs bg-rose-50/80 text-rose-700 border-rose-200 hover:bg-rose-100"
                title="Click to Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs bg-[#E9C46A] hover:bg-[#d9b45a] text-[#3A5D54] border-[#E9C46A] font-bold"
                title="Sign In or Sign Up"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Up</span>
              </button>
            )}

            {/* Sensory Toggle */}
            <button
              onClick={() => setSensoryMode((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                sensoryMode
                  ? "bg-[#E9C46A]/30 text-[#937217] border-[#E9C46A]/60 shadow-xs font-semibold"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-[#5A8B7D]"
              }`}
              title="Toggle calm sensory-friendly visual style"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>{sensoryMode ? "Sensory: On" : "Sensory View"}</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className="bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-full px-3.5 py-1.5 text-xs font-medium flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              title={currentUser ? "Click to view & edit your family profile" : "Sign in to create or view your profile"}
            >
              {currentUser ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-[#E9C46A]/40 border border-amber-300/60 flex items-center justify-center text-[#937217] font-extrabold text-[11px]">
                    {userProfile.parentName.charAt(0) || "U"}
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-stone-800 leading-none truncate max-w-[100px]">
                      {userProfile.parentName}
                    </div>
                    <div className="text-[10px] text-stone-500 leading-none mt-0.5 flex items-center gap-0.5">
                      <span>My Profile</span>
                      <span className="text-[9px]">⚙️</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-stone-200/90 border border-stone-300 flex items-center justify-center text-stone-600">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-stone-700 leading-none">
                      Guest / Account
                    </div>
                    <div className="text-[10px] text-stone-500 leading-none mt-0.5">
                      Sign in required
                    </div>
                  </div>
                </>
              )}
            </button>

            {/* Menu Button - Always visible in full screen and mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="bg-[#386256] hover:bg-[#2F5A4F] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ml-1 relative"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side Hamburger Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#5A8B7D] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-stone-900 text-base leading-tight">Navigation</h2>
                    <p className="text-[11px] text-stone-500">Sukoon Sanctuary</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLocked = item.id > 0 && !currentUser;
                  const isFamilyMatch = item.id === 2;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3.5 cursor-pointer relative ${
                        isActive
                          ? "bg-[#5A8B7D]/10 text-[#3A5D54] font-bold border border-[#5A8B7D]/30"
                          : isLocked
                          ? "text-stone-500 hover:bg-stone-50"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isActive 
                          ? "bg-[#5A8B7D] text-white" 
                          : isLocked 
                          ? "bg-stone-200 text-stone-500" 
                          : "bg-stone-100 text-stone-600"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold flex items-center justify-between gap-1">
                          <span className="truncate">{item.label}</span>
                          {isLocked && (
                            <span className="text-[10px] bg-stone-200 text-stone-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <Lock className="w-3 h-3 text-stone-500" />
                              Sign-in
                            </span>
                          )}
                          {isFamilyMatch && unreadCount > 0 && (
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                              <MessageSquare className="w-3 h-3" />
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 font-normal mt-0.5 truncate">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
              {currentUser ? (
                <button
                  onClick={handleSignOutClick}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-700" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Sign Up</span>
                </button>
              )}

              <div className="bg-[#E9C46A]/20 p-3 rounded-2xl border border-[#E9C46A]/40 text-xs text-[#937217] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>"With hardship comes ease" • Quran 94:6</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
