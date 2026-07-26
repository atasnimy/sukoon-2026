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
  CheckCircle2
} from "lucide-react";
import { FamilyProfile, AgeRange, SupportNeed, CommMode } from "../types";

interface ProfileModalProps {
  profile: FamilyProfile;
  onSaveProfile: (updated: FamilyProfile) => void;
  isOpen: boolean;
  onClose: () => void;
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
  onClose
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
      parentName: parentName.trim() || profile.parentName,
      cityRegion: cityRegion.trim() || profile.cityRegion,
      childAge,
      nearbyMosque: nearbyMosque.trim() || "Local Masjid",
      commMode,
      supportNeeds,
      languages,
      interests,
      isLocationPrivate
    };

    onSaveProfile(updated);
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel border border-white/80 rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 bg-[#3A5D54] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl border border-white/30 text-white">
              {parentName.charAt(0) || "F"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E9C46A] text-[#3A5D54] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Family Profile
                </span>
                {isEditing && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Editing Mode
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mt-0.5">{parentName}</h3>
              <p className="text-xs text-white/90">{cityRegion} • {nearbyMosque}</p>
            </div>
          </div>
        </div>

        {/* Save Confirmation Toast */}
        {showSaveToast && (
          <div className="bg-[#5A8B7D] text-white p-3 px-5 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Profile successfully updated! Matches are refreshed.</span>
          </div>
        )}

        {/* Main Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-700">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-white/90 space-y-3">
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 font-medium">Parent/Caregiver Name:</span>
                  <strong className="text-stone-800">{parentName}</strong>
                </div>

                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 font-medium">Location / Region:</span>
                  <strong className="text-stone-800">{cityRegion}</strong>
                </div>

                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 font-medium">Child's Age Range:</span>
                  <strong className="text-stone-800">{childAge} years old</strong>
                </div>

                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 font-medium">Nearby Mosque:</span>
                  <strong className="text-stone-800">{nearbyMosque}</strong>
                </div>

                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 font-medium">Preferred Communication:</span>
                  <strong className="text-stone-800">{commMode}</strong>
                </div>

                <div className="pt-1 space-y-1">
                  <span className="text-stone-500 font-medium block">Support Needs / Diagnoses:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {supportNeeds.map((need, idx) => (
                      <span
                        key={idx}
                        className="bg-[#5A8B7D]/15 text-[#3A5D54] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#5A8B7D]/30"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 space-y-1">
                  <span className="text-stone-500 font-medium block">Languages Spoken:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-200/60 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-lg"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 space-y-1">
                  <span className="text-stone-500 font-medium block">Interests & Preferences:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((int, idx) => (
                      <span
                        key={idx}
                        className="bg-[#E9C46A]/20 text-[#937217] text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-[#E9C46A]/40"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#5A8B7D]/10 border border-[#5A8B7D]/30 rounded-2xl p-3.5 text-xs text-[#3A5D54] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5A8B7D] shrink-0" />
                <span>
                  {isLocationPrivate
                    ? "Location privacy enabled: Exact address hidden."
                    : "Standard distance visibility enabled."}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all"
                >
                  <Edit3 className="w-4 h-4 text-amber-200" />
                  <span>Edit Profile Details</span>
                </button>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-3">
                {/* Parent Name */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Parent / Caregiver Name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-none bg-stone-100/80 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* City / Region */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={cityRegion}
                    onChange={(e) => setCityRegion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-none bg-stone-100/80 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
                    placeholder="e.g. Westside, Chicago"
                  />
                </div>

                {/* Child Age */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Child's Age Bracket
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value as AgeRange)}
                    className="w-full p-2.5 rounded-xl border-none bg-stone-100/80 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
                  >
                    <option value="3-5">3 - 5 years old (Early Intervention)</option>
                    <option value="6-9">6 - 9 years old (Primary School)</option>
                    <option value="10-13">10 - 13 years old (Pre-Teens)</option>
                    <option value="14+">14+ years old (Teens & Young Adults)</option>
                  </select>
                </div>

                {/* Nearby Mosque */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Nearby Mosque / Islamic Center
                  </label>
                  <input
                    type="text"
                    value={nearbyMosque}
                    onChange={(e) => setNearbyMosque(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-none bg-stone-100/80 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
                    placeholder="e.g. Masjid Al-Noor"
                  />
                </div>

                {/* Preferred Comm Mode */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Preferred Communication Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Chat", "Email", "Video"] as CommMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCommMode(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          commMode === m
                            ? "bg-[#5A8B7D] text-white shadow-sm"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Support Needs Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Support Needs / Diagnoses
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SUPPORT_NEEDS.map((need) => {
                      const selected = supportNeeds.includes(need);
                      return (
                        <button
                          key={need}
                          type="button"
                          onClick={() => toggleNeed(need)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                            selected
                              ? "bg-[#5A8B7D] text-white shadow-2xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {selected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-stone-400" />}
                          <span>{need}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Languages Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_LANGUAGES.map((lang) => {
                      const selected = languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLang(lang)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
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
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
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
                      Hide exact street address (show region/distance only)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all"
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

