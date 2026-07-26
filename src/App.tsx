import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TabHome } from "./components/TabHome";
import { Tab1FamilyMatching } from "./components/Tab1FamilyMatching";
import { TabCommunityCircles } from "./components/TabCommunityCircles";
import { Tab2IslamicGuidance } from "./components/Tab2IslamicGuidance";
import { Tab3AICompanion } from "./components/Tab3AICompanion";
import { ConnectModal } from "./components/ConnectModal";
import { CircleModal } from "./components/CircleModal";
import { ProfileModal } from "./components/ProfileModal";
import { initialUserProfile } from "./data/mockData";
import { FamilyProfile, MatchedFamily, CommunityCircle } from "./types";
import { Heart, ShieldCheck, BookOpenCheck, Globe } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<FamilyProfile>(initialUserProfile);
  const [sensoryMode, setSensoryMode] = useState<boolean>(false);

  useEffect(() => {
    if (sensoryMode) {
      document.body.classList.add("sensory-active");
    } else {
      document.body.classList.remove("sensory-active");
    }
  }, [sensoryMode]);

  // Modals
  const [selectedConnectFamily, setSelectedConnectFamily] = useState<MatchedFamily | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<CommunityCircle | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const handleToggleJoinCircleFromModal = (circleId: string) => {
    setSelectedCircle((prev) => {
      if (!prev || prev.id !== circleId) return prev;
      const nextState = !prev.isJoined;
      return {
        ...prev,
        isJoined: nextState,
        memberCount: nextState ? prev.memberCount + 1 : prev.memberCount - 1
      };
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        sensoryMode ? "leading-relaxed text-stone-900" : ""
      }`}
    >
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        sensoryMode={sensoryMode}
        setSensoryMode={setSensoryMode}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 0 && (
          <TabHome
            onNavigateTab={(tab) => setActiveTab(tab)}
            sensoryMode={sensoryMode}
          />
        )}

        {activeTab === 1 && (
          <Tab1FamilyMatching
            userProfile={userProfile}
            onOpenConnectModal={(fam) => setSelectedConnectFamily(fam)}
            onOpenProfileModal={() => setShowProfileModal(true)}
            sensoryMode={sensoryMode}
          />
        )}

        {activeTab === 2 && (
          <TabCommunityCircles
            onOpenCircleModal={(circle) => setSelectedCircle(circle)}
            sensoryMode={sensoryMode}
          />
        )}

        {activeTab === 3 && (
          <Tab2IslamicGuidance sensoryMode={sensoryMode} />
        )}

        {activeTab === 4 && (
          <Tab3AICompanion userProfile={userProfile} sensoryMode={sensoryMode} />
        )}
      </main>

      {/* Modals */}
      <ConnectModal
        family={selectedConnectFamily}
        userProfile={userProfile}
        onClose={() => setSelectedConnectFamily(null)}
      />

      <CircleModal
        circle={selectedCircle}
        userProfile={userProfile}
        onClose={() => setSelectedCircle(null)}
        onToggleJoin={handleToggleJoinCircleFromModal}
      />

      <ProfileModal
        profile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/40 text-stone-600 mt-12 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#3A5D54] font-bold text-base">
              <div className="w-5 h-5 rounded-full bg-[#5A8B7D] flex items-center justify-center text-white">
                <Heart className="w-3 h-3 fill-white" />
              </div>
              <span>Sukoon Community • سُكُون</span>
            </div>
            <p className="text-stone-500 text-[11px] max-w-md">
              A compassionate digital sanctuary built for special needs Muslim families. Emphasizing scholarly Yusr (Ease), dignity, and peer solidarity.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-500 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-[#3A5D54]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B7D]" />
              Encrypted Private Messaging
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-[#3A5D54]">
              <BookOpenCheck className="w-3.5 h-3.5 text-[#937217]" />
              Authentic Fiqh References
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-[#3A5D54]">
              <Globe className="w-3.5 h-3.5 text-[#5A8B7D]" />
              Sensory-Friendly Design
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-stone-200/60 mt-6 pt-4 text-center text-stone-400 text-[10px] font-medium">
          May Allah reward every caregiver with peace, strength, and continuous barakah. Aameen.
        </div>
      </footer>
    </div>
  );
}

