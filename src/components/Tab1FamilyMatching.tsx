import React, { useState, useMemo } from "react";
import { 
  Users, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  SlidersHorizontal,
  Edit3
} from "lucide-react";
import { 
  FamilyProfile, 
  MatchedFamily, 
  AgeRange, 
  SupportNeed 
} from "../types";
import { sampleMatchedFamilies } from "../data/mockData";

interface Tab1Props {
  userProfile: FamilyProfile;
  onOpenConnectModal: (family: MatchedFamily) => void;
  onOpenProfileModal: () => void;
  sensoryMode: boolean;
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

export const Tab1FamilyMatching: React.FC<Tab1Props> = ({
  userProfile,
  onOpenConnectModal,
  onOpenProfileModal,
  sensoryMode
}) => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<string>("All");
  const [needFilter, setNeedFilter] = useState<string>("All");

  // Recalculate match scores based on userProfile
  const matchedFamilies = useMemo(() => {
    const recalculated = sampleMatchedFamilies.map((fam) => {
      let score = 65;
      const criteria: string[] = [];

      // Same mosque
      if (userProfile.nearbyMosque && fam.nearbyMosque.toLowerCase().includes(userProfile.nearbyMosque.toLowerCase())) {
        score += 20;
        criteria.push(`Attends ${fam.nearbyMosque}`);
      }

      // Age range match
      if (fam.childAge.includes(userProfile.childAge)) {
        score += 15;
        criteria.push(`Child in same age bracket (${userProfile.childAge})`);
      }

      // Shared support needs
      const sharedNeeds = fam.supportNeeds.filter((n) => userProfile.supportNeeds.includes(n));
      if (sharedNeeds.length > 0) {
        score += sharedNeeds.length * 10;
        criteria.push(`Shared needs: ${sharedNeeds.join(", ")}`);
      }

      // Shared interests
      const sharedInts = fam.interests.filter((i) => userProfile.interests.includes(i));
      if (sharedInts.length > 0) {
        score += sharedInts.length * 5;
        criteria.push(`Matches ${sharedInts.length} shared interests`);
      }

      const finalScore = Math.min(Math.max(score, 65), 99);

      return {
        ...fam,
        matchScore: finalScore,
        matchingCriteria: criteria.length > 0 ? criteria : ["Shared support goals and community focus"]
      };
    });

    recalculated.sort((a, b) => b.matchScore - a.matchScore);
    return recalculated;
  }, [userProfile]);

  // Filtered families
  const filteredFamilies = useMemo(() => {
    return matchedFamilies.filter((fam) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        fam.familyTitle.toLowerCase().includes(q) ||
        fam.parentNames.toLowerCase().includes(q) ||
        fam.nearbyMosque.toLowerCase().includes(q) ||
        fam.bio.toLowerCase().includes(q);

      const matchesAge = ageFilter === "All" || fam.childAge.includes(ageFilter);
      const matchesNeed = needFilter === "All" || fam.supportNeeds.includes(needFilter as SupportNeed);

      return matchesSearch && matchesAge && matchesNeed;
    });
  }, [matchedFamilies, searchQuery, ageFilter, needFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro Hero banner */}
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9C46A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#937217]" />
            <span>Smart Compatible Family Matchmaker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A5D54] tracking-tight">
            Find Compatible Local Muslim Families
          </h2>
          <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${sensoryMode ? "leading-loose" : ""}`}>
            Connecting with families who share your child's age, sensory needs, and local mosque community.
          </p>
        </div>

        {/* Quick Profile Edit Launcher */}
        <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm shrink-0 space-y-2 max-w-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Active Match Criteria:
          </div>
          <div className="text-xs text-stone-700 font-medium">
            🕌 {userProfile.nearbyMosque} • Child {userProfile.childAge} yrs
          </div>
          <button
            onClick={onOpenProfileModal}
            className="w-full bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-200" />
            <span>Edit Match Criteria in Profile</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <section className="glass-panel rounded-[28px] p-4 sm:p-5 shadow-lg shadow-stone-200/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by family name, mosque, or keyword..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border-none bg-stone-100/70 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
            />
          </div>

          {/* Age Range Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              Age Range:
            </label>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="p-2.5 rounded-2xl border-none bg-stone-100/70 text-xs text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
            >
              <option value="All">All Ages</option>
              <option value="3-5">3-5 yrs</option>
              <option value="6-9">6-9 yrs</option>
              <option value="10-13">10-13 yrs</option>
              <option value="14+">14+ yrs</option>
            </select>
          </div>

          {/* Need Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              Support Need:
            </label>
            <select
              value={needFilter}
              onChange={(e) => setNeedFilter(e.target.value)}
              className="p-2.5 rounded-2xl border-none bg-stone-100/70 text-xs text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
            >
              <option value="All">All Diagnoses</option>
              {ALL_SUPPORT_NEEDS.map((need) => (
                <option key={need} value={need}>{need}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* MATCHES GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-800">
              Matched Profiles
            </h3>
            <span className="bg-white/80 text-[#5A8B7D] text-xs font-bold px-3 py-0.5 rounded-full border border-stone-200/80 shadow-2xs">
              {filteredFamilies.length} Available
            </span>
          </div>
        </div>

        {filteredFamilies.length === 0 ? (
          <div className="glass-panel p-8 rounded-[32px] text-center space-y-3">
            <Users className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className="text-base font-bold text-stone-700">No families match your active filter criteria</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try resetting your search query or selecting "All Ages" to view more local families.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setAgeFilter("All");
                setNeedFilter("All");
              }}
              className="mt-2 bg-[#5A8B7D] text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFamilies.map((fam) => (
              <div
                key={fam.id}
                className="glass-card rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header with match badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${fam.bgGradient} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                        {fam.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-stone-800">
                          {fam.familyTitle}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Parents: {fam.parentNames} • {fam.distance}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#E9C46A]/20 text-[#937217] text-xs font-bold px-3 py-1 rounded-full border border-[#E9C46A]/40 shrink-0">
                      {fam.matchScore}% Match
                    </div>
                  </div>

                  {/* Mosque & Age Info */}
                  <div className="bg-stone-100/50 rounded-2xl p-3 text-xs text-stone-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#5A8B7D]" />
                      <span>Attends: <strong>{fam.nearbyMosque}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#937217]" />
                      <span>Child: <strong>{fam.childAge}</strong></span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-600 leading-relaxed italic bg-white/60 p-3 rounded-2xl border border-white/80">
                    "{fam.bio}"
                  </p>

                  {/* Matching Criteria Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Shared Compatibility Factors:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fam.matchingCriteria.map((crit, idx) => (
                        <span
                          key={idx}
                          className="bg-[#5A8B7D]/10 text-[#3A5D54] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#5A8B7D]/20 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#5A8B7D] shrink-0" />
                          <span>{crit}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Prefers: <strong>{fam.preferredMode}</strong>
                  </span>
                  <button
                    onClick={() => onOpenConnectModal(fam)}
                    className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Connect / Send Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

