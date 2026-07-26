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
  Home
} from "lucide-react";
import { FamilyProfile } from "../types";

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  userProfile: FamilyProfile;
  sensoryMode: boolean;
  setSensoryMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  sensoryMode,
  setSensoryMode,
  onOpenProfileModal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 0, label: "Home", icon: Home, desc: "Overview & Sanctuary" },
    { id: 1, label: "Family Match", icon: Users, desc: "Connect with nearby families" },
    { id: 2, label: "Community Circles", icon: UserCheck, desc: "Support topics & discussions" },
    { id: 3, label: "Masjid & Rulings", icon: BookOpenCheck, desc: "Fiqh guidance & accommodations" },
    { id: 4, label: "AI Companion", icon: Bot, desc: "Scholar-backed answers & comfort" },
  ];

  const handleSelectTab = (tabId: number) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <header className="glass-header sticky top-0 z-40 transition-colors duration-300">
      {/* Top Banner Accent */}
      <div className="bg-[#5A8B7D]/10 text-[#3A5D54] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/30">
        <Sparkles className="w-3.5 h-3.5 text-[#937217] shrink-0" />
        <span>
          A compassionate, sensory-friendly sanctuary for special needs Muslim families
        </span>
        <span className="hidden md:inline-block text-[#5A8B7D]/40">•</span>
        <span className="hidden md:inline-flex items-center gap-1 text-[#3A5D54]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B7D]" />
          100% Privacy-Focused
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title - clickable to go Home */}
          <button 
            onClick={() => handleSelectTab(0)}
            className="flex items-center gap-3 text-left hover:opacity-95 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#5A8B7D] flex items-center justify-center shadow-md shadow-[#5A8B7D]/20 shrink-0">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#3A5D54] tracking-tight">
                  Sukoon Community
                </h1>
                <span className="bg-[#E9C46A]/25 text-[#937217] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#E9C46A]/40">
                  سُكُون
                </span>
              </div>
            </div>
          </button>

          {/* Right Section Controls: Hamburger Menu Trigger, Sensory Toggle, Profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSensoryMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                sensoryMode
                  ? "bg-[#E9C46A]/30 text-[#937217] border-[#E9C46A]/60 shadow-sm font-semibold"
                  : "bg-white/70 text-stone-600 border-white/80 hover:bg-white hover:text-[#5A8B7D]"
              }`}
              title="Toggle calm sensory-friendly visual style"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{sensoryMode ? "Sensory: On" : "Sensory View"}</span>
            </button>

            <button
              onClick={onOpenProfileModal}
              className="bg-white/70 hover:bg-white text-stone-800 border border-white/80 rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-2 transition-all shadow-sm hover:ring-2 hover:ring-[#5A8B7D]/40 cursor-pointer"
              title="Click to view & edit your family profile"
            >
              <div className="w-6 h-6 rounded-full bg-[#E9C46A]/30 border border-white flex items-center justify-center text-[#937217] font-bold text-[11px]">
                {userProfile.parentName.charAt(0) || "F"}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-[11px] font-bold text-stone-800 leading-none">
                  {userProfile.parentName}
                </div>
                <div className="text-[10px] text-stone-500 leading-none mt-0.5">
                  Edit Profile ⚙️
                </div>
              </div>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer ml-1"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
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
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3.5 cursor-pointer ${
                        isActive
                          ? "bg-[#5A8B7D]/10 text-[#3A5D54] font-bold border border-[#5A8B7D]/30"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isActive ? "bg-[#5A8B7D] text-white" : "bg-stone-100 text-stone-600"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-stone-500 font-normal mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
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


