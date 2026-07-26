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
import { AuthModal } from "./components/AuthModal";
import { initialUserProfile, sampleMatchedFamilies } from "./data/mockData";
import { FamilyProfile, MatchedFamily, CommunityCircle } from "./types";
import { Heart, ShieldCheck, BookOpenCheck, Globe, X, ArrowRight, Bell, MessageSquare } from "lucide-react";
import { 
  onAuthChange, 
  fetchUserProfileFromFirestore, 
  saveUserProfileToFirestore,
  subscribeToAllIncomingDirectMessages,
  deleteCommunityCircleInFirestore,
  DirectMessage,
  CustomAuthUser 
} from "./lib/firebase";
import { playNotificationChime } from "./lib/audio";

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<FamilyProfile>(initialUserProfile);
  const [sensoryMode, setSensoryMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CustomAuthUser | null>(null);

  // Notifications and Unread state
  const [incomingNotification, setIncomingNotification] = useState<DirectMessage | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Auth protection notice
  const [authNoticeReason, setAuthNoticeReason] = useState<string>("");

  // Modals
  const [selectedConnectFamily, setSelectedConnectFamily] = useState<MatchedFamily | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<CommunityCircle | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (sensoryMode) {
      document.body.classList.add("sensory-active");
    } else {
      document.body.classList.remove("sensory-active");
    }
  }, [sensoryMode]);

  // Subscribe to Firebase Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or sync profile from Firestore
        const existingProfile = await fetchUserProfileFromFirestore(user.uid, user.email || undefined);
        const isAdam = (user.email && user.email.toLowerCase().includes("adam")) || 
                       (user.displayName && user.displayName.toLowerCase().includes("adam")) ||
                       (existingProfile?.parentName && existingProfile.parentName.toLowerCase().includes("adam"));
        const expectedRole: "admin" | "user" = isAdam ? "admin" : "user";

        if (existingProfile) {
          const updatedProfile = { ...existingProfile, role: expectedRole };
          setUserProfile(updatedProfile);
          if (existingProfile.role !== expectedRole) {
            await saveUserProfileToFirestore(updatedProfile);
          }
        } else {
          // Initialize profile in Firestore for new user
          const newProf: FamilyProfile = {
            ...initialUserProfile,
            id: user.uid,
            email: user.email || "",
            role: expectedRole,
            parentName: user.displayName || user.email?.split("@")[0] || "Family Caregiver"
          };
          setUserProfile(newProf);
          await saveUserProfileToFirestore(newProf);
        }
      } else {
        // Reset to initial profile when logged out
        setUserProfile(initialUserProfile);
        setActiveTab(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to incoming real-time direct messages for instant notifications
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = subscribeToAllIncomingDirectMessages(currentUser.uid, (newMsg) => {
      playNotificationChime();
      setIncomingNotification(newMsg);
      setUnreadCount((prev) => prev + 1);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Restrict guest users from tabs 1, 2, 3, 4
  const handleNavigateTab = (tabIndex: number, labelName?: string) => {
    if (tabIndex > 0 && !currentUser) {
      setAuthNoticeReason(
        `Please sign in or create an account to access ${labelName || "Family Match & Community features"}.`
      );
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tabIndex);
  };

  const handleViewIncomingMessage = (msg: DirectMessage) => {
    // Find matching family or create dynamic family object for chat
    const foundFam = sampleMatchedFamilies.find(
      (f) => f.id === msg.senderId || f.parentNames.includes(msg.senderName)
    );

    const familyToConnect: MatchedFamily = foundFam || {
      id: msg.senderId,
      familyTitle: `${msg.senderName}'s Family`,
      parentNames: msg.senderName,
      childAge: "Special Needs Child",
      nearbyMosque: userProfile.nearbyMosque || "Local Mosque",
      distance: "Connected via Sukoon",
      supportNeeds: ["Special Needs Community"],
      interests: ["Family Connections"],
      languages: ["English"],
      preferredMode: "Chat",
      matchScore: 100,
      matchingCriteria: ["Direct Message Received"],
      bio: "Registered Sukoon community member family.",
      avatarInitials: msg.senderName.slice(0, 2).toUpperCase() || "SF",
      bgGradient: "from-[#5A8B7D] to-[#3A5D54]"
    };

    setSelectedConnectFamily(familyToConnect);
    setActiveTab(1); // Go to Family Match
    setIncomingNotification(null);
    setUnreadCount(0);
  };

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
      {/* Real-time Incoming Message Notification Banner */}
      {incomingNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-stone-900/95 text-white p-4 rounded-3xl shadow-2xl border border-amber-500/40 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#E9C46A] text-[#3A5D54] flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                <Bell className="w-4 h-4 text-[#3A5D54] animate-bounce" />
              </div>
              <div>
                <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <span>New Text Message</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {incomingNotification.senderName}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIncomingNotification(null)}
              className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-200 mt-2.5 bg-stone-800/90 p-2.5 rounded-2xl border border-stone-700/60 leading-relaxed font-normal">
            "{incomingNotification.text}"
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>{incomingNotification.timestampStr || "Just now"}</span>
            <button
              onClick={() => handleViewIncomingMessage(incomingNotification)}
              className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply / View Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => handleNavigateTab(tab)}
        userProfile={userProfile}
        sensoryMode={sensoryMode}
        setSensoryMode={setSensoryMode}
        onOpenProfileModal={() => setShowProfileModal(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setAuthNoticeReason("");
          setShowAuthModal(true);
        }}
        unreadCount={unreadCount}
        onRequireAuthForTab={(label) => handleNavigateTab(1, label)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 0 && (
          <TabHome
            onNavigateTab={(tab) => handleNavigateTab(tab)}
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
            userProfile={userProfile}
          />
        )}

        {activeTab === 3 && (
          <Tab2IslamicGuidance sensoryMode={sensoryMode} currentUser={currentUser} userProfile={userProfile} />
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
        onDeleteCircle={async (circleId) => {
          try {
            const stored = JSON.parse(localStorage.getItem("sukoon_deleted_circle_ids") || "[]");
            if (!stored.includes(circleId)) {
              stored.push(circleId);
              localStorage.setItem("sukoon_deleted_circle_ids", JSON.stringify(stored));
            }
          } catch (err) {
            console.error(err);
          }
          setSelectedCircle(null);
          await deleteCommunityCircleInFirestore(circleId);
        }}
      />

      <ProfileModal
        profile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthNoticeReason("");
        }}
        currentUser={currentUser}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        noticeReason={authNoticeReason}
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
              Real-time Firestore Messaging
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
