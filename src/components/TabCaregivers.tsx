import React, { useState, useRef } from "react";
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  BadgeCheck, 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  CheckCircle2, 
  Filter, 
  User, 
  X, 
  Bot, 
  Phone, 
  Mail, 
  ChevronRight, 
  Sparkles, 
  UserCheck, 
  Award, 
  HeartHandshake, 
  MessageSquare, 
  Check, 
  Landmark, 
  ArrowRight, 
  SlidersHorizontal,
  Send
} from "lucide-react";
import { CaregiverProfile, CaregiverReview } from "../types";
import { sampleCaregivers } from "../data/mockCaregivers";

interface TabCaregiversProps {
  sensoryMode: boolean;
  onNavigateTab: (tabIndex: number) => void;
  onOpenAiWithPrompt?: (promptText: string) => void;
}

export const TabCaregivers: React.FC<TabCaregiversProps> = ({
  sensoryMode,
  onNavigateTab,
  onOpenAiWithPrompt
}) => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [distanceRadius, setDistanceRadius] = useState<number>(25);
  
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([]);
  const [selectedCareNeeded, setSelectedCareNeeded] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [genderPref, setGenderPref] = useState<string>("Any");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [modePref, setModePref] = useState<string>("Any");

  // Modals state
  const [selectedCaregiver, setSelectedCaregiver] = useState<CaregiverProfile | null>(null);
  const [contactCaregiver, setContactCaregiver] = useState<CaregiverProfile | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<CaregiverProfile | null>(null);

  // Form states
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // Booking Form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingCareType, setBookingCareType] = useState("Respite Care");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Apply Form state
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyLocation, setApplyLocation] = useState("");
  const [applyBio, setApplyBio] = useState("");
  const [applySubmitted, setApplySubmitted] = useState(false);

  const searchSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const disabilityOptions = [
    "Autism",
    "ADHD",
    "Down Syndrome",
    "Cerebral Palsy",
    "Intellectual Disability",
    "Physical Disability",
    "Sensory Processing Disorder",
    "Other"
  ];

  const careNeededOptions = [
    "Babysitting",
    "Respite Care",
    "Personal Care",
    "Behavioral Support",
    "Transportation",
    "Homework Help",
    "Overnight Care"
  ];

  const languageOptions = [
    "English",
    "Arabic",
    "Urdu",
    "Bengali",
    "Somali",
    "Turkish",
    "Other"
  ];

  const dayOptions = ["Weekdays", "Weekends", "Mornings", "Evenings", "Flexible"];

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocationSearch("");
    setDistanceRadius(25);
    setSelectedDisabilities([]);
    setSelectedCareNeeded([]);
    setSelectedLanguages([]);
    setGenderPref("Any");
    setSelectedDays([]);
    setModePref("Any");
  };

  // Filter caregiver logic
  const filteredCaregivers = sampleCaregivers.filter((cg) => {
    // 1. Text term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matches = 
        cg.name.toLowerCase().includes(term) ||
        cg.title.toLowerCase().includes(term) ||
        cg.shortBio.toLowerCase().includes(term) ||
        cg.city.toLowerCase().includes(term);
      if (!matches) return false;
    }

    // 2. Location & distance
    if (locationSearch.trim()) {
      const locTerm = locationSearch.toLowerCase();
      const locMatches = 
        cg.location.toLowerCase().includes(locTerm) ||
        cg.zipCode.includes(locTerm) ||
        cg.city.toLowerCase().includes(locTerm);
      if (!locMatches) return false;
    }

    if (cg.distanceMiles > distanceRadius) {
      return false;
    }

    // 3. Gender
    if (genderPref !== "Any" && cg.gender !== genderPref) {
      return false;
    }

    // 4. Mode
    if (modePref !== "Any") {
      if (modePref === "In-Person" && cg.mode === "Virtual") return false;
      if (modePref === "Virtual" && cg.mode === "In-Person") return false;
    }

    // 5. Disabilities
    if (selectedDisabilities.length > 0) {
      const hasAnyDisability = selectedDisabilities.some((d) =>
        cg.disabilitiesSupported.includes(d)
      );
      if (!hasAnyDisability) return false;
    }

    // 6. Care Needed
    if (selectedCareNeeded.length > 0) {
      const hasAnyCare = selectedCareNeeded.some((c) =>
        cg.servicesProvided.includes(c)
      );
      if (!hasAnyCare) return false;
    }

    // 7. Languages
    if (selectedLanguages.length > 0) {
      const hasAnyLang = selectedLanguages.some((l) =>
        cg.languagesSpoken.includes(l)
      );
      if (!hasAnyLang) return false;
    }

    // 8. Days
    if (selectedDays.length > 0) {
      const hasAnyDay = selectedDays.some((day) =>
        cg.availableDays.includes(day)
      );
      if (!hasAnyDay) return false;
    }

    return true;
  });

  const activeFilterCount = 
    (searchTerm ? 1 : 0) +
    (locationSearch ? 1 : 0) +
    selectedDisabilities.length +
    selectedCareNeeded.length +
    selectedLanguages.length +
    (genderPref !== "Any" ? 1 : 0) +
    selectedDays.length +
    (modePref !== "Any" ? 1 : 0);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactMessage("");
      setContactCaregiver(null);
    }, 2000);
  };

  const handleSendBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingDate("");
      setBookingTime("");
      setBookingNotes("");
      setShowBookingModal(null);
    }, 2200);
  };

  const handleSendApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setApplyName("");
      setApplyEmail("");
      setApplyPhone("");
      setApplyLocation("");
      setApplyBio("");
      setShowApplyModal(false);
    }, 2200);
  };

  const handleAskAiAboutCaregivers = () => {
    if (onOpenAiWithPrompt) {
      onOpenAiWithPrompt("How can I evaluate and choose the right special needs caregiver for my child with Autism and sensory sensitivities within a Muslim community context?");
    } else {
      onNavigateTab(5); // AI Companion tab
    }
  };

  return (
    <div className={`space-y-10 animate-in fade-in duration-300 ${sensoryMode ? "max-w-4xl mx-auto" : ""}`}>
      {/* 1. HERO SECTION (Image 1 Style) */}
      <section className={`rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 transition-all relative overflow-hidden flex flex-col justify-center min-h-[220px] ${
        sensoryMode 
          ? "bg-[#2F5A4F] border-3 border-stone-800 text-white shadow-none space-y-6" 
          : "bg-[#386256] text-white shadow-xl space-y-6"
      }`}>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="border border-[#E0BC68]/60 bg-[#E0BC68]/15 text-[#E0BC68] px-3.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E0BC68]" />
            <span>Trusted Special Needs Caregiver Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Find a Trusted Caregiver
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
            Connect with compassionate, experienced caregivers who understand the unique needs of Muslim families and children with disabilities.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={handleScrollToSearch}
            className="bg-[#E5BE6B] hover:bg-[#d4ad5a] text-stone-900 font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer text-sm shadow-md transition-all"
          >
            <Search className="w-4 h-4 text-stone-900" />
            <span>Search Caregivers</span>
          </button>

          <button
            onClick={() => setShowApplyModal(true)}
            className="border border-white/40 bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer text-sm transition-all"
          >
            <UserCheck className="w-4 h-4 text-white" />
            <span>Apply as a Caregiver</span>
          </button>
        </div>
      </section>

      {/* 2. SEARCH & FILTERS SECTION (Image 2 Style) */}
      <section ref={searchSectionRef} className="space-y-4 scroll-mt-24">
        {/* Header bar above card */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A4B42] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#2A4B42]" />
              <span>Find Caregivers Near You</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter by location, disability experience, care type, language, and availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-stone-500 hover:text-stone-800 underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
            <span className="bg-[#E2F0EC] text-[#2A4B42] px-4 py-1.5 rounded-full font-bold text-xs border border-[#2A4B42]/15 inline-flex items-center">
              {filteredCaregivers.length} Caregivers Available
            </span>
          </div>
        </div>

        {/* Filter Card Container */}
        <div className={`p-6 sm:p-8 rounded-[28px] transition-all bg-white border border-stone-200/80 shadow-xs space-y-6 ${
          sensoryMode ? "border-2 border-stone-800" : ""
        }`}>
          {/* Row 1: 4 Column inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Location (City or ZIP)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Chicago, 60611, Oak Brook..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#3B6256]"
              />
            </div>

            {/* 2. Distance Radius */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">Distance Radius</label>
                <span className="text-xs font-bold text-[#2A4B42]">{distanceRadius} miles</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="w-full accent-[#3B6256] h-2 bg-stone-100 rounded-lg cursor-pointer mt-3"
              />
            </div>

            {/* 3. Gender Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Gender Preference</label>
              <select
                value={genderPref}
                onChange={(e) => setGenderPref(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#3B6256]"
              >
                <option value="Any">Any / No Preference</option>
                <option value="Female">Female Caregivers Only</option>
                <option value="Male">Male Caregivers Only</option>
              </select>
            </div>

            {/* 4. Virtual or In-Person */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Virtual or In-Person</label>
              <select
                value={modePref}
                onChange={(e) => setModePref(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#3B6256]"
              >
                <option value="Any">All Formats</option>
                <option value="In-Person">In-Person Only</option>
                <option value="Virtual">Virtual Support</option>
              </select>
            </div>
          </div>

          {/* Row 2: Child's Disability Experience Required */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2A4B42] block">
              Child's Disability Experience Required:
            </label>
            <div className="flex flex-wrap gap-2">
              {disabilityOptions.map((dis) => {
                const isSel = selectedDisabilities.includes(dis);
                return (
                  <button
                    key={dis}
                    type="button"
                    onClick={() => toggleFilter(selectedDisabilities, setSelectedDisabilities, dis)}
                    className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all ${
                      isSel
                        ? "bg-[#2F5A4F] text-white font-bold shadow-xs"
                        : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 font-medium"
                    }`}
                  >
                    {isSel && "✓ "}
                    {dis}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Care Needed */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2A4B42] block">
              Care Needed:
            </label>
            <div className="flex flex-wrap gap-2">
              {careNeededOptions.map((care) => {
                const isSel = selectedCareNeeded.includes(care);
                return (
                  <button
                    key={care}
                    type="button"
                    onClick={() => toggleFilter(selectedCareNeeded, setSelectedCareNeeded, care)}
                    className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all ${
                      isSel
                        ? "bg-[#2F5A4F] text-white font-bold shadow-xs"
                        : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 font-medium"
                    }`}
                  >
                    {isSel && "✓ "}
                    {care}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Languages & Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2A4B42] flex items-center gap-1">
                <span>文A</span>
                <span>Languages Spoken:</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => {
                  const isSel = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleFilter(selectedLanguages, setSelectedLanguages, lang)}
                      className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all ${
                        isSel
                          ? "bg-[#2F5A4F] text-white font-bold shadow-xs"
                          : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 font-medium"
                      }`}
                    >
                      {isSel && "✓ "}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Days */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2A4B42] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2A4B42]" />
                <span>Available Days:</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDays([])}
                  className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all ${
                    selectedDays.length === 0
                      ? "bg-[#2F5A4F] text-white font-bold shadow-xs"
                      : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 font-medium"
                  }`}
                >
                  Any
                </button>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                  const fullDay = day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : day === "Fri" ? "Friday" : day === "Sat" ? "Saturday" : "Sunday";
                  const isSel = selectedDays.includes(fullDay) || selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleFilter(selectedDays, setSelectedDays, fullDay)}
                      className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all ${
                        isSel
                          ? "bg-[#2F5A4F] text-white font-bold shadow-xs"
                          : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 font-medium"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAREGIVER CARDS GRID (Image 3 Style) */}
      <section className="space-y-4">
        {filteredCaregivers.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-[28px] p-12 text-center space-y-4 shadow-xs">
            <UserCheck className="w-12 h-12 text-stone-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-800">No Caregivers Match Your Filter Criteria</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Try widening your distance radius, removing specific language or care restrictions, or reset all filters.
              </p>
            </div>
            <button
              onClick={clearAllFilters}
              className="bg-[#2F5A4F] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#25483f] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaregivers.map((cg) => (
              <div
                key={cg.id}
                className={`bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  sensoryMode ? "border-2 border-stone-800" : ""
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top card header */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shadow-xs shrink-0 ${
                        cg.avatarInitials === "AM" ? "bg-[#00897B]" : cg.avatarInitials === "SM" ? "bg-[#DF5D15]" : cg.avatarInitials === "BH" ? "bg-[#1565C0]" : `bg-gradient-to-br ${cg.bgGradient}`
                      }`}
                    >
                      {cg.avatarInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-stone-900 text-base leading-tight truncate">
                        {cg.name}
                      </h3>

                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-amber-100 text-amber-900 font-bold text-[11px] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          ⭐ {cg.rating}
                        </span>
                        <span className="text-stone-500 text-xs">({cg.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-stone-500 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{cg.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rate & Experience Box */}
                  <div className="bg-stone-50 rounded-2xl p-3 flex items-center justify-between text-xs text-stone-600 font-medium border border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{cg.yearsExperience} yrs exp</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-stone-900 text-base">${cg.hourlyRateMin}</span>
                      <span className="text-stone-500 text-xs"> / hr</span>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-stone-600 leading-relaxed min-h-[48px] line-clamp-3">
                    {cg.shortBio}
                  </p>

                  {/* Badges List */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cg.badges.slice(0, 4).map((badge, idx) => (
                      <span
                        key={idx}
                        className="bg-[#E2F2EE] text-[#1E5C4D] border border-[#BDE0D7] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                      >
                        {badge}
                      </span>
                    ))}
                    {cg.badges.length > 4 && (
                      <span className="bg-stone-100 text-stone-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        +{cg.badges.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCaregiver(cg)}
                    className="bg-[#EEF4F2] hover:bg-[#e0ece8] text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs flex-1 text-center cursor-pointer border border-stone-200/50 transition-colors"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => setContactCaregiver(cg)}
                    className="bg-[#487365] hover:bg-[#3B5E53] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex-1 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. TRUST & SAFETY SECTION */}
      <section className={`rounded-3xl p-8 transition-all ${
        sensoryMode
          ? "bg-stone-100 border-2 border-stone-800 space-y-6"
          : "bg-gradient-to-br from-[#3A5D54]/10 via-[#5A8B7D]/5 to-amber-50/20 border border-[#5A8B7D]/30 space-y-6 shadow-sm"
      }`}>
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-[#3A5D54] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#5A8B7D]" />
            <span>Verification & Safety Framework</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            How We Build Trust & Security
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Every caregiver in the Sukoon network is screened against robust safety standards designed specifically for special needs families.
          </p>
        </div>

        {/* 5 Icons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Background Checks</h4>
            <p className="text-xs text-stone-500">Multistate criminal records & sex offender registry checks.</p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Identity Verification</h4>
            <p className="text-xs text-stone-500">Government ID validation and official credential verification.</p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Special Needs Exp.</h4>
            <p className="text-xs text-stone-500">Verified training in Autism, CPR, First Aid, and physical care.</p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Community Reviews</h4>
            <p className="text-xs text-stone-500">Ratings & feedback from verified Muslim special needs parents.</p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Mosque Reference</h4>
            <p className="text-xs text-stone-500">Optional endorsement from local Imams or masjid committees.</p>
          </div>
        </div>

        {/* Verbatim Disclaimer Banner */}
        <div className="bg-white/95 p-4 rounded-2xl border-l-4 border-l-[#5A8B7D] border-stone-200/80 text-xs text-stone-700 leading-relaxed font-medium">
          "Our goal is to help families connect with trustworthy caregivers. Sukoon encourages verification and transparency while families make the final decision."
        </div>
      </section>

      {/* 5. BECOME A CAREGIVER CTA */}
      <section className={`rounded-3xl p-8 sm:p-10 transition-all ${
        sensoryMode
          ? "bg-white border-2 border-stone-800 space-y-4"
          : "glass-card border border-stone-200/80 shadow-md space-y-4"
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#937217] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Our Caregiver Network</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900">
              Want to Make a Difference?
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Join our trusted caregiver network and help support Muslim families raising children with special needs.
            </p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-[#3A5D54] hover:bg-[#2b4740] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-amber-200" />
            <span>Apply as a Caregiver</span>
          </button>
        </div>
      </section>

      {/* 6. FOOTER CTA */}
      <section className={`rounded-3xl p-8 sm:p-10 text-center transition-all ${
        sensoryMode
          ? "bg-stone-100 border-2 border-stone-800 space-y-4"
          : "bg-gradient-to-br from-[#5A8B7D]/10 via-[#3A5D54]/10 to-stone-100 border border-[#5A8B7D]/30 space-y-4 shadow-sm"
      }`}>
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5A8B7D] text-white flex items-center justify-center mx-auto shadow-md">
            <Bot className="w-6 h-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Need help finding the right caregiver?
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            Our AI Assistant can help you choose caregivers based on your child's needs and answer questions about disability support within Muslim communities.
          </p>

          <div className="pt-2">
            <button
              onClick={handleAskAiAboutCaregivers}
              className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-200" />
              <span>Ask Sukoon AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* MODAL 1: VIEW DETAILED PROFILE MODAL */}
      {selectedCaregiver && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedCaregiver(null)}
              className="absolute right-5 top-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-stone-200/80">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedCaregiver.bgGradient} text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0`}>
                {selectedCaregiver.avatarInitials}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-stone-900">
                    {selectedCaregiver.name}
                  </h2>
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span className="text-sm font-bold">{selectedCaregiver.rating}</span>
                    <span className="text-xs text-amber-800">({selectedCaregiver.reviewCount} reviews)</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#3A5D54]">
                  {selectedCaregiver.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {selectedCaregiver.location}
                  </span>
                  <span>•</span>
                  <span>{selectedCaregiver.yearsExperience} Years Experience</span>
                  <span>•</span>
                  <span className="font-bold text-[#3A5D54]">
                    ${selectedCaregiver.hourlyRateMin} - ${selectedCaregiver.hourlyRateMax}/hr
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Row */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Certifications & Verified Badges
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCaregiver.badges.map((b, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-xl">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* About Me */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">About Me</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedCaregiver.aboutMe}
              </p>
            </div>

            {/* Experience & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Experience Details</h4>
                <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed">
                  {selectedCaregiver.experienceDetails}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Official Certifications</h4>
                <ul className="text-xs text-stone-600 space-y-1 list-disc pl-4">
                  {selectedCaregiver.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Supported Disabilities & Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Disabilities Supported</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCaregiver.disabilitiesSupported.map((d, i) => (
                    <span key={i} className="bg-[#3A5D54]/10 text-[#3A5D54] text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Languages Spoken</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCaregiver.languagesSpoken.map((l, i) => (
                    <span key={i} className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Calendar Grid */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5A8B7D]" />
                <span>Availability Calendar</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {selectedCaregiver.availabilityGrid.map((slot, i) => (
                  <div key={i} className="bg-stone-50 border border-stone-200/70 p-2.5 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-stone-800">{slot.day}</span>
                    <div className="space-y-0.5">
                      {slot.slots.map((s, j) => (
                        <div key={j} className="text-[11px] text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200/50">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Family Reviews ({selectedCaregiver.reviews.length})</span>
              </h3>
              <div className="space-y-3">
                {selectedCaregiver.reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{rev.reviewerName}</span>
                      <span className="text-[11px] text-stone-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Booking Modal Action Bar */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-stone-500 font-medium">Hourly Rate: </span>
                <span className="text-lg font-bold text-[#3A5D54]">
                  ${selectedCaregiver.hourlyRateMin} - ${selectedCaregiver.hourlyRateMax}/hr
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const cg = selectedCaregiver;
                    setSelectedCaregiver(null);
                    setContactCaregiver(cg);
                  }}
                  className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Contact Caregiver
                </button>

                <button
                  onClick={() => {
                    const cg = selectedCaregiver;
                    setSelectedCaregiver(null);
                    setShowBookingModal(cg);
                  }}
                  className="flex-1 sm:flex-none bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONTACT CAREGIVER MODAL */}
      {contactCaregiver && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setContactCaregiver(null)}
              className="absolute right-5 top-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">
                Contact {contactCaregiver.name}
              </h3>
              <p className="text-xs text-stone-500">
                Send a direct inquiry regarding caregiving for your child.
              </p>
            </div>

            {contactSent ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  {contactCaregiver.name} will be notified and reply shortly via email and Sukoon messaging.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={`Assalamu Alaikum ${contactCaregiver.name}, I would love to discuss caregiving support for my child...`}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  />
                </div>

                {contactCaregiver.phoneContact && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#5A8B7D]" />
                      Direct Phone:
                    </span>
                    <span className="font-bold text-[#3A5D54]">{contactCaregiver.phoneContact}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setContactCaregiver(null)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST BOOKING FORM MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowBookingModal(null)}
              className="absolute right-5 top-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">
                Request Booking with {showBookingModal.name}
              </h3>
              <p className="text-xs text-stone-500">
                Hourly Rate: ${showBookingModal.hourlyRateMin} - ${showBookingModal.hourlyRateMax}/hr
              </p>
            </div>

            {bookingSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Booking Request Submitted!</h4>
                <p className="text-xs text-emerald-700">
                  {showBookingModal.name} will review your request and confirm availability via phone/email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Time / Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2:00 PM - 6:00 PM"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Care Needed</label>
                  <select
                    value={bookingCareType}
                    onChange={(e) => setBookingCareType(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  >
                    {careNeededOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Child Notes & Special Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your child's needs, sensory triggers, dietary restrictions, or wudu/prayer routines..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(null)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: APPLY AS A CAREGIVER MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute right-5 top-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-stone-900">
                Apply as a Caregiver
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Join our trusted network supporting Muslim families raising special needs children.
              </p>
            </div>

            {applySubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Application Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for applying. Our team will review your qualifications and contact you within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendApply} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maryam Al-Hassan"
                    value={applyName}
                    onChange={(e) => setApplyName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={applyEmail}
                      onChange={(e) => setApplyEmail(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">City / ZIP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chicago, IL 60611"
                    value={applyLocation}
                    onChange={(e) => setApplyLocation(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Experience & Qualifications</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your special needs experience, certifications (CPR, RBT, OT, CNA), and languages spoken..."
                    value={applyBio}
                    onChange={(e) => setApplyBio(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A5D54] hover:bg-[#2b4740] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
