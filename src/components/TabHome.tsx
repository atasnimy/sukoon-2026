import React from "react";
import { 
  Heart, 
  Users, 
  BookOpenCheck, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ArrowRight,
  Sun,
  HandHeart,
  Smile
} from "lucide-react";

interface TabHomeProps {
  onNavigateTab: (tabIndex: number) => void;
  sensoryMode: boolean;
}

export const TabHome: React.FC<TabHomeProps> = ({ onNavigateTab, sensoryMode }) => {
  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${sensoryMode ? "max-w-4xl mx-auto" : ""}`}>
      {/* Minimalistic Hero Banner */}
      <section className={`rounded-[32px] p-8 sm:p-12 transition-all ${
        sensoryMode 
          ? "bg-[#FDFBF7] border-3 border-stone-800 text-stone-950 shadow-none space-y-6" 
          : "glass-panel shadow-xl shadow-stone-200/40 border border-white/80 space-y-5"
      }`}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs sm:text-sm font-semibold px-3.5 py-1 rounded-full border border-[#E9C46A]/40">
            <Sparkles className="w-4 h-4 text-[#937217]" />
            <span>Welcome to Sukoon • سُكُون</span>
          </div>

          <h1 className={`font-bold tracking-tight text-[#3A5D54] ${
            sensoryMode ? "text-3xl sm:text-4xl text-stone-950 leading-tight" : "text-3xl sm:text-4xl"
          }`}>
            A Peaceful Sanctuary for Special Needs Muslim Families
          </h1>

          <p className={`text-stone-600 ${
            sensoryMode ? "text-lg sm:text-xl text-stone-900 leading-loose" : "text-sm sm:text-base leading-relaxed max-w-3xl"
          }`}>
            Sukoon (Tranquility) bridges compassion, scholarly Islamic guidance, and peer connection for Muslim caregivers raising children with Autism, ADHD, Down Syndrome, non-verbal conditions, and sensory sensitivities.
          </p>
        </div>

        {/* Primary Call to Action buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab(1)}
            className={`font-semibold rounded-2xl flex items-center gap-2 transition-all ${
              sensoryMode
                ? "bg-[#3A5D54] text-white text-lg px-6 py-4 border-2 border-stone-900"
                : "bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs sm:text-sm px-5 py-3 shadow-md"
            }`}
          >
            <Users className="w-4 h-4 text-amber-200" />
            <span>Find Compatible Families</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab(4)}
            className={`font-semibold rounded-2xl flex items-center gap-2 transition-all ${
              sensoryMode
                ? "bg-stone-200 text-stone-950 text-lg px-6 py-4 border-2 border-stone-900"
                : "bg-white/80 hover:bg-white text-stone-800 text-xs sm:text-sm px-5 py-3 border border-stone-200 shadow-sm"
            }`}
          >
            <Bot className="w-4 h-4 text-[#5A8B7D]" />
            <span>Ask AI Scholar Companion</span>
          </button>
        </div>
      </section>

      {/* 4 Pillars Grid Navigation */}
      <div className="space-y-4">
        <h3 className={`font-bold text-stone-800 ${sensoryMode ? "text-2xl" : "text-xl"}`}>
          Explore the Sukoon Sanctuary
        </h3>

        <div className={`grid grid-cols-1 ${sensoryMode ? "gap-6" : "sm:grid-cols-2 lg:grid-cols-4 gap-4"}`}>
          {/* Pillar 1 */}
          <button
            onClick={() => onNavigateTab(1)}
            className={`text-left rounded-3xl p-5 transition-all flex flex-col justify-between ${
              sensoryMode
                ? "bg-white border-2 border-stone-800 space-y-3 p-6"
                : "glass-card border border-white/80 hover:border-[#5A8B7D] space-y-3 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#5A8B7D]/10 text-[#5A8B7D] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-stone-900 ${sensoryMode ? "text-xl" : "text-base"}`}>
                Family Matchmaker
              </h4>
              <p className={`text-stone-600 mt-1 ${sensoryMode ? "text-base leading-relaxed" : "text-xs"}`}>
                Find local families who attend your mosque and share similar child needs.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5A8B7D] flex items-center gap-1 pt-2">
              <span>View Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Pillar 2 */}
          <button
            onClick={() => onNavigateTab(2)}
            className={`text-left rounded-3xl p-5 transition-all flex flex-col justify-between ${
              sensoryMode
                ? "bg-white border-2 border-stone-800 space-y-3 p-6"
                : "glass-card border border-white/80 hover:border-[#5A8B7D] space-y-3 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#937217]/10 text-[#937217] flex items-center justify-center font-bold">
              <HandHeart className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-stone-900 ${sensoryMode ? "text-xl" : "text-base"}`}>
                Community Circles
              </h4>
              <p className={`text-stone-600 mt-1 ${sensoryMode ? "text-base leading-relaxed" : "text-xs"}`}>
                Join topic peer circles for Ramadan, sensory prayer, and advocacy.
              </p>
            </div>
            <span className="text-xs font-bold text-[#937217] flex items-center gap-1 pt-2">
              <span>Join Circles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Pillar 3 */}
          <button
            onClick={() => onNavigateTab(3)}
            className={`text-left rounded-3xl p-5 transition-all flex flex-col justify-between ${
              sensoryMode
                ? "bg-white border-2 border-stone-800 space-y-3 p-6"
                : "glass-card border border-white/80 hover:border-[#5A8B7D] space-y-3 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-stone-900 ${sensoryMode ? "text-xl" : "text-base"}`}>
                Masjid & Fiqh Guidance
              </h4>
              <p className={`text-stone-600 mt-1 ${sensoryMode ? "text-base leading-relaxed" : "text-xs"}`}>
                Authentic scholarly rulings on exemptions, sensory aids, and mosque etiquettes.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1 pt-2">
              <span>Read Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Pillar 4 */}
          <button
            onClick={() => onNavigateTab(4)}
            className={`text-left rounded-3xl p-5 transition-all flex flex-col justify-between ${
              sensoryMode
                ? "bg-white border-2 border-stone-800 space-y-3 p-6"
                : "glass-card border border-white/80 hover:border-[#5A8B7D] space-y-3 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3A5D54]/10 text-[#3A5D54] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-stone-900 ${sensoryMode ? "text-xl" : "text-base"}`}>
                AI Scholar Companion
              </h4>
              <p className={`text-stone-600 mt-1 ${sensoryMode ? "text-base leading-relaxed" : "text-xs"}`}>
                Ask questions about parental guilt, fasting exemptions, and child Salah accommodations.
              </p>
            </div>
            <span className="text-xs font-bold text-[#3A5D54] flex items-center gap-1 pt-2">
              <span>Ask Companion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Comfort Quranic Verse Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 text-center space-y-2 ${
        sensoryMode
          ? "bg-stone-200 border-2 border-stone-800 text-stone-900"
          : "bg-[#3A5D54] text-white shadow-lg"
      }`}>
        <p className={`font-serif italic ${sensoryMode ? "text-xl text-stone-950 font-bold" : "text-base sm:text-lg text-amber-100"}`}>
          "Allah does not burden a soul beyond that it can bear."
        </p>
        <p className={`text-xs ${sensoryMode ? "text-stone-800 font-semibold" : "text-emerald-100"}`}>
          Surah Al-Baqarah (2:286) • May Allah grant peace and strength to every caregiver. Aameen.
        </p>
      </div>
    </div>
  );
};
