import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Sparkles, 
  Edit3, 
  Check, 
  Plus, 
  Save, 
  User, 
  Building2,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { FamilyProfile, AgeRange, SupportNeed, CommMode } from "../types";
import { saveUserProfileToFirestore, logoutUser, CustomAuthUser } from "../lib/firebase";

interface ProfileModalProps {
  profile: FamilyProfile;
  onSaveProfile: (updated: FamilyProfile) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CustomAuthUser | null;
  onSignOut?: () => void;
}

const ALL_SUPPORT_NEEDS: SupportNeed[] = [
  "Autism",
  "ADHD",
  "Down Syndrome",
  "Non-verbal",
  "Sensory Sensitivity",
  "Cerebral Palsy",
  "Global Developmental Delay"
];

const ALL_LANGUAGES = ["English", "Arabic", "Urdu", "Somali", "Bengali", "Turkish", "French"];

const ALL_INTERESTS = [
  "Quran classes",
  "Sensory-friendly events",
  "Playgroups",
  "Caregiver Meetups",
  "Sports & Fitness",
  "Masjid Advocacy"
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onSaveProfile,
  isOpen,
  onClose,
  currentUser,
  onSignOut
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);

  // Editable state initialized from profile prop
  const [parentName, setParentName] = useState<string>(profile.parentName);
  const [cityRegion, setCityRegion] = useState<string>(profile.cityRegion);
  const [childAge, setChildAge] = useState<AgeRange>(profile.childAge);
  const [nearbyMosque, setNearbyMosque] = useState<string>(profile.nearbyMosque);
  const [commMode, setCommMode] = useState<CommMode>(profile.commMode);
  const [supportNeeds, setSupportNeeds] = useState<SupportNeed[]>(profile.supportNeeds);
  const [languages, setLanguages] = useState<string[]>(profile.languages);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [isLocationPrivate, setIsLocationPrivate] = useState<boolean>(profile.isLocationPrivate);
  const [role, setRole] = useState<"admin" | "user">(profile.role || "admin");

  useEffect(() => {
    if (isOpen) {
      setParentName(profile.parentName);
      setCityRegion(profile.cityRegion);
      setChildAge(profile.childAge);
      setNearbyMosque(profile.nearbyMosque);
      setCommMode(profile.commMode);
      setSupportNeeds(profile.supportNeeds);
      setLanguages(profile.languages);
      setInterests(profile.interests);
      setIsLocationPrivate(profile.isLocationPrivate);
      setRole(profile.role || "admin");
      setIsEditing(false);
      setShowSaveToast(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const toggleNeed = (need: SupportNeed) => {
    if (supportNeeds.includes(need)) {
      setSupportNeeds(supportNeeds.filter((n) => n !== need));
    } else {
      setSupportNeeds([...supportNeeds, need]);
    }
  };

  const toggleLang = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FamilyProfile = {
      ...profile,
      parentName,
      cityRegion,
      childAge,
      nearbyMosque,
      commMode,
      supportNeeds,
      languages,
      interests,
      isLocationPrivate,
      role
    };

    onSaveProfile(updated);
    saveUserProfileToFirestore(updated).catch(err => console.error("Error saving profile to Firestore:", err));
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSignOut = async () => {
    await logoutUser();
    if (onSignOut) onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-[32px] max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 relative">
        
        {/* Toast alert */}
        {showSaveToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#3A5D54] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Family Profile updated & synced to Firestore!</span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 bg-[#3A5D54] text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E9C46A]/20 border border-[#E9C46A]/40 flex items-center justify-center text-[#E9C46A] font-bold text-2xl shadow-inner">
              {profile.parentName.charAt(0) || "F"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {profile.parentName}'s Family Profile
                </h3>
                <span className="bg-[#E9C46A] text-[#3A5D54] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
                <span>🕌 {profile.nearbyMosque}</span>
                <span>•</span>
                <span>📍 {profile.cityRegion}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          
          {/* VIEW MODE */}
          {!isEditing ? (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#5A8B7D]" />
                    Family Compatibility Info
                  </h4>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium block">Parent / Caregiver Name:</span>
                    <span className="font-bold text-stone-800">{profile.parentName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Region / City:</span>
                    <span className="font-bold text-stone-800">{profile.cityRegion}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Child's Age Bracket:</span>
                    <span className="font-bold text-stone-800">{profile.childAge} years old</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Primary Mosque Community:</span>
                    <span className="font-bold text-[#3A5D54]">{profile.nearbyMosque}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Preferred Communication:</span>
                    <span className="font-bold text-stone-800">{profile.commMode}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Privacy Setting:</span>
                    <span className="font-semibold text-emerald-700">
                      {profile.isLocationPrivate ? "Private Address (City only)" : "Public Region"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Account Access Role:</span>
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] mt-0.5 ${
                      profile.role === "admin"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-stone-100 text-stone-800 border border-stone-200"
                    }`}>
                      {profile.role === "admin" ? "🛡️ Sukoon Administrator" : "👤 Member Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Needs */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Family Support & Diagnostic Needs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.supportNeeds.map((need) => (
                    <span
                      key={need}
                      className="bg-[#5A8B7D]/10 text-[#3A5D54] text-xs font-semibold px-3 py-1 rounded-full border border-[#5A8B7D]/20"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages & Interests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Spoken Languages:</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.languages.map((l) => (
                      <span key={l} className="bg-stone-100 text-stone-700 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Community Interests:</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map((i) => (
                      <span key={i} className="bg-[#E9C46A]/20 text-[#937217] text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign Out Option inside Profile */}
              {currentUser && (
                <div className="pt-2 border-t border-stone-200">
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-700" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* EDIT MODE FORM */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
                  Update Matching & Profile Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Parent / Caregiver Name
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={cityRegion}
                      onChange={(e) => setCityRegion(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Child's Age Bracket
                    </label>
                    <select
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value as AgeRange)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] font-medium"
                    >
                      <option value="3-5">3-5 years old</option>
                      <option value="6-9">6-9 years old</option>
                      <option value="10-13">10-13 years old</option>
                      <option value="14+">14+ years old</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Primary Nearby Mosque
                    </label>
                    <input
                      type="text"
                      value={nearbyMosque}
                      onChange={(e) => setNearbyMosque(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] font-medium"
                      placeholder="e.g. Masjid Al-Noor"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Preferred Communication Mode
                    </label>
                    <select
                      value={commMode}
                      onChange={(e) => setCommMode(e.target.value as CommMode)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] font-medium"
                    >
                      <option value="In-person playdates & mosque meetups">In-person playdates & mosque meetups</option>
                      <option value="Online chat & messaging only">Online chat & messaging only</option>
                      <option value="Phone calls & parent advice">Phone calls & parent advice</option>
                      <option value="Flexible depending on sensory energy">Flexible depending on sensory energy</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                      Account Role & Access Rights
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as "admin" | "user")}
                        className="p-2 rounded-lg border border-amber-300 bg-white font-bold text-xs text-amber-900 focus:ring-2 focus:ring-[#5A8B7D] shrink-0 cursor-pointer"
                      >
                        <option value="admin">🛡️ Sukoon Administrator</option>
                        <option value="user">👤 Member Account</option>
                      </select>
                      <span className="text-[11px] text-amber-800 font-medium">
                        {role === "admin"
                          ? "Admins can create and remove Community Circles, Community Centers, and Islamic Fiqh Guidance records."
                          : "Regular members can join community circles and connect with families."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Support Needs Checkboxes */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Support Needs (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SUPPORT_NEEDS.map((need) => {
                      const selected = supportNeeds.includes(need);
                      return (
                        <button
                          key={need}
                          type="button"
                          onClick={() => toggleNeed(need)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                            selected
                              ? "bg-[#5A8B7D] text-white shadow-2xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-stone-400" />}
                          <span>{need}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Spoken Languages */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Spoken Languages
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_LANGUAGES.map((lang) => {
                      const selected = languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLang(lang)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                            selected
                              ? "bg-[#E9C46A]/30 text-[#937217] font-bold border border-[#E9C46A]/50"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 text-[#937217]" />}
                          <span>{lang}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interests Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Interests & Gathering Preferences
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_INTERESTS.map((interest) => {
                      const selected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                            selected
                              ? "bg-[#3A5D54] text-white shadow-2xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {selected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-stone-400" />}
                          <span>{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLocationPrivate}
                      onChange={(e) => setIsLocationPrivate(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A8B7D] focus:ring-[#5A8B7D] border-stone-300"
                    />
                    <span className="text-xs text-stone-600 font-medium">
                      Hide exact address (show region/distance only)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-200" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
